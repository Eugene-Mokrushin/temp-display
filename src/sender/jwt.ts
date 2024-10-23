import * as crypto from 'crypto';

export function createJwtToken(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secret: string,
): string {
  const toBase64 = (obj: Record<string, unknown>): string => {
    const str = JSON.stringify(obj);
    return Buffer.from(str).toString('base64');
  };

  const replaceSpecialChars = (b64string: string): string => {
    return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
      switch (charToBeReplaced) {
        case '=':
          return '';
        case '+':
          return '-';
        case '/':
          return '_';
        default:
          return ''; // or any other default value you want to return
      }
    });
  };

  const b64Header = replaceSpecialChars(toBase64(header));
  const b64Payload = replaceSpecialChars(toBase64(payload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(b64Header + '.' + b64Payload)
    .digest('base64');
  const jwt = `${b64Header}.${b64Payload}.${replaceSpecialChars(signature)}`;

  return jwt;
}

export function generateToken() {
  // define your header and payload
  const iat = new Date(new Date().toDateString()).valueOf(); // today
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    iat,
  };

  // create the JWT token
  const secret = process.env.GATEWAY_BASIC_TOKEN || '';
  const jwtToken = createJwtToken(header, payload, secret);
  return jwtToken;
}
