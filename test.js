var PathKey = require('./')
var tape = require('tape')

tape('should handle default options', function (t) {
  var pk = PathKey()

  var obj = {
    level: 'companyId-email-name',
    companyId: 'stock-market',
    email: 'vincent@adultman.com',
    name: 'Vincent Adultman'
  }

  var key = pk.create(obj)
  var expectedKey = 'companyId-email-nameÿstock-marketÿvincent@adultman.comÿVincent Adultman'
  t.equal(key, expectedKey, 'key should match')

  var range = pk.range({
    level: 'companyId-email-name',
    companyId: 'stock-market'
  })
  var expectedRange = {
    gte: 'companyId-email-nameÿstock-marketÿ',
    lte: 'companyId-email-nameÿstock-marketÿÿÿ',
  }
  t.deepEqual(range, expectedRange, 'range should match')

  var parsed = pk.parse(key)
  t.deepEqual(parsed, obj, 'parsed should match')
  t.end()
})

tape('should handle explicit options', function (t) {
  var pk = PathKey({
    pathKey: '_path',
    pathSep: '/',
    keySep: '\x00'
  })

  var obj = {
    _path: 'companyId/email/name',
    companyId: 'stock-market',
    email: 'vincent@adultman.com',
    name: 'Vincent Adultman'
  }

  var key = pk.create(obj)
  var expectedKey = 'companyId/email/name\x00stock-market\x00vincent@adultman.com\x00Vincent Adultman'
  t.equal(key, expectedKey, 'key should match')

  var parsed = pk.parse(key)
  t.deepEqual(parsed, obj, 'parsed should match')
  t.end()
})

tape('should handle malicious input', function (t) {
  var pk = PathKey({
    pathKey: '_path',
    pathSep: '/',
    keySep: '\x00'
  })

  var obj = {
    _path: 'companyId/email/name',
    companyId: 'sto\x00ck-market',
    email: 'vincent@adultman.com',
    name: 'Vincent Adultman'
  }

  var key = pk.create(obj)
  var expectedKey = 'companyId/email/name\x00sto\x00\x00ck-market\x00vincent@adultman.com\x00Vincent Adultman'
  t.equal(key, expectedKey, 'key should match')

  var parsed = pk.parse(key)
  t.deepEqual(parsed, obj, 'parsed should match')
  t.end()
})
