
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import './Admin.css';

const Admin = () => {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchCandidates();
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchCandidates();
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchCandidates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('candidates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) setError(error.message);
        else setCandidates(data);
        setLoading(false);
    };

    const handleShareAll = () => {
        if (candidates.length === 0) return;

        let report = `*RELATÓRIO GERAL - CLUBE DO LIVRO*\n`;
        report += `Total de Inscritas: ${candidates.length}\n`;
        report += `----------------------------------------\n\n`;

        candidates.forEach((c, index) => {
            report += `*CANDIDATA Nº ${index + 1}*\n`;
            report += `*1. Nome Completo:* ${c.full_name.toUpperCase()}\n`;
            report += `*2. Idade:* ${c.age} anos\n`;
            report += `*3. WhatsApp:* ${c.phone}\n`;
            report += `*4. O que te motivou a entrar?*\n${c.motivation}\n`;
            report += `*5. Sua relação com leitura:* ${c.reading_relation}\n`;
            report += `*6. Disponibilidade e compromisso:* ${c.availability}\n`;
            report += `*7. Em grupo, você costuma:* ${c.group_behavior}\n`;
            report += `*8. Porque você deveria ocupar uma das 3 vagas do clube?*\n${c.why_match}\n\n`;
        });

        report += `----------------------------------------`;

        const encodedReport = encodeURIComponent(report);
        window.open(`https://wa.me/?text=${encodedReport}`, '_blank');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) alert(error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleDeleteCandidate = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta inscrição?')) return;

        const { error } = await supabase
            .from('candidates')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            setCandidates(prev => prev.filter(c => c.id !== id));
        }
    };

    if (!session) {
        return (
            <div className="admin-container login-view">
                <div className="login-card">
                    <img src={logo} alt="Logo" className="admin-logo" />
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="admin-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            className="admin-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="admin-btn" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container dashboard-view">
            <header className="admin-header">
                <div className="header-left">
                    <img src={logo} alt="Logo" className="header-logo" />
                    <h1>Painel de Inscrições</h1>
                </div>
                <div className="header-actions">
                    <button onClick={handleShareAll} className="share-all-btn">
                        Compartilhar Tudo no WhatsApp
                    </button>
                    <button onClick={handleLogout} className="logout-btn">Sair</button>
                </div>
            </header>

            <div className="content-area">
                {loading ? (
                    <p>Carregando dados...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="candidates-list">
                        {candidates.length === 0 ? (
                            <p>Nenhuma inscrição encontrada.</p>
                        ) : (
                            candidates.map((candidate) => (
                                <div key={candidate.id} className="candidate-card">
                                    <div className="card-header">
                                        <div className="card-header-main">
                                            <h3>{candidate.full_name}</h3>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteCandidate(candidate.id)}
                                                title="Excluir Inscrição"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                        <span className="timestamp">
                                            {new Date(candidate.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Idade:</strong> {candidate.age}</p>
                                        <p>
                                            <strong>WhatsApp:</strong>{" "}
                                            <a
                                                href={`https://wa.me/55${candidate.phone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="whatsapp-link"
                                            >
                                                {candidate.phone}
                                            </a>
                                        </p>
                                        <p><strong>Relação c/ Leitura:</strong> {candidate.reading_relation}</p>
                                        <p><strong>Disponibilidade:</strong> {candidate.availability}</p>

                                        <details>
                                            <summary>Ver Respostas Detalhadas</summary>
                                            <div className="details-content">
                                                <p><strong>Motivação:</strong> {candidate.motivation}</p>
                                                <p><strong>Comportamento em Grupo:</strong> {candidate.group_behavior}</p>
                                                <p><strong>Por que combina:</strong> {candidate.why_match}</p>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
