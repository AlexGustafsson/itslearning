# It's Learning API for Node JS
### A fully async API written in ES6 for the It's Learning platform
***
![npm badge](https://img.shields.io/npm/v/itslearning.svg)

### Setting up

##### Installing

```
npm install itslearning
```

##### Quickstart

For full API documentation, please visit the [documentation site](https://alexgustafsson.github.io/itslearning/).

```JavaScript
const ItsLearning = require('itslearning');

// Search for available organisations
ItsLearning.searchOrganisation('Blekinge Tekniska Högskola')
// Retrieve the first match
.then(ItsLearning.fetchOrganisation)
.then(organisation => {
  // Authenticate
  organisation.authenticate('username', 'password')
  .then(user => {
    user.fetchTasks() // returns promise. Resolves with updated user
    user.fetchCourses() // returns promise. Resolves with updated user
    user.fetchPersonalInfo() // returns promise. Resolves with updated user
    user.fetchInfo() //returns promise. Resolves with updated user when the three above functions are resolved
    user.fetchUnreadNotificationsCount() // returns promise. Resolves with a count
    user.fetchUnreadMessagesCount() // returns promise. Resolves with a count
    user.fetchNews() // returns a promise. Resolves with a list of news
    user.fetchComments(id) // returns a promise. Resolves with a list of comments
    user.fetchMessageThreads() // returns a promise. Resolves with a list of message threads
  });
});
```

### Contributing

Any contribution is welcome. If you're not able to code it yourself, perhaps someone else is - so post an issue if there's anything on your mind.

###### Development

Clone the repository:
```
git clone https://github.com/AlexGustafsson/itslearning.git && cd itslearning
```

Set up for development:
```
npm install
```

Follow the conventions enforced:
```
USERNAME='' PASSWORD='' INSTITUTE='' npm test
```

### Disclaimer

_Although the project is very capable, it is not built with production in mind. Therefore there might be complications when trying to use the API for large-scale projects meant for the public. The API was created to easily use the It's Learning service programmatically and as such it might not promote best practices nor be performant. This project is not in any way affiliated with It's Learning._
