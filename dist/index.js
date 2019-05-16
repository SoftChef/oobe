!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.oobe=e():t.oobe=e()}(this,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=4)}([function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._base={name:e}}var e,o,i;return e=t,(o=[{key:"$systemError",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"$_no_error";throw"$_no_error"!==n&&console.log("error data => ",n),new Error("(☉д⊙)!! Oobe::".concat(this._base.name," => ").concat(t," -> ").concat(e))}},{key:"$verify",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o={};for(var i in e){var s=e[i],u=s[0],a=s[1],c=s[2];u&&null==t[i]&&this.$systemError("verify","Key(".concat(i,") is required")),a&&null!=t[i]&&!a.includes(n(t[i]))&&this.$systemError("verify","Type(".concat(i,"::").concat(n(t[i]),") error, need ").concat(a.join(" or "))),o[i]=t[i]||c}return Object.assign(o,r)}}])&&r(e.prototype,o),i&&r(e,i),t}();t.exports=o},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=function(t){function e(){var t;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=i(this,s(e).call(this,"Rule"))).items={},t}var n,r,c;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"add",value:function(t,e){"function"!=typeof e&&this.$systemError("add","Rule not a function."),this.items[t]&&this.$systemError("add","The name(".concat(t,") already exists.")),this.items[t]=e}},{key:"get",value:function(t){var e=t.split("|"),n=e.shift(),r=this.items[n],o={};null==r&&this.$systemError("get","Form rule list name(".concat(n,") not found."));var i=!0,s=!1,u=void 0;try{for(var a,c=e[Symbol.iterator]();!(i=(a=c.next()).done);i=!0){var f=a.value.split(":");o[f[0]]=void 0===f[1]||f[1]}}catch(t){s=!0,u=t}finally{try{i||null==c.return||c.return()}finally{if(s)throw u}}return function(t){return r(t,o)}}}])&&o(n.prototype,r),c&&o(n,c),e}();t.exports=c},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var r=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,r,o;return e=t,o=[{key:"isSprite",value:function(e){return e instanceof t}}],(r=null)&&n(e.prototype,r),o&&n(e,o),t}();t.exports=r},function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var s,u=t[Symbol.iterator]();!(r=(s=u.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,s,u;return e=t,u=[{key:"deepClone",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:new WeakMap;if(Object(e)!==e)return e;if(e instanceof Set)return new Set(e);if(n.has(e))return n.get(e);var i=e instanceof Date?new Date(e):e instanceof RegExp?new RegExp(e.source,e.flags):Object.create(null);return n.set(e,i),e instanceof Map&&Array.from(e,function(e){var r=o(e,2),s=r[0],u=r[1];i.set(s,t.deepClone(u,n))}),Object.assign.apply(Object,[i].concat(r(Object.keys(e).map(function(r){return function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}({},r,t.deepClone(e[r],n))}))))}},{key:"inspect",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(null==e)return null;var o=Array.isArray(e)?[]:{};for(var i in e){var s=e[i],u=n(s);if("function"!==u)if("object"===u){var a=[e].concat(r);a.includes(s)?o[i]="Circular structure object.":o[i]=t.inspect(s,a)}else o[i]=s}return o}}],(s=null)&&i(e.prototype,s),u&&i(e,u),t}();t.exports=s},function(t,e,n){var r=n(5);t.exports=r},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function s(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function a(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var f=n(0),l=n(1),y=n(2),h=n(6),p=n(10),b=function(t){function e(){var t,n,i;return o(this,e),n=this,(t=!(i=u(e).call(this,"Core"))||"object"!==r(i)&&"function"!=typeof i?a(n):i).rule=new l,t.containers={},p(a(t)),t}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(e,f),s(e,[{key:"addRule",value:function(t,e){this.rule.add(t,e)}},{key:"getRule",value:function(t){return this.rule.get(t)}},{key:"validate",value:function(t,e){return this.getRule(t)(e)}},{key:"validates",value:function(t,e){var n=this.getRules(e),r=!0,o=!1,i=void 0;try{for(var s,u=n[Symbol.iterator]();!(r=(s=u.next()).done);r=!0){var a=(0,s.value)(t);if(!0!==a)return a}}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return!0}},{key:"getRules",value:function(t){var e=[],n=!0,r=!1,o=void 0;try{for(var i,s=t[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value;"function"==typeof u?e.push(u):e.push(this.getRule(u))}}catch(t){r=!0,o=t}finally{try{n||null==s.return||s.return()}finally{if(r)throw o}}return e}},{key:"make",value:function(t,e,n){var r=this.containers[t];return null==r?this.$systemError("make","Container name(".concat(t,") not found.")):r.make(e,n).getUnit()}},{key:"addContainer",value:function(t,e){return this.containers[t]?this.$systemError("addContainer","Name(".concat(t,") already exists.")):(this.containers[t]=new h(this,e),this.containers[t])}},{key:"getConfigs",value:function(t){return null==this.containers[t]?this.$systemError("getConfigs","Containers name(".concat(t,") not found.")):this.containers[t].getConfigs()}}]),e}(),d=function(){function t(){var e=this;o(this,t);var n=new b;this.make=n.make.bind(n),this.addRule=n.addRule.bind(n),this.getRules=n.getRules.bind(n),this.validate=n.validate.bind(n),this.validates=n.validates.bind(n),this.getConfigs=n.getConfigs.bind(n),this.addContainer=function(t,r){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=n.addContainer(t,r),s=i.options.configs;return i.options.install.call(e,s,o)}}return s(t,null,[{key:"isSprite",value:function(t){return y.isSprite(t)}}]),t}();t.exports=d},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(1),f=n(3),l=n(7),y=function(t){function e(t){var n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=i(this,s(e).call(this,"Container"))).core=t,n.rule=new c,n.options=n.$verify(r,{rules:[!1,["object"],{}],utils:[!1,["object"],{}],sprites:[!0,["object"]],configs:[!1,["object"],{}],methods:[!1,["object"],{}],install:[!1,["function"],function(){}],distortions:[!1,["object"],[]]}),n.initRules(),n.initSprites(),n}var n,r,y;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"initRules",value:function(){for(var t in this.options.rules)this.rule.add(t,this.options.rules[t])}},{key:"initSprites",value:function(){for(var t in this.spriteBases={},this.options.sprites)this.spriteBases[t]=new l(this,t,this.options.sprites[t])}},{key:"getRule",value:function(t){return"$"===t.slice(0,1)?this.rule.get(t.slice(1)):this.core.getRule(t)}},{key:"getConfigs",value:function(){return f.deepClone(this.options.configs)}},{key:"make",value:function(t,e){var n=this.spriteBases[t];return null==n?this.$systemError("make","Sprite ".concat(t," not found.")):n.createSprite(e)}}])&&o(n.prototype,r),y&&o(n,y),e}();t.exports=y},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(8),f=n(9),l=function(t){function e(t,n){var r,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=i(this,s(e).call(this,"Sprite"))).name=n,r.container=t,r.options=r.$verify(o,{body:[!0,["function"]],refs:[!1,["object"],{}],rules:[!1,["object"],{}],reborn:[!0,["function"]],origin:[!0,["function"]],methods:[!1,["object"],{}],distortion:[!0,["object"]]}),r.initShapes(),r}var n,r,l;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"initShapes",value:function(){this.shapes={};var t=this.container.options.distortions.concat(["read","create","update","delete"]),e=!0,n=!1,r=void 0;try{for(var o,i=t[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var s=o.value;this.shapes[s]=new c(s,this.options.distortion[s])}}catch(t){n=!0,r=t}finally{try{e||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"createSprite",value:function(t){return new f(this,t)}}])&&o(n.prototype,r),l&&o(n,l),e}();t.exports=l},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function i(t){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var u=n(0),a=function(t){function e(t){var n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=o(this,i(e).call(this,"Shape"))).name=t,n.options=n.$verify(r,{fixed:[!1,["object","string"],[]],export:[!1,["function"],function(){return this.$toOrigin()}]}),n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(e,u),e}();t.exports=a},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(2),f=n(3),l=function(t){function e(t,n){var r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=i(this,s(e).call(this,"Sprite"))).unit=new c,r.body={},r.refs={},r.soul=null,r.live=!0,r.from=null,r.base=t,r.fixed=[],r.shape=null,r.options=t.options,r.rawBody="",r.rawData=JSON.stringify(n),r.ignoreFixed=!1,r.propertyNames=[],r.init(),r.distortion("read"),r}var n,r,l;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"getBody",value:function(){var t=f.deepClone(this.body);return this.eachRefs(function(e,n){t[n]=e.getBody()}),t}},{key:"getKeys",value:function(){return this.propertyNames.concat(Object.keys(this.base.options.refs))}},{key:"getProperty",value:function(t){if(this.propertyNames.includes(t))return this.unit[t];this.$systemError("getProperty","Property name(".concat(t,") not found."))}},{key:"isFixed",value:function(t){return!this.ignoreFixed&&("*"===this.fixed||this.fixed.includes(t))}},{key:"isChange",value:function(){var t=this.rawBody!==JSON.stringify(this.body);return!!t||(this.eachRefs(function(e){if(t=e.isChange())return"_break"}),t)}},{key:"export",value:function(){return this.shape.options.export.call(this.unit)}},{key:"getUnit",value:function(){return this.unit}},{key:"toOrigin",value:function(){return this.options.origin.call(this.unit)}},{key:"out",value:function(){return!1===this.live&&this.$systemError("out","This Sprite is dead."),this.soul=this.base.createSprite(this.toOrigin()),this.soul.from=this,this.sleep(),this.soul.getUnit()}},{key:"sleep",value:function(){this.live=!1,this.eachRefs(function(t){return t.sleep()})}},{key:"wakeup",value:function(){this.live=!0,this.eachRefs(function(t){return t.wakeup()})}},{key:"revive",value:function(){var t=this.toOrigin();!1===this.live&&this.$systemError("revive","This Sprite is dead."),this.from?(this.from.ignoreFixed=!0,this.from.reborn(t),this.from.ignoreFixed=!1,this.dead()):this.$systemError("revive","This Sprite is root.")}},{key:"copy",value:function(){return this.base.container.make(this.base.name,this.toOrigin()).getUnit()}},{key:"dead",value:function(){!1===this.live&&this.$systemError("dead","This Sprite is dead."),this.from?(this.from.wakeup(),this.from.soul=null,this.from=null,this.sleep()):this.$systemError("dead","This Sprite is root.")}},{key:"reborn",value:function(t){this.wakeup(),this.resetBody(t)}},{key:"reset",value:function(){if(!1===this.live)return this.$systemError("set","This Sprite is dead.");this.resetBody(JSON.parse(this.rawData))}},{key:"resetBody",value:function(t){var e=this.setBody(t);this.eachRefs(function(t,n){t.setBody(e[n])})}},{key:"setBody",value:function(t){var e=this.options.reborn.call(this.unit,t),n=!0,r=!1,o=void 0;try{for(var i,s=this.propertyNames[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value;this.unit[u]=e[u]}}catch(t){r=!0,o=t}finally{try{n||null==s.return||s.return()}finally{if(r)throw o}}return e}},{key:"eachRefs",value:function(t){for(var e in this.refs){if("_break"===t(this.refs[e],e))break}}},{key:"distortion",value:function(t){return!1===this.live&&this.$systemError("distortion","This Sprite is dead."),null==this.base.shapes[t]?this.$systemError("distortion","Name(".concat(t,") not found.")):(this.shape=this.base.shapes[t],this.fixed=this.shape.options.fixed,this.eachRefs(function(e){return e.distortion(t)}),this.getUnit())}},{key:"init",value:function(){this.initUnit(),this.initBody(),this.rawBody=JSON.stringify(this.body),this.propertyNames=Object.keys(this.body)}},{key:"initUnit",value:function(){this.unit.$fn=this.getMethods(),this.unit.$out=this.out.bind(this),this.unit.$dead=this.dead.bind(this),this.unit.$copy=this.copy.bind(this),this.unit.$body=this.getBody.bind(this),this.unit.$keys=this.getKeys.bind(this),this.unit.$reset=this.reset.bind(this),this.unit.$rules=this.getRules.bind(this),this.unit.$utils=this.base.container.options.utils,this.unit.$helper=f,this.unit.$revive=this.revive.bind(this),this.unit.$export=this.export.bind(this),this.unit.$status=this.getStatus.bind(this),this.unit.$configs=this.base.container.getConfigs(),this.unit.$isFixed=this.isFixed.bind(this),this.unit.$toOrigin=this.toOrigin.bind(this),this.unit.$isChange=this.isChange.bind(this),this.unit.$validate=this.validateAll.bind(this),this.unit.$distortion=this.distortion.bind(this)}},{key:"initBody",value:function(){var t=this.options.refs,e=this.options.body.call(this.unit),n=this.options.reborn.call(this.unit,JSON.parse(this.rawData));for(var r in e)this.body[r]=void 0===n[r]?e[r]:n[r],Object.defineProperty(this.unit,r,{get:this.getDefineProperty("body",r),set:this.setDefineProperty(r)});for(var o in t)this.refs[o]=this.base.container.make(t[o],n[o]),Object.defineProperty(this.unit,o,{get:this.getDefineProperty("refs",o),set:this.setDefineProperty(o,!0)})}},{key:"getMethods",value:function(){var t={},e=this.base.container.options.methods;for(var n in e)t[n]=e[n].bind(this.unit);var r=this.base.options.methods;for(var o in r)t[o]=r[o].bind(this.unit);return t}},{key:"getStatus",value:function(){return{live:this.live,keys:this.getKeys(),shape:this.shape.name,fixed:this.fixed.slice(),rawBody:this.rawBody,rawData:this.rawData}}},{key:"getRules",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=[],r=this.base.options.rules[t];null==r&&this.$systemError("getRules","Rule name(".concat(t,") not found.")),r=r.concat(e);var o=!0,i=!1,s=void 0;try{for(var u,a=r[Symbol.iterator]();!(o=(u=a.next()).done);o=!0){var c=u.value;"function"==typeof c?n.push(c):n.push(this.base.container.getRule(c))}}catch(t){i=!0,s=t}finally{try{o||null==a.return||a.return()}finally{if(i)throw s}}return n}},{key:"validate",value:function(t,e){var n=this.getRules(t,e),r=this.getProperty(t),o=[],i=!0,s=!0,u=!1,a=void 0;try{for(var c,f=n[Symbol.iterator]();!(s=(c=f.next()).done);s=!0){var l=(0,c.value)(r);!0!==l&&(i=!1,o.push(l))}}catch(t){u=!0,a=t}finally{try{s||null==f.return||f.return()}finally{if(u)throw a}}return{success:i,errors:o}}},{key:"validateAll",value:function(){for(var t=Object.keys(this.base.options.rules),e={},n=!0,r=0,o=t;r<o.length;r++){var i=o[r],s=this.validate(i);!1===s.success&&(n=!1),e[i]=s.errors}return this.eachRefs(function(t,r){var o=t.validateAll();!1===o.success&&(n=!1),e[r]=o.errors}),{success:n,errors:e}}},{key:"getDefineProperty",value:function(t,e){var n=this;return"refs"===t?function(){return n.refs[e].unit}:function(){return n.body[e]}}},{key:"setDefineProperty",value:function(t,e){var n=this;return function(r){return!1===n.live?n.$systemError("set","This Sprite is dead."):e?n.$systemError("set","This property(".concat(t,") is protect.")):n.isFixed(t)?n.$systemError("set","This property(".concat(t,") is fixed.")):void(n.body[t]=r)}}}])&&o(n.prototype,r),l&&o(n,l),e}();t.exports=l},function(t,e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports=function(t){t.addRule("@require",function(t,e){var r=n(t);return null==t?"require":"string"===r&&""===t?"require":Array.isArray(t)&&0===t.length?"require":"object"!==r||0!==Object.keys(t).length||"require"})}}])});