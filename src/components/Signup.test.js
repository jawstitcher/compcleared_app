import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from './Signup';

test('includes cookies when verifying a returning Stripe checkout session', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: async () => ({ success: false }),
  });
  window.history.pushState({}, '', '/signup?session_id=cs_test&company_id=7');

  render(<MemoryRouter><Signup /></MemoryRouter>);

  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('/api/verify-session?session_id=cs_test&company_id=7'),
    { credentials: 'include' },
  );
  fetchMock.mockRestore();
});

test('signup page has one main landmark and accessible plan choices', () => {
  window.history.pushState({}, '', '/signup');
  render(<MemoryRouter><Signup /></MemoryRouter>);

  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByRole('radio', { name: /monthly/i })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: /annual/i })).toBeChecked();
});
