import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, User, MessageSquare } from 'lucide-react';
import { classesData } from '../data/teachersData';

export default function StudentPage({ onSaveRating }) {
    const { classId } = useParams();
    const [studentName, setStudentName] = useState('');
    const [ratings, setRatings] = useState({}); // { "teacherName": 5, ... }
    const [comments, setComments] = useState({}); // { "teacherName": "Great teacher...", ... }
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    // Get teachers for the selected class from URL
    const currentClassData = classesData.find(c => c.id === classId);
    const teachers = currentClassData ? currentClassData.teachers : [];

    // If an invalid class ID is entered in the URL
    if (!currentClassData && !submitted) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h1 style={{ color: 'var(--text-main)' }}>Xato: Sinf topilmadi</h1>
                <p className="subtitle">Bunday sinf mavjud emas. Iltimos, ro'yxatdan tanlang.</p>
                <Link to="/" className="btn" style={{ textDecoration: 'none' }}>Asosiy sahifaga qaytish</Link>
            </div>
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
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem auto' }} />
                <h1>Rahmat!</h1>
                <p className="subtitle">Sizning javobingiz qabul qilindi.</p>
                <button className="btn" onClick={() => window.location.reload()}>Yana bitta yuborish</button>
            </div>
        );
    }

    return (
        <>
            <div className="header-top">
                <div className="badge">SCHOOL FEEDBACK SYSTEM</div>
            </div>

            <h1>{currentClassData.name} Sinfiga xush kelibsiz</h1>
            <p className="subtitle">
                O'qituvchilar haqida o'z fikringizni bildiring. Javoblar maxfiy qoladi.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="step-title">
                        <span className="step-number">1</span> ISM FAMILYANGIZNI YOZING
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Ismingiz va familyangiz..."
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
                            <span className="step-number">2</span> O'QITUVCHILARNI BAHOLANG
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
                                            placeholder="Bu o'qituvchi haqida fikringiz..."
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
                        YUBORISH
                    </button>
                )}
            </form>
        </>
    );
}
