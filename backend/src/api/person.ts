// src/routes/persons.routes.ts
import { Router } from "express";
import { handleCreatePerson, handleGetAllPersons, handleGetPersonById, handleUpdatePerson, handleDeletePerson } from "./components/persons.controller";
const router = Router();

router.post("/", handleCreatePerson);
router.get("/", handleGetAllPersons);
router.get("/:id", handleGetPersonById);
router.put("/:id", handleUpdatePerson);
router.delete("/:id", handleDeletePerson);

export default router;
