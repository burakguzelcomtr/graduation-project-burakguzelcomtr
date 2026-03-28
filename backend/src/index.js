/* const generateId = require('./id-generator')
const Student = require('./student')
const Teacher = require('./teacher')
const ClassGroupManager = require('./class-group-manager')
const LessonManager = require('./lesson-manager')
const QuizManager = require('./quiz-manager')
const QuizProgressManager = require('./quiz-progress-manager')
const quizExamples = require('./quiz-examples')
const LessonProgressManager = require('./lesson-progress-manager')
const LessonMaterial = require('./lesson-material') */

/* const lessonManager = new LessonManager()
const quizManager = new QuizManager()
const quizProgressManager = new QuizProgressManager()
const classGroupManager = new ClassGroupManager()
const lessonProgressManager = new LessonProgressManager()
const classGroup3A = classGroupManager.createClassGroup({ grade: 3, section: 'A' })
const classGroup4B = classGroupManager.createClassGroup({ grade: 4, section: 'B' })
const Burak = new Student({ name: 'Burak', surname: 'Guzel', grade: 3, section: 'A', id: generateId() })
const WhoAmI = new Student({ name: 'WhoAmI', surname: 'Unknown', grade: 3, section: 'A', id: generateId() })
const MrX = new Teacher({ name: 'Mr', surname: 'X', grade: 3, section: 'A', id: generateId() })
const MrsY = new Teacher({ name: 'Mrs', surname: 'Y', grade: 4, section: 'B' })
const StudentZ = new Student({ name: 'Student', surname: 'Z', grade: 4, section: 'B', id: generateId() })

classGroupManager.addStudentToClassGroup({ student: Burak, classGroup: classGroup3A })
classGroupManager.addStudentToClassGroup({ student: WhoAmI, classGroup: classGroup3A })
classGroupManager.assignTeacherToClassGroup({ teacher: MrX, classGroup: classGroup3A })
classGroupManager.addStudentToClassGroup({ student: StudentZ, classGroup: classGroup4B })
classGroupManager.assignTeacherToClassGroup({ teacher: MrsY, classGroup: classGroup4B })

const mathLessonFor3rdGrade = lessonManager.createLesson({ id: generateId(), title: 'Math Lesson', grade: 3 })
const testLessonFor3rdGrade = lessonManager.createLesson({ id: generateId(), title: 'Test Lesson', grade: 3 })
const mathLessonFor3rdGradeUnit1 = lessonManager.createUnit({ id: generateId(), title: 'Unit 1: Basics of Math' })
const mathLessonFor3rdGradeUnit2 = lessonManager.createUnit({ id: generateId(), title: 'Unit 2: Advanced Math Concepts' })
lessonManager.addUnitToLesson({ lesson: mathLessonFor3rdGrade, unit: mathLessonFor3rdGradeUnit1 })
lessonManager.addUnitToLesson({ lesson: mathLessonFor3rdGrade, unit: mathLessonFor3rdGradeUnit2 })

const algebraTopic = lessonManager.createLessonMaterial({
  id: generateId(),
  title: 'Algebra',
  type: 'topic',
  content: 'Introduction to Algebra',
})
const biologyTopic = lessonManager.createLessonMaterial({
  id: generateId(),
  title: 'Algebra 2',
  type: 'topic',
  content: 'Advanced Algebra Concepts',
})

const mathQuiz = lessonManager.createLessonMaterial({
  id: generateId(),
  title: 'Math Quiz',
  type: 'quiz',
  content: [],
  passingScorePercent: 65,
})
lessonManager.addLessonMaterialToUnit({
  unit: mathLessonFor3rdGradeUnit1,
  id: generateId(),
  lessonMaterialId: algebraTopic.id,
  order: 0,
})
lessonManager.addLessonMaterialToUnit({
  unit: mathLessonFor3rdGradeUnit1,
  id: generateId(),
  lessonMaterialId: biologyTopic.id,
  order: 1,
})
lessonManager.addLessonMaterialToUnit({
  unit: mathLessonFor3rdGradeUnit1,
  id: generateId(),
  lessonMaterialId: mathQuiz.id,
  order: 2,
})

// Import example questions from separate file and add them to the quiz

quizExamples.forEach(q => quizManager.addQuestionToQuiz({ quiz: mathQuiz, question: q }))
 */
/* console.log(classGroup3A.details)
console.log(classGroup4B.details)
console.log('Students of Mr. X:', classGroup3A.listStudentsByTeacher({ teacher: MrX }))

// get Lessons for 3rd grade
console.log(
  '3rd Grade Lessons:',
  lessonManager.getLessonsByGrade({ grade: 3 }).map(lesson => [{ id: lesson.id, title: lesson.title }])
)
// console.log('Math Lesson Details:', JSON.stringify(mathLessonFor3rdGrade, null , 2))

console.log('Math Lesson Unit 1 Details:', mathLessonFor3rdGradeUnit1)
console.log('Math Lesson Unit 1 Items:', mathLessonFor3rdGradeUnit1.items)  
 
  console.log(
  '3rd Grade Lessons:',
  lessonManager.getLessonsByGrade({ grade: 3 }).map(lesson => [{ id: lesson.id, title: lesson.title }])
) 
const firstItem = mathLessonFor3rdGradeUnit1.items[0]
const secondItem = mathLessonFor3rdGradeUnit1.items[1]
const quizItem = mathLessonFor3rdGradeUnit1.items[2]
const firstItemMaterial = LessonMaterial.getLessonMaterialById({ lessonMaterialId: firstItem.lessonMaterialId })
const secondItemMaterial = LessonMaterial.getLessonMaterialById({ lessonMaterialId: secondItem.lessonMaterialId })
const quizItemMaterial = LessonMaterial.getLessonMaterialById({ lessonMaterialId: quizItem.lessonMaterialId })
 */
