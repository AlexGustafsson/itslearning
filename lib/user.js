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
const courses = Symbol('courses property');
const tasks = Symbol('tasks property');

class User {
  constructor(data) {
    this[accessToken] = data['access_token'];
    this[refreshToken] = data['refresh_token'];
    this[tokenTimeout] = Date.now() + data['expires_in'];
    this[organisation] = data.organisation;

    this[courses] = null;
    this[tasks] = null;

    this[id] = null;
    this[firstName] = null;
    this[lastName] = null;
    this[language] = null;
    this[profileImage] = null;
    this[calendar] = null;

    this[client] = axios.create({
      baseURL: 'https://www.itslearning.com/',
      headers: {'User-Agent': USER_AGENT},
      params: {'access_token': this[accessToken]},
      // Should 'login cookie be used?'
      cookies: {'login': `CustomerId=${this[id]}`}
    });
  }

  fetchPersonalInfo() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch user info'));

    // Personal info is not expected to change between calls, therefore it is not cached
    if (this[id] !== null)
      return Promise.resolve(this);

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

        resolve(this);
      }).catch(reject);
    });
  }

  fetchCourses() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch user info'));

    // Courses are not expected to change between calls, therefore they are cached
    if (this[courses] !== null)
      return Promise.resolve(this[courses]);

    return new Promise((resolve, reject) => {
      this[client].get('restapi/personal/courses/v1')
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const formattedCourses = response.data['EntityArray'].map(course => {
          return {
            id: course['CourseId'],
            name: course['Title'],
            updated: course['LastUpdatedUtc'],
            notificationCount: course['NewNotificationsCount'],
            newsCount: course['NewBulletinsCount'],
            url: course['Url'],
            color: course['CourseColor']
          };
        });

        this[courses] = formattedCourses;

        resolve(this);
      }).catch(reject);
    });
  }

  fetchTasks() {
    if (!this.authenticated)
      return Promise.reject(new Error('Must be authenticated to fetch user info'));

    // Tasks are not expected to change between calls, therefore they are cached
    if (this[tasks] !== null)
      return Promise.resolve(this[tasks]);

    return new Promise((resolve, reject) => {
      this[client].get('/restapi/personal/tasks/v1')
      .then(response => {
        if (response.status !== 200)
          return reject(new Error('Request failure'));

        const formattedTasks = response.data['EntityArray'].map(task => {
          return {
            id: task['TaskId'],
            name: task['Title'],
            description: task['Description'],
            courseName: task['LocationTitle'],
            status: task['Status'],
            deadline: task['Deadline'],
            url: task['Url'],
            content: task['ContentUrl'],
            icon: task['IconUrl'],
            elementId: task['ElementId'],
            type: task['ElementType']
          };
        });

        this[tasks] = formattedTasks;

        resolve(this);
      }).catch(reject);
    });
  }

  fetchInfo() {
    return new Promise((resolve, reject) => {
      Promise.all([this.fetchPersonalInfo, this.fetchCourses, this.fetchTasks])
      .then(() => resolve(this))
      .catch(reject);
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
      }).catch(reject);
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
      }).catch(reject);
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

        const notifications = response.data['EntityArray'].map(notification => {
          return {
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
          };
        });

        resolve(notifications);
      }).catch(reject);
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

        const news = response.data['EntityArray'].map(news => {
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
          return news;
        });

        resolve(news);
      }).catch(reject);
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
      }).catch(reject);
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

        const threads = response.data['EntityArray'].map(thread => {
          return {
            id: thread['InstantMessageThreadId'],
            name: thread['Name'],
            created: thread['Created'],
            type: thread['Type'],
            messages: thread['Messages']['EntityArray'].map(formatMessage),
            lastMessage: formatMessage(thread['LastMessage']),
            matchedMessageIds: thread['MatchingMessageIds'],
            participants: thread['Participants'].map(formatParticipant),
            lastReadMessageId: thread['LastReadInstantMessageId']
          };
        });

        resolve(threads);
      }).catch(reject);
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

  get language() {
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

  get courses() {
    return this[courses];
  }

  get tasks() {
    return this[tasks];
  }
}

module.exports = User;
