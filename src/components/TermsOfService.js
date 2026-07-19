import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import './LandingPage.css';

const TermsOfService = () => {
    const navigate = useNavigate();
    return (
        <div className="landing-page" style={{ backgroundColor: '#fff' }}>
            <nav className="landing-nav">
                <div className="nav-content">
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <Logo size="small" />
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
                    </div>
                </div>
            </nav>
            <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', fontFamily: "'Inter', sans-serif", color: '#334155', lineHeight: '1.7' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Terms of Service</h1>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>Effective Date: June 14, 2026 · Last Updated: June 14, 2026</p>

                <p style={{ marginBottom: '24px' }}>
                    These Terms of Service ("Terms") govern your use of CompCleared. By creating an account or
                    using the service, you agree to these Terms. If you do not agree, do not use CompCleared.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>1. Not Legal Advice</h2>
                <p style={{ marginBottom: '16px' }}>
                    <strong>CompCleared provides compliance tools and templates for informational purposes only and does not constitute legal advice.</strong>{' '}
                    Use of this service does not create an attorney-client relationship. CompCleared is not a law firm
                    and does not provide legal representation. Templates reflect best practices as of the date they
                    were generated; we do not guarantee accuracy, completeness, or fitness for any particular purpose.
                    <strong> Consult a California-licensed employment attorney before relying on any generated document.</strong>
                </p>
                <p style={{ marginBottom: '24px' }}>
                    You are responsible for ensuring your Workplace Violence Prevention Plan, training program, and
                    incident log meet all requirements of California Senate Bill 553 (Cal. Lab. Code § 6401.9) and
                    any other applicable law.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>2. Subscriptions and Payment</h2>
                <p style={{ marginBottom: '16px' }}>
                    CompCleared Pro is offered as a recurring subscription ($19/month or $149/year). By providing a
                    payment method, you authorize us to charge the applicable fees.
                </p>
                <p style={{ marginBottom: '16px' }}>
                    <strong>Subscription billing.</strong> Paid plans are purchased through Stripe Checkout and renew
                    according to the plan you select. Prices are shown in USD. Contact support with billing or tax questions.
                </p>
                <p style={{ marginBottom: '16px' }}>
                    <strong>Billing and refund questions.</strong> Email <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a> with billing or refund questions.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>3. Cancellation</h2>
                <p style={{ marginBottom: '16px' }}>
                    You may manage your subscription through Stripe’s secure billing portal.
                </p>
                <p style={{ marginBottom: '24px' }}>
                    For data requests, email <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>4. Acceptable Use</h2>
                <p style={{ marginBottom: '16px' }}>You agree not to:</p>
                <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}>Use CompCleared to store Protected Health Information (PHI) as defined by HIPAA</li>
                    <li style={{ marginBottom: '8px' }}>Upload content that is unlawful, infringing, or that you do not have the right to upload</li>
                    <li style={{ marginBottom: '8px' }}>Attempt to access other users' data or compromise the security of the service</li>
                    <li style={{ marginBottom: '8px' }}>Use the service in any way that violates applicable law</li>
                </ul>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>5. Your Content</h2>
                <p style={{ marginBottom: '24px' }}>
                    You retain all rights to the data and content you upload to CompCleared. We do not claim
                    ownership of your incident records, training records, or generated plans. CompCleared provides
                    PDF exports for available product records; contact support for other data requests.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>6. Limitation of Liability</h2>
                <p style={{ marginBottom: '16px' }}>
                    To the maximum extent permitted by law, CompCleared's total liability arising from or related
                    to your use of the service shall not exceed the greater of (a) the total fees you paid us in
                    the 12 months preceding the claim or (b) $100.
                </p>
                <p style={{ marginBottom: '24px' }}>
                    In no event shall CompCleared be liable for any indirect, incidental, consequential, special,
                    exemplary, or punitive damages, including but not limited to lost profits, lost data, business
                    interruption, regulatory fines, or third-party claims, even if advised of the possibility of
                    such damages.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>7. Disclaimers</h2>
                <p style={{ marginBottom: '24px' }}>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                    PURPOSE, NON-INFRINGEMENT, OR COMPLIANCE WITH ANY LAW OR REGULATION. WE DO NOT WARRANT THAT
                    USE OF THE SERVICE WILL RESULT IN YOUR COMPLIANCE WITH SB 553 OR ANY OTHER LAW.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>8. Indemnification</h2>
                <p style={{ marginBottom: '24px' }}>
                    You agree to indemnify and hold CompCleared harmless from any third-party claim arising from
                    your use of the service, your violation of these Terms, or your non-compliance with SB 553 or
                    any other applicable law.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>9. Dispute Resolution</h2>
                <p style={{ marginBottom: '24px' }}>
                    Any dispute arising from these Terms or your use of CompCleared will be resolved through binding
                    individual arbitration in the county of our principal place of business, except where prohibited
                    by law. You waive any right to participate in a class action. Notwithstanding the foregoing,
                    we reserve the right to seek injunctive relief in court to protect our intellectual property,
                    and to invoke California's anti-SLAPP statute (Cal. Code Civ. Proc. § 425.16) where applicable.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>10. Changes to These Terms</h2>
                <p style={{ marginBottom: '24px' }}>
                    We may update these Terms from time to time. Material updates will be posted on this page.
                    Continued use of CompCleared after the effective date constitutes acceptance of the updated Terms.
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>11. Contact</h2>
                <p style={{ marginBottom: '24px' }}>
                    Questions about these Terms? Email{' '}
                    <a href="mailto:support@compcleared.com" style={{ color: '#2563EB' }}>support@compcleared.com</a>.
                </p>

                {/* Internal launch note: keep legal docs under attorney review as the business matures. */}
            </div>
        </div>
    );
};

export default TermsOfService;
