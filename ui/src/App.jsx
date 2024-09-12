import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './index.css'; // Ensure this line is present to include your styles
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [data, setData] = useState([]);
  const [addBox, setAddBox] = useState(false);
  const [deleteBox, setDeleteBox] = useState(false);
  const [updateBox, setUpdateBox] = useState(false);
  const [getBox, setGetBox] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empSalary, setEmpSalary] = useState('');
  const [empId, setEmpId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  function fetchEmployee() {
    axios.get("http://localhost:8080/employee")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }
 
  function fetchEmployeeByID(){
    if (!empId.trim() || isNaN(empId)) {
      alert('Please enter a valid employee ID.');
      return;
    }
    axios.get(`http://localhost:8080/employee/${empId}`)
    .then(res=>{
      setData([res.data])
      setEmpId('')
      setGetBox(false)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchEmployee();
  }, []);

  function addEmployee() {
    if (empName.trim() === '' || isNaN(empSalary) || Number(empSalary) <= 0) {
      alert('Please enter valid employee name and salary.');
      return;
    }

    const newEmployee = {
      employeeName: empName,
      employeeSalary: Number(empSalary)
    };

    axios.post("http://localhost:8080/employee", newEmployee)
      .then(res => {
        fetchEmployee();
        setAddBox(false);
        setEmpName('');
        setEmpSalary('');
      })
      .catch(err => console.log(err));
  }

  function deleteEmployee() {
    if (!empId.trim() || isNaN(empId)) {
      alert('Please enter a valid employee ID.');
      return;
    }

    axios.delete(`http://localhost:8080/employee/${empId}`)
      .then(res => {
        fetchEmployee();
        setDeleteBox(false);
        setEmpId('');
      })
      .catch(err => console.log(err));
  }

  function openUpdateBox(employee) {
    setSelectedEmployee(employee);
    setEmpName(employee.employeeName);
    setEmpSalary(employee.employeeSalary);
    setUpdateBox(true);
  }

  function closeUpdateBox() {
    setUpdateBox(false);
    setEmpName('');
    setEmpSalary('');
    setSelectedEmployee(null);
  }

  function updateEmployee() {
    if (selectedEmployee) {
      const updatedEmployee = {
        ...selectedEmployee,
        employeeName: empName,
        employeeSalary: Number(empSalary),
      };

      axios.put(`http://localhost:8080/employee/${selectedEmployee.employeeId}`, updatedEmployee)
        .then(res => {
          fetchEmployee();
          setUpdateBox(false);
          setEmpName('');
          setEmpSalary('');
          setSelectedEmployee(null);
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <>
      <header className='header'>
        <h1>Employee Management System</h1>
      </header>
      <div className='controls'>
        <button onClick={()=> fetchEmployee()}>Home</button>
        <button onClick={()=> setGetBox(true)}>GET Employee</button>
        <button onClick={() => setAddBox(true)}>ADD Employee</button>
        <button onClick={() => setDeleteBox(true)}>DELETE Employee</button>
      </div>
      <div className='table-container'>
        {data.length > 0 ? (
          <table className='employee-table'>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Employee Salary</th>
              </tr>
            </thead>
            <tbody>
              {data.map(employee => (
                <tr onDoubleClick={() => openUpdateBox(employee)} key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.employeeName}</td>
                  <td>${employee.employeeSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Records available...</p>
        )}
      </div>
      {addBox && 
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='x-btn' onClick={() => setAddBox(false)}>&times;</span>
            <h2>Add Employee</h2>
            <div className='modal-input'>
              <input 
                type="text" 
                value={empName} 
                placeholder="Employee Name" 
                onChange={(e) => setEmpName(e.target.value)} 
                autoFocus
              />
              <input
                type="number"
                value={empSalary}
                placeholder="Employee Salary"
                onChange={(e) => setEmpSalary(e.target.value)}
              />
              <button onClick={addEmployee}>ADD</button>
            </div>
          </div>
        </div>
      }
      {getBox &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='x-btn' onClick={() => setGetBox(false)}>&times;</span>
            <h2>Get Employee</h2>
            <div className='modal-input'>
              <input 
                type="text" 
                value={empId} 
                placeholder="Employee ID" 
                onChange={(e) => setEmpId(e.target.value)} 
                autoFocus
              />
              <button onClick={fetchEmployeeByID}>FETCH</button>
            </div>
          </div>
        </div>
      }
      {deleteBox &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='x-btn' onClick={() => setDeleteBox(false)}>&times;</span>
            <h2>Delete Employee</h2>
            <div className='modal-input'>
              <input 
                type="text" 
                value={empId} 
                placeholder="Employee ID" 
                onChange={(e) => setEmpId(e.target.value)} 
                autoFocus
              />
              <button onClick={deleteEmployee}>DELETE</button>
            </div>
          </div>
        </div>
      }
      {updateBox &&
        <div className='modal-overlay'>
          <div className='modal-content'>
            <span className='x-btn' onClick={closeUpdateBox}>&times;</span>
            <h2>Update Employee</h2>
            <div className='modal-input'>
              <input 
                type="text" 
                value={empName} 
                placeholder="Employee Name" 
                onChange={(e) => setEmpName(e.target.value)} 
                autoFocus
              />
              <input
                type="number"
                value={empSalary}
                placeholder="Employee Salary"
                onChange={(e) => setEmpSalary(e.target.value)}
              />
              <button onClick={updateEmployee}>UPDATE</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default App;
