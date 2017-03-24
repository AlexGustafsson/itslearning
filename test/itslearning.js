const test = require('ava').test;

const ItsLearning = require('../lib/itslearning');

test('Searching for organisations', t => {
  const queries = [
    {in: 'Blekinge', out: [640]},
    {in: 'Växjö', out: [1775, 442]},
    {in: 'Linköping', out: [3271, 656, 1020]},
    {in: 'XYZ', out: []}
  ];

  for (const query of queries) {
    ItsLearning.searchOrganisation(query.in)
    .then(organisations => {
      const ids = organisations.map(organisation => organisation.id);
      t.is(ids, query.out);
    }).catch(t.fail);
  }
});

test('Fetching existing organisations', t => {
  const queries = [
    {in: 640, out: 640},
    {in: 442, out: 442},
    {in: 656, out: 656}
  ];

  for (const query of queries) {
    ItsLearning.fetchOrganisation(query.in)
    .then(organisation => t.is(query.in, organisation.id));
  }
});

test('Fetching non-existing organisations', t => {
  const queries = [
    {in: -312, out: null},
    {in: -152, out: null},
    {in: 0, out: null}
  ];

  for (const query of queries) {
    t.throws(ItsLearning.fetchOrganisation(query.in))
    .then(error => t.is(error instanceof Error, true));
  }
});
