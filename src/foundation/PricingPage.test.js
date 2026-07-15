import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from './PricingPage';

test('does not promise unsupported automated product features', () => {
  render(<MemoryRouter><PricingPage /></MemoryRouter>);

  expect(screen.queryByText(/Email alerts on Cal\/OSHA regulatory changes/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/5-year retention of all records/i)).not.toBeInTheDocument();
  expect(screen.getByText(/Manage your subscription through Stripe/i)).toBeInTheDocument();
});
