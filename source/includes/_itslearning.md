# ItsLearning

> To use the API, you must first include it

```javascript
const ItsLearning = require('itslearning');
```

To access further functionality, you must first find an organisation to work with.
The API exports two methods, `searchOrganisation` and `fetchOrganisation`.

## Search for organisations

> Searching for an organisation

```javascript
ItsLearning.searchOrganisation('Blekinge Tekniska Högskola')
.then(matches => {
  console.log(`A match was: ${match[0].name} with the id ${match[0].id}`);
}).catch(error => {
  // there was an error with the request
});
```

### Takes

Parameter | Default | Description
----------|---------|------------
query | __required__ | The partial name of an organisation to search for.

### Returns Promise

#### Resolve

List of organisations.

Property | Description
---------|------------
id | numeric id of organisation.
name | The name of the organisation.

#### Reject

Error reflecting cause.

## Fetching an organisation

> Fetching an organisation

```javascript
ItsLearning.fetchOrganisation(640)
.then(organisation => {
  // organisation is an instance of Organisation
}).catch(error => {
  // there was an error with the request
});
```

### Takes

Parameter | Default | Description
----------|---------|------------
id | __required__ | The numeric id for the organisation to fetch.

### Returns Promise

#### Resolve

Organisation object.

#### Reject

Error reflecting cause.
