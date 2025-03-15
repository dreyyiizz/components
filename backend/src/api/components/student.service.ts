import pool from "../../database";

export const addStudent = async (
  firstname: string, 
  lastname: string, 
  groupname: string,
  role: string, 
  expectedsalary: number, 
  expecteddateofdefense: string
) => {
  const results = await pool.query(
    `INSERT INTO students (firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    [firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense]
  );

  return results.rows[0];
};

export const getStudent = async () => {
  const results = await pool.query("SELECT * FROM students");
  return results.rows;
};

export const updateStudent = async (id: number, updates: Record<string, any>) => {
    const setClauses = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
  
    const values = Object.values(updates);
    values.push(id); 
  
    const results = await pool.query(
      `UPDATE students SET ${setClauses} WHERE id = $${values.length} RETURNING *;`,
      values
    );
  
    return results.rows[0];
  };

export const deleteStudent = async (id: number) => {
  const results = await pool.query(
    `DELETE FROM students WHERE id = $1 RETURNING *;`,
    [id]
  );

  return results.rows[0]; 
};
