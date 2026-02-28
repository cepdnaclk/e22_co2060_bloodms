import React, { useState } from 'react';
import { Activity, Users, Map, ShieldAlert, Database, Bell } from 'lucide-react';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [disasterMode, setDisasterMode] = useState(false);

    const handleDisasterMode = () => {
        if (!disasterMode) {
            Swal.fire({
                title: 'Declare Emergency?',
                text: "This will place the entire national network into Disaster Mode, prioritizing emergency routing and overriding standard FIFO protocols.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#C62828',
                cancelButtonColor: '#637381',
                confirmButtonText: 'Yes, Declare Emergency'
            }).then((result) => {
                if (result.isConfirmed) {
                    setDisasterMode(true);
                    document.body.classList.add('disaster-mode');
                    Swal.fire(
                        'Emergency Declared!',
                        'The national network is now in disaster mode.',
                        'error'
                    );
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

    return (
        <div className={`dashboard admin-dashboard fade-in ${disasterMode ? 'critical-state' : ''}`}>
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">National Authority Control Center</h1>
                    <p className="text-muted">System Analytics and Regional Overviews</p>
                </div>
                <div className="admin-actions">
                    <button className="btn btn-outline bg-white">
                        <Bell size={18} style={{ marginRight: '8px' }} />
                        System Alerts (3)
                    </button>
                    <button
                        className={`btn ${disasterMode ? 'btn-outline' : 'btn-danger-pulse'}`}
                        onClick={handleDisasterMode}
                    >
                        <ShieldAlert size={18} style={{ marginRight: '8px' }} />
                        {disasterMode ? 'Stand Down Emergency' : 'Declare Regional Emergency'}
                    </button>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* KPI Row */}
                <div className="col-span-12 stats-grid">
                    <div className="stat-box">
                        <Activity size={24} color="var(--color-primary)" />
                        <div className="stat-content">
                            <h3>24,892</h3>
                            <p>Total Active Units</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <Users size={24} color="var(--color-secondary)" />
                        <div className="stat-content">
                            <h3>1.2M</h3>
                            <p>Registered Donors</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <ShieldAlert size={24} color="var(--color-warning)" />
                        <div className="stat-content">
                            <h3>1.4%</h3>
                            <p>Wastage Rate (Last 30d)</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <Database size={24} color="var(--color-success)" />
                        <div className="stat-content">
                            <h3>99.98%</h3>
                            <p>System Uptime</p>
                        </div>
                    </div>
                </div>

                {/* Maps and Heatmaps placeholder */}
                <div className="col-span-8">
                    <div className="card">
                        <div className="card-header">
                            <h2>National Stock Heatmap</h2>
                            <select className="form-control" style={{ width: 'auto', padding: 'var(--spacing-1) var(--spacing-2)' }}>
                                <option>All Blood Types</option>
                                <option>O Negative Only</option>
                            </select>
                        </div>
                        <div className="card-body">
                            <div className="map-placeholder">
                                <Map size={48} color="var(--color-text-muted)" />
                                <p>Interactive Map Visualization rendered here via GeoJSON</p>
                                <div className="map-legend">
                                    <span className="legend-item"><span className="dot safe"></span> Safe (&gt;7 days)</span>
                                    <span className="legend-item"><span className="dot warning"></span> Low (3-7 days)</span>
                                    <span className="legend-item"><span className="dot critical"></span> Critical (&lt;2 days)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Network */}
                <div className="col-span-4">
                    <div className="card">
                        <div className="card-header">
                            <h2>Top Shortage Alerts</h2>
                        </div>
                        <div className="card-body p-0">
                            <div className="hospital-list p-4">
                                <div className="hospital-item">
                                    <div className="flex-between">
                                        <h4>Northern Regional Hosp.</h4>
                                        <span className="badge critical">O- Critical</span>
                                    </div>
                                    <p className="text-xs text-muted mb-2 mt-1">Estimated stock-out: 12 hours</p>
                                    <div className="progress-bar">
                                        <div className="progress-fill critical" style={{ width: '15%' }}></div>
                                    </div>
                                </div>

                                <div className="hospital-item">
                                    <div className="flex-between">
                                        <h4>East Coast Medical</h4>
                                        <span className="badge warning">AB- Low</span>
                                    </div>
                                    <p className="text-xs text-muted mb-2 mt-1">Estimated stock-out: 3 days</p>
                                    <div className="progress-bar">
                                        <div className="progress-fill warning" style={{ width: '35%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="col-span-12">
                    <div className="card">
                        <div className="card-header">
                            <h2>Network Management Console</h2>
                            <div className="btn-group">
                                <button className="btn btn-outline text-sm">Hospitals</button>
                                <button className="btn btn-primary text-sm">System Users</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Role</th>
                                            <th>Assigned Node</th>
                                            <th>Last Active</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Dr. Emily Chen</strong></td>
                                            <td>Medical Officer</td>
                                            <td>Central City Hospital</td>
                                            <td>2 mins ago</td>
                                            <td><span className="badge safe">Active</span></td>
                                            <td><button className="btn btn-outline text-xs">Manage</button></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Tech. James Wong</strong></td>
                                            <td>Lab Technician</td>
                                            <td>Central City Hospital</td>
                                            <td>1 hour ago</td>
                                            <td><span className="badge safe">Active</span></td>
                                            <td><button className="btn btn-outline text-xs">Manage</button></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Sarah Williams</strong></td>
                                            <td>Donor</td>
                                            <td>- none -</td>
                                            <td>Yesterday</td>
                                            <td><span className="badge safe">Active</span></td>
                                            <td><button className="btn btn-outline text-xs">Manage</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
