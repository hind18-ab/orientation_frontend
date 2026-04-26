import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './FormationCard.css';

const FormationCard = ({ formation }) => {
    const { i18n } = useTranslation();

    const getLocalizedText = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[i18n.language] || field['fr'] || field['ar'] || field['en'] || '';
    };

    return (
        <div className="formation-card">
            <div className="formation-content">
                <div className="formation-icon">
                    <BookOpen size={24} />
                </div>
                <h4 className="formation-title">{getLocalizedText(formation.title)}</h4>
                <div className="formation-description">
                    {getLocalizedText(formation.description) || 'Apprenez les compétences clés pour réussir dans ce domaine.'}
                </div>
            </div>
            
            <div className="formation-footer">
                <Link to={`/formations/${formation.id}/courses`} className="formation-btn">
                    Voir les cours <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};

export default FormationCard;
