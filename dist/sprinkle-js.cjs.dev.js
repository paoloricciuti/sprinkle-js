'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var getDomElement=function(a){return "string"==typeof a?document.querySelector(a):a},updateDom=function(a,b){for(var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:[],d=Object.entries(b),e=0,f=d;e<f.length;e++){var g=_slicedToArray(f[e],2),h=g[0],i=g[1];if("object"===_typeof(i))return void updateDom(a,i,[].concat(_toConsumableArray(c),[h]));var j,k=a,l=_createForOfIteratorHelper(c);try{for(l.s();!(j=l.n()).done;){var m=j.value;k=k[m];}}catch(a){l.e(a);}finally{l.f();}"style"===c[c.length-1]&&k.setProperty(h,i),k[h]=i;}},createMatrix=function(a,b){return _toConsumableArray(Array(a).keys()).map(function(){return Array(b).fill(0)})},diff=function(){for(var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:[],b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:[],c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:function(c,a){return c===a},d=createMatrix(a.length+1,b.length+1),e=0;e<a.length+1;e++)d[e][0]=e;for(var q=0;q<b.length+1;q++)d[0][q]=q;for(var r=0;r<a.length;r++)for(var s=0;s<b.length;s++)if(c(a[r],b[s]))d[r+1][s+1]=d[r][s];else {var t=Math.min(d[r+1][s],d[r][s+1])+1;d[r+1][s+1]=t;}for(var f=[],g=a.length,h=b.length;0<g&&0<h;)c(a[g-1],b[h-1])?(f.unshift({type:"=",value:a[g-1]}),h--,g--):d[g-1][h]<d[g][h-1]?(f.unshift({type:"-",value:a[g-1]}),g--):(f.unshift({type:"+",value:b[h-1]}),h--);if(0<g){var k,l,m;f.unshift.apply(f,_toConsumableArray((null===a||void 0===a||null===(k=a.slice)||void 0===k||null===(l=k.call(a,0,g))||void 0===l||null===(m=l.map)||void 0===m?void 0:m.call(l,function(a){return {type:"-",value:a}}))||[]));}else if(0<h){var n,o,p;f.unshift.apply(f,_toConsumableArray((null===b||void 0===b||null===(n=b.slice)||void 0===n||null===(o=n.call(b,0,h))||void 0===o||null===(p=o.map)||void 0===p?void 0:p.call(o,function(a){return {type:"+",value:a}}))||[]));}return f},findNext=function(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:0;return a.find(function(a,d){for(var e=arguments.length,f=Array(2<e?e-2:0),g=2;g<e;g++)f[g-2]=arguments[g];return d>c&&b.apply(void 0,[a,d].concat(f))})};

var context=[];function subscribe(a,b,c){var d=c.get(a);d||(d=new Set,c.set(a,d)),d.add(b),b.dependencies.add(d);}var createVariable=function(a){if("object"!==_typeof(a))throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");var b=new Map,c=new Proxy(a,{get:function get(){var a=context[context.length-1];return a&&subscribe(1>=arguments.length?void 0:arguments[1],a,b),Reflect.get.apply(Reflect,arguments)},set:function set(){for(var a=Reflect.set.apply(Reflect,arguments),c=0,d=_toConsumableArray(b.get(1>=arguments.length?void 0:arguments[1])||[]);c<d.length;c++){var e=d[c],f=e.execute();f&&(e.cleanup=f);}return a}});return c},createRef=function(a){return createVariable({value:a})},cleanup=function(a){var b,c=_createForOfIteratorHelper(a.dependencies);try{for(c.s();!(b=c.n()).done;){var d=b.value;d["delete"](a);}}catch(a){c.e(a);}finally{c.f();}a.dependencies.clear();},createEffect=function(a){var b=function(){c.cleanup&&c.cleanup(),cleanup(c),context.push(c);var b;try{b=a();}finally{context.pop();}return b},c={execute:b,dependencies:new Set},d=b();d&&(c.cleanup=d);},untrack=function(a){var b=context;context=[];var c=a();return context=b,c},bindTextContent=function(a,b){var c=getDomElement(a);createEffect(function(){c&&(c.textContent=b());});},bindClass=function(a,b,c){var d=getDomElement(a);createEffect(function(){if(d){var a=c();a?d.classList.add(b):d.classList.remove(b);}});},bindInputValue=function(a,b){var c=getDomElement(a);createEffect(function(){c&&(c.value=b());});},bindDom=function(a,b){var c=getDomElement(a);createEffect(function(){return updateDom(c,b())});},bindStyle=function(a,b){var c=getDomElement(a);c&&bindDom(c,function(){return {style:b()}});},bindChildrens=function(a,b){var c=getDomElement(a);createEffect(function(){if(null!==c){var a=b();if(0===c.childNodes.length)return void c.append.apply(c,_toConsumableArray(Array.from(a)));var d,e=diff(_toConsumableArray(Array.from(c.childNodes)),_toConsumableArray(Array.from(a)),function(c,a){return null!=c.key&&null!=a.key?c.key===a.key:c===a}),f=e.find(function(a){return "="===a.type}),g=0,h=_createForOfIteratorHelper(e);try{for(h.s();!(d=h.n()).done;){var i=d.value;if("+"===i.type){if(!f){c.append(i.value),g++;continue}f.value.before(i.value);}else "-"===i.type?c.removeChild(i.value):f=findNext(e,function(a){return "="===a.type},g);g++;}}catch(a){h.e(a);}finally{h.f();}}});};

exports.bindChildrens = bindChildrens;
exports.bindClass = bindClass;
exports.bindDom = bindDom;
exports.bindInputValue = bindInputValue;
exports.bindStyle = bindStyle;
exports.bindTextContent = bindTextContent;
exports.createEffect = createEffect;
exports.createRef = createRef;
exports.createVariable = createVariable;
exports.untrack = untrack;
