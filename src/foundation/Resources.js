import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { BookOpen } from 'lucide-react';
import '../components/LandingPage.css';

const RESOURCES = [
    {
        slug: 'what-is-sb-553',
        title: 'What is SB 553?',
        summary: 'Plain-English overview of California workplace violence prevention rules and questions employers may need to evaluate.',
        readTime: '5 min',
        status: 'available',
        content: `California Senate Bill 553, also known as the Workplace Violence Prevention Act, took effect July 1, 2024. Depending on their circumstances, California employers may need to evaluate whether they should:

1. **Establish, implement, and maintain** a written Workplace Violence Prevention Plan (WVPP)
2. **Maintain workplace violence prevention records** that may apply to their business
3. **Provide annual training** to all employees on workplace violence prevention
4. **Record workplace violence hazards** specific to their industry and worksite

The law was passed in response to rising workplace violence incidents, particularly in healthcare, retail, and other public-facing industries. Cal/OSHA has enforcement authority and can issue citations for non-compliance.

**Who may be exempt?** Exemptions may apply in limited circumstances, including certain healthcare facilities already covered by other Cal/OSHA rules, employees working from home, some workplaces with fewer than 10 employees that are not accessible to the public, and some correctional facilities. Review current official materials and qualified counsel for your circumstances.

For advice about requirements, enforcement, or potential penalties, consult current Cal/OSHA materials and qualified counsel. This general information is not legal advice.`
    },
    {
        slug: 'penalties-and-fines',
        title: 'Understanding Enforcement Information',
        summary: 'Where to find current Cal/OSHA enforcement information and when to seek legal advice.',
        readTime: '4 min',
        status: 'available',
        content: `Cal/OSHA enforcement policies and penalty schedules can change. Consult current official Cal/OSHA materials and qualified counsel for guidance about how workplace violence prevention rules apply to your business.

CompCleared helps organize plan, training, and incident records; it does not determine legal obligations, predict enforcement, or provide legal advice.`
    },
    {
        slug: 'wvpp-vs-iipp',
        title: 'WVPP vs IIPP: What\'s the Difference?',
        summary: 'Learn about workplace violence prevention plan considerations alongside an Injury and Illness Prevention Program.',
        readTime: '3 min',
        status: 'available',
        content: `Many California employers already have an Injury and Illness Prevention Program (IIPP) — Cal/OSHA has required it since 1991. A reasonable question is: do you still need a separate Workplace Violence Prevention Plan (WVPP) under SB 553?

They may be separate plans with different content considerations.

**What an IIPP can cover:** General workplace hazards — slips, trips, falls, chemical exposure, equipment safety, and ergonomic issues. Review current Cal/OSHA materials and qualified counsel about whether it applies to your workplace.

**What a WVPP covers:** Specifically workplace violence — the four recognized types (stranger violence, customer/client violence, worker-on-worker violence, personal relationship violence spillover), hazard assessment specific to violence risk, incident response procedures, and post-incident support.

**Can you reference your IIPP in your WVPP?** Some organizations may choose to coordinate these documents because they can share administrative information. Consult current Cal/OSHA materials and qualified counsel about the content that may apply to each plan.

**Bottom line:** If you only have an IIPP, you may need to evaluate whether a separate written WVPP is appropriate for your workplace. Consult current Cal/OSHA materials and qualified counsel about the content that may apply.`
    },
    {
        slug: 'training-requirements',
        title: 'Annual Training: Topics to Review',
        summary: 'Topics California employers may need to consider when reviewing workplace violence prevention training.',
        readTime: '5 min',
        status: 'available',
        content: `California employers may need to provide initial and periodic workplace violence prevention training, depending on their circumstances. Any training should be appropriate for employees' job duties and workplace hazards. Consult current Cal/OSHA materials and qualified counsel about timing and content.

**Topics to consider when reviewing training:**

1. **Your company's WVPP** — how to access it, what it says, who is responsible
2. **How to report workplace violence** — the specific process at your company
3. **How to get involved** in developing and implementing the plan
4. **Definitions and examples** of workplace violence (the 4 types)
5. **Causes and warning signs** of workplace violence
6. **How to respond** to actual or imminent workplace violence
7. **Resources** for coping with the aftermath of workplace violence (for employees who experience it)

Employers may need to revisit training when a plan is established, periodically thereafter, or when workplace conditions change. The applicable triggers can depend on the workplace and current rules.

**Information you may need to document:**

- Date of training
- Names of employees who attended
- Names/qualifications of the trainer
- Topics covered

Review applicable recordkeeping requirements with qualified counsel. CompCleared's training log helps organize the information you enter.`
    },
    {
        slug: 'incident-log-guide',
        title: 'The Violent Incident Log: A Practical Guide',
        summary: 'Information employers may need to consider when organizing workplace violence incident records.',
        readTime: '6 min',
        status: 'available',
        content: `The Violent Incident Log (VIL) is a workplace violence record employers may need to maintain. Depending on the circumstances and applicable rules, an incident record may include:

**Information to consider (review current Cal/OSHA guidance):**

1. Date of incident
2. Time of incident
3. Exact location
4. Type of violence (Type 1-4 classification)
5. Offender classification (stranger, customer, co-worker, etc.)
6. Description of the incident
7. Circumstances (working alone, late hours, isolated location, etc.)
8. Nature of the violence (physical, verbal, threat, weapon, etc.)
9. Consequences (injuries, property damage, etc.)
10. Was law enforcement contacted?
11. Injuries sustained
12. Protective measures taken
13. Employees involved
14. Corrective actions implemented
15. Name and title of person logging the record
16. Date the record was logged

**Sharing records:** Privacy obligations may apply when incident records are shared with employees or agencies. Consult current Cal/OSHA materials and qualified counsel about whether redaction or different versions are appropriate for your records.

**Recordkeeping:** Review applicable retention and privacy requirements with qualified counsel.

**How CompCleared helps:** the incident log form captures the information you enter and can generate available PDF exports.`
    },
    {
        slug: 'inspection-prep',
        title: 'What to Do When Cal/OSHA Shows Up',
        summary: 'Materials an employer may want to organize before reviewing an inspection response with qualified counsel.',
        readTime: '5 min',
        status: 'available',
        content: `Cal/OSHA inspections can be triggered by a complaint, referral, or programmed inspection. Inspection practices and rules may change, so consult current official materials and qualified counsel for your situation.

**Materials an inspector may ask for:**

1. Your written Workplace Violence Prevention Plan (WVPP)
2. Your Violent Incident Log (VIL) for the applicable record period
3. Records of all employee training (initial + annual, for all employees)
4. Documentation of your hazard assessment process
5. Records of any incidents, including corrective actions taken
6. Records of any employee complaints about workplace violence

**Records you may want to organize:**

- Single PDF containing your current WVPP
- Single PDF containing your VIL for the requested period (redacted of PII)
- Single PDF containing your training records (date, attendees, topics, trainer)
- Any hazard assessments or workplace inspection records

**Record organization:** Keeping records organized can make internal review easier. CompCleared provides available PDF exports for product records.

For inspection obligations or response guidance, consult current official Cal/OSHA materials and qualified counsel. This resource is not legal advice.`
    }
];

