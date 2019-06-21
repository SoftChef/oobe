!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Oobe=e():t.Oobe=e()}(this||("undefined"!=typeof window?window:global),function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=4)}([function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var r=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._base={name:e}}var e,r,o;return e=t,(r=[{key:"$systemError",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"$_no_error";throw"$_no_error"!==n&&console.log("error data => ",n),new Error("(☉д⊙)!! Oobe::".concat(this._base.name," => ").concat(t," -> ").concat(e))}}])&&n(e.prototype,r),o&&n(e,o),t}();t.exports=r},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var i=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,i;return e=t,i=[{key:"jpjs",value:function(t){return JSON.parse(JSON.stringify(t))}},{key:"getType",value:function(t){var e=r(t);return Array.isArray(t)?"array":null==t?"empty":"number"===e&&isNaN(t)?"NaN":t instanceof RegExp?"regexp":e}},{key:"isEmpty",value:function(e){var n=t.getType(e);return"empty"===n||("array"===n&&0===e.length||("object"===n&&0===Object.keys(e).length||"string"===n&&""===e))}},{key:"isSprite",value:function(t){return t instanceof s}},{key:"verify",value:function(e,n){var r={};for(var o in n){var i=e[o],s=n[o],u=s[0],a=s[1],c=s[2],f=t.getType(i);if("boolean"!==t.getType(u))throw new Error("Helper::verify => Required must be a boolean");if("array"!==t.getType(a))throw new Error("Helper::verify => Types must be a array");if(u&&null==i)throw new Error("Helper::verify => Key(".concat(o,") is required"));if(a&&null!=i&&!a.includes(f))throw new Error("Helper::verify => Type(".concat(o,"::").concat(f,") error, need ").concat(a.join(" or ")));r[o]=i||c}return r}}],(n=null)&&o(e.prototype,n),i&&o(e,i),t}();t.exports=i;var s=n(2)},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=n(1);function i(t){return t instanceof s?t:t.unit}var s=function(){function t(e){var n=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._sprite=e,this._container=this._sprite.base.container,this.$utils=this._container.options.utils,this.$helper=o,this.$configs=this._container.getConfigs(),Object.defineProperty(this,"$live",{get:function(){return n._sprite.status.live}}),Object.defineProperty(this,"$state",{get:function(){return n._sprite.state.name}}),Object.defineProperty(this,"$ready",{get:function(){return n._sprite.status.ready}})}var e,n,s;return e=t,(n=[{key:"$meg",value:function(t,e){return this._container.getMessage(t,e)}},{key:"$out",value:function(){return i(this._sprite.out())}},{key:"$dead",value:function(){return i(this._sprite.dead())}},{key:"$born",value:function(t){return i(this._sprite.born(t))}},{key:"$copy",value:function(){return i(this._sprite.copy())}},{key:"$body",value:function(){return this._sprite.getBody()}},{key:"$keys",value:function(){return this._sprite.getKeys()}},{key:"$reset",value:function(t){this._sprite.reset(t)}},{key:"$rules",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];this._sprite.getRules(t,e)}},{key:"$revive",value:function(){return i(this._sprite.revive())}},{key:"$export",value:function(t){return this._sprite.export(t)}},{key:"$isFixed",value:function(t){return this._sprite.state.isFixed(t)}},{key:"$isHidden",value:function(t){return this._sprite.state.isHidden(t)}},{key:"$show",value:function(t){return!this._sprite.state.isHidden(t)}},{key:"$toOrigin",value:function(){return this._sprite.toOrigin()}},{key:"$isChange",value:function(t){return this._sprite.isChange(t)}},{key:"$validate",value:function(){return this._sprite.validateAll()}},{key:"$distortion",value:function(t){return i(this._sprite.distortion(t))}}])&&r(e.prototype,n),s&&r(e,s),t}();t.exports=s},function(t,e){t.exports={defaultState:["read","create","delete","update"],protectPrefix:["self"],systemContainer:{sprites:{system:{body:function(){}}}}}},function(t,e,n){function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=n(5),i=n(1),s=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._core=new o}var e,n,i;return e=t,(n=[{key:"meg",value:function(t,e){return this._core.message.get(t,e)}},{key:"make",value:function(t,e){return this._core.make(t,e)}},{key:"batch",value:function(t,e,n){return this._core.batch(t,e,n)}},{key:"join",value:function(t,e,n){var r=this._core.addContainer(t,e),o=r.options.configs;return r.options.install.call(this,o,n)}},{key:"addon",value:function(t){this._core.addon(t)}},{key:"getRules",value:function(t){return this._core.getRules(t)}},{key:"setLocale",value:function(t){this._core.setLocale(t)}}])&&r(e.prototype,n),i&&r(e,i),t}();s.helper=i,t.exports=s},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(6),f=n(1),l=n(7),y=n(3),h=n(8),p=function(t){function e(){var t;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=i(this,s(e).call(this,"Core"))).rule=new c,t.message=new l,t.containers={},t.init(),t}var n,r,p;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"init",value:function(){this.initSystemContainer()}},{key:"initSystemContainer",value:function(){this.addContainer("__system__",y.systemContainer),this.systemSprite=this.make("__system__","system")}},{key:"getPrefix",value:function(t){return""===t&&this.$systemError("getPrefix","This name(".concat(t,") is empty.")),!0===y.protectPrefix.includes(t)&&this.$systemError("getPrefix","This name(".concat(t,") is protect.")),"#"+t+"."}},{key:"addon",value:function(t){var e=f.verify(t,{name:[!0,["string"]],rules:[!1,["object"],{}],locales:[!1,["object"],{}]}),n=this.getPrefix(e.name);this.rule.addMultiple(e.rules,n),this.message.add(e.locales,n)}},{key:"addContainer",value:function(t,e){return this.containers[t]?this.$systemError("addContainer","Name(".concat(t,") already exists.")):(this.containers[t]=new h(this,t,e),this.containers[t])}},{key:"getRules",value:function(t){return this.rule.getMore(this.systemSprite,t)}},{key:"setLocale",value:function(t){this.message.setLocale(t)}},{key:"eachContainer",value:function(t){for(var e in this.containers)t(this.containers[e])}},{key:"make",value:function(t,e){var n=this.containers[t];return null==n?this.$systemError("make","Container name(".concat(t,") not found.")):n.make(e).unit}},{key:"batch",value:function(t,e,n){var r=this,o=f.getType(n),i=[];if("array"===o)return n.forEach(function(n){i.push(r.make(t,e).$born(n))}),i;this.$systemError("batch","Data must be a array.",n)}}])&&o(n.prototype,r),p&&o(n,p),e}();t.exports=p},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=function(t){function e(){var t;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=i(this,s(e).call(this,"Rule"))).items={},t}var n,r,c;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"add",value:function(t,e){"function"!=typeof e&&this.$systemError("add","Rule not a function."),this.items[t]&&this.$systemError("add","The name(".concat(t,") already exists.")),this.items[t]=e}},{key:"addMultiple",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";for(var n in t)this.add(e+n,t[n])}},{key:"get",value:function(t,e){var n=e.split("|"),r=n.shift(),o=this.items[r],i={};null==o&&this.$systemError("get","Form rule list name(".concat(r,") not found."));var s=!0,u=!1,a=void 0;try{for(var c,f=n[Symbol.iterator]();!(s=(c=f.next()).done);s=!0){var l=c.value.split(":");i[l[0]]=void 0===l[1]||l[1]}}catch(t){u=!0,a=t}finally{try{s||null==f.return||f.return()}finally{if(u)throw a}}return function(e){return o.call(t,e,i)}}},{key:"getMore",value:function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var s,u=e[Symbol.iterator]();!(r=(s=u.next()).done);r=!0){var a=s.value,c="function"==typeof a?a.bind(t):this.get(t,a);n.push(c)}}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}},{key:"validate",value:function(t,e,n){var r=this.getMore(t,n),o=!0,i=!1,s=void 0;try{for(var u,a=r[Symbol.iterator]();!(o=(u=a.next()).done);o=!0){var c=(0,u.value)(e);if(!0!==c)return c}}catch(t){i=!0,s=t}finally{try{o||null==a.return||a.return()}finally{if(i)throw s}}return!0}}])&&o(n.prototype,r),c&&o(n,c),e}();t.exports=c},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=function(t){function e(){var t;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(t=i(this,s(e).call(this,"Locale"))).store={"en-us":{}},t.default=t.store["en-us"],t.setLocale("en-us"),t}var n,c,f;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(c=[{key:"setLocale",value:function(t){if("string"!=typeof t)return this.$systemError("setLocale","Locale(".concat(t,") not be string."));this.messages=this.getStore(t)}},{key:"getStore",value:function(t){return null==this.store[t]&&(this.store[t]={}),this.store[t]}},{key:"add",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if("object"!==r(t))return this.$systemError("set","Data not a object",t);for(var n in t){var o=this.getStore(n);for(var i in t[n])o[e+i]=t[n][i]}}},{key:"get",value:function(t,e){var n=this.messages[t]||this.default[t]||t;if(e)for(var r in e){var o=new RegExp("{".concat(r,"}"),"g");n=n.replace(o,e[r])}return n}}])&&o(n.prototype,c),f&&o(n,f),e}();t.exports=c},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(1),f=n(9),l=function(t){function e(t,n){var r,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=i(this,s(e).call(this,"Container"))).core=t,r.name=n,r.prefix="$"+r.name+".",r.spriteBases={},r.options=c.verify(o,{rules:[!1,["object"],{}],utils:[!1,["object"],{}],states:[!1,["array"],[]],sprites:[!0,["object"]],locales:[!1,["object"],{}],configs:[!1,["object"],{}],methods:[!1,["object"],{}],install:[!1,["function"],function(){}]}),r.init(),r}var n,r,l;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"init",value:function(){this.initRules(),this.initSprites(),this.initMessage()}},{key:"initRules",value:function(){this.core.rule.addMultiple(this.options.rules,this.prefix)}},{key:"initSprites",value:function(){for(var t in this.options.sprites)this.spriteBases[t]=new f(this,t,this.options.sprites[t])}},{key:"initMessage",value:function(){this.core.message.add(this.options.locales,this.prefix)}},{key:"getRules",value:function(t,e){return this.core.rule.getMore(t,this.getNames(e))}},{key:"getMessage",value:function(t,e){return this.core.message.get(this.getName(t),e)}},{key:"getConfigs",value:function(){return this.options.configs}},{key:"getName",value:function(t){return"#"===t[0]?t:this.prefix+t}},{key:"getNames",value:function(t){for(var e=t.slice(),n=0;n<t.length;n++)e[n]=this.getName(t[n]);return e}},{key:"validate",value:function(t,e,n){return this.core.rule.validate(t,e,this.getNames(n))}},{key:"make",value:function(t){var e=this.spriteBases[t];return null==e?this.$systemError("make","Sprite ".concat(t," not found.")):e.create()}}])&&o(n.prototype,r),l&&o(n,l),e}();t.exports=l},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(10),f=n(1),l=n(3),y=n(11),h=function(t){function e(t,n){var r,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(r=i(this,s(e).call(this,"Sprite"))).name=n,r.states={},r.container=t,r.options=f.verify(o,{body:[!0,["function"]],refs:[!1,["object"],{}],born:[!1,["function"],function(t){return t}],views:[!1,["object"],{}],rules:[!1,["object"],{}],origin:[!1,["function"],function(){return this.$body()}],states:[!1,["object"],{}],methods:[!1,["object"],{}],created:[!1,["function"],function(){}]}),r.init(),r}var n,r,h;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"init",value:function(){this.initStates()}},{key:"initStates",value:function(){var t=this.container.options.states.concat(l.defaultState),e=!0,n=!1,r=void 0;try{for(var o,i=t[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var s=o.value;this.states[s]=new c(s,this.options.states[s])}}catch(t){n=!0,r=t}finally{try{e||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"create",value:function(){return new y(this)}}])&&o(n.prototype,r),h&&o(n,h),e}();t.exports=h},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(1),f=function(t){function e(t){var n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=i(this,s(e).call(this,"States"))).name=t,n.options=c.verify(r,{fixed:[!1,["array","string"],[]],hidden:[!1,["array","string"],[]],export:[!1,["function"],function(){return this.$toOrigin()}]}),n}var n,r,f;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"isFixed",value:function(t){return"*"===this.options.fixed||this.options.fixed.includes(t)}},{key:"isHidden",value:function(t){return"*"===this.options.hidden||this.options.hidden.includes(t)}}])&&o(n.prototype,r),f&&o(n,f),e}();t.exports=f},function(t,e,n){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var a=n(0),c=n(2),f=n(1),l=function(t){function e(t){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=i(this,s(e).call(this,"Sprite"))).body={},n.refs={},n.soul=null,n.from=null,n.base=t,n.state=t.states.read,n.options=t.options,n.rawBody="",n.rawData=null,n.propertyNames=[],n.init(),n}var n,r,l;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(e,a),n=e,(r=[{key:"getBody",value:function(){var t=f.jpjs(this.body);return this.eachRefs(function(e,n){t[n]=e.getBody()}),t}},{key:"getKeys",value:function(){var t=Object.keys(this.base.options.refs);return this.propertyNames.concat(t)}},{key:"getProperty",value:function(t){if(this.propertyNames.includes(t))return this.unit[t];this.$systemError("getProperty","Property name(".concat(t,") not found."))}},{key:"isLive",value:function(){return!1!==this.status.live||(this.$systemError("isLive","This Sprite is dead."),!1)}},{key:"isReady",value:function(){return!!this.status.ready}},{key:"isReference",value:function(){return!!this.status.reference}},{key:"isInitialization",value:function(){return!!this.status.init}},{key:"isChange",value:function(t){if(t&&this.getProperty(t)){var e=this.unit[t];return f.isSprite(e)?e.isChange():e!==JSON.parse(this.rawBody)[t]}var n=this.rawBody!==JSON.stringify(this.body);return!!n||(this.eachRefs(function(t){if(n=t.isChange())return"_break"}),n)}},{key:"export",value:function(t){var e=null;return t?null==(e=this.base.states[t])&&this.$systemError("export","State(".concat(t,") not found.")):e=this.state,e.options.export.call(this.unit)}},{key:"toOrigin",value:function(){return this.options.origin.call(this.unit)}},{key:"out",value:function(){if(this.isLive())return this.soul=this.copy(),this.soul.from=this,this.sleep(),this.soul}},{key:"sleep",value:function(){this.status.live=!1,this.eachRefs(function(t){return t.sleep()})}},{key:"wakeup",value:function(){this.status.live=!0,this.eachRefs(function(t){return t.wakeup()})}},{key:"revive",value:function(){if(this.isLive()){if(this.from)return this.from.reborn(this.toOrigin()),this.dead();this.$systemError("revive","This Sprite is root.")}}},{key:"copy",value:function(){if(this.isReady())return this.base.create().born(this.toOrigin()).distortion(this.state.name);this.$systemError("copy","Sprite no ready.")}},{key:"dead",value:function(){if(this.isLive()){var t=this.from;if(this.from)return this.from.wakeup(),this.from.soul=null,this.from=null,this.sleep(),t;this.$systemError("dead","This Sprite is root.")}}},{key:"reborn",value:function(t){this.wakeup(),this.setBody(t)}},{key:"reset",value:function(t){this.isLive()&&(t?this.getProperty(t)&&(this.unit[t]=JSON.parse(this.rawBody)[t]):this.setBody(JSON.parse(this.rawData)))}},{key:"setBody",value:function(t){var e=this.options.born.call(this.unit,t)||{},n=!0,r=!1,o=void 0;try{for(var i,s=this.propertyNames[Symbol.iterator]();!(n=(i=s.next()).done);n=!0){var u=i.value;this.unit[u]=void 0===e[u]?this.unit[u]:e[u]}}catch(t){r=!0,o=t}finally{try{n||null==s.return||s.return()}finally{if(r)throw o}}this.eachRefs(function(t,n){t.isReady()?t.setBody(e[n]):t.born(e[n])})}},{key:"eachRefs",value:function(t){for(var e in this.refs){if("_break"===t(this.refs[e],e))break}}},{key:"distortion",value:function(t){if(this.isLive())return null==this.base.states[t]?this.$systemError("distortion","Name(".concat(t,") not found.")):(this.state=this.base.states[t],this.eachRefs(function(e){return e.distortion(t)}),this)}},{key:"born",value:function(t){if(this.isReady()&&this.$systemError("born","Sprite is ready."),this.isLive())return this.setBody(t),this.rawBody=JSON.stringify(this.body),this.rawData=JSON.stringify(t),this.base.options.created.call(this.unit),this.status.ready=!0,this}},{key:"init",value:function(){this.initUnit(),this.initBody(),this.checkBody(),this.initStatus(),this.rawBody=JSON.stringify(this.body),this.rawData=JSON.stringify(this.toOrigin()),this.propertyNames=Object.keys(this.body),this.status.init=!0}},{key:"initStatus",value:function(){this.status={live:!0,init:!1,ready:!1,reference:!1}}},{key:"initUnit",value:function(){for(var t in this.unit=new c(this),this.unit.$fn=this.getMethods(),this.unit.$views={},this.base.options.views){var e=this.base.options.views[t].bind(this.unit);Object.defineProperty(this.unit.$views,t,{get:e})}}},{key:"initBody",value:function(){var t=this.options.refs,e=this.options.body.call(this.unit);for(var n in e)this.body[n]=e[n],Object.defineProperty(this.unit,n,{get:this.getDefineProperty("body",n),set:this.setDefineProperty(n)});for(var r in t)this.refs[r]=this.base.container.make(t[r]),this.refs[r].status.reference=!0,Object.defineProperty(this.unit,r,{get:this.getDefineProperty("refs",r),set:this.setDefineProperty(r,!0)})}},{key:"checkBody",value:function(){for(var t in this.body){var e=this.body[t];"function"===f.getType(e)&&this.$systemError("checkBody","Body ".concat(t," can't be a function.")),"$"!==t[0]&&"_"!==t[0]||this.$systemError("checkBody","Body ".concat(t," has system symbol $ and _."))}}},{key:"getMethods",value:function(){var t={},e=this.base.container.options.methods;for(var n in e)t[n]=e[n].bind(this.unit);var r=this.base.options.methods;for(var o in r)t[o]=r[o].bind(this.unit);return t}},{key:"getRules",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=this.base.options.rules[t];return null==n&&this.$systemError("getRules","Rule name(".concat(t,") not found.")),this.base.container.getRules(this.unit,n.concat(e))}},{key:"validate",value:function(t){var e=this.getProperty(t),n=this.base.options.rules[t];return this.base.container.validate(this.unit,e,n)}},{key:"validateAll",value:function(){for(var t=Object.keys(this.base.options.rules),e={},n=!0,r=0,o=t;r<o.length;r++){var i=o[r],s=this.validate(i);!0!==s&&(e[i]=s,n=!1)}return this.eachRefs(function(t,r){e[r]=t.validateAll(),!0!==e[r].success&&(n=!1)}),{result:e,success:n}}},{key:"getDefineProperty",value:function(t,e){var n=this;return"refs"===t?function(){return n.refs[e].unit}:function(){return n.body[e]}}},{key:"setDefineProperty",value:function(t,e){var n=this;return function(r){return!1===n.isLive()?n.$systemError("set","This Sprite is dead."):e?n.$systemError("set","This property(".concat(t,") is protect.")):void(n.body[t]=r)}}}])&&o(n.prototype,r),l&&o(n,l),e}();t.exports=l}])});