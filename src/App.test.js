import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the CompCleared landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Complete Compliance/i })).toBeInTheDocument();
  expect(screen.getByText(/Start for \$19\/month/i)).toBeInTheDocument();
});
