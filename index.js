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
    subkeys.forEach(function (k) { keyParts.push(_encodeKeySeparator(obj[k], keySep)) })
    return keyParts.join(keySep)
  }
}

function parse (opts) {
  return function (key) {
    var pathKey = opts.pathKey
    var pathSep = opts.pathSep
    var keySep = opts.keySep

    var keyParts = _decodeKeySeparatorAndSplitKey(key, keySep)
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

// Doubles all occurances of keySep in key so that we can know they are user input.
function _encodeKeySeparator(key, keySep){
  return key.split(keySep).join(keySep + keySep);
}

// Splits key by keySep ignoring encoded separators
function _decodeKeySeparatorAndSplitKey(key, keySep){
  var result = []
  var currentKeyPart = ""
  for(var i=0; i<key.length; i++){
    if(key[i] != keySep){
      currentKeyPart += key[i]
      continue
    }
    if(key[i+1] == keySep){
      currentKeyPart += keySep
      i++
      continue
    }
    result.push(currentKeyPart)
    currentKeyPart = ""
  }
  result.push(currentKeyPart)
  return result
}
