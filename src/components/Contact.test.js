import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

test('opens an email to support instead of showing a false submission success', () => {
  delete window.location;
  window.location = { href: '' };
  render(<MemoryRouter><Contact /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Need billing help' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }));
  expect(window.location.href).toContain('mailto:support@compcleared.com');
  expect(screen.queryByText('Message Received')).not.toBeInTheDocument();
});
