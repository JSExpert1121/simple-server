const tape = require('tape')
const jsonist = require('jsonist')
const fs = require('fs')
const { DB_ROOT } = require("./config/database");

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
fs.unlinkSync(`${DB_ROOT}/student1.json`)
fs.unlinkSync(`${DB_ROOT}/student2.json`)

tape('health', t => {
  const url = `${endpoint}/health`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'should have successful healthcheck')
    t.end()
  })
})

tape('set-property for non existing student', t => {
  const url = `${endpoint}/student1/score/math`
  const data = { score: 9.5 }
  jsonist.put(url, data, { 'Content-Type': 'application/json' }, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'Any put request should succeed')
    t.end()
  })
})

tape('set-property for existing student', t => {
  const url = `${endpoint}/student1/score/phys`
  const data = { score: 8.9 }
  jsonist.put(url, data, { 'Content-Type': 'application/json' }, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'Any put request should succeed')
    t.end()
  })
})

tape('set-property for another student', t => {
  const url = `${endpoint}/student2/score/math`
  const data = { score: 9.3 }
  jsonist.put(url, data, { 'Content-Type': 'application/json' }, (err, body) => {
    if (err) t.error(err)
    t.ok(body.success, 'Any put request should succeed')
    t.end()
  })
})

tape('get-property for existing student and exsiting property - 1', t => {
  const url = `${endpoint}/student1/score`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    if (body.data.math && body.data.math.score === 9.5) {
      t.ok(body.success, 'All sub properties should be received')
    } else {
      t.error('All sub properties should be received')
    }
    t.end()
  })
})

tape('get-property for existing student and exsiting property - 2', t => {
  const url = `${endpoint}/student1/score/math/score`
  jsonist.get(url, (err, body) => {
    if (err) t.error(err)
    if (body.data === 9.5) {
      t.ok(body.success, 'Property should be received')
    } else {
      t.error('Property should be received')
    }
    t.end()
  })
})

tape('get-property for existing student and non-exsiting property', t => {
  const url = `${endpoint}/student1/score/chem`
  jsonist.get(url, (err, body) => {
    if (err) {
      t.error(err)
    } else {
      if (body.error === 'Not Found') {
        t.ok(body.error, '404 error should be returned for non-existing property')
      } else {
        t.error('404 error should be returned for non-existing property')
      }
    }

    t.end()
  })
})

tape('get-property for non-existing student', t => {
  const url = `${endpoint}/student3/score`
  jsonist.get(url, (err, body) => {
    if (err) {
      t.error(err)
    } else {
      if (body.error === 'Not Found') {
        t.ok(body.error, '404 error should be returned for non-existing student')
      } else {
        t.error('404 error should be returned for non-existing student')
      }
    }

    t.end()
  })
})

tape('delete-property for existing property', t => {
  const url = `${endpoint}/student1/score/math`
  jsonist.delete(url, (err, body) => {
    if (err) {
      t.error(err)
    } else {
      if (body.success) {
        t.ok(body.success, 'Existing property should be deleted')
      } else {
        t.error('Existing property should be deleted')
      }
    }

    t.end()
  })
})

tape('delete-property for non-existing student', t => {
  const url = `${endpoint}/student3/score`
  jsonist.delete(url, (err, body) => {
    if (err) {
      t.error(err)
    } else {
      if (body.error === 'Not Found') {
        t.ok(body.error, '404 error should be returned for non-existing student')
      } else {
        t.error('404 error should be returned for non-existing student')
      }
    }

    t.end()
  })
})

tape('delete-property for non-existing property', t => {
  const url = `${endpoint}/student1/math/chem`
  jsonist.delete(url, (err, body) => {
    console.log('error: ', err);
    if (err) {
      t.error(err)
    } else {
      if (body.error === 'Not Found') {
        t.ok(body.error, '404 error should be returned for non-existing property')
      } else {
        t.error('404 error should be returned for non-existing property')
      }
    }

    t.end()
  })
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

