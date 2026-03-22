/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const ClassGroup = require('../src/models/class-group')
const ClassGroupManager = require('../src/managers/class-group-manager')

const app = require('../src/app')

describe('User Routes', () => {
  beforeEach(async () => {
    await User.deleteMany()
    await ClassGroup.deleteMany()
  })

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
    }
  })

  const createClassGroupInput = (grade, section, campus) => {
    return {
      grade,
      section,
      campus,
    }
  }

  it('can create a class group', async () => {
    const classGroupInput = createClassGroupInput(5, 'A', 'North Campus')

    const expectedOutput = {
      grade: classGroupInput.grade,
      section: classGroupInput.section,
      campus: classGroupInput.campus,
    }

    const actualOutput = await request(app).post('/class-groups').send(classGroupInput)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject(expectedOutput)
    expect(actualOutput.body._id).toBeDefined()
  })

  it('can retrieve a list of class groups', async () => {
    const firstClassGroupInput = createClassGroupInput(5, 'A', 'North Campus')
    const secondClassGroupInput = createClassGroupInput(6, 'B', 'South Campus')

    const firstClassGroup = await request(app).post('/class-groups').send(firstClassGroupInput)

    const secondClassGroup = await request(app).post('/class-groups').send(secondClassGroupInput)

    expect(firstClassGroup.status).toBe(200)
    expect(secondClassGroup.status).toBe(200)

    const expectedOutput = [
      expect.objectContaining({
        _id: firstClassGroup.body._id,
        grade: firstClassGroupInput.grade,
        section: firstClassGroupInput.section,
        campus: firstClassGroupInput.campus,
      }),
      expect.objectContaining({
        _id: secondClassGroup.body._id,
        grade: secondClassGroupInput.grade,
        section: secondClassGroupInput.section,
        campus: secondClassGroupInput.campus,
      }),
    ]

    const actualOutput = await request(app).get('/class-groups')

    expect(actualOutput.body).toEqual(expect.arrayContaining(expectedOutput))
  })

  it('returns an error when creating a class group with missing fields', async () => {
    const actualOutput = await request(app).post('/class-groups').send({ grade: 5 })

    expect(actualOutput.status).toBe(500)
    expect(actualOutput.body).toMatchObject({ error: 'Missing required fields' })
  })

  it('can retrieve a class group by id', async () => {
    const classGroup = await ClassGroup.create({ grade: 10, section: 'A', campus: 'Test Campus' })

    const actualOutput = await request(app).get(`/class-groups/${classGroup._id}`)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: classGroup._id.toString(),
      grade: 10,
      section: 'A',
      campus: 'Test Campus',
    })
  })

  it('returns an error when class group is not found', async () => {
    const actualOutput = await request(app).get(`/class-groups/${new mongoose.Types.ObjectId()}`)

    expect(actualOutput.status).toBe(500)
    expect(actualOutput.body).toMatchObject({ error: 'Class group not found' })
  })

  it('can create a teacher', async () => {
    const classGroup = await ClassGroup.create({ grade: 7, section: 'C', campus: 'West Campus' })

    const expectedOutput = {
      name: 'Ayse',
      surname: 'Demir',
      grade: 7,
      section: 'C',
      campus: 'West Campus',
      role: 'teacher',
    }

    const actualOutput = await request(app).post('/teachers').send({
      name: 'Ayse',
      surname: 'Demir',
      grade: 7,
      section: 'C',
      campus: 'West Campus',
      classGroup: classGroup._id,
    })

    expect(actualOutput.body).toMatchObject(expectedOutput)
    expect(actualOutput.body._id).toBeDefined()
  })

  it('can retrieve a teacher by id', async () => {
    const classGroup = await ClassGroup.create({ grade: 8, section: 'A', campus: 'Central Campus' })

    const teacher = await request(app).post('/teachers').send({
      name: 'Test',
      surname: 'Kaya',
      grade: 8,
      section: 'A',
      campus: 'Central Campus',
      classGroup: classGroup._id,
    })

    const expectedOutput = {
      _id: teacher.body._id,
      name: 'Test',
      surname: 'Kaya',
      role: 'teacher',
    }

    const actualOutput = await request(app).get(`/teachers/${teacher.body._id}`)

    expect(actualOutput.body).toMatchObject(expectedOutput)
  })

  it('can retrieve a list of teachers', async () => {
    const firstClassGroup = await ClassGroup.create({ grade: 3, section: 'A', campus: 'Main Campus' })
    const secondClassGroup = await ClassGroup.create({ grade: 3, section: 'B', campus: 'South Campus' })

    await request(app).post('/teachers').send({
      name: 'Test',
      surname: 'User',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      classGroup: firstClassGroup._id,
    })

    await request(app).post('/teachers').send({
      name: 'Test',
      surname: 'User2',
      grade: 3,
      section: 'B',
      campus: 'South Campus',
      classGroup: secondClassGroup._id,
    })

    const actualOutput = await request(app).get('/teachers')

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Test', surname: 'User', role: 'teacher' }),
        expect.objectContaining({ name: 'Test', surname: 'User2', role: 'teacher' }),
      ])
    )
  })

  it('returns 404 when there are no teachers', async () => {
    const actualOutput = await request(app).get('/teachers')

    expect(actualOutput.status).toBe(404)
    expect(actualOutput.body).toMatchObject({ error: 'No teachers found' })
  })

  it('returns 404 when a teacher is not found', async () => {
    const actualOutput = await request(app).get(`/teachers/${new mongoose.Types.ObjectId()}`)

    expect(actualOutput.status).toBe(404)
    expect(actualOutput.body).toMatchObject({ error: 'Teacher not found' })
  }) 

  it('can retrieve a list of students', async () => {
    const classGroup = await ClassGroup.create({ grade: 3, section: 'A', campus: 'Main Campus' })

    await request(app).post('/students').send({
      name: 'Burak',
      surname: 'Guzel',
      studentId: '1234',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      classGroup: classGroup._id,
    })

    await request(app).post('/students').send({
      name: 'Who',
      surname: 'Am I',
      studentId: '4567',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      classGroup: classGroup._id,
    })

    const actualOutput = await request(app).get('/students')

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Burak', surname: 'Guzel', role: 'student' }),
        expect.objectContaining({ name: 'Who', surname: 'Am I', role: 'student' }),
      ])
    )
  })

  it('can retrieve a student by id', async () => {
    const classGroup = await ClassGroup.create({ grade: 3, section: 'A', campus: 'Main Campus' })

    const student = await request(app).post('/students').send({
      name: 'Burak',
      surname: 'Guzel',
      studentId: '1234',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      classGroup: classGroup._id,
    })

    const actualOutput = await request(app).get(`/students/${student.body._id}`)

    expect(actualOutput.status).toBe(200)
    expect(actualOutput.body).toMatchObject({
      _id: student.body._id,
      name: 'Burak',
      surname: 'Guzel',
      role: 'student',
    })
  })

  it('returns 404 when a student is not found', async () => {
    const actualOutput = await request(app).get(`/students/${new mongoose.Types.ObjectId()}`)

    expect(actualOutput.status).toBe(404)
    expect(actualOutput.body).toMatchObject({ error: 'Student not found' })
  })

  it('can retrieve students by class group', async () => {
    const firstClassGroup = await ClassGroup.create({ grade: 3, section: 'A', campus: 'Main Campus' })
    const secondClassGroup = await ClassGroup.create({ grade: 3, section: 'B', campus: 'Main Campus' })

    await request(app).post('/students').send({
      name: 'Who',
      surname: 'Am I',
      studentId: '4567',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      classGroup: firstClassGroup._id,
    })

    await request(app).post('/students').send({
      name: 'Burak',
      surname: 'Guzel',
      studentId: '1234',
      grade: 3,
      section: 'B',
      campus: 'Main Campus',
      classGroup: secondClassGroup._id,
    })

    const actualOutput = await request(app).get(`/students/class-group/${firstClassGroup._id}`)

    expect(actualOutput.body).toEqual([
      expect.objectContaining({
        name: 'Who',
        surname: 'Am I',
        studentId: '4567',
        role: 'student',
      }),
    ])
  })

  it('can delete a teacher', async () => {
    const classGroup = await ClassGroup.create({ grade: 4, section: 'B', campus: 'Main Campus' })

    const teacher = await request(app).post('/teachers').send({
      name: 'Test',
      surname: 'User',
      grade: 4,
      section: 'B',
      campus: 'Main Campus',
      classGroup: classGroup._id,
    })

    const actualOutput = await request(app).delete(`/teachers/${teacher.body._id}`)

    expect(actualOutput.body).toMatchObject({
      _id: teacher.body._id,
      name: 'Test',
      surname: 'User',
      role: 'teacher',
    })

    const deletedTeacher = await request(app).get(`/teachers/${teacher.body._id}`)

    expect(deletedTeacher.status).toBe(404)
    expect(deletedTeacher.body).toMatchObject({ error: 'Teacher not found' })
  })

  it('returns 404 when deleting a missing teacher', async () => {
    const actualOutput = await request(app).delete(`/teachers/${new mongoose.Types.ObjectId()}`)

    expect(actualOutput.status).toBe(404)
    expect(actualOutput.body).toMatchObject({ error: 'Teacher not found' })
  })

  it('can add a student to a class group with class group manager', async () => {
    const classGroup = await ClassGroup.create({ grade: 3, section: 'A', campus: 'Main Campus' })
    const student = await User.create({
      name: 'Test',
      surname: 'Student',
      studentId: '123',
      grade: 3,
      section: 'A',
      campus: 'Main Campus',
      role: 'student',
    })

    await ClassGroupManager.addStudentToClassGroup({ student, classGroup })

    const assignedStudentId = classGroup.students[0]._id
      ? classGroup.students[0]._id.toString()
      : classGroup.students[0].toString()

    expect(classGroup.students).toHaveLength(1)
    expect(assignedStudentId).toBe(student._id.toString())
  })

  it('rejects adding a mismatched student to a class group', async () => {
    const classGroup = await ClassGroup.create({ grade: 6, section: 'A', campus: 'Mismatch Campus' })
    const student = await User.create({
      name: 'Wrong',
      surname: 'Student',
      studentId: 'ST-5002',
      grade: 7,
      section: 'B',
      campus: 'Mismatch Campus',
      role: 'student',
    })

    await expect(ClassGroupManager.addStudentToClassGroup({ student, classGroup })).rejects.toThrow(
      'No matching classroom found'
    )
  })

  it('can assign a teacher to a class group with class group manager', async () => {
    const classGroup = await ClassGroup.create({ grade: 5, section: 'D', campus: 'Test Campus' })
    const teacher = await User.create({
      name: 'Manager',
      surname: 'Teacher',
      grade: 5,
      section: 'D',
      campus: 'Test Campus',
      role: 'teacher',
    })

    const updatedClassGroup = await ClassGroupManager.assignTeacherToClassGroup({ teacher, classGroup })

    expect((updatedClassGroup.teacher._id ?? updatedClassGroup.teacher).toString()).toBe(teacher._id.toString())
  })

  it('rejects assigning a mismatched teacher to a class group', async () => {
    const classGroup = await ClassGroup.create({ grade: 3, section: 'D', campus: 'Assign Mismatch Campus' })
    const teacher = await User.create({
      name: 'Mismatch',
      surname: 'Teacher',
      grade: 3,
      section: 'C',
      campus: 'Assign Mismatch Campus',
      role: 'teacher',
    })

    await expect(ClassGroupManager.assignTeacherToClassGroup({ teacher, classGroup })).rejects.toThrow(
      'No matching classroom found'
    )
  })
})
