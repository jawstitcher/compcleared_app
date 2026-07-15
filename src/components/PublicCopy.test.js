import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import PricingPage from '../foundation/PricingPage';
import LandingPage from './LandingPage';
import About from './About';
import FAQ from './FAQ';
import ComplianceHub from '../foundation/ComplianceHub';
import Resources from '../foundation/Resources';
import ExposureCheck from '../foundation/ExposureCheck';
import Dashboard from '../foundation/Dashboard';

const renderPage = (Component) => render(<MemoryRouter><Component /></MemoryRouter>);

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

test('public billing copy directs questions to support without promising refunds', () => {
  renderPage(Signup);
  expect(screen.queryByText(/14-day money-back guarantee/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(PricingPage);
  expect(screen.queryByText(/14-day money-back guarantee/i)).not.toBeInTheDocument();
  expect(screen.getByText(/For billing or refund questions, email support@compcleared\.com/i)).toBeInTheDocument();
  cleanup();

  renderPage(TermsOfService);
  expect(screen.queryByText(/14-day money-back guarantee/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/full refund/i)).not.toBeInTheDocument();
  expect(screen.getByText(/with billing or refund questions/i)).toBeInTheDocument();
});

test('terms and privacy material updates are posted on their applicable pages', () => {
  renderPage(TermsOfService);
  expect(screen.queryByText(/announced via email/i)).not.toBeInTheDocument();
  expect(screen.getByText(/material updates.*posted on this page/i)).toBeInTheDocument();
  cleanup();

  renderPage(PrivacyPolicy);
  expect(screen.queryByText(/announced via email/i)).not.toBeInTheDocument();
  expect(screen.getByText(/material updates.*posted on this page/i)).toBeInTheDocument();
});

test('marketing pages do not promise refunds, regulatory email alerts, or unrestricted exports', () => {
  renderPage(LandingPage);
  expect(screen.queryByText(/14-day money-back guarantee/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/export your audit-ready PDF in one click/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(About);
  expect(screen.queryByText(/email alerts when Cal\/OSHA/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(TermsOfService);
  expect(screen.queryByText(/export your data at any time/i)).not.toBeInTheDocument();
  expect(screen.getByText(/PDF exports for available product records/i)).toBeInTheDocument();
});

test('public copy does not promise compliance outcomes, penalties, or Stripe tax handling', () => {
  renderPage(LandingPage);
  expect(screen.queryByText(/helps California small businesses meet SB 553/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cal\/OSHA citations for SB 553 violations start at/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(FAQ);
  fireEvent.click(screen.getByRole('button', { name: /can I cancel/i }));
  expect(screen.queryByText(/14-day money-back guarantee/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(PricingPage);
  expect(screen.queryByText(/applicable taxes are shown by Stripe/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(TermsOfService);
  expect(screen.queryByText(/applicable taxes are shown by Stripe/i)).not.toBeInTheDocument();
});

test('ComplianceHub does not present AI chat as training completion or certification', () => {
  renderPage(ComplianceHub);

  expect(screen.queryByText(/mark training complete/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/training logged/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/SB 553 training record/i)).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /plan & record helper/i })).toBeInTheDocument();
  expect(screen.getByText(/does not create training records or certify training/i)).toBeInTheDocument();
});

test('public pages use available PDF exports and cautious legal language', () => {
  renderPage(LandingPage);
  expect(screen.queryByText(/California-compliant employee handbook/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/updates when labor laws change/i)).not.toBeInTheDocument();
  expect(screen.getAllByText(/available PDF exports/i).length).toBeGreaterThan(0);
  cleanup();

  renderPage(PricingPage);
  expect(screen.queryByText(/all 6 sections/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/audit-ready PDF/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cal\/OSHA model WVPP template/i)).not.toBeInTheDocument();
  expect(screen.getByText(/available PDF exports for product records/i)).toBeInTheDocument();
  cleanup();

  renderPage(Resources);
  expect(screen.queryByText(/start complying/i)).not.toBeInTheDocument();
  expect(screen.getByText(/ready to organize your records/i)).toBeInTheDocument();
  cleanup();

  renderPage(About);
  expect(screen.queryByText(/workplace safety experts/i)).not.toBeInTheDocument();
});

test('readiness check is an educational self-assessment and does not determine legal applicability', () => {
  renderPage(ExposureCheck);

  expect(screen.getByRole('heading', { name: /workplace violence prevention self-assessment/i })).toBeInTheDocument();
  expect(screen.getByText(/may apply.*consult qualified california counsel/i)).toBeInTheDocument();
  expect(screen.queryByText(/is sb 553 a problem for your business/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/annual training is required/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/protects you from civil liability/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/cal\/osha-aligned/i)).not.toBeInTheDocument();
});

test('public content does not promise future Form 300 autofill or dated feature delivery', () => {
  renderPage(LandingPage);

  expect(screen.queryByText(/auto-fill your end-of-year cal\/osha form 300/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/coming q3 2026/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(About);
  expect(screen.queryByText(/coming q3 2026/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/auto-fill end-of-year cal\/osha forms/i)).not.toBeInTheDocument();
});

test('public pages describe the free tool as an educational self-assessment', () => {
  renderPage(PricingPage);

  expect(screen.getByRole('button', { name: /start free self-assessment/i })).toBeInTheDocument();
  expect(screen.getByText(/free educational self-assessment.*5 questions/i)).toBeInTheDocument();
  expect(screen.queryByText(/applicability check/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(Resources);
  expect(screen.getByText(/learn about workplace violence prevention plan considerations/i)).toBeInTheDocument();
});

test('marketing pages do not promote unavailable or planned products', () => {
  renderPage(LandingPage);

  expect(screen.queryByText(/OSHA 300 \/ 300A Injury Logs/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Employee Handbook Generator/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/other tools are planned/i)).not.toBeInTheDocument();
  cleanup();

  renderPage(About);
  expect(screen.queryByText(/planned tools/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/OSHA 300 \/ 300A Injury Logs/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Employee Handbook Generator/i)).not.toBeInTheDocument();
});

test('dashboard calls the incident PDF an export summary, not an audit log', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ success: true, incidents: [], stats: { total_incidents: 0, by_type: [], recent_30_days: 0 }, training_records: [] })
  });

  renderPage(Dashboard);

  expect(await screen.findByRole('button', { name: /export incident summary \(PDF\)/i })).toBeInTheDocument();
  expect(screen.queryByText(/export audit log/i)).not.toBeInTheDocument();
});
