import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, User, MessageSquare, Globe } from 'lucide-react';
import { classesData } from '../data/teachersData';
import translations from '../data/translations';

export default function StudentPage({ onSaveRating, lang = 'uz', setLang }) {
    const { classId } = useParams();
    const [studentName, setStudentName] = useState('');
    const [ratings, setRatings] = useState({}); // { "teacherName": 5, ... }
    const [comments, setComments] = useState({}); // { "teacherName": "Great teacher...", ... }
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const t = translations[lang];

    // Get teachers for the selected class from URL
    const currentClassData = classesData.find(c => c.id === classId);
    const teachers = currentClassData ? currentClassData.teachers : [];

    // Language Switcher Component
    const LanguageSwitcher = () => (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
            <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50px', padding: '0.25rem', gap: '0.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '0.5rem', color: 'var(--primary)' }}><Globe size={20} /></div>
                {['uz', 'ru', 'en'].map(l => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: lang === l ? 'var(--primary)' : 'transparent',
                            color: lang === l ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );

    // If an invalid class ID is entered in the URL
    if (!currentClassData && !submitted) {
        return (
            <>
                <LanguageSwitcher />
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <h1 style={{ color: 'var(--text-main)' }}>{t.errorTitle}</h1>
                    <p className="subtitle">{t.errorDesc}</p>
                    <Link to="/" className="btn" style={{ textDecoration: 'none' }}>{t.backToMain}</Link>
                </div>
            </>
        );
    }

    const handleStarClick = (teacherName, ratingValue) => {
        setRatings(prev => ({
            ...prev,
            [teacherName]: ratingValue
        }));
    };

    const handleCommentChange = (teacherName, text) => {
        setComments(prev => ({
            ...prev,
            [teacherName]: text
        }));
    };

    const isFormValid = () => {
        if (!studentName.trim()) return false;
        if (teachers.length === 0) return false;

        // Require both a rating and a written comment for every teacher
        const hasAllRatings = Object.keys(ratings).length === teachers.length;
        const hasAllComments = teachers.every(
            teacher => comments[teacher] && comments[teacher].trim() !== ''
        );

        return hasAllRatings && hasAllComments;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        // Save to the database
        const submission = {
            id: Date.now(),
            studentName: studentName.trim(),
            className: currentClassData.id,
            ratings: ratings,
            comments: comments, // Save the comments along with ratings
            date: new Date().toISOString()
        };
        onSaveRating(submission);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <>
                <LanguageSwitcher />
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h1>{t.thanks}</h1>
                    <p className="subtitle">{t.thanksDesc}</p>
                    <button className="btn" onClick={() => window.location.reload()}>{t.sendAnother}</button>
                </div>
            </>
        );
    }

    return (
        <>
            <LanguageSwitcher />

            <div className="header-top">
                <div className="badge">{t.badge}</div>
            </div>

            <h1>{currentClassData.name} {t.welcome}</h1>
            <p className="subtitle">
                {t.studentDesc}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="step-title">
                        <span className="step-number">1</span> {t.step1}
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder={t.namePlaceholder}
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                </div>

                {studentName.trim() && teachers.length > 0 && (
                    <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <div className="step-title">
                            <span className="step-number">2</span> {t.step2}
                        </div>

                        <div className="teachers-list">
                            {teachers.map((teacher, index) => (
                                <div key={index} className="teacher-row" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem',
                                    padding: '1.5rem',
                                    alignItems: 'stretch',
                                    borderBottom: index !== teachers.length - 1 ? '1px solid var(--border-color)' : 'none'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                        <div className="teacher-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="avatar" style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <User size={20} />
                                            </div>
                                            <div style={{ fontWeight: '500', color: '#111827', fontSize: '1rem' }}>
                                                {teacher}
                                            </div>
                                        </div>

                                        <div className="stars" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', paddingLeft: '3.5rem' }}>
                                            {[1, 2, 3, 4, 5].map((starValue) => {
                                                const isActive = ratings[teacher] >= starValue;
                                                return (
                                                    <Star
                                                        key={starValue}
                                                        size={42}
                                                        strokeWidth={1.5}
                                                        className={`star ${isActive ? 'active' : ''}`}
                                                        onClick={() => handleStarClick(teacher, starValue)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Required Comment Section below the rating */}
                                    <div style={{ width: '100%' }}>
                                        <textarea
                                            placeholder={t.commentPlaceholder}
                                            required
                                            value={comments[teacher] || ''}
                                            onChange={(e) => handleCommentChange(teacher, e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                background: '#ffffff',
                                                color: 'var(--text-main)',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit',
                                                minHeight: '80px',
                                                resize: 'vertical',
                                                transition: 'all 0.2s',
                                                outline: 'none',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--primary)';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {studentName.trim() && (
                    <button
                        type="submit"
                        className="btn"
                        disabled={!isFormValid()}
                    >
                        {t.submit}
                    </button>
                )}
            </form>
        </>
    );
}
