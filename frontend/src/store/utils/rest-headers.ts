export const getHeaders = () => ({
  'Authorization': `Bearer ${token()}`,
});

export const token = () => localStorage.getItem('token');