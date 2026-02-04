
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
                <button onClick={handleLogout} className="logout-btn">Sair</button>
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
                                        <h3>{candidate.full_name}</h3>
                                        <span className="timestamp">
                                            {new Date(candidate.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Idade:</strong> {candidate.age}</p>
                                        <p><strong>WhatsApp:</strong> {candidate.phone}</p>
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
