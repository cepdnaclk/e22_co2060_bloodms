import { Calendar, MapPin, Clock, Users, Video, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Events.css';
import { EVENTS } from '../../config/imageAssets';

const Events = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    // Scroll animation effect (same as Contact page)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [activeTab]);

    const upcomingEvents = [
        {
            label: 'UPCOMING EVENT',
            title: 'Blood Donation Camp',
            detail: 'March 20, 2026 • 9:00 AM - 4:00 PM',
            sub: 'University of Colombo Main Hall - All donors receive health checkup and refreshments',
            cta: 'REGISTER NOW',
            href: '#',
            image: EVENTS.upcomingEvent,
            icon: <Calendar size={36} />
        },
        {
            label: 'ONLINE EVENT',
            title: 'Awareness Webinar',
            detail: 'March 25, 2026 • 6:00 PM - 8:00 PM',
            sub: 'Online via Zoom - Learn about the importance of blood donation and become a regular donor',
            cta: 'JOIN WEBINAR',
            href: '#',
            image: EVENTS.onlineEvent,
            icon: <Video size={36} />
        },
        {
            label: 'URGENT EVENT',
            title: 'Emergency Blood Drive',
            detail: 'April 2, 2026 • 8:00 AM - 6:00 PM',
            sub: 'Kandy General Hospital - Urgent collection drive to meet increased demand during holiday season',
            cta: 'REGISTER NOW',
            href: '#',
            image: EVENTS.urgentEvent,
            icon: <MapPin size={36} />
        }
    ];

    const pastEvents = [
        {
            label: 'PAST EVENT',
            title: 'World Blood Donor Day 2025',
            detail: 'June 14, 2025 • 10:00 AM - 5:00 PM',
            sub: 'National Blood Center - Successfully collected 250+ units with 300+ participants',
            cta: 'VIEW GALLERY',
            href: '#',
            image: EVENTS.worldBloodDonorDay,
            icon: <Users size={36} />
        },
        {
            label: 'PAST EVENT',
            title: 'Corporate Blood Drive',
            detail: 'February 15, 2026 • 9:00 AM - 3:00 PM',
            sub: 'Tech Park, Colombo - Partnership with leading tech companies, 180 successful donations',
            cta: 'VIEW GALLERY',
            href: '#',
            image: EVENTS.corporateBloodDrive,
            icon: <Calendar size={36} />
        },
        {
            label: 'PAST EVENT',
            title: 'Community Health Fair',
            detail: 'January 20, 2026 • 8:00 AM - 4:00 PM',
            sub: 'Galle District - Free health screenings and blood donation camp with 120 donors',
            cta: 'VIEW GALLERY',
            href: '#',
            image: EVENTS.communityHealthFair,
            icon: <Users size={36} />
        }
    ];

    const news = [
        {
            label: 'EXPANSION',
            title: 'New Blood Center in Galle',
            detail: 'March 1, 2026',
            sub: 'HOPEDROP expands services with state-of-the-art facility in Southern Province equipped with modern technology',
            cta: 'READ MORE',
            href: '#',
            image: EVENTS.newBloodCenter,
            icon: <MapPin size={36} />
        },
        {
            label: 'PARTNERSHIP',
            title: 'National Hospital Network',
            detail: 'February 28, 2026',
            sub: 'Strategic collaboration to improve blood supply chain across 25 hospitals nationwide',
            cta: 'READ MORE',
            href: '#',
            image: EVENTS.hospitalNetwork,
            icon: <Users size={36} />
        },
        {
            label: 'PRODUCT LAUNCH',
            title: 'Mobile App Launch',
            detail: 'February 20, 2026',
            sub: 'New mobile application allows donors to schedule appointments and track donation history seamlessly',
            cta: 'READ MORE',
            href: '#',
            image: EVENTS.mobileAppLaunch,
            icon: <Phone size={48} />
        }
    ];

    const getCurrentCards = () => {
        switch(activeTab) {
            case 'upcoming':
                return upcomingEvents;
            case 'past':
                return pastEvents;
            case 'news':
                return news;
            default:
                return upcomingEvents;
        }
    };

    return (
        <div className="events-page">
            {/* Hero Banner - Same as Contact Page */}
            <div className="events-hero">
                <div className="events-hero-overlay"></div>
                <div className="events-hero-content">
                    <span className="events-hero-badge">
                        <Calendar size={16} />
                        STAY CONNECTED
                    </span>
                    <h1>Events & News</h1>
                    <p>
                        Stay updated with our latest blood donation drives, health awareness programs, and community initiatives
                    </p>
                    <div className="events-hero-breadcrumb">
                        <a href="/">Home</a>
                        <span>/</span>
                        <span>Events</span>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="events-tabs-section">
                <div className="container">
                    <div className="events-tabs-wrapper">
                        <button 
                            className={`events-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            <Calendar size={20} />
                            Upcoming Events
                        </button>
                        <button 
                            className={`events-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            <Clock size={20} />
                            Past Events
                        </button>
                        <button 
                            className={`events-tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                            onClick={() => setActiveTab('news')}
                        >
                            <Mail size={20} />
                            Latest News
                        </button>
                    </div>
                </div>
            </div>

            {/* Event Cards Section */}
            <section className="events-cards-section">
                <div className="container">
                    <div className="events-cards-grid">
                        {getCurrentCards().map((card, i) => (
                            <div
                                key={i}
                                className="event-service-box animate-on-scroll"
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
                                {/* Event Card Structure */}
                                <div className="event-service-card-wrapper event-card-inner">
                                    <div className="event-service-img-box">
                                        <img src={card.image} alt={card.label} />
                                        {/* Icon positioned half in image, half below */}
                                        <div className="event-service-icon-box event-bg-dark">
                                            {card.icon}
                                        </div>
                                    </div>
                                    <div className="event-service-content-main-box">
                                        <p className="event-contact-card-label">{card.label}</p>
                                        <h3 className="event-service-box-title">{card.title}</h3>
                                        <p className="event-contact-card-detail">{card.detail}</p>
                                        <p className="event-contact-card-sub">{card.sub}</p>
                                    </div>
                                    <div className="event-service-read-more">
                                        <a href={card.href}>
                                            {card.cta}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="events-newsletter-section">
                <div className="container">
                    <div className="events-newsletter-inner">
                        <div className="newsletter-icon">
                            <Mail size={32} />
                        </div>
                        <h2>Never Miss an Event</h2>
                        <p>Subscribe to our newsletter and get notified about upcoming blood donation drives and health events</p>
                        <div className="newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="newsletter-input"
                            />
                            <button className="newsletter-btn">Subscribe Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;
