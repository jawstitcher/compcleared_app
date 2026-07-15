import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import PricingPage from '../foundation/PricingPage';

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
