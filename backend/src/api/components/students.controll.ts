import { Request, Response } from 'express'
import {
  addStudent,
  getStudent,
  getStudentByDetails,
  updateStudent,
  deleteStudent,
} from './student.service'

export const handleAddStudent = async (req: Request, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      groupname,
      role,
      expectedsalary,
      expecteddateofdefense,
    } = req.body

    // Check for required fields
    if (
      !firstname ||
      !lastname ||
      !groupname ||
      !role ||
      !expectedsalary ||
      !expecteddateofdefense
    ) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    // Validate data types
    if (typeof expectedsalary !== 'number') {
      res.status(422).json({
        error: 'Invalid data format: salary must be a number',
      })
      return
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(expecteddateofdefense)) {
      res.status(422).json({
        error:
          'Invalid data format: expected date of defense must be in YYYY-MM-DD format',
      })
      return
    }

    // Check for duplicate student
    const existingStudent = await getStudentByDetails(
      firstname,
      lastname,
      groupname
    )
    if (existingStudent) {
      res
        .status(409)
        .json({ error: 'Student with this information already exists' })
      return
    }

    const newStudent = await addStudent(
      firstname,
      lastname,
      groupname,
      role,
      expectedsalary,
      expecteddateofdefense
    )
    res.status(201).json(newStudent)
    return
  } catch (error) {
    console.error('Error adding student:', error)
    res.status(500).json({ error: 'Failed to add student' })
    return
  }
}

export const handleGetAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await getStudent()
    console.log('Students fetched from DB:', students)
    res.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    res.status(500).json({ error: 'Failed to fetch students' })
  }
}

export const handleUpdateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    if (!id) {
      res.status(400).json({ error: 'Student ID is required' })
      return
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No fields provided for update' })
      return
    }

    const updatedStudent = await updateStudent(Number(id), updates)

    if (!updatedStudent) {
      res.status(404).json({ error: 'Student not found' })
      return
    }

    res.status(200).json(updatedStudent)
    return
  } catch (error) {
    console.error('Error updating student:', error)
    res.status(500).json({ error: 'Failed to update student' })
    return
  }
}

export const handleDeleteStudent = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)

    // For user permission checking
    const authHeader = req.get('Authorization')
    if (authHeader && authHeader === 'Bearer guest-token') {
      res
        .status(403)
        .json({ error: 'Insufficient permissions to delete student' })
      return
    }

    const student = await deleteStudent(id)

    if (!student) {
      res.status(404).json({ error: 'Student not found' })
      return
    }

    res.status(200).json({ message: 'Student deleted successfully' })
    return
  } catch (error) {
    console.error('Error deleting student:', error)
    res.status(500).json({ error: 'Failed to delete student' })
    return
  }
}
