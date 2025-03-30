import { pool } from "../../database";

export const addEmployee = async(name: string, role: string, salary: string) => { 
    const result = await pool.query( 
        "INSERT INTO employees (name, role, salary) VALUES ($1, $2, $3) RETURNING *;",
        [name, role, salary]
    ); 
    return result.rows[0];
}

export const getEmployee = async() => { 
    const result = await pool.query( 
        "SELECT * FROM employees"
    );
    return result.rows
}
