import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import PricingPage from '../foundation/PricingPage';
import LandingPage from './LandingPage';
import About from './About';
import FAQ from './FAQ';

const renderPage = (Component) => render(<MemoryRouter><Component /></MemoryRouter>);

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
