import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { FileText, AlertTriangle, MessageSquare, CheckCircle, Send, User } from 'lucide-react';
import './ComplianceHub.css';

const ComplianceHub = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'I am the CompCleared Compliance Assistant. Ask me any question about your workplace safety plan to satisfy your SB 553 interactive training requirement.' }
    ]);
    const [input, setInput] = useState('');
    const [trainingComplete, setTrainingComplete] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: messages.length + 1, sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Response (In production, this hits an LLM endpoint)
        setTimeout(() => {
            let botText = "That is a great question regarding your specific Workplace Violence Prevention Plan. According to Cal/OSHA standards, employees should report such concerns immediately via the 'Report Incident' button on this dashboard. Would you like to know more about the reporting hierarchy?";

            if (input.toLowerCase().includes('emergency') || input.toLowerCase().includes('911')) {
                botText = "In an emergency, your first action must always be to dial 911. After you are safe, please log the incident here.";
            } else if (input.toLowerCase().includes('evacuation') || input.toLowerCase().includes('escape')) {
                botText = "Your specific plan details evacuation routes. Generally, move away from the threat toward the nearest secure exit. Do not return for personal items.";
            }

            const botMsg = { id: messages.length + 2, sender: 'bot', text: botText };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const markTrainingComplete = async () => {
        try {
            const response = await fetch('/api/training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    training_date: new Date().toISOString().split('T')[0],
                    training_type: 'Interactive AI Session',
                    trainer_name: 'CompCleared AI Assistant v2.1',
                    topic_description: 'SB 553 Interactive Q&A: Plan Review and Incident Reporting Protocols',
                    attendee_count: 1
                })
            });

            if (response.ok) {
                setTrainingComplete(true);
            }
        } catch (error) {
            console.error("Failed to log training", error);
        }
    };

    return (
        <div className="hub-container">
            <nav className="hub-nav">
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Logo size="small" />
                    <span className="hub-title">Employee Compliance Hub</span>
                </div>
                <button className="btn-outline-sm" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </nav>

            <div className="hub-grid">
                {/* Left Column: Actions */}
                <div className="hub-actions">
                    <div className="action-card plan-card">
                        <div className="icon-wrapper"><FileText size={32} /></div>
                        <h3>Workplace Violence Prevention Plan</h3>
                        <p>Review the official safety protocols for your location.</p>
                        <button className="btn-action" onClick={() => alert("Opening PDF Generator...")}>View My Plan (PDF)</button>
                    </div>

                    <div className="action-card report-card">
                        <div className="icon-wrapper"><AlertTriangle size={32} /></div>
                        <h3>Report an Incident</h3>
                        <p>Log a threat or violent act immediately.</p>
                        <button className="btn-action btn-danger" onClick={() => navigate('/dashboard')}>Report Incident</button>
                    </div>
                </div>

                {/* Right Column: AI Trainer */}
                <div className="hub-chat">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <MessageSquare size={20} />
                            <div>
                                <h3>Interactive Safety Assistant</h3>
                                <div className="online-status"><span className="dot"></span> Online</div>
                            </div>
                        </div>
                        {!trainingComplete ? (
                            <button className="btn-complete" onClick={markTrainingComplete}>
                                Mark Training Complete
                            </button>
                        ) : (
                            <div className="completion-badge">
                                <CheckCircle size={16} /> Training Logged
                            </div>
                        )}
                    </div>

                    <div className="chat-body">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' && <div className="bot-avatar"><Logo size="small" /></div>}
                                <div className="message-content">
                                    {msg.text}
                                </div>
                                {msg.sender === 'user' && <div className="user-avatar"><User size={16} /></div>}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <form onSubmit={handleSend} className="chat-input-container">
                            <input
                                type="text"
                                placeholder="Ask a question about the safety plan..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={!input.trim()}><Send size={18} /></button>
                        </form>
                        <p className="legal-disclaimer">
                            Interactions are logged for compliance purposes (SB 553 Training Record).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceHub;
