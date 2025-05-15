import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Toaster from "../components/Toaster";
import EmployeeCard from "../components/EmployeeCard";
import { useEffect } from "react";
import useGetEmployee from "../hooks/getEmployee";
import { Employee } from "../types/datatypes";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { employee }= useGetEmployee();
  const navigate = useNavigate()

  const fetchEmployee = async() => { 
    const response = await fetch("http://localhost:4000/employee").then((res)=>{
      return res.json() 
    })
    console.log(response)
  }

  useEffect(()=> { 
      fetchEmployee()
  }, [])

  const green = count > 0 ? Math.min(count * 2.55, 255) : 0;
  const red = count < 0 ? Math.min(Math.abs(count) * 2.55, 255) : 0;
  const backgroundColor = `rgb(${red}, ${green}, 0)`;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    toast.success("Modal Opened!");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    toast.info("Modal Closed!");
  };

  const handleStudentListPage = () => { 
    navigate("/studentlist")
  }

  const handleTodoListPage = () => { 
    navigate("/todolist")
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <Toaster /> 

      <div className="flex flex-row gap-10">
        <Button onClick={() => setCount((prev) => (prev < 100 ? prev + 5 : prev))}>Increment!</Button>
        <Button onClick={() => setCount((prev) => (prev > -100 ? prev - 5 : prev))}>Decrement!</Button>
      </div>

      <div className="mt-10 p-4 rounded-md bg-black text-white transition-colors duration-500">
        <h1>Background Volume : {count}%</h1>
      </div>

      <div className="mt-12 flex flex-row gap-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={handleOpenModal}
        >
          See Employees!
        </button>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h1 className="justify-center items-center text-center text-lg">
              Employees : 
          </h1>

         <div className="w-full h-full overscroll-x-auto overflow-auto">
          {employee.map((employee: Employee) => <EmployeeCard
          key={employee.name}
          name={employee.name}
          salary={employee.salary}
          role={employee.role}
          />)}
         </div>
        </Modal>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={ handleStudentListPage }
        >
          See Students!
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          onClick={ handleTodoListPage }
        >
          See To Do List!
        </button>
      </div>
    </div>
  );
};

export default MainPage;
