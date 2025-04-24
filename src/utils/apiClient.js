export const apiClient = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('Erro na requisição.');
  }

  return response.json();
};