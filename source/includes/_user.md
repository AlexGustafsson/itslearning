# User

A user is retrieved when authenticating successfully.
The object contains a series of properties.

Property | Availability | Description
---------|--------------|------------
id | always | The numeric id of the user.
firstName | after .fetchInfo() | The user's first name.
lastName | after .fetchInfo() | The user's last name.
language | after .fetchInfo() | The user's language.
profileImage | after .fetchInfo() | A URL to the user's profile image. May be `null`.
calendar | after .fetchInfo() | A URL to the user's personal calendar.
authenticated | always | A bool indicating whether or not the user is currently authenticated.

## Fetching personal information

> Fetching info

```javascript
user.fetchInfo()
.then(() => {
  // the user object has been updated. All properties are now available
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

`undefined`

#### Reject

Error reflecting cause.

## Fetching unread messages count

> Fetching unread messages count

```javascript
user.fetchUnreadMessagesCount()
.then(count => {
  console.log(`There are ${count} unread messages`);
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

Numeric value indicating count.

#### Reject

Error reflecting cause.

## Fetching unread notifications count

> Fetching unread notifications count

```javascript
user.fetchUnreadMessagesCount()
.then(count => {
  console.log(`There are ${count} unread notifications`);
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

Numeric value indicating count.

#### Reject

Error reflecting cause.

## Fetching notifications

> Fetching notifications count

```javascript
user.fetchNotifications()
.then(notifications => {
  // further use of the notifications
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

List containing notifications objects.

Property | Description
---------|------------
id | The numeric id of the notification.
text | Text content of the notification.
date | Date when the notification was published.
author | Object containing information about the author.
type | Type of notification. Values include 'Assessment'.
url | A URL to the notification.
content | A URL to the content of the notification.
isRead | A boolean value representing whether or not the notification has been read.

Property | Description
---------|------------
id | The numeric id of the author.
firstName | The author's first name.
lastName | The author's last name.
profile | A URL to the author's profile
profileImage | A URL to the author's profile image. May be `null`.

#### Reject

Error reflecting cause.

## Fetching news

> Fetching unread notifications count

```javascript
user.fetchNews()
.then(news => {
  // further use of the news
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

List containing news objects.

Property | Description
---------|------------
id | The numeric id of the news.
location | Location of the news within the organisation.
text | Text content of the news.
date | Date when the news was published.
author | Object containing information about the author.
type | Type of news.
contents | Object containing contents.
isRead | A boolean value representing whether or not the notification has been read.

Property | Description
---------|------------
id | The numeric id of the author.
firstName | The author's first name.
lastName | The author's last name.
profile | A URL to the author's profile
profileImage | A URL to the author's profile image. May be `null`.

Property | Description
---------|------------
id | The numeric id of the content.
text | Text of the message. May be `null`.
url | A URL to the message. May be `null`.

#### Reject

Error reflecting cause.

## Fetching comments to news

> Fetching comments to news

```javascript
user.fetchComments(NEWS_ID)
.then(comments => {
  // further use of the comments
}).catch(error => {
  // there was an error with the request
});
```

### Returns Promise

#### Resolve

List containing comments.

#### Reject

Error reflecting cause.
