import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Droplet,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Bell
} from 'lucide-react';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock donor data
  const donorProfile = {
    name: "Sarah Johnson",
    donorId: "DON-2024-8492",
    bloodType: "A+",
    totalDonations: 12,
    lastDonation: "Sep 15, 2025",
    nextEligible: "Dec 15, 2025",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@email.com",
    address: "123 Main St, Central City",
    registrationDate: "Jan 10, 2023"
  };

  const donationHistory = [
    { id: 1, date: "Sep 15, 2025", location: "Central City Hospital", volume: "450ml", status: "Completed", usage: "Emergency Surgery" },
    { id: 2, date: "Jun 20, 2025", location: "Central City Hospital", volume: "450ml", status: "Completed", usage: "Cancer Treatment" },
    { id: 3, date: "Mar 18, 2025", location: "Mobile Blood Drive", volume: "450ml", status: "Completed", usage: "General Stock" },
    { id: 4, date: "Dec 10, 2024", location: "Central City Hospital", volume: "450ml", status: "Completed", usage: "Accident Victim" }
  ];

  const upcomingAppointments = [
    { id: 1, date: "Dec 18, 2025", time: "10:00 AM", location: "Central City Hospital", status: "Confirmed" }
  ];

  const eligibilityStatus = {
    eligible: false,
    daysRemaining: 28,
    reason: "Minimum 84-day gap required between donations"
  };

  const achievements = [
    { title: "First Time Hero", icon: "🎖️", earned: true, date: "Jan 15, 2023" },
    { title: "5 Lives Saved", icon: "⭐", earned: true, date: "Nov 20, 2023" },
    { title: "10 Donations Club", icon: "🏆", earned: true, date: "Jun 20, 2025" },
    { title: "Regular Hero", icon: "💎", earned: false, date: null }
  ];

  return (
    <div className="donor-dashboard fade-in">
      {/* Header */}
      <div className="donor-header">
        <div className="donor-welcome">
          <h1 className="donor-title">Welcome back, {donorProfile.name}!</h1>
          <p className="donor-subtitle">Thank you for being a life-saving hero</p>
        </div>
        <div className="donor-header-actions">
          <button className="donor-btn donor-btn-outline">
            <Bell size={18} />
            Notifications
          </button>
          <button 
            className="donor-btn donor-btn-primary"
            onClick={() => setShowAppointmentForm(!showAppointmentForm)}
          >
            <Calendar size={18} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Eligibility Alert */}
      <div className="donor-grid">
        <div className="donor-col-12">
          {eligibilityStatus.eligible ? (
            <div className="donor-alert donor-alert-success">
              <div className="donor-alert-icon">
                <CheckCircle size={24} />
              </div>
              <div className="donor-alert-content">
                <h4>You're Eligible to Donate!</h4>
                <p>Great news! You can donate blood today. Book an appointment to save lives.</p>
              </div>
              <button className="donor-btn donor-btn-success">Book Now</button>
            </div>
          ) : (
            <div className="donor-alert donor-alert-warning">
              <div className="donor-alert-icon">
                <Clock size={24} />
              </div>
              <div className="donor-alert-content">
                <h4>Next Eligible Donation: {donorProfile.nextEligible}</h4>
                <p>{eligibilityStatus.daysRemaining} days remaining - {eligibilityStatus.reason}</p>
              </div>
              <button className="donor-btn donor-btn-outline donor-btn-sm">Set Reminder</button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="donor-col-4">
          <div className="donor-card">
            <div className="donor-card-header">
              <h2>Donor Profile</h2>
            </div>
            <div className="donor-card-body">
              <div className="donor-profile-avatar">
                <div className="donor-avatar">
                  <User size={48} />
                </div>
                <div className="donor-blood-badge">{donorProfile.bloodType}</div>
              </div>
              
              <div className="donor-profile-info">
                <h3>{donorProfile.name}</h3>
                <p className="donor-id">ID: {donorProfile.donorId}</p>
              </div>

              <div className="donor-info-list">
                <div className="donor-info-item">
                  <Phone size={16} />
                  <span>{donorProfile.phone}</span>
                </div>
                <div className="donor-info-item">
                  <Mail size={16} />
                  <span>{donorProfile.email}</span>
                </div>
                <div className="donor-info-item">
                  <MapPin size={16} />
                  <span>{donorProfile.address}</span>
                </div>
                <div className="donor-info-item">
                  <Calendar size={16} />
                  <span>Member since {donorProfile.registrationDate}</span>
                </div>
              </div>

              <button className="donor-btn donor-btn-outline donor-full-width">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="donor-col-8">
          {/* Statistics */}
          <div className="donor-stats-grid">
            <div className="donor-stat-card">
              <div className="donor-stat-icon donor-stat-primary">
                <Droplet size={24} />
              </div>
              <div className="donor-stat-content">
                <h3>{donorProfile.totalDonations}</h3>
                <p>Total Donations</p>
              </div>
            </div>

            <div className="donor-stat-card">
              <div className="donor-stat-icon donor-stat-success">
                <Heart size={24} />
              </div>
              <div className="donor-stat-content">
                <h3>{donorProfile.totalDonations * 3}</h3>
                <p>Lives Impacted</p>
              </div>
            </div>

            <div className="donor-stat-card">
              <div className="donor-stat-icon donor-stat-warning">
                <TrendingUp size={24} />
              </div>
              <div className="donor-stat-content">
                <h3>5.4L</h3>
                <p>Blood Donated</p>
              </div>
            </div>

            <div className="donor-stat-card">
              <div className="donor-stat-icon donor-stat-info">
                <Award size={24} />
              </div>
              <div className="donor-stat-content">
                <h3>3</h3>
                <p>Badges Earned</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="donor-card donor-mt-4">
            <div className="donor-card-header">
              <h2>Achievements & Milestones</h2>
            </div>
            <div className="donor-card-body">
              <div className="donor-achievements-grid">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`donor-achievement-item ${achievement.earned ? 'donor-achievement-earned' : 'donor-achievement-locked'}`}
                  >
                    <div className="donor-achievement-icon">{achievement.icon}</div>
                    <h4>{achievement.title}</h4>
                    {achievement.earned ? (
                      <p className="donor-achievement-date">{achievement.date}</p>
                    ) : (
                      <p className="donor-achievement-locked-text">Not Earned</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Form */}
        {showAppointmentForm && (
          <div className="donor-col-12 fade-in">
            <div className="donor-card">
              <div className="donor-card-header">
                <h2>Book Donation Appointment</h2>
                <button 
                  className="donor-btn donor-btn-outline donor-btn-sm"
                  onClick={() => setShowAppointmentForm(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="donor-card-body">
                <form className="donor-form">
                  <div className="donor-form-row">
                    <div className="donor-form-group">
                      <label>Select Location</label>
                      <select className="donor-form-control">
                        <option value="">Choose a location</option>
                        <option value="central">Central City Hospital</option>
                        <option value="north">North Branch Blood Bank</option>
                        <option value="mobile">Mobile Blood Drive</option>
                      </select>
                    </div>
                    <div className="donor-form-group">
                      <label>Preferred Date</label>
                      <input 
                        type="date" 
                        className="donor-form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="donor-form-group">
                      <label>Preferred Time</label>
                      <select 
                        className="donor-form-control"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Select time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="donor-form-row">
                    <div className="donor-form-group donor-form-group-full">
                      <label>Special Requirements / Notes</label>
                      <textarea 
                        className="donor-form-control" 
                        rows="3"
                        placeholder="Any special requirements or medical conditions we should know about..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="donor-form-actions">
                    <button 
                      type="button" 
                      className="donor-btn donor-btn-primary"
                      onClick={() => setShowAppointmentForm(false)}
                    >
                      <CheckCircle size={18} />
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="donor-col-6">
          <div className="donor-card">
            <div className="donor-card-header">
              <h2>Upcoming Appointments</h2>
            </div>
            <div className="donor-card-body">
              {upcomingAppointments.length > 0 ? (
                <div className="donor-appointment-list">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="donor-appointment-item">
                      <div className="donor-appointment-date">
                        <Calendar size={20} />
                        <div>
                          <h4>{appointment.date}</h4>
                          <p>{appointment.time}</p>
                        </div>
                      </div>
                      <div className="donor-appointment-details">
                        <p><MapPin size={14} /> {appointment.location}</p>
                        <span className="donor-badge donor-badge-success">{appointment.status}</span>
                      </div>
                      <div className="donor-appointment-actions">
                        <button className="donor-btn donor-btn-outline donor-btn-xs">Reschedule</button>
                        <button className="donor-btn donor-btn-outline donor-btn-xs donor-btn-danger">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="donor-empty-state">
                  <Calendar size={48} />
                  <p>No upcoming appointments</p>
                  <button 
                    className="donor-btn donor-btn-primary donor-btn-sm"
                    onClick={() => setShowAppointmentForm(true)}
                  >
                    Book an Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Health Check */}
        <div className="donor-col-6">
          <div className="donor-card">
            <div className="donor-card-header">
              <h2>Pre-Donation Health Check</h2>
            </div>
            <div className="donor-card-body">
              <div className="donor-health-checklist">
                <div className="donor-health-item">
                  <CheckCircle size={20} className="donor-health-icon-success" />
                  <div>
                    <h4>Weight Check</h4>
                    <p>Above 50kg (110 lbs)</p>
                  </div>
                </div>
                <div className="donor-health-item">
                  <CheckCircle size={20} className="donor-health-icon-success" />
                  <div>
                    <h4>Age Requirement</h4>
                    <p>18-65 years old</p>
                  </div>
                </div>
                <div className="donor-health-item">
                  <AlertCircle size={20} className="donor-health-icon-warning" />
                  <div>
                    <h4>Last Donation</h4>
                    <p>84 days gap required</p>
                  </div>
                </div>
              </div>
              <button 
                className="donor-btn donor-btn-outline donor-full-width donor-mt-3"
                onClick={() => setShowHealthForm(!showHealthForm)}
              >
                <FileText size={18} />
                Complete Health Questionnaire
              </button>
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="donor-col-12">
          <div className="donor-card">
            <div className="donor-card-header">
              <h2>Donation History</h2>
              <button className="donor-btn donor-btn-outline donor-btn-sm">
                Download Certificate
              </button>
            </div>
            <div className="donor-card-body donor-p-0">
              <div className="donor-table-responsive">
                <table className="donor-table">
                  <thead>
                    <tr>
                      <th>Donation Date</th>
                      <th>Location</th>
                      <th>Volume</th>
                      <th>Status</th>
                      <th>Usage</th>
                      <th>Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.map((donation) => (
                      <tr key={donation.id}>
                        <td><strong>{donation.date}</strong></td>
                        <td>{donation.location}</td>
                        <td>{donation.volume}</td>
                        <td>
                          <span className="donor-badge donor-badge-success">
                            {donation.status}
                          </span>
                        </td>
                        <td>{donation.usage}</td>
                        <td>
                          <div className="donor-impact">
                            <Heart size={14} className="donor-impact-icon" />
                            <span>3 lives</span>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default DonorDashboard;
