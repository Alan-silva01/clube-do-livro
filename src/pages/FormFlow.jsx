
import React, { useState } from 'react';
import Book from '../components/Book/Book';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import { ChevronRight, ChevronLeft, Send, BookOpen } from 'lucide-react';
import './FormFlow.css';

const FormFlow = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        phone: '',
        motivation: '',
        reading_relation: '',
        availability: '',
        group_behavior: '',
        why_match: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Total pages: Cover (0) + 8 Questions (1-8) + Back Cover (9)
    const totalPages = 10;

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const formatPhone = (value) => {
        if (!value) return value;
        const phone = value.replace(/\D/g, '');
        const phoneLen = phone.length;
        if (phoneLen < 3) return phone;
        if (phoneLen < 7) return `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
        return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
    };

    const handleInput = (field, value) => {
        let finalValue = value;
        if (field === 'phone') {
            finalValue = formatPhone(value);
        }
        setFormData(prev => ({ ...prev, [field]: finalValue }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Clean phone for database storage if preferred, 
            // but user asked to show formatted, so we store what they see
            const { error } = await supabase
                .from('candidates')
                .insert([formData]);

            if (error) throw error;

            setIsFinished(true);
            setCurrentPage(totalPages - 1); // Go to last page
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Erro ao enviar. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render content helpers
    const renderInput = (field, placeholder, type = 'text') => (
        <input
            type={type}
            className="input-field"
            placeholder={placeholder}
            value={formData[field]}
            onChange={(e) => handleInput(field, e.target.value)}
        />
    );

    const renderTextarea = (field, placeholder) => (
        <textarea
            className="input-field textarea-field"
            rows={5}
            placeholder={placeholder}
            value={formData[field]}
            onChange={(e) => handleInput(field, e.target.value)}
        />
    );

    const renderOptions = (field, options) => (
        <div className="options-grid">
            {options.map(opt => (
                <button
                    key={opt}
                    className={`option-btn ${formData[field] === opt ? 'selected' : ''}`}
                    onClick={() => handleInput(field, opt)}
                >
                    {opt}
                </button>
            ))}
        </div>
    );

    // Define pages content
    const pagesContext = [
        // Page 0: Cover
        {
            front: (
                <div className="cover-front">
                    {/* Decorations */}
                    <div className="decoration-line-tr"></div>
                    <div className="decoration-line-bl"></div>
                    <div className="side-text-left">What Evolution and Human Nature Imply</div>
                    <div className="side-text-right">About the Meaning of Our Existence</div>

                    <div style={{ zIndex: 5, marginBottom: '1rem' }}>
                        <h1 style={{ fontSize: '3rem', margin: 0 }}>FORMULÁRIO</h1>
                        <p style={{ fontSize: '1.2rem', letterSpacing: '4px', margin: 0 }}>INSCRIÇÃO</p>
                    </div>

                    <img
                        src="https://qytagscqnkioaksbpawc.supabase.co/storage/v1/object/public/livro%20imagens/Logotipo%20Entre%20Letras%20e%20Vinhos.png"
                        alt="Logo"
                        className="logo-img-cover"
                    />

                    <div style={{ zIndex: 5, marginTop: '1rem' }}>
                        <h2 style={{ fontSize: '1.8rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>CLUB LIVRO</h2>
                        <button className="open-btn" onClick={handleNext}>
                            INICIAR
                        </button>
                    </div>
                </div>
            )
        },
        // Page 1: Name
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Dados Básicos</h2>
                    <div>
                        <div className="question-label">1. Nome Completo</div>
                        {renderInput('full_name', 'Seu nome aqui')}
                    </div>
                    <div className="nav-buttons">
                        <span /> {/* Spacer */}
                        <button className="btn-nav" onClick={handleNext}>
                            Próximo <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )
        },
        // Page 2: Age
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Dados Básicos</h2>
                    <div>
                        <div className="question-label">2. Idade</div>
                        {renderInput('age', 'Sua idade', 'number')}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 3: Phone
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Dados Básicos</h2>
                    <div>
                        <div className="question-label">3. WhatsApp</div>
                        {renderInput('phone', '(XX) XXXXX-XXXX', 'tel')}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 4: Motivation
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Perfil</h2>
                    <div>
                        <div className="question-label">4. O que te motivou a entrar?</div>
                        {renderTextarea('motivation', 'Escreva aqui...')}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 5: Reading Relation
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Perfil</h2>
                    <div>
                        <div className="question-label">5. Sua relação com leitura</div>
                        {renderOptions('reading_relation', [
                            'Leio e busco me desenvolver com constância',
                            'Leio às vezes, mas quero aprofundar',
                            'Estou retomando agora',
                            'Ainda não tenho hábito, mas tenho interesse real'
                        ])}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 6: Availability
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Perfil</h2>
                    <div>
                        <div className="question-label">6. Disponibilidade e compromisso</div>
                        {renderOptions('availability', [
                            'Alto',
                            'Médio',
                            'Baixo'
                        ])}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 7: Group Behavior
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Convivência</h2>
                    <div>
                        <div className="question-label">7. Em grupo, você costuma:</div>
                        {renderOptions('group_behavior', [
                            'Ouvir, refletir e contribuir quando faz sentido',
                            'Falar bastante e compartilhar experiências',
                            'Observar mais do que falar'
                        ])}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleNext}>Próximo <ChevronRight size={18} /></button>
                    </div>
                </div>
            )
        },
        // Page 8: Why Match (Final)
        {
            front: (
                <div className="page-content">
                    <h2 className="section-title">Final</h2>
                    <div>
                        <div className="question-label">8. Porque você deveria ocupar uma das 3 vagas do clube?</div>
                        {renderTextarea('why_match', 'Escreva aqui...')}
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-nav" onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>
                        <button className="btn-nav" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Inscrição'} <Send size={18} />
                        </button>
                    </div>
                </div>
            )
        },
        // Page 9: End
        {
            front: (
                <div className="cover-front" style={{ borderLeft: 'none', borderRight: '2px solid var(--color-wine)' }}>
                    <img src={logo} alt="Logo" className="logo-img" style={{ width: '80px' }} />
                    <h2>Obrigado!</h2>
                    <p style={{ marginTop: '1rem' }}>Sua inscrição foi recebida.</p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Entraremos em contato em breve.</p>
                </div>
            )
        }
    ];

    return (
        <div className="form-flow-container">
            <Book pages={pagesContext} currentPage={currentPage} onPageTurn={setCurrentPage} />

            {/* Mobile helpers or background elements could go here */}
        </div>
    );
};

export default FormFlow;
