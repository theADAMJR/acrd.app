export const loggedIn = (req, res, next) => {
  const auth = req.get('Authorization');
  if (
};