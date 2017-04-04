const querystring = require('querystring');
const axios = require('axios');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const User = require('./user');

// User agent for the It's Learning app
const USER_AGENT = 'itslearningintapp/2.2.0 (com.itslearning.itslearningintapp; build:117; iOS 10.2.1) Alamofire/4.2.0';

// Id used across requests as client id of the It's Learning app
const CLIENT_ID = '10ae9d30-1853-48ff-81cb-47b58a325685';

const id = Symbol('id property');
const name = Symbol('name property');
const shortName = Symbol('shortName property');
const url = Symbol('url property');
const client = Symbol('client property');

class Organisation {
  constructor(data) {
    this[id] = data['CustomerId'];
    this[name] = data['Title'];
    this[shortName] = data['ShortName'];
    this[url] = data['BaseUrl'];

    this[client] = axios.create({
      baseURL: this[url],
      headers: {'User-Agent': USER_AGENT},
      cookies: {'login': `CustomerId=${this[id]}`}
    });
  }

  authenticate(username, password) {
    return new Promise((resolve, reject) => {
      this[client].post('restapi/oauth2/token', querystring.stringify({
        'client_id': CLIENT_ID,
        'grant_type': 'password',
        password,
        username
      }).replace(/\(/g, '%28').replace(/\)/g, '%29')).then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const data = Object.assign(response.data, {organisation: this});
        const user = new User(data);

        resolve(user);
      }).catch(reject);
    });
  }

  get id() {
    return this[id];
  }

  get name() {
    return this[name];
  }

  get shortName() {
    return this[shortName];
  }

  get url() {
    return this[url];
  }
}

module.exports = Organisation;
