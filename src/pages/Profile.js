import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/auth/profile', formData);
    login(data); // update localStorage + context
    alert('Profile updated successfully!');
  };

  return (
    <div className="page">
      <h2>My Profile</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
