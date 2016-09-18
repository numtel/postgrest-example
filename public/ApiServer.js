'use strict';
class ApiServer {
  constructor(url) {
    this.url = url || '';
    this.authToken = null;
  }
  // User account management
  signup(email, pass) {
    return this._request('POST', '/rpc/signup', { email, pass });
  }
  login(email, pass) {
    return this._request('POST', '/rpc/login', { email, pass })
      .then(response => response.json())
      .then(result => {
        // Subsequent requests will use this authorization token
        this.authToken = result.token;
        return result;
      });
  }
  validateEmail(email, token) {
    return this._request('POST', '/rpc/validate_email', { email, token });
  }
  requestPasswordReset(email) {
    return this._request('POST', '/rpc/request_password_reset', { email });
  }
  resetPassword(email, token, pass) {
    return this._request('POST', '/rpc/reset_password', { email, token, pass });
  }
  // Blog management
  createPost(title, body) {
    return this._request('POST', '/posts', { title, body });
  }
  updatePost(id, title, body) {
    return this._request('PATCH', '/posts?id=eq.' + id, { title, body });
  }
  deletePost(id) {
    return this._request('DELETE', '/posts?id=eq.' + id);
  }
  // Blog reading
  getPosts() {
    return this._request('GET', '/posts')
      .then(result => {
        if(!result.ok)
          throw result;
        return result.json();
      });
  }

  _request(method, route, body) {
    const headers = {}

    if(method !== 'GET') {
      headers['Accept'] = 'application/json';
      headers['Content-Type'] = 'application/json';
    }

    if(this.authToken) {
      headers['Authorization'] = 'Bearer ' + this.authToken;
    }

    return fetch(this.url + route, {
      method,
      headers,
      body: typeof body !== 'undefined' ? JSON.stringify(body) : undefined,
    })
    .then(result => {
      if(!result.ok)
        throw result;
      return result;
    });
  }
}