const progressTrackingSimulation = async () => {
  lessonProgressManager.startItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: firstItem.id,
    itemType: firstItemMaterial.type,
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
    itemType: secondItemMaterial.type,
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
    itemType: quizItemMaterial.type,
  })

  const firstQuestion = mathQuiz.content[0]
  const secondQuestion = mathQuiz.content[1]
  const thirdQuestion = mathQuiz.content[2]

  const firstAnswerResult = quizProgressManager.answerQuizQuestion({
    quiz: mathQuiz,
    student: Burak,
    questionId: firstQuestion.id,
    answer: 'Mars',
  })

  const secondAnswerResult = quizProgressManager.answerQuizQuestion({
    quiz: mathQuiz,
    student: Burak,
    questionId: secondQuestion.id,
    answer: 'Truea',
  })

  const thirdAnswerResult = quizProgressManager.answerQuizQuestion({
    quiz: mathQuiz,
    student: Burak,
    questionId: thirdQuestion.id,
    answer: 'Atlantic',
  })

  const quizProgress = quizProgressManager.getQuizProgress({
    quizId: mathQuiz.id,
    studentId: Burak.id,
  })

  const answerResults = [firstAnswerResult, secondAnswerResult, thirdAnswerResult]
  const completedResult = answerResults.find(result => result.isComplete)
  if (completedResult && completedResult.passed) {
    lessonProgressManager.completeItem({
      lesson: mathLessonFor3rdGrade,
      student: Burak,
      unitId: mathLessonFor3rdGradeUnit1.id,
      itemId: quizItem.id,
      score: completedResult.score,
    })
  }

  console.log('Quiz Progress:', JSON.stringify(quizProgress.getQuizProgress(), null, 2))
  console.log('Quiz Status:', quizProgress.status)
  console.log('Quiz Passed:', quizProgress.passed)

  await new Promise(resolve => {
    setTimeout(resolve, 5000)
  }) // Simulate time taken to complete the item
  lessonProgressManager.completeItem({
    lesson: mathLessonFor3rdGrade,
    student: Burak,
    unitId: mathLessonFor3rdGradeUnit1.id,
    itemId: quizItem.id,
    score: 85,
  })

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

const axios = require('axios')

const BASE_URL = 'http://localhost:3000'

async function main() {
  const burak = await axios.post(`${BASE_URL}/students`, {
    studentId: 'S12345',
    campus: 'Main',
    name: 'Burak',
    surname: 'Guzel',
    grade: 3,
    section: 'A',
  })
  console.log('Created student:', burak.data)

  const whoami = await axios.post(`${BASE_URL}/students`, {
    name: 'WhoAmI',
    surname: 'Unknown',
    grade: 3,
    section: 'B',
  })
  console.log('Created student:', whoami.data)

  const allStudents = await axios.get(`${BASE_URL}/students`)
  console.log('All Students:', allStudents.data)

  const mrX = await axios.post(`${BASE_URL}/teachers`, {
    name: 'Mr',
    surname: 'X',
    grade: 3,
    section: 'A',
  })
  console.log('Created teacher:', mrX)

  const mrsY = await axios.post(`${BASE_URL}/teachers`, {
    name: 'Mrs',
    surname: 'Y',
    grade: 4,
    section: 'B',
  })
  console.log('Created teacher:', mrsY.data)

  const allTeachers = await axios.get(`${BASE_URL}/teachers`)
  console.log('All Teachers:', allTeachers.data)

  const unit1 = await axios.post(`${BASE_URL}/units`, {
    title: 'Unit 1: Basics of Math',
  })
  console.log('Created unit:', unit1.data)

  const unit2 = await axios.post(`${BASE_URL}/units`, {
    title: 'Unit 2: Advanced Math Concepts',
  })
  console.log('Created unit:', unit2.data)

  const allUnits = await axios.get(`${BASE_URL}/units`)
  console.log('All Units:', allUnits.data)

  const mathLesson = await axios.post(`${BASE_URL}/lessons`, {
    title: 'Math Lesson',
    grade: 3,
  })
  console.log('Created lesson:', mathLesson.data)

  const testLesson = await axios.post(`${BASE_URL}/lessons`, {
    title: 'Test Lesson',
    grade: 3,
  })
  console.log('Created lesson:', testLesson.data)

  const assignUnit1 = await axios.post(`${BASE_URL}/lessons/${mathLesson.data.id}/units`, {
    unitId: unit1.data.id,
  })
  console.log('Assigned unit1 to mathLesson:', assignUnit1.data)

  const assignUnit2 = await axios.post(`${BASE_URL}/lessons/${mathLesson.data.id}/units`, {
    unitId: unit2.data.id,
  })
  console.log('Assigned unit2 to mathLesson:', assignUnit2.data)

  const updatedLesson = await axios.get(`${BASE_URL}/lessons`)
  console.log('Updated Lessons with units:', updatedLesson.data)

  // create class group
  const classGroup3A = await axios.post(`${BASE_URL}/class-groups`, {
    grade: 3,
    section: 'A',
  })
  console.log('Created Class Group:', classGroup3A.data)
}

main().catch(err => console.error('Error:', err.response?.data ?? err.message))
