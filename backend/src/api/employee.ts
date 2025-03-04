import { Router } from "express";
import { handleAddEmployee, handleGetEmployees } from "./components/employee.controller";

const employeeRouter = Router(); 

employeeRouter.post("/", handleAddEmployee), 
employeeRouter.get("/", handleGetEmployees) 

export default employeeRouter;