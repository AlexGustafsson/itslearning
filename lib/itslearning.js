const axios = require('axios');

const Organisation = require('./organisation');

const USER_AGENT = 'itslearningintapp/2.2.0 (com.itslearning.itslearningintapp; build:117; iOS 10.2.1) Alamofire/4.2.0';

const client = axios.create({
  baseURL: 'https://www.itslearning.com/',
  headers: {'User-Agent': USER_AGENT}
});

class ItsLearning {
  static searchOrganisation(query) {
    return new Promise((resolve, reject) => {
      client.get('restapi/sites/all/organisations/search/v1', {
        params: {
          searchText: query
        }
      }).then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const matches = response.data['EntityArray'].reduce((result, match) => {
          result.push({
            id: match['CustomerId'],
            name: match['SiteName']
          });
          return result;
        }, []);

        resolve(matches);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  static fetchOrganisation(id) {
    if (Array.isArray(id)) {
      if (typeof id[0].id !== 'undefined')
        id = id[0].id;
    }

    return new Promise((resolve, reject) => {
      client.get(`restapi/sites/${id}/v1`)
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        if (response.data === null)
          return reject(new Error('Organisation did not exist'));

        const organisation = new Organisation(response.data);

        resolve(organisation);
      }).catch(error => {
        resolve(error);
      });
    });
  }
}

module.exports = ItsLearning;
