
class ApiServer {
  constructor(url) {
    this.url = url || '';
    this.authToken = null;
  }
  signup(email, pass) {
    return this._postJson('/rpc/signup', { email, pass });
  }
  login(email, pass) {
    return this._postJson('/rpc/login', { email, pass })
      .then(response => response.json())
      .then(result => {
        this.authToken = result.token;
        return result;
      });
  }
  validateEmail(email, token) {
    return this._postJson('/rpc/validate_email', { email, token });
  }
  requestPasswordReset(email) {}
  resetPassword(email, token, password) {}

  _postJson(route, body) {
    return fetch(this.url + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(result => {
      if(!result.ok)
        throw result;
      return result;
    });
  }
}

