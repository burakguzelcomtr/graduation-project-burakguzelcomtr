/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const request = require('supertest')
const mongoose = require('mongoose')
const Lesson = require('../src/models/lesson')
const Question = require('../src/models/question')
const Unit = require('../src/models/unit')
const LessonMaterial = require('../src/models/lesson-material')
const LessonManager = require('../src/managers/lesson-manager')
const LessonMaterialManager = require('../src/managers/lesson-material-manager')

const app = require('../src/app')

describe('LearnPass', () => {
  beforeEach(async () => {
    await Lesson.deleteMany()
    await Question.deleteMany()
    await Unit.deleteMany()
    await LessonMaterial.deleteMany()
  })

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
    }
  })

  it('can create a lesson', async () => {
    const actualOutput = await LessonManager.createLesson({
      title: 'Geometry Lesson',
      description: 'Angles and shapes',
      order: 2,
    })

    expect(actualOutput).toMatchObject({
      title: 'Geometry Lesson',
      description: 'Angles and shapes',
      order: 2,
    })
  })

  it('rejects lesson creation when title is missing', async () => {
    await expect(LessonManager.createLesson({ description: 'Missing title' })).rejects.toMatchObject({
      message: 'Missing required fields',
      status: 400,
    })
  })

  it('returns 404 when lesson is not found', async () => {
    await expect(LessonManager.getLessonById(new mongoose.Types.ObjectId())).rejects.toMatchObject({
      message: 'Lesson not found',
      status: 404,
    })
  })

  it('can build a lesson response with units', async () => {
    const lesson = await Lesson.create({ title: 'Algebra Lesson' })
    const firstUnit = await Unit.create({ title: 'Variables', lesson: lesson._id, order: 1 })
    const secondUnit = await Unit.create({ title: 'Equations', lesson: lesson._id, order: 2 })

    const actualOutput = await LessonManager.getLessonWithUnits(lesson._id)

    expect(actualOutput).toMatchObject({
      _id: lesson._id,
      title: 'Algebra Lesson',
    })
    expect(actualOutput.units).toEqual([
      expect.objectContaining({ _id: firstUnit._id, title: 'Variables', order: 1 }),
      expect.objectContaining({ _id: secondUnit._id, title: 'Equations', order: 2 }),
    ])
  })

  it('can retrieve a list of lessons through the route', async () => {
    const firstLesson = await Lesson.create({ title: 'Math', order: 1 })
    const secondLesson = await Lesson.create({ title: 'Science', order: 2 })

    const actualOutput = await request(app).get('/lessons')

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toEqual([
      expect.objectContaining({ _id: firstLesson._id.toString(), title: 'Math', order: 1 }),
      expect.objectContaining({ _id: secondLesson._id.toString(), title: 'Science', order: 2 }),
    ])
  })

  it('can create a lesson through the route', async () => {
    const actualOutput = await request(app).post('/lessons').send({
      title: 'History',
      description: 'Ancient civilizations',
      order: 4,
    })

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      title: 'History',
      description: 'Ancient civilizations',
      order: 4,
    })
  })

  it('can retrieve a lesson by id through the route', async () => {
    const lesson = await Lesson.create({ title: 'Biology' })

    const actualOutput = await request(app).get(`/lessons/${lesson._id}`)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: lesson._id.toString(),
      title: 'Biology',
    })
  })

  it('can create a unit with lesson manager', async () => {
    const expectedOutput = {
      title: 'Fractions Unit',
      items: [],
    }

    const actualOutput = await LessonManager.createUnit({ title: 'Fractions Unit' })

    expect(actualOutput).toMatchObject(expectedOutput)

    expect(actualOutput._id).toBeDefined()
  })
  
  it('can retrieve a lesson with units through the route', async () => {
    const lesson = await Lesson.create({ title: 'Chemistry' })
    await Unit.create({ title: 'Atoms', lesson: lesson._id, order: 1 })

    const actualOutput = await request(app).get(`/lessons/${lesson._id}?withUnits=true`)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: lesson._id.toString(),
      title: 'Chemistry',
    })
    expect(actualOutput.body.units).toEqual([expect.objectContaining({ title: 'Atoms', order: 1 })])
  })

  it('can retrieve units through the route', async () => {
    const firstUnit = await Unit.create({ title: 'Warm Up', order: 1 })
    const secondUnit = await Unit.create({ title: 'Practice', order: 2 })

    const actualOutput = await request(app).get('/units')

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toEqual([
      expect.objectContaining({ _id: firstUnit._id.toString(), title: 'Warm Up', order: 1 }),
      expect.objectContaining({ _id: secondUnit._id.toString(), title: 'Practice', order: 2 }),
    ])
  })

  it('can create a unit through the route', async () => {
    const actualOutput = await request(app).post('/units').send({ title: 'Route Unit' })

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      title: 'Route Unit',
      items: [],
    })
    expect(actualOutput.body.id).toBeDefined()
  })

  it('can filter units by lesson through the route', async () => {
    const lesson = await Lesson.create({ title: 'Physics' })
    await Unit.create({ title: 'Ignored Unit' })
    const lessonUnit = await Unit.create({ title: 'Motion', lesson: lesson._id, order: 1 })

    const actualOutput = await request(app).get(`/units?lessonId=${lesson._id}`)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toEqual([
      expect.objectContaining({ _id: lessonUnit._id.toString(), title: 'Motion', order: 1 }),
    ])
  })

  it('can filter lessons by class group and type through the route', async () => {
    const mainLesson = await Lesson.create({ title: 'Main Lesson', type: 'main', classGroups: ['4-*-*'], order: 1 })

    await Lesson.create({ title: 'Premun Lesson', type: 'premun', classGroups: ['4-*-*'], order: 2 })
    await Lesson.create({ title: 'Other Class Lesson', type: 'main', classGroups: ['5-*-*'], order: 3 })
    await Unit.create({ title: 'Main Unit', lesson: mainLesson._id, order: 1 })

    const actualOutput = await request(app).get('/lessons').query({ classGroup: '4-A-Main Campus', type: 'main', withUnits: 'true' })

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toHaveLength(1)
    expect(actualOutput.body[0]).toMatchObject({
      _id: mainLesson._id.toString(),
      title: 'Main Lesson',
      type: 'main',
    })
    expect(actualOutput.body[0].units).toEqual([expect.objectContaining({ title: 'Main Unit', order: 1 })])
  })

  it('rejects unit creation when title is missing', async () => {
    await expect(LessonManager.createUnit({})).rejects.toMatchObject({
      message: 'Missing required fields',
      status: 400,
    })
  })

  it('can retrieve units by lesson with lesson manager', async () => {
    const lesson = await Lesson.create({ title: 'Math Lesson' })
    await Unit.create({ title: 'Unrelated Unit' })

    const firstUnit = await Unit.create({ title: 'First Math Unit', lesson: lesson._id, order: 1 })
    const secondUnit = await Unit.create({ title: 'Second Math Unit', lesson: lesson._id, order: 2 })

    const actualOutput = await LessonManager.getUnitsByLesson({ lessonId: lesson._id })

    expect(actualOutput).toEqual([
      expect.objectContaining({ _id: firstUnit._id, title: 'First Math Unit', order: 1 }),
      expect.objectContaining({ _id: secondUnit._id, title: 'Second Math Unit', order: 2 }),
    ])
  })

  it('can assign a unit to a lesson with lesson manager', async () => {
    const lesson = await Lesson.create({ title: 'Science Lesson' })
    const unit = await Unit.create({ title: 'Cells Unit' })

    const actualOutput = await LessonManager.assignUnitToLesson({ lessonId: lesson._id, unitId: unit._id })
    const updatedUnit = await Unit.findById(unit._id)

    expect(actualOutput).toMatchObject({
      _id: lesson._id,
      title: 'Science Lesson',
    })

    const assignedLessonId = updatedUnit.lesson._id ? updatedUnit.lesson._id.toString() : updatedUnit.lesson.toString()

    expect(updatedUnit._id.toString()).toBe(unit._id.toString())
    expect(updatedUnit.title).toBe('Cells Unit')
    expect(assignedLessonId).toBe(lesson._id.toString())
    expect(updatedUnit.order).toBe(1)
  })

  it('rejects assigning a missing unit to a lesson', async () => {
    const lesson = await Lesson.create({ title: 'Missing Unit Lesson' })

    await expect(
      LessonManager.assignUnitToLesson({ lessonId: lesson._id, unitId: new mongoose.Types.ObjectId() })
    ).rejects.toMatchObject({
      message: 'Unit not found',
      status: 404,
    })
  })

  it('rejects assigning a unit that already belongs to another lesson', async () => {
    const firstLesson = await Lesson.create({ title: 'First Lesson' })
    const secondLesson = await Lesson.create({ title: 'Second Lesson' })
    const unit = await Unit.create({ title: 'Shared Unit', lesson: firstLesson._id })

    await expect(
      LessonManager.assignUnitToLesson({ lessonId: secondLesson._id, unitId: unit._id })
    ).rejects.toMatchObject({
      message: 'Unit already assigned to this lesson',
      status: 400,
    })
  })

  it('can create a lesson material', async () => {
    const title = 'Introduction to Math'
    const type = 'topic'
    const content = 'Math represents parts of a whole.'

    const expectedOutput = {
      title,
      type,
      content,
      passingScorePercent: null,
    }

    const actualOutput = await request(app).post('/lesson-materials').send({ title, type, content })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.body._id).toBeDefined()
  })

  it('can update a lesson material', async () => {
    const lessonMaterial = await LessonMaterial.create({
      title: 'Original Topic',
      type: 'topic',
      content: 'Original content',
    })

    const actualOutput = await request(app).patch(`/lesson-materials/${lessonMaterial._id}`).send({
      title: 'Updated Topic',
      content: 'Updated content',
      order: 3,
    })

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: lessonMaterial._id.toString(),
      title: 'Updated Topic',
      content: 'Updated content',
      order: 3,
    })
  })

  it('can delete a lesson material', async () => {
    const lessonMaterial = await LessonMaterial.create({
      title: 'Test Topic',
      type: 'topic',
      content: 'Test content',
    })

    const actualOutput = await request(app).delete(`/lesson-materials/${lessonMaterial._id}`)
    const lessonMaterialAfterDelete = await LessonMaterial.findById(lessonMaterial._id)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: lessonMaterial._id.toString(),
      title: 'Test Topic',
      type: 'topic',
    })
    expect(lessonMaterialAfterDelete).toBeNull()
  })

  it('can retrieve a list of lesson materials', async () => {
    const firstMaterial = await request(app).post('/lesson-materials').send({
      title: 'Math Topic',
      type: 'topic',
      content: 'Math represents equal parts.',
    })

    const secondMaterial = await request(app).post('/lesson-materials').send({
      title: 'Math Quiz',
      type: 'quiz',
      content: 'Quiz content',
      passingScorePercent: 70,
    })

    const expectedOutput = [
      expect.objectContaining({ _id: firstMaterial.body._id, title: 'Math Topic', type: 'topic' }),
      expect.objectContaining({
        _id: secondMaterial.body._id,
        title: 'Math Quiz',
        type: 'quiz',
        passingScorePercent: 70,
      }),
    ]

    const actualOutput = await request(app).get('/lesson-materials')

    expect(actualOutput.body).toEqual(expect.arrayContaining(expectedOutput))
  })

  it('rejects lesson material creation with an invalid type', async () => {
    const expectedOutput = {
      error: 'Invalid lesson material type',
    }

    const actualOutput = await request(app).post('/lesson-materials').send({
      title: 'Broken Material',
      type: 'video',
      content: 'Unsupported type',
    })

    expect(actualOutput.body).toMatchObject(expectedOutput)

    expect(actualOutput.status).toBe(400)
  })

  it('can filter lesson materials by unit', async () => {
    const firstUnit = await Unit.create({ title: 'Unit 1' })
    const secondUnit = await Unit.create({ title: 'Unit 2' })

    const lessonMaterialInFirstUnit = await LessonMaterial.create({
      title: 'Unit 1 Topic',
      type: 'topic',
      content: 'Content for the first unit',
      unit: firstUnit._id,
    })

    await LessonMaterial.create({
      title: 'Unit 2 Topic',
      type: 'topic',
      content: 'Content for the second unit',
      unit: secondUnit._id,
    })

    const expectedOutput = [
      expect.objectContaining({
        _id: lessonMaterialInFirstUnit._id.toString(),
        title: 'Unit 1 Topic',
        type: 'topic',
      }),
    ]

    const actualOutput = await request(app).get(`/lesson-materials?unitId=${firstUnit._id}`)

    expect(actualOutput.body).toEqual(expectedOutput)

    expect(actualOutput.body).toHaveLength(1)
  })

  it('can assign a lesson material to a unit', async () => {
    const lesson = await Lesson.create({ title: 'Assignment Lesson' })
    const unit = await Unit.create({ title: 'Assignment Unit', lesson: lesson._id })
    const lessonMaterial = await LessonMaterial.create({
      title: 'Assigned Topic',
      type: 'topic',
      content: 'Assigned content',
    })

    const actualOutput = await LessonMaterialManager.assignLessonMaterialToUnit({
      lessonId: lesson._id,
      unitId: unit._id,
      lessonMaterialId: lessonMaterial._id,
      order: 2,
    })

    const updatedLessonMaterial = await LessonMaterial.findById(lessonMaterial._id)

    expect(actualOutput.items).toEqual([expect.objectContaining({ itemType: 'topic', order: 2 })])
    expect(updatedLessonMaterial.order).toBe(2)
    expect((updatedLessonMaterial.unit._id ?? updatedLessonMaterial.unit).toString()).toBe(unit._id.toString())
  })

  it('rejects assigning the same lesson material twice to a unit', async () => {
    const lessonId = new mongoose.Types.ObjectId()
    const unitId = new mongoose.Types.ObjectId()
    const lessonMaterialId = new mongoose.Types.ObjectId()
    const findOneSpy = jest.spyOn(Unit, 'findOne').mockResolvedValue({
      id: unitId.toString(),
      items: [{ item: lessonMaterialId.toString() }],
    })
    const getLessonByIdSpy = jest.spyOn(LessonManager, 'getLessonById').mockResolvedValue({ id: lessonId.toString() })
    const getLessonMaterialByIdSpy = jest.spyOn(LessonMaterialManager, 'getLessonMaterialById').mockResolvedValue({
      id: lessonMaterialId.toString(),
      type: 'topic',
    })

    await expect(
      LessonMaterialManager.assignLessonMaterialToUnit({
        lessonId,
        unitId,
        lessonMaterialId,
      })
    ).rejects.toMatchObject({
      message: 'Lesson material already assigned to this unit',
      status: 400,
    })

    findOneSpy.mockRestore()
    getLessonByIdSpy.mockRestore()
    getLessonMaterialByIdSpy.mockRestore()
  })

  it('rejects updating a lesson material with an invalid type', async () => {
    const lessonMaterial = await LessonMaterial.create({
      title: 'Invalid Update Topic',
      type: 'topic',
      content: 'Invalid update content',
    })

    await expect(
      LessonMaterialManager.updateLessonMaterial({
        lessonMaterialId: lessonMaterial._id,
        type: 'video',
      })
    ).rejects.toMatchObject({
      message: 'Invalid lesson material type',
      status: 400,
    })
  })

  it('returns 404 when lesson material is not found', async () => {
    await expect(LessonMaterialManager.getLessonMaterialById(new mongoose.Types.ObjectId())).rejects.toMatchObject({
      message: 'Lesson material not found',
      status: 404,
    })
  })
})
