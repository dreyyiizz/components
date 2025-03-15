import { Router } from "express";
import { handleAddStudent, handleDeleteStudent, handleGetAllStudents, handleUpdateStudent } from "./components/students.controll";

const studentRouter = Router()

studentRouter.post("/", handleAddStudent)
studentRouter.get("/", handleGetAllStudents)
studentRouter.delete("/:id", handleDeleteStudent)
studentRouter.patch("/:id", handleUpdateStudent)

export default studentRouter;