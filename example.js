var PathKey = require('./')

var pk = PathKey({
  pathKey: '_path',
  pathSep: '/',
  keySep: '\xff'
})

var obj = {
  _path: 'companyId/email/name',
  companyId: 'stock-market',
  email: 'vincent@adultman.com',
  name: 'Vincent Adultman'
}

var key = pk.create(obj)
console.log(key)
// 'companyId/email/nameÿstock-marketÿvincent@adultman.comÿVincent Adultman'

var range = pk.range({
  _path: 'companyId/email/name',
  companyId: 'stock-market'
})
console.log(range)
// {
//   gte: 'companyId/email/nameÿstock-marketÿ',
//   lte: 'companyId/email/nameÿstock-marketÿÿÿ',
// }


var parsed = pk.parse(key)
console.log('parsed', parsed)

// { _path: 'companyId/email/name',
//   companyId: 'stock-market',
//   email: 'vincent@adultman.com',
//   name: 'Vincent Adultman' }
