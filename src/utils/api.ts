import * as Cookie from 'js-cookie';
import * as qs from 'querystring';
import { message } from 'antd';
import { getSessionStorage, removeSessionStorage } from '@utils/util';

export const baseUrl = '/api';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getSessionStorage('token')}`
};

const generate = async response => {
  const res = await response;
  let result;
  try {
    result = await res.json();
  } catch (error) {
    if ([200, 204].includes(res.status)) {
      return {};
    }
    message.error('网络异常');
    return null;
  }
  message.destroy();
  switch (res.status) {
    case 200:
    case 204:
      return result || {};
    case 403:
      Cookie.remove('token');
      removeSessionStorage('token');
      location.href = '/#/login';
    default:
      message.error(result.message || '操作失败');
  }
  return null;
};

export const Get = async (url: string, data = {}): Promise<any> => {
  const [actionUrl, params] = url.split('?');
  if (params) {
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
