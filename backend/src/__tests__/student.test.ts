import request from 'supertest'
import { test_pool } from '../database'
import app from '../server'
import { mockStudent1, studentData } from '../globals/fakeData'


describe('Student API Tests', () => {
  let studentId: number

  beforeAll(async () => {
    console.log('Clearing students table before tests...')
    await test_pool.query('TRUNCATE students RESTART IDENTITY CASCADE;') //comment out to see database state after tests if it did go into the database

    const res = await test_pool.query('SELECT COUNT(*) FROM students;')
    console.log(
      'Students count after truncate (before tests):',
      res.rows[0].count
    )
  })

  beforeEach(async () => {
    console.log('Resetting students table...')
    await test_pool.query('TRUNCATE students RESTART IDENTITY CASCADE;') //comment out to see database state after tests if it did go into the database

    console.log('Inserting test student...')
    await test_pool.query(`
    INSERT INTO students (firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense) 
    VALUES ('John', 'Doe', 'Team A', 'Leader', 50000, '2025-05-10');
  `)

    const res = await test_pool.query('SELECT COUNT(*) FROM students;')
    console.log(
      'Students count after insert (before each test):',
      res.rows[0].count
    )
  })

  afterAll(async () => {
    console.log('Closing database connection...')
    await test_pool.query('TRUNCATE students RESTART IDENTITY CASCADE;') //comment out to see database state after tests if it did go into the database

    await test_pool.end()
    console.log('Database connection closed.')
  })

  it('should create a new student', async () => {
    // Happy path: Create a new student successfully
    const res = await request(app).post('/students').send(mockStudent1)
    expect(res.status).toBe(201)
    expect(res.body.firstname).toBe(mockStudent1.firstname)
    expect(res.body.lastname).toBe(mockStudent1.lastname)
    studentId = res.body.id
  })

  it('should return 400 if required fields are missing', async () => {
    // Sad path: Missing required fields
    const res = await request(app).post('/students').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Missing required fields')
  })

  it('should retrieve all students', async () => {
    // Happy path: Retrieve all students successfully
    const res = await request(app).get('/students')
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('should return an empty list if no students exist', async () => {
    // Sad path: Retrieve students when none exist
    await test_pool.query('TRUNCATE students RESTART IDENTITY CASCADE;')

    const res = await request(app).get('/students')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(0)
  })

  it('should update a student’s role', async () => {
    // Happy path: Update a student's role successfully
    const res = await request(app).get('/students')
    const students = res.body
    expect(students.length).toBeGreaterThan(0)
    studentId = students[0].id

    const updateRes = await request(app)
      .patch(`/students/${studentId}`)
      .send({ role: 'Member' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.role).toBe('Member')
  })

  it('should return 400 if no update fields are provided', async () => {
    // Sad path: No update fields provided
    const res = await request(app).patch(`/students/${studentId}`).send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('No fields provided for update')
  })

  it('should return 404 if trying to update a non-existent student', async () => {
    // Sad path: Updating a non-existent student
    const res = await request(app)
      .patch('/students/999')
      .send({ role: 'Member' })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Student not found')
  })

  it('should delete a student', async () => {
    // Happy path: Delete a student successfully
    const res = await request(app).get('/students')
    const students = res.body
    expect(students.length).toBeGreaterThan(0)
    studentId = students[0].id

    const deleteRes = await request(app).delete(`/students/${studentId}`)
    expect(deleteRes.status).toBe(200)
    expect(deleteRes.body.message).toBe('Student deleted successfully')
  })

  it('should return 404 when trying to delete a non-existent student', async () => {
    // Sad path: Delete a non-existent student
    const res = await request(app).delete('/students/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Student not found')
  })

  it('should return 409 when trying to create a student with duplicate data', async () => {
    // Sad path: Create a student with conflicting data
    await request(app).post('/students').send(studentData) // Create student

    // Then try to create the same student again
    const res2 = await request(app).post('/students').send(studentData)
    expect(res2.status).toBe(409)
    expect(res2.body.error).toBe('Student with this information already exists')
  })
})
