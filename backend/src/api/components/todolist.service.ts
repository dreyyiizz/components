import { getPool } from "../../database"; 

export const addTask = async (title: string, description: string, duedate: string) => {
    const db = getPool();
    try {
      const results = await db.query(
        `INSERT INTO todolist (title, description, duedate, completed) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, title, description, duedate, completed`,
        [
          title,
          description || null,  
          duedate || null,      
          false
        ]
      );
      
      if (!results.rows[0]) {
        throw new Error('Failed to create task');
      }
      
      return results.rows[0];
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to create task in database");
    }
};


export const getTasks = async () => {
  const db = getPool();
  const results = await db.query("SELECT * FROM todolist");
  return results.rows;
};

export const updateTask = async (id: number, updates: Record<string, any>) => {
  const db = getPool();
  const setClauses = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(updates);
  values.push(id);

  const results = await db.query(
    `UPDATE todolist SET ${setClauses} WHERE id = $${values.length} RETURNING *;`,
    values
  );
  return results.rows[0];
};

export const deleteTask = async (id: number) => {
  const db = getPool();
  const results = await db.query(
    `DELETE FROM todolist WHERE id = $1 RETURNING *;`,
    [id]
  );
  return results.rows[0];
};
