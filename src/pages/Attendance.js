// ✅ Attendance.jsx – Styled Like Page
import React, { useEffect, useState } from 'react';
import './Candidates.css';
import axios from 'axios';

const Attendance = () => {
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("https://hr-server-backend.onrender.com/api/employees");
      setAttendanceData(response.data);
      console.log("Fetched Attendance:", response.data);
    } catch (error) {
      console.error("Error fetching employees:", error.response?.data?.message || error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`https://hr-server-backend.onrender.com/api/employees/attendance/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert(response.data.message);
        fetchAttendance();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const handleDelete = (id) => {
    setAttendanceData(attendanceData.filter((a) => a._id !== id));
  };

  const filteredAttendance = attendanceData.filter((a) => {
    const matchesStatus = filterStatus ? a.status === filterStatus : true;
    const matchesSearch = search
      ? a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.department.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="candidates-page">
      <div className="candidates-top-bar">
        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
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
                <th>Position</th>
                <th>Department</th>
                <th>Task</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((a, i) => (
                <tr key={i}>
                  <td></td> {/* Profile is intentionally empty */}
                  <td>{a.name}</td>
                  <td>{a.position || 'N/A'}</td>
                  <td>{a.department || 'N/A'}</td>
                  <td>Working on HR-Dashboard</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      className={`status-dropdown status-${a.status?.toLowerCase()}`}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                  <td className="action-cell">
                    <div className="dots" onClick={() => handleDelete(a._id)}>⋮</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
