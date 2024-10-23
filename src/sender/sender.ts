import { RequestOptions } from 'https';
import * as https from 'https';
import { generateToken } from './jwt';

export const makeRequest = (
  body: string,
  options: RequestOptions,
  callback: (error: Error | null, response?: any) => void,
) => {
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    let responseData = '';

    res.on('data', (d) => {
      responseData += d;
    });

    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        callback(null, {
          statusCode: res.statusCode,
          body: responseData,
        });
      } else {
        const error = new Error(
          `Request failed with status code ${res.statusCode}`,
        );
        console.error(error);
        callback(error);
      }
    });
  });

  req.on('error', (error) => {
    console.error(error);
    callback(error);
  });

  req.write(body);
  req.end();
};

export const handler = async (event: any) => {
  return new Promise((resolve, reject) => {
    const body = event.messages[0].details.message.body;
    const token = generateToken();
    const hostname = process.env.GATEWAY_HOST;

    const options: RequestOptions = {
      hostname: hostname,
      port: 443,
      path: '/api/v2/telegram/send_message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Authorization: `Bearer ${token}`,
      },
    };

    makeRequest(body, options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
