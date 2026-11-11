import api from './axios';

export const authApi = {
    resolveSchool: (slug) =>
        api.get('/tenants/resolve', {
            params: { slug },
        }),

    login: (credentials) =>
        api.post('/auth/login', credentials),

    me: () =>
        api.get('/auth/me'),

    csrf: () =>
        api.get('/auth/csrf'),

    logout: (csrfToken) =>
        api.post(
            '/auth/logout',
            {},
            {
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
            }
        ),
};