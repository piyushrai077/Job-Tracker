import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import JobCard from '../components/JobCard';
import StatusChart from '../components/StatusChart';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);       // ⏳ NEW
  const [sortOrder, setSortOrder] = useState('newest'); // 🔽 NEW
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: '', role: '', status: 'Applied', applied_date: '', notes: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ company_name: '', role: '', status: 'Applied', applied_date: '', notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/applications/${editingId}`, formData);
      } else {
        await API.post('/applications', formData);
      }
      resetForm();
      fetchApplications();
    } catch (err) {
      console.error('Error saving application', err);
    }
  };

  const handleEditClick = (job) => {
    setFormData({
      company_name: job.company_name,
      role: job.role,
      status: job.status,
      applied_date: job.applied_date?.slice(0, 10) || '',
      notes: job.notes || ''
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error('Error deleting application', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      fetchApplications();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // 📊 Stats calculate karo
  const stats = {
    total: applications.length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  // Filter + Search + Sort
  const filteredApps = applications
    .filter(app => filter === 'All' || app.status === filter)
    .filter(app => app.company_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.applied_date);
      const dateB = new Date(b.applied_date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Job Application Tracker</h1>
        <div>
          <div className="avatar">{avatarLetter}</div>
          <span>Hi, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* 📊 Stats bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-interview">
          <span className="stat-number">{stats.interview}</span>
          <span className="stat-label">Interview</span>
        </div>
        <div className="stat-card stat-offer">
          <span className="stat-number">{stats.offer}</span>
          <span className="stat-label">Offer</span>
        </div>
        <div className="stat-card stat-rejected">
          <span className="stat-number">{stats.rejected}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>
            <StatusChart applications={applications} />


      <div className="dashboard-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        <input
          type="text"
          placeholder="Search by company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="add-btn"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="add-job-form">
          <input
            type="text" placeholder="Company Name" required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />
          <input
            type="text" placeholder="Role" required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <input
            type="date" required
            value={formData.applied_date}
            onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
          />
          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <button type="submit">
            {editingId ? 'Update Application' : 'Save Application'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner"></div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-text">No applications yet. Add your first one!</p>
        </div>
      ) : (
        <div className="job-grid">
          {filteredApps.map((job, i) => (
            <div key={job.id} className="job-card-wrap" style={{ animationDelay: `${i * 0.05}s` }}>
              <JobCard
                job={job}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;