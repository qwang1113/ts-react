import { message } from 'antd';
import { getCookie } from '@utils/index';

export const baseUrl = '/api';

const generate = async response => {
  const res = await response;
  const result = await res.json();
  switch (result.code) {
    case 200:
      return result.data || {};
    case 403:
      location.href = '/#/login';
    default:
      message.error(result.message);
  }
  return null;
};

export const Get = async (url: string): Promise<any> => {
  return generate(fetch(baseUrl + url));
};

export const Put = async (url: string, data): Promise<any> => {
  return generate(fetch(baseUrl + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookie('token')}`
    },
  }));
};

export const Post = async (url: string, data): Promise<any> => {
  return generate(fetch(baseUrl + url, {
    method: 'Post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCookie('token')}`
    },
  }));
};
