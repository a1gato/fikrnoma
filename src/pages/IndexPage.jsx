import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, LayoutGrid, Info, Globe } from 'lucide-react';
import { classesData } from '../data/teachersData';
import translations from '../data/translations';

export default function IndexPage({ lang = 'uz', setLang }) {
    const [selectedClass, setSelectedClass] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const t = translations[lang];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedClass) {
            navigate(`/${selectedClass}`);
        }
    };

    const selectedClassName = classesData.find(c => c.id === selectedClass)?.name || t.classPlaceholder;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Language Switcher */}
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

            <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInDown 0.6s ease-out' }}>
                <div className="badge" style={{ marginBottom: '1.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: '700', letterSpacing: '0.05em' }}>
                    <LayoutGrid size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    {t.badge}
                </div>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: '850', letterSpacing: '-0.02em' }}>{t.selectClass}</h1>
                <p className="subtitle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    {t.selectClassDesc}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="card" style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '2.5rem',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                animation: 'fadeInUp 0.6s ease-out',
                overflow: 'visible'
            }}>
                <div className="input-group" style={{ marginBottom: '2rem', position: 'relative' }} ref={dropdownRef}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem', display: 'block' }}>{t.yourClass}</label>

                    {/* Custom Dropdown Trigger */}
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            padding: '1.1rem 1.5rem',
                            border: isOpen ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                            borderRadius: '16px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isOpen ? '0 0 0 4px var(--primary-light)' : 'none'
                        }}
                    >
                        <span style={{ color: selectedClass ? '#0f172a' : 'var(--text-muted)', fontWeight: '600', fontSize: '1.05rem' }}>
                            {selectedClassName}
                        </span>
                        <ChevronRight size={20} color={isOpen ? 'var(--primary)' : 'var(--text-muted)'} style={{ transform: `rotate(${isOpen ? -90 : 90}deg)`, transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    </div>

                    {/* Custom Dropdown Menu */}
                    {isOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '0.75rem',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                            zIndex: 100,
                            padding: '0.5rem',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {classesData.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => { setSelectedClass(c.id); setIsOpen(false); }}
                                        style={{
                                            padding: '1rem 1.25rem',
                                            cursor: 'pointer',
                                            borderRadius: '12px',
                                            fontWeight: selectedClass === c.id ? '700' : '500',
                                            color: selectedClass === c.id ? 'var(--primary)' : '#475569',
                                            background: selectedClass === c.id ? 'var(--primary-light)' : 'transparent',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                        onMouseOver={e => { if (selectedClass !== c.id) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                        onMouseOut={e => { if (selectedClass !== c.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        {c.name}
                                        {selectedClass === c.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn"
                    disabled={!selectedClass}
                    style={{
                        marginTop: '0',
                        width: '100%',
                        padding: '1.25rem',
                        fontSize: '1.1rem',
                        background: selectedClass ? 'var(--primary)' : '#e2e8f0',
                        color: selectedClass ? 'white' : '#94a3b8',
                        borderRadius: '16px',
                        boxShadow: selectedClass ? '0 10px 15px -3px rgba(124, 77, 255, 0.3)' : 'none'
                    }}
                >
                    {t.continue}
                    <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>

                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', justifyContents: 'center' }}>
                    <Info size={16} />
                    <span>{t.classNote}</span>
                </div>
            </form>
        </div>
    );
}
