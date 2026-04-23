import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import './FormationCard.css';

const FormationCard = ({ formation }) => {
    return (
        <div className="formation-card">
            <div className="formation-content">
                <div className="formation-icon">
                    <BookOpen size={24} />
                </div>
                <h4 className="formation-title">{formation.title}</h4>
                <div className="formation-description">
                    {formation.description || 'Apprenez les compétences clés pour réussir dans ce domaine.'}
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
