import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Droplet, 
  TestTube, 
  Truck, 
  Refrigerator, 
  Heart, 
  Clock, 
  Shield, 
  Users,
  Waves
} from 'lucide-react';
import './Services.css';
import { SERVICES } from '../../config/imageAssets';

// ServiceCard Component
function ServiceCard({ icon: Icon, title, description, features }) {
  return (
    <div className="service-card scroll-animate">
      <div className="service-card-header">
        <div className="service-icon-wrapper">
          <Icon className="service-icon" />
        </div>
        <h3 className="service-title">{title}</h3>
      </div>
      <p className="service-description">{description}</p>
      <ul className="service-features">
        {features.map((feature, index) => (
          <li key={index} className="service-feature-item">
            <span className="feature-bullet">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// FeaturedService Component
function FeaturedService({ icon: Icon, title, description, imageUrl, imageAlt, reverse = false }) {
  return (
    <div className={`featured-service scroll-animate ${reverse ? 'featured-service-reverse' : ''}`}>
      <div className="featured-service-image-wrapper">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="featured-service-image"
        />
      </div>
      <div className="featured-service-content">
        <div className="featured-service-header">
          <div className="featured-icon-wrapper">
            <Icon className="featured-icon" />
          </div>
          <h3 className="featured-title">{title}</h3>
        </div>
        <p className="featured-description">{description}</p>
      </div>
    </div>
  );
}

// Main Services Component
export default function Services() {
  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const services = [
    {
      icon: Droplet,
      title: 'Blood Donation',
      description: 'Safe and convenient blood donation process with trained medical staff.',
      features: [
        'Walk-in and scheduled appointments',
        'Comprehensive donor screening',
        'Comfortable donation facilities',
        'Post-donation refreshments and care'
      ]
    },
    {
      icon: TestTube,
      title: 'Blood Testing & Screening',
      description: 'Advanced laboratory testing to ensure blood safety and compatibility.',
      features: [
        'Disease screening (HIV, Hepatitis, etc.)',
        'Blood type and Rh factor testing',
        'Antibody screening',
        'Quality control protocols'
      ]
    },
    {
      icon: Truck,
      title: 'Emergency Blood Supply',
      description: '24/7 emergency blood delivery service for critical situations.',
      features: [
        'Round-the-clock availability',
        'Rapid response team',
        'Direct hospital delivery',
        'Priority processing for emergencies'
      ]
    },
    {
      icon: Refrigerator,
      title: 'Blood Storage & Preservation',
      description: 'State-of-the-art storage facilities maintaining optimal conditions.',
      features: [
        'Temperature-controlled environments',
        'Advanced monitoring systems',
        'Inventory management',
        'Component separation and processing'
      ]
    },
    {
      icon: Heart,
      title: 'Blood Component Services',
      description: 'Specialized processing of blood into various components.',
      features: [
        'Red blood cells',
        'Platelets',
        'Plasma',
        'Cryoprecipitate'
      ]
    },
    {
      icon: Users,
      title: 'Mobile Blood Drives',
      description: 'Bringing blood donation services to your community or organization.',
      features: [
        'On-site blood collection',
        'Corporate and community events',
        'Fully equipped mobile units',
        'Professional medical staff'
      ]
    }
  ];

  const featuredServices = [
    {
      icon: Clock,
      title: '24/7 Emergency Services',
      description: 'Our emergency blood supply service operates around the clock to ensure that life-saving blood is available whenever and wherever it\'s needed. With our rapid response team and streamlined processes, we guarantee quick delivery to hospitals and medical facilities during critical situations.',
      image: SERVICES.advancedTesting,
      imageAlt: 'Emergency medical response'
    },
    {
      icon: Shield,
      title: 'Advanced Testing & Quality Assurance',
      description: 'Every unit of blood undergoes rigorous testing using state-of-the-art laboratory equipment. Our quality assurance protocols exceed industry standards, ensuring that all blood products are safe, properly typed, and screened for infectious diseases before being made available for transfusion.',
      imageUrl: 'https://images.unsplash.com/photo-1599557835468-29bb0b3155cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeSUyMHRlc3Rpbmd8ZW58MXx8fHwxNzcyODAyMTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageAlt: 'Medical laboratory testing',
      reverse: true
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img
          src="https://images.unsplash.com/photo-1683791895200-201c0c40310f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9uJTIwaGVhbHRoY2FyZSUyMGhlcm9lc3xlbnwxfHx8fDE3NzI4ODkxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Blood donation healthcare"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-inner">
            {/* Slogan */}
            <div className="slogan-wrapper">
              <div className="slogan-badge">
                <Waves className="slogan-icon" />
                <span className="slogan-text">Mastering the Drop</span>
              </div>
            </div>
            
            <h2 className="hero-title">Our Services</h2>
            <p className="hero-subtitle">
              Committed to saving lives through comprehensive blood banking services, 
              advanced technology, and compassionate care.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-intro">
            <h3 className="services-heading">
              Comprehensive Blood Banking Solutions
            </h3>
            <p className="services-subheading">
              We offer a complete range of blood banking services to meet the needs of 
              donors, patients, and healthcare facilities.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            ))}
          </div>

          {/* Featured Services */}
          <div className="featured-services">
            {featuredServices.map((service, index) => (
              <FeaturedService
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                imageUrl={service.imageUrl}
                imageAlt={service.imageAlt}
                reverse={service.reverse}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Make a Difference?</h3>
            <p className="cta-description">
              Your donation can save up to three lives. Schedule an appointment today 
              or contact us to learn more about our services.
            </p>
            <div className="cta-buttons">
              <Link to="/donor-dashboard" className="cta-button">
                BECOME A DONOR
              </Link>
              <Link to="/contact" className="cta-button">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
        </div>
      </footer>
    </div>
  );
}