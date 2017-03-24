const test = require('ava').test;

const ItsLearning = require('../lib/itslearning');
const Organisation = require('../lib/organisation');
const User = require('../lib/user');

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const INSTITUTE = process.env.INSTITUTE;

let authenticatedUser = null;

test.before('Needed environment variables are set', t => {
  t.is(typeof USERNAME, 'string');
  t.is(typeof PASSWORD, 'string');
  t.is(typeof INSTITUTE, 'string');
});

test.cb.before('Can authenticate user', t => {
  ItsLearning.searchOrganisation(INSTITUTE)
  .then(ItsLearning.fetchOrganisation)
  .then(organisation => {
    t.is(organisation instanceof Organisation, true);

    organisation.authenticate(USERNAME, PASSWORD)
    .then(user => {
      authenticatedUser = user;
      t.is(user instanceof User, true);
      t.end();
    })
    .catch(t.fail);
  }).catch(t.fail);
});

test.before('Can\'t access info before .fetchInfo()', t => {
  t.is(typeof authenticatedUser.firstName, 'undefined');
});

test('Can access info after .fetchInfo()', t => {
  authenticatedUser.fetchInfo()
  .then(() => {
    t.is(typeof authenticatedUser.firstName, 'string');
  }).catch(t.fail);
});

test('Fetching unread message count', t => {
  authenticatedUser.fetchUnreadMessagesCount()
  .then(count => {
    t.is(typeof count, 'number');
    t.is(count >= 0, true);
  }).catch(t.fail);
});

test('Fetching unread notification count', t => {
  authenticatedUser.fetchUnreadNotificationsCount()
  .then(count => {
    t.is(typeof count, 'number');
    t.is(count >= 0, true);
  }).catch(t.fail);
});

test('Fetching notifications', t => {
  authenticatedUser.fetchNotifications()
  .then(notifications => {
    t.is(Array.isArray(notifications), true);
    if (notifications.length >= 0) {
      const notification = notifications[0];
      t.is(typeof notification, 'object');
      t.is(typeof notification.id, 'number');
    }
  }).catch(t.fail);
});

test('Fetching news', t => {
  authenticatedUser.fetchNews()
  .then(news => {
    t.is(Array.isArray(news), true);
    if (news.length >= 0) {
      const newsItem = news[0];
      t.is(typeof newsItem, 'object');
      t.is(typeof newsItem.id, 'number');

      authenticatedUser.fetchComments(newsItem.id)
      .then(comments => {
        t.is(Array.isArray(comments), true);
        // TODO check comments item
      });
    }
  }).catch(t.fail);
});

test('Fetching message threads', t => {
  authenticatedUser.fetchMessageThreads()
  .then(threads => {
    t.is(Array.isArray(threads), true);
    if (threads.length >= 0) {
      const threadItem = threads[0];
      t.is(typeof threadItem, 'object');
      t.is(typeof threadItem.id, 'number');
      t.is(Array.isArray(threadItem.messages), true);
      if (threadItem.messages.length >= 0) {
        const message = threadItem.messages[0];
        t.is(typeof message, 'object');
        t.is(typeof message.id, 'number');
      }
    }
  });
});
