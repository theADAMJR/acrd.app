const messages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  429: 'You are being rate limited',
  500: 'We made an oopsie',
};

export class APIError extends TypeError {
  constructor(public code: number, message = messages[code]) {
    super(message);
  }
}
