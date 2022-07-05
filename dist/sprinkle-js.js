const SprinkleJS=(()=>{function _arrayLikeToArray(arr, len) {
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

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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

var getDomElement=function(a){return "string"==typeof a?document.querySelector(a):a},updateDom=function(a,b){for(var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:[],d=Object.entries(b),e=0,f=d;e<f.length;e++){var g=_slicedToArray(f[e],2),h=g[0],i=g[1];if("object"===_typeof(i))return void updateDom(a,i,[].concat(_toConsumableArray(c),[h]));var j,k=a,l=_createForOfIteratorHelper(c);try{for(l.s();!(j=l.n()).done;){var m=j.value;k=k[m];}}catch(a){l.e(a);}finally{l.f();}"style"===c[c.length-1]&&k.setProperty(h,i),k[h]=i;}},createMatrix=function(a,b){return _toConsumableArray(Array(a).keys()).map(function(){return Array(b).fill(0)})},diff=function(){for(var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:[],b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:[],c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:function(c,a){return c===a},d=createMatrix(a.length+1,b.length+1),e=0;e<a.length+1;e++)d[e][0]=e;for(var q=0;q<b.length+1;q++)d[0][q]=q;for(var r=0;r<a.length;r++)for(var s=0;s<b.length;s++)if(c(a[r],b[s]))d[r+1][s+1]=d[r][s];else {var t=Math.min(d[r+1][s],d[r][s+1])+1;d[r+1][s+1]=t;}for(var f=[],g=a.length,h=b.length;0<g&&0<h;)c(a[g-1],b[h-1])?(f.unshift({type:"=",value:a[g-1]}),h--,g--):d[g-1][h]<d[g][h-1]?(f.unshift({type:"-",value:a[g-1]}),g--):(f.unshift({type:"+",value:b[h-1]}),h--);if(0<g){var k,l,m;f.unshift.apply(f,_toConsumableArray((null===a||void 0===a||null===(k=a.slice)||void 0===k||null===(l=k.call(a,0,g))||void 0===l||null===(m=l.map)||void 0===m?void 0:m.call(l,function(a){return {type:"-",value:a}}))||[]));}else if(0<h){var n,o,p;f.unshift.apply(f,_toConsumableArray((null===b||void 0===b||null===(n=b.slice)||void 0===n||null===(o=n.call(b,0,h))||void 0===o||null===(p=o.map)||void 0===p?void 0:p.call(o,function(a){return {type:"+",value:a}}))||[]));}return f},findNext=function(a,b){var c=2<arguments.length&&arguments[2]!==void 0?arguments[2]:0;return a.find(function(a,d){for(var e=arguments.length,f=Array(2<e?e-2:0),g=2;g<e;g++)f[g-2]=arguments[g];return d>c&&b.apply(void 0,[a,d].concat(f))})},getRawType=function(a){return Object.prototype.toString.call(a).slice(8,-1)};

var context=[],subscribe=function(a,b,c){var d=c.get(a);d||(d=new Set,c.set(a,d)),d.add(b),b.dependencies.add(d);},runRupdates=function(a,b){for(var c=0,d=_toConsumableArray(a.get(b)||[]);c<d.length;c++){var e=d[c],f=e.execute();f&&(e.cleanup=f);}},createVariable=function(a,b){if("object"!==_typeof(a))throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");for(var c=Object.keys(a||{}),d=0,e=c;d<e.length;d++){var f=e[d],g=f;!!a[g]&&"object"===_typeof(a[g])&&("Object"===getRawType(a[g])||Array.isArray(a[g]))&&(a[g]=createVariable(a[g],null===b||void 0===b?void 0:b[g]));}var h=new Map,i=new Proxy(a,{get:function get(){var a=context[context.length-1];return a&&subscribe(1>=arguments.length?void 0:arguments[1],a,h),Reflect.get.apply(Reflect,arguments)},set:function set(a,c,d){var e,f=c,g=null!==(e=null===b||void 0===b?void 0:b[f])&&void 0!==e?e:Object.is,i=d;!!d&&"object"===_typeof(d)&&("Object"===getRawType(d)||Array.isArray(d))&&(i=createVariable(d,g));var j=g(a[f],d),k=Reflect.set(a,c,i);return j||runRupdates(h,c),k}});return i},createComputed=function(a,b){var c={value:a()},d=!1,e=new Map,f=new Proxy(c,{get:function get(){var a=context[context.length-1];return a&&subscribe(1>=arguments.length?void 0:arguments[1],a,e),Reflect.get.apply(Reflect,arguments)},set:function set(a,c,f){if(!d)return !0;var g=null!==b&&void 0!==b?b:Object.is,h=g(a[c],f),i=Reflect.set(a,c,f);return h||runRupdates(e,c),i}});return createEffect(function(){d=!0,f.value=a(),d=!1;}),f},createStored=function(a,b,c){var d,f=3<arguments.length&&void 0!==arguments[3]?arguments[3]:window.localStorage;if("object"!==_typeof(b))throw new Error("It's not possible to create a variable from a primitive value...you can use createRef");var g=new Map,h=null;try{var j=f.getItem(a);j?h=JSON.parse(j):f.setItem(a,JSON.stringify(b));}catch(a){throw new Error("The specified key is associated with a non Object-like element")}var i=new Proxy(null!==(d=h)&&void 0!==d?d:b,{get:function get(){var a=context[context.length-1];return a&&subscribe(1>=arguments.length?void 0:arguments[1],a,g),Reflect.get.apply(Reflect,arguments)},set:function set(b,d,e){var h,i=d,j=null!==(h=null===c||void 0===c?void 0:c[i])&&void 0!==h?h:Object.is,k=j(b[i],e),l=Reflect.set(b,d,e);return f.setItem(a,JSON.stringify(b)),k||runRupdates(g,d),l}});return window.addEventListener("storage",function(b){if(b.storageArea===f&&b.key===a)try{if(b.newValue){var c=JSON.parse(b.newValue);for(var d in c)i[d]=c[d];}}catch(a){console.warn("The storage was modified but the resulting object is not parsable...the variable was not updated.");}}),i},createRef=function(a,b){return createVariable({value:a},b?{value:b}:void 0)},cleanup=function(a){var b,c=_createForOfIteratorHelper(a.dependencies);try{for(c.s();!(b=c.n()).done;){var d=b.value;d["delete"](a);}}catch(a){c.e(a);}finally{c.f();}a.dependencies.clear();},createEffect=function(a){var b=function(){c.cleanup&&c.cleanup(),cleanup(c),context.push(c);var b;try{b=a();}finally{context.pop();}return b},c={execute:b,dependencies:new Set},d=b();d&&(c.cleanup=d);},untrack=function(a){var b=context;context=[];var c=a();return context=b,c},bindTextContent=function(a,b){var c=getDomElement(a);return createEffect(function(){c&&(c.textContent=b(c));}),c},bindInnerHTML=function(a,b){var c=getDomElement(a);return createEffect(function(){c&&(c.innerHTML=b(c));}),c},bindClass=function(a,b,c){var d=getDomElement(a);return createEffect(function(){if(d){var a=c(d);a?d.classList.add(b):d.classList.remove(b);}}),d},bindClasses=function(a,b){var c=getDomElement(a);return createEffect(function(){if(c){var a=b(c),d=Object.keys(a||{}).filter(function(b){return a[b]});c.className=d.join(" ");}}),c},bindInputValue=function(a,b){var c=getDomElement(a);return createEffect(function(){c&&(c.value=b(c));}),c},bindDom=function(a,b){var c=getDomElement(a);return createEffect(function(){return updateDom(c,b(c))}),c},bindStyle=function(a,b){var c=getDomElement(a);if(c)return bindDom(c,function(){return {style:b(c)}}),c},bindChildrens=function(a,b){var c=getDomElement(a);return createEffect(function(){if(null!==c){var a=b(c);if(0===c.childNodes.length)return void c.append.apply(c,_toConsumableArray(Array.from(a)));var d,e=diff(_toConsumableArray(Array.from(c.childNodes)),_toConsumableArray(Array.from(a)),function(c,a){return null!=c.key&&null!=a.key?c.key===a.key:c===a}),f=e.find(function(a){return "="===a.type}),g=0,h=_createForOfIteratorHelper(e);try{var i=function _loop(){var a=d.value;if("+"===a.type){var b=findNext(e,function(b){return "-"===b.type&&b.value.key===a.value.key},g);if(b&&(a.value=b.value),!f)return c.append(a.value),g++,"continue";f.value.before(a.value);}else if("-"===a.type){c.removeChild(a.value);var h=findNext(e,function(b){return "+"===b.type&&b.value.key===a.value.key},g);h&&(h.value=a.value);}else f=findNext(e,function(a){return "="===a.type},g);g++;};for(h.s();!(d=h.n()).done;){var j=i();"continue"===j;}}catch(a){h.e(a);}finally{h.f();}}}),c};

return { bindChildrens, bindClass, bindClasses, bindDom, bindInnerHTML, bindInputValue, bindStyle, bindTextContent, createComputed, createEffect, createRef, createStored, createVariable, untrack };
})();