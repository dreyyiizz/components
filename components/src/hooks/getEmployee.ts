import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Employee } from "../types/datatypes";

const useGetEmployee = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch("http://localhost:4000/employee");

        if (!response.ok) {
          toast.error("Failed to fetch employees.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setEmployee(data);
        console.log(data)
      } catch (error) {
        toast.error("Error fetching employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  return { employee, loading };
};

export default useGetEmployee;
