const test = require('ava').test;

const ItsLearning = require('../lib/itslearning');
const Organisation = require('../lib/organisation');
const User = require('../lib/user');

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const INSTITUTE = process.env.INSTITUTE;

test.before('Needed environment variables are set', t => {
  t.is(typeof USERNAME, 'string');
  t.is(typeof PASSWORD, 'string');
  t.is(typeof INSTITUTE, 'string');
});

test('Can authenticate user', t => {
  ItsLearning.searchOrganisation(INSTITUTE)
  .then(ItsLearning.fetchOrganisation)
  .then(organisation => {
    t.is(organisation instanceof Organisation, true);
    organisation.authenticate(USERNAME, PASSWORD)
    .then(user => {
      t.is(user instanceof User, true);
    })
    .catch(t.fail);
  }).catch(t.fail);
});

test('Throws when trying to authenticate non-existing user', t => {
  ItsLearning.searchOrganisation(INSTITUTE)
  .then(ItsLearning.fetchOrganisation)
  .then(organisation => {
    t.is(organisation instanceof Organisation, true);
    t.throw(organisation.authenticate('', ''))
    .then(error => t.is(error instanceof Error, true));
  }).catch(t.fail);
});
