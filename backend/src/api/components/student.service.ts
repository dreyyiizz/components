import { getPool } from "../../database";

export const addStudent = async (
  firstname: string,
  lastname: string,
  groupname: string,
  role: string,
  expectedsalary: number,
  expecteddateofdefense: string
) => {
  const db = getPool();
  const results = await db.query(
    `INSERT INTO students (firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense]
  );

  return results.rows[0];
};

export const getStudent = async () => {
  const db = getPool();
  const results = await db.query("SELECT * FROM students");
  return results.rows;
};

export const getStudentByDetails = async (
  firstname: string,
  lastname: string,
  groupname: string
) => {
  const db = getPool()
  const results = await db.query(
    'SELECT * FROM students WHERE firstname = $1 AND lastname = $2 AND groupname = $3',
    [firstname, lastname, groupname]
  )

  return results.rows[0] // Returns the student if found, undefined if not.
}


export const updateStudent = async (id: number, updates: Record<string, any>) => {
  const db = getPool();
  const setClauses = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(updates);
  values.push(id);

  const results = await db.query(
    `UPDATE students SET ${setClauses} WHERE id = $${values.length} RETURNING *;`,
    values
  );

  return results.rows[0];
};

export const deleteStudent = async (id: number) => {
  const db = getPool();
  const results = await db.query(
    `DELETE FROM students WHERE id = $1 RETURNING *;`,
    [id]
  );

  return results.rows[0];
};
