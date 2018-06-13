const ARRAY_CORE = [],
    OBJECT_CORE = {},
    FUNCCORE = Function.prototype,
    bind = FUNCCORE.bind.call.bind(FUNCCORE.bind), // 自运行封装
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
    map = call(ARRAY_CORE, map),
    create = Object.create,
    emptyObject = create(null),
    getKeys = Object.keys,
    hasOwnProperty = call(OBJECT_CORE.hasOwnProperty),noop=function(){};



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
} = types;

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
    var keys = getKeys(obj),
        context = thisArg || obj,
        result;
    for (var i = 0, len = keys.length; i < len; i++) {
        result = callback.call(context, obj[keys[i]], keys[i], obj);
        if (result === false) {
            return false;
        }
    }
}

function intersection(...list)
{
  let len=list.length;
  if (len<=1)
  {
    return [];
  }
  var result=[];
  var array=list[0];

  for (let i = 0, mlen = array.length; i < mlen;i++){
    let item = array[i],isAdd=true;
    if (result.indexOf(item)!=-1) {
      continue;
    }
    for(let j=1;j<len;j++){
      if (list[j].indexOf(item)==-1){
        isAdd=false
        break;
      }
    }
    if (isAdd)
    {
      result.push(item);
    }
  }
  return result; 
}

function extend() {
    var args = toArray(arguments),
        target = args[0],
        dep = false,
        len = args.length,
        i = 1,
        source, key, src, copy, keys, len, k;
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
                if (copy!==undefined){
                  target[key] = copy;
                }
            }
        }
    }
    return target;
}

