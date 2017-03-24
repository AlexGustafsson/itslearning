const ItsLearning = require('./lib/itslearning');

ItsLearning.searchOrganisation('Blekinge tekniska högskola')
.then(ItsLearning.fetchOrganisation)
.then(organisation => {
  console.log(typeof organisation.id);
});

module.exports = ItsLearning;
