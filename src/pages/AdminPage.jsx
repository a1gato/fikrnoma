import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Star, BarChart3, Database, MessageSquare, LayoutGrid, BookOpen, UserCircle, Globe, ChevronLeft, ChevronRight, Calendar, Search, FileText } from 'lucide-react';
import { classesData } from '../data/teachersData';

export default function AdminPage({ allRatings }) {
    const navigate = useNavigate();
    const { classId } = useParams();
    const activeView = classId || 'overview'; // 'overview' is default

    // Totals Page States
    const [selectedMonth, setSelectedMonth] = useState('Fevral');
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState(2026);
    const monthDropdownRef = useRef(null);
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

    // Close month dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setIsMonthOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get all unique teachers for the Totals view
    const allTeachersObj = {};
    classesData.forEach(c => {
        c.teachers.forEach(t => {
            allTeachersObj[t] = true;
        });
    });
    const allTeachers = Object.keys(allTeachersObj).sort();

    // Calculate stats for 'Jami Ko'rsatkichlar' (Overview/Totals)
    const getTotalsStats = () => {
        let stats = allTeachers.map(teacher => {
            let totalScore = 0;
            let votes = 0;

            allRatings.forEach(sub => {
                if (sub.ratings[teacher] !== undefined) {
                    totalScore += sub.ratings[teacher];
                    votes++;
                }
            });

            return {
                name: teacher,
                monthlyAverage: votes > 0 ? (totalScore / votes).toFixed(1) : '-',
                votes: votes,
                yearlyTotal: totalScore > 0 ? totalScore.toFixed(1) : '-'
            };
        });

        if (searchQuery) {
            stats = stats.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return stats;
    };

    // Filter submissions for a specific class
    const getClassStats = (currentClassId) => {
        const classSubmissions = allRatings.filter(sub => sub.className === currentClassId);
        const classData = classesData.find(c => c.id === currentClassId);
        const teachers = classData ? classData.teachers : [];

        // Aggregate ratings by teacher
        const teacherStats = teachers.map(teacher => {
            let totalScore = 0;
            let votes = 0;
            classSubmissions.forEach(sub => {
                if (sub.ratings[teacher] !== undefined) {
                    totalScore += sub.ratings[teacher];
                    votes++;
                }
            });

            return {
                name: teacher,
                average: votes > 0 ? (totalScore / votes).toFixed(1) : '-',
                votes: votes
            };
        });

        return teacherStats;
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', backgroundColor: '#f8fafc', zIndex: 1000, overflow: 'hidden' }}>

            {/* Left Sidebar */}
            <div style={{
                width: '280px',
                backgroundColor: 'white',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                flexShrink: 0
            }}>
                {/* Logo Area */}
                <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <LayoutGrid size={20} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>Fikrnoma</h2>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>ADMIN PANEL</span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, overflowY: 'auto' }}>

                    <div>
                        <button
                            onClick={() => navigate('/admin')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem 1.25rem',
                                border: 'none', background: activeView === 'overview' ? 'var(--primary)' : 'transparent',
                                color: activeView === 'overview' ? 'white' : 'var(--text-main)',
                                borderRadius: '12px', cursor: 'pointer', fontWeight: activeView === 'overview' ? '600' : '500',
                                textAlign: 'left', transition: 'all 0.2s', outline: 'none',
                                boxShadow: activeView === 'overview' ? '0 4px 12px rgba(124, 77, 255, 0.3)' : 'none'
                            }}
                        >
                            <FileText size={18} /> Jami Ko'rsatkichlar
                        </button>
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', paddingLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em' }}>
                            <BookOpen size={14} /> SINFLAR
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {classesData.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => navigate(`/admin/class/${c.id}`)}
                                    style={{
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        border: activeView === c.id ? '1px solid var(--primary)' : '1px solid transparent',
                                        background: activeView === c.id ? 'var(--primary-light)' : 'transparent',
                                        color: activeView === c.id ? 'var(--primary)' : 'var(--text-main)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: activeView === c.id ? '600' : '500',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Back to Vote Button */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: 'white',
                            border: '1px dashed #cbd5e1',
                            color: 'var(--text-muted)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            outline: 'none'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <ChevronLeft size={16} /> Ovoz berishga qaytish
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto', backgroundColor: '#f8fafc' }}>

                {/* Header (Lang selection mockup) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50px', padding: '0.25rem', gap: '0.25rem' }}>
                        <div style={{ padding: '0.5rem', color: 'var(--primary)' }}><Globe size={20} /></div>
                        <button style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>UZ</button>
                        <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>RU</button>
                        <button style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', outline: 'none' }}>EN</button>
                    </div>
                </div>

                {/* Content Views */}
                {activeView === 'overview' ? (
                    <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Totals Header & Filters */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ color: 'var(--primary)' }}>
                                        <FileText size={42} strokeWidth={1.5} color="#4f46e5" fill="#e0e7ff" />
                                    </div>
                                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>Jami Ko'rsatkichlar</h1>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.5rem', fontSize: '0.8rem' }}>O'QITUVCHILARNING OYLIK O'RTACHA BALLARI</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Custom Month Dropdown */}
                                <div style={{ position: 'relative' }} ref={monthDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsMonthOpen(!isMonthOpen)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.75rem 1.25rem', borderRadius: '50px',
                                            border: isMonthOpen ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                                            background: 'white', fontWeight: '600', minWidth: '150px',
                                            cursor: 'pointer', outline: 'none', color: '#0f172a',
                                            transition: 'all 0.2s',
                                            boxShadow: isMonthOpen ? '0 0 0 3px var(--primary-light)' : 'none'
                                        }}
                                    >
                                        <span>{selectedMonth}</span>
                                        <ChevronRight size={16} color="var(--text-muted)" style={{ transform: `rotate(${isMonthOpen ? -90 : 90}deg)`, transition: 'transform 0.2s' }} />
                                    </button>

                                    {isMonthOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                            zIndex: 50, overflow: 'hidden', padding: '0.5rem', animation: 'fadeIn 0.2s ease-out'
                                        }}>
                                            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                                                {months.map(m => (
                                                    <div
                                                        key={m}
                                                        onClick={() => { setSelectedMonth(m); setIsMonthOpen(false); }}
                                                        style={{
                                                            padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '8px',
                                                            fontWeight: selectedMonth === m ? '600' : '500',
                                                            color: selectedMonth === m ? 'var(--primary)' : '#475569',
                                                            background: selectedMonth === m ? 'var(--primary-light)' : 'transparent',
                                                            transition: 'all 0.15s'
                                                        }}
                                                        onMouseOver={e => { if (selectedMonth !== m) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                                        onMouseOut={e => { if (selectedMonth !== m) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                    >
                                                        {m}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Search Input */}
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        placeholder="O'qituvchini qidirish..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '50px', border: '1px solid #e2e8f0', width: '250px', outline: 'none', fontWeight: '500', color: '#0f172a' }}
                                    />
                                </div>

                                {/* Year Selector */}
                                <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50px', padding: '0.35rem 0.5rem', gap: '0.25rem' }}>
                                    <button onClick={() => setSelectedYear(y => y - 1)} style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'flex', outline: 'none' }}><ChevronLeft size={16} color="var(--text-muted)" /></button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', padding: '0 0.5rem', color: '#0f172a', fontSize: '0.9rem' }}>
                                        <Calendar size={16} color="var(--primary)" /> {selectedYear}
                                    </div>
                                    <button onClick={() => setSelectedYear(y => y + 1)} style={{ background: 'transparent', border: 'none', padding: '0.25rem', cursor: 'pointer', display: 'flex', outline: 'none' }}><ChevronRight size={16} color="var(--text-muted)" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Complete Teachers Totals Table */}
                        <div className="card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', borderRadius: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'white' }}>
                                        <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', width: '60px', borderBottom: '1px solid #e2e8f0' }}>#</th>
                                        <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>O'QITUVCHI ISMI, SHARIFI</th>
                                        <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '150px', borderBottom: '1px solid #e2e8f0' }}>{selectedMonth.toUpperCase()} BALL</th>
                                        <th style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '150px', borderBottom: '1px solid #e2e8f0' }}>OVOZLAR SONI</th>
                                        <th style={{ padding: '1.5rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', width: '180px', background: 'var(--primary-light)', borderBottom: '1px solid #e2e8f0' }}>YILLIK JAMI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getTotalsStats().length > 0 ? getTotalsStats().map((stat, index) => (
                                        <tr key={index} style={{ borderBottom: index < getTotalsStats().length - 1 ? '1px solid #f1f5f9' : 'none', background: 'white', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{index + 1}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <UserCircle size={18} />
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{stat.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                {stat.monthlyAverage !== '-' ? (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', padding: '0.35rem 0.85rem', borderRadius: '50px' }}>
                                                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                                        <span style={{ fontWeight: '700', color: '#b45309', fontSize: '0.9rem' }}>{stat.monthlyAverage}</span>
                                                    </div>
                                                ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>
                                                {stat.votes}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderLeft: '1px solid #f1f5f9' }}>
                                                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>{stat.yearlyTotal}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                <Search size={32} color="#cbd5e1" strokeWidth={1.5} style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                                                <p style={{ fontWeight: '600', fontSize: '1rem', color: '#475569' }}>Ma'lumot topilmadi</p>
                                                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Boshqa ismni qidirib ko'ring</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Database size={14} />
                                Ma'lumotlar avtomatik ravishda barcha sinflardan yig'ilgan
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <BookOpen size={36} color="var(--primary)" />
                                <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{activeView}</h1>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.5rem', fontSize: '0.875rem' }}>O'QITUVCHILAR FIKRLARI</p>
                        </div>

                        <div className="card" style={{ maxWidth: '100%', padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', borderRadius: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: 'white' }}>
                                        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', width: '50px' }}>#</th>
                                        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>O'QITUVCHI ISMI, SHARIFI</th>
                                        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center', width: '120px' }}>BALL</th>
                                        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textAlign: 'center', width: '150px' }}>OVOZLAR SONI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getClassStats(activeView).length > 0 ? getClassStats(activeView).map((stat, index) => (
                                        <tr key={index} style={{ borderBottom: index < getClassStats(activeView).length - 1 ? '1px solid #f1f5f9' : 'none', background: 'white', transition: 'background-color 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{index + 1}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <UserCircle size={18} />
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{stat.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                                                {stat.average !== '-' ? (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                                                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                                        <span style={{ fontWeight: '700', color: '#b45309', fontSize: '0.9rem' }}>{stat.average}</span>
                                                    </div>
                                                ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>
                                                {stat.votes}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                Bu sinfda o'qituvchilar topilmadi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