/*
包装wx异步函数返回promise对象
**/
function wrapPromise(func) {
    return (options) => {
        return new Promise((resolve, reject) => {
          if (!isPlainObject(options)){         
            options={};
          }
          let {
                complete,
            success,
            fail
            } = options;
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

var Callbacks = (function () {
    function mapOptions(options) {
        var result = {
            once: false,
            memory: false,
            unique: false,
            stopOnFalse: false
        };
        if (typeof options == "string") {
            options = options.split(' ').forEach(function (name) {
                if (result.hasOwnProperty(name)) {
                    result[name] = true;
                }
            });
        } else if (typeof options == 'object') {
            extend(result, options);
        }
        return result;
    }

    function Callbacks(options) {
        options = mapOptions(options);
        var
            memory,
            list = [],
            fired,
            memorys = [],
            startIndex = 0,
            locked,
            firing, queue = [],
            memorys;

        function fire() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; startIndex = 0) {
                memory = queue.shift();
                for (; startIndex < list.length; startIndex++) {
                    if (list[startIndex].apply(memory[1], memory[0]) === false && options.stopOnFalse) {
                        startIndex = list.length;
                    }
                }
            }
            firing = false;
            // 不是memory模式， memory设置为false,禁止add方法执行fire
            if (!options.memory) {
                memory = false;
            }
            // 当为locked锁定状态后，如果memory模式,list空数组，保持add回调触发,否则清空list
            if (locked) {
                if (memory) {
                    list = [];
                } else {
                    list = '';
                }
            }
        }
        var callbacks = {
            add: function () {
                if (list) {
                    // 当模式为memory，并且firing执行状态，add 立即触发
                    if (memory && !firing) {
                        startIndex = list.length;
                        queue.push(memory);
                    }
                    var fns = toArray(arguments),
                        i = 0,
                        len = fns.length,
                        fn;
                    for (; i < len; i++) {
                        fn = fns[i];
                        if (!options.unique || list.indexOf(fn) == -1) {
                            list.push(fn);
                        }
                    }
                    if (memory && !firing) {
                        fire();
                    }
                }
                return this;
            },
            has: function (fn) {
                return list.indexOf(fn) > -1;
            },
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },
            fired: function () {
                return !!fired;
            },
            disable: function () {
                // 清空所有对象
                locked = queue = [];
                list = memory = '';
                return this;
            },
            disabled: function () {
                return !list;
            },
            locked: function () {
                return locked;
            },
            lock: function () {
                // 锁定，并且清空数据执行数组
                locked = queue = [];
                // 当不是memory模式并且firing 执行完成后，清空对象
                if (!memory && !firing) {
                    list = memory = '';
                }
                return this;
            },
            remove: function () {
                var fns = toArray(arguments);
                fns.forEach(function (fn) {
                    var index = list.indexOf(fn);
                    if (index != -1) {
                        list.splice(index, 1);
                        if (index < startIndex) {
                            startIndex--;
                        }
                    }
                })
                return this;
            },
            fireWith: function (args, context) {
                if (!locked) {
                    // 当firing为运行时，再次执行fire操作，先把执行参数追到数组后面，等待执行
                    queue.push([toArray(args), context]);
                    if (!firing) {
                        fire();
                    }
                }
                return this;
            },
            fire: function () {
                callbacks.fireWith(arguments, this);
                return this;
            }
        };
        return callbacks;
    }
    return Callbacks;
}());



/**
 * 事件订阅
 * 
 */
class Observable {
    constructor() {
        this._events_ = {};
    }
    _initEvent(events) {
        var keys = getKeys(events);
        for (var i = 0, length = keys.length; i < length; i++) {
            this.on(keys[i], events[keys[i]])
        }
    }
    hasEvent(name) {
        return this._events_.hasOwnProperty(name) && this._events_[name] != null && this._events_[name].length > 0;
    }
    once(name, handler) {
        return this.on(name, handler, true);
    }
    on(name, handler, one, first) {
        var events = this._events_,
            that = this;
        if (handler == undefined) {
            for (var member in name) {
                that.on(member, name[member], name.one);
            }
            return that;
        }
        if (isArray(name)) {
            for (var i = 0; i < length; i++) {
                that.on(name[i], handler, one);
            }
            return that;
        }
        var eventQueue = events[name] || (events[name] = []);
        if (one) {
            var orgHandler = handler;
            handler = function onceHandler() {
                that.off(name, handler);
                orgHandler.apply(that, arguments);
            }
        }
        eventQueue[first ? 'unshift' : 'push'](handler);
        return this;
    }
    off(name, handler) {
        var len = arguments.length,
            events = this._events_;
        if (name == undefined) {
            this._events_ = {};
            return;
        }
        if (handler == undefined) {
            this._events_[name] = null;
            return;
        }
        var eventQueue = events[name];
        if (eventQueue) {
            for (var i = eventQueue.length - 1; i >= 0; i--) {
                if (handler == eventQueue[i]) {
                    eventQueue.splice(i, 1);
                }
            }
        }
        return this;
    }
    emit() {
        var that = this,
            args = toArray(arguments),
            name = args.shift(),
            events = this._events_,
            eventQueue = events[name];
        if (eventQueue) {
            eventQueue = eventQueue.slice();
            for (var i = 0, len = eventQueue.length; i < len; i++) {
                eventQueue[i].apply(that, args);
            }
        }
    }
}

function mergeHandler(handlers) {
    var handler = function (...args) {
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].apply(this, args)
        }
    }
    handler.handlers = handlers;
    handler.addHandler = function (handler) {
        handlers.push(handler)
    }
    return handler;
}
class Scheduler{
  constructor () {
    this.queue = [];
    this.pending = false;
  }
  flushCallback () {
    var queue = this.queue.slice(), length = queue.length;
    this.pending = false;
    this.queue.length = 0;
    for (var i = 0; i < length; i++) {
      queue[i]();
    }
  }
  executeQueue () {
    var that = this;
    that.pending = true;
    setTimeout(function () {
      that.flushCallback();
    }, 0)
  }
  nextTick (callback) {
    this.queue.push(callback)
    if (!this.pending) {
      this.executeQueue();
    }
  }
}

