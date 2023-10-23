import { useNavigate } from "react-router-dom";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;


export default class ListAppApiClient {
  constructor() {
    this.base_url =  BASE_API_URL + '/api';
  }
  navigate = useNavigate();
  async request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : null,
      });

      if (response.status === 401) {
        this.navigate('/login');
      }
    }
    catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
  }

  async get(url, query, options) {
    return this.request({method: 'GET', url, query, ...options});
  }

  async post(url, body, options) {
    return this.request({method: 'POST', url, body, ...options});
  }

  async put(url, body, options) {
    return this.request({method: 'PUT', url, body, ...options});
  }

  async delete(url, options) {
    return this.request({method: 'DELETE', url, ...options});
  }
}