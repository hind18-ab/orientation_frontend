import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <h2>Orientation</h2>
                    {/* <p>La référence en orientation scolaire et professionnelle propulsée par l'intelligence artificielle.</p> */}
                </div>
                <div className="footer-links">
                    <h4>Plateforme</h4>
                    <a href="#">Comment ça marche</a>
                    <a href="#">Le Test</a>
                    <a href="#">Partenariats</a>
                </div>
                <div className="footer-links">
                    <h4>Support</h4>
                    <a href="#">Aide</a>
                    <a href="#">Confidentialité</a>
                    <a href="#">Contact</a>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Orientation. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
