import React, { useState } from 'react';
import { PackagePlus, AlertTriangle, Clock, ListChecks, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const [inventory, setInventory] = useState([
        { id: 'PKT-8492', type: 'O+', collectedDate: '2023-11-20', status: 'Safe', daysLeft: 25 },
        { id: 'PKT-8493', type: 'A-', collectedDate: '2023-10-15', status: 'Expiring Soon', daysLeft: 4 },
        { id: 'PKT-8494', type: 'B+', collectedDate: '2023-11-25', status: 'Safe', daysLeft: 30 },
        { id: 'PKT-8495', type: 'AB+', collectedDate: '2023-10-10', status: 'Critical', daysLeft: 1 },
    ]);

    const handleAddPacket = () => {
        Swal.fire({
            title: 'Add New Blood Packet',
            html: `
                <input id="swal-type" class="swal2-input" placeholder="Blood Type (e.g. O+)">
                <input id="swal-id" class="swal2-input" placeholder="Packet ID">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#C62828',
            confirmButtonText: 'Record Packet',
            preConfirm: () => {
                const type = document.getElementById('swal-type').value;
                const id = document.getElementById('swal-id').value;
                if (!type || !id) {
                    Swal.showValidationMessage('Please enter both Type and ID');
                }
                return { type, id }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newPacket = {
                    id: result.value.id,
                    type: result.value.type.toUpperCase(),
                    collectedDate: new Date().toISOString().split('T')[0],
                    status: 'Safe',
                    daysLeft: 35
                };
                setInventory([newPacket, ...inventory]);

                Swal.fire({
                    title: 'Packet Logged!',
                    text: `Packet ${result.value.id} added to inventory.`,
                    icon: 'success',
                    timer: 2000
                });
            }
        });
    };

    const handleIssuePacket = (id) => {
        Swal.fire({
            title: 'Verify Issuance',
            text: `Are you sure you want to issue packet ${id}? This action cannot be reversed.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2E7D32',
            cancelButtonColor: '#637381',
            confirmButtonText: 'Verify & Issue'
        }).then((result) => {
            if (result.isConfirmed) {
                setInventory(inventory.filter(pkt => pkt.id !== id));
                Swal.fire('Issued!', `Packet ${id} has been dispatched.`, 'success');
            }
        });
    };

    return (
        <div className="dashboard staff-dashboard fade-in">
            <div className="dashboard-header flex-between">
                <div>
                    <h1 className="welcome-text">Hospital Blood Bank</h1>
                    <p className="text-muted">Inventory Management & Issuance</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddPacket}>
                    <PackagePlus size={18} style={{ marginRight: '8px' }} />
                    Log New Packet
                </button>
            </div>

            <div className="dashboard-grid">
                {/* FIFO Recommendations */}
                <div className="col-span-12">
                    <div className="card fifo-alert-card">
                        <div className="card-header alert-header">
                            <h2><Clock size={20} /> FIFO Priority Issuance (Short Expiry)</h2>
                        </div>
                        <div className="card-body">
                            <div className="flex-row gap-4">
                                {inventory.filter(p => p.daysLeft <= 7).sort((a, b) => a.daysLeft - b.daysLeft).map(packet => (
                                    <div key={`fifo-${packet.id}`} className="fifo-item p-3 border-radius-md bg-white shadow-sm">
                                        <div className="flex-between mb-2">
                                            <strong>{packet.id}</strong>
                                            <span className={`badge ${packet.status === 'Critical' ? 'critical' : 'warning'}`}>{packet.type}</span>
                                        </div>
                                        <p className="text-sm text-muted">Expires in {packet.daysLeft} days</p>
                                        <button className="btn btn-outline btn-sm w-full mt-2" onClick={() => handleIssuePacket(packet.id)}>Issue Now</button>
                                    </div>
                                ))}
                            </div>
                            {inventory.filter(p => p.daysLeft <= 7).length === 0 && (
                                <p className="text-muted"><CheckCircle size={16} /> All packets have good validity. No urgent FIFO issues.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Inventory */}
                <div className="col-span-12">
                    <div className="card">
                        <div className="card-header">
                            <h2><ListChecks size={20} /> Current Stock Inventory</h2>
                        </div>
                        <div className="card-body p-0">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Packet ID</th>
                                        <th>Blood Type</th>
                                        <th>Collected Date</th>
                                        <th>Shelf Life</th>
                                        <th>Status Badge</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(packet => (
                                        <tr key={packet.id}>
                                            <td><strong>{packet.id}</strong></td>
                                            <td><h3>{packet.type}</h3></td>
                                            <td>{packet.collectedDate}</td>
                                            <td>
                                                <div className="progress-bar" style={{ width: '100px' }}>
                                                    <div className={`progress-fill ${packet.daysLeft > 15 ? 'safe' : packet.daysLeft > 3 ? 'warning' : 'critical'}`} style={{ width: `${(packet.daysLeft / 35) * 100}%` }}></div>
                                                </div>
                                                <span className="text-xs text-muted block mt-1">{packet.daysLeft} days left</span>
                                            </td>
                                            <td>
                                                <span className={`badge ${packet.status === 'Safe' ? 'safe' : packet.status === 'Expiring Soon' ? 'warning' : 'critical'}`}>
                                                    {packet.status === 'Critical' && <AlertTriangle size={12} style={{ marginRight: '4px' }} />}
                                                    {packet.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline text-xs" onClick={() => handleIssuePacket(packet.id)}>Issue</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default StaffDashboard;
