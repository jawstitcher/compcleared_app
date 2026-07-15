import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { BookOpen } from 'lucide-react';
import '../components/LandingPage.css';

const RESOURCES = [
    {
        slug: 'what-is-sb-553',
        title: 'What is SB 553?',
        summary: 'Plain-English overview of California\'s workplace violence prevention law: who it applies to, what it requires, and when.',
        readTime: '5 min',
        status: 'available',
        content: `California Senate Bill 553, also known as the Workplace Violence Prevention Act, took effect July 1, 2024. It requires almost all California employers to:

1. **Establish, implement, and maintain** a written Workplace Violence Prevention Plan (WVPP)
2. **Maintain workplace violence prevention records** as required for your business
3. **Provide annual training** to all employees on workplace violence prevention
4. **Record workplace violence hazards** specific to their industry and worksite

The law was passed in response to rising workplace violence incidents, particularly in healthcare, retail, and other public-facing industries. Cal/OSHA has enforcement authority and can issue citations for non-compliance.

**Who is exempt?** Limited exemptions include certain healthcare facilities already covered by Cal/OSHA Section 3342, employees working from home, workplaces with fewer than 10 employees that are not accessible to the public, and facilities operated by the Department of Corrections and Rehabilitation.

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
        summary: 'If you already have an Injury and Illness Prevention Program, do you still need a separate Workplace Violence Prevention Plan? Yes.',
        readTime: '3 min',
        status: 'available',
        content: `Many California employers already have an Injury and Illness Prevention Program (IIPP) — Cal/OSHA has required it since 1991. A reasonable question is: do you still need a separate Workplace Violence Prevention Plan (WVPP) under SB 553?

**Yes.** They are separate plans with different content requirements.

**What an IIPP covers:** General workplace hazards — slips, trips, falls, chemical exposure, equipment safety, ergonomic issues. It is required for almost all California employers under Cal/OSHA Section 3203.

**What a WVPP covers:** Specifically workplace violence — the four recognized types (stranger violence, customer/client violence, worker-on-worker violence, personal relationship violence spillover), hazard assessment specific to violence risk, incident response procedures, and post-incident support.

**Can you reference your IIPP in your WVPP?** Yes. A common approach is to have your WVPP supplement your IIPP — they share some administrative scaffolding (responsible person, training system, hazard assessment process) but the WVPP must stand on its own for the violence-specific content.

**Bottom line:** If you only have an IIPP, you are not SB 553 compliant. You need a separate, written WVPP that addresses the 12 required sections specifically.`
    },
    {
        slug: 'training-requirements',
        title: 'Annual Training: What You Actually Have to Cover',
        summary: 'SB 553 requires annual training for every employee. Here is what that training has to include, in plain English.',
        readTime: '5 min',
        status: 'available',
        content: `SB 553 requires initial training when the plan is established, and annual training thereafter, for every employee. The training must be appropriate for the employee's job duties and the workplace hazards they face.

**What the training has to cover:**

1. **Your company's WVPP** — how to access it, what it says, who is responsible
2. **How to report workplace violence** — the specific process at your company
3. **How to get involved** in developing and implementing the plan
4. **Definitions and examples** of workplace violence (the 4 types)
5. **Causes and warning signs** of workplace violence
6. **How to respond** to actual or imminent workplace violence
7. **Resources** for coping with the aftermath of workplace violence (for employees who experience it)

**Initial training** is required when the plan is first established. **Annual refresher** training is required every year after that. **Additional training** is required whenever a new or previously unrecognized workplace violence hazard is identified, or after a violent incident occurs.

**What you must document:**

- Date of training
- Names of employees who attended
- Names/qualifications of the trainer
- Topics covered

Review applicable recordkeeping requirements with qualified counsel. CompCleared's training log helps organize the information you enter.`
    },
    {
        slug: 'incident-log-guide',
        title: 'The Violent Incident Log: A Practical Guide',
        summary: 'The 14 fields Cal/OSHA requires for every workplace violence incident, who fills them out, and how long you keep them.',
        readTime: '6 min',
        status: 'available',
        content: `The Violent Incident Log (VIL) is the most concrete record SB 553 requires. For every workplace violence incident, you must record:

**Required fields (from Cal/OSHA guidance):**

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

**The public-facing version:** SB 553 requires that the VIL, when made available to employees (upon request) or to Cal/OSHA, must NOT include personally identifying information about the individuals involved. This means you need two versions: a complete internal record and a redacted public version.

**Recordkeeping:** Review applicable retention and privacy requirements with qualified counsel.

**How CompCleared helps:** the incident log form captures the information you enter and can generate available PDF exports.`
    },
    {
        slug: 'inspection-prep',
        title: 'What to Do When Cal/OSHA Shows Up',
        summary: 'A Cal/OSHA inspection is not a surprise you want unprepared for. Here is what happens, what they ask for, and what to have ready.',
        readTime: '5 min',
        status: 'available',
        content: `Cal/OSHA inspections are usually triggered by a complaint, a referral (often from another agency), or a programmed inspection of high-hazard industries. For SB 553 specifically, expect increased enforcement after the permanent standard takes effect (statutorily due Dec 31, 2026).

**What an inspector will ask for:**

1. Your written Workplace Violence Prevention Plan (WVPP)
2. Your Violent Incident Log (VIL) for the applicable record period
3. Records of all employee training (initial + annual, for all employees)
4. Documentation of your hazard assessment process
5. Records of any incidents, including corrective actions taken
6. Records of any employee complaints about workplace violence

**What to have ready (the audit bundle):**

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
                        Stop reading. Start complying.
                    </h2>
                    <p style={{ fontSize: '16px', color: '#CBD5E1', marginBottom: '24px' }}>
                        CompCleared generates a customized SB 553 plan in 20 minutes.
                    </p>
                    <button onClick={() => navigate('/signup')} className="btn-cta">
                        Get Started Free
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