class Pager extends Observable{
  constructor({ pageIndex = 1, pageSize = 10}){
    super();
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = 0;
    this.pageCount = 0;// 页总数
    this.prevIndex=-1;
    this._lock=false;//锁住
  }
  setTotal(total) {
    this.total = total;
    this.pageCount = Math.ceil(total / this.pageSize);
    this._emit('pageCountChange')
    this._emit('change','total')
  }
  _emit(name, status){
    this.emit(name, this.pageIndex, status)
  }
  onChange(callback) {
    this.on('change', callback)
  }
  onPageCountChange(callback){
    this.on('pageCountChange', callback)
  }
  onPageChange(callback)
  {
    this.on('pageChange', callback)
  }
  onRefresh(callback){
    this.on('refresh', callback)
  }
  unlock()
  {
    this._lock = false;
  }
  lock()
  {
    this._lock=true;
  }
  refresh () {
    this._skip(1, true, 'refresh');
  }
  read(){
    this._skip(this.pageIndex, true,'read');
  }
  _skip(index,force,status='skip'){
    let pageCount = this.pageCount;
    if (!force&&pageCount < 1 || this._lock) {
      return false;
    }
    this.pageIndex = Math.max(Math.min(index, pageCount), 1);
    if (this.pageIndex !== this.prevIndex || force === true) {
      this.prevIndex = this.pageIndex;
      this._emit('pageChange', status)
      this._emit('change',status)
      return true;
    }
    return false;
  }
  skip(index,force) {
    this._skip(index, force,'skip')
  }
  prev(){
    this._skip(this.pageIndex - 1, false, 'prev')
  }
  next() {
    this._skip(this.pageIndex + 1,false,'next')
  }
}

class PageScroll{
  _scrollcallback=noop;
  _upcallback=noop;
  _downcallback=noop;
  constructor(scrollPosition)
  {
     this.prevScrollPosition=null;
     this.scrolling=false;
     this.scrollPosition = scrollPosition;
  }
  onScroll(callback) {
    this._scrollcallback = callback || noop;
  }
  onUp(callback)
  {
    this._upcallback = callback || noop;
  }
  onDown(callback){
    this._downcallback = callback || noop;
  }
  scroll(val){
    if (this.scrollPosition<=0){
      return;
    }
    if (!this.prevScrollPosition) {
      this.prevScrollPosition=val;
    }
    var down = false, scrolling = this.scrolling, scrollPosition = this.scrollPosition;
    if (val > this.prevScrollPosition) {
      down = true;
    }
    if (down && !scrolling && val > scrollPosition) {
      scrolling = true;
      this._downcallback();
    } else if (!down && scrolling && val <= scrollPosition) {
      scrolling = false;
      this._upcallback();
    }
    this.prevScrollPosition=val;
    this.scrolling = scrolling;
    this._scrollcallback(val);
  }
}
function once(fn)
{
  var r;
  return function(){
    if(fn){
      r= fn.apply(this,arguments);   
      fn=null;
    }
    return r;
  }
}
function getCharWidth(str, fontSize, ratio=0.62){
  return str.replace(/[^\x00-\xff]/g, '**').length * (fontSize * ratio);
}
// 防重复提交
function preventRepeat(fn, callback) {
  callback = callback || noop;
  var obj = {
    state: '',
    resolve: function () {
      obj.state = '';
      callback.apply(context, arguments);
    }
  },
    context = null;
  var resolve = obj.resolve;
  return function () {
    if (obj.state == "Pending") {
      return;
    }
    obj.state = "Pending";
    fn.apply(context = this, [resolve].concat(toArray(arguments)));
  }

}

module.exports = {
    preventRepeat,
    getCharWidth,
    intersection,
    once,
    Observable,
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
    wrapPromise,
    Callbacks,
    mergeHandler,
    Scheduler,
    Pager,
    PageScroll,
}