import React, { useState } from 'react';
import { 
    Activity, Users, ShieldAlert, Database, Bell, 
    Droplet, Calendar, Search, Filter, MoreVertical, 
    CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight,
    User, ActivitySquare
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const bloodStockData = [
  { name: 'A+', stock: 120, low: false },
  { name: 'A-', stock: 25, low: true },
  { name: 'B+', stock: 150, low: false },
  { name: 'B-', stock: 15, low: true },
  { name: 'O+', stock: 200, low: false },
  { name: 'O-', stock: 10, low: true },
  { name: 'AB+', stock: 80, low: false },
  { name: 'AB-', stock: 5, low: true },
];

const donationTrends = [
  { month: 'Jan', donations: 400, usage: 380 },
  { month: 'Feb', donations: 450, usage: 420 },
  { month: 'Mar', donations: 300, usage: 480 },
  { month: 'Apr', donations: 500, usage: 400 },
  { month: 'May', donations: 550, usage: 520 },
  { month: 'Jun', donations: 600, usage: 550 },
];

const donorList = [
    { id: 'D001', name: 'Emily Chen', group: 'O-', lastDonation: '2023-10-15', location: 'Central City', status: 'Eligible' },
    { id: 'D002', name: 'James Wong', group: 'A+', lastDonation: '2024-01-20', location: 'North District', status: 'Ineligible' },
    { id: 'D003', name: 'Sarah Williams', group: 'B-', lastDonation: '2023-11-05', location: 'East Coast', status: 'Eligible' },
    { id: 'D004', name: 'Michael Brown', group: 'O+', lastDonation: '2024-03-10', location: 'Central City', status: 'Ineligible' },
];

const requestList = [
    { id: 'REQ-101', hospital: 'General Hospital', group: 'O-', quantity: 5, urgency: 'Critical', status: 'Pending' },
    { id: 'REQ-102', hospital: 'City Care Clinic', group: 'A+', quantity: 2, urgency: 'Normal', status: 'Approved' },
    { id: 'REQ-103', hospital: 'North Med Center', group: 'AB-', quantity: 1, urgency: 'High', status: 'Pending' },
    { id: 'REQ-104', hospital: 'East Side Health', group: 'B+', quantity: 4, urgency: 'Normal', status: 'Fulfilled' },
];

const AdminDashboard = () => {
    const [disasterMode, setDisasterMode] = useState(false);

    const handleDisasterMode = () => {
        if (!disasterMode) {
            Swal.fire({
                title: 'Declare Emergency?',
                text: "This activates Disaster Mode, prioritizing emergency routing and overriding standard protocols.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#C62828',
                cancelButtonColor: '#637381',
                confirmButtonText: 'Yes, Declare Emergency'
            }).then((result) => {
                if (result.isConfirmed) {
                    setDisasterMode(true);
                    document.body.classList.add('disaster-mode');
                    Swal.fire('Emergency Declared!', 'Network is in disaster mode.', 'error');
                }
            });
        } else {
            setDisasterMode(false);
            document.body.classList.remove('disaster-mode');
            Swal.fire({
                title: 'Emergency Stood Down',
                text: 'Network returned to standard operating procedures.',
                icon: 'success',
                confirmButtonColor: '#2E7D32',
                timer: 2000
            });
        }
    };

    const getStatusBadge = (status) => {
        const lower = status.toLowerCase();
        if (lower === 'critical' || lower === 'ineligible') return 'critical';
        if (lower === 'high' || lower === 'warning') return 'warning';
        if (lower === 'fulfilled' || lower === 'eligible' || lower === 'approved') return 'safe';
        return 'pending';
    };

    return (
        <div className={`dashboard admin-dashboard-wrapper ${disasterMode ? 'critical-state' : ''}`}>
            {/* Top Navbar */}
            <nav className="admin-top-nav">
                <div className="nav-brand">
                    <Droplet color="var(--color-primary)" fill="var(--color-primary)" size={28} />
                    <span>HopeDrop Admin</span>
                </div>
                <div className="nav-actions">
                    <button className="nav-btn">
                        <Search size={20} />
                    </button>
                    <button className="nav-btn">
                        <Bell size={20} />
                        <span className="notification-badge"></span>
                    </button>
                    <div style={{width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 8px'}}></div>
                    <button className="nav-btn" style={{gap: '8px', padding: '4px 12px', borderRadius: '20px'}}>
                        <User size={20} />
                        <span style={{fontSize: '14px', fontWeight: '500'}}>Super Admin</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="admin-content fade-in">
                <div className="dashboard-header">
                    <div>
                        <h1>Command Center</h1>
                        <p className="text-muted">Real-time overview of national blood inventory and requests.</p>
                    </div>
                    <div className="panel-actions">
                         <button className="btn btn-outline" style={{gap: '8px'}}>
                            <Calendar size={18} />
                            Generate Report
                        </button>
                        <button
                            className={`btn ${disasterMode ? 'btn-outline' : 'btn-danger-pulse'}`}
                            onClick={handleDisasterMode}
                            style={{gap: '8px'}}
                        >
                            <ShieldAlert size={18} />
                            {disasterMode ? 'Stand Down' : 'Emergency Mode'}
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-icon primary">
                            <Droplet size={24} />
                        </div>
                        <div className="kpi-details">
                            <div className="kpi-title">Total Blood Units</div>
                            <div className="kpi-value">
                                4,892 
                                <span className="kpi-trend up"><ArrowUpRight size={16}/> 12%</span>
                            </div>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-icon warning">
                            <Clock size={24} />
                        </div>
                        <div className="kpi-details">
                            <div className="kpi-title">Units Near Expiry</div>
                            <div className="kpi-value">
                                124 
                                <span className="kpi-trend down"><ArrowDownRight size={16}/> 3%</span>
                            </div>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-icon info">
                            <ActivitySquare size={24} />
                        </div>
                        <div className="kpi-details">
                            <div className="kpi-title">Pending Requests</div>
                            <div className="kpi-value">
                                38
                            </div>
                        </div>
                    </div>
                    <div className="kpi-card">
                        <div className="kpi-icon success">
                            <Users size={24} />
                        </div>
                        <div className="kpi-details">
                            <div className="kpi-title">Total Donors</div>
                            <div className="kpi-value">
                                12.4k
                                <span className="kpi-trend up"><ArrowUpRight size={16}/> 8%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="dashboard-grid">
                    
                    {/* Inventory Chart */}
                    <div className="dashboard-panel panel-col-8">
                        <div className="panel-header">
                            <h2 className="panel-title"><Database size={20} color="var(--color-primary)" /> Blood Inventory Overview</h2>
                            <select className="select-filter text-sm">
                                <option>All Locations</option>
                                <option>Central Bank</option>
                            </select>
                        </div>
                        <div className="panel-body">
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bloodStockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)'}} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'var(--color-secondary-light)'}} 
                                            contentStyle={{backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px'}}
                                        />
                                        <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                                            {bloodStockData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.low ? 'var(--color-critical)' : 'var(--color-primary)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="dashboard-panel panel-col-4">
                        <div className="panel-header">
                            <h2 className="panel-title"><Bell size={20} color="var(--color-warning)" /> Critical Alerts</h2>
                            <button className="btn-icon"><MoreVertical size={18}/></button>
                        </div>
                        <div className="panel-body" style={{padding: '0'}}>
                            <div className="activity-feed" style={{padding: 'var(--spacing-4)', gap: 'var(--spacing-5)'}}>
                                <div className="activity-item">
                                    <div className="activity-icon alert"><Droplet size={16}/></div>
                                    <div className="activity-content">
                                        <div className="activity-text"><strong>O- Blood</strong> stock is critically low.</div>
                                        <div className="activity-time">Just now • Central Bank</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon alert"><Activity size={16}/></div>
                                    <div className="activity-content">
                                        <div className="activity-text">Urgent request from <strong>General Hospital</strong></div>
                                        <div className="activity-time">15 mins ago • 5 Units O-</div>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon system"><Clock size={16}/></div>
                                    <div className="activity-content">
                                        <div className="activity-text">15 units of A+ expiring within 48 hours.</div>
                                        <div className="activity-time">2 hours ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="dashboard-panel panel-col-12">
                        <div className="panel-header">
                            <h2 className="panel-title"><Activity size={20} color="var(--color-primary)" /> Hospital Requests</h2>
                            <div className="filter-bar" style={{margin: 0}}>
                                <div className="search-input">
                                    <Search size={16} color="var(--color-text-muted)" />
                                    <input type="text" placeholder="Search requests..." />
                                </div>
                                <button className="btn btn-outline" style={{padding: '4px 12px', fontSize: '14px', gap: '6px'}}>
                                    <Filter size={16}/> Filter
                                </button>
                            </div>
                        </div>
                        <div className="panel-body" style={{padding: 0}}>
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Req ID</th>
                                            <th>Hospital</th>
                                            <th>Blood Group</th>
                                            <th>Quantity</th>
                                            <th>Urgency</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestList.map(req => (
                                            <tr key={req.id}>
                                                <td className="text-muted font-medium">{req.id}</td>
                                                <td><strong>{req.hospital}</strong></td>
                                                <td>
                                                    <span style={{color: 'var(--color-primary)', fontWeight: 'bold'}}>{req.group}</span>
                                                </td>
                                                <td>{req.quantity} Units</td>
                                                <td><span className={`status-badge ${getStatusBadge(req.urgency)}`}>{req.urgency}</span></td>
                                                <td><span className={`status-badge ${getStatusBadge(req.status)}`}>{req.status}</span></td>
                                                <td>
                                                    <div style={{display: 'flex', gap: '8px'}}>
                                                        <button className="btn-icon" title="Approve" style={{color: 'var(--color-success)'}}>
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button className="btn-icon" title="Reject" style={{color: 'var(--color-critical)'}}>
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Trends Chart */}
                    <div className="dashboard-panel panel-col-6">
                        <div className="panel-header">
                            <h2 className="panel-title"><ActivitySquare size={20} color="var(--color-primary)" /> Donation vs Usage Trends</h2>
                        </div>
                        <div className="panel-body">
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={donationTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)'}} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                        <RechartsTooltip contentStyle={{backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px'}}/>
                                        <Area type="monotone" dataKey="donations" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorDonations)" name="Donations" />
                                        <Area type="monotone" dataKey="usage" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorUsage)" name="Usage" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Donor Management */}
                    <div className="dashboard-panel panel-col-6">
                        <div className="panel-header">
                            <h2 className="panel-title"><Users size={20} color="var(--color-primary)" /> Donor Management</h2>
                            <button className="btn btn-outline" style={{padding: '4px 12px', fontSize: '14px', gap: '6px'}}>
                                View All
                            </button>
                        </div>
                        <div className="panel-body" style={{padding: 0}}>
                             <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Group</th>
                                            <th>Last Donation</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donorList.map(donor => (
                                            <tr key={donor.id}>
                                                <td>
                                                    <strong>{donor.name}</strong>
                                                    <div className="text-xs text-muted">{donor.location}</div>
                                                </td>
                                                <td><span style={{color: 'var(--color-primary)', fontWeight: 'bold'}}>{donor.group}</span></td>
                                                <td className="text-muted">{donor.lastDonation}</td>
                                                <td><span className={`status-badge ${getStatusBadge(donor.status)}`}>{donor.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
