require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo').default
const socketIo = require('socket.io')
require('./database-connection')

const passport = require('passport')
const Account = require('./models/account')
const LessonManager = require('./managers/lesson-manager')
const LessonMaterialManager = require('./managers/lesson-material-manager')

const indexRouter = require('./routes/index')
const studentsRouter = require('./routes/students')
const teachersRouter = require('./routes/teachers')
const accountsRouter = require('./routes/accounts')
const lessonsRouter = require('./routes/lessons')
const unitsRouter = require('./routes/units')
const lessonMaterialsRouter = require('./routes/lesson-materials')
const questionsRouter = require('./routes/questions')
const usersRouter = require('./routes/users')
const chatRouter = require('./routes/chat')

// use static authenticate method of model in LocalStrategy
passport.use(Account.createStrategy())

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
const connectionPromise = MongoStore.create({
  clientPromise: mongoose.connection.asPromise().then(() => mongoose.connection.getClient()),
  stringify: false,
})
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  store: connectionPromise,
})

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/students', studentsRouter)
app.use('/teachers', teachersRouter)
app.use('/accounts', accountsRouter)
app.use('/lessons', lessonsRouter)
app.use('/units', unitsRouter)
app.use('/lesson-materials', lessonMaterialsRouter)
app.use('/questions', questionsRouter)
app.use('/users', usersRouter)
app.use('/chat', chatRouter)
// catch 404 and forward to error handler
app.use(function notFoundHandler(req, res, next) {
  next(createError(404))
})

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.createSocketServer = function createSocketServer(server) {
  const io = socketIo(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  })

  app.set('io', io)

  io.engine.use(sessionMiddleware)
  io.engine.use(passport.initialize())
  io.engine.use(passport.session())

  console.log('socket.io server created')

  io.on('connection', async function onConnection(socket) {
    try {
      const account = socket.request.user

      if (!account) {
        socket.disconnect()
        return
      }

      await account.populate('user')
      const { user } = account

      if (!user) {
        socket.disconnect()
        return
      }

      const classroomKey =
        user.grade && user.section && user.campus ? `${user.grade}-${user.section}-${user.campus}` : null
      const teacherRoom = classroomKey ? `teacher-class:${classroomKey}` : null
      const studentName = [user.name, user.surname].filter(Boolean).join(' ')

      console.log('a user connected', socket.request.user?.id)

      if (user.role === 'teacher' && teacherRoom) {
        socket.join(teacherRoom)
      }

      socket.on('disconnect', function onDisconnect() {
        console.log('user disconnected')
      })

      socket.on('start unit', async function onStartUnit(unitId) {
        try {
          if (user.role !== 'student' || !teacherRoom) {
            return
          }

          const unit = await LessonManager.getUnitById(unitId)
          if (!unit) {
            return
          }

          io.to(teacherRoom).emit('student activity', {
            type: 'unit-started',
            studentName,
            targetTitle: unit.title,
          })
        } catch (error) {
          socket.emit('socket error', { message: error.message })
        }
      })

      socket.on('start material', async function onStartMaterial(materialId) {
        try {
          if (user.role !== 'student' || !teacherRoom) {
            return
          }

          const material = await LessonMaterialManager.getLessonMaterialById(materialId)
          if (!material) {
            return
          }

          io.to(teacherRoom).emit('student activity', {
            type: 'material-started',
            studentName,
            targetTitle: material.title,
          })
        } catch (error) {
          socket.emit('socket error', { message: error.message })
        }
      })
    } catch (error) {
      socket.disconnect()
    }
  })
}

module.exports = app
