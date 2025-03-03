import pool from "../../database";

export const createPerson = async (firstname: string, lastname: string, middlename: string, age: number, sex: string) => {
  const result = await pool.query(
    "INSERT INTO persons (firstname, lastname, middlename, age, sex) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
    [firstname, lastname, middlename, age, sex]
  );
  return result.rows[0];
};

export const getAllPersons = async () => {
  const result = await pool.query("SELECT * FROM persons;");
  return result.rows;
};

export const getPersonById = async (id: number) => {
  const result = await pool.query("SELECT * FROM persons WHERE id = $1;", [id]);
  return result.rows[0] || null;
};

export const updatePerson = async (id: number, firstname: string, lastname: string, middlename: string, age: number, sex: string) => {
  const result = await pool.query(
    "UPDATE persons SET firstname = $1, lastname = $2, middlename = $3, age = $4, sex = $5 WHERE id = $6 RETURNING *;",
    [firstname, lastname, middlename, age, sex, id]
  );
  return result.rows[0] || null;
};

export const deletePerson = async (id: number) => {
  const result = await pool.query("DELETE FROM persons WHERE id = $1 RETURNING *;", [id]);
  return result.rows[0] || null;
};
