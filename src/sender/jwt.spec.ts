import * as jwt from 'jsonwebtoken';
import { createJwtToken, generateToken } from './jwt';

const secret = 'test-secret';

describe('createJwtToken', () => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { foo: 'bar' };

  it('should return a valid JWT token and signature should be valid too.', () => {
    const jwtToken = createJwtToken(header, payload, secret);
    const decoded = jwt.decode(jwtToken) as Record<string, unknown>;
    expect(decoded).toHaveProperty('foo', 'bar');
    expect(() => {
      jwt.verify(jwtToken, secret);
    }).not.toThrow();
  });
});

describe('generateToken', () => {
  let originalSecret: string;
  const secret = 'test-secret';

  beforeAll(() => {
    originalSecret = process.env.GATEWAY_BASIC_TOKEN || '';
  });

  afterAll(() => {
    process.env.GATEWAY_BASIC_TOKEN = originalSecret;
  });
  it('should return a valid JWT token.', () => {
    process.env.GATEWAY_BASIC_TOKEN = secret;
    const token = generateToken();
    expect(() => {
      jwt.verify(token, secret);
    }).not.toThrow();
  });
});
