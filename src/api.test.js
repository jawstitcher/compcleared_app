import { apiUrl } from './api';

describe('apiUrl', () => {
  const originalApiUrl = process.env.REACT_APP_API_URL;

  afterEach(() => {
    process.env.REACT_APP_API_URL = originalApiUrl;
  });

  test('prefixes API paths with the configured backend URL', () => {
    process.env.REACT_APP_API_URL = 'https://backend.example.com';

    expect(apiUrl('/api/training')).toBe('https://backend.example.com/api/training');
  });

  test('does not duplicate slashes when the backend URL has a trailing slash', () => {
    process.env.REACT_APP_API_URL = 'https://backend.example.com/';

    expect(apiUrl('/api/incidents?company_id=1')).toBe('https://backend.example.com/api/incidents?company_id=1');
  });
});
