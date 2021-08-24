export const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
};

export const token = localStorage.getItem('token');