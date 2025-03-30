import { Request, Response } from "express";
import { addStudent, getStudent, updateStudent, deleteStudent } from "./student.service";

export const handleAddStudent = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense } = req.body;
    
    if (!firstname || !lastname || !groupname || !role || !expectedsalary || !expecteddateofdefense) {
        res.status(400).json({ error: "Missing required fields" });
        return
    }

    const newStudent = await addStudent(firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense);
    res.status(201).json(newStudent);
    return 
    
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
    return 
  }
};

export const handleGetAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await getStudent();
    console.log("Students fetched from DB:", students); 
    res.json(students);
    
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


export const handleUpdateStudent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body; 
  
      if (!id) {
         res.status(400).json({ error: "Student ID is required" });
         return
      }
  
      if (Object.keys(updates).length === 0) {
         res.status(400).json({ error: "No fields provided for update" });
         return
      }
  
      const updatedStudent = await updateStudent(Number(id), updates);
  
      if (!updatedStudent) {
         res.status(404).json({ error: "Student not found" });
         return
      }
  
      res.status(200).json(updatedStudent);
      return 

    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ error: "Failed to update student" });
      return 
    }
  };

export const handleDeleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
       res.status(400).json({ error: "Student ID is required" });
       return
    }

    const deletedStudent = await deleteStudent(Number(id));

    if (!deletedStudent) {
       res.status(404).json({ error: "Student not found" });
       return
    }

    res.status(200).json({ message: "Student deleted successfully" });
    return 

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
    return 
  }
};
