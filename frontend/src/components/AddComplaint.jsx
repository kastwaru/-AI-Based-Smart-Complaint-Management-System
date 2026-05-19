import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddComplaint() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!formData.title || !formData.description) {
      setError('Please provide a title and description for AI analysis.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/ai/analyze', {
        title: formData.title,
        description: formData.description
      });
      setAiAnalysis(res.data);
    } catch (err) {
      setError('Failed to get AI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/complaints', formData);
      setSuccess('Complaint stored successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    }
  };

  return (
    <div className="grid-layout">
      <div className="glass-container">
        <h2>Register Complaint</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}
        {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', padding: '0.75rem', background: '#d1fae5', borderRadius: '8px' }}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Complaint Title</label>
            <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Complaint Description</label>
            <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn" style={{ flex: 1 }}>Submit Complaint</button>
            <button type="button" className="btn" style={{ background: 'var(--secondary-color)', flex: 1 }} onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'AI Analysis'}
            </button>
          </div>
        </form>
      </div>

      {aiAnalysis && (
        <div className="card ai-card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🤖 AI Analysis Result
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Urgency/Priority:</strong> <span className={`status-badge ${aiAnalysis.priority === 'High' || aiAnalysis.priority === 'Critical' ? 'status-Pending' : 'status-Resolved'}`}>{aiAnalysis.priority}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Suggested Department:</strong> {aiAnalysis.department}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Summary:</strong> <p style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>{aiAnalysis.summary}</p>
          </div>
          <div>
            <strong>Auto-generated Response:</strong> <p style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', fontStyle: 'italic' }}>{aiAnalysis.autoResponse}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddComplaint;
