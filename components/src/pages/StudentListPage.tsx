import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentCard from "../components/StudentCard";
import useStudents from "../hooks/students/useStudent";
import { Student } from "../types/datatypes";

const StudentListPage = () => {
    const navigate = useNavigate();
    const { students, addStudent, getStudents } = useStudents();
    const [sortType, setSortType] = useState<string>("");
    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        groupname: "",
        role: "",
        expectedsalary: "",
        expecteddateofdefense: "",
    });

    useEffect(() => {
        getStudents(); 
    }, []);

    const handleBack = () => {
        navigate("/main");
    };

    const handleSort = (type: string) => {
        setSortType(type);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "expectedsalary" ? Number(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await addStudent({
            ...formData,
            expectedsalary: Number(formData.expectedsalary) || 0,
        });

        await getStudents();
        setShowAddModal(false);
        setFormData({ firstname: "", lastname: "", groupname: "", role: "", expectedsalary: "", expecteddateofdefense: "" });
    };

    const sortedStudents = [...students].sort((a: Student, b: Student) => {
        switch (sortType) {
            case "alphabetical":
                return (a.lastname?.toLowerCase() || "").localeCompare(b.lastname?.toLowerCase() || "");
            case "group":
                return (a.groupname?.toLowerCase() || "").localeCompare(b.groupname?.toLowerCase() || "");
            default:
                return 0;
        }
    });

    return (
        <div className="relative w-full h-screen bg-black overflow-auto">
            <div className="fixed top-0 left-0 w-full bg-gray-800 py-4 shadow-md z-20 flex justify-between items-center px-6">
                <button className="bg-white text-black px-3 py-2 rounded-md cursor-pointer" onClick={handleBack}>
                    Back
                </button>

                <div className="flex items-center space-x-4">
                    <h1 className="text-white text-2xl font-bold">Students</h1>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-2xl cursor-pointer" onClick={() => setShowAddModal(true)}>
                        +
                    </button>
                </div>

                <select
                    className="bg-white text-black px-3 py-2 rounded-md cursor-pointer outline-none border-none"
                    onChange={(e) => handleSort(e.target.value)}
                    value={sortType}
                >
                    <option value="" disabled>Sort By</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                    <option value="group">Group</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20 p-6">
                {sortedStudents.length > 0 ? (
                    sortedStudents.map((student: Student) => (
                        <StudentCard key={student.id} {...student} refreshStudents={getStudents} />
                    ))
                ) : (
                    <h2 className="text-white text-lg mt-10 col-span-full">No students found.</h2>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-black text-lg font-bold mb-4">Add Student</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="First Name" required />
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Last Name" required />
                            <input type="text" name="groupname" value={formData.groupname} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Group Name" />
                            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Role" />
                            <input type="number" name="expectedsalary" value={formData.expectedsalary} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Expected Salary" />
                            <input type="date" name="expecteddateofdefense" value={formData.expecteddateofdefense} onChange={handleChange} className="w-full p-2 border rounded" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" className="bg-gray-700 text-white px-3 py-2 rounded-md cursor-pointer" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-md cursor-pointer">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentListPage;
