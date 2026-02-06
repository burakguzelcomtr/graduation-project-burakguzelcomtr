const generateId = require('./idGenerator')
const Student = require('./student')
const Teacher = require('./teacher')
const ClassGroupManager = require('./classGroupManager')
const LessonManager = require('./lessonManager')
const QuizManager = require('./quizManager')
const quizExamples = require('./quizExamples')
const LessonProgressManager = require('./lessonProgressManager')

const lessonManager = new LessonManager()
const quizManager = new QuizManager()
const classGroupManager = new ClassGroupManager()
const lessonProgressManager = new LessonProgressManager()
const classGroup3A = classGroupManager.createClassGroup(3, 'A')
const classGroup4B = classGroupManager.createClassGroup(4, 'B')
const Burak = new Student('Burak', 'Guzel', 3, 'A', generateId())
const WhoAmI = new Student('WhoAmI', 'Unknown', 3, 'A', generateId())
const MrX = new Teacher('Mr', 'X', 3, 'A', generateId())
const MrsY = new Teacher('Mrs', 'Y', 4, 'B')
const StudentZ = new Student('Student', 'Z', 4, 'B', generateId())

classGroupManager.addStudentToClassGroup(Burak, classGroup3A)
classGroupManager.addStudentToClassGroup(WhoAmI, classGroup3A)
classGroupManager.assignTeacherToClassGroup(MrX, classGroup3A)
classGroupManager.addStudentToClassGroup(StudentZ, classGroup4B)
classGroupManager.assignTeacherToClassGroup(MrsY, classGroup4B)

const mathLessonFor3rdGrade = lessonManager.createLesson(generateId(), 'Math Lesson', 3)
const mathLessonFor3rdGradeUnit1 = lessonManager.createUnit(generateId(), 'Unit 1: Basics of Math')
const mathLessonFor3rdGradeUnit2 = lessonManager.createUnit(generateId(), 'Unit 2: Advanced Math Concepts')
lessonManager.addUnitToLesson(mathLessonFor3rdGrade, mathLessonFor3rdGradeUnit1)
lessonManager.addUnitToLesson(mathLessonFor3rdGrade, mathLessonFor3rdGradeUnit2)

const algebraTopic = lessonManager.createLessonMaterial(generateId(), 'Algebra', 'topic', 'Introduction to Algebra')
const biologyTopic = lessonManager.createLessonMaterial(generateId(), 'Algebra 2', 'topic', 'Advanced Algebra Concepts')

const mathQuiz = lessonManager.createLessonMaterial(generateId(), 'Math Quiz', 'quiz', [])
lessonManager.addLessonMaterialToUnit(mathLessonFor3rdGradeUnit1, generateId(), algebraTopic, 0)
lessonManager.addLessonMaterialToUnit(mathLessonFor3rdGradeUnit1, generateId(), biologyTopic, 1)
lessonManager.addLessonMaterialToUnit(mathLessonFor3rdGradeUnit1, generateId(), mathQuiz, 2)

// Import example questions from separate file and add them to the quiz

quizExamples.forEach(q => quizManager.addQuestionToQuiz(mathQuiz, q))

/* console.log(classGroup3A.details)
console.log(classGroup4B.details)
console.log('Students of Mr. X:', classGroup3A.listStudentsByTeacher(MrX))

// get Lessons for 3rd grade
console.log(
  '3rd Grade Lessons:',
  lessonManager.getLessonsByGrade(3).map(lesson => [{ id: lesson.id, title: lesson.title }])
)
// console.log('Math Lesson Details:', JSON.stringify(mathLessonFor3rdGrade, null , 2))

console.log('Math Lesson Unit 1 Details:', mathLessonFor3rdGradeUnit1)
console.log('Math Lesson Unit 1 Items:', mathLessonFor3rdGradeUnit1.items) */
// Student tracking demo
const firstItem = mathLessonFor3rdGradeUnit1.items[0]
const secondItem = mathLessonFor3rdGradeUnit1.items[1]
const quizItem = mathLessonFor3rdGradeUnit1.items[2]

const progressTrackingSimulation = async () => {
  lessonProgressManager.startItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: firstItem.id,
    itemType: firstItem.type,
  })
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item

  lessonProgressManager.completeItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: firstItem.id,
  })

  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item

  lessonProgressManager.startItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: secondItem.id,
    itemType: secondItem.type,
  })

  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item

  lessonProgressManager.completeItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: secondItem.id,
  })

  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item

  lessonProgressManager.startItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: quizItem.id,
    itemType: quizItem.type,
  })

  /* 
  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item
  lessonProgressManager.completeItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: quizItem.id,
    score: 85,
  }) */

  console.log(
    `${Burak.name}'s Lesson Progress:`,
    JSON.stringify(lessonProgressManager.getLessonProgress({ lesson: mathLessonFor3rdGrade, student: Burak }), null, 2)
  )

  const burakProgress = lessonProgressManager.getLessonProgress({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
  })

  const calculateUnitProgress = (progress, unit) => {
    const total = unit.items.length
    const unitProgress = progress?.units?.find(u => u.unitId === unit.id)
    const completed = unitProgress ? unitProgress.items.filter(i => i.completedAt).length : 0
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { completed, total, percent }
  }

  const calculateLessonProgress = (progress, lesson) => {
    const total = lesson.units.length
    const completed = progress?.units ? progress.units.filter(unit => unit.completedAt).length : 0
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { completed, total, percent }
  }

  const unit1Summary = calculateUnitProgress(burakProgress, mathLessonFor3rdGradeUnit1)
  const lessonSummary = calculateLessonProgress(burakProgress, mathLessonFor3rdGrade)

  console.log(
    `Unit Progress: ${unit1Summary.percent}% (${unit1Summary.completed}/${unit1Summary.total}) | ` +
      `Lesson Progress: ${lessonSummary.percent}% (${lessonSummary.completed}/${lessonSummary.total})`
  )
}

progressTrackingSimulation()
