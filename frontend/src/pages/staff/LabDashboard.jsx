import React, { useState } from 'react';
import { PlusCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import './LabDashboard.css';

const LabDashboard = () => {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="dashboard lab-dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="welcome-text">Inventory Management</h1>
                    <p className="text-muted">Central City Hospital Blood Bank</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <PlusCircle size={20} style={{ marginRight: '8px' }} />
                    Add New Packet
                </button>
            </div>

            <div className="dashboard-grid">
                {/* Alerts Column */}
                <div className="col-span-12">
                    <div className="alert-card wrapper-alert">
                        <div className="alert-icon-wrapper">
                            <AlertTriangle size={24} color="var(--color-expiring)" />
                        </div>
                        <div className="alert-text">
                            <h4>Expiry Warning (7-Day Protocol)</h4>
                            <p>5 packets of A+ and 2 packets of O- are expiring within the next 7 days. Please prioritize FIFO issuance.</p>
                        </div>
                        <button className="btn btn-outline text-sm bg-white">View Expiring Only</button>
                    </div>
                </div>

                {/* Add Packet Form (Toggleable) */}
                {showAddForm && (
                    <div className="col-span-12 fade-in">
                        <div className="card">
                            <div className="card-header">
                                <h2>Register New Blood Packet</h2>
                                <button className="btn btn-outline text-xs" onClick={() => setShowAddForm(false)}>Cancel</button>
                            </div>
                            <div className="card-body">
                                <form className="add-packet-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Donor ID</label>
                                            <input type="text" placeholder="e.g. D-10492" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Blood Group</label>
                                            <select className="form-control">
                                                <option value="">Select Type</option>
                                                <option value="A+">A+</option>
                                                <option value="O-">O-</option>
                                                <option value="B+">B+</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Collection Date</label>
                                            <input type="date" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Volume (ml)</label>
                                            <input type="number" defaultValue="450" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label>Component Type</label>
                                            <select className="form-control">
                                                <option value="Whole Blood">Whole Blood</option>
                                                <option value="Red Cells">Packed Red Cells</option>
                                                <option value="Platelets">Platelets</option>
                                                <option value="Plasma">Plasma</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Location / Fridge ID</label>
                                            <input type="text" placeholder="e.g. F-02-Shelf-A" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn btn-primary" onClick={() => setShowAddForm(false)}>Log Packet</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Master Inventory Tracking */}
                <div className="col-span-12">
                    <div className="card">
                        <div className="card-header">
                            <h2>Master Inventory List (FIFO Ordered)</h2>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Packet ID</th>
                                            <th>Blood Group</th>
                                            <th>Component</th>
                                            <th>Collection Date</th>
                                            <th>Expiry Date</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>#PKU-84920</td>
                                            <td><strong>A+</strong></td>
                                            <td>Whole Blood</td>
                                            <td>Oct 01, 2025</td>
                                            <td className="text-expiring"><AlertTriangle size={14} className="inline-icon" /> Oct 15, 2025</td>
                                            <td>F-01-A</td>
                                            <td><span className="badge warning">Expiring Soon</span></td>
                                            <td><button className="btn btn-outline text-xs">Update Status</button></td>
                                        </tr>
                                        <tr>
                                            <td>#PKU-84921</td>
                                            <td><strong>O-</strong></td>
                                            <td>Red Cells</td>
                                            <td>Oct 10, 2025</td>
                                            <td>Nov 21, 2025</td>
                                            <td>F-02-C</td>
                                            <td><span className="badge safe">Stored</span></td>
                                            <td><button className="btn btn-outline text-xs">Update Status</button></td>
                                        </tr>
                                        <tr>
                                            <td>#PKU-84925</td>
                                            <td><strong>B+</strong></td>
                                            <td>Whole Blood</td>
                                            <td>Sep 15, 2025</td>
                                            <td className="text-critical"><strong>Expired</strong></td>
                                            <td>Q-Zone</td>
                                            <td><span className="badge critical">Wasted</span></td>
                                            <td><button className="btn btn-outline text-xs">Discard</button></td>
                                        </tr>
                                        <tr>
                                            <td>#PKU-84930</td>
                                            <td><strong>AB+</strong></td>
                                            <td>Plasma</td>
                                            <td>Oct 12, 2025</td>
                                            <td>Oct 12, 2026</td>
                                            <td>F-04-B</td>
                                            <td><span className="badge safe">Stored</span></td>
                                            <td><button className="btn btn-outline text-xs">Update Status</button></td>
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

export default LabDashboard;
