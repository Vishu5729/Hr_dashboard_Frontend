// ✅ Employees.jsx – Figma Matching Design (Modified from Candidates Page)
import React, { use, useEffect, useState } from 'react';
import './Candidates.css';
import axios from 'axios';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [filterPosition, setFilterPosition] = useState('');
  const [search, setSearch] = useState('');
  const [token, setToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    dateOfJoining: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
    fetchEmployee()
  }, [])



  const fetchEmployee = async () => {
    try {
      const response = await axios.get("https://hr-dachboard-backend.onrender.com/api/employees", {
        
      });
      setEmployees(response.data);
      console.log("Fetched employees:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching candidates:", error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://hr-dachboard-backend.onrender.com/api/employees/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Employee deleted successfully!");
        setMenuIndex(null);
        fetchEmployee()
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://hr-dachboard-backend.onrender.com/api/employees/${selectedEmployee}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Employee updated successfully!");
        setShowModal(false);
        setSelectedEmployee(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          department: "",
          position: "",
          dateOfJoining: "",
        });
        fetchEmployee();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };


  const filteredEmployees = employees.filter((e) => {
    const matchesPosition = filterPosition ? e.position === filterPosition : true;
    const matchesSearch = search
      ? e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesPosition && matchesSearch;
  });

  console.log(filteredEmployees);


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB").replace(/\//g, "/");
  }

  const fetchEmployeeById = async (id) => {
    try {
      const response = await axios.get(`https://hr-dachboard-backend.onrender.com/api/employees/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Employee by ID:", response.data);
      setSelectedEmployee(id);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        department: response.data.department,
        position: response.data.position,
        dateOfJoining: response.data.dateOfJoining ? new Date(response.data.dateOfJoining).toISOString().split('T')[0] : ''
      });
      setShowModal(true);
      setMenuIndex(null);
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      alert("Failed to fetch employee details.");
    }
  };

  return (
    <div className="candidates-page">
      <div className="candidates-top-bar">
        <div className="filters">
          <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}>
            <option value="">Position</option>
            <option value="Intern">Intern</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Team Lead">Team Lead</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ height: '36px', borderRadius: '8px', border: '1px solid #ccc', padding: '0 12px' }}
        />
      </div>

      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Employee Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Position</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((e, i) => (
                <tr key={i}>
                  <td></td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.phone}</td>
                  <td>{e.position || 'N/A'}</td>
                  <td>{e.department || 'N/A'}</td>
                  <td>{formatDate(e.createdAt)}</td>
                  <td className="action-cell">
                    <div className="dots" onClick={() => setMenuIndex(menuIndex === i ? null : i)}>⋮</div>
                    {menuIndex === i && (
                      <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => fetchEmployeeById(e._id)}>Edit</div>
                        <div className="dropdown-item" onClick={() => handleDelete(e._id)}>Delete</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <span className="close-btn" onClick={() => {
                setShowModal(false);
                setSelectedEmployee(null);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  department: "",
                  position: "",
                  dateOfJoining: "",
                });
              }}>&times;</span>
            </div>
            <form onSubmit={handleEdit} className="modal-form">
              <div className="modal-row">
                <div className="form-group candidate-form">
                  <label>Full Name <span>*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group candidate-form">
                  <label>Email Address <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="modal-row">
                <div className="form-group candidate-form">
                  <label>Phone Number <span>*</span></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group candidate-form">
                  <label>Department <span>*</span></label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                </div>
              </div>

              <div className="modal-row">
                <div className="form-group candidate-form">
                  <label>Position <span>*</span></label>
                  <select className="select-opt"name="position" value={formData.position} onChange={handleChange} required>
                    <option value="">Select Position</option>
                    <option value="Intern">Intern</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Team Lead">Team Lead</option>
                  </select>
                </div>
                <div className="form-group candidate-form">
                  <label>Date of Joining <span>*</span></label>
                  <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-btn">Update Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;
