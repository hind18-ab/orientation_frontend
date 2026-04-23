import React from 'react';
import { ExternalLink, BookOpen, Clock, MapPin } from 'lucide-react';
import './FormationCard.css';

const FormationCard = ({ formation }) => {
    return (
        <div className="formation-card">
            <div className="formation-content">
                <div className="formation-type">{formation.degree_level || 'Licence / Master'}</div>
                <h4 className="formation-title">{formation.title}</h4>
                <p className="formation-institution">{formation.institution || 'Université Hassan II'}</p>
                
                <div className="formation-meta">
                    <div className="meta-item">
                        <Clock size={16} />
                        <span>{formation.duration || '2-3 ans'}</span>
                    </div>
                    <div className="meta-item">
                        <MapPin size={16} />
                        <span>{formation.location || 'Casablanca'}</span>
                    </div>
                </div>

                <div className="formation-description">
                    {formation.description || 'Cette formation offre un programme complet pour maîtriser les compétences clés du domaine.'}
                </div>
            </div>
            
            <div className="formation-footer">
                <a href={formation.link || '#'} target="_blank" rel="noopener noreferrer" className="formation-link">
                    Voir la fiche <ExternalLink size={16} />
                </a>
            </div>
        </div>
    );
};

export default FormationCard;
