import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Droplet,
  AlertTriangle,
  FileText,
  Clock,
  Hospital,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  Package,
  Activity,
  Calendar,
  Search,
  Filter,
  AlertOctagon,
  Zap
} from 'lucide-react';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [disasterMode, setDisasterMode] = useState(false);

  // Mock Data - Blood Stock
  const bloodStock = [
    { type: 'O+', units: 45, status: 'safe', percentage: 85 },
    { type: 'A+', units: 32, status: 'safe', percentage: 70 },
    { type: 'B+', units: 28, status: 'low', percentage: 55 },
    { type: 'AB+', units: 15, status: 'safe', percentage: 60 },
    { type: 'O-', units: 8, status: 'critical', percentage: 25 },
    { type: 'A-', units: 12, status: 'low', percentage: 40 },
    { type: 'B-', units: 10, status: 'low', percentage: 35 },
    { type: 'AB-', units: 5, status: 'critical', percentage: 20 }
  ];

  // Critical Alerts
  const criticalAlerts = [
    { id: 1, bloodType: 'O-', message: 'Critical Shortage', coverage: '24 hours', urgency: 'critical' },
    { id: 2, bloodType: 'AB-', message: 'Low Stock Warning', coverage: '36 hours', urgency: 'warning' }
  ];

  // FIFO Blood Packets
  const bloodPackets = [
    { id: 'BP-001', bloodType: 'O+', storedDate: '2026-02-15', expiryDate: '2026-03-29', status: 'available', daysToExpiry: 9 },
    { id: 'BP-002', bloodType: 'A+', storedDate: '2026-02-18', expiryDate: '2026-04-01', status: 'available', daysToExpiry: 12 },
    { id: 'BP-003', bloodType: 'O-', storedDate: '2026-02-10', expiryDate: '2026-03-24', status: 'expiring', daysToExpiry: 4 },
    { id: 'BP-004', bloodType: 'B+', storedDate: '2026-02-20', expiryDate: '2026-04-03', status: 'available', daysToExpiry: 14 },
    { id: 'BP-005', bloodType: 'AB-', storedDate: '2026-02-12', expiryDate: '2026-03-26', status: 'expiring', daysToExpiry: 6 },
    { id: 'BP-006', bloodType: 'A-', storedDate: '2026-02-14', expiryDate: '2026-03-28', status: 'available', daysToExpiry: 8 }
  ];

  // Expiring Packets (within 7 days)
  const expiringPackets = bloodPackets.filter(packet => packet.daysToExpiry <= 7);

  // Nearby Hospitals
  const nearbyHospitals = [
    { id: 1, name: 'Colombo General Hospital', distance: '2.5 km', units: { 'O+': 25, 'A+': 18, 'B+': 15, 'O-': 5 } },
    { id: 2, name: 'Kandy Teaching Hospital', distance: '3.8 km', units: { 'O+': 30, 'A+': 22, 'B+': 12, 'O-': 8 } },
    { id: 3, name: 'Negombo District Hospital', distance: '5.2 km', units: { 'O+': 20, 'A+': 15, 'B+': 10, 'O-': 3 } }
  ];

  // Recent Requests
  const recentRequests = [
    { id: 1, patientId: 'P-1234', bloodType: 'O-', units: 2, urgency: 'High', hospital: 'Colombo General', time: '10 mins ago', status: 'Pending' },
    { id: 2, patientId: 'P-5678', bloodType: 'A+', units: 1, urgency: 'Medium', hospital: 'Kandy Teaching', time: '25 mins ago', status: 'Approved' },
    { id: 3, patientId: 'P-9012', bloodType: 'B+', units: 3, urgency: 'High', hospital: 'Colombo General', time: '1 hour ago', status: 'Completed' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDisasterMode = () => {
    setDisasterMode(!disasterMode);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'hopedrop-status-safe';
      case 'low': return 'hopedrop-status-low';
      case 'critical': return 'hopedrop-status-critical';
      default: return '';
    }
  };

  return (
    <div className={`hopedrop-dashboard ${disasterMode ? 'hopedrop-disaster-mode' : ''}`}>
      {/* Disaster Mode Banner */}
      {disasterMode && (
        <div className="hopedrop-disaster-banner">
          <div className="hopedrop-disaster-banner-content">
            <AlertOctagon size={24} className="hopedrop-disaster-icon-pulse" />
            <div className="hopedrop-disaster-text">
              <strong>DISASTER MODE ACTIVE</strong>
              <span>Emergency Protocol Initiated - All hands on deck</span>
            </div>
            <button className="hopedrop-disaster-deactivate" onClick={toggleDisasterMode}>
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className={`hopedrop-sidebar ${sidebarOpen ? 'hopedrop-sidebar-open' : 'hopedrop-sidebar-closed'}`}>
        <nav className="hopedrop-sidebar-nav">
          <button 
            className={`hopedrop-nav-item ${activeTab === 'dashboard' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button 
            className={`hopedrop-nav-item ${activeTab === 'inventory' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Package size={20} />
            {sidebarOpen && <span>Blood Inventory</span>}
          </button>
          <button 
            className={`hopedrop-nav-item ${activeTab === 'requests' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FileText size={20} />
            {sidebarOpen && <span>Blood Requests</span>}
          </button>
          <button 
            className={`hopedrop-nav-item ${activeTab === 'packets' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('packets')}
          >
            <Activity size={20} />
            {sidebarOpen && <span>FIFO Packets</span>}
          </button>
          <button 
            className={`hopedrop-nav-item ${activeTab === 'expiring' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('expiring')}
          >
            <Clock size={20} />
            {sidebarOpen && <span>Expiring Soon</span>}
          </button>
          <button 
            className={`hopedrop-nav-item ${activeTab === 'hospitals' ? 'hopedrop-nav-active' : ''}`}
            onClick={() => setActiveTab('hospitals')}
          >
            <Hospital size={20} />
            {sidebarOpen && <span>Nearby Hospitals</span>}
          </button>
        </nav>

        <div className="hopedrop-sidebar-footer">
          <div className="hopedrop-user-profile">
            <div className="hopedrop-user-avatar">
              <User size={20} />
            </div>
            {sidebarOpen && (
              <div className="hopedrop-user-info">
                <span className="hopedrop-user-name">Dr. Sarah Williams</span>
                <span className="hopedrop-user-role">Blood Bank Manager</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="hopedrop-main">
        {/* Top Header */}
        <header className="hopedrop-header">
          <div className="hopedrop-header-left">
            <button className="hopedrop-menu-btn" onClick={toggleSidebar}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="hopedrop-page-title">Doctor Dashboard</h1>
          </div>
          <div className="hopedrop-header-right">
            <div className="hopedrop-search-box">
              <Search size={18} />
              <input type="text" placeholder="Search patients, packets..." />
            </div>
            <button className="hopedrop-notification-btn">
              <Bell size={20} />
              <span className="hopedrop-notification-badge">3</span>
            </button>
            <button 
              className={`hopedrop-disaster-mode-btn ${disasterMode ? 'hopedrop-disaster-active' : ''}`}
              onClick={toggleDisasterMode}
              title={disasterMode ? "Deactivate Disaster Mode" : "Activate Disaster Mode"}
            >
              {disasterMode ? <Zap size={20} /> : <AlertOctagon size={20} />}
              {disasterMode && <span className="hopedrop-disaster-mode-text">DISASTER MODE</span>}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="hopedrop-content">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && activeTab === 'dashboard' && (
            <div className="hopedrop-alerts-section">
              {criticalAlerts.map(alert => (
                <div key={alert.id} className={`hopedrop-alert hopedrop-alert-${alert.urgency}`}>
                  <AlertTriangle size={20} />
                  <div className="hopedrop-alert-content">
                    <strong>{alert.message} - {alert.bloodType}</strong>
                    <span>Coverage Remaining: {alert.coverage}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <>
              {/* Blood Stock Overview */}
              <div className="hopedrop-section">
                <div className="hopedrop-section-header">
                  <h2>Blood Stock Overview</h2>
                  <button className="hopedrop-btn-primary" onClick={() => setShowRequestForm(true)}>
                    <Droplet size={16} />
                    Request Blood
                  </button>
                </div>
                <div className="hopedrop-blood-stock-grid">
                  {bloodStock.map(blood => (
                    <div key={blood.type} className={`hopedrop-blood-card ${getStatusColor(blood.status)}`}>
                      <div className="hopedrop-blood-type">{blood.type}</div>
                      <div className="hopedrop-blood-units">{blood.units} Units</div>
                      <div className="hopedrop-blood-status">{blood.status}</div>
                      <div className="hopedrop-blood-progress">
                        <div 
                          className="hopedrop-blood-progress-bar" 
                          style={{width: `${blood.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hopedrop-stats-grid">
                <div className="hopedrop-stat-card">
                  <div className="hopedrop-stat-icon hopedrop-stat-icon-blue">
                    <Package size={24} />
                  </div>
                  <div className="hopedrop-stat-content">
                    <span className="hopedrop-stat-label">Total Packets</span>
                    <h3 className="hopedrop-stat-value">164</h3>
                    <span className="hopedrop-stat-change">+12 this week</span>
                  </div>
                </div>
                <div className="hopedrop-stat-card">
                  <div className="hopedrop-stat-icon hopedrop-stat-icon-red">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="hopedrop-stat-content">
                    <span className="hopedrop-stat-label">Expiring Soon</span>
                    <h3 className="hopedrop-stat-value">{expiringPackets.length}</h3>
                    <span className="hopedrop-stat-change">Within 7 days</span>
                  </div>
                </div>
                <div className="hopedrop-stat-card">
                  <div className="hopedrop-stat-icon hopedrop-stat-icon-green">
                    <Activity size={24} />
                  </div>
                  <div className="hopedrop-stat-content">
                    <span className="hopedrop-stat-label">Active Requests</span>
                    <h3 className="hopedrop-stat-value">8</h3>
                    <span className="hopedrop-stat-change">2 high priority</span>
                  </div>
                </div>
                <div className="hopedrop-stat-card">
                  <div className="hopedrop-stat-icon hopedrop-stat-icon-purple">
                    <Hospital size={24} />
                  </div>
                  <div className="hopedrop-stat-content">
                    <span className="hopedrop-stat-label">Connected Hospitals</span>
                    <h3 className="hopedrop-stat-value">12</h3>
                    <span className="hopedrop-stat-change">Network active</span>
                  </div>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="hopedrop-section">
                <div className="hopedrop-section-header">
                  <h2>Recent Blood Requests</h2>
                  <button className="hopedrop-btn-secondary">View All</button>
                </div>
                <div className="hopedrop-table-container">
                  <table className="hopedrop-table">
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Blood Type</th>
                        <th>Units</th>
                        <th>Urgency</th>
                        <th>Hospital</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.map(req => (
                        <tr key={req.id}>
                          <td>{req.patientId}</td>
                          <td><span className="hopedrop-blood-badge">{req.bloodType}</span></td>
                          <td>{req.units}</td>
                          <td><span className={`hopedrop-urgency-badge hopedrop-urgency-${req.urgency.toLowerCase()}`}>{req.urgency}</span></td>
                          <td>{req.hospital}</td>
                          <td>{req.time}</td>
                          <td><span className={`hopedrop-status-badge hopedrop-status-${req.status.toLowerCase()}`}>{req.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* FIFO Packets View */}
          {activeTab === 'packets' && (
            <div className="hopedrop-section">
              <div className="hopedrop-section-header">
                <h2>FIFO Blood Packet System</h2>
                <div className="hopedrop-header-actions">
                  <button className="hopedrop-btn-secondary">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
              </div>
              <p className="hopedrop-section-description">
                Packets are sorted by oldest stored date first to minimize wastage (FIFO policy)
              </p>
              <div className="hopedrop-table-container">
                <table className="hopedrop-table">
                  <thead>
                    <tr>
                      <th>Packet ID</th>
                      <th>Blood Type</th>
                      <th>Stored Date</th>
                      <th>Expiry Date</th>
                      <th>Days to Expiry</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodPackets.map(packet => (
                      <tr key={packet.id} className={packet.status === 'expiring' ? 'hopedrop-row-warning' : ''}>
                        <td>{packet.id}</td>
                        <td><span className="hopedrop-blood-badge">{packet.bloodType}</span></td>
                        <td>{packet.storedDate}</td>
                        <td>{packet.expiryDate}</td>
                        <td>
                          {packet.daysToExpiry <= 7 ? (
                            <span className="hopedrop-expiry-warning">{packet.daysToExpiry} days</span>
                          ) : (
                            <span>{packet.daysToExpiry} days</span>
                          )}
                        </td>
                        <td><span className={`hopedrop-status-badge hopedrop-status-${packet.status}`}>{packet.status}</span></td>
                        <td>
                          <button className="hopedrop-btn-text">Use</button>
                          <button className="hopedrop-btn-text">Reserve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Expiring Packets View */}
          {activeTab === 'expiring' && (
            <div className="hopedrop-section">
              <div className="hopedrop-section-header">
                <h2>Expiring Blood Packets (Within 7 Days)</h2>
              </div>
              <div className="hopedrop-expiring-grid">
                {expiringPackets.map(packet => (
                  <div key={packet.id} className="hopedrop-expiring-card">
                    <div className="hopedrop-expiring-header">
                      <span className="hopedrop-blood-badge-large">{packet.bloodType}</span>
                      <span className="hopedrop-expiry-badge">{packet.daysToExpiry} days left</span>
                    </div>
                    <div className="hopedrop-expiring-body">
                      <div className="hopedrop-expiring-info">
                        <span>Packet ID:</span>
                        <strong>{packet.id}</strong>
                      </div>
                      <div className="hopedrop-expiring-info">
                        <span>Stored:</span>
                        <strong>{packet.storedDate}</strong>
                      </div>
                      <div className="hopedrop-expiring-info">
                        <span>Expires:</span>
                        <strong>{packet.expiryDate}</strong>
                      </div>
                    </div>
                    <div className="hopedrop-expiring-actions">
                      <button className="hopedrop-btn-primary hopedrop-btn-sm">Use Immediately</button>
                      <button className="hopedrop-btn-secondary hopedrop-btn-sm">Reserve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Hospitals View */}
          {activeTab === 'hospitals' && (
            <div className="hopedrop-section">
              <div className="hopedrop-section-header">
                <h2>Inter-Hospital Blood Exchange</h2>
              </div>
              <p className="hopedrop-section-description">
                View and request blood transfers from nearby hospitals during emergencies
              </p>
              <div className="hopedrop-hospitals-grid">
                {nearbyHospitals.map(hospital => (
                  <div key={hospital.id} className="hopedrop-hospital-card">
                    <div className="hopedrop-hospital-header">
                      <Hospital size={24} />
                      <div>
                        <h3>{hospital.name}</h3>
                        <span className="hopedrop-hospital-distance">{hospital.distance}</span>
                      </div>
                    </div>
                    <div className="hopedrop-hospital-inventory">
                      <h4>Available Blood Units</h4>
                      <div className="hopedrop-hospital-blood-grid">
                        {Object.entries(hospital.units).map(([type, units]) => (
                          <div key={type} className="hopedrop-hospital-blood-item">
                            <span className="hopedrop-blood-type-small">{type}</span>
                            <span className="hopedrop-blood-units-small">{units} units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="hopedrop-btn-primary hopedrop-btn-block">Request Transfer</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blood Request Form Modal */}
      {showRequestForm && (
        <div className="hopedrop-modal-overlay" onClick={() => setShowRequestForm(false)}>
          <div className="hopedrop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hopedrop-modal-header">
              <h2>Blood Request Form</h2>
              <button className="hopedrop-modal-close" onClick={() => setShowRequestForm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="hopedrop-modal-body">
              <div className="hopedrop-form-group">
                <label>Patient ID</label>
                <input type="text" placeholder="Enter patient ID" className="hopedrop-input" />
              </div>
              <div className="hopedrop-form-group">
                <label>Blood Type</label>
                <select className="hopedrop-input">
                  <option>Select blood type</option>
                  <option>O+</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>AB+</option>
                  <option>O-</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>AB-</option>
                </select>
              </div>
              <div className="hopedrop-form-group">
                <label>Units Required</label>
                <input type="number" placeholder="Number of units" className="hopedrop-input" />
              </div>
              <div className="hopedrop-form-group">
                <label>Urgency Level</label>
                <select className="hopedrop-input">
                  <option>Select urgency</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="hopedrop-form-group">
                <label>Hospital</label>
                <input type="text" placeholder="Hospital name" className="hopedrop-input" />
              </div>
            </div>
            <div className="hopedrop-modal-footer">
              <button className="hopedrop-btn-secondary" onClick={() => setShowRequestForm(false)}>Cancel</button>
              <button className="hopedrop-btn-primary">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;