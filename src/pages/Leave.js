import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave.css';
import img from '../assets/Profile.png'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Leave = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [leaves, setLeaves] = useState([]); // State for leaves data
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    designation: '',
    leaveDate: '',
    reason: '',
    documentUrl: '',
    document: null // For file upload
  });

  // Fetch employees and leaves on component mount
  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://hr-dachboard-backend.onrender.com/api/employees");
      const presentEmployees = response.data.filter(emp => emp.status === 'Present');
      setEmployees(presentEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("https://hr-dachboard-backend.onrender.com/api/leaves");
      setLeaves(response.data.data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchApprovedLeaves = async () => {
    try {
      const response = await axios.get("https://hr-dachboard-backend.onrender.com/api/leaves/approved");
      const approvedLeaves = response.data.data.leaves;
      // Update state or handle the approved leaves as needed
    } catch (error) {
      console.error("Error fetching approved leaves:", error);
    }
  };

  // Function to handle status change
  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const response = await axios.put(`https://hr-dachboard-backend.onrender.com/api/leaves/${leaveId}`, {
        status: newStatus
      });

      if (response.data.success) {
        // Update the leaves state with the new status
        setLeaves(prevLeaves =>
          prevLeaves.map(leave =>
            leave._id === leaveId ? { ...leave, status: newStatus } : leave
          )
        );

        // If the leave is approved, update calendar to that date
        const updatedLeave = response.data.data;
        if (newStatus === 'Approved') {
          setCurrentDate(new Date(updatedLeave.leaveDate));
        }

        alert('Status updated successfully');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  // Filter leaves based on selected status
  const filteredLeaves = leaves.filter(leave => {
    const leaveStatus = (leave.status || 'Pending').toLowerCase();
    return selectedStatus === '' || leaveStatus === selectedStatus.toLowerCase();
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp._id === value);
      if (selectedEmployee) {
        setSelectedPosition(selectedEmployee.position);
        setFormData({
          ...formData,
          employeeId: value,
          employeeName: selectedEmployee.name,
          designation: selectedEmployee.position
        });
      } else {
        setSelectedPosition('');
        setFormData({
          ...formData,
          employeeId: '',
          employeeName: '',
          designation: ''
        });
      }
    } else if (name === 'document') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          document: file
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Function to check if a date has any approved leaves
  const getLeavesForDate = (date) => {
    return leaves.filter(leave => {
      const leaveDate = new Date(leave.leaveDate);
      return (
        leaveDate.getDate() === date.getDate() &&
        leaveDate.getMonth() === date.getMonth() &&
        leaveDate.getFullYear() === date.getFullYear() &&
        (leave.status || 'Pending').toLowerCase() === 'approved' // Only show approved leaves
      );
    });
  };

  // Function to customize calendar tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const approvedLeaves = getLeavesForDate(date);
      if (approvedLeaves.length > 0) {
        return (
          <div className="leave-indicator">
            <span className="leave-count">{approvedLeaves.length}</span>
          </div>
        );
      }
    }
    return null;
  };

  // Function to customize calendar tile class
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const approvedLeaves = getLeavesForDate(date);
      const classes = [];
      
      if (approvedLeaves.length > 0) {
        classes.push('has-leave');
      }
      
      return classes.join(' ');
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('employeeId', formData.employeeId);
      formDataToSend.append('employeeName', formData.employeeName);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('leaveDate', formData.leaveDate);
      formDataToSend.append('reason', formData.reason);
      if (formData.document) {
        formDataToSend.append('document', formData.document);
      }

      const response = await axios.post(
        "https://hr-dachboard-backend.onrender.com/api/leaves/", 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Add the new leave to the leaves state
        setLeaves(prevLeaves => [...prevLeaves, response.data.data]);
        
        // Only update calendar date if the leave is approved
        if (response.data.data.status === 'Approved') {
          setCurrentDate(new Date(formData.leaveDate));
        }
        
        alert("Leave request submitted successfully!");
        setShowModal(false);
        setSelectedPosition('');
        setFormData({
          employeeId: '',
          employeeName: '',
          designation: '',
          leaveDate: '',
          reason: '',
          document: null,
          documentUrl: ''
        });
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert(error.response?.data?.message || "Failed to submit leave request");
    }
  };

  return (
    <div className="candidates-page">
    <div className="candidates-top-bar">
      <div className="filters">
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-leave-btn" onClick={() => setShowModal(true)}>
          Add Leave
        </button>
      </div>

      <div className="leaves-content">
        {/* Left Section - Applied Leaves */}
        <div className="applied-leaves">
          <h2>Applied Leaves</h2>
          <div className="table-header">
            <div>Profile</div> 
            <div>Name</div>
            <div>Date</div>
            <div>Reason</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          <div className="table-body">
            {filteredLeaves.map(leave => (
              <div key={leave._id} className="table-row">
                <div>
                  <img 
                    src={img}
                    alt={leave.employeeName} 
                    className="profile-pic" 
                  />
                </div>
                <div className="name-cell">
                  <div className="name">{leave.employeeName}</div>
                  <div className="position">{leave.designation}</div>
                </div>
                <div>{new Date(leave.leaveDate).toLocaleDateString()}</div>
                <div>{leave.reason}</div>
                <div>
                  <select
                    value={leave.status || 'Pending'}
                    onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                    className={`status-select ${(leave.status || 'pending').toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  {leave.documentUrl ? (
                    <a 
                      href={leave.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="docs-badge"
                    >
                      D
                    </a>
                  ) : (
                    <span className="docs-badge">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Calendar */}
        <div className="leave-calendar">
          <h2>Leave Calendar</h2>
          <Calendar
            value={currentDate}
            onChange={setCurrentDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="custom-calendar"
            formatShortWeekday={(locale, date) => 
              ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
            }
            navigationLabel={({ date }) => 
              `${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`
            }
            prevLabel="‹"
            nextLabel="›"
            showNeighboringMonth={true}
            showFixedNumberOfWeeks={true}
            selectRange={false}
          />

          <div className="approved-leaves">
            <h3>Approved Leaves</h3>
            {leaves
              .filter(leave => (leave.status || 'Pending').toLowerCase() === 'approved')
              .map(leave => (
                <div key={leave._id} className="approved-item">
                  <img 
                    src={img}
                    alt={leave.employeeName} 
                    className="profile-pic" 
                  />
                  <div className="approved-info">
                    <div className="approved-name">{leave.employeeName}</div>
                    <div className="approved-position">{leave.designation}</div>
                  </div>
                  <div className="approved-date">
                    {new Date(leave.leaveDate).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric'
                    }).replace(/\//g, '/')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Leave</h2>
              <button className="close-btn" onClick={() => {
                setShowModal(false);
                setSelectedPosition('');
                setFormData({
                  employeeId: '',
                  employeeName: '',
                  designation: '',
                  leaveDate: '',
                  reason: '',
                  documentUrl: '',
                  document: null
                });
              }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-row">
                <div className="form-group">
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="employee-select"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.position} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Designation*"
                    name="designation"
                    value={selectedPosition}
                    className="employee-input"
                    readOnly
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group ">
                  <input 
                    type="date" 
                    placeholder="Leave Date*"
                    name="leaveDate"
                    value={formData.leaveDate}
                    onChange={handleChange}
                    required
                    className='test'
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Reason*"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="document-group">
                <div className="document-upload">
                  <span>Documents</span>
                  <input 
                    type="file" 
                    id="documentUpload" 
                    name="document" 
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="documentUpload" className="upload-btn">
                    {formData.document ? (
                      <span className="file-name">{formData.document.name}</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="httpss://www.w3.org/2000/svg">
                        <path d="M7.5 10L10 7.5L12.5 10" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 7.5V14.1667" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.6673 14.1667V15.8333C16.6673 16.2754 16.4917 16.6993 16.1791 17.0118C15.8666 17.3244 15.4427 17.5 15.0007 17.5H5.00065C4.55862 17.5 4.13469 17.3244 3.82213 17.0118C3.50957 16.6993 3.33398 16.2754 3.33398 15.8333V14.1667" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="save-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Leave;
