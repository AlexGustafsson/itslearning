const axios = require('axios');

// User agent for the It's Learning app
const USER_AGENT = 'itslearningintapp/2.2.0 (com.itslearning.itslearningintapp; build:117; iOS 10.2.1) Alamofire/4.2.0';

const accessToken = Symbol('accessToken property');
const refreshToken = Symbol('refreshToken property');
const tokenTimeout = Symbol('tokenTimeout property');
const organisation = Symbol('organisation property');
const client = Symbol('client property');

const id = Symbol('id property');
const firstName = Symbol('firstName property');
const lastName = Symbol('lastName property');
const language = Symbol('language property');
const profileImage = Symbol('profileImage property');
const calendar = Symbol('calendar property');

class User {
  constructor(data) {
    this[accessToken] = data['access_token'];
    this[refreshToken] = data['refresh_token'];
    this[tokenTimeout] = Date.now() + data['expires_in'];
    this[organisation] = data.organisation;

    this[client] = axios.create({
      baseURL: 'https://www.itslearning.com/',
      headers: {'User-Agent': USER_AGENT},
      params: {'access_token': this[accessToken]},
      // Should 'login cookie be used?'
      cookies: {'login': `CustomerId=${this[id]}`}
    });
  }

  fetchInfo() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch user info'));

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/person/v1')
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        this[id] = response.data['PersonId'];
        this[firstName] = response.data['FirstName'];
        this[lastName] = response.data['LastName'];
        this[language] = response.data['Language'];
        this[profileImage] = response.data['ProfileImageUrl'];
        this[calendar] = response.data['iCalUrl'];

        resolve();
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchUnreadMessagesCount() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch messages count'));

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/instantmessages/messagethreads/unread/count/v1')
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        resolve(response.data);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchUnreadNotificationsCount() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch notification count'));

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/notifications/unread/count/v1')
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        resolve(response.data);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchNotifications() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch notifications'));

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/notifications/v1', {
        params: {
          'PageIndex': 0,
          'PageSize': 20
        }
      })
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const notifications = response.data['EntityArray'].reduce((result, notification) => {
          result.push({
            id: notification['NotificationId'],
            text: notification['Text'],
            date: notification['PublishedDate'],
            author: {
              id: notification['PublishedBy']['PersonId'],
              firstName: notification['PublishedBy']['FirstName'],
              lastName: notification['PublishedBy']['LastName'],
              profile: notification['PublishedBy']['ProfileUrl'],
              profileImage: notification['PublishedBy']['ProfileImageUrl']
            },
            type: notification['Type'],
            url: notification['Url'],
            content: notification['ContentUrl'],
            isRead: notification['IsRead']
          });
          return result;
        }, []);

        resolve(notifications);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchNews() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch news'));

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/notifications/stream/v1', {
        params: {
          'PageIndex': 0,
          'PageSize': 20
        }
      })
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const news = response.data['EntityArray'].reduce((result, news) => {
          const formatted = {
            id: news['NotificationId'],
            location: news['LocationTitle'],
            text: news['Text'],
            date: news['PublishedDate'],
            author: {
              id: news['PublishedBy']['PersonId'],
              firstName: news['PublishedBy']['FirstName'],
              lastName: news['PublishedBy']['LastName'],
              profile: news['PublishedBy']['ProfileUrl'],
              profileImage: news['PublishedBy']['ProfileImageUrl']
            },
            type: news['Type'],
            url: news['Url'],
            contents: {
              id: null,
              text: null,
              url: news['ContentUrl']
            }
          };
          if (news['LightBulletin']) {
            formatted.contents.id = news['LightBulletin']['LightBulletinId'];
            formatted.contents.text = news['LightBulletin']['Text'];
          }
          result.push(formatted);
          return result;
        }, []);

        resolve(news);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchComments(id) {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch comments'));

    return new Promise((resolve, reject) => {
      this[client].get(`restapi/personal/lightbulletins/${id}/comments/v1`, {
        params: {
          'PageIndex': 0,
          'PageSize': 20
        }
      })
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        resolve(response.data);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  fetchMessageThreads(options) {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch comments'));

    options = Object.assign({
      maxThreadCount: 10,
      query: null,
      pageIndex: 0,
      pageSize: 20
    }, options);

    function formatMessage(message) {
      const formatted = {
        id: message['MessageId'],
        threadId: message['MessageThreadId'],
        created: message['Created'],
        author: {
          id: message['CreatedBy'],
          name: message['CreatedByName'],
          profileImage: message['CreatedByAvatar']
        },
        text: message['Text'],
        attachment: null
      };

      if (message['AttachmentUrl']) {
        formatted.attachment = {
          url: message['AttachmentUrl'],
          name: message['AttachmentName']
        };
      }

      return formatted;
    }

    function formatParticipant(participant) {
      const formatted = {
        id: participant['PersonId'],
        firstName: participant['FirstName'],
        lastName: participant['LastName'],
        profile: participant['ProfileUrl'],
        profileImage: participant['ProfileImageUrl']
      };

      return formatted;
    }

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/instantmessages/messagethreads/v1', {
        params: {
          'maxThreadCount': options.maxThreadCount,
          'threadPage': options.pageIndex,
          'maxMessages': options.pageSize,
          'searchText': options.query
        }
      })
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const threads = response.data['EntityArray'].reduce((result, thread) => {
          result.push({
            id: thread['InstantMessageThreadId'],
            name: thread['Name'],
            created: thread['Created'],
            type: thread['Type'],
            messages: thread['Messages']['EntityArray'].reduce((result, message) => {
              result.push(formatMessage(message));
              return result;
            }, []),
            lastMessage: formatMessage(thread['LastMessage']),
            matchedMessageIds: thread['MatchingMessageIds'],
            participants: thread['Participants'].reduce((result, participant) => {
              result.push(formatParticipant(participant));
              return result;
            }, []),
            lastReadMessageId: thread['LastReadInstantMessageId']
          });
          return result;
        }, []);

        resolve(threads);
      }).catch(error => {
        resolve(error);
      });
    });
  }

  get id() {
    return this[id];
  }

  get firstName() {
    return this[firstName];
  }

  get lastName() {
    return this[lastName];
  }

  get langauge() {
    return this[language];
  }

  get profileImage() {
    return this[profileImage];
  }

  get calendar() {
    return this[calendar];
  }

  get authenticated() {
    return (this[accessToken] && Date.now() <= this[tokenTimeout]);
  }
}

module.exports = User;
