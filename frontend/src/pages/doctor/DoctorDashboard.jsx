import React, { useState } from 'react';
import { AlertCircle, Activity, Search, ShieldAlert, Ambulance } from 'lucide-react';
import Swal from 'sweetalert2';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
    const [isDisasterMode, setIsDisasterMode] = useState(false);

    const toggleDisasterMode = () => {
        setIsDisasterMode(!isDisasterMode);
        document.body.classList.toggle('disaster-mode', !isDisasterMode);
    };

    return (
        <div className={`dashboard doctor-dashboard ${isDisasterMode ? 'disaster-active' : ''}`}>
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">Dr. Emily Chen</h1>
                    <p className="text-muted">Central City Hospital • Medical Officer</p>
                </div>
                <button
                    className={`btn ${isDisasterMode ? 'btn-primary' : 'btn-danger-pulse'}`}
                    onClick={toggleDisasterMode}
                    style={{ padding: '12px 24px', fontSize: '16px' }}
                >
                    <ShieldAlert size={20} style={{ marginRight: '8px' }} />
                    {isDisasterMode ? 'Deactivate Disaster Mode' : 'Activate Disaster Mode'}
                </button>
            </div>

            {isDisasterMode ? (
                // DISASTER MODE UI - Minimized Cognitive Load
                <div className="disaster-ui fade-in">
                    <div className="emergency-banner">
                        <AlertCircle size={32} />
                        <h2>DISASTER MODE ACTIVE: Rerouting all non-critical units. Priority Request System online.</h2>
                    </div>

                    <div className="dashboard-grid">
                        <div className="col-span-8">
                            <div className="card disaster-card">
                                <div className="card-header">
                                    <h2>Emergency Bulk Request</h2>
                                </div>
                                <div className="card-body">
                                    <div className="form-group-large">
                                        <label>Blood Type Required (Critical Priority)</label>
                                        <div className="blood-type-grid">
                                            {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => (
                                                <button key={type} className={`btn-blood-type ${type === 'O-' ? 'selected' : ''}`}>{type}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group-large" style={{ marginTop: '24px' }}>
                                        <label>Units Needed Immediately</label>
                                        <input type="number" className="input-large" defaultValue="10" />
                                    </div>
                                    <button
                                        className="btn btn-primary btn-block"
                                        style={{ marginTop: '24px', fontSize: '20px', padding: '16px' }}
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Broadcast Emergency Alert?',
                                                text: "This will immediately notify all networked hospitals and available donors in a 50km radius.",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#C62828',
                                                cancelButtonColor: '#637381',
                                                confirmButtonText: 'BROADCAST NOW'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    Swal.fire(
                                                        'Broadcast Sent!',
                                                        'Emergency request dispatched to National Grid.',
                                                        'success'
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        <Ambulance size={24} style={{ marginRight: '8px' }} />
                                        BROADCAST REQUEST TO NETWORK
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4">
                            <div className="card disaster-card">
                                <div className="card-header">
                                    <h2>Nearest Hospital Stock</h2>
                                </div>
                                <div className="card-body">
                                    <div className="hospital-list">
                                        <div className="hospital-item">
                                            <h4>Mercy General</h4>
                                            <div className="stock-pill safe">12 Units O-</div>
                                            <button className="btn btn-outline text-xs mt-2">Request Transfer</button>
                                        </div>
                                        <div className="hospital-item">
                                            <h4>Northside Clinic</h4>
                                            <div className="stock-pill warning">4 Units O-</div>
                                            <button className="btn btn-outline text-xs mt-2">Request Transfer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // NORMAL UI
                <div className="dashboard-grid fade-in">
                    {/* Predictive Alerts */}
                    <div className="col-span-12 alert-box critical">
                        <div className="alert-icon"><Activity size={24} /></div>
                        <div className="alert-content">
                            <h4>Predictive Alert: Potential O- Stock-out in 42 hours</h4>
                            <p>Based on current consumption rates and scheduled surgeries, O- reserves will reach critical levels by Friday.</p>
                        </div>
                        <button className="btn btn-outline">Request Units</button>
                    </div>

                    {/* Real-Time Stock Board */}
                    <div className="col-span-8">
                        <div className="card">
                            <div className="card-header">
                                <h2>Internal Blood Inventory</h2>
                                <div className="search-bar">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search blood group..." />
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Blood Group</th>
                                            <th>Units Valid</th>
                                            <th>Expiring &lt;7d</th>
                                            <th>Coverage Estimate</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>O Negative</strong></td>
                                            <td>14 units</td>
                                            <td className="text-expiring">2 units</td>
                                            <td>~2.5 Days</td>
                                            <td><span className="badge warning">Low</span></td>
                                            <td><button className="btn btn-primary text-xs">Request</button></td>
                                        </tr>
                                        <tr>
                                            <td><strong>A Positive</strong></td>
                                            <td>42 units</td>
                                            <td className="text-muted">0 units</td>
                                            <td>~8.0 Days</td>
                                            <td><span className="badge safe">Safe</span></td>
                                            <td><button className="btn btn-outline text-xs">View</button></td>
                                        </tr>
                                        <tr>
                                            <td><strong>B Positive</strong></td>
                                            <td>5 units</td>
                                            <td className="text-muted">1 unit</td>
                                            <td>~1.2 Days</td>
                                            <td><span className="badge critical">Critical</span></td>
                                            <td><button className="btn btn-primary text-xs">Request</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* External Network */}
                    <div className="col-span-4">
                        <div className="card bg-gray">
                            <div className="card-header">
                                <h2>Inter-Hospital Network</h2>
                            </div>
                            <div className="card-body">
                                <div className="network-status">
                                    <div className="network-dot pulse-green"></div>
                                    <span>National Grid: <strong>Online</strong></span>
                                </div>

                                <h3 className="section-label mt-4">Incoming Transfer Requests</h3>
                                <div className="transfer-request">
                                    <div className="transfer-header">
                                        <strong>Westend Medical</strong>
                                        <span className="text-xs text-muted">10 mins ago</span>
                                    </div>
                                    <p className="text-sm mt-1 mb-2">Needs 3 units of B+</p>
                                    <div className="btn-group">
                                        <button className="btn btn-outline text-xs">Decline</button>
                                        <button className="btn btn-primary text-xs">Approve Transfer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default DoctorDashboard;
