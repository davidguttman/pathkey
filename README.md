# PathKey

Generate keys from objects and parse keys back into objects. Useful for working with kv stores like leveldb and redis.

## Example

```js
var PathKey = require('pathkey')

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


var parsed = pk.parse(key)
console.log('parsed', parsed)

// { _path: 'companyId/email/name',
//   companyId: 'stock-market',
//   email: 'vincent@adultman.com',
//   name: 'Vincent Adultman' }
```

## API

### Pathkey(options)

```js
// defaults
var pk = PathKey({
  pathKey: 'level',
  pathSep: '-',
  keySep: '\xff'
})
```

#### Options

* `pathKey`: the attribute of the object (when used with `pathSep`) determines the format of the created key.
* `pathSep`: this is used to split the value of `pathKey`.
* `keySep`: this is used to join/split the created/parsed key.

### pk.create(obj)

```js
var key = pk.create({
  _path: 'companyId/email', // pathKey: '_path', pathSep: '/'
  companyId: 'stock-market',
  email: 'vincent@adultman.com',
  name: 'Vincent Adultman'
})
// 'companyId/email/nameÿstock-marketÿvincent@adultman.comÿVincent Adultman'
// ^ keySep: 'ÿ'
```

### pk.parse(key)

```js
var key = 'companyId/email/nameÿstock-marketÿvincent@adultman.comÿVincent Adultman'
var parsed = pk.parse(key)

// { _path: 'companyId/email/name',
//   companyId: 'stock-market',
//   email: 'vincent@adultman.com',
//   name: 'Vincent Adultman' }
```

### pk.range(obj)

```js
var range = pk.range({
  _path: 'companyId/email/name',
  companyId: 'stock-market'
})
console.log(range)
// {
//   gte: 'companyId/email/nameÿstock-marketÿ',
//   lte: 'companyId/email/nameÿstock-marketÿÿÿ',
// }

```

## License

MIT
