import { useState, useRef, useEffect } from "react";
import { Student } from "../types/datatypes";
import useStudents from "../hooks/students/useStudent";

const StudentCard = ({ id, firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense, refreshStudents }: Student & { refreshStudents: () => void }) => {
    const { updateStudent, deleteStudent } = useStudents();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        firstname,
        lastname,
        groupname,
        role,
        expectedsalary: expectedsalary || "",
        expecteddateofdefense: expecteddateofdefense ? new Date(expecteddateofdefense).toISOString().split("T")[0] : ""
    });

    useEffect(() => {
        setFormData({
            firstname,
            lastname,
            groupname,
            role,
            expectedsalary: expectedsalary || "",
            expecteddateofdefense: expecteddateofdefense ? new Date(expecteddateofdefense).toISOString().split("T")[0] : ""
        });
    }, [firstname, lastname, groupname, role, expectedsalary, expecteddateofdefense]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "expectedsalary" ? Number(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return console.error("Error: Student ID is undefined");

        await updateStudent(id, { ...formData, expectedsalary: Number(formData.expectedsalary) || 0 });
        refreshStudents(); // 👈 Refresh list after update
        setShowModal(false);
    };

    const confirmDelete = async () => {
        if (!id) return console.error("Error: Student ID is undefined");

        await deleteStudent(id);
        refreshStudents(); // 👈 Refresh list after delete
        setShowDeleteConfirm(false);
    };

    return (
        <div className="w-full max-w-lg bg-gray-900 border-2 border-white rounded-lg p-6 text-white mt-4 shadow-md relative">
            <button className="absolute top-2 right-2 bg-blue-600 px-6 py-2 rounded text-sm cursor-pointer"
                onClick={() => setShowModal(true)}>
                Edit
            </button>

            <h1 className="text-lg font-semibold">Name: {lastname}, {firstname}</h1>
            <div className="mt-4 space-y-4">
                <h1 className="text-md">Group: {groupname}</h1>
                <h1 className="text-md">Role: {role}</h1>
                <h1 className="text-md">Expected Salary: ${expectedsalary}</h1>
                <h1>Expected Date of Defense: {expecteddateofdefense ? new Date(expecteddateofdefense).toISOString().split("T")[0] : "Not available"}</h1>
            </div>

            <button className="absolute bottom-2 right-2 bg-red-600 px-4 py-2 rounded text-sm cursor-pointer"
                onClick={() => setShowDeleteConfirm(true)}>
                Delete
            </button>

            {showModal && (
                <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div ref={modalRef} className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-black text-lg font-bold mb-4">Update Student</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="First Name" required />
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Last Name" required />
                            <input type="text" name="groupname" value={formData.groupname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Group Name" />
                            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Role" />
                            <input type="number" name="expectedsalary" value={formData.expectedsalary} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Expected Salary" />
                            <input type="date" name="expecteddateofdefense" value={formData.expecteddateofdefense} onChange={handleChange} className="w-full p-2 border rounded" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" className="bg-gray-700 text-white px-3 py-2 rounded cursor-pointer"
                                    onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                        <h2 className="text-black text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this student?</p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-gray-700 text-white px-3 py-2 rounded cursor-pointer"
                                onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button className="bg-red-600 text-white px-3 py-2 rounded cursor-pointer"
                                onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCard;

