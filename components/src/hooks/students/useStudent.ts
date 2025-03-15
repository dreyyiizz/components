import { useState, useEffect } from "react";
import { Student } from "../../types/datatypes";

const API_URL = "http://localhost:4000/students"; 

const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setStudents(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const addStudent = async (student: Omit<Student, "id">) => {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...student,
                    expectedsalary: student.expectedsalary ?? 0, 
                    expecteddateofdefense: student.expecteddateofdefense ?? "",
                }),
            });

            const newStudent: Student = await response.json();
            setStudents((prev) => [...prev, newStudent]);
        } catch (err) {
            setError("Failed to add student");
        }
    };

    const updateStudent = async (id: number, updates: Partial<Student>) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...updates,
                    expectedsalary: updates.expectedsalary ?? 0, 
                    expecteddateofdefense: updates.expecteddateofdefense ?? "", 
                }),
            });

            if (!response.ok) throw new Error("Failed to update student");

            const updatedStudent = await response.json();
            setStudents((prev) =>
                prev.map((student) => (student.id === id ? { ...student, ...updatedStudent } : student))
            );
        } catch (err) {
            setError("Failed to update student");
        }
    };

    const deleteStudent = async (id: number) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setStudents((prev) => prev.filter((student) => student.id !== id));
        } catch (err) {
            setError("Failed to delete student");
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    return { students, loading, error, addStudent, updateStudent, deleteStudent, getStudents };
};

export default useStudents;
