import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ArrowLeft, HeartPulse } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-background">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="not-found-content">
                <div className="not-found-icon-wrapper">
                    <HeartPulse size={64} className="not-found-icon pulse" />
                    <div className="blood-drop-badge">
                        <Droplet size={14} fill="currentColor" />
                    </div>
                </div>
                
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Page Not Found</h2>
                <p className="not-found-description">
                    We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in our donation network.
                </p>

                <div className="not-found-actions">
                    <button className="btn-back-history" onClick={() => window.history.back()}>
                        <ArrowLeft size={18} /> GO BACK 
                    </button>
                    <Link to="/" className="btn-return-home">
                        RETURN HOME
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
