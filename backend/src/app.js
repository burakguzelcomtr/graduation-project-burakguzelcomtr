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
require('./database-connection')

const indexRouter = require('./routes/index')
const studentsRouter = require('./routes/students')
const teachersRouter = require('./routes/teachers')
const lessonsRouter = require('./routes/lessons')
const unitsRouter = require('./routes/units')
const classGroupsRouter = require('./routes/class-groups')
const lessonMaterialsRouter = require('./routes/lesson-materials')

const app = express()
const connectionPromise = MongoStore.create({
  clientPromise: mongoose.connection.asPromise().then(() => mongoose.connection.getClient()),
  stringify: false,
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store: connectionPromise,
  })
)
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/students', studentsRouter)
app.use('/teachers', teachersRouter)
app.use('/lessons', lessonsRouter)
app.use('/units', unitsRouter)
app.use('/class-groups', classGroupsRouter)
app.use('/lesson-materials', lessonMaterialsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
