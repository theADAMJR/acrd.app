export default class SessionManager extends Map<string, string> {
  get(clientId: string) {
    const userId = super.get(clientId);
    if (!userId)
      throw new TypeError('User Not Authenticated');

    return userId;
  }
}