const Resources = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(null);

    return (
        <div className="landing-page" style={{ backgroundColor: '#F8FAFC' }}>
            <nav className="landing-nav">
                <div className="nav-content">
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <Logo size="small" />
                    </div>
                    <div className="nav-buttons">
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Log In</button>
                        <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#EFF6FF', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                        <BookOpen size={14} /> Free resources
                    </div>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                        SB 553, in plain English
                    </h1>
                    <p style={{ fontSize: '18px', color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
                        Practical guides for California employers. No legalese, no upsells, no bait-and-switch.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {RESOURCES.map((r) => (
                        <div
                            key={r.slug}
                            style={{
                                background: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <button
                                onClick={() => setOpen(open === r.slug ? null : r.slug)}
                                style={{
                                    width: '100%',
                                    padding: '24px 28px',
                                    background: 'transparent',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '16px',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                                        {r.title}
                                    </h2>
                                    <p style={{ fontSize: '15px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                                        {r.summary}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{r.readTime}</span>
                                    <span style={{
                                        fontSize: '24px',
                                        color: '#64748B',
                                        transform: open === r.slug ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}>›</span>
                                </div>
                            </button>
                            {open === r.slug && (
                                <div style={{
                                    padding: '0 28px 28px 28px',
                                    color: '#334155',
                                    lineHeight: '1.7',
                                    fontSize: '15px',
                                    whiteSpace: 'pre-wrap',
                                    borderTop: '1px solid #E2E8F0',
                                    paddingTop: '24px'
                                }}>
                                    {r.content}
                                    <div style={{ marginTop: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', fontSize: '13px', color: '#64748B' }}>
                                        This is general information, not legal advice. For your specific situation,
                                        consult a California-licensed employment attorney.
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '60px', padding: '40px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '12px', textAlign: 'center', color: '#fff' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
                        Ready to organize your records?
                    </h2>
                    <p style={{ fontSize: '16px', color: '#CBD5E1', marginBottom: '24px' }}>
                        CompCleared provides plan and record organization tools for your review.
                    </p>
                    <button onClick={() => navigate('/signup')} className="btn-cta">
                        Explore CompCleared Pro
                    </button>
                </div>
            </div>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                        <a href="/about" className="footer-link">About</a>
                        <a href="/contact" className="footer-link">Contact</a>
                        <p>&copy; 2026 CompCleared. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Resources;
