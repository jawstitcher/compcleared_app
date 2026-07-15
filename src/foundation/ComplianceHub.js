import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { FileText, AlertTriangle, MessageSquare, Send, User } from 'lucide-react';
import './ComplianceHub.css';

const ComplianceHub = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'I am the CompCleared Plan & Record Helper. I can help you find and organize information in your workplace violence prevention materials. I do not provide legal advice or certify training.' }
    ]);
    const [input, setInput] = useState('');
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
            let botText = "You can use this workspace to locate the relevant plan materials and organize the information you enter. Review your organization's procedures and consult qualified counsel for guidance on applicable requirements.";

            if (input.toLowerCase().includes('emergency') || input.toLowerCase().includes('911')) {
                botText = "If there is an emergency, contact emergency services when it is safe to do so and follow your organization's procedures. You can organize incident information here afterward.";
            } else if (input.toLowerCase().includes('evacuation') || input.toLowerCase().includes('escape')) {
                botText = "Refer to your organization's written procedures for evacuation and emergency response. This helper can help you locate and organize related plan materials.";
            }

            const botMsg = { id: messages.length + 2, sender: 'bot', text: botText };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="hub-container">
            <nav className="hub-nav">
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Logo size="small" />
                    <span className="hub-title">Employee Record Organization Hub</span>
                </div>
                <button className="btn-outline-sm" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </nav>

            <div className="hub-grid">
                {/* Left Column: Actions */}
                <div className="hub-actions">
                    <div className="action-card plan-card">
                        <div className="icon-wrapper"><FileText size={32} /></div>
                        <h3>Workplace Violence Prevention Plan</h3>
                        <p>Review the workplace violence prevention materials for your location.</p>
                        <button className="btn-action" onClick={() => alert("Opening PDF Generator...")}>View My Plan (PDF)</button>
                    </div>

                    <div className="action-card report-card">
                        <div className="icon-wrapper"><AlertTriangle size={32} /></div>
                        <h3>Report an Incident</h3>
                        <p>Log a threat or violent act immediately.</p>
                        <button className="btn-action btn-danger" onClick={() => navigate('/dashboard')}>Report Incident</button>
                    </div>
                </div>

                {/* Right Column: AI helper */}
                <div className="hub-chat">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <MessageSquare size={20} />
                            <div>
                                <h3>Plan &amp; Record Helper</h3>
                                <div className="online-status"><span className="dot"></span> Online</div>
                            </div>
                        </div>
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
                                placeholder="Ask about your plan or records..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={!input.trim()}><Send size={18} /></button>
                        </form>
                        <p className="legal-disclaimer">
                            This helper does not create training records or certify training. Review applicable requirements with qualified counsel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceHub;
