import { message } from 'antd';
import { getStorage } from '@utils/index';

export const baseUrl = '/api';

const generate = async response => {
  const res = await response;
  const result = await res.json();
  switch (res.status) {
    case 200:
      return result || {};
    case 403:
      location.href = '/#/login';
    default:
      message.error(result.message || '操作失败');
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
      'Authorization': `Bearer ${getStorage('token')}`
    },
  }));
};

export const Post = async (url: string, data): Promise<any> => {
  return generate(fetch(baseUrl + url, {
    method: 'Post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getStorage('token')}`
    },
  }));
};
