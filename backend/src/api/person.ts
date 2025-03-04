import { Router } from "express";
import { handleCreatePerson, handleGetAllPersons, handleGetPersonById, handleUpdatePerson, handleDeletePerson } from "./components/persons.controller";
const personRouter = Router();

personRouter.post("/", handleCreatePerson);
personRouter.get("/", handleGetAllPersons);
personRouter.get("/:id", handleGetPersonById);
personRouter.put("/:id", handleUpdatePerson);
personRouter.delete("/:id", handleDeletePerson);

export default personRouter;
