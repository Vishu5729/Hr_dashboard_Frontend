import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="page">
      <h2>HR Dashboard</h2>
      <ul>
        <li><Link to="/candidates">Manage Candidates</Link></li>
        <li><Link to="/employees">Manage Employees</Link></li>
        <li><Link to="/attendance">Manage Attendance</Link></li>
        <li><Link to="/leaves">Manage Leaves</Link></li>
        <li><Link to="/profile">Profile Settings</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
