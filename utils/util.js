
const ARRAY_CORE = [],
  OBJECT_CORE = {},
  FUNCCORE = Function.prototype,
  bind = FUNCCORE.bind.call.bind(FUNCCORE.bind),// 自运行封装
  call = FUNCCORE.bind.bind(FUNCCORE.call),
  apply = FUNCCORE.bind.bind(FUNCCORE.apply),
  FuncToString = FUNCCORE.toString,
  ObjToString = OBJECT_CORE.toString,
  getFuncNative = call(FuncToString),
  ObjectNativeString = getFuncNative(Object),
  getType = call(ObjToString),
  types = {},
  slice = call(ARRAY_CORE.slice),
  forEach = call(ARRAY_CORE.forEach),
  find = call(ARRAY_CORE.find),
  filter = call(ARRAY_CORE.filter),
  indexOf = call(ARRAY_CORE.indexOf),
  map=call(ARRAY_CORE,map),
  create = Object.create,
  emptyObject = create(null),
  getKeys = Object.keys,
  hasOwnProperty = call(OBJECT_CORE.hasOwnProperty);



forEach('Object,Array,Function,String,Boolean'.split(','), function (key) {
  types['is' + key] = function (type, val) {
    return getType(val) == '[object ' + type + ']'
  }.bind(null, key)
});

const {
  isObject: isLikeObject,
  isArray,
  isFunction,
  isString,
  isBoolean
}=types;

function hasIn(obj, property) {
  if (!isObject(obj)) {
    return false;
  }
  return property in obj;
}

function isPlainObject(obj) {
  if (!isLikeObject(obj)) {
    return false;
  }
  var constructor = obj.constructor;
  if (!constructor) {
    return true;
  }
  return getFuncNative(constructor) == ObjectNativeString;
}
function isObject(obj) {
  var type = typeof obj;
  return obj != null && (type == 'object' || type == 'function');
}
function toArray(list) {
  return slice(list);
}
function each(obj, callback, thisArg) {
  if (!isObject(obj)) {
    return;
  }
  var keys = getKeys(obj), context = thisArg || obj, result;
  for (var i = 0, len = keys.length; i < len; i++) {
    result = callback.call(context, obj[keys[i]], keys[i], obj);
    if (result === false) {
      return false;
    }
  }
}

function extend() {
  var args = toArray(arguments), target = args[0], dep = false, len = args.length, i = 1, source, key, src, copy, keys, len, k;
  if (isBoolean(target)) {
    dep = target;
    target = args[1];
    i += 1;
  }
  if (i >= len) {
    target = this;
    i -= 1;
  }
  if (!isObject(target)) {
    target = {};
  }
  while (i < len) {
    source = args[i++];
    if (isObject(source)) {
      for (key in source) {
        src = target[key];
        copy = source[key];
        if (dep && isArray(copy)) {
          copy = extend(dep, isArray(src) ? src : [], copy);
        } else if (dep && isPlainObject(copy)) {
          copy = extend(dep, isObject(src) ? src : {}, copy);
        }
        target[key] = copy;
      }
    }
  }
  return target;
}

/*
包装wx异步函数返回promise对象
**/
function resolvePromise(func) {
  return (options) => {
    return new Promise((resolve, reject) => {
      let { complete, success, fail} = options;
      options.success = function (arg) {
        resolve(arg);
        success && success(arg);
        complete && complete();
      }
      options.fail = function (arg) {
        resolve(arg);
        fail && fail(arg);
        complete && complete();
      }
      func.call(this, options);
    })
  }
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



module.exports = {
  toArray,
  slice,
  isPlainObject,
  isLikeObject,
  isArray,
  isFunction,
  isString,
  isBoolean,
  getKeys,
  map,
  find,
  extend,
  each,
  forEach,
  hasOwnProperty,
  formatTime,
  resolvePromise
}
