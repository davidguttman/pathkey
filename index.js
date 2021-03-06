module.exports = function (opts) {
  opts = opts || {}
  opts.pathKey = opts.pathKey || 'level'
  opts.pathSep = opts.pathSep || '-'
  opts.keySep = opts.keySep || '\xff'

  return {
    create: create(opts),
    parse: parse(opts),
    range: range(opts)
  }
}

function create (opts) {
  return function (obj) {
    var pathKey = opts.pathKey
    var pathSep = opts.pathSep
    var keySep = opts.keySep

    var path = obj[pathKey]
    var subkeys = path.split(pathSep)
    var keyParts = [path]
    subkeys.forEach(function (k) { keyParts.push(obj[k]) })
    return keyParts.join(keySep)
  }
}

function parse (opts) {
  return function (key) {
    var pathKey = opts.pathKey
    var pathSep = opts.pathSep
    var keySep = opts.keySep

    var keyParts = key.split(keySep)
    var path = keyParts[0]

    var subkeys = path.split(pathSep)
    var obj = {}
    obj[pathKey] = path

    subkeys.forEach(function (k, i) { obj[k] = keyParts[i+1] })
    return obj
  }
}

function range (opts) {
  return function (obj) {
    var pathKey = opts.pathKey
    var pathSep = opts.pathSep
    var keySep = opts.keySep

    var path = obj[pathKey]
    var subkeys = path.split(pathSep)
    var gteKeyParts = [path]
    var lteKeyParts = [path]

    for (var i = 0; i < subkeys.length; i++) {
      if (obj[subkeys[i]] !== undefined) {
        gteKeyParts.push(obj[subkeys[i]])
      } else {
        break
      }
    }
    subkeys.forEach(function (k) { lteKeyParts.push(obj[k]) })

    return {
      gte: gteKeyParts.join(keySep) + keySep,
      lte: lteKeyParts.join(keySep) + keySep
    }
  }
}
