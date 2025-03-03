import { Request, Response } from "express";
import { createPerson, getAllPersons, getPersonById, updatePerson, deletePerson } from "./persons.service";

export const handleCreatePerson = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, middlename, age, sex } = req.body;
    const newPerson = await createPerson(firstname, lastname, middlename, age, sex);
    res.status(201).json(newPerson);
  } catch (error) {
    console.error("Error creating person:", error);
    res.status(500).json({ error: "Failed to create person" });
  }
};

export const handleGetAllPersons = async (_req: Request, res: Response) => {
  try {
    const persons = await getAllPersons();
    res.json(persons);
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ error: "Failed to fetch persons" });
  }
};

export const handleGetPersonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const person = await getPersonById(parseInt(id));

    if (!person) {
      res.status(404).json({ error: "Person not found" });
    } else {
      res.json(person);
    }
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ error: "Failed to fetch person" });
  }
};

export const handleUpdatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, middlename, age, sex } = req.body;
    const currentPerson = await getPersonById(parseInt(id))
    const updatedPerson = await updatePerson(
      parseInt(id), 
      firstname ? firstname: currentPerson.firstname, 
      lastname ? lastname : currentPerson.lastname, 
      middlename ? middlename : currentPerson.middlename, 
      age ? age : currentPerson.age, 
      sex ? sex : currentPerson.sex
    );

    if (!updatedPerson) {
      res.status(404).json({ error: "Person not found" });
    } else {
      res.json(updatedPerson);
    }
  } catch (error) {
    console.error("Error updating person:", error);
    res.status(500).json({ error: "Failed to update person" });
  }
};

export const handleDeletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedPerson = await deletePerson(parseInt(id));

    if (!deletedPerson) {
      res.status(404).json({ error: "Person not found" });
    } else {
      res.json({ message: "Person deleted successfully", deletedPerson });
    }
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(500).json({ error: "Failed to delete person" });
  }
};
