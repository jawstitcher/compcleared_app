import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the CompCleared landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /California workplace violence prevention, organized/i })).toBeInTheDocument();
  expect(screen.getAllByText(/Start CompCleared Pro · \$19\/mo/i).length).toBeGreaterThan(0);
});
