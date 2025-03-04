import pool from "../../database";

export const addCar = async( model: string, brand: string, color: string, plate_number: string) => { 
    const result = await pool.query( 
        "INSERT INTO cars (model, brand, color, plate_number) VALUES ($1 ,$2, $3, $4)RETURNING *;", 
        [ model, brand, color, plate_number]
    );
    return result.rows[0];
}; 

export const getAllCar = async () => { 
    const result = await pool.query(
        "SELECT * FROM cars"
    ); 
    return result.rows
}