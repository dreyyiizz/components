import { Request, Response } from "express";
import { addEmployee, getEmployee } from "./employee.service";

export const handleAddEmployee = async ( req : Request, res : Response) => { 
    try{ 
        const { name, role, salary} = req.body; 
        const newEmployee = await addEmployee(name, role, salary); 
        res.status(201).json(newEmployee);
    }
    catch(error) { 
        console.error("Error!", error);
        res.status(500).json({error: "Failed to add employee"});
    }
};

export const handleGetEmployees = async ( req: Request, res : Response) => { 
    try{ 
        const employee = await getEmployee();
        res.status(200).json(employee)
    }
    catch(error) { 
        console.error("Error!", error)
        res.status(500).json({error: "Failed to get employee/s"})
    }
}