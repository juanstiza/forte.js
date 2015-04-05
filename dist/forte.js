/**
 * @license
 * lodash 3.6.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern include="each,sortBy,isEqual" category="lang" --output tmp/lodash.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.6.0';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect host constructors (Safari > 5). */
  var reHostCtor = /^\[object .+?Constructor\]$/;

  /**
   * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
   * In addition to special characters the forward slash is escaped to allow for
   * easier `eval` use and `Function` compilation.
   */
  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare to `other`.
   * @param {*} other The value to compare to `value`.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsReflexive = value === value,
          othIsReflexive = other === other;

      if (value > other || !valIsReflexive || (typeof value == 'undefined' && othIsReflexive)) {
        return 1;
      }
      if (value < other || !othIsReflexive || (typeof other == 'undefined' && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it is not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare to `other`.
   * @param {Object} other The object to compare to `object`.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /*--------------------------------------------------------------------------*/

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /** Used to detect DOM support. */
  var document = (document = root.window) && document.document;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
   * of values.
   */
  var objToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reNative = RegExp('^' +
    escapeRegExp(objToString)
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Native method references. */
  var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer,
      bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
      floor = Math.floor,
      getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array;

  /** Used to clone array buffers. */
  var Float64Array = (function() {
    // Safari 5 errors when using an array buffer to initialize a typed array
    // where the array buffer's `byteLength` is not a multiple of the typed
    // array's `BYTES_PER_ELEMENT`.
    try {
      var func = isNative(func = root.Float64Array) && func,
          result = new func(new ArrayBuffer(10), 0, 1) && func;
    } catch(e) {}
    return result;
  }());

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeIsFinite = root.isFinite,
      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
      nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite;

  /** Used as the size, in bytes, of each `Float64Array` element. */
  var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

  /**
   * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
   * of an array-like value.
   */
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that return a boolean or single value will
   * automatically end the chain returning the unwrapped value. Explicit chaining
   * may be enabled using `_.chain`. The execution of chained methods is lazy,
   * that is, execution is deferred until `_#value` is implicitly or explicitly
   * called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization that merges iteratees to avoid creating intermediate
   * arrays and reduce the number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
   * `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
   * and `where`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
   * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
   * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
   * `keysIn`, `map`, `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`,
   * `mixin`, `negate`, `noop`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
   * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `sortByOrder`, `splice`,
   * `spread`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`,
   * `throttle`, `thru`, `times`, `toArray`, `toPlainObject`, `transform`,
   * `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`, `where`,
   * `without`, `wrap`, `xor`, `zip`, and `zipObject`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
   * `identity`, `includes`, `indexOf`, `inRange`, `isArguments`, `isArray`,
   * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`,
   * `isFinite`,`isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
   * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
   * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
   * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
   * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
   * `startCase`, `startsWith`, `sum`, `template`, `trim`, `trimLeft`,
   * `trimRight`, `trunc`, `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper method `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, n) {
   *   return sum + n;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) {
   *   return n * n;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * An object environment feature flags.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function(x) {

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but Firefox OS certified apps, older Opera mobile browsers, and
     * the PlayStation 3; forced `false` for Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = /\bthis\b/.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if the DOM is supported.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.dom = document.createDocumentFragment().nodeType === 11;
    } catch(e) {
      support.dom = false;
    }

    /**
     * Detect if `arguments` object indexes are non-enumerable.
     *
     * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
     * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
     * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
     * checks for indexes that exceed their function's formal parameters with
     * associated values of `0`.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
    } catch(e) {
      support.nonEnumArgs = true;
    }
  }(0, 0));

  /*------------------------------------------------------------------------*/

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * Copies the properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Array} props The property names to copy.
   * @returns {Object} Returns `object`.
   */
  function baseCopy(source, object, props) {
    if (!props) {
      props = object;
      object = {};
    }
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  /**
   * The base implementation of `_.callback` which supports specifying the
   * number of arguments to provide to `func`.
   *
   * @private
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function baseCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (type == 'function') {
      return typeof thisArg == 'undefined'
        ? func
        : bindCallback(func, thisArg, argCount);
    }
    if (func == null) {
      return identity;
    }
    if (type == 'object') {
      return baseMatches(func);
    }
    return typeof thisArg == 'undefined'
      ? baseProperty(func + '')
      : baseMatchesProperty(func + '', thisArg);
  }

  /**
   * The base implementation of `_.clone` without support for argument juggling
   * and `this` binding `customizer` functions.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The object `value` belongs to.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates clones with source counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object) : customizer(value);
    }
    if (typeof result != 'undefined') {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return arrayCopy(value, result);
      }
    } else {
      var tag = objToString.call(value),
          isFunc = tag == funcTag;

      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return baseCopy(value, result, keys(value));
        }
      } else {
        return cloneableTags[tag]
          ? initCloneByTag(value, tag, isDeep)
          : (object ? value : {});
      }
    }
    // Check for circular references and return corresponding clone.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    // Add the source value to the stack of traversed objects and associate it with its clone.
    stackA.push(value);
    stackB.push(result);

    // Recursively populate clone (susceptible to call stack limits).
    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
      result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
    });
    return result;
  }

  /**
   * The base implementation of `_.forEach` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iterator functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forIn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForIn(object, iteratee) {
    return baseFor(object, iteratee, keysIn);
  }

  /**
   * The base implementation of `_.forOwn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.isEqual` without support for `this` binding
   * `customizer` functions.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
    // Exit early for identical values.
    if (value === other) {
      // Treat `+0` vs. `-0` as not equal.
      return value !== 0 || (1 / value == 1 / other);
    }
    var valType = typeof value,
        othType = typeof other;

    // Exit early for unlike primitive values.
    if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
        value == null || other == null) {
      // Return `false` unless both values are `NaN`.
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

    if (!objIsArr) {
      objTag = objToString.call(object);
      if (objTag == argsTag) {
        objTag = objectTag;
      } else if (objTag != objectTag) {
        objIsArr = isTypedArray(object);
      }
    }
    if (!othIsArr) {
      othTag = objToString.call(other);
      if (othTag == argsTag) {
        othTag = objectTag;
      } else if (othTag != objectTag) {
        othIsArr = isTypedArray(other);
      }
    }
    var objIsObj = (objTag == objectTag || (isLoose && objTag == funcTag)),
        othIsObj = (othTag == objectTag || (isLoose && othTag == funcTag)),
        isSameTag = objTag == othTag;

    if (isSameTag && !(objIsArr || objIsObj)) {
      return equalByTag(object, other, objTag);
    }
    if (isLoose) {
      if (!isSameTag && !(objIsObj && othIsObj)) {
        return false;
      }
    } else {
      var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
          othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

      if (valWrapped || othWrapped) {
        return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
      }
      if (!isSameTag) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    // For more information on detecting circular references see https://es5.github.io/#JO.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == object) {
        return stackB[length] == other;
      }
    }
    // Add `object` and `other` to the stack of traversed objects.
    stackA.push(object);
    stackB.push(other);

    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

    stackA.pop();
    stackB.pop();

    return result;
  }

  /**
   * The base implementation of `_.isMatch` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The source property names to match.
   * @param {Array} values The source values to match.
   * @param {Array} strictCompareFlags Strict comparison flags for source values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
    var index = -1,
        length = props.length,
        noCustomizer = !customizer;

    while (++index < length) {
      if ((noCustomizer && strictCompareFlags[index])
            ? values[index] !== object[props[index]]
            : !(props[index] in object)
          ) {
        return false;
      }
    }
    index = -1;
    while (++index < length) {
      var key = props[index],
          objValue = object[key],
          srcValue = values[index];

      if (noCustomizer && strictCompareFlags[index]) {
        var result = typeof objValue != 'undefined' || (key in object);
      } else {
        result = customizer ? customizer(objValue, srcValue, key) : undefined;
        if (typeof result == 'undefined') {
          result = baseIsEqual(srcValue, objValue, customizer, true);
        }
      }
      if (!result) {
        return false;
      }
    }
    return true;
  }

  /**
   * The base implementation of `_.matches` which does not clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   */
  function baseMatches(source) {
    var props = keys(source),
        length = props.length;

    if (!length) {
      return constant(true);
    }
    if (length == 1) {
      var key = props[0],
          value = source[key];

      if (isStrictComparable(value)) {
        return function(object) {
          return object != null && object[key] === value &&
            (typeof value != 'undefined' || (key in toObject(object)));
        };
      }
    }
    var values = Array(length),
        strictCompareFlags = Array(length);

    while (length--) {
      value = source[props[length]];
      values[length] = value;
      strictCompareFlags[length] = isStrictComparable(value);
    }
    return function(object) {
      return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
    };
  }

  /**
   * The base implementation of `_.matchesProperty` which does not coerce `key`
   * to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} value The value to compare.
   * @returns {Function} Returns the new function.
   */
  function baseMatchesProperty(key, value) {
    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value &&
          (typeof value != 'undefined' || (key in toObject(object)));
      };
    }
    return function(object) {
      return object != null && baseIsEqual(value, object[key], null, true);
    };
  }

  /**
   * The base implementation of `_.property` which does not coerce `key` to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define
   * the sort order of `array` and replaces criteria objects with their
   * corresponding values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * returned by `keysFunc`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    var index = -1,
        length = props.length,
        result = Array(length);

    while (++index < length) {
      result[index] = object[props[index]];
    }
    return result;
  }

  /**
   * A specialized version of `baseCallback` which only supports `this` binding
   * and specifying the number of arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    if (typeof thisArg == 'undefined') {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
      case 5: return function(value, other, key, object, source) {
        return func.call(thisArg, value, other, key, object, source);
      };
    }
    return function() {
      return func.apply(thisArg, arguments);
    };
  }

  /**
   * Creates a clone of the given array buffer.
   *
   * @private
   * @param {ArrayBuffer} buffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function bufferClone(buffer) {
    return bufferSlice.call(buffer, 0);
  }
  if (!bufferSlice) {
    // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
    bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
      var byteLength = buffer.byteLength,
          floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
          offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
          result = new ArrayBuffer(byteLength);

      if (floatLength) {
        var view = new Float64Array(result, 0, floatLength);
        view.set(new Float64Array(buffer, 0, floatLength));
      }
      if (byteLength != offset) {
        view = new Uint8Array(result, offset);
        view.set(new Uint8Array(buffer, offset));
      }
      return result;
    };
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      var length = collection ? collection.length : 0;
      if (!isLength(length)) {
        return eachFunc(collection, iteratee);
      }
      var index = fromRight ? length : -1,
          iterable = toObject(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * Creates a base function for `_.forIn` or `_.forInRight`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var iterable = toObject(object),
          props = keysFunc(object),
          length = props.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length)) {
        var key = props[index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * Creates a function for `_.forEach` or `_.forEachRight`.
   *
   * @private
   * @param {Function} arrayFunc The function to iterate over an array.
   * @param {Function} eachFunc The function to iterate over a collection.
   * @returns {Function} Returns the new each function.
   */
  function createForEach(arrayFunc, eachFunc) {
    return function(collection, iteratee, thisArg) {
      return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
        ? arrayFunc(collection, iteratee)
        : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
    };
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing arrays.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var index = -1,
        arrLength = array.length,
        othLength = other.length,
        result = true;

    if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (result && ++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      result = undefined;
      if (customizer) {
        result = isLoose
          ? customizer(othValue, arrValue, index)
          : customizer(arrValue, othValue, index);
      }
      if (typeof result == 'undefined') {
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          var othIndex = othLength;
          while (othIndex--) {
            othValue = other[othIndex];
            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
            if (result) {
              break;
            }
          }
        } else {
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
        }
      }
    }
    return !!result;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} value The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag) {
    switch (tag) {
      case boolTag:
      case dateTag:
        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
        return +object == +other;

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case numberTag:
        // Treat `NaN` vs. `NaN` as equal.
        return (object != +object)
          ? other != +other
          // But, treat `-0` vs. `+0` as not equal.
          : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings primitives and string
        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
        return object == (other + '');
    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isLoose) {
      return false;
    }
    var skipCtor = isLoose,
        index = -1;

    while (++index < objLength) {
      var key = objProps[index],
          result = isLoose ? key in other : hasOwnProperty.call(other, key);

      if (result) {
        var objValue = object[key],
            othValue = other[key];

        result = undefined;
        if (customizer) {
          result = isLoose
            ? customizer(othValue, objValue, key)
            : customizer(objValue, othValue, key);
        }
        if (typeof result == 'undefined') {
          // Recursively compare objects (susceptible to call stack limits).
          result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
        }
      }
      if (!result) {
        return false;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (!skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the appropriate "callback" function. If the `_.callback` method is
   * customized this function returns the custom method, otherwise it returns
   * the `baseCallback` function. If arguments are provided the chosen function
   * is invoked with them and its result is returned.
   *
   * @private
   * @returns {Function} Returns the chosen function or its result.
   */
  function getCallback(func, thisArg, argCount) {
    var result = lodash.callback || callback;
    result = result === callback ? baseCallback : result;
    return argCount ? result(func, thisArg, argCount) : result;
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add array properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    var Ctor = object.constructor;
    if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
      Ctor = Object;
    }
    return new Ctor;
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return bufferClone(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        var buffer = object.buffer;
        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        var result = new Ctor(object.source, reFlags.exec(object));
        result.lastIndex = object.lastIndex;
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = +value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number') {
      var length = object.length,
          prereq = isLength(length) && isIndex(index, length);
    } else {
      prereq = type == 'string' && index in object;
    }
    if (prereq) {
      var other = object[index];
      return value === value ? (value === other) : (other !== other);
    }
    return false;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
  }

  /**
   * A fallback implementation of `_.isPlainObject` which checks if `value`
   * is an object created by the `Object` constructor or has a `[[Prototype]]`
   * of `null`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    var Ctor,
        support = lodash.support;

    // Exit early for non `Object` objects.
    if (!(isObjectLike(value) && objToString.call(value) == objectTag) ||
        (!hasOwnProperty.call(value, 'constructor') &&
          (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
      return false;
    }
    // IE < 9 iterates inherited properties before own properties. If the first
    // iterated property is an object's own property then there are no inherited
    // enumerable properties.
    var result;
    // In most environments an object's own properties are iterated before
    // its inherited properties. If the last iterated property is an object's
    // own property then there are no inherited enumerable properties.
    baseForIn(value, function(subValue, key) {
      result = key;
    });
    return typeof result == 'undefined' || hasOwnProperty.call(value, result);
  }

  /**
   * A fallback implementation of `Object.keys` which creates an array of the
   * own enumerable property names of `object`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   */
  function shimKeys(object) {
    var props = keysIn(object),
        propsLength = props.length,
        length = propsLength && object.length,
        support = lodash.support;

    var allowIndexes = length && isLength(length) &&
      (isArray(object) || (support.nonEnumArgs && isArguments(object)));

    var index = -1,
        result = [];

    while (++index < propsLength) {
      var key = props[index];
      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to an object if it is not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    return isObject(value) ? value : Object(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Iterates over elements of `collection` invoking `iteratee` for each element.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection). Iterator functions may exit iteration early
   * by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a `length` property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2]).forEach(function(n) {
   *   console.log(n);
   * }).value();
   * // => logs each value from left to right and returns the array
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
   *   console.log(n, key);
   * });
   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
   */
  var forEach = createForEach(arrayEach, baseEach);

  /**
   * Creates an array of elements, sorted in ascending order by the results of
   * running each element in a collection through `iteratee`. This method performs
   * a stable sort, that is, it preserves the original sort order of equal elements.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Array|Function|Object|string} [iteratee=_.identity] The function
   *  invoked per iteration. If a property name or an object is provided it is
   *  used to create a `_.property` or `_.matches` style callback respectively.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new sorted array.
   * @example
   *
   * _.sortBy([1, 2, 3], function(n) {
   *   return Math.sin(n);
   * });
   * // => [3, 1, 2]
   *
   * _.sortBy([1, 2, 3], function(n) {
   *   return this.sin(n);
   * }, Math);
   * // => [3, 1, 2]
   *
   * var users = [
   *   { 'user': 'fred' },
   *   { 'user': 'pebbles' },
   *   { 'user': 'barney' }
   * ];
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.sortBy(users, 'user'), 'user');
   * // => ['barney', 'fred', 'pebbles']
   */
  function sortBy(collection, iteratee, thisArg) {
    if (collection == null) {
      return [];
    }
    var index = -1,
        length = collection.length,
        result = isLength(length) ? Array(length) : [];

    if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
      iteratee = null;
    }
    iteratee = getCallback(iteratee, thisArg, 3);
    baseEach(collection, function(value, key, collection) {
      result[++index] = { 'criteria': iteratee(value, key, collection), 'index': index, 'value': value };
    });
    return baseSortBy(result, compareAscending);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
   * otherwise they are assigned by reference. If `customizer` is provided it is
   * invoked to produce the cloned values. If `customizer` returns `undefined`
   * cloning is handled by the method instead. The `customizer` is bound to
   * `thisArg` and invoked with two argument; (value [, index|key, object]).
   *
   * **Note:** This method is loosely based on the
   * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
   * The enumerable properties of `arguments` objects and objects created by
   * constructors other than `Object` are cloned to plain `Object` objects. An
   * empty object is returned for uncloneable values such as functions, DOM nodes,
   * Maps, Sets, and WeakMaps.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {*} Returns the cloned value.
   * @example
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * var shallow = _.clone(users);
   * shallow[0] === users[0];
   * // => true
   *
   * var deep = _.clone(users, true);
   * deep[0] === users[0];
   * // => false
   *
   * // using a customizer callback
   * var el = _.clone(document.body, function(value) {
   *   if (_.isElement(value)) {
   *     return value.cloneNode(false);
   *   }
   * });
   *
   * el === document.body
   * // => false
   * el.nodeName
   * // => BODY
   * el.childNodes.length;
   * // => 0
   */
  function clone(value, isDeep, customizer, thisArg) {
    if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
      isDeep = false;
    }
    else if (typeof isDeep == 'function') {
      thisArg = customizer;
      customizer = isDeep;
      isDeep = false;
    }
    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
    return baseClone(value, isDeep, customizer);
  }

  /**
   * Creates a deep clone of `value`. If `customizer` is provided it is invoked
   * to produce the cloned values. If `customizer` returns `undefined` cloning
   * is handled by the method instead. The `customizer` is bound to `thisArg`
   * and invoked with two argument; (value [, index|key, object]).
   *
   * **Note:** This method is loosely based on the
   * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
   * The enumerable properties of `arguments` objects and objects created by
   * constructors other than `Object` are cloned to plain `Object` objects. An
   * empty object is returned for uncloneable values such as functions, DOM nodes,
   * Maps, Sets, and WeakMaps.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {*} Returns the deep cloned value.
   * @example
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * var deep = _.cloneDeep(users);
   * deep[0] === users[0];
   * // => false
   *
   * // using a customizer callback
   * var el = _.cloneDeep(document.body, function(value) {
   *   if (_.isElement(value)) {
   *     return value.cloneNode(true);
   *   }
   * });
   *
   * el === document.body
   * // => false
   * el.nodeName
   * // => BODY
   * el.childNodes.length;
   * // => 20
   */
  function cloneDeep(value, customizer, thisArg) {
    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
    return baseClone(value, true, customizer);
  }

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    var length = isObjectLike(value) ? value.length : undefined;
    return isLength(length) && objToString.call(value) == argsTag;
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(function() { return arguments; }());
   * // => false
   */
  var isArray = nativeIsArray || function(value) {
    return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
  };

  /**
   * Checks if `value` is classified as a boolean primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isBoolean(false);
   * // => true
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
  }

  /**
   * Checks if `value` is classified as a `Date` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isDate(new Date);
   * // => true
   *
   * _.isDate('Mon April 23 2012');
   * // => false
   */
  function isDate(value) {
    return isObjectLike(value) && objToString.call(value) == dateTag;
  }

  /**
   * Checks if `value` is a DOM element.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
   * @example
   *
   * _.isElement(document.body);
   * // => true
   *
   * _.isElement('<body>');
   * // => false
   */
  function isElement(value) {
    return !!value && value.nodeType === 1 && isObjectLike(value) &&
      (objToString.call(value).indexOf('Element') > -1);
  }
  // Fallback for environments without DOM support.
  if (!support.dom) {
    isElement = function(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    };
  }

  /**
   * Checks if `value` is empty. A value is considered empty unless it is an
   * `arguments` object, array, string, or jQuery-like collection with a length
   * greater than `0` or an object with own enumerable properties.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Array|Object|string} value The value to inspect.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    var length = value.length;
    if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
        (isObjectLike(value) && isFunction(value.splice)))) {
      return !length;
    }
    return !keys(value).length;
  }

  /**
   * Performs a deep comparison between two values to determine if they are
   * equivalent. If `customizer` is provided it is invoked to compare values.
   * If `customizer` returns `undefined` comparisons are handled by the method
   * instead. The `customizer` is bound to `thisArg` and invoked with three
   * arguments: (value, other [, index|key]).
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. Functions and DOM nodes
   * are **not** supported. Provide a customizer function to extend support
   * for comparing other values.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var other = { 'user': 'fred' };
   *
   * object == other;
   * // => false
   *
   * _.isEqual(object, other);
   * // => true
   *
   * // using a customizer callback
   * var array = ['hello', 'goodbye'];
   * var other = ['hi', 'goodbye'];
   *
   * _.isEqual(array, other, function(value, other) {
   *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
   *     return true;
   *   }
   * });
   * // => true
   */
  function isEqual(value, other, customizer, thisArg) {
    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
    if (!customizer && isStrictComparable(value) && isStrictComparable(other)) {
      return value === other;
    }
    var result = customizer ? customizer(value, other) : undefined;
    return typeof result == 'undefined' ? baseIsEqual(value, other, customizer) : !!result;
  }

  /**
   * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
   * `SyntaxError`, `TypeError`, or `URIError` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
   * @example
   *
   * _.isError(new Error);
   * // => true
   *
   * _.isError(Error);
   * // => false
   */
  function isError(value) {
    return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
  }

  /**
   * Checks if `value` is a finite primitive number.
   *
   * **Note:** This method is based on [`Number.isFinite`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite).
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
   * @example
   *
   * _.isFinite(10);
   * // => true
   *
   * _.isFinite('10');
   * // => false
   *
   * _.isFinite(true);
   * // => false
   *
   * _.isFinite(Object(10));
   * // => false
   *
   * _.isFinite(Infinity);
   * // => false
   */
  var isFinite = nativeNumIsFinite || function(value) {
    return typeof value == 'number' && nativeIsFinite(value);
  };

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in older versions of Chrome and Safari which return 'function' for regexes
    // and Safari 8 equivalents which return 'object' for typed array constructors.
    return objToString.call(value) == funcTag;
  };

  /**
   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type == 'function' || (!!value && type == 'object');
  }

  /**
   * Performs a deep comparison between `object` and `source` to determine if
   * `object` contains equivalent property values. If `customizer` is provided
   * it is invoked to compare values. If `customizer` returns `undefined`
   * comparisons are handled by the method instead. The `customizer` is bound
   * to `thisArg` and invoked with three arguments: (value, other, index|key).
   *
   * **Note:** This method supports comparing properties of arrays, booleans,
   * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
   * and DOM nodes are **not** supported. Provide a customizer function to extend
   * support for comparing other values.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   * @example
   *
   * var object = { 'user': 'fred', 'age': 40 };
   *
   * _.isMatch(object, { 'age': 40 });
   * // => true
   *
   * _.isMatch(object, { 'age': 36 });
   * // => false
   *
   * // using a customizer callback
   * var object = { 'greeting': 'hello' };
   * var source = { 'greeting': 'hi' };
   *
   * _.isMatch(object, source, function(value, other) {
   *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
   * });
   * // => true
   */
  function isMatch(object, source, customizer, thisArg) {
    var props = keys(source),
        length = props.length;

    if (!length) {
      return true;
    }
    if (object == null) {
      return false;
    }
    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 3);
    if (!customizer && length == 1) {
      var key = props[0],
          value = source[key];

      if (isStrictComparable(value)) {
        return value === object[key] && (typeof value != 'undefined' || (key in toObject(object)));
      }
    }
    var values = Array(length),
        strictCompareFlags = Array(length);

    while (length--) {
      value = values[length] = source[props[length]];
      strictCompareFlags[length] = isStrictComparable(value);
    }
    return baseIsMatch(toObject(object), props, values, strictCompareFlags, customizer);
  }

  /**
   * Checks if `value` is `NaN`.
   *
   * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
   * which returns `true` for `undefined` and other non-numeric values.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // An `NaN` primitive is the only value that is not equal to itself.
    // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
    return isNumber(value) && value != +value;
  }

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (objToString.call(value) == funcTag) {
      return reNative.test(fnToString.call(value));
    }
    return isObjectLike(value) && reHostCtor.test(value);
  }

  /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(void 0);
   * // => false
   */
  function isNull(value) {
    return value === null;
  }

  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
   * as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isNumber(8.4);
   * // => true
   *
   * _.isNumber(NaN);
   * // => true
   *
   * _.isNumber('8.4');
   * // => false
   */
  function isNumber(value) {
    return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
  }

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * **Note:** This method assumes objects created by the `Object` constructor
   * have no inherited enumerable properties.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
    if (!(value && objToString.call(value) == objectTag)) {
      return false;
    }
    var valueOf = value.valueOf,
        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto
      ? (value == objProto || getPrototypeOf(value) == objProto)
      : shimIsPlainObject(value);
  };

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  function isRegExp(value) {
    return (isObjectLike(value) && objToString.call(value) == regexpTag) || false;
  }

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  function isTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */
  function isUndefined(value) {
    return typeof value == 'undefined';
  }

  /**
   * Converts `value` to an array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * (function() {
   *   return _.toArray(arguments).slice(1);
   * }(1, 2, 3));
   * // => [2, 3]
   */
  function toArray(value) {
    var length = value ? value.length : 0;
    if (!isLength(length)) {
      return values(value);
    }
    if (!length) {
      return [];
    }
    return arrayCopy(value);
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable
   * properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return baseCopy(value, keysIn(value));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (object) {
      var Ctor = object.constructor,
          length = object.length;
    }
    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
        (typeof object != 'function' && (length && isLength(length)))) {
      return shimKeys(object);
    }
    return isObject(object) ? nativeKeys(object) : [];
  };

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length;
    length = (length && isLength(length) &&
      (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

    var Ctor = object.constructor,
        index = -1,
        isProto = typeof Ctor == 'function' && Ctor.prototype === object,
        result = Array(length),
        skipIndexes = length > 0;

    while (++index < length) {
      result[index] = (index + '');
    }
    for (var key in object) {
      if (!(skipIndexes && isIndex(key, length)) &&
          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own enumerable property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */
  function values(object) {
    return baseValues(object, keys(object));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
   * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escapeRegExp('[lodash](https://lodash.com/)');
   * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
   */
  function escapeRegExp(string) {
    string = baseToString(string);
    return (string && reHasRegExpChars.test(string))
      ? string.replace(reRegExpChars, '\\$&')
      : string;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and arguments of the created function. If `func` is a property name the
   * created callback returns the property value for a given element. If `func`
   * is an object the created callback returns `true` for elements that contain
   * the equivalent object properties, otherwise it returns `false`.
   *
   * @static
   * @memberOf _
   * @alias iteratee
   * @category Utility
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
   *   if (!match) {
   *     return callback(func, thisArg);
   *   }
   *   return function(object) {
   *     return match[2] == 'gt'
   *       ? object[match[1]] > match[3]
   *       : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(users, 'age__gt36');
   * // => [{ 'user': 'fred', 'age': 40 }]
   */
  function callback(func, thisArg, guard) {
    if (guard && isIterateeCall(func, thisArg, guard)) {
      thisArg = null;
    }
    return isObjectLike(func)
      ? matches(func)
      : baseCallback(func, thisArg);
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var getter = _.constant(object);
   *
   * getter() === object;
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function which performs a deep comparison between a given object
   * and `source`, returning `true` if the given object has equivalent property
   * values, else `false`.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
   */
  function matches(source) {
    return baseMatches(baseClone(source, true));
  }

  /*------------------------------------------------------------------------*/

  // Add functions that return wrapped values when chaining.
  lodash.callback = callback;
  lodash.constant = constant;
  lodash.forEach = forEach;
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.matches = matches;
  lodash.sortBy = sortBy;
  lodash.toArray = toArray;
  lodash.toPlainObject = toPlainObject;
  lodash.values = values;

  // Add aliases.
  lodash.each = forEach;
  lodash.iteratee = callback;

  /*------------------------------------------------------------------------*/

  // Add functions that return unwrapped values when chaining.
  lodash.clone = clone;
  lodash.cloneDeep = cloneDeep;
  lodash.escapeRegExp = escapeRegExp;
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isBoolean = isBoolean;
  lodash.isDate = isDate;
  lodash.isElement = isElement;
  lodash.isEmpty = isEmpty;
  lodash.isEqual = isEqual;
  lodash.isError = isError;
  lodash.isFinite = isFinite;
  lodash.isFunction = isFunction;
  lodash.isMatch = isMatch;
  lodash.isNaN = isNaN;
  lodash.isNative = isNative;
  lodash.isNull = isNull;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isPlainObject = isPlainObject;
  lodash.isRegExp = isRegExp;
  lodash.isString = isString;
  lodash.isTypedArray = isTypedArray;
  lodash.isUndefined = isUndefined;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = VERSION;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    }
    // Export for Narwhal or Rhino -require.
    else {
      freeExports._ = lodash;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = lodash;
  }
}.call(this));


(function(){

  var VERSION = '0.0.1';

  var forte = forte || {};

  forte.pitchClassCollectionFormats = {
  numeric: {
      0:'0',
      1:'1',
      2:'2',
      3:'3',
      4:'4',
      5:'5',
      6:'6',
      7:'7',
      8:'8',
      9:'9',
      10:'10',
      11:'11'
  },
  alphanumeric: {
      0:'0',
      1:'1',
      2:'2',
      3:'3',
      4:'4',
      5:'5',
      6:'6',
      7:'7',
      8:'8',
      9:'9',
      10:'a',
      11:'b'
  },
  latin: {
      0:'do',
      1:['do#','reb'],
      2:'re',
      3:['re#','mib'],
      4:'mi',
      5:'fa',
      6:['fa#','solb'],
      7:'sol',
      8:['sol#','lab'],
      9:'la',
      10:['la#','sib'],
      11:'si'
  },
  american: {
      0:'c',
      1:['c#','db'],
      2:'d',
      3:['d#','eb'],
      4:'e',
      5:'f',
      6:['f#','gb'],
      7:'g',
      8:['g#','ab'],
      9:'a',
      10:['a#','bb'],
      11:'b'
  }
};

forte.pitchClassCollectionTypes = {
    primeForm: {
        open: '(',
        close: ')',
        separator: ',',
        max: 12,
        min: 3
    },
    intervalVector: {
        open: '<',
        close: '>',
        separator: '',
        max: 6,
        min: 6
    },
    primeInversion: {
        open: '[',
        close: ']',
        separator: ',',
        max: 12,
        min: 3
    },
    normalForm: {
        open: '',
        close: '',
        separator: ',',
        max: 12,
        min: 3
    }
};

forte.pitchClassSetData = {
"3": {
    "3-1": [0, 1, 2],
    "3-2": [0, 1, 3],
    "3-3": [0, 1, 4],
    "3-4": [0, 1, 5],
    "3-5": [0, 1, 6],
    "3-6": [0, 2, 4],
    "3-7": [0, 2, 5],
    "3-8": [0, 2, 6],
    "3-9": [0, 2, 7],
    "3-10": [0, 3, 6],
    "3-11": [0, 3, 7],
    "3-12": [0, 4, 8]
},
"4": {
    "4-1": [0, 1, 2, 3],
    "4-2": [0, 1, 2, 4],
    "4-3": [0, 1, 3, 4],
    "4-4": [0, 1, 2, 5],
    "4-5": [0, 1, 2, 6],
    "4-6": [0, 1, 2, 7],
    "4-7": [0, 1, 4, 5],
    "4-8": [0, 1, 5, 6],
    "4-9": [0, 1, 6, 7],
    "4-10": [0, 2, 3, 5],
    "4-11": [0, 1, 3, 5],
    "4-12": [0, 2, 3, 6],
    "4-13": [0, 1, 3, 6],
    "4-14": [0, 2, 3, 7],
    "4-z15": [0, 1, 4, 6],
    "4-16": [0, 1, 5, 7],
    "4-17": [0, 3, 4, 7],
    "4-18": [0, 1, 4, 7],
    "4-19": [0, 1, 4, 8],
    "4-20": [0, 1, 5, 8],
    "4-21": [0, 2, 4, 6],
    "4-22": [0, 2, 4, 7],
    "4-23": [0, 2, 5, 7],
    "4-24": [0, 2, 4, 8],
    "4-25": [0, 2, 6, 8],
    "4-26": [0, 3, 5, 8],
    "4-27": [0, 2, 5, 8],
    "4-28": [0, 3, 6, 9],
    "4-z29": [0, 1, 3, 7]
},
"5": {
    "5-1": [0, 1, 2, 3, 4],
    "5-2": [0, 1, 2, 3, 5],
    "5-3": [0, 1, 2, 4, 5],
    "5-4": [0, 1, 2, 3, 6],
    "5-5": [0, 1, 2, 3, 7],
    "5-6": [0, 1, 2, 5, 6],
    "5-7": [0, 1, 2, 6, 7],
    "5-8": [0, 2, 3, 4, 6],
    "5-9": [0, 1, 2, 4, 6],
    "5-10": [0, 1, 3, 4, 6],
    "5-11": [0, 2, 3, 4, 7],
    "5-z12": [0, 1, 3, 5, 6],
    "5-13": [0, 1, 2, 4, 8],
    "5-14": [0, 1, 2, 5, 7],
    "5-15": [0, 1, 2, 6, 8],
    "5-16": [0, 1, 3, 4, 7],
    "5-z17": [0, 1, 3, 4, 8],
    "5-z18": [0, 1, 4, 5, 7],
    "5-19": [0, 1, 3, 6, 7],
    "5-20": [0, 1, 5, 6, 8],
    "5-21": [0, 1, 4, 5, 8],
    "5-22": [0, 1, 4, 7, 8],
    "5-23": [0, 2, 3, 5, 7],
    "5-24": [0, 1, 3, 5, 7],
    "5-25": [0, 2, 3, 5, 8],
    "5-26": [0, 2, 4, 5, 8],
    "5-27": [0, 1, 3, 5, 8],
    "5-28": [0, 2, 3, 6, 8],
    "5-29": [0, 1, 3, 6, 8],
    "5-30": [0, 1, 4, 6, 8],
    "5-31": [0, 1, 3, 6, 9],
    "5-32": [0, 1, 4, 6, 9],
    "5-33": [0, 2, 4, 6, 8],
    "5-34": [0, 2, 4, 6, 9],
    "5-35": [0, 2, 4, 7, 9],
    "5-z36": [0, 1, 2, 4, 7],
    "5-z37": [0, 3, 4, 5, 8],
    "5-z38": [0, 1, 2, 5, 8]
},
"6": {
    "6-1": [0, 1, 2, 3, 4, 5],
    "6-2": [0, 1, 2, 3, 4, 6],
    "6-z3": [0, 1, 2, 3, 5, 6],
    "6-z4": [0, 1, 2, 4, 5, 6],
    "6-5": [0, 1, 2, 3, 6, 7],
    "6-z6": [0, 1, 2, 5, 6, 7],
    "6-7": [0, 1, 2, 6, 7, 8],
    "6-8": [0, 2, 3, 4, 5, 7],
    "6-9": [0, 1, 2, 3, 5, 7],
    "6-z10": [0, 1, 3, 4, 5, 7],
    "6-z11": [0, 1, 2, 4, 5, 7],
    "6-z12": [0, 1, 2, 4, 6, 7],
    "6-z13": [0, 1, 3, 4, 6, 7],
    "6-14": [0, 1, 3, 4, 5, 8],
    "6-15": [0, 1, 2, 4, 5, 8],
    "6-16": [0, 1, 4, 5, 6, 8],
    "6-z17": [0, 1, 2, 4, 7, 8],
    "6-18": [0, 1, 2, 5, 7, 8],
    "6-z19": [0, 1, 3, 4, 7, 8],
    "6-20": [0, 1, 4, 5, 8, 9],
    "6-21": [0, 2, 3, 4, 6, 8],
    "6-22": [0, 1, 2, 4, 6, 8],
    "6-z23": [0, 2, 3, 5, 6, 8],
    "6-z24": [0, 1, 3, 4, 6, 8],
    "6-z25": [0, 1, 3, 5, 6, 8],
    "6-z26": [0, 1, 3, 5, 7, 8],
    "6-27": [0, 1, 3, 4, 6, 9],
    "6-z28": [0, 1, 3, 5, 6, 9],
    "6-z29": [0, 2, 3, 6, 7, 9],
    "6-30": [0, 1, 3, 6, 7, 9],
    "6-31": [0, 1, 4, 5, 7, 9],
    "6-32": [0, 2, 4, 5, 7, 9],
    "6-33": [0, 2, 3, 5, 7, 9],
    "6-34": [0, 1, 3, 5, 7, 9],
    "6-35": [0, 2, 4, 6, 8, 10],
    "6-z36": [0, 1, 2, 3, 4, 7],
    "6-z37": [0, 1, 2, 3, 4, 8],
    "6-z38": [0, 1, 2, 3, 7, 8],
    "6-z39": [0, 2, 3, 4, 5, 8],
    "6-z40": [0, 1, 2, 3, 5, 8],
    "6-z41": [0, 1, 2, 3, 6, 8],
    "6-z42": [0, 1, 2, 3, 6, 9],
    "6-z43": [0, 1, 2, 5, 6, 8],
    "6-z44": [0, 1, 2, 5, 6, 9],
    "6-z45": [0, 2, 3, 4, 6, 9],
    "6-z46": [0, 1, 2, 4, 6, 9],
    "6-z47": [0, 1, 2, 4, 7, 9],
    "6-z48": [0, 1, 2, 5, 7, 9],
    "6-z49": [0, 1, 3, 4, 7, 9],
    "6-z50": [0, 1, 4, 6, 7, 9]
},
"7": {
    "7-1": [0, 1, 2, 3, 4, 5, 6],
    "7-2": [0, 1, 2, 3, 4, 5, 7],
    "7-3": [0, 1, 2, 3, 4, 5, 8],
    "7-4": [0, 1, 2, 3, 4, 6, 7],
    "7-5": [0, 1, 2, 3, 5, 6, 7],
    "7-6": [0, 1, 2, 3, 4, 7, 8],
    "7-7": [0, 1, 2, 3, 6, 7, 8],
    "7-8": [0, 2, 3, 4, 5, 6, 8],
    "7-9": [0, 1, 2, 3, 4, 6, 8],
    "7-10": [0, 1, 2, 3, 4, 6, 9],
    "7-11": [0, 1, 3, 4, 5, 6, 8],
    "7-z12": [0, 1, 2, 3, 4, 7, 9],
    "7-13": [0, 1, 2, 4, 5, 6, 8],
    "7-14": [0, 1, 2, 3, 5, 7, 8],
    "7-15": [0, 1, 2, 4, 6, 7, 8],
    "7-16": [0, 1, 2, 3, 5, 6, 9],
    "7-z17": [0, 1, 2, 4, 5, 6, 9],
    "7-z18": [0, 1, 4, 5, 6, 7, 9],
    "7-20": [0, 1, 2, 5, 6, 7, 9],
    "7-22": [0, 1, 2, 5, 6, 8, 9],
    "7-23": [0, 2, 3, 4, 5, 7, 9],
    "7-24": [0, 1, 2, 3, 5, 7, 9],
    "7-25": [0, 2, 3, 4, 6, 7, 9],
    "7-26": [0, 1, 3, 4, 5, 7, 9],
    "7-27": [0, 1, 2, 4, 5, 7, 9],
    "7-28": [0, 1, 3, 5, 6, 7, 9],
    "7-29": [0, 1, 2, 4, 6, 7, 9],
    "7-30": [0, 1, 2, 4, 6, 8, 9],
    "7-31": [0, 1, 3, 4, 6, 7, 9],
    "7-32": [0, 1, 3, 4, 6, 8, 9],
    "7-33": [0, 1, 2, 4, 6, 8, 10],
    "7-34": [0, 1, 3, 4, 6, 8, 10],
    "7-35": [0, 1, 3, 5, 6, 8, 10],
    "7-z36": [0, 1, 2, 3, 5, 6, 8],
    "7-z37": [0, 1, 3, 4, 5, 7, 8],
    "7-z38": [0, 1, 2, 4, 5, 7, 8]
},
"8": {
    "8-1": [0, 1, 2, 3, 4, 5, 6, 7],
    "8-2": [0, 1, 2, 3, 4, 5, 6, 8],
    "8-3": [0, 1, 2, 3, 4, 5, 6, 9],
    "8-4": [0, 1, 2, 3, 4, 5, 7, 8],
    "8-5": [0, 1, 2, 3, 4, 6, 7, 8],
    "8-6": [0, 1, 2, 3, 5, 6, 7, 8],
    "8-7": [0, 1, 2, 3, 4, 5, 8, 9],
    "8-8": [0, 1, 2, 3, 4, 7, 8, 9],
    "8-9": [0, 1, 2, 3, 6, 7, 8, 9],
    "8-10": [0, 2, 3, 4, 5, 6, 7, 9],
    "8-11": [0, 1, 2, 3, 4, 5, 7, 9],
    "8-12": [0, 1, 3, 4, 5, 6, 7, 9],
    "8-13": [0, 1, 2, 3, 4, 6, 7, 9],
    "8-14": [0, 1, 2, 4, 5, 6, 7, 9],
    "8-z15": [0, 1, 2, 3, 4, 6, 8, 9],
    "8-16": [0, 1, 2, 3, 5, 7, 8, 9],
    "8-17": [0, 1, 3, 4, 5, 6, 8, 9],
    "8-18": [0, 1, 2, 3, 5, 6, 8, 9],
    "8-19": [0, 1, 2, 4, 5, 6, 8, 9],
    "8-20": [0, 1, 2, 4, 5, 7, 8, 9],
    "8-21": [0, 1, 2, 3, 4, 6, 8, 10],
    "8-22": [0, 1, 2, 3, 5, 6, 8, 10],
    "8-23": [0, 1, 2, 3, 5, 7, 8, 10],
    "8-24": [0, 1, 2, 4, 5, 6, 8, 10],
    "8-25": [0, 1, 2, 4, 6, 7, 8, 10],
    "8-26": [0, 1, 3, 4, 5, 7, 8, 10],
    "8-27": [0, 1, 2, 4, 5, 7, 8, 10],
    "8-28": [0, 1, 3, 4, 6, 7, 9, 10],
    "8-z29": [0, 1, 2, 3, 5, 6, 7, 9]
},
"9": {
    "9-1": [0, 1, 2, 3, 4, 5, 6, 7, 8],
    "9-2": [0, 1, 2, 3, 4, 5, 6, 7, 9],
    "9-3": [0, 1, 2, 3, 4, 5, 6, 8, 9],
    "9-4": [0, 1, 2, 3, 4, 5, 7, 8, 9],
    "9-5": [0, 1, 2, 3, 4, 6, 7, 8, 9],
    "9-6": [0, 1, 2, 3, 4, 5, 6, 8, 10],
    "9-7": [0, 1, 2, 3, 4, 5, 7, 8, 10],
    "9-8": [0, 1, 2, 3, 4, 6, 7, 8, 10],
    "9-9": [0, 1, 2, 3, 5, 6, 7, 8, 10],
    "9-10": [0, 1, 2, 3, 4, 6, 7, 9, 10],
    "9-11": [0, 1, 2, 3, 5, 6, 7, 9, 10],
    "9-12": [0, 1, 2, 4, 5, 6, 8, 9, 1]
}
};



  forte.PitchClass = (function(PitchClassCollectionFormats){

  function PitchClass(anInt) {
      this._ = {
          intValue: anInt
      };
  }

  PitchClass.withInt = function(anInt) {
      return new PitchClass(anInt);
  };

  PitchClass.prototype.transpose = function(transposition) {
      this._.intValue = normalize(this._.intValue + transposition);
      return this;
  };

  PitchClass.prototype.invert = function() {
      this._.intValue = invert(this._.intValue);
      return this;
  };

  /**
   * Renders the Pitch Class as string value.
   * If no format defined, should return as numeric.
   * @param {string, object} aFormatType Could be string, representing
   * format type or object, being the format itself.
   */
  PitchClass.prototype.toString = function(aFormatType) {
      var stringFormat = PitchClassCollectionFormats.numeric;
      if (_.isObject(aFormatType) && !_.isString(aFormatType)) {
        stringFormat = aFormatType;
      } else {
        if (!_.isUndefined(PitchClassCollectionFormats[aFormatType])) {
          stringFormat = PitchClassCollectionFormats[aFormatType];
        }
      }

      return composeStringValue(this.getIntValue(), stringFormat);
  };

  PitchClass.prototype.getIntValue = function() {
    return normalize(this._.intValue);
  };

  function composeStringValue(value, format) {
      return format[value];
  }

  function normalize(anInt) {
      return ((anInt % 12) + 12) % 12;
  }

  function invert(int) {
      return normalize(12 - normalize(int));
  }

  return PitchClass;

})(forte.pitchClassCollectionFormats);

  forte.PitchClassCollection = (function(PitchClassCollectionFormats, PitchClassCollectionTypes){

  function PitchClassCollection(anArray, PitchClassCollectionType, pitchFormat) {
      var _pitchFormat;
      if (pitchFormat !== undefined) {
          _pitchFormat = pitchFormat;
      } else _pitchFormat = PitchClassCollectionFormats.numeric;
      this._ = {
          arrayValue: anArray,
          collectionType: PitchClassCollectionType,
          pitchFormat: _pitchFormat
      };
  }

  PitchClassCollection.prototype = {
      toString: function() {
          return composeStringValue(this._.pitchFormat, this._.collectionType, this._.arrayValue);
      },
      toArray: function() {
          return this._.arrayValue;
      }
  };

  function composeStringValue(aFormat, theCollectionFormat, myArray) {
      var theFormat = aFormat;
      if (myArray.length > theCollectionFormat.max) {
          throw 'myArray.length must be lower than '+theCollectionFormat.max;
      }
      if (myArray.length < theCollectionFormat.min) {
          throw 'myArray.length must be higher than '+theCollectionFormat.min;
      }
      var theArray = [];
      _.forEach(myArray, function(element){
        this.push(theFormat[element]);
      }, theArray);
      var theString = theArray.join(theCollectionFormat.separator);
      return theCollectionFormat.open+theString+theCollectionFormat.close;
  }

  PitchClassCollection.withArrayAndType = function(anArray, PitchClassCollectionType) {
      return new PitchClassCollection(anArray, PitchClassCollectionType);
  };

  PitchClassCollection.withArrayTypeAndFormat = function(anArray, PitchClassCollectionType, aFormat) {
      return new PitchClassCollection(anArray, PitchClassCollectionType, aFormat);
  };

  return PitchClassCollection;

})(forte.pitchClassCollectionFormats, forte.pitchClassCollectionTypes);

  forte.PitchClassSet = (function(PitchClass,
  PitchClassCollectionFormats,
  PitchClassCollectionTypes,
  PitchClassCollection,
  PitchClassSetData){

    function PitchClassSet(anArray, isSet) {
        this._ = {
            theSet : [],
            PitchClassCollectionFormat: PitchClassCollectionFormats.numeric,
            PitchClassCollectionType: PitchClassCollectionTypes.primeForm
        };
        if (isSet) {
            this._.theSet = anArray;
        } else {
            _.forEach(anArray, function(value, index){
                this.push(PitchClass.withInt(parseInt(value)));
            }, this._.theSet);
        }
    }

    PitchClassSet.prototype = {
        get arrayValue() {
            var theResult = [];
            _.forEach(this._.theSet, function(value, index) {
                this.push(value.getIntValue());
            }, theResult);
            return theResult;
        },
        get normalForm() {
            return PitchClassCollection.withArrayTypeAndFormat(this.arrayValue,
                this._.PitchClassCollectionType,
                this._.PitchClassCollectionFormat);
        },
        get primeForm() {
            return getPrimeForm(this).primeForm;
        },
        get primeInversion() {
            return getPrimeForm(this).primeInversion;
        },
        get cardinal() {
            return this._.theSet.length;
        },
        get forteCode() {
            return getPrimeForm(this).forteCode;
        },
        get hash() {
            return {
                value: hashValue(this.arrayValue),
                map: hashMap(this.arrayValue)
            };
        },
        get iv() {
            return getIv(this._.theSet);
        }
    };

    function getSmallest(aPitchClassSet) {
        var multi = [];
        _.forEach(aPitchClassSet._.theSet, function(aPitchClass, index) {
            this.push({
                sd:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize().sd(),
                string:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize().normalForm.toString(),
                value:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize()
            });
        }, multi);
        var ordered = _.sortBy(multi, 'sd');
        return ordered[0].value.arrayValue;
    }

    //TODO: find also inverted form, if it exists (should be either original or inverted).
    function getPrimeForm(aPitchClassSet) {
        var originalHash = getSmallest(aPitchClassSet.copy());
        var invertedHash = getSmallest(aPitchClassSet.copy().invert());
        var setData = PitchClassSetData[aPitchClassSet.arrayValue.length];
        var result = {
            forteCode: "",
            primeForm: {},
            primeInversion: {},
        };
        _.forEach(setData, function(value, index){
            if (_.isEqual(value, originalHash)) {
                result.primeForm = PitchClassCollection.withArrayTypeAndFormat(value, PitchClassCollectionTypes.primeForm, PitchClassCollectionFormats.numeric);
                result.forteCode = index;
                result.primeInversion = PitchClassCollection.withArrayTypeAndFormat(invertedHash, PitchClassCollectionTypes.primeInversion, PitchClassCollectionFormats.numeric);
            }
            if (_.isEqual(value, invertedHash)) {
                result.primeForm = PitchClassCollection.withArrayTypeAndFormat(value, PitchClassCollectionTypes.primeForm, PitchClassCollectionFormats.numeric);
                result.forteCode = index;
                result.primeInversion = PitchClassCollection.withArrayTypeAndFormat(originalHash, PitchClassCollectionTypes.primeInversion, PitchClassCollectionFormats.numeric);
            }
        });
        return result;
    }

    PitchClassSet.prototype.transpose = function(transposition) {
        _.forEach(this._.theSet, function(aPitchClass, index){
          aPitchClass.transpose(transposition);
        });
        return this;
    };

    PitchClassSet.prototype.normalize = function() {
        var newSet = _.sortBy(this._.theSet, function(n){
          return n.getIntValue();
        });
        var index = newSet[0].getIntValue();
        this._.theSet = newSet;
        this.transpose(-index);
        return this;
    };

    PitchClassSet.prototype.invert = function() {
        _.forEach(this._.theSet, function(aPitchClass){
            aPitchClass.invert();
        });
        return this;
    };

    PitchClassSet.prototype.sd = function() {
        var mean = this.mean();
        var sd = 0;
        var sum = 0;
        _.forEach(this.arrayValue, function(value){
            sum = (mean - value) + sum;
        });
        return Math.sqrt(mean / this.arrayValue.length);
    };

    /**
     * Get the mean out of an array.
     * @param anArray
     */
    PitchClassSet.prototype.mean = function() {
        var mean = 0;
        _.forEach(this.arrayValue, function(value){
            mean += value;
        }, mean);
        return mean/this.arrayValue.length;
    };

    PitchClassSet.prototype.copy = function() {
        return PitchClassSet.withSet(this._.theSet);
    };

    function hashValue(anArray) {
        var value = hashMap(anArray);
        return parseInt(value.join(''), 2);
    }

    function hashMap(anArray) {
        var value = [];
        for (var i = 0; i < 12; i++) {
            if (anArray.indexOf(i) != -1) {
                value[i] = 1;
            } else value[i] = 0;
        }
        return value;
    }

    /**
     * Interval Vector
     * @returns {*}
     */
    function getIv(aSet) {
        var setHashMap = {};
        _.forEach(aSet, function(a) {
            _.forEach(aSet, function(b){
                if (a.getIntValue() != b.getIntValue()) {
                    var hash = ((a.getIntValue() + b.getIntValue() + 1) / ((a.getIntValue() * b.getIntValue()) + 1)).toString();
                    setHashMap[hash] = [a.getIntValue(), b.getIntValue()];
                }
            });
        });
        var diffSet = [];
        _.forEach(setHashMap, function(value){
            diffSet.push(Math.abs(value[0] - value[1]));
        });
        var countSet = {};
        for (var i = 1; i < 7; i++) {
            countSet[i] = 0;
        }
        _.forEach(diffSet, function(value){
            countSet[value%6] += 1;
        });
        var intervalVector = [];
        _.forEach(countSet, function(value) {
            this.push(value);
        }, intervalVector);
        return PitchClassCollection.withArrayTypeAndFormat(intervalVector,
            PitchClassCollectionTypes.intervalVector,
            PitchClassCollectionFormats.numeric);
    }

    PitchClassSet.withArray = function(anArray) {
        return new PitchClassSet(anArray);
    };

    PitchClassSet.withSet = function(aSet) {
        return new PitchClassSet(aSet, true);
    };

    PitchClassSet.withMap = function(aMap) {
        var set = [];
        _.forEach(aMap, function(value, index){
            if (value == 1) set.push(index);
        });
        return new PitchClassSet(set);
    };

    return PitchClassSet;

})(forte.PitchClass,
  forte.pitchClassCollectionFormats,
  forte.pitchClassCollectionTypes,
  forte.PitchClassCollection,
  forte.pitchClassSetData);


  forte.VERSION = VERSION;

  this.forte = forte;

}());
