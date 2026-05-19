import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/complaints`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (!searchLocation) {
      fetchComplaints();
      return;
    }
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/complaints/search?location=${searchLocation}`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${API_URL}/api/complaints/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${API_URL}/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = filterCategory 
    ? complaints.filter(c => c.category === filterCategory)
    : complaints;

  return (
    <div>
      <div className="glass-container" style={{ marginBottom: '2rem' }}>
        <h2>Complaint Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem' }}>Search Location</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-control" 
                value={searchLocation} 
                onChange={(e) => setSearchLocation(e.target.value)} 
                placeholder="E.g., Ghaziabad" 
              />
              <button className="btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem' }}>Filter Category</label>
            <select 
              className="form-control" 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-layout">
        {filteredComplaints.map(complaint => (
          <div key={complaint._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>{complaint.title}</h3>
              <span className={`status-badge status-${complaint.status}`}>{complaint.status}</span>
            </div>
            <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
              <strong>Category:</strong> {complaint.category} | <strong>Location:</strong> {complaint.location}
            </p>
            <p style={{ marginBottom: '1rem' }}>{complaint.description}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
              By {complaint.name} ({complaint.email})
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select 
                className="form-control" 
                style={{ width: 'auto', padding: '0.5rem' }}
                value={complaint.status}
                onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button className="btn btn-danger" onClick={() => handleDelete(complaint._id)} style={{ padding: '0.5rem 1rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {filteredComplaints.length === 0 && (
          <p style={{ color: 'var(--text-light)' }}>No complaints found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
