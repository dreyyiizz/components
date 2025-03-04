import { Request, Response } from "express";
import { addCar, getAllCar } from "./cars.service";


export const handleAddCar = async ( req : Request, res : Response) => { 
    try{ 
        const { model, color, brand, plate_number} = req.body; 
        const newCar = await addCar(model, color, brand, plate_number); 
        res.status(201).json(newCar);
    }
    catch(error) { 
        console.error("Error!", error);
        res.status(500).json({error: "Failed to add car"});
    }
};

export const handleGetAllCars = async ( req: Request, res : Response) => { 
    try{ 
        const cars = await getAllCar();
        res.json(cars)
    }
    catch(error) { 
        console.error("Error!", error)
        res.status(500).json({error: "Failed to get cars"})
    }
}