import { Employee } from '../types/datatypes';

const EmployeeCard = ({ 
    salary, 
    name, 
    role
}:Employee) => {

  return (
    <div className=' items-center justify-center text-left mt-4'>
        <div className='flex flex-col'>
            <div className='border-black border-2 p-4 rounded-md'>
                <div className='flex flex-row justify-between'>
                    <h1>
                        Employee Name : {name} 
                    </h1>

                    <h1 className='bg-green-500 text-white px-2 rounded-md'>
                        None
                    </h1>

                </div>
               
                <h1>
                    Role : {role}
                </h1>

                <h1>
                    Salary : {salary}
                </h1>
            </div>
        </div>
    </div>
  )
}

export default EmployeeCard;
