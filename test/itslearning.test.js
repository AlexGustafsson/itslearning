const ItsLearning = require('../lib/itslearning');

const USERNAME = '';
const PASSWORD = '';

const QUERY = '';

ItsLearning.searchOrganisation(QUERY)
.then(ItsLearning.fetchOrganisation)
.then(organisation => {
  organisation.authenticate(USERNAME, PASSWORD).then(user => {
    user.fetchInfo().then(() => {
      console.log(user);
      user.fetchUnreadMessagesCount().then(count => {
        console.log(`There are ${count} unread messages for ${user.name}`);
      }).catch(error => {
        console.log('Could not fetch unread messages count');
        console.log(error);
      });
      user.fetchUnreadNotificationsCount().then(count => {
        console.log(`There are ${count} unread notifications for ${user.name}`);
      }).catch(error => {
        console.log('Could not fetch unread notifications count');
        console.log(error);
      });

      user.fetchNotifications().then(notifications => {
        console.log(notifications[0]);
      }).catch(error => {
        console.log('could not fetch notifications');
        console.log(error);
      });

      user.fetchNews().then(news => {
        console.log(news[0]);
      }).catch(error => {
        console.log('could not fetch news');
        console.log(error);
      });
    }).catch(error => {
      console.log('Could not fetch user info');
      console.log(error);
    });
  }).catch(error => {
    console.log('Could not login');
    console.log(error);
  });
});
