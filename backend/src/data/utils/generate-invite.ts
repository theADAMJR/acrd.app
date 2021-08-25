export default function generateInvite(codeLength = 7) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  let result = '';
  for (let i = 0; i < codeLength; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}