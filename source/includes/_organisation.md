# Organisation

An organisation is retrieved when calling `ItsLearning.fetchOrganisation` successfully.
The object contains a series of properties.

Property | Description
---------|------------
name | The name of the organisation.
shortName | A shorter name for the organisation. May be `null`.
id | The numeric id of the organisation.
url | A url to the organisation's It's Learning site.

```javascript
console.log(`Organisation '${organisation.name}' (${organisation.shortName}) has id '${organisation.id}' and url '${organisation.url}'``);
```

To access further functionality, one must authenticate as a user of the organisation. THis is done by calling the `authenticate` function.

## Authenticating as a user

> Authenticating

```javascript
organisation.authenticate('username', 'password')
.then(user => {
  // further use
}).catch(error => {
  // there was an error with the request
})
```

### Takes

Parameter | Default | Description
----------|---------|------------
username | __required__ | The username to use when authenticating.
password | __required__ | The password to use when authenticating.

### Returns Promise

#### Resolve

User object.

#### Reject

Error reflecting cause.
