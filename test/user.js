const test = require('ava').test;

const ItsLearning = require('../lib/itslearning');
const Organisation = require('../lib/organisation');
const User = require('../lib/user');

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const INSTITUTE = process.env.INSTITUTE;

let authenticatedUser = null;

// Executed first to ensure availability later
test.before('Needed environment variables are set', t => {
  t.is(typeof USERNAME, 'string');
  t.is(typeof PASSWORD, 'string');
  t.is(typeof INSTITUTE, 'string');
});

// Authenticate user - used for all following tests
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

test.before('Can\'t access personal info before .fetchPersonalInfo()', t => {
  t.is(authenticatedUser.firstName, null);
});

test.before('Can\'t access courses before .fetchCourses()', t => {
  t.is(authenticatedUser.courses, null);
});

// Ensure that info is available before further format tests
test.cb.before('Can access personal info after .fetchPersonalInfo()', t => {
  authenticatedUser.fetchPersonalInfo()
  .then(user => {
    // Returns itself for easier function chaining
    t.is(user instanceof User, true);
    t.is(typeof authenticatedUser.firstName, 'string');
    t.end();
  }).catch(t.fail);
});

// Ensure that info is available before further format tests
test.cb.before('Can access courses after .fetchCourses()', t => {
  authenticatedUser.fetchCourses()
  .then(user => {
    // Returns itself for easier function chaining
    t.is(user instanceof User, true);
    t.is(Array.isArray(authenticatedUser.courses), true);
    t.end();
  }).catch(t.fail);
});

// Ensure that info is available before further format tests
test.cb.before('Can access tasks after .fetchTasks()', t => {
  authenticatedUser.fetchTasks()
  .then(user => {
    // Returns itself for easier function chaining
    t.is(user instanceof User, true);
    t.is(Array.isArray(authenticatedUser.tasks), true);
    t.end();
  }).catch(t.fail);
});

test('Can fetch info', t => {
  authenticatedUser.fetchInfo()
  .then(user => {
    // Returns itself for easier function chaining
    t.is(user instanceof User, true);
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

test('Courses are parsed correctly', t => {
  t.is(Array.isArray(authenticatedUser.courses), true);
  if (authenticatedUser.courses[0]) {
    const course = authenticatedUser.courses[0];

    t.is(typeof course, 'object');
    t.is(typeof course.id, 'number');
  }
});

test('Tasks are parsed correctly', t => {
  t.is(Array.isArray(authenticatedUser.tasks), true);
  if (authenticatedUser.tasks[0]) {
    const task = authenticatedUser.tasks[0];

    t.is(typeof task, 'object');
    t.is(typeof task.id, 'number');
  }
});
