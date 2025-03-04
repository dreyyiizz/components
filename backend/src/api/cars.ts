import { Router } from "express";
import { handleAddCar, handleGetAllCars } from "./components/cars.controller";

const carRouter = Router()

carRouter.post("/", handleAddCar);
carRouter.get("/", handleGetAllCars);


export default carRouter;