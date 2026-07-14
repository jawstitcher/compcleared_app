const DEFAULT_API_URL = 'http://localhost:5000';

export const getApiBaseUrl = () => {
    const configuredUrl = process.env.REACT_APP_API_URL || DEFAULT_API_URL;
    return configuredUrl.replace(/\/$/, '');
};

export const apiUrl = (path) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
};
