import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <h2>Orientation</h2>
                </div>
                <div className="footer-links">
                    <h4>{t('footer.platform', 'Plateforme')}</h4>
                    <a href="#">{t('footer.howItWorks', 'Comment ça marche')}</a>
                    <a href="#">{t('footer.test', 'Le Test')}</a>
                    <a href="#">{t('footer.partnerships', 'Partenariats')}</a>
                </div>
                <div className="footer-links">
                    <h4>{t('footer.support', 'Support')}</h4>
                    <a href="#">{t('footer.help', 'Aide')}</a>
                    <a href="#">{t('footer.privacy', 'Confidentialité')}</a>
                    <a href="#">{t('footer.contact', 'Contact')}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Orientation. {t('footer.rights', 'Tous droits réservés.')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
