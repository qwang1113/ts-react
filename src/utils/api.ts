import * as qs from 'querystring';
import { message } from 'antd';
import { getStorage } from '@utils/index';

export const baseUrl = '/api';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getStorage('token')}`
};

const generate = async response => {
  const res = await response;
  let result;
  try {
    result = await res.json();
  } catch (error) {
    message.destroy();
    message.error('网络异常');
    return null;
  }
  switch (res.status) {
    case 200:
      return result || {};
    case 403:
      document.cookie = '';
      sessionStorage.clear();
      location.href = '/#/login';
    default:
      message.destroy();
      message.error(result.message || '操作失败');
  }
  return null;
};

export const Get = async (url: string, data = {}): Promise<any> => {
  const [actionUrl, params] = url.split('?');
  if(params){
    Object.assign(data, qs.parse(params));
  }
  return generate(fetch(baseUrl + actionUrl + '?' + qs.stringify(data), {
    method: 'GET',
    headers,
  }));
};

export const Put = async (url: string, data): Promise<any> => {
  return generate(fetch(baseUrl + url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers,
  }));
};

export const Post = async (url: string, data): Promise<any> => {
  return generate(fetch(baseUrl + url, {
    method: 'Post',
    body: JSON.stringify(data),
    headers,
  }));
};
