const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')
const { DB_ROOT } = require('./config/database')

try {
  fs.unlinkSync(`${DB_ROOT}/student1.json`)
} catch (error) {
  console.log(error);
}

try {
  fs.unlinkSync(`${DB_ROOT}/student2.json`)
} catch (error) {
  console.log(error);
}

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`

  t.plan(2)
  jsonist.get(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.ok(body.success, 'should have successful healthcheck')
  })
})

tape('set-property for non existing student', t => {
  const url = `${endpoint}/student1/score/math`
  const data = { score: 9.5 }

  t.plan(2)
  jsonist.put(url, data, {
    headers: { 'Content-Type': 'application/json' }
  }, (err, body) => {
    t.error(err, 'No errors should occur')
    t.ok(body.success, 'Any put request should succeed')
  })
})

tape('set-property for existing student', t => {
  const url = `${endpoint}/student1/score/phys`
  const data = { score: 8.9 }

  t.plan(2)
  jsonist.put(url, data, {
    headers: { 'Content-Type': 'application/json' }
  }, (err, body) => {
    t.error(err, 'No errors should occur')
    t.ok(body.success, 'Any put request should succeed')
  })
})

tape('set-property for another student', t => {
  const url = `${endpoint}/student2/score/math`
  const data = { score: 9.3 }

  t.plan(2)
  jsonist.put(url, data, {
    headers: { 'Content-Type': 'application/json' }
  }, (err, body) => {
    t.error(err, 'No errors should occur')
    t.ok(body.success, 'Any put request should succeed')
  })
})

tape('get-property for existing student and exsiting property - 1', t => {
  const url = `${endpoint}/student1/score`

  t.plan(2)
  jsonist.get(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.deepEqual(body.data,
      { math: { score: 9.5 }, phys: { score: 8.9 } },
      'object tree should be matched exactly')
  })
})

tape('get-property for existing student and exsiting property - 2', t => {
  const url = `${endpoint}/student1/score/math/score`

  t.plan(2)
  jsonist.get(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.is(body.data, 9.5, 'math.score should be equal to 9.5')
  })
})

tape('get-property for existing student and non-exsiting property', t => {
  const url = `${endpoint}/student1/score/chem`

  t.plan(2)
  jsonist.get(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.is(body.error, 'Not Found', '404 error should be returned for non-existing property')
  })
})

tape('get-property for non-existing student', t => {
  const url = `${endpoint}/student3/score`

  t.plan(2)
  jsonist.get(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.is(body.error, 'Not Found', '404 error should be returned for non-existing student')
  })
})

tape('delete-property for existing property', t => {
  const url = `${endpoint}/student1/score/math`

  t.plan(2)
  jsonist.delete(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.ok(body.success, 'Existing property should be deleted')
  })
})

tape('delete-property for non-existing student', t => {
  const url = `${endpoint}/student3/score`

  t.plan(2)
  jsonist.delete(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.is(body.error, 'Not Found', '404 error should be returned for non-existing student')
  })
})

tape('delete-property for non-existing property', t => {
  const url = `${endpoint}/student1/math/chem`

  t.plan(2)
  jsonist.delete(url, (err, body) => {
    t.error(err, 'No errors should occur')
    t.is(body.error, 'Not Found', '404 error should be returned for non-existing property')
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})
