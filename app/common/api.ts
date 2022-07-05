import { RequestOptions } from 'types';

import { Environment } from 'common/environment';

export class Api {
  static getUrl(url: string) {
    return `${Environment.Dev.host}${Environment.Dev.apiBase}${url}`;
  }

  static get(url: string, options: RequestOptions) {
    options.url = Api.getUrl(url);
    options.method = 'GET';

    return Api.request(options);
  }

  static post(url: string, options: RequestOptions) {
    options.url = Api.getUrl(url);
    options.method = 'POST';

    return Api.request(options);
  }

  static request({ url, method, data, headers }: RequestOptions) {
    const options: RequestOptions = {
      method,
      headers
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetch(url as string, options);
  }
}
