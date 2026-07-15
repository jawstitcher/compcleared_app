import { render, waitFor } from '@testing-library/react';
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
