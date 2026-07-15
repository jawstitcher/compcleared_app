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
