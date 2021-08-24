export const headers = () => ({
  'Authorization': `Bearer ${token()}`,
});

export const token = () => localStorage.getItem('token');