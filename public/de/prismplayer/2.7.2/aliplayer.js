(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == 'function' && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = 'MODULE_NOT_FOUND'), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r,
      );
    }
    return n[o].exports;
  }
  var i = typeof require == 'function' && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function(require, module, exports) {
        (function(root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory();
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define([], factory);
          } else {
            // Global (browser)
            root.CryptoJS = factory();
          }
        })(this, function() {
          /**
           * CryptoJS core components.
           */
          var CryptoJS =
            CryptoJS ||
            (function(Math, undefined) {
              /*
               * Local polyfil of Object.create
               */
              var create =
                Object.create ||
                (function() {
                  function F() {}

                  return function(obj) {
                    var subtype;

                    F.prototype = obj;

                    subtype = new F();

                    F.prototype = null;

                    return subtype;
                  };
                })();

              /**
               * CryptoJS namespace.
               */
              var C = {};

              /**
               * Library namespace.
               */
              var C_lib = (C.lib = {});

              /**
               * Base object for prototypal inheritance.
               */
              var Base = (C_lib.Base = (function() {
                return {
                  /**
                   * Creates a new object that inherits from this object.
                   *
                   * @param {Object} overrides Properties to copy into the new object.
                   *
                   * @return {Object} The new object.
                   *
                   * @static
                   *
                   * @example
                   *
                   *     var MyType = CryptoJS.lib.Base.extend({
                   *         field: 'value',
                   *
                   *         method: function () {
                   *         }
                   *     });
                   */
                  extend: function(overrides) {
                    // Spawn
                    var subtype = create(this);

                    // Augment
                    if (overrides) {
                      subtype.mixIn(overrides);
                    }

                    // Create default initializer
                    if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                      subtype.init = function() {
                        subtype.$super.init.apply(this, arguments);
                      };
                    }

                    // Initializer's prototype is the subtype object
                    subtype.init.prototype = subtype;

                    // Reference supertype
                    subtype.$super = this;

                    return subtype;
                  },

                  /**
                   * Extends this object and runs the init method.
                   * Arguments to create() will be passed to init().
                   *
                   * @return {Object} The new object.
                   *
                   * @static
                   *
                   * @example
                   *
                   *     var instance = MyType.create();
                   */
                  create: function() {
                    var instance = this.extend();
                    instance.init.apply(instance, arguments);

                    return instance;
                  },

                  /**
                   * Initializes a newly created object.
                   * Override this method to add some logic when your objects are created.
                   *
                   * @example
                   *
                   *     var MyType = CryptoJS.lib.Base.extend({
                   *         init: function () {
                   *             // ...
                   *         }
                   *     });
                   */
                  init: function() {},

                  /**
                   * Copies properties into this object.
                   *
                   * @param {Object} properties The properties to mix in.
                   *
                   * @example
                   *
                   *     MyType.mixIn({
                   *         field: 'value'
                   *     });
                   */
                  mixIn: function(properties) {
                    for (var propertyName in properties) {
                      if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                      }
                    }

                    // IE won't copy toString using the loop above
                    if (properties.hasOwnProperty('toString')) {
                      this.toString = properties.toString;
                    }
                  },

                  /**
                   * Creates a copy of this object.
                   *
                   * @return {Object} The clone.
                   *
                   * @example
                   *
                   *     var clone = instance.clone();
                   */
                  clone: function() {
                    return this.init.prototype.extend(this);
                  },
                };
              })());

              /**
               * An array of 32-bit words.
               *
               * @property {Array} words The array of 32-bit words.
               * @property {number} sigBytes The number of significant bytes in this word array.
               */
              var WordArray = (C_lib.WordArray = Base.extend({
                /**
                 * Initializes a newly created word array.
                 *
                 * @param {Array} words (Optional) An array of 32-bit words.
                 * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.create();
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
                 */
                init: function(words, sigBytes) {
                  words = this.words = words || [];

                  if (sigBytes != undefined) {
                    this.sigBytes = sigBytes;
                  } else {
                    this.sigBytes = words.length * 4;
                  }
                },

                /**
                 * Converts this word array to a string.
                 *
                 * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
                 *
                 * @return {string} The stringified word array.
                 *
                 * @example
                 *
                 *     var string = wordArray + '';
                 *     var string = wordArray.toString();
                 *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                 */
                toString: function(encoder) {
                  return (encoder || Hex).stringify(this);
                },

                /**
                 * Concatenates a word array to this word array.
                 *
                 * @param {WordArray} wordArray The word array to append.
                 *
                 * @return {WordArray} This word array.
                 *
                 * @example
                 *
                 *     wordArray1.concat(wordArray2);
                 */
                concat: function(wordArray) {
                  // Shortcuts
                  var thisWords = this.words;
                  var thatWords = wordArray.words;
                  var thisSigBytes = this.sigBytes;
                  var thatSigBytes = wordArray.sigBytes;

                  // Clamp excess bits
                  this.clamp();

                  // Concat
                  if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for (var i = 0; i < thatSigBytes; i++) {
                      var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                      thisWords[(thisSigBytes + i) >>> 2] |=
                        thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                    }
                  } else {
                    // Copy one word at a time
                    for (var i = 0; i < thatSigBytes; i += 4) {
                      thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                    }
                  }
                  this.sigBytes += thatSigBytes;

                  // Chainable
                  return this;
                },

                /**
                 * Removes insignificant bits.
                 *
                 * @example
                 *
                 *     wordArray.clamp();
                 */
                clamp: function() {
                  // Shortcuts
                  var words = this.words;
                  var sigBytes = this.sigBytes;

                  // Clamp
                  words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                  words.length = Math.ceil(sigBytes / 4);
                },

                /**
                 * Creates a copy of this word array.
                 *
                 * @return {WordArray} The clone.
                 *
                 * @example
                 *
                 *     var clone = wordArray.clone();
                 */
                clone: function() {
                  var clone = Base.clone.call(this);
                  clone.words = this.words.slice(0);

                  return clone;
                },

                /**
                 * Creates a word array filled with random bytes.
                 *
                 * @param {number} nBytes The number of random bytes to generate.
                 *
                 * @return {WordArray} The random word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.random(16);
                 */
                random: function(nBytes) {
                  var words = [];

                  var r = function(m_w) {
                    var m_w = m_w;
                    var m_z = 0x3ade68b1;
                    var mask = 0xffffffff;

                    return function() {
                      m_z = (0x9069 * (m_z & 0xffff) + (m_z >> 0x10)) & mask;
                      m_w = (0x4650 * (m_w & 0xffff) + (m_w >> 0x10)) & mask;
                      var result = ((m_z << 0x10) + m_w) & mask;
                      result /= 0x100000000;
                      result += 0.5;
                      return result * (Math.random() > 0.5 ? 1 : -1);
                    };
                  };

                  for (var i = 0, rcache; i < nBytes; i += 4) {
                    var _r = r((rcache || Math.random()) * 0x100000000);

                    rcache = _r() * 0x3ade67b7;
                    words.push((_r() * 0x100000000) | 0);
                  }

                  return new WordArray.init(words, nBytes);
                },
              }));

              /**
               * Encoder namespace.
               */
              var C_enc = (C.enc = {});

              /**
               * Hex encoding strategy.
               */
              var Hex = (C_enc.Hex = {
                /**
                 * Converts a word array to a hex string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The hex string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                 */
                stringify: function(wordArray) {
                  // Shortcuts
                  var words = wordArray.words;
                  var sigBytes = wordArray.sigBytes;

                  // Convert
                  var hexChars = [];
                  for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    hexChars.push((bite >>> 4).toString(16));
                    hexChars.push((bite & 0x0f).toString(16));
                  }

                  return hexChars.join('');
                },

                /**
                 * Converts a hex string to a word array.
                 *
                 * @param {string} hexStr The hex string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                 */
                parse: function(hexStr) {
                  // Shortcut
                  var hexStrLength = hexStr.length;

                  // Convert
                  var words = [];
                  for (var i = 0; i < hexStrLength; i += 2) {
                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                  }

                  return new WordArray.init(words, hexStrLength / 2);
                },
              });

              /**
               * Latin1 encoding strategy.
               */
              var Latin1 = (C_enc.Latin1 = {
                /**
                 * Converts a word array to a Latin1 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Latin1 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                 */
                stringify: function(wordArray) {
                  // Shortcuts
                  var words = wordArray.words;
                  var sigBytes = wordArray.sigBytes;

                  // Convert
                  var latin1Chars = [];
                  for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    latin1Chars.push(String.fromCharCode(bite));
                  }

                  return latin1Chars.join('');
                },

                /**
                 * Converts a Latin1 string to a word array.
                 *
                 * @param {string} latin1Str The Latin1 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                 */
                parse: function(latin1Str) {
                  // Shortcut
                  var latin1StrLength = latin1Str.length;

                  // Convert
                  var words = [];
                  for (var i = 0; i < latin1StrLength; i++) {
                    words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                  }

                  return new WordArray.init(words, latin1StrLength);
                },
              });

              /**
               * UTF-8 encoding strategy.
               */
              var Utf8 = (C_enc.Utf8 = {
                /**
                 * Converts a word array to a UTF-8 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-8 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                 */
                stringify: function(wordArray) {
                  try {
                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                  } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                  }
                },

                /**
                 * Converts a UTF-8 string to a word array.
                 *
                 * @param {string} utf8Str The UTF-8 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                 */
                parse: function(utf8Str) {
                  return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                },
              });

              /**
               * Abstract buffered block algorithm template.
               *
               * The property blockSize must be implemented in a concrete subtype.
               *
               * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
               */
              var BufferedBlockAlgorithm = (C_lib.BufferedBlockAlgorithm = Base.extend({
                /**
                 * Resets this block algorithm's data buffer to its initial state.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm.reset();
                 */
                reset: function() {
                  // Initial values
                  this._data = new WordArray.init();
                  this._nDataBytes = 0;
                },

                /**
                 * Adds new data to this block algorithm's buffer.
                 *
                 * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm._append('data');
                 *     bufferedBlockAlgorithm._append(wordArray);
                 */
                _append: function(data) {
                  // Convert string to WordArray, else assume WordArray already
                  if (typeof data == 'string') {
                    data = Utf8.parse(data);
                  }

                  // Append
                  this._data.concat(data);
                  this._nDataBytes += data.sigBytes;
                },

                /**
                 * Processes available data blocks.
                 *
                 * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                 *
                 * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                 *
                 * @return {WordArray} The processed data.
                 *
                 * @example
                 *
                 *     var processedData = bufferedBlockAlgorithm._process();
                 *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                 */
                _process: function(doFlush) {
                  // Shortcuts
                  var data = this._data;
                  var dataWords = data.words;
                  var dataSigBytes = data.sigBytes;
                  var blockSize = this.blockSize;
                  var blockSizeBytes = blockSize * 4;

                  // Count blocks ready
                  var nBlocksReady = dataSigBytes / blockSizeBytes;
                  if (doFlush) {
                    // Round up to include partial blocks
                    nBlocksReady = Math.ceil(nBlocksReady);
                  } else {
                    // Round down to include only full blocks,
                    // less the number of blocks that must remain in the buffer
                    nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                  }

                  // Count words ready
                  var nWordsReady = nBlocksReady * blockSize;

                  // Count bytes ready
                  var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                  // Process blocks
                  if (nWordsReady) {
                    for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                      // Perform concrete-algorithm logic
                      this._doProcessBlock(dataWords, offset);
                    }

                    // Remove processed words
                    var processedWords = dataWords.splice(0, nWordsReady);
                    data.sigBytes -= nBytesReady;
                  }

                  // Return processed words
                  return new WordArray.init(processedWords, nBytesReady);
                },

                /**
                 * Creates a copy of this object.
                 *
                 * @return {Object} The clone.
                 *
                 * @example
                 *
                 *     var clone = bufferedBlockAlgorithm.clone();
                 */
                clone: function() {
                  var clone = Base.clone.call(this);
                  clone._data = this._data.clone();

                  return clone;
                },

                _minBufferSize: 0,
              }));

              /**
               * Abstract hasher template.
               *
               * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
               */
              var Hasher = (C_lib.Hasher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 */
                cfg: Base.extend(),

                /**
                 * Initializes a newly created hasher.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                 *
                 * @example
                 *
                 *     var hasher = CryptoJS.algo.SHA256.create();
                 */
                init: function(cfg) {
                  // Apply config defaults
                  this.cfg = this.cfg.extend(cfg);

                  // Set initial values
                  this.reset();
                },

                /**
                 * Resets this hasher to its initial state.
                 *
                 * @example
                 *
                 *     hasher.reset();
                 */
                reset: function() {
                  // Reset data buffer
                  BufferedBlockAlgorithm.reset.call(this);

                  // Perform concrete-hasher logic
                  this._doReset();
                },

                /**
                 * Updates this hasher with a message.
                 *
                 * @param {WordArray|string} messageUpdate The message to append.
                 *
                 * @return {Hasher} This hasher.
                 *
                 * @example
                 *
                 *     hasher.update('message');
                 *     hasher.update(wordArray);
                 */
                update: function(messageUpdate) {
                  // Append
                  this._append(messageUpdate);

                  // Update the hash
                  this._process();

                  // Chainable
                  return this;
                },

                /**
                 * Finalizes the hash computation.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} messageUpdate (Optional) A final message update.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @example
                 *
                 *     var hash = hasher.finalize();
                 *     var hash = hasher.finalize('message');
                 *     var hash = hasher.finalize(wordArray);
                 */
                finalize: function(messageUpdate) {
                  // Final message update
                  if (messageUpdate) {
                    this._append(messageUpdate);
                  }

                  // Perform concrete-hasher logic
                  var hash = this._doFinalize();

                  return hash;
                },

                blockSize: 512 / 32,

                /**
                 * Creates a shortcut function to a hasher's object interface.
                 *
                 * @param {Hasher} hasher The hasher to create a helper for.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                 */
                _createHelper: function(hasher) {
                  return function(message, cfg) {
                    return new hasher.init(cfg).finalize(message);
                  };
                },

                /**
                 * Creates a shortcut function to the HMAC's object interface.
                 *
                 * @param {Hasher} hasher The hasher to use in this HMAC helper.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                 */
                _createHmacHelper: function(hasher) {
                  return function(message, key) {
                    return new C_algo.HMAC.init(hasher, key).finalize(message);
                  };
                },
              }));

              /**
               * Algorithm namespace.
               */
              var C_algo = (C.algo = {});

              return C;
            })(Math);

          return CryptoJS;
        });
      },
      {},
    ],
    2: [
      function(require, module, exports) {
        (function(root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function(CryptoJS) {
          (function() {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var C_enc = C.enc;

            /**
             * Base64 encoding strategy.
             */
            var Base64 = (C_enc.Base64 = {
              /**
               * Converts a word array to a Base64 string.
               *
               * @param {WordArray} wordArray The word array.
               *
               * @return {string} The Base64 string.
               *
               * @static
               *
               * @example
               *
               *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
               */
              stringify: function(wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.sigBytes;
                var map = this._map;

                // Clamp excess bits
                wordArray.clamp();

                // Convert
                var base64Chars = [];
                for (var i = 0; i < sigBytes; i += 3) {
                  var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                  var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                  var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                  var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                  for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                  }
                }

                // Add padding
                var paddingChar = map.charAt(64);
                if (paddingChar) {
                  while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                  }
                }

                return base64Chars.join('');
              },

              /**
               * Converts a Base64 string to a word array.
               *
               * @param {string} base64Str The Base64 string.
               *
               * @return {WordArray} The word array.
               *
               * @static
               *
               * @example
               *
               *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
               */
              parse: function(base64Str) {
                // Shortcuts
                var base64StrLength = base64Str.length;
                var map = this._map;
                var reverseMap = this._reverseMap;

                if (!reverseMap) {
                  reverseMap = this._reverseMap = [];
                  for (var j = 0; j < map.length; j++) {
                    reverseMap[map.charCodeAt(j)] = j;
                  }
                }

                // Ignore padding
                var paddingChar = map.charAt(64);
                if (paddingChar) {
                  var paddingIndex = base64Str.indexOf(paddingChar);
                  if (paddingIndex !== -1) {
                    base64StrLength = paddingIndex;
                  }
                }

                // Convert
                return parseLoop(base64Str, base64StrLength, reverseMap);
              },

              _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            });

            function parseLoop(base64Str, base64StrLength, reverseMap) {
              var words = [];
              var nBytes = 0;
              for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                  var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                  var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                  words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                  nBytes++;
                }
              }
              return WordArray.create(words, nBytes);
            }
          })();

          return CryptoJS.enc.Base64;
        });
      },
      { './core': 1 },
    ],
    3: [
      function(require, module, exports) {
        (function(root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function(CryptoJS) {
          return CryptoJS.enc.Utf8;
        });
      },
      { './core': 1 },
    ],
    4: [
      function(require, module, exports) {
        (function(root, factory, undef) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(
              require('./core'),
              require('./sha1'),
              require('./hmac'),
            );
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core', './sha1', './hmac'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function(CryptoJS) {
          return CryptoJS.HmacSHA1;
        });
      },
      { './core': 1, './hmac': 5, './sha1': 6 },
    ],
    5: [
      function(require, module, exports) {
        (function(root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function(CryptoJS) {
          (function() {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var C_algo = C.algo;

            /**
             * HMAC algorithm.
             */
            var HMAC = (C_algo.HMAC = Base.extend({
              /**
               * Initializes a newly created HMAC.
               *
               * @param {Hasher} hasher The hash algorithm to use.
               * @param {WordArray|string} key The secret key.
               *
               * @example
               *
               *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
               */
              init: function(hasher, key) {
                // Init hasher
                hasher = this._hasher = new hasher.init();

                // Convert string to WordArray, else assume WordArray already
                if (typeof key == 'string') {
                  key = Utf8.parse(key);
                }

                // Shortcuts
                var hasherBlockSize = hasher.blockSize;
                var hasherBlockSizeBytes = hasherBlockSize * 4;

                // Allow arbitrary length keys
                if (key.sigBytes > hasherBlockSizeBytes) {
                  key = hasher.finalize(key);
                }

                // Clamp excess bits
                key.clamp();

                // Clone key for inner and outer pads
                var oKey = (this._oKey = key.clone());
                var iKey = (this._iKey = key.clone());

                // Shortcuts
                var oKeyWords = oKey.words;
                var iKeyWords = iKey.words;

                // XOR keys with pad constants
                for (var i = 0; i < hasherBlockSize; i++) {
                  oKeyWords[i] ^= 0x5c5c5c5c;
                  iKeyWords[i] ^= 0x36363636;
                }
                oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

                // Set initial values
                this.reset();
              },

              /**
               * Resets this HMAC to its initial state.
               *
               * @example
               *
               *     hmacHasher.reset();
               */
              reset: function() {
                // Shortcut
                var hasher = this._hasher;

                // Reset
                hasher.reset();
                hasher.update(this._iKey);
              },

              /**
               * Updates this HMAC with a message.
               *
               * @param {WordArray|string} messageUpdate The message to append.
               *
               * @return {HMAC} This HMAC instance.
               *
               * @example
               *
               *     hmacHasher.update('message');
               *     hmacHasher.update(wordArray);
               */
              update: function(messageUpdate) {
                this._hasher.update(messageUpdate);

                // Chainable
                return this;
              },

              /**
               * Finalizes the HMAC computation.
               * Note that the finalize operation is effectively a destructive, read-once operation.
               *
               * @param {WordArray|string} messageUpdate (Optional) A final message update.
               *
               * @return {WordArray} The HMAC.
               *
               * @example
               *
               *     var hmac = hmacHasher.finalize();
               *     var hmac = hmacHasher.finalize('message');
               *     var hmac = hmacHasher.finalize(wordArray);
               */
              finalize: function(messageUpdate) {
                // Shortcut
                var hasher = this._hasher;

                // Compute HMAC
                var innerHash = hasher.finalize(messageUpdate);
                hasher.reset();
                var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

                return hmac;
              },
            }));
          })();
        });
      },
      { './core': 1 },
    ],
    6: [
      function(require, module, exports) {
        (function(root, factory) {
          if (typeof exports === 'object') {
            // CommonJS
            module.exports = exports = factory(require('./core'));
          } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['./core'], factory);
          } else {
            // Global (browser)
            factory(root.CryptoJS);
          }
        })(this, function(CryptoJS) {
          (function() {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Reusable object
            var W = [];

            /**
             * SHA-1 hash algorithm.
             */
            var SHA1 = (C_algo.SHA1 = Hasher.extend({
              _doReset: function() {
                this._hash = new WordArray.init([
                  0x67452301,
                  0xefcdab89,
                  0x98badcfe,
                  0x10325476,
                  0xc3d2e1f0,
                ]);
              },

              _doProcessBlock: function(M, offset) {
                // Shortcut
                var H = this._hash.words;

                // Working variables
                var a = H[0];
                var b = H[1];
                var c = H[2];
                var d = H[3];
                var e = H[4];

                // Computation
                for (var i = 0; i < 80; i++) {
                  if (i < 16) {
                    W[i] = M[offset + i] | 0;
                  } else {
                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                    W[i] = (n << 1) | (n >>> 31);
                  }

                  var t = ((a << 5) | (a >>> 27)) + e + W[i];
                  if (i < 20) {
                    t += ((b & c) | (~b & d)) + 0x5a827999;
                  } else if (i < 40) {
                    t += (b ^ c ^ d) + 0x6ed9eba1;
                  } else if (i < 60) {
                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                  } /* if (i < 80) */ else {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                  }

                  e = d;
                  d = c;
                  c = (b << 30) | (b >>> 2);
                  b = a;
                  a = t;
                }

                // Intermediate hash value
                H[0] = (H[0] + a) | 0;
                H[1] = (H[1] + b) | 0;
                H[2] = (H[2] + c) | 0;
                H[3] = (H[3] + d) | 0;
                H[4] = (H[4] + e) | 0;
              },

              _doFinalize: function() {
                // Shortcuts
                var data = this._data;
                var dataWords = data.words;

                var nBitsTotal = this._nDataBytes * 8;
                var nBitsLeft = data.sigBytes * 8;

                // Add padding
                dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - (nBitsLeft % 32));
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(
                  nBitsTotal / 0x100000000,
                );
                dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                data.sigBytes = dataWords.length * 4;

                // Hash final blocks
                this._process();

                // Return final computed hash
                return this._hash;
              },

              clone: function() {
                var clone = Hasher.clone.call(this);
                clone._hash = this._hash.clone();

                return clone;
              },
            }));

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA1('message');
             *     var hash = CryptoJS.SHA1(wordArray);
             */
            C.SHA1 = Hasher._createHelper(SHA1);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA1(message, key);
             */
            C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
          })();

          return CryptoJS.SHA1;
        });
      },
      { './core': 1 },
    ],
    7: [
      function(require, module, exports) {
        (function() {
          'use strict';

          /**
           * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
           *
           * @codingstandard ftlabs-jsv2
           * @copyright The Financial Times Limited [All Rights Reserved]
           * @license MIT License (see LICENSE.txt)
           */

          /*jslint browser:true, node:true*/
          /*global define, Event, Node*/

          /**
           * Instantiate fast-clicking listeners on the specified layer.
           *
           * @constructor
           * @param {Element} layer The layer to listen on
           * @param {Object} [options={}] The options to override the defaults
           */
          function FastClick(layer, options) {
            var oldOnClick;

            options = options || {};

            /**
             * Whether a click is currently being tracked.
             *
             * @type boolean
             */
            this.trackingClick = false;

            /**
             * Timestamp for when click tracking started.
             *
             * @type number
             */
            this.trackingClickStart = 0;

            /**
             * The element being tracked for a click.
             *
             * @type EventTarget
             */
            this.targetElement = null;

            /**
             * X-coordinate of touch start event.
             *
             * @type number
             */
            this.touchStartX = 0;

            /**
             * Y-coordinate of touch start event.
             *
             * @type number
             */
            this.touchStartY = 0;

            /**
             * ID of the last touch, retrieved from Touch.identifier.
             *
             * @type number
             */
            this.lastTouchIdentifier = 0;

            /**
             * Touchmove boundary, beyond which a click will be cancelled.
             *
             * @type number
             */
            this.touchBoundary = options.touchBoundary || 10;

            /**
             * The FastClick layer.
             *
             * @type Element
             */
            this.layer = layer;

            /**
             * The minimum time between tap(touchstart and touchend) events
             *
             * @type number
             */
            this.tapDelay = options.tapDelay || 200;

            /**
             * The maximum time for a tap
             *
             * @type number
             */
            this.tapTimeout = options.tapTimeout || 700;

            if (FastClick.notNeeded(layer)) {
              return;
            }

            // Some old versions of Android don't have Function.prototype.bind
            function bind(method, context) {
              return function() {
                return method.apply(context, arguments);
              };
            }

            var methods = [
              'onMouse',
              'onClick',
              'onTouchStart',
              'onTouchMove',
              'onTouchEnd',
              'onTouchCancel',
            ];
            var context = this;
            for (var i = 0, l = methods.length; i < l; i++) {
              context[methods[i]] = bind(context[methods[i]], context);
            }

            // Set up event handlers as required
            if (deviceIsAndroid) {
              layer.addEventListener('mouseover', this.onMouse, true);
              layer.addEventListener('mousedown', this.onMouse, true);
              layer.addEventListener('mouseup', this.onMouse, true);
            }

            layer.addEventListener('click', this.onClick, true);
            layer.addEventListener('touchstart', this.onTouchStart, false);
            layer.addEventListener('touchmove', this.onTouchMove, false);
            layer.addEventListener('touchend', this.onTouchEnd, false);
            layer.addEventListener('touchcancel', this.onTouchCancel, false);

            // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
            // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
            // layer when they are cancelled.
            if (!Event.prototype.stopImmediatePropagation) {
              layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                  rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                  rmv.call(layer, type, callback, capture);
                }
              };

              layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                  adv.call(
                    layer,
                    type,
                    callback.hijacked ||
                      (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                          callback(event);
                        }
                      }),
                    capture,
                  );
                } else {
                  adv.call(layer, type, callback, capture);
                }
              };
            }

            // If a handler is already declared in the element's onclick attribute, it will be fired before
            // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
            // adding it as listener.
            if (typeof layer.onclick === 'function') {
              // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
              // - the old one won't work if passed to addEventListener directly.
              oldOnClick = layer.onclick;
              layer.addEventListener(
                'click',
                function(event) {
                  oldOnClick(event);
                },
                false,
              );
              layer.onclick = null;
            }
          }

          /**
           * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
           *
           * @type boolean
           */
          var deviceIsWindowsPhone = navigator.userAgent.indexOf('Windows Phone') >= 0;

          /**
           * Android requires exceptions.
           *
           * @type boolean
           */
          var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

          /**
           * iOS requires exceptions.
           *
           * @type boolean
           */
          var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

          /**
           * iOS 4 requires an exception for select elements.
           *
           * @type boolean
           */
          var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

          /**
           * iOS 6.0-7.* requires the target element to be manually derived
           *
           * @type boolean
           */
          var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

          /**
           * BlackBerry requires exceptions.
           *
           * @type boolean
           */
          var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

          /**
           * Determine whether a given element requires a native click.
           *
           * @param {EventTarget|Element} target Target DOM element
           * @returns {boolean} Returns true if the element needs a native click
           */
          FastClick.prototype.needsClick = function(target) {
            switch (target.nodeName.toLowerCase()) {
              // Don't send a synthetic click to disabled inputs (issue #62)
              case 'button':
              case 'select':
              case 'textarea':
                if (target.disabled) {
                  return true;
                }

                break;
              case 'input':
                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                  return true;
                }

                break;
              case 'label':
              case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
              case 'video':
                return true;
            }

            return /\bneedsclick\b/.test(target.className);
          };

          /**
           * Determine whether a given element requires a call to focus to simulate click into element.
           *
           * @param {EventTarget|Element} target Target DOM element
           * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
           */
          FastClick.prototype.needsFocus = function(target) {
            switch (target.nodeName.toLowerCase()) {
              case 'textarea':
                return true;
              case 'select':
                return !deviceIsAndroid;
              case 'input':
                switch (target.type) {
                  case 'button':
                  case 'checkbox':
                  case 'file':
                  case 'image':
                  case 'radio':
                  case 'submit':
                    return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
              default:
                return /\bneedsfocus\b/.test(target.className);
            }
          };

          /**
           * Send a click event to the specified element.
           *
           * @param {EventTarget|Element} targetElement
           * @param {Event} event
           */
          FastClick.prototype.sendClick = function(targetElement, event) {
            var clickEvent, touch;

            // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
            if (document.activeElement && document.activeElement !== targetElement) {
              document.activeElement.blur();
            }

            touch = event.changedTouches[0];

            // Synthesise a click event, with an extra attribute so it can be tracked
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initMouseEvent(
              this.determineEventType(targetElement),
              true,
              true,
              window,
              1,
              touch.screenX,
              touch.screenY,
              touch.clientX,
              touch.clientY,
              false,
              false,
              false,
              false,
              0,
              null,
            );
            clickEvent.forwardedTouchEvent = true;
            targetElement.dispatchEvent(clickEvent);
          };

          FastClick.prototype.determineEventType = function(targetElement) {
            //Issue #159: Android Chrome Select Box does not open with a synthetic click event
            if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
              return 'mousedown';
            }

            return 'click';
          };

          /**
           * @param {EventTarget|Element} targetElement
           */
          FastClick.prototype.focus = function(targetElement) {
            var length;

            // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
            if (
              deviceIsIOS &&
              targetElement.setSelectionRange &&
              targetElement.type.indexOf('date') !== 0 &&
              targetElement.type !== 'time' &&
              targetElement.type !== 'month'
            ) {
              length = targetElement.value.length;
              targetElement.setSelectionRange(length, length);
            } else {
              targetElement.focus();
            }
          };

          /**
           * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
           *
           * @param {EventTarget|Element} targetElement
           */
          FastClick.prototype.updateScrollParent = function(targetElement) {
            var scrollParent, parentElement;

            scrollParent = targetElement.fastClickScrollParent;

            // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
            // target element was moved to another parent.
            if (!scrollParent || !scrollParent.contains(targetElement)) {
              parentElement = targetElement;
              do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                  scrollParent = parentElement;
                  targetElement.fastClickScrollParent = parentElement;
                  break;
                }

                parentElement = parentElement.parentElement;
              } while (parentElement);
            }

            // Always update the scroll top tracker if possible.
            if (scrollParent) {
              scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
            }
          };

          /**
           * @param {EventTarget} targetElement
           * @returns {Element|EventTarget}
           */
          FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
            // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
            if (eventTarget.nodeType === Node.TEXT_NODE) {
              return eventTarget.parentNode;
            }

            return eventTarget;
          };

          /**
           * On touch start, record the position and scroll offset.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.onTouchStart = function(event) {
            var targetElement, touch, selection;

            // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
            if (event.targetTouches.length > 1) {
              return true;
            }

            targetElement = this.getTargetElementFromEventTarget(event.target);
            touch = event.targetTouches[0];

            if (deviceIsIOS) {
              // Only trusted events will deselect text on iOS (issue #49)
              selection = window.getSelection();
              if (selection.rangeCount && !selection.isCollapsed) {
                return true;
              }

              if (!deviceIsIOS4) {
                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                  event.preventDefault();
                  return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
              }
            }

            this.trackingClick = true;
            this.trackingClickStart = event.timeStamp;
            this.targetElement = targetElement;

            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;

            // Prevent phantom clicks on fast double-tap (issue #36)
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
              event.preventDefault();
            }

            return true;
          };

          /**
           * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.touchHasMoved = function(event) {
            var touch = event.changedTouches[0],
              boundary = this.touchBoundary;

            if (
              Math.abs(touch.pageX - this.touchStartX) > boundary ||
              Math.abs(touch.pageY - this.touchStartY) > boundary
            ) {
              return true;
            }

            return false;
          };

          /**
           * Update the last position.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.onTouchMove = function(event) {
            if (!this.trackingClick) {
              return true;
            }

            // If the touch has moved, cancel the click tracking
            if (
              this.targetElement !== this.getTargetElementFromEventTarget(event.target) ||
              this.touchHasMoved(event)
            ) {
              this.trackingClick = false;
              this.targetElement = null;
            }

            return true;
          };

          /**
           * Attempt to find the labelled control for the given label element.
           *
           * @param {EventTarget|HTMLLabelElement} labelElement
           * @returns {Element|null}
           */
          FastClick.prototype.findControl = function(labelElement) {
            // Fast path for newer browsers supporting the HTML5 control attribute
            if (labelElement.control !== undefined) {
              return labelElement.control;
            }

            // All browsers under test that support touch events also support the HTML5 htmlFor attribute
            if (labelElement.htmlFor) {
              return document.getElementById(labelElement.htmlFor);
            }

            // If no for attribute exists, attempt to retrieve the first labellable descendant element
            // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
            return labelElement.querySelector(
              'button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea',
            );
          };

          /**
           * On touch end, determine whether to send a click event at once.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.onTouchEnd = function(event) {
            var forElement,
              trackingClickStart,
              targetTagName,
              scrollParent,
              touch,
              targetElement = this.targetElement;

            if (!this.trackingClick) {
              return true;
            }

            // Prevent phantom clicks on fast double-tap (issue #36)
            if (event.timeStamp - this.lastClickTime < this.tapDelay) {
              this.cancelNextClick = true;
              return true;
            }

            if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
              return true;
            }

            // Reset to prevent wrong click cancel on input (issue #156).
            this.cancelNextClick = false;

            this.lastClickTime = event.timeStamp;

            trackingClickStart = this.trackingClickStart;
            this.trackingClick = false;
            this.trackingClickStart = 0;

            // On some iOS devices, the targetElement supplied with the event is invalid if the layer
            // is performing a transition or scroll, and has to be re-detected manually. Note that
            // for this to function correctly, it must be called *after* the event target is checked!
            // See issue #57; also filed as rdar://13048589 .
            if (deviceIsIOSWithBadTarget) {
              touch = event.changedTouches[0];

              // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
              targetElement =
                document.elementFromPoint(
                  touch.pageX - window.pageXOffset,
                  touch.pageY - window.pageYOffset,
                ) || targetElement;
              targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
            }

            targetTagName = targetElement.tagName.toLowerCase();
            if (targetTagName === 'label') {
              forElement = this.findControl(targetElement);
              if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                  return false;
                }

                targetElement = forElement;
              }
            } else if (this.needsFocus(targetElement)) {
              // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
              // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
              if (
                event.timeStamp - trackingClickStart > 100 ||
                (deviceIsIOS && window.top !== window && targetTagName === 'input')
              ) {
                this.targetElement = null;
                return false;
              }

              this.focus(targetElement);
              this.sendClick(targetElement, event);

              // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
              // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
              if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
              }

              return false;
            }

            if (deviceIsIOS && !deviceIsIOS4) {
              // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
              // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
              scrollParent = targetElement.fastClickScrollParent;
              if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
              }
            }

            // Prevent the actual click from going though - unless the target node is marked as requiring
            // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
            if (!this.needsClick(targetElement)) {
              event.preventDefault();
              this.sendClick(targetElement, event);
            }

            return false;
          };

          /**
           * On touch cancel, stop tracking the click.
           *
           * @returns {void}
           */
          FastClick.prototype.onTouchCancel = function() {
            this.trackingClick = false;
            this.targetElement = null;
          };

          /**
           * Determine mouse events which should be permitted.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.onMouse = function(event) {
            // If a target element was never set (because a touch event was never fired) allow the event
            if (!this.targetElement) {
              return true;
            }

            if (event.forwardedTouchEvent) {
              return true;
            }

            // Programmatically generated events targeting a specific element should be permitted
            if (!event.cancelable) {
              return true;
            }

            // Derive and check the target element to see whether the mouse event needs to be permitted;
            // unless explicitly enabled, prevent non-touch click events from triggering actions,
            // to prevent ghost/doubleclicks.
            if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
              // Prevent any user-added listeners declared on FastClick element from being fired.
              if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
              } else {
                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
              }

              // Cancel the event
              event.stopPropagation();
              event.preventDefault();

              return false;
            }

            // If the mouse event is permitted, return true for the action to go through.
            return true;
          };

          /**
           * On actual clicks, determine whether this is a touch-generated click, a click action occurring
           * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
           * an actual click which should be permitted.
           *
           * @param {Event} event
           * @returns {boolean}
           */
          FastClick.prototype.onClick = function(event) {
            var permitted;

            // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
            if (this.trackingClick) {
              this.targetElement = null;
              this.trackingClick = false;
              return true;
            }

            // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
            if (event.target.type === 'submit' && event.detail === 0) {
              return true;
            }

            permitted = this.onMouse(event);

            // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
            if (!permitted) {
              this.targetElement = null;
            }

            // If clicks are permitted, return true for the action to go through.
            return permitted;
          };

          /**
           * Remove all FastClick's event listeners.
           *
           * @returns {void}
           */
          FastClick.prototype.destroy = function() {
            var layer = this.layer;

            if (deviceIsAndroid) {
              layer.removeEventListener('mouseover', this.onMouse, true);
              layer.removeEventListener('mousedown', this.onMouse, true);
              layer.removeEventListener('mouseup', this.onMouse, true);
            }

            layer.removeEventListener('click', this.onClick, true);
            layer.removeEventListener('touchstart', this.onTouchStart, false);
            layer.removeEventListener('touchmove', this.onTouchMove, false);
            layer.removeEventListener('touchend', this.onTouchEnd, false);
            layer.removeEventListener('touchcancel', this.onTouchCancel, false);
          };

          /**
           * Check whether FastClick is needed.
           *
           * @param {Element} layer The layer to listen on
           */
          FastClick.notNeeded = function(layer) {
            var metaViewport;
            var chromeVersion;
            var blackberryVersion;
            var firefoxVersion;

            // Devices that don't support touch don't need FastClick
            if (typeof window.ontouchstart === 'undefined') {
              return true;
            }

            // Chrome version - zero for other browsers
            chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

            if (chromeVersion) {
              if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                  // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                  if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                    return true;
                  }
                  // Chrome 32 and above with width=device-width or less don't need FastClick
                  if (
                    chromeVersion > 31 &&
                    document.documentElement.scrollWidth <= window.outerWidth
                  ) {
                    return true;
                  }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
              } else {
                return true;
              }
            }

            if (deviceIsBlackBerry10) {
              blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

              // BlackBerry 10.3+ does not require Fastclick library.
              // https://github.com/ftlabs/fastclick/issues/251
              if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                  // user-scalable=no eliminates click delay.
                  if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                    return true;
                  }
                  // width=device-width (or less than device-width) eliminates click delay.
                  if (document.documentElement.scrollWidth <= window.outerWidth) {
                    return true;
                  }
                }
              }
            }

            // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
            if (
              layer.style.msTouchAction === 'none' ||
              layer.style.touchAction === 'manipulation'
            ) {
              return true;
            }

            // Firefox version - zero for other browsers
            firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

            if (firefoxVersion >= 27) {
              // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

              metaViewport = document.querySelector('meta[name=viewport]');
              if (
                metaViewport &&
                (metaViewport.content.indexOf('user-scalable=no') !== -1 ||
                  document.documentElement.scrollWidth <= window.outerWidth)
              ) {
                return true;
              }
            }

            // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
            // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
            if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
              return true;
            }

            return false;
          };

          /**
           * Factory method for creating a FastClick object
           *
           * @param {Element} layer The layer to listen on
           * @param {Object} [options={}] The options to override the defaults
           */
          FastClick.attach = function(layer, options) {
            return new FastClick(layer, options);
          };

          if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
            // AMD. Register as an anonymous module.
            define(function() {
              return FastClick;
            });
          } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = FastClick.attach;
            module.exports.FastClick = FastClick;
          } else {
            window.FastClick = FastClick;
          }
        })();
      },
      {},
    ],
    8: [
      function(require, module, exports) {
        /**
         * @fileoverview 错误显示
         */
        var Component = require('../ui/component');
        var Util = require('../lib/util');
        var Dom = require('../lib/dom');
        var Event = require('../lib/event');
        var UA = require('../lib/ua');
        var lang = require('../lang/index');
        var eventType = require('../player/base/event/eventtype');

        var AutoStreamSelector = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.className = options.className ? options.className : 'prism-auto-stream-selector';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              "<div><p class='tip-text'></p></div><div class='operators'><a class='prism-button prism-button-ok' type='button'>" +
              lang.get('OK_Text') +
              '</a>' +
              "<a class='prism-button prism-button-cancel'  target='_blank'>" +
              lang.get('Cancel_Text') +
              '</a></div>';
            return el;
          },

          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.AutoStreamShow, function(e) {
              var element = document.querySelector('#' + that.getId() + ' .tip-text');
              if (that._player._getLowerQualityLevel) {
                var item = that._player._getLowerQualityLevel();
                if (item) {
                  that._switchUrl = item;
                  element.innerText = lang
                    .get('Auto_Stream_Tip_Text')
                    .replace('$$', item.item.desc);
                  Dom.css(that.el(), 'display', 'block');
                }
              }
            });
            that._player.on(eventType.Private.AutoStreamHide, function(e) {
              var element = document.querySelector('#' + that.getId() + ' .tip-text');
              Dom.css(that.el(), 'display', 'none');
            });

            var okEle = document.querySelector('#' + that.getId() + ' .prism-button-ok');
            Event.on(okEle, 'click', function() {
              if (that._player._changeStream && that._switchUrl) {
                that._player._changeStream(that._switchUrl.index, lang.get('Quality_Change_Text'));
              }
              Dom.css(that.el(), 'display', 'none');
            });

            var cancelEle = document.querySelector('#' + that.getId() + ' .prism-button-cancel');
            Event.on(cancelEle, 'click', function() {
              Dom.css(that.el(), 'display', 'none');
            });
          },
        });

        module.exports = AutoStreamSelector;
      },
      {
        '../lang/index': 17,
        '../lib/dom': 24,
        '../lib/event': 25,
        '../lib/ua': 38,
        '../lib/util': 40,
        '../player/base/event/eventtype': 48,
        '../ui/component': 99,
      },
    ],
    9: [
      function(require, module, exports) {
        /**
         * @fileoverview 进度条
         */
        var Component = require('../ui/component');
        var Dom = require('../lib/dom');
        var Event = require('../lib/event');
        var UA = require('../lib/ua');
        var Fn = require('../lib/function');
        var lang = require('../lang/index');
        var Util = require('../lib/util');
        var cfg = require('../config');
        var playerUtil = require('../lib/playerutil');
        var eventType = require('../player/base/event/eventtype');

        var LiveShiftProgress = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);

            this.className = options.className ? options.className : 'prism-liveshift-progress';
            this.addClass(this.className);
            this._liveshiftService = player._liveshiftService;
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this);
            el.innerHTML =
              '<div class="prism-enable-liveshift"><div class="prism-progress-loaded"></div>' +
              '<div class="prism-progress-played"></div>' +
              '<div class="prism-progress-cursor"><img></img></div>' +
              '<p class="prism-progress-time"></p>' +
              '<div class="prism-liveshift-seperator">00:00:00</div></div>' +
              '<div class="prism-disable-liveshift"></div>';
            return el;
          },

          bindEvent: function() {
            var that = this;

            this.loadedNode = document.querySelector('#' + this.id() + ' .prism-progress-loaded');
            this.playedNode = document.querySelector('#' + this.id() + ' .prism-progress-played');
            this.cursorNode = document.querySelector('#' + this.id() + ' .prism-progress-cursor');
            this.timeNode = document.querySelector('#' + this.id() + ' .prism-progress-time');
            this.controlNode = document.querySelector(
              '#' + this._player._options.id + ' .prism-controlbar',
            );
            this.seperatorNode = document.querySelector(
              '#' + this.id() + ' .prism-liveshift-seperator',
            );
            this.progressNode = document.querySelector(
              '#' + this.id() + ' .prism-enable-liveshift',
            );
            var cursorNodeImg = document.querySelector(
              '#' + this.id() + ' .prism-progress-cursor img',
            );
            var url =
              '//' +
              cfg.domain +
              '/de/prismplayer/' +
              cfg.h5Version +
              '/skins/default/img/dragcursor.png';
            if (!cfg.domain) {
              url = 'de/prismplayer/' + cfg.h5Version + '/skins/default/img/dragcursor.png';
            } else if (cfg.domain.indexOf('localhost') > -1) {
              url = '//' + cfg.domain + '/build/skins/default/img/dragcursor.png';
            }
            cursorNodeImg.src = url;
            Event.on(this.cursorNode, 'mousedown', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.cursorNode, 'touchstart', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.progressNode, 'mousemove', function(e) {
              that._progressMove(e);
            });
            Event.on(this.progressNode, 'touchmove', function(e) {
              that._progressMove(e);
            });
            Event.on(this._el, 'click', function(e) {
              that._onMouseClick(e);
            });
            this._player.on(eventType.Private.HideProgress, function(e) {
              that._hideProgress(e);
            });
            this._player.on(eventType.Private.CancelHideProgress, function(e) {
              that._cancelHideProgress(e);
            });
            this._player.on(eventType.Private.ShowBar, function() {
              that._updateLayout();
            });
            Event.on(this.progressNode, eventType.Private.MouseOver, function(e) {
              that._onMouseOver(e);
            });

            Event.on(this.progressNode, eventType.Private.MouseOut, function(e) {
              that._onMouseOut(e);
            });

            this.bindTimeupdate = Fn.bind(this, this._onTimeupdate);
            this._player.on(eventType.Player.TimeUpdate, this.bindTimeupdate);

            if (playerUtil.isLiveShift(this._player._options)) {
              this._player.on(eventType.Player.Play, function() {
                that._liveshiftService.start(60 * 1000, function(error) {
                  var paramData = {
                    mediaId: that._player._options.vid ? that._player._options.vid : '',
                    error_code: error.Code,
                    error_msg: error.Message,
                  };
                  that._player.logError(paramData);
                  that._player.trigger(eventType.Player.Error, paramData);
                });
              });
            }

            this._player.on(eventType.Private.LiveShiftQueryCompleted, function() {
              that._updateSeperator();
              that._updateLayout();
            });

            this._player.on(eventType.Player.Pause, function() {
              that._liveshiftService.stop();
            });

            // ipad下播放无法触发progress事件，原因待查
            if (UA.IS_IPAD) {
              this.interval = setInterval(function() {
                that._onProgress();
              }, 500);
            } else {
              this._player.on(eventType.Video.Progress, function() {
                that._onProgress();
              });
            }
          },

          _updateSeperator: function() {
            // var percent = this._liveshiftService.availableLiveShiftTime/this._liveshiftService.liveTimeRange.totalTime;
            // percent = percent > 1? 1: percent;
            if (this._liveshiftService.currentTimeDisplay) {
              this.seperatorNode.innerText = this._liveshiftService.currentTimeDisplay;
            }
          },

          _updateLayout: function() {
            var textWidth = this.seperatorNode.offsetWidth;
            var totalWidth = this.el().offsetWidth;
            var width = totalWidth - textWidth;
            if (textWidth == 0 || width == 0) {
              return;
            }
            Dom.css(this.progressNode, 'width', ((width - 10) * 100) / totalWidth + '%');
            Dom.css(this.seperatorNode, 'right', -1 * (textWidth + 10) + 'px');
          },

          _progressMove: function(e) {
            var sec = this._getSeconds(e);
            var duration = this._liveshiftService.availableLiveShiftTime;
            this.timeNode.innerText = '-' + Util.formatTime(duration - sec);
            var percent = duration ? sec / duration : 0;
            var width = this.timeNode.clientWidth;
            var maxPercent = 1 - width / this.el().clientWidth;
            if (percent > maxPercent) {
              percent = maxPercent;
            }
            if (this.timeNode) {
              Dom.css(this.timeNode, 'left', percent * 100 + '%');
            }
          },
          //取消控制进度条
          _hideProgress: function(e) {
            var that = this;
            Event.off(this.cursorNode, 'mousedown');
            Event.off(this.cursorNode, 'touchstart');
          },

          //打开控制进度条
          _cancelHideProgress: function(e) {
            var that = this;
            Event.on(this.cursorNode, 'mousedown', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.cursorNode, 'touchstart', function(e) {
              that._onMouseDown(e);
            });
          },

          _canSeekable: function(sec) {
            var canSeekable = true;
            if (typeof this._player.canSeekable == 'function') {
              canSeekable = this._player.canSeekable(sec);
            }
            return canSeekable;
          },

          _onMouseOver: function(e) {
            this._updateCursorPosition(this._getCurrentTime());
            var that = this;
            setTimeout(function() {
              Dom.css(that.cursorNode, 'display', 'block');
            });
            Dom.css(this.timeNode, 'display', 'block');
          },

          _onMouseOut: function(e) {
            Dom.css(this.cursorNode, 'display', 'none');
            Dom.css(this.timeNode, 'display', 'none');
          },

          _getSeconds: function(e) {
            //解决鼠标 和 进度条 不统一bug
            var x = this.el().offsetLeft;
            var b = this.el();

            while ((b = b.offsetParent)) {
              var transformX = Dom.getTranslateX(b);
              x += b.offsetLeft + transformX;
            }
            var pageX = e.touches ? e.touches[0].pageX : e.pageX,
              distance = pageX - x, //,this.el().offsetLeft,
              width = this.progressNode.offsetWidth,
              duration = this._liveshiftService.availableLiveShiftTime;
            sec = duration ? (distance / width) * duration : 0;

            if (sec < 0) sec = 0;
            if (sec > duration) sec = duration;
            return sec;
          },

          //handle click
          _onMouseClick: function(e) {
            var that = this;
            var sec = this._getSeconds(e);
            var duration = this._liveshiftService.availableLiveShiftTime;
            var offset = duration - sec;
            this._player.trigger(eventType.Private.SeekStart, { fromTime: this._getCurrentTime() });
            var url = this._liveshiftService.getSourceUrl(offset);
            var isHls = playerUtil.isHls(that._player._options.source);
            if (isHls) {
              that._player.seek(sec);
            } else {
              that._player._loadByUrlInner(url, sec, true);
            }
            that._player.trigger(eventType.Private.Play_Btn_Hide);
            that._liveshiftService.seekTime = sec;
            that._player.trigger(eventType.Private.EndStart, { toTime: sec, notPlay: true });
            that._updateCursorPosition(sec);
            if (isHls) {
              setTimeout(function() {
                that._player.play();
              });
            }
          },

          _onMouseDown: function(e) {
            var that = this;

            e.preventDefault();
            //e.stopPropagation();

            this._player.trigger(eventType.Private.SeekStart, { fromTime: this._getCurrentTime() });

            Event.on(this.controlNode, 'mousemove', function(e) {
              that._onMouseMove(e);
            });
            //Event.on(this.cursorNode, 'mouseup', function(e) {that._onMouseUp(e);});
            Event.on(this.controlNode, 'touchmove', function(e) {
              that._onMouseMove(e);
            });
            //Event.on(this.cursorNode, 'touchend', function(e) {that._onMouseUp(e);});

            Event.on(this._player.tag, 'mouseup', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this._player.tag, 'touchend', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this.controlNode, 'mouseup', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this.controlNode, 'touchend', function(e) {
              that._onMouseUp(e);
            });
          },

          _onMouseUp: function(e) {
            var that = this;
            e.preventDefault();

            Event.off(this.controlNode, 'mousemove');
            //Event.off(this.cursorNode, 'mouseup');
            Event.off(this.controlNode, 'touchmove');
            //Event.off(this.cursorNode, 'touchend');
            Event.off(this._player.tag, 'mouseup');
            Event.off(this._player.tag, 'touchend');
            Event.off(this.controlNode, 'mouseup');
            Event.off(this.controlNode, 'touchend');

            // 设置当前时间，播放视频
            var duration = this._liveshiftService.availableLiveShiftTime;
            var sec = (this.playedNode.offsetWidth / this.el().offsetWidth) * duration;
            // var url = this._liveshiftService.getSourceUrl(sec);
            this._player.seek(sec);
            this._player.trigger(eventType.Private.Play_Btn_Hide);
            this._liveshiftService.seekTime = sec;
            this._player.trigger(eventType.Private.EndStart, { toTime: sec });
          },

          _onMouseMove: function(e) {
            e.preventDefault();
            //e.stopPropagation();

            var sec = this._getSeconds(e);
            this._updateProgressBar(this.playedNode, sec);
            this._updateCursorPosition(sec);
          },

          _onTimeupdate: function(e) {
            this._updateProgressBar(this.playedNode, this._getCurrentTime());
            this._updateCursorPosition(this._getCurrentTime());

            this._player.trigger(eventType.Private.UpdateProgressBar, {
              time: this._getCurrentTime(),
            });
            //}
          },

          _getCurrentTime: function() {
            var seekTime = this._liveshiftService.seekTime;
            if (seekTime == -1) {
              seekTime = 0;
            }
            return this._player.getCurrentTime() + seekTime;
          },

          _onProgress: function(e) {
            // 此时buffer可能还没有准备好
            if (this._player.getDuration()) {
              if (this._player.getBuffered().length >= 1) {
                this._updateProgressBar(
                  this.loadedNode,
                  this._player.getBuffered().end(this._player.getBuffered().length - 1),
                );
              }
            }
          },

          _updateProgressBar: function(node, sec) {
            if (this._player._switchSourcing == true) return;
            var percent = 0;
            if (this._liveshiftService.seekTime == -1) {
              percent = 1;
            } else {
              var duration = this._liveshiftService.availableLiveShiftTime;
              // sec = sec + this._liveshiftService.seekTime;
              percent = duration ? sec / duration : 0;
              if (percent > 1) {
                percent = 1;
                this._liveshiftService.seekTime = -1;
              }
            }
            var baseTime = this.liveShiftStartDisplay;

            if (node) {
              Dom.css(node, 'width', percent * 100 + '%');
            }
          },

          _updateCursorPosition: function(sec) {
            if (
              this._player._switchSourcing == true ||
              (sec == 0 && this._player.tag.readyState == 0)
            )
              return;
            var percent = 0;
            if (this._liveshiftService.seekTime == -1) {
              percent = 1;
            } else {
              var duration = this._liveshiftService.availableLiveShiftTime;
              // sec = sec + this._liveshiftService.seekTime;
              percent = duration ? sec / duration : 0;
              if (percent > 1) {
                this._liveshiftService.seekTime = -1;
              }
            }
            var cursorWidth = 12 * 1.5;
            var maxPercent = 1;
            var clientWidth = this._player.el().clientWidth;
            if (clientWidth != 0) {
              maxPercent = 1 - cursorWidth / clientWidth;
            }

            if (this.cursorNode) {
              if (percent > maxPercent) {
                Dom.css(this.cursorNode, 'right', '0px');
                Dom.css(this.cursorNode, 'left', 'auto');
              } else {
                Dom.css(this.cursorNode, 'right', 'auto');
                Dom.css(this.cursorNode, 'left', percent * 100 + '%');
              }
            }
          },
        });

        module.exports = LiveShiftProgress;
      },
      {
        '../config': 11,
        '../lang/index': 17,
        '../lib/dom': 24,
        '../lib/event': 25,
        '../lib/function': 26,
        '../lib/playerutil': 35,
        '../lib/ua': 38,
        '../lib/util': 40,
        '../player/base/event/eventtype': 48,
        '../ui/component': 99,
      },
    ],
    10: [
      function(require, module, exports) {
        /**
         * @fileoverview 播放时间
         */
        var Component = require('../ui/component');
        var Util = require('../lib/util');
        var eventType = require('../player/base/event/eventtype');

        var LiveTimeDisplay = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);

            this.className = options.className ? options.className : 'prism-live-time-display';
            this.addClass(this.className);
            this._liveshiftService = player._liveshiftService;
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="end-time">00:00</span><span class="live-text">Live: </span><span class="live-time"></span>';
            return el;
          },

          bindEvent: function() {
            var that = this;

            this._player.on(eventType.Video.TimeUpdate, function() {
              var service = that._liveshiftService;
              var curTime = document.querySelector('#' + that.id() + ' .current-time');
              if (
                service.liveShiftStartDisplay &&
                service.availableLiveShiftTime > service.seekTime &&
                service.seekTime != -1
              ) {
                var startTime = that._liveshiftService.getBaseTime();
                var curr = Util.formatTime(startTime + that._player.getCurrentTime());
                curTime.innerText = curr;
              } else if (service.currentTimeDisplay) {
                curTime.innerText = service.currentTimeDisplay;
              }
            });

            this._player.on(eventType.Private.LiveShiftQueryCompleted, function() {
              that.updateTime();
            });
          },
          updateTime: function() {
            document.querySelector(
              '#' + this.id() + ' .end-time',
            ).innerText = this._liveshiftService.liveTimeRange.endDisplay;
            document.querySelector(
              '#' + this.id() + ' .live-time',
            ).innerText = this._liveshiftService.currentTimeDisplay;
          },
        });

        module.exports = LiveTimeDisplay;
      },
      { '../lib/util': 40, '../player/base/event/eventtype': 48, '../ui/component': 99 },
    ],
    11: [
      function(require, module, exports) {
        /**
         * flash的应用信息
         */
        module.exports = {
          //domain: 'g-assets.daily.taobao.net',
          //domain:'localhost:9030',
          //domain:'player.alicdn.com/aliplayer',
          // domain:'player.alicdn.com',
          domain: '', //城市大脑s
          //domain: 'g.alicdn.com',
          //domain: 'static.qupaicloud.com',
          flashVersion: '2.7.2',
          h5Version: '2.7.2',
          cityBrain: true,
          //logReportTo: 'https://videocloud.cn-hangzhou.log.aliyuncs.com/logstores/newplayer/track'
          logReportTo: 'https://videocloud.cn-hangzhou.log.aliyuncs.com/logstores/playertest/track',
        };
      },
      {},
    ],
    12: [
      function(require, module, exports) {
        /**
         * @fileoverview prismplayer的入口模块
         */
        var lang = require('./lang/index');
        lang.load();
        var AdaptivePlayer = require('./player/adaptivePlayer');
        var componentutil = require('./lib/componentutil');

        var prism = function(opt, ready) {
          return AdaptivePlayer.create(opt, ready);
        };

        componentutil.register(prism);

        var prismplayer = (window['Aliplayer'] = prism);

        //全局变量，记录所有的播放器
        prism.players = {};

        // AMD
        if (typeof define === 'function' && define['amd']) {
          define([], function() {
            return prismplayer;
          });
          // commonjs, 支持browserify
        } else if (typeof exports === 'object' && typeof module === 'object') {
          module['exports'] = prismplayer;
        }
      },
      { './lang/index': 17, './lib/componentutil': 20, './player/adaptivePlayer': 45 },
    ],
    13: [
      function(require, module, exports) {
        var oo = require('../lib/oo');
        var lang = require('../lang/index');

        var AutoPlayDelay = oo.extend({
          init: function(player, options) {
            var that = this;
            this._player = player;
            this._options = player.options();
          },
        });

        AutoPlayDelay.prototype.handle = function(behaviorCallback) {
          if (this._options.autoPlayDelay) {
            var text = this._options.autoPlayDelayDisplayText;
            if (!text) {
              text = lang
                .get('AutoPlayDelayDisplayText')
                .replace('$$', this._options.autoPlayDelay);
            }
            this._player.trigger('info_show', text);
            this._player.trigger('h5_loading_hide');
            this._player.trigger('play_btn_hide');
            var that = this;
            this._timeHandler = setTimeout(function() {
              that._player.trigger('info_hide');
              that._options.autoPlayDelay = 0;
              if (behaviorCallback) {
                behaviorCallback();
              }
            }, this._options.autoPlayDelay * 1000);
            this._player.on('play', function() {
              clear(that);
            });
            this._player.on('pause', function() {
              clear(that);
            });
          }
        };

        AutoPlayDelay.prototype.dispose = function() {
          clear(this);
          this._player = null;
        };

        var clear = function(obj) {
          if (obj._timeHandler) {
            clearTimeout(obj._timeHandler);
            obj._timeHandler = null;
          }
        };

        module.exports = AutoPlayDelay;
      },
      { '../lang/index': 17, '../lib/oo': 33 },
    ],
    14: [
      function(require, module, exports) {
        module.exports = module.exports = {
          OD: 'OD',
          FD: '360p',
          LD: '540p',
          SD: '720p',
          HD: '1080p',
          '2K': '2K',
          '4K': '4K',
          FHD: 'FHD',
          XLD: 'XLD',
          Speed: 'Speed',
          Speed_0125X_Text: '0.125X',
          Speed_025X_Text: '0.25X',
          Speed_05X_Text: '0.5X',
          Speed_1X_Text: 'Normal',
          Speed_125X_Text: '2X',
          Speed_15X_Text: '3X',
          Speed_2X_Text: '4X',
          Refresh_Text: 'Refresh',
          Cancel: 'Cancel',
          Mute: 'Mute',
          Snapshot: 'Snapshot',
          Detection_Text: 'Diagnosis',
          Play_DateTime: 'Time',
          Quality_Change_Fail_Switch_Text: 'Cannot play, switch to ',
          Quality_Change_Text: 'Switch to ',
          Quality_The_Url: 'The url',
          AutoPlayDelayDisplayText: 'Play in $$ seconds',
          Error_Load_Abort_Text: 'Data abort erro',
          Error_Network_Text: 'Loading failed due to network error',
          Error_Decode_Text: 'Decode error',
          Error_Server_Network_NotSupport_Text:
            'Network error or  the format of video is unsupported',
          Error_Offline_Text: 'The network is unreachable, please click Refresh',
          Error_Play_Text: 'Error occured while playing',
          Error_Retry_Text: ' Please close or refresh',
          Error_AuthKey_Text: 'Authentication expired or the domain is not in white list',
          Error_H5_Not_Support_Text:
            'The format of video is not supported by h5 player，please use flash player',
          Error_Not_Support_M3U8_Text: 'The format of m3u8 is not supported by this explorer',
          Error_Not_Support_MP4_Text: 'The format of mp4 is not supported by this explorer',
          Error_Not_Support_encrypt_Text:
            'The encrypted video is not supported by h5 player,please set useFlashPrism to true',
          Error_Vod_URL_Is_Empty_Text: 'The url is empty',
          Error_Vod_Fetch_Urls_Text: 'Error occured when fetch urls，please close or refresh',
          Fetch_Playauth_Error: 'Error occured when fetch playauth close or refresh',
          Error_Playauth_Decode_Text: 'PlayAuth parse failed',
          Error_Vid_Not_Same_Text: 'Cannot renew url due to vid changed',
          Error_Playauth_Expired_Text: 'Playauth expired, please close or refresh',
          Error_MTS_Fetch_Urls_Text: 'Error occurred while requesting mst server',
          Error_Load_M3U8_Failed_Text: 'The m3u8 file loaded failed',
          Error_Load_M3U8_Timeout_Text: 'Timeout error occored when the m3u8 file loaded',
          Error_M3U8_Decode_Text: 'The m3u8 file decoded failed',
          Error_TX_Decode_Text: 'Video decoded failed',
          Error_Waiting_Timeout_Text: 'Buffering timeout, please close or refresh',
          Error_Invalidate_Source: 'Invalid source',
          Error_Fetch_NotStream: 'The vid has no stream to play',
          Error_Not_Found: 'Url is not found',
          Live_End: 'Live has finished',
          Play_Before_Fullscreen: 'Please play before fullscreen',
          Can_Not_Seekable: 'Can not seek to this position',
          Cancel_Text: 'Cancel',
          OK_Text: 'OK',
          Auto_Stream_Tip_Text: 'Internet is slow, does switch to $$',
          Request_Block_Text: 'This request is blocked, the video Url should be over https',
          Open_Html_By_File: 'Html page should be on the server',
          Maybe_Cors_Error:
            "please make sure enable cors,<a href='https://help.aliyun.com/document_detail/62950.html?spm=a2c4g.11186623.2.21.Y3n2oi' target='_blank'>refer to document</a>",
          Speed_Switch_To: 'Speed switch to ',
          Curent_Volume: 'Current volume:',
          Volume_Mute: 'set to mute',
          Volume_UnMute: 'set to unmute',
          ShiftLiveTime_Error: 'Live start time should not be greater than over time',
          Error_Not_Support_Format_On_Mobile:
            "flv、rmtp can't be supported on mobile，please use m3u8",
          SessionId_Ticket_Invalid: 'please assign value for sessionId and ticket properties',
          Http_Error: ' An HTTP network request failed with an error, but not from the server.',
          Http_Timeout: 'A network request timed out',
          DRM_License_Expired: 'DRM license is expired, please refresh',
          Not_Support_DRM: "Browser doesn't support DRM",
          CC_Switch_To: 'Subtitle switch to ',
          AudioTrack_Switch_To: 'Audio tracks switch to ',
          Subtitle: 'Subtitle/CC',
          AudioTrack: 'Audio Track',
          Quality: 'Quality',
          Auto: 'Auto',
          Quality_Switch_To: 'Quality switch to ',
          Fullscreen: 'Full Screen',
          Setting: 'Settings',
          Volume: 'Volume',
          Play: 'Play',
          Pause: 'Pause',
          CloseSubtitle: 'Close CC',
          OpenSubtitle: 'Open CC',
          ExistFullScreen: 'Exit Full Screen',
          Muted: 'Muted',
          Retry: 'Retry',
          SwitchToLive: 'Return to live',
        };
      },
      {},
    ],
    15: [
      function(require, module, exports) {
        module.exports = module.exports = {
          OD: 'OD',
          LD: '360p',
          FD: '540p',
          SD: '720p',
          HD: '1080p',
          '2K': '2K',
          '4K': '4K',
          FHD: 'FHD',
          XLD: 'XLD',
          Forbidden_Text: 'Internal information is strictly forbidden to outsider',
          Refresh: 'Refresh',
          Diagnosis: 'Diagnosis',
          Live_Finished: 'Live has finished, thanks for watching',
          Play: 'Play',
          Pause: 'Pause',
          Snapshot: 'Snapshot',
          Replay: 'Replay',
          Live: 'Live',
          Encrypt: 'Encrypt',
          Sound: 'Sound',
          Fullscreen: 'Full Screen',
          Exist_Fullscreen: 'Exit Full-screen',
          Resolution: 'Resolution',
          Next: 'Next Video',
          Brightness: 'Brightness',
          Default: 'Default',
          Contrast: 'Contrast',
          Titles_Credits: 'Titles and Credits',
          Skip_Titles: 'Skip Titles',
          Skip_Credits: 'Skip Credits',
          Not_Support_Out_Site:
            'The video is not supported for outside website, please watch it by TaoTV',
          Watch_Now: 'Watch now',
          Network_Error: 'Network is unreachable, please try to refresh',
          Video_Error: 'Playing a video error, please try to refresh',
          Decode_Error: 'Data decoding error',
          Live_Not_Start: 'Live has not started, to be expected',
          Live_Loading: 'Live information is loading, please try to refresh',
          Fetch_Playauth_Error: 'Error occured when fetch playauth close or refresh',
          Live_End: 'Live has finished',
          Live_Abrot: 'Signal aborted, please try to refresh',
          Corss_Domain_Error:
            'Please ensure your domain has obtained IPC license and combined CNAME, \r\n or to set  cross-domain accessing available',
          Url_Timeout_Error: 'The video url is timeout, please try to refresh',
          Connetction_Error:
            'Sorry，the video cannot play because of connection error, please try to watch other videos',
          Fetch_MTS_Error: 'Fetching video list failed, please ensure',
          Token_Expired_Error: 'Requesting open api failed, please ensure token expired or not',
          Video_Lists_Empty_Error: 'The video list is empty, please check the format of video',
          Encrypted_Failed_Error:
            'Fetching encrypted file failed, please check the permission of player',
          Fetch_Failed_Permission_Error:
            'Fetching video list failed, please check the permission of player',
          Invalidate_Param_Error: 'No video url, please check the parameters',
          AutoPlayDelayDisplayText: 'Play in $$ seconds',
          Fetch_MTS_NOT_NotStream_Error: 'The vid has no stream to play',
          Cancel_Text: 'Cancel',
          OK_Text: 'OK',
          Auto_Stream_Tip_Text: 'Internet is slow, does switch to $$',
          Open_Html_By_File: 'Html page should be on the server',
          Cant_Use_Flash_On_Mobile: "Mobile doesn't support flash player，please use h5 player",
        };
      },
      {},
    ],
    16: [
      function(require, module, exports) {
        module.exports = module.exports = {
          OD: '原画',
          FD: '流畅',
          LD: '标清',
          SD: '高清',
          HD: '超清',
          '2K': '2K',
          '4K': '4K',
          FHD: '全高清',
          XLD: '极速',
          Forbidden_Text: '内部信息，严禁外传',
          Refresh: '刷新',
          Diagnosis: '诊断',
          Live_Finished: '直播已结束,谢谢观看',
          Play: '播放',
          Pause: '暂停',
          Snapshot: '截图',
          Replay: '重播',
          Live: '直播',
          Encrypt: '加密',
          Sound: '声音',
          Fullscreen: '全屏',
          Exist_Fullscreen: '退出全屏',
          Resolution: '清晰度',
          Next: '下一集',
          Brightness: '亮度',
          Default: '默认',
          Contrast: '对比度',
          Titles_Credits: '片头片尾',
          Skip_Titles: '跳过片头',
          Skip_Credits: '跳过片尾',
          Not_Support_Out_Site: '该视频暂不支持站外播放，请到淘TV观看',
          Watch_Now: '立即观看',
          Network_Error: '网络无法连接，请尝试检查网络后刷新试试',
          Video_Error: '视频播放异常，请刷新试试',
          Decode_Error: '播放数据解码错误',
          Live_Not_Start: '亲，直播还未开始哦，敬请期待',
          Live_Loading: '直播信息加载中，请刷新试试',
          Live_End: '亲，直播已结束',
          Live_Abrot: '当前直播信号中断，请刷新后重试',
          Corss_Domain_Error:
            '请确认您的域名已完成备案和CNAME绑定，\r\n并处于启用状态，或资源允许跨越访问',
          Url_Timeout_Error: '您所观看的视频地址连接超时，请刷新后重试',
          Connetction_Error: '抱歉,该视频由于连接错误暂时不能播放,请观看其它视频',
          Fetch_MTS_Error: '获取视频列表失败，请确认',
          Token_Expired_Error: '请求接口失败，请确认Token是否过期',
          Video_Lists_Empty_Error: '获取视频列表为空，请确认播放数据与格式',
          Encrypted_Failed_Error: '获取视频加密秘钥错误，请确认播放权限',
          Fetch_Failed_Permission_Error: '获取视频列表失败，请确认播放权限',
          Invalidate_Param_Error: '无输入视频，请确认输入参数',
          AutoPlayDelayDisplayText: '$$秒以后开始播放',
          Fetch_MTS_NOT_NotStream_Error: '此vid没有可播放视频',
          Cancel_Text: '取消',
          OK_Text: '确认',
          Auto_Stream_Tip_Text: '网络不给力，是否切换到$$',
          Fetch_Playauth_Error: '获取播放凭证出错啦，请尝试退出重试或刷新',
          Open_Html_By_File: '不能直接在浏览器打开html文件，请部署到服务端',
          Cant_Use_Flash_On_Mobile: '移动端不支持Flash播放器，请使用h5播放器',
        };
      },
      {},
    ],
    17: [
      function(require, module, exports) {
        var config = require('../config');
        var storage = require('../lib/storage');
        var io = require('../lib/io');

        var langDataKey = 'aliplayer_lang_data';
        var langValueKey = 'aliplayer_lang';

        var getCurrentLanguage = function() {
          if (typeof window[langValueKey] == 'undefined' || !window[langValueKey]) {
            var lang = (navigator.language || navigator.browserLanguage).toLowerCase();
            if (lang && lang.indexOf('zh') > -1) {
              lang = 'zh-cn';
            } else {
              lang = 'en-us';
            }
            window[langValueKey] = lang;
          }
          return window[langValueKey];
        };

        var setCurrentLanguage = function(lang, type, langTexts) {
          var storeLanguage = window[langValueKey];
          if (typeof lang == 'undefined' || !lang) {
            lang = getCurrentLanguage();
          }
          if (lang != 'en-us' && lang != 'zh-cn') {
            if (!langTexts || (langTexts && !langTexts[lang])) {
              throw new Error(
                'There is not language resource for ' +
                  lang +
                  ', please specify the language resource by languageTexts property',
              );
            }
          }
          window[langValueKey] = lang;
          load(type, langTexts);
          if (lang != storeLanguage) {
            var constants = require('../lib/constants');
            constants.updateByLanguage();
          }
        };

        var load = function(type, langTexts) {
          var key = getKey(type);
          // var langObj = storage.get(key);
          // if(!langObj)
          // {
          // var url = '//'+config.domain+'/de/prismplayer/'+config.h5Version+'/lang/'+(type=='flash'?'flash/':'')+getLanguage() +'.json';
          // io.get(url,function(reponseText){
          var reponseText = '',
            lang = getLanguage();
          if (type == 'flash') {
            if (lang == 'en-us') {
              reponseText = require('./flash/en-us');
            } else if (lang == 'zh-cn') {
              reponseText = require('./flash/zh-cn');
            } else {
              reponseText = langTexts[lang];
            }
          } else {
            if (lang == 'en-us') {
              reponseText = require('./en-us');
            } else if (lang == 'zh-cn') {
              reponseText = require('./zh-cn');
            } else {
              reponseText = langTexts[lang];
            }
          }
          storage.set(key, JSON.stringify(reponseText));
          setLanguageData(type, reponseText);
          // },function(){
          // 	console.log('fail to load language data');
          // },false)
          // }
          // else
          // {
          // 	setLanguageData(type,JSON.parse(langObj))
          // }
        };

        var setLanguageData = function(type, data) {
          var key = getKey(type);
          window[key] = data;
        };

        var getLanguageData = function(type, data) {
          var key = getKey(type);
          return window[key];
        };

        var getLanguage = function() {
          var lang = getCurrentLanguage();
          // if(lang != 'en-us' && lang !='zh-cn')
          // {
          // 	lang = 'en-us';
          // }
          return lang;
        };

        var getKey = function(type) {
          var lang = getLanguage();
          if (!type) {
            type = 'h5';
          }
          return langDataKey + '_' + type + '_' + config.h5Version.replace(/\./g, '_') + '_' + lang;
        };

        var get = function(key, type) {
          if (!type) {
            type = 'h5';
          }
          var langKey = getKey(type);
          var data = window[langKey];
          if (data) {
            return data[key];
          }
        };

        module.exports.setCurrentLanguage = setCurrentLanguage;
        module.exports.getCurrentLanguage = getCurrentLanguage;
        module.exports.getLanguageData = getLanguageData;
        module.exports.load = load;
        module.exports.get = get;
      },
      {
        '../config': 11,
        '../lib/constants': 21,
        '../lib/io': 30,
        '../lib/storage': 37,
        './en-us': 14,
        './flash/en-us': 15,
        './flash/zh-cn': 16,
        './zh-cn': 18,
      },
    ],
    18: [
      function(require, module, exports) {
        module.exports = module.exports = {
          OD: '原画',
          FD: '流畅',
          LD: '标清',
          SD: '高清',
          HD: '超清',
          '2K': '2K',
          '4K': '4K',
          FHD: '全高清',
          XLD: '极速',
          Speed: '倍速',
          Speed_0125X_Text: '0.125X',
          Speed_025X_Text: '0.25X',
          Speed_05X_Text: '0.5X',
          Speed_1X_Text: '正常',
          Speed_125X_Text: '2X',
          Speed_15X_Text: '3X',
          Speed_2X_Text: '4X',
          Quality_Change_Fail_Switch_Text: '不能播放，切换为',
          Quality_Change_Text: '正在为您切换到 ',
          Quality_The_Url: '此地址',
          Refresh_Text: '刷新',
          Detection_Text: '诊断',
          Cancel: '取消',
          Mute: '静音',
          Snapshot: '截图',
          Play_DateTime: '播放时间',
          AutoPlayDelayDisplayText: '$$秒以后开始播放',
          Error_Load_Abort_Text: '获取数据过程被中止',
          Error_Network_Text: '网络错误加载数据失败',
          Error_Decode_Text: '解码错误',
          Error_Server_Network_NotSupport_Text: '服务器、网络错误或格式不支持',
          Error_Offline_Text: '网络不可用，请确定',
          Error_Play_Text: '播放出错啦',
          Error_Retry_Text: '请尝试退出重试或刷新',
          Error_AuthKey_Text: '可能鉴权过期、域名不在白名单或请求被拦截',
          Error_H5_Not_Support_Text: 'h5不支持此格式，请使用flash播放器',
          Error_Not_Support_M3U8_Text: '浏览器不支持m3u8视频播放',
          Error_Not_Support_MP4_Text: '浏览器不支持mp4视频播放',
          Error_Not_Support_encrypt_Text: 'h5不支持加密视频的播放，请设置useFlashPrism为true',
          Error_Vod_URL_Is_Empty_Text: '获取播放地址为空',
          Error_Vod_Fetch_Urls_Text: '获取地址出错啦，请尝试退出重试或刷新',
          Fetch_Playauth_Error: '获取播放凭证出错啦，请尝试退出重试或刷新',
          Error_Playauth_Decode_Text: 'playauth解析错误',
          Error_Vid_Not_Same_Text: '不能更新地址，vid和播放中的不一致',
          Error_Playauth_Expired_Text: '凭证已过期，请尝试退出重试或刷新',
          Error_MTS_Fetch_Urls_Text: 'MTS获取取数失败',
          Error_Load_M3U8_Failed_Text: '获取m3u8文件失败',
          Error_Load_M3U8_Timeout_Text: '获取m3u8文件超时',
          Error_M3U8_Decode_Text: '获取m3u8文件解析失败',
          Error_TX_Decode_Text: '解析数据出错',
          Error_Waiting_Timeout_Text: '缓冲数据超时，请尝试退出重试或刷新',
          Error_Invalidate_Source: '无效地址',
          Error_Fetch_NotStream: '此vid没有可播放视频',
          Error_Not_Found: '播放地址不存在',
          Live_End: '亲，直播已结束',
          Play_Before_Fullscreen: '播放后再全屏',
          Can_Not_Seekable: '不能seek到这里',
          Cancel_Text: '取消',
          OK_Text: '确认',
          Auto_Stream_Tip_Text: '网络不给力，是否切换到$$',
          Request_Block_Text: '浏览器安全策略视频地址不能为http协议，与网站https协议不一致',
          Open_Html_By_File: '不能直接在浏览器打开html文件，请部署到服务端',
          Maybe_Cors_Error:
            "请确认是否开启了允许跨域访问<a href='https://help.aliyun.com/document_detail/62950.html?spm=a2c4g.11186623.2.21.Y3n2oi' target='_blank'>参考文档</a>",
          Speed_Switch_To: '倍速切换到 ',
          Curent_Volume: '当前音量：',
          Volume_Mute: '设置为静音',
          Volume_UnMute: '设置为非静音',
          ShiftLiveTime_Error: '直播开始时间不能大于直播结束时间',
          Error_Not_Support_Format_On_Mobile: '移动端不支持flv、rmtp视频，请使用m3u8',
          SessionId_Ticket_Invalid: 'DRM视频播放，sessionId和ticket属性不能为空',
          Http_Error: 'Http网络请求失败',
          Http_Timeout: 'http请求超时',
          DRM_License_Expired: 'DRM license超时，请刷新',
          Not_Support_DRM: '浏览器不支持DRM视频的播放',
          CC_Switch_To: '字幕切换到 ',
          AudioTrack_Switch_To: '音轨切换到 ',
          Subtitle: '字幕',
          AudioTrack: '音轨',
          Quality: '清晰度',
          Auto: '自动',
          Quality_Switch_To: '清晰度切换到 ',
          Fullscreen: '全屏',
          Setting: '设置',
          Volume: '音量',
          Play: '播放',
          Pause: '暂停',
          CloseSubtitle: '关闭字幕',
          OpenSubtitle: '打开字幕',
          ExistFullScreen: '退出全屏',
          Muted: '静音',
          Retry: '重试',
          SwitchToLive: '返回直播',
        };
      },
      {},
    ],
    19: [
      function(require, module, exports) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        // Use a lookup table to find the index.
        if (window.Uint8Array) {
          var lookup = new Uint8Array(256);
          for (var i = 0; i < chars.length; i++) {
            lookup[chars.charCodeAt(i)] = i;
          }
        }

        var encode = function(arraybuffer) {
          var bytes = new Uint8Array(arraybuffer),
            i,
            len = bytes.length,
            base64 = '';

          for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
          }

          if (len % 3 === 2) {
            base64 = base64.substring(0, base64.length - 1) + '=';
          } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + '==';
          }

          return base64;
        };

        var decode = function(base64) {
          var bufferLength = base64.length * 0.75,
            len = base64.length,
            i,
            p = 0,
            encoded1,
            encoded2,
            encoded3,
            encoded4;

          if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
              bufferLength--;
            }
          }

          var arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

          for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
          }

          return arraybuffer;
        };

        var fromUTF16 = function(data, littleEndian, opt_noThrow) {
          if (!data) return '';

          if (!opt_noThrow && data.byteLength % 2 != 0) {
            console.log('Data has an incorrect length, must be even.');
          }

          /** @type {ArrayBuffer} */
          var buffer;
          if (data instanceof ArrayBuffer) {
            buffer = data;
          } else {
            // Have to create a new buffer because the argument may be a smaller
            // view on a larger ArrayBuffer.  We cannot use an ArrayBufferView in
            // a DataView.
            var temp = new Uint8Array(data.byteLength);
            temp.set(new Uint8Array(data));
            buffer = temp.buffer;
          }

          // Use a DataView to ensure correct endianness.
          var length = Math.floor(data.byteLength / 2);
          var arr = new Uint16Array(length);
          var dataView = new DataView(buffer);
          for (var i = 0; i < length; i++) {
            arr[i] = dataView.getUint16(i * 2, littleEndian);
          }
          return fromCharCode_(arr);
        };

        var fromCharCode_ = function(args) {
          var max = 16000;
          var ret = '';
          for (var i = 0; i < args.length; i += max) {
            var subArray = args.subarray(i, i + max);
            ret += String.fromCharCode.apply(null, subArray);
          }

          return ret;
        };

        unpackPlayReady = function(data) {
          // On IE and Edge, the raw license message is UTF-16-encoded XML.  We need to
          // unpack the Challenge element (base64-encoded string containing the actual
          // license request) and any HttpHeader elements (sent as request headers).

          // Example XML:

          // <PlayReadyKeyMessage type="LicenseAcquisition">
          //   <LicenseAcquisition Version="1">
          //     <Challenge encoding="base64encoded">{Base64Data}</Challenge>
          //     <HttpHeaders>
          //       <HttpHeader>
          //         <name>Content-Type</name>
          //         <value>text/xml; charset=utf-8</value>
          //       </HttpHeader>
          //       <HttpHeader>
          //         <name>SOAPAction</name>
          //         <value>http://schemas.microsoft.com/DRM/etc/etc</value>
          //       </HttpHeader>
          //     </HttpHeaders>
          //   </LicenseAcquisition>
          // </PlayReadyKeyMessage>

          var xml = fromUTF16(data, true /* littleEndian */, true /* noThrow */);
          if (xml.indexOf('PlayReadyKeyMessage') == -1) {
            // This does not appear to be a wrapped message as on IE and Edge.  Some
            // clients do not need this unwrapping, so we will assume this is one of
            // them.  Note that "xml" at this point probably looks like random garbage,
            // since we interpreted UTF-8 as UTF-16.
            console.log('PlayReady request is already unwrapped.');
            // request.headers['Content-Type'] = 'text/xml; charset=utf-8';
            return;
          }
          //shaka.log.debug('Unwrapping PlayReady request.');
          var dom = new DOMParser().parseFromString(xml, 'application/xml');

          // Set request headers.
          var headers = dom.getElementsByTagName('HttpHeader'),
            headerJson = {};
          for (var i = 0; i < headers.length; ++i) {
            var name = headers[i].querySelector('name');
            var value = headers[i].querySelector('value');
            // if(name && value){
            //   console.log('Malformed PlayReady headers!');
            // }
            headerJson[name.textContent] = value.textContent;
          }

          // Unpack the base64-encoded challenge.
          var challenge = dom.querySelector('Challenge');
          // goog.asserts.assert(challenge, 'Malformed PlayReady challenge!');
          // goog.asserts.assert(challenge.getAttribute('encoding') == 'base64encoded',
          //                     'Unexpected PlayReady challenge encoding!');
          var changange = challenge.textContent;
          return {
            header: headerJson,
            changange: changange,
          };
        };

        module.exports = {
          decode: decode,
          encode: encode,
          unpackPlayReady: unpackPlayReady,
        };
      },
      {},
    ],
    20: [
      function(require, module, exports) {
        var Component = require('./oo');
        var eventType = require('../player/base/event/eventtype');

        module.exports.stopPropagation = function(e) {
          window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
        };

        module.exports.register = function(type) {
          type.util = {
            stopPropagation: module.exports.stopPropagation,
          };

          type.Component = Component.extend;
          type.EventType = eventType.Player;
        };
      },
      { '../player/base/event/eventtype': 48, './oo': 33 },
    ],
    21: [
      function(require, module, exports) {
        var lang = require('../lang/index');

        module.exports.LOAD_START = 'loadstart';
        module.exports.LOADED_METADATA = 'loadedmetadata';
        module.exports.LOADED_DATA = 'loadeddata';
        module.exports.PROGRESS = 'progress';
        module.exports.CAN_PLAY = 'canplay';
        module.exports.CAN_PLYA_THROUGH = 'canplaythrough';
        module.exports.PLAY = 'play';
        module.exports.PAUSE = 'pause';
        module.exports.ENDED = 'ended';
        module.exports.PLAYING = 'playing';
        module.exports.WAITING = 'waiting';
        module.exports.ERROR = 'error';
        module.exports.SUSPEND = 'suspend';
        module.exports.STALLED = 'stalled';

        module.exports.AuthKeyExpiredEvent = 'authkeyexpired';

        module.exports.DRMKeySystem = {
          4: 'com.microsoft.playready',
          5: 'com.widevine.alpha',
        };

        module.exports.EncryptionType = {
          Private: 1,
          Standard: 2,
          ChinaDRM: 3,
          PlayReady: 4,
          Widevine: 5,
        };

        module.exports.DRMType = {
          Widevine: 'Widevine',
          PlayReady: 'PlayReady',
        };

        module.exports.ErrorCode = {
          InvalidParameter: 4001, //参数不合理
          AuthKeyExpired: 4002, //鉴权过期
          InvalidSourceURL: 4003, //无效地址
          NotFoundSourceURL: 4004, //地址不存在
          StartLoadData: 4005, //开始下载数据错误
          LoadedMetadata: 4006, //开始下载元数据数据错误
          PlayingError: 4007, //播放时错误
          LoadingTimeout: 4008, //加载超时
          RequestDataError: 4009, //请求数据错误
          EncrptyVideoNotSupport: 4010, //不支持加密视频播放
          FormatNotSupport: 4011, //播放格式不支持
          PlayauthDecode: 4012, //playauth解析错误
          PlayDataDecode: 4013, //播放数据解码错误 MEDIA_ERR_DECODE
          NetworkUnavaiable: 4014, //网络不可用
          UserAbort: 4015, //获取数据过程被中止 MEDIA_ERR_ABORTED
          NetworkError: 4016, //网络错误加载数据失败MEDIA_ERR_NETWORK
          URLsIsEmpty: 4017, //返回的播放地址为空
          CrossDomain: 4027, //跨越错误
          OtherError: 4400, //未知错误
          ServerAPIError: 4500, //服务端请求错误哦
        };

        module.exports.AuthKeyExpired = 7200;
        module.exports.AuthKeyRefreshExpired = 7000;
        module.exports.AuthInfoExpired = 100;

        module.exports.VideoErrorCode = {
          1: 4015,
          2: 4016,
          3: 4013,
          4: 4400,
        };

        module.exports.IconType = {
          FontClass: 'fontclass',
          Symbol: 'symbol',
          Sprite: 'Sprite',
        };

        module.exports.SelectedStreamLevel = 'selectedStreamLevel';

        module.exports.WidthMapToLevel = {
          '0': 'OD',
          '640': 'FD',
          '960': 'LD',
          '1280': 'SD',
          '1920': 'HD',
          '2580': '2K',
          '3840': '4K',
        };

        var updateByLanguage = function() {
          module.exports.VideoErrorCodeText = {
            1: lang.get('Error_Load_Abort_Text'),
            2: lang.get('Error_Network_Text'), //A network error caused the video download to fail part-way
            3: lang.get('Error_Decode_Text'), //due to a corruption problem or because the video used features your browser did not support.
            4: lang.get('Error_Server_Network_NotSupport_Text'), //because the server or network failed or because the format is not supported.
          };
          module.exports.VideoLevels = {
            '0': lang.get('OD'),
            '640': lang.get('FD'),
            '960': lang.get('LD'),
            '1280': lang.get('SD'),
            '1920': lang.get('HD'),
            '2580': lang.get('2K'),
            '3840': lang.get('4K'),
          };
          module.exports.QualityLevels = {
            OD: lang.get('OD'),
            LD: lang.get('LD'),
            FD: lang.get('FD'),
            SD: lang.get('SD'),
            HD: lang.get('HD'),
            '2K': lang.get('2K'),
            '4K': lang.get('4K'),
            XLD: lang.get('XLD'),
            FHD: lang.get('FHD'),
          };

          module.exports.SpeedLevels = [
            { key: 0.125, text: lang.get('Speed_0125X_Text') },
            { key: 0.25, text: lang.get('Speed_025X_Text') },
            { key: 0.5, text: lang.get('Speed_05X_Text') },
            { key: 1, text: lang.get('Speed_1X_Text') },
            { key: 2, text: lang.get('Speed_125X_Text') },
            { key: 3, text: lang.get('Speed_15X_Text') },
            { key: 4, text: lang.get('Speed_2X_Text') },
          ];
        };

        updateByLanguage();

        module.exports.updateByLanguage = updateByLanguage;
      },
      { '../lang/index': 17 },
    ],
    22: [
      function(require, module, exports) {
        module.exports.get = function(cname) {
          var name = cname + '';
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) {
              return unescape(c.substring(name.length + 1, c.length));
            }
          }
          return '';
        };

        module.exports.set = function(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
          var expires = 'expires=' + d.toGMTString();
          document.cookie = cname + '=' + escape(cvalue) + '; ' + expires;
        };
      },
      {},
    ],
    23: [
      function(require, module, exports) {
        var _ = require('./object');

        /**
         * Element Data Store. Allows for binding data to an element without putting it directly on the element.
         * Ex. Event listneres are stored here.
         * (also from jsninja.com, slightly modified and updated for closure compiler)
         * @type {Object}
         * @private
         */
        module.exports.cache = {};

        /**
         * Unique ID for an element or function
         * @type {Number}
         * @private
         */
        module.exports.guid = function(len, radix) {
          var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
          var uuid = [],
            i;
          radix = radix || chars.length;

          if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
          } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
              if (!uuid[i]) {
                r = 0 | (Math.random() * 16);
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
              }
            }
          }

          return uuid.join('');
        };

        /**
         * Unique attribute name to store an element's guid in
         * @type {String}
         * @constant
         * @private
         */
        module.exports.expando = 'vdata' + new Date().getTime();

        /**
         * Returns the cache object where data for an element is stored
         * @param  {Element} el Element to store data for.
         * @return {Object}
         * @private
         */
        module.exports.getData = function(el) {
          var id = el[module.exports.expando];
          if (!id) {
            id = el[module.exports.expando] = module.exports.guid();
            module.exports.cache[id] = {};
          }
          return module.exports.cache[id];
        };

        /**
         * Returns the cache object where data for an element is stored
         * @param  {Element} el Element to store data for.
         * @return {Object}
         * @private
         */
        module.exports.hasData = function(el) {
          var id = el[module.exports.expando];
          return !(!id || _.isEmpty(module.exports.cache[id]));
        };

        /**
         * Delete data for the element from the cache and the guid attr from getElementById
         * @param  {Element} el Remove data for an element
         * @private
         */
        module.exports.removeData = function(el) {
          var id = el[module.exports.expando];
          if (!id) {
            return;
          }
          // Remove all stored data
          // Changed to = null
          // http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
          // module.exports.cache[id] = null;
          delete module.exports.cache[id];

          // Remove the expando property from the DOM node
          try {
            delete el[module.exports.expando];
          } catch (e) {
            if (el.removeAttribute) {
              el.removeAttribute(module.exports.expando);
            } else {
              // IE doesn't appear to support removeAttribute on the document element
              el[module.exports.expando] = null;
            }
          }
        };
      },
      { './object': 32 },
    ],
    24: [
      function(require, module, exports) {
        /**
         * @fileoverview 封装对dom元素的基本操作
         */

        var _ = require('./object');

        /**
         * 根据id获取dom
         */
        module.exports.el = function(id) {
          return document.getElementById(id);
        };

        /**
         * Creates an element and applies properties.
         * @param  {String=} tagName    Name of tag to be created.
         * @param  {Object=} properties Element properties to be applied.
         * @return {Element}
         * @private
         */
        module.exports.createEl = function(tagName, properties) {
          var el;

          tagName = tagName || 'div';
          properties = properties || {};

          el = document.createElement(tagName);

          _.each(properties, function(propName, val) {
            // Not remembering why we were checking for dash
            // but using setAttribute means you have to use getAttribute

            // The check for dash checks for the aria-* attributes, like aria-label, aria-valuemin.
            // The additional check for "role" is because the default method for adding attributes does not
            // add the attribute "role". My guess is because it's not a valid attribute in some namespaces, although
            // browsers handle the attribute just fine. The W3C allows for aria-* attributes to be used in pre-HTML5 docs.
            // http://www.w3.org/TR/wai-aria-primer/#ariahtml. Using setAttribute gets around this problem.
            if (propName.indexOf('aria-') !== -1 || propName == 'role') {
              el.setAttribute(propName, val);
            } else {
              el[propName] = val;
            }
          });

          return el;
        };

        /**
         * Add a CSS class name to an element
         * @param {Element} element    Element to add class name to
         * @param {String} classToAdd Classname to add
         * @private
         */
        module.exports.addClass = function(element, classToAdd) {
          if ((' ' + element.className + ' ').indexOf(' ' + classToAdd + ' ') == -1) {
            element.className =
              element.className === '' ? classToAdd : element.className + ' ' + classToAdd;
          }
        };

        /**
         * Remove a CSS class name from an element
         * @param {Element} element    Element to remove from class name
         * @param {String} classToAdd Classname to remove
         * @private
         */
        module.exports.removeClass = function(element, classToRemove) {
          var classNames, i;

          if (element.className.indexOf(classToRemove) == -1) {
            return;
          }

          classNames = element.className.split(' ');

          // no arr.indexOf in ie8, and we don't want to add a big shim
          for (i = classNames.length - 1; i >= 0; i--) {
            if (classNames[i] === classToRemove) {
              classNames.splice(i, 1);
            }
          }

          element.className = classNames.join(' ');
        };

        /**
         * Query a CSS class name for an element
         * @param {Element} element    Element to remove from class name
         * @param {String} classToAdd Classname to remove
         * @private
         */
        module.exports.hasClass = function(element, queryClassName) {
          var classNames, i;

          if (element.className.indexOf(queryClassName) == -1) {
            return false;
          }

          return true;
        };

        /**
         * get CSS class name for an element
         * @param {Element} element    Element to remove from class name
         * @param {String} classToAdd Classname to remove
         * @private
         */
        module.exports.getClasses = function(element) {
          if (!element.className) {
            return [];
          }

          return element.className.split(' ');
        };

        /**
         *
         */
        module.exports.getElementAttributes = function(tag) {
          var obj, knownBooleans, attrs, attrName, attrVal;

          obj = {};

          // known boolean attributes
          // we can check for matching boolean properties, but older browsers
          // won't know about HTML5 boolean attributes that we still read from
          knownBooleans = ',' + 'autoplay,controls,loop,muted,default' + ',';

          if (tag && tag.attributes && tag.attributes.length > 0) {
            attrs = tag.attributes;

            for (var i = attrs.length - 1; i >= 0; i--) {
              attrName = attrs[i].name;
              attrVal = attrs[i].value;

              // check for known booleans
              // the matching element property will return a value for typeof
              if (
                typeof tag[attrName] === 'boolean' ||
                knownBooleans.indexOf(',' + attrName + ',') !== -1
              ) {
                // the value of an included boolean attribute is typically an empty
                // string ('') which would equal false if we just check for a false value.
                // we also don't want support bad code like autoplay='false'
                attrVal = attrVal !== null ? true : false;
              }

              obj[attrName] = attrVal;
            }
          }

          return obj;
        };
        /*

*/
        module.exports.insertFirst = function(child, parent) {
          if (parent.firstChild) {
            parent.insertBefore(child, parent.firstChild);
          } else {
            parent.appendChild(child);
          }
        };

        // Attempt to block the ability to select text while dragging controls
        module.exports.blockTextSelection = function() {
          document.body.focus();
          document.onselectstart = function() {
            return false;
          };
        };
        // Turn off text selection blocking
        module.exports.unblockTextSelection = function() {
          document.onselectstart = function() {
            return true;
          };
        };

        /**
         * 设置或获取css属性
         */
        module.exports.css = function(el, cssName, cssVal) {
          if (!el || !el.style) return false;

          if (cssName && cssVal) {
            el.style[cssName] = cssVal;
            return true;
          } else if (!cssVal && typeof cssName === 'string') {
            return el.style[cssName];
          } else if (!cssVal && typeof cssName === 'object') {
            _.each(cssName, function(k, v) {
              el.style[k] = v;
            });
            return true;
          }

          return false;
        };

        module.exports.getTransformName = function(tag) {
          /* Array of possible browser specific settings for transformation */
          var properties = [
              'transform',
              'WebkitTransform',
              'MozTransform',
              'msTransform',
              'OTransform',
            ],
            prop = properties[0];

          /* Iterators and stuff */

          var i, j, t;

          /* Find out which CSS transform the browser supports */
          for (i = 0, j = properties.length; i < j; i++) {
            if (typeof tag.style[properties[i]] !== 'undefined') {
              prop = properties[i];
              break;
            }
          }
          return prop;
        };

        module.exports.getTransformEventName = function(tag, eventName) {
          /* Array of possible browser specific settings for transformation */
          var properties = ['', 'Webkit', 'Moz', 'ms', 'O'],
            event = eventName.toLowerCase();

          var transitions = [
            'transform',
            'WebkitTransform',
            'MozTransform',
            'msTransform',
            'OTransform',
          ];

          /* Iterators and stuff */

          var i, j, t;

          /* Find out which CSS transform the browser supports */
          for (i = 0, j = transitions.length; i < j; i++) {
            if (typeof tag.style[transitions[i]] !== 'undefined') {
              if (i != 0) {
                event = properties[i] + eventName;
              }
              break;
            }
          }
          return event;
        };

        module.exports.addCssByStyle = function(cssString) {
          var doc = document;
          var style = doc.createElement('style');
          style.setAttribute('type', 'text/css');

          if (style.styleSheet) {
            // IE
            style.styleSheet.cssText = cssString;
          } else {
            // w3c
            var cssText = doc.createTextNode(cssString);
            style.appendChild(cssText);
          }

          var heads = doc.getElementsByTagName('head');
          if (heads.length) heads[0].appendChild(style);
          else doc.documentElement.appendChild(style);
        };

        module.exports.getTranslateX = function(ele) {
          var value = 0;
          if (ele) {
            try {
              var style = window.getComputedStyle(ele);
              var name = module.exports.getTransformName(ele);
              var matrix = new WebKitCSSMatrix(style[name]);
              value = matrix.m41;
            } catch (e) {
              console.log(e);
            }
          }
          return value;
        };
      },
      { './object': 32 },
    ],
    25: [
      function(require, module, exports) {
        var _ = require('./object');
        var Data = require('./data');
        var UA = require('./ua');
        var attachFastClick = require('fastclick');

        /**
         * @fileoverview Event System (John Resig - Secrets of a JS Ninja http://jsninja.com/)
         * (Original book version wasn't completely usable, so fixed some things and made Closure Compiler compatible)
         * This should work very similarly to jQuery's events, however it's based off the book version which isn't as
         * robust as jquery's, so there's probably some differences.
         */

        /**
         * Add an event listener to element
         * It stores the handler function in a separate cache object
         * and adds a generic handler to the element's event,
         * along with a unique id (guid) to the element.
         * @param  {Element|Object}   elem Element or object to bind listeners to
         * @param  {String|Array}   type Type of event to bind to.
         * @param  {Function} fn   Event listener.
         * @private
         */
        module.exports.on = function(elem, type, fn) {
          if (_.isArray(type)) {
            return _handleMultipleEvents(module.exports.on, elem, type, fn);
          }
          if (UA.IS_MOBILE && type == 'click') {
            attachFastClick(elem);
          }
          // if(type == 'click' && UA.IS_MOBILE)
          // {
          //   type = "touchstart";
          // }
          // else if(type == 'playclick')
          // {
          //   type = 'click';
          // }

          var data = Data.getData(elem);

          // We need a place to store all our handler data
          if (!data.handlers) data.handlers = {};

          if (!data.handlers[type]) data.handlers[type] = [];

          if (!fn.guid) fn.guid = Data.guid();

          data.handlers[type].push(fn);

          if (!data.dispatcher) {
            data.disabled = false;

            data.dispatcher = function(event) {
              if (data.disabled) return;
              event = module.exports.fixEvent(event);

              var handlers = data.handlers[event.type];

              if (handlers) {
                // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
                var handlersCopy = handlers.slice(0);

                for (var m = 0, n = handlersCopy.length; m < n; m++) {
                  if (event.isImmediatePropagationStopped()) {
                    break;
                  } else {
                    handlersCopy[m].call(elem, event);
                  }
                }
              }
            };
          }

          if (data.handlers[type].length == 1) {
            if (elem.addEventListener) {
              elem.addEventListener(type, data.dispatcher, false);
            } else if (elem.attachEvent) {
              elem.attachEvent('on' + type, data.dispatcher);
            }
          }
        };

        /**
         * Removes event listeners from an element
         * @param  {Element|Object}   elem Object to remove listeners from
         * @param  {String|Array=}   type Type of listener to remove. Don't include to remove all events from element.
         * @param  {Function} fn   Specific listener to remove. Don't incldue to remove listeners for an event type.
         * @private
         */
        module.exports.off = function(elem, type, fn) {
          // Don't want to add a cache object through getData if not needed
          if (!Data.hasData(elem)) return;

          var data = Data.getData(elem);

          // If no events exist, nothing to unbind
          if (!data.handlers) {
            return;
          }

          if (_.isArray(type)) {
            return _handleMultipleEvents(module.exports.off, elem, type, fn);
          }

          // Utility function
          var removeType = function(t) {
            data.handlers[t] = [];
            module.exports.cleanUpEvents(elem, t);
          };

          // Are we removing all bound events?
          if (!type) {
            for (var t in data.handlers) removeType(t);
            return;
          }

          var handlers = data.handlers[type];

          // If no handlers exist, nothing to unbind
          if (!handlers) return;

          // If no listener was provided, remove all listeners for type
          if (!fn) {
            removeType(type);
            return;
          }

          // We're only removing a single handler
          if (fn.guid) {
            for (var n = 0; n < handlers.length; n++) {
              if (handlers[n].guid === fn.guid) {
                handlers.splice(n--, 1);
              }
            }
          }

          module.exports.cleanUpEvents(elem, type);
        };

        /**
         * Clean up the listener cache and dispatchers
         * @param  {Element|Object} elem Element to clean up
         * @param  {String} type Type of event to clean up
         * @private
         */
        module.exports.cleanUpEvents = function(elem, type) {
          var data = Data.getData(elem);

          // Remove the events of a particular type if there are none left
          if (data.handlers[type].length === 0) {
            delete data.handlers[type];
            // data.handlers[type] = null;
            // Setting to null was causing an error with data.handlers

            // Remove the meta-handler from the element
            if (elem.removeEventListener) {
              elem.removeEventListener(type, data.dispatcher, false);
            } else if (elem.detachEvent) {
              elem.detachEvent('on' + type, data.dispatcher);
            }
          }

          // Remove the events object if there are no types left
          if (_.isEmpty(data.handlers)) {
            delete data.handlers;
            delete data.dispatcher;
            delete data.disabled;

            // data.handlers = null;
            // data.dispatcher = null;
            // data.disabled = null;
          }

          // Finally remove the expando if there is no data left
          if (_.isEmpty(data)) {
            Data.removeData(elem);
          }
        };

        /**
         * Fix a native event to have standard property values
         * @param  {Object} event Event object to fix
         * @return {Object}
         * @private
         */
        module.exports.fixEvent = function(event) {
          function returnTrue() {
            return true;
          }
          function returnFalse() {
            return false;
          }

          // Test if fixing up is needed
          // Used to check if !event.stopPropagation instead of isPropagationStopped
          // But native events return true for stopPropagation, but don't have
          // other expected methods like isPropagationStopped. Seems to be a problem
          // with the Javascript Ninja code. So we're just overriding all events now.
          if (!event || !event.isPropagationStopped) {
            var old = event || window.event;

            event = {};
            // Clone the old object so that we can modify the values event = {};
            // IE8 Doesn't like when you mess with native event properties
            // Firefox returns false for event.hasOwnProperty('type') and other props
            //  which makes copying more difficult.
            // TODO: Probably best to create a whitelist of event props
            for (var key in old) {
              // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
              // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
              if (key !== 'layerX' && key !== 'layerY' && key !== 'keyboardEvent.keyLocation') {
                // Chrome 32+ warns if you try to copy deprecated returnValue, but
                // we still want to if preventDefault isn't supported (IE8).
                if (!(key == 'returnValue' && old.preventDefault)) {
                  event[key] = old[key];
                }
              }
            }

            // The event occurred on this element
            if (!event.target) {
              event.target = event.srcElement || document;
            }

            // Handle which other element the event is related to
            event.relatedTarget =
              event.fromElement === event.target ? event.toElement : event.fromElement;

            // Stop the default browser action
            event.preventDefault = function() {
              if (old.preventDefault) {
                old.preventDefault();
              }
              event.returnValue = false;
              event.isDefaultPrevented = returnTrue;
              event.defaultPrevented = true;
            };

            event.isDefaultPrevented = returnFalse;
            event.defaultPrevented = false;

            // Stop the event from bubbling
            event.stopPropagation = function() {
              if (old.stopPropagation) {
                old.stopPropagation();
              }
              event.cancelBubble = true;
              event.isPropagationStopped = returnTrue;
            };

            event.isPropagationStopped = returnFalse;

            // Stop the event from bubbling and executing other handlers
            event.stopImmediatePropagation = function() {
              if (old.stopImmediatePropagation) {
                old.stopImmediatePropagation();
              }
              event.isImmediatePropagationStopped = returnTrue;
              event.stopPropagation();
            };

            event.isImmediatePropagationStopped = returnFalse;

            // Handle mouse position
            if (event.clientX != null) {
              var doc = document.documentElement,
                body = document.body;

              event.pageX =
                event.clientX +
                ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
                ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
              event.pageY =
                event.clientY +
                ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
                ((doc && doc.clientTop) || (body && body.clientTop) || 0);
            }

            // Handle key presses
            event.which = event.charCode || event.keyCode;

            // Fix button for mouse clicks:
            // 0 == left; 1 == middle; 2 == right
            if (event.button != null) {
              event.button = event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
            }
          }

          // Returns fixed-up instance
          return event;
        };

        /**
         * Trigger an event for an element
         * @param  {Element|Object}      elem  Element to trigger an event on
         * @param  {Event|Object|String} event A string (the type) or an event object with a type attribute
         * @private
         */
        module.exports.trigger = function(elem, event) {
          // Fetches element data and a reference to the parent (for bubbling).
          // Don't want to add a data object to cache for every parent,
          // so checking hasData first.

          var elemData = Data.hasData(elem) ? Data.getData(elem) : {};
          var parent = elem.parentNode || elem.ownerDocument;
          // type = event.type || event,
          // handler;

          // If an event name was passed as a string, creates an event out of it
          if (typeof event === 'string') {
            var paramData = null;
            if (elem.paramData || elem.paramData == 0) {
              paramData = elem.paramData;
              elem.paramData = null;
              elem.removeAttribute(paramData);
            }
            event = { type: event, target: elem, paramData: paramData };
          }
          // Normalizes the event properties.
          event = module.exports.fixEvent(event);

          // If the passed element has a dispatcher, executes the established handlers.
          if (elemData.dispatcher) {
            elemData.dispatcher.call(elem, event);
          }

          // Unless explicitly stopped or the event does not bubble (e.g. media events)
          // recursively calls this function to bubble the event up the DOM.
          if (parent && !event.isPropagationStopped() && event.bubbles !== false) {
            module.exports.trigger(parent, event);

            // If at the top of the DOM, triggers the default action unless disabled.
          } else if (!parent && !event.defaultPrevented) {
            var targetData = Data.getData(event.target);

            // Checks if the target has a default action for this event.
            if (event.target[event.type]) {
              // Temporarily disables event dispatching on the target as we have already executed the handler.
              targetData.disabled = true;
              // Executes the default action.
              if (typeof event.target[event.type] === 'function') {
                event.target[event.type]();
              }
              // Re-enables event dispatching.
              targetData.disabled = false;
            }
          }

          // Inform the triggerer if the default was prevented by returning false
          return !event.defaultPrevented;
        };

        /**
         * Trigger a listener only once for an event
         * @param  {Element|Object}   elem Element or object to
         * @param  {String|Array}   type
         * @param  {Function} fn
         * @private
         */
        module.exports.one = function(elem, type, fn) {
          if (_.isArray(type)) {
            return _handleMultipleEvents(module.exports.one, elem, type, fn);
          }
          var func = function() {
            module.exports.off(elem, type, func);
            fn.apply(this, arguments);
          };
          // copy the guid to the new function so it can removed using the original function's ID
          func.guid = fn.guid = fn.guid || Data.guid();
          module.exports.on(elem, type, func);
        };

        /**
         * Loops through an array of event types and calls the requested method for each type.
         * @param  {Function} fn   The event method we want to use.
         * @param  {Element|Object} elem Element or object to bind listeners to
         * @param  {String}   type Type of event to bind to.
         * @param  {Function} callback   Event listener.
         * @private
         */
        function _handleMultipleEvents(fn, elem, type, callback) {
          _.each(type, function(type) {
            fn(elem, type, callback); //Call the event method for each one of the types
          });
        }
      },
      { './data': 23, './object': 32, './ua': 38, fastclick: 7 },
    ],
    26: [
      function(require, module, exports) {
        var Data = require('./data');

        module.exports.bind = function(context, fn, uid) {
          // Make sure the function has a unique ID
          if (!fn.guid) {
            fn.guid = Data.guid();
          }

          // Create the new function that changes the context
          var ret = function() {
            return fn.apply(context, arguments);
          };

          // Allow for the ability to individualize this function
          // Needed in the case where multiple objects might share the same prototype
          // IF both items add an event listener with the same function, then you try to remove just one
          // it will remove both because they both have the same guid.
          // when using this, you need to use the bind method when you remove the listener as well.
          // currently used in text tracks
          ret.guid = uid ? uid + '_' + fn.guid : fn.guid;

          return ret;
        };
      },
      { './data': 23 },
    ],
    27: [
      function(require, module, exports) {
        // see https://tools.ietf.org/html/rfc1808

        var URL_REGEX = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/;
        var FIRST_SEGMENT_REGEX = /^([^\/;?#]*)(.*)$/;
        var SLASH_DOT_REGEX = /(?:\/|^)\.(?=\/)/g;
        var SLASH_DOT_DOT_REGEX = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g;

        var URLToolkit = {
          // jshint ignore:line
          // If opts.alwaysNormalize is true then the path will always be normalized even when it starts with / or //
          // E.g
          // With opts.alwaysNormalize = false (default, spec compliant)
          // http://a.com/b/cd + /e/f/../g => http://a.com/e/f/../g
          // With opts.alwaysNormalize = true (not spec compliant)
          // http://a.com/b/cd + /e/f/../g => http://a.com/e/g
          buildAbsoluteURL: function(baseURL, relativeURL, opts) {
            opts = opts || {};
            // remove any remaining space and CRLF
            baseURL = baseURL.trim();
            relativeURL = relativeURL.trim();
            if (!relativeURL) {
              // 2a) If the embedded URL is entirely empty, it inherits the
              // entire base URL (i.e., is set equal to the base URL)
              // and we are done.
              if (!opts.alwaysNormalize) {
                return baseURL;
              }
              var basePartsForNormalise = URLToolkit.parseURL(baseURL);
              if (!basePartsForNormalise) {
                throw new Error('Error trying to parse base URL.');
              }
              basePartsForNormalise.path = URLToolkit.normalizePath(basePartsForNormalise.path);
              return URLToolkit.buildURLFromParts(basePartsForNormalise);
            }
            var relativeParts = URLToolkit.parseURL(relativeURL);
            if (!relativeParts) {
              throw new Error('Error trying to parse relative URL.');
            }
            if (relativeParts.scheme) {
              // 2b) If the embedded URL starts with a scheme name, it is
              // interpreted as an absolute URL and we are done.
              if (!opts.alwaysNormalize) {
                return relativeURL;
              }
              relativeParts.path = URLToolkit.normalizePath(relativeParts.path);
              return URLToolkit.buildURLFromParts(relativeParts);
            }
            var baseParts = URLToolkit.parseURL(baseURL);
            if (!baseParts) {
              throw new Error('Error trying to parse base URL.');
            }
            if (!baseParts.netLoc && baseParts.path && baseParts.path[0] !== '/') {
              // If netLoc missing and path doesn't start with '/', assume everthing before the first '/' is the netLoc
              // This causes 'example.com/a' to be handled as '//example.com/a' instead of '/example.com/a'
              var pathParts = FIRST_SEGMENT_REGEX.exec(baseParts.path);
              baseParts.netLoc = pathParts[1];
              baseParts.path = pathParts[2];
            }
            if (baseParts.netLoc && !baseParts.path) {
              baseParts.path = '/';
            }
            var builtParts = {
              // 2c) Otherwise, the embedded URL inherits the scheme of
              // the base URL.
              scheme: baseParts.scheme,
              netLoc: relativeParts.netLoc,
              path: null,
              params: relativeParts.params,
              query: relativeParts.query,
              fragment: relativeParts.fragment,
            };
            if (!relativeParts.netLoc) {
              // 3) If the embedded URL's <net_loc> is non-empty, we skip to
              // Step 7.  Otherwise, the embedded URL inherits the <net_loc>
              // (if any) of the base URL.
              builtParts.netLoc = baseParts.netLoc;
              // 4) If the embedded URL path is preceded by a slash "/", the
              // path is not relative and we skip to Step 7.
              if (relativeParts.path[0] !== '/') {
                if (!relativeParts.path) {
                  // 5) If the embedded URL path is empty (and not preceded by a
                  // slash), then the embedded URL inherits the base URL path
                  builtParts.path = baseParts.path;
                  // 5a) if the embedded URL's <params> is non-empty, we skip to
                  // step 7; otherwise, it inherits the <params> of the base
                  // URL (if any) and
                  if (!relativeParts.params) {
                    builtParts.params = baseParts.params;
                    // 5b) if the embedded URL's <query> is non-empty, we skip to
                    // step 7; otherwise, it inherits the <query> of the base
                    // URL (if any) and we skip to step 7.
                    if (!relativeParts.query) {
                      builtParts.query = baseParts.query;
                    }
                  }
                } else {
                  // 6) The last segment of the base URL's path (anything
                  // following the rightmost slash "/", or the entire path if no
                  // slash is present) is removed and the embedded URL's path is
                  // appended in its place.
                  var baseURLPath = baseParts.path;
                  var newPath =
                    baseURLPath.substring(0, baseURLPath.lastIndexOf('/') + 1) + relativeParts.path;
                  builtParts.path = URLToolkit.normalizePath(newPath);
                }
              }
            }
            if (builtParts.path === null) {
              builtParts.path = opts.alwaysNormalize
                ? URLToolkit.normalizePath(relativeParts.path)
                : relativeParts.path;
            }
            return URLToolkit.buildURLFromParts(builtParts);
          },
          parseURL: function(url) {
            var parts = URL_REGEX.exec(url);
            if (!parts) {
              return null;
            }
            return {
              scheme: parts[1] || '',
              netLoc: parts[2] || '',
              path: parts[3] || '',
              params: parts[4] || '',
              query: parts[5] || '',
              fragment: parts[6] || '',
            };
          },
          normalizePath: function(path) {
            // The following operations are
            // then applied, in order, to the new path:
            // 6a) All occurrences of "./", where "." is a complete path
            // segment, are removed.
            // 6b) If the path ends with "." as a complete path segment,
            // that "." is removed.
            path = path
              .split('')
              .reverse()
              .join('')
              .replace(SLASH_DOT_REGEX, '');
            // 6c) All occurrences of "<segment>/../", where <segment> is a
            // complete path segment not equal to "..", are removed.
            // Removal of these path segments is performed iteratively,
            // removing the leftmost matching pattern on each iteration,
            // until no matching pattern remains.
            // 6d) If the path ends with "<segment>/..", where <segment> is a
            // complete path segment not equal to "..", that
            // "<segment>/.." is removed.
            while (path.length !== (path = path.replace(SLASH_DOT_DOT_REGEX, '')).length) {} // jshint ignore:line
            return path
              .split('')
              .reverse()
              .join('');
          },
          buildURLFromParts: function(parts) {
            return (
              parts.scheme + parts.netLoc + parts.path + parts.params + parts.query + parts.fragment
            );
          },
        };

        module.exports = URLToolkit;
      },
      {},
    ],
    28: [
      function(require, module, exports) {
        var DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/;
        var ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g;

        // adapted from https://github.com/kanongil/node-m3u8parse/blob/master/attrlist.js
        var AttrList = function(attrs) {
          if (typeof attrs === 'string') {
            attrs = this.parseAttrList(attrs);
          }
          for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
              this[attr] = attrs[attr];
            }
          }
        };

        AttrList.prototype = {
          decimalInteger: function(attrName) {
            var intValue = parseInt(this[attrName], 10);
            if (intValue > Number.MAX_SAFE_INTEGER) {
              return Infinity;
            }
            return intValue;
          },

          hexadecimalInteger: function(attrName) {
            if (this[attrName]) {
              var stringValue = (this[attrName] || '0x').slice(2);
              stringValue = (stringValue.length & 1 ? '0' : '') + stringValue;

              var value = new Uint8Array(stringValue.length / 2);
              for (var i = 0; i < stringValue.length / 2; i++) {
                value[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
              }
              return value;
            } else {
              return null;
            }
          },

          hexadecimalIntegerAsNumber: function(attrName) {
            var intValue = parseInt(this[attrName], 16);
            if (intValue > Number.MAX_SAFE_INTEGER) {
              return Infinity;
            }
            return intValue;
          },

          decimalFloatingPoint: function(attrName) {
            return parseFloat(this[attrName]);
          },

          enumeratedString: function(attrName) {
            return this[attrName];
          },

          decimalResolution: function(attrName) {
            var res = DECIMAL_RESOLUTION_REGEX.exec(this[attrName]);
            if (res === null) {
              return undefined;
            }
            return {
              width: parseInt(res[1], 10),
              height: parseInt(res[2], 10),
            };
          },

          parseAttrList: function(input) {
            var match,
              attrs = {};
            ATTR_LIST_REGEX.lastIndex = 0;
            while ((match = ATTR_LIST_REGEX.exec(input)) !== null) {
              var value = match[2],
                quote = '"';

              if (value.indexOf(quote) === 0 && value.lastIndexOf(quote) === value.length - 1) {
                value = value.slice(1, -1);
              }
              attrs[match[1]] = value;
            }
            return attrs;
          },
        };

        module.exports = AttrList;
      },
      {},
    ],
    29: [
      function(require, module, exports) {
        /**
         * hlsparse
         */

        var AttrList = require('./attrlist');
        var IO = require('../io');
        var URLToolkit = require('./URLToolkit');
        // https://regex101.com is your friend
        var MASTER_PLAYLIST_REGEX = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
        var MASTER_PLAYLIST_MEDIA_REGEX = /#EXT-X-MEDIA:(.*)/g;

        var LEVEL_PLAYLIST_REGEX_FAST = new RegExp(
          [
            /#EXTINF:(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, // duration (#EXTINF:<duration>,<title>), group 1 => duration, group 2 => title
            /|(?!#)(\S+)/.source, // segment URI, group 3 => the URI (note newline is not eaten)
            /|#EXT-X-BYTERANGE:*(.+)/.source, // next segment's byterange, group 4 => range spec (x@y)
            /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, // next segment's program date/time group 5 => the datetime spec
            /|#.*/.source, // All other non-segment oriented tags will match with all groups empty
          ].join(''),
          'g',
        );

        var LEVEL_PLAYLIST_REGEX_SLOW = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;

        var LevelKey = function() {
          this.method = null;
          this.key = null;
          this.iv = null;
          this._uri = null;
        };

        var Fragment = function() {
          this._url = null;
          this._byteRange = null;
          this._decryptdata = null;
          this.tagList = [];
        };

        Fragment.prototype.getUrl = function() {
          if (!this._url && this.relurl) {
            this._url = URLToolkit.buildAbsoluteURL(this.baseurl, this.relurl, {
              alwaysNormalize: true,
            });
          }
          return this._url;
        };

        Fragment.prototype.Seturl = function(value) {
          this._url = value;
        };

        Fragment.prototype.getProgramDateTime = function() {
          if (!this._programDateTime && this.rawProgramDateTime) {
            this._programDateTime = new Date(Date.parse(this.rawProgramDateTime));
          }
          return this._programDateTime;
        };

        Fragment.prototype.GetbyteRange = function() {
          if (!this._byteRange) {
            var byteRange = (this._byteRange = []);
            if (this.rawByteRange) {
              var params = this.rawByteRange.split('@', 2);
              if (params.length === 1) {
                var lastByteRangeEndOffset = this.lastByteRangeEndOffset;
                byteRange[0] = lastByteRangeEndOffset ? lastByteRangeEndOffset : 0;
              } else {
                byteRange[0] = parseInt(params[1]);
              }
              byteRange[1] = parseInt(params[0]) + byteRange[0];
            }
          }
          return this._byteRange;
        };

        Fragment.prototype.getByteRangeStartOffset = function() {
          return this.byteRange[0];
        };

        Fragment.prototype.getByteRangeEndOffset = function() {
          return this.byteRange[1];
        };
        /**
         * Utility method for parseLevelPlaylist to create an initialization vector for a given segment
         * @returns {Uint8Array}
         */
        var createInitializationVector = function(segmentNumber) {
          var uint8View = new Uint8Array(16);

          for (var i = 12; i < 16; i++) {
            uint8View[i] = (segmentNumber >> (8 * (15 - i))) & 0xff;
          }

          return uint8View;
        };
        /**
         * Utility method for parseLevelPlaylist to get a fragment's decryption data from the currently parsed encryption key data
         * @param levelkey - a playlist's encryption info
         * @param segmentNumber - the fragment's segment number
         * @returns {*} - an object to be applied as a fragment's decryptdata
         */
        var fragmentDecryptdataFromLevelkey = function(levelkey, segmentNumber) {
          var decryptdata = levelkey;

          if (levelkey && levelkey.method && levelkey.uri && !levelkey.iv) {
            decryptdata = new LevelKey();
            decryptdata.method = levelkey.method;
            decryptdata.baseuri = levelkey.baseuri;
            decryptdata.reluri = levelkey.reluri;
            decryptdata.iv = this.createInitializationVector(segmentNumber);
          }

          return decryptdata;
        };

        Fragment.prototype.getDecryptdata = function() {
          if (!this._decryptdata) {
            this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn);
          }
          return this._decryptdata;
        };

        var HlsParse = function() {
          this.loaders = {};
        };

        HlsParse.prototype = {
          parseMasterPlaylist: function(string, baseurl) {
            var levels = [],
              result;
            MASTER_PLAYLIST_REGEX.lastIndex = 0;
            while ((result = MASTER_PLAYLIST_REGEX.exec(string)) != null) {
              var level = {};

              var attrs = (level.attrs = new AttrList(result[1]));
              level.url = this.resolve(result[2], baseurl);

              var resolution = attrs.decimalResolution('RESOLUTION');
              if (resolution) {
                level.width = resolution.width;
                level.height = resolution.height;
              }
              level.bitrate =
                attrs.decimalInteger('AVERAGE-BANDWIDTH') || attrs.decimalInteger('BANDWIDTH');
              level.name = attrs.NAME;

              var codecs = attrs.CODECS;
              if (codecs) {
                codecs = codecs.split(/[ ,]+/);
                for (var i = 0; i < codecs.length; i++) {
                  var codec = codecs[i];
                  if (codec.indexOf('avc1') !== -1) {
                    level.videoCodec = this.avc1toavcoti(codec);
                  } else if (codec.indexOf('hvc1') !== -1) {
                    level.videoCodec = codec;
                  } else {
                    level.audioCodec = codec;
                  }
                }
              }

              levels.push(level);
            }
            return levels;
          },

          parseMasterPlaylistMedia: function(string, baseurl, type, audioCodec) {
            var result,
              medias = [],
              id = 0;
            MASTER_PLAYLIST_MEDIA_REGEX.lastIndex = 0;
            while ((result = MASTER_PLAYLIST_MEDIA_REGEX.exec(string)) != null) {
              var media = {};
              var attrs = new AttrList(result[1]);
              if (attrs.TYPE === type) {
                media.groupId = attrs['GROUP-ID'];
                media.name = attrs.NAME;
                media.type = type;
                media['default'] = attrs.DEFAULT === 'YES';
                media.autoselect = attrs.AUTOSELECT === 'YES';
                media.forced = attrs.FORCED === 'YES';
                if (attrs.URI) {
                  media.url = this.resolve(attrs.URI, baseurl);
                }
                media.lang = attrs.LANGUAGE;
                if (!media.name) {
                  media.name = media.lang;
                }
                if (audioCodec) {
                  media.audioCodec = audioCodec;
                }
                media.id = id++;
                medias.push(media);
              }
            }
            return medias;
          },

          avc1toavcoti: function(codec) {
            var result,
              avcdata = codec.split('.');
            if (avcdata.length > 2) {
              result = avcdata.shift() + '.';
              result += parseInt(avcdata.shift()).toString(16);
              result += ('000' + parseInt(avcdata.shift()).toString(16)).substr(-4);
            } else {
              result = codec;
            }
            return result;
          },

          parseLevelPlaylist: function(string, baseurl, id, type) {
            var currentSN = 0,
              totalduration = 0,
              level = {
                type: null,
                version: null,
                url: baseurl,
                fragments: [],
                live: true,
                startSN: 0,
              },
              levelkey = new LevelKey(),
              cc = 0,
              prevFrag = null,
              frag = new Fragment(),
              result,
              i;

            LEVEL_PLAYLIST_REGEX_FAST.lastIndex = 0;

            while ((result = LEVEL_PLAYLIST_REGEX_FAST.exec(string)) !== null) {
              var duration = result[1];
              if (duration) {
                // INF
                frag.duration = parseFloat(duration);
                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                var title = (' ' + result[2]).slice(1);
                frag.title = title ? title : null;
                frag.tagList.push(title ? ['INF', duration, title] : ['INF', duration]);
              } else if (result[3]) {
                // url
                if (!isNaN(frag.duration)) {
                  var sn = currentSN++;
                  frag.type = type;
                  frag.start = totalduration;
                  frag.levelkey = levelkey;
                  frag.sn = sn;
                  frag.level = id;
                  frag.cc = cc;
                  frag.baseurl = baseurl;
                  // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                  frag.relurl = (' ' + result[3]).slice(1);

                  level.fragments.push(frag);
                  prevFrag = frag;
                  totalduration += frag.duration;

                  frag = new Fragment();
                }
              } else if (result[4]) {
                // X-BYTERANGE
                frag.rawByteRange = (' ' + result[4]).slice(1);
                if (prevFrag) {
                  var lastByteRangeEndOffset = prevFrag.byteRangeEndOffset;
                  if (lastByteRangeEndOffset) {
                    frag.lastByteRangeEndOffset = lastByteRangeEndOffset;
                  }
                }
              } else if (result[5]) {
                // PROGRAM-DATE-TIME
                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                frag.rawProgramDateTime = (' ' + result[5]).slice(1);
                frag.tagList.push(['PROGRAM-DATE-TIME', frag.rawProgramDateTime]);
                if (level.programDateTime === undefined) {
                  level.programDateTime = new Date(
                    new Date(Date.parse(result[5])) - 1000 * totalduration,
                  );
                }
              } else {
                result = result[0].match(LEVEL_PLAYLIST_REGEX_SLOW);
                for (i = 1; i < result.length; i++) {
                  if (result[i] !== undefined) {
                    break;
                  }
                }

                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                var value1 = (' ' + result[i + 1]).slice(1);
                var value2 = (' ' + result[i + 2]).slice(1);

                switch (result[i]) {
                  case '#':
                    frag.tagList.push(value2 ? [value1, value2] : [value1]);
                    break;
                  case 'PLAYLIST-TYPE':
                    level.type = value1.toUpperCase();
                    break;
                  case 'MEDIA-SEQUENCE':
                    currentSN = level.startSN = parseInt(value1);
                    break;
                  case 'TARGETDURATION':
                    level.targetduration = parseFloat(value1);
                    break;
                  case 'VERSION':
                    level.version = parseInt(value1);
                    break;
                  case 'EXTM3U':
                    break;
                  case 'ENDLIST':
                    level.live = false;
                    break;
                  case 'DIS':
                    cc++;
                    frag.tagList.push(['DIS']);
                    break;
                  case 'DISCONTINUITY-SEQ':
                    cc = parseInt(value1);
                    break;
                  case 'KEY':
                    // https://tools.ietf.org/html/draft-pantos-http-live-streaming-08#section-3.4.4
                    var decryptparams = value1;
                    var keyAttrs = new AttrList(decryptparams);
                    var decryptmethod = keyAttrs.enumeratedString('METHOD'),
                      decrypturi = keyAttrs.URI,
                      decryptiv = keyAttrs.hexadecimalInteger('IV');
                    if (decryptmethod) {
                      levelkey = new LevelKey();
                      if (decrypturi && ['AES-128', 'SAMPLE-AES'].indexOf(decryptmethod) >= 0) {
                        levelkey.method = decryptmethod;
                        // URI to get the key
                        levelkey.baseuri = baseurl;
                        levelkey.reluri = decrypturi;
                        levelkey.key = null;
                        // Initialization Vector (IV)
                        levelkey.iv = decryptiv;
                      }
                    }
                    break;
                  case 'START':
                    var startParams = value1;
                    var startAttrs = new AttrList(startParams);
                    var startTimeOffset = startAttrs.decimalFloatingPoint('TIME-OFFSET');
                    //TIME-OFFSET can be 0
                    if (!isNaN(startTimeOffset)) {
                      level.startTimeOffset = startTimeOffset;
                    }
                    break;
                  case 'MAP':
                    var mapAttrs = new AttrList(value1);
                    frag.relurl = mapAttrs.URI;
                    frag.rawByteRange = mapAttrs.BYTERANGE;
                    frag.baseurl = baseurl;
                    frag.level = id;
                    frag.type = type;
                    frag.sn = 'initSegment';
                    level.initSegment = frag;
                    frag = new Fragment();
                    break;
                  default:
                    console.log('line parsed but not handled: result');
                    break;
                }
              }
            }
            frag = prevFrag;
            //logger.log('found ' + level.fragments.length + ' fragments');
            if (frag && !frag.relurl) {
              level.fragments.pop();
              totalduration -= frag.duration;
            }
            level.totalduration = totalduration;
            level.averagetargetduration = totalduration / level.fragments.length;
            level.endSN = currentSN - 1;
            return level;
          },

          load: function(url, callback) {
            var that = this;
            IO.get(
              url,
              function(string) {
                var levels = that.parseMasterPlaylist(string, url);
                // multi level playlist, parse level info
                if (levels.length) {
                  var audioTracks = that.parseMasterPlaylistMedia(
                    string,
                    url,
                    'AUDIO',
                    levels[0].audioCodec,
                  );
                  var subtitles = that.parseMasterPlaylistMedia(string, url, 'SUBTITLES');
                  if (audioTracks.length) {
                    // check if we have found an audio track embedded in main playlist (audio track without URI attribute)
                    var embeddedAudioFound = false;
                    audioTracks.forEach(function(audioTrack) {
                      if (!audioTrack.url) {
                        embeddedAudioFound = true;
                      }
                    });
                    // if no embedded audio track defined, but audio codec signaled in quality level, we need to signal this main audio track
                    // this could happen with playlists with alt audio rendition in which quality levels (main) contains both audio+video. but with mixed audio track not signaled
                    if (
                      embeddedAudioFound === false &&
                      levels[0].audioCodec &&
                      !levels[0].attrs.AUDIO
                    ) {
                      console.log(
                        'audio codec signaled in quality level, but no embedded audio track signaled, create one',
                      );
                      audioTracks.unshift({ type: 'main', name: 'main' });
                    }
                  }
                }
                callback({
                  levels: levels,
                  audioTracks: audioTracks,
                  subtitles: subtitles,
                  url: url,
                });
              },
              function(err) {
                console.log(err);
              },
            );
          },

          resolve: function(url, baseUrl) {
            return URLToolkit.buildAbsoluteURL(baseUrl, url, { alwaysNormalize: true });
          },

          parseMasterPlaylist: function(string, baseurl) {
            var levels = [],
              result;
            MASTER_PLAYLIST_REGEX.lastIndex = 0;
            while ((result = MASTER_PLAYLIST_REGEX.exec(string)) != null) {
              var level = {};

              var attrs = (level.attrs = new AttrList(result[1]));
              level.url = this.resolve(result[2], baseurl);

              var resolution = attrs.decimalResolution('RESOLUTION');
              if (resolution) {
                level.width = resolution.width;
                level.height = resolution.height;
              }
              level.bitrate =
                attrs.decimalInteger('AVERAGE-BANDWIDTH') || attrs.decimalInteger('BANDWIDTH');
              level.name = attrs.NAME;

              var codecs = attrs.CODECS;
              if (codecs) {
                codecs = codecs.split(/[ ,]+/);
                for (var i = 0; i < codecs.length; i++) {
                  var codec = codecs[i];
                  if (codec.indexOf('avc1') !== -1) {
                    level.videoCodec = this.avc1toavcoti(codec);
                  } else if (codec.indexOf('hvc1') !== -1) {
                    level.videoCodec = codec;
                  } else {
                    level.audioCodec = codec;
                  }
                }
              }

              levels.push(level);
            }
            return levels;
          },

          parseMasterPlaylistMedia: function(string, baseurl, type, audioCodec) {
            var result,
              medias = [],
              id = 0;
            MASTER_PLAYLIST_MEDIA_REGEX.lastIndex = 0;
            while ((result = MASTER_PLAYLIST_MEDIA_REGEX.exec(string)) != null) {
              var media = {};
              var attrs = new AttrList(result[1]);
              if (attrs.TYPE === type) {
                media.groupId = attrs['GROUP-ID'];
                media.name = attrs.NAME;
                media.type = type;
                media['default'] = attrs.DEFAULT === 'YES';
                media.autoselect = attrs.AUTOSELECT === 'YES';
                media.forced = attrs.FORCED === 'YES';
                if (attrs.URI) {
                  media.url = this.resolve(attrs.URI, baseurl);
                }
                media.lang = attrs.LANGUAGE;
                if (!media.name) {
                  media.name = media.lang;
                }
                if (audioCodec) {
                  media.audioCodec = audioCodec;
                }
                media.id = id++;
                medias.push(media);
              }
            }
            return medias;
          },

          avc1toavcoti: function(codec) {
            var result,
              avcdata = codec.split('.');
            if (avcdata.length > 2) {
              result = avcdata.shift() + '.';
              result += parseInt(avcdata.shift()).toString(16);
              result += ('000' + parseInt(avcdata.shift()).toString(16)).substr(-4);
            } else {
              result = codec;
            }
            return result;
          },

          parseLevelPlaylist: function(string, baseurl, id, type) {
            var currentSN = 0,
              totalduration = 0,
              level = {
                type: null,
                version: null,
                url: baseurl,
                fragments: [],
                live: true,
                startSN: 0,
              },
              levelkey = new LevelKey(),
              cc = 0,
              prevFrag = null,
              frag = new Fragment(),
              result,
              i;

            LEVEL_PLAYLIST_REGEX_FAST.lastIndex = 0;

            while ((result = LEVEL_PLAYLIST_REGEX_FAST.exec(string)) !== null) {
              var duration = result[1];
              if (duration) {
                // INF
                frag.duration = parseFloat(duration);
                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                var title = (' ' + result[2]).slice(1);
                frag.title = title ? title : null;
                frag.tagList.push(title ? ['INF', duration, title] : ['INF', duration]);
              } else if (result[3]) {
                // url
                if (!isNaN(frag.duration)) {
                  var sn = currentSN++;
                  frag.type = type;
                  frag.start = totalduration;
                  frag.levelkey = levelkey;
                  frag.sn = sn;
                  frag.level = id;
                  frag.cc = cc;
                  frag.baseurl = baseurl;
                  // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                  frag.relurl = (' ' + result[3]).slice(1);

                  level.fragments.push(frag);
                  prevFrag = frag;
                  totalduration += frag.duration;

                  frag = new Fragment();
                }
              } else if (result[4]) {
                // X-BYTERANGE
                frag.rawByteRange = (' ' + result[4]).slice(1);
                if (prevFrag) {
                  var lastByteRangeEndOffset = prevFrag.byteRangeEndOffset;
                  if (lastByteRangeEndOffset) {
                    frag.lastByteRangeEndOffset = lastByteRangeEndOffset;
                  }
                }
              } else if (result[5]) {
                // PROGRAM-DATE-TIME
                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                frag.rawProgramDateTime = (' ' + result[5]).slice(1);
                frag.tagList.push(['PROGRAM-DATE-TIME', frag.rawProgramDateTime]);
                if (level.programDateTime === undefined) {
                  level.programDateTime = new Date(
                    new Date(Date.parse(result[5])) - 1000 * totalduration,
                  );
                }
              } else {
                result = result[0].match(LEVEL_PLAYLIST_REGEX_SLOW);
                for (i = 1; i < result.length; i++) {
                  if (result[i] !== undefined) {
                    break;
                  }
                }

                // avoid sliced strings    https://github.com/video-dev/hls.js/issues/939
                var value1 = (' ' + result[i + 1]).slice(1);
                var value2 = (' ' + result[i + 2]).slice(1);

                switch (result[i]) {
                  case '#':
                    frag.tagList.push(value2 ? [value1, value2] : [value1]);
                    break;
                  case 'PLAYLIST-TYPE':
                    level.type = value1.toUpperCase();
                    break;
                  case 'MEDIA-SEQUENCE':
                    currentSN = level.startSN = parseInt(value1);
                    break;
                  case 'TARGETDURATION':
                    level.targetduration = parseFloat(value1);
                    break;
                  case 'VERSION':
                    level.version = parseInt(value1);
                    break;
                  case 'EXTM3U':
                    break;
                  case 'ENDLIST':
                    level.live = false;
                    break;
                  case 'DIS':
                    cc++;
                    frag.tagList.push(['DIS']);
                    break;
                  case 'DISCONTINUITY-SEQ':
                    cc = parseInt(value1);
                    break;
                  case 'KEY':
                    // https://tools.ietf.org/html/draft-pantos-http-live-streaming-08#section-3.4.4
                    var decryptparams = value1;
                    var keyAttrs = new AttrList(decryptparams);
                    var decryptmethod = keyAttrs.enumeratedString('METHOD'),
                      decrypturi = keyAttrs.URI,
                      decryptiv = keyAttrs.hexadecimalInteger('IV');
                    if (decryptmethod) {
                      levelkey = new LevelKey();
                      if (decrypturi && ['AES-128', 'SAMPLE-AES'].indexOf(decryptmethod) >= 0) {
                        levelkey.method = decryptmethod;
                        // URI to get the key
                        levelkey.baseuri = baseurl;
                        levelkey.reluri = decrypturi;
                        levelkey.key = null;
                        // Initialization Vector (IV)
                        levelkey.iv = decryptiv;
                      }
                    }
                    break;
                  case 'START':
                    var startParams = value1;
                    var startAttrs = new AttrList(startParams);
                    var startTimeOffset = startAttrs.decimalFloatingPoint('TIME-OFFSET');
                    //TIME-OFFSET can be 0
                    if (!isNaN(startTimeOffset)) {
                      level.startTimeOffset = startTimeOffset;
                    }
                    break;
                  case 'MAP':
                    var mapAttrs = new AttrList(value1);
                    frag.relurl = mapAttrs.URI;
                    frag.rawByteRange = mapAttrs.BYTERANGE;
                    frag.baseurl = baseurl;
                    frag.level = id;
                    frag.type = type;
                    frag.sn = 'initSegment';
                    level.initSegment = frag;
                    frag = new Fragment();
                    break;
                  default:
                    console.log('line parsed but not handled: ' + result);
                    break;
                }
              }
            }
            frag = prevFrag;
            //logger.log('found ' + level.fragments.length + ' fragments');
            if (frag && !frag.relurl) {
              level.fragments.pop();
              totalduration -= frag.duration;
            }
            level.totalduration = totalduration;
            level.averagetargetduration = totalduration / level.fragments.length;
            level.endSN = currentSN - 1;
            return level;
          },
        };

        module.exports = HlsParse;
      },
      { '../io': 30, './URLToolkit': 27, './attrlist': 28 },
    ],
    30: [
      function(require, module, exports) {
        var Url = require('./url');

        /**
         * Simple http request for retrieving external files (e.g. text tracks)
         * @param  {String}    url             URL of resource
         * @param  {Function} onSuccess       Success callback
         * @param  {Function=} onError         Error callback
         * @param  {Boolean=}   withCredentials Flag which allow credentials
         * @private
         */
        module.exports.get = function(url, onSuccess, onError, asyncValue, withCredentials) {
          var data = {};
          module.exports.ajax('GET', url, data, onSuccess, onError, asyncValue, withCredentials);
        };

        /**
         * Simple http request for retrieving external files (e.g. text tracks)
         * @param  {String}    url             URL of resource
         * @param  {Function} onSuccess       Success callback
         * @param  {Function=} onError         Error callback
         * @param  {Boolean=}   withCredentials Flag which allow credentials
         * @private
         */
        module.exports.post = function(url, data, onSuccess, onError, asyncValue, withCredentials) {
          var headers = {};
          headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
          headers['Accept'] = 'application/json';
          // headers["SOAPAction"] = '"http://schemas.microsoft.com/DRM/2007/03/protocols/AcquireLicense"';
          // headers["Content-Type"] = "text/xml; charset=utf-8";
          module.exports.ajax(
            'POST',
            url,
            data,
            onSuccess,
            onError,
            asyncValue,
            withCredentials,
            headers,
          );
        };

        /**
         * Simple http request for retrieving external files (e.g. text tracks)
         * @param  {String}    url             URL of resource
         * @param  {Function} onSuccess       Success callback
         * @param  {Function=} onError         Error callback
         * @param  {Boolean=}   withCredentials Flag which allow credentials
         * @private
         */
        module.exports.ajax = function(
          type,
          url,
          data,
          onSuccess,
          onError,
          asyncValue,
          withCredentials,
          headers,
        ) {
          var fileUrl, request, urlInfo, winLoc, crossOrigin;

          onError = onError || function() {};

          if (typeof XMLHttpRequest === 'undefined') {
            // Shim XMLHttpRequest for older IEs
            window.XMLHttpRequest = function() {
              try {
                return new window.ActiveXObject('Msxml2.XMLHTTP.6.0');
              } catch (e) {}
              try {
                return new window.ActiveXObject('Msxml2.XMLHTTP.3.0');
              } catch (f) {}
              try {
                return new window.ActiveXObject('Msxml2.XMLHTTP');
              } catch (g) {}
              throw new Error('This browser does not support XMLHttpRequest.');
            };
          }

          request = new XMLHttpRequest();

          urlInfo = Url.parseUrl(url);
          winLoc = window.location;
          // check if url is for another domain/origin
          // ie8 doesn't know location.origin, so we won't rely on it here
          crossOrigin = urlInfo.protocol + urlInfo.host !== winLoc.protocol + winLoc.host;

          // Use XDomainRequest for IE if XMLHTTPRequest2 isn't available
          // 'withCredentials' is only available in XMLHTTPRequest2
          // Also XDomainRequest has a lot of gotchas, so only use if cross domain
          if (crossOrigin && window.XDomainRequest && !('withCredentials' in request)) {
            request = new window.XDomainRequest();
            request.onload = function() {
              onSuccess(request.responseText);
            };
            request.onerror = onError;
            // these blank handlers need to be set to fix ie9 http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
            request.onprogress = function() {};
            request.ontimeout = onError;

            // XMLHTTPRequest
          } else {
            fileUrl = urlInfo.protocol == 'file:' || winLoc.protocol == 'file:';

            request.onreadystatechange = function() {
              if (request.readyState === 4) {
                if (request.status === 200 || (fileUrl && request.status === 0)) {
                  onSuccess(request.responseText);
                } else {
                  onError(request.responseText);
                }
              }
            };
          }

          // open the connection
          try {
            // Third arg is async, or ignored by XDomainRequest
            if (typeof asyncValue == 'undefined') {
              asyncValue = true;
            }
            request.open(type, url, asyncValue);
            // withCredentials only supported by XMLHttpRequest2
            if (withCredentials) {
              request.withCredentials = true;
            }

            if (headers) {
              for (var key in headers) {
                request.setRequestHeader(key, headers[key]);
              }
            }
          } catch (e) {
            onError(e);
            return;
          }

          // send the request
          try {
            request.send(data);
          } catch (e) {
            onError(e);
          }
        };

        /**
         * jsonp请求
         */
        module.exports.jsonp = function(url, onSuccess, onError) {
          var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
          var script = document.createElement('script');
          if (!url) {
            return;
          }
          script.src =
            url +
            (url.indexOf('?') >= 0 ? '&' : '?') +
            'callback=' +
            callbackName +
            '&' +
            'cb=' +
            callbackName;
          script.onerror = function() {
            delete window[callbackName];
            document.body.removeChild(script);
            onError();
          };
          // 防止接口返回不支持jsonp时的script标签堆积
          script.onload = function() {
            setTimeout(function() {
              if (window[callbackName]) {
                delete window[callbackName];
                document.body.removeChild(script);
              }
            }, 0);
          };

          window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            onSuccess(data);
          };

          document.body.appendChild(script);
        };

        module.exports.loadJS = function(url, callback) {
          var oHead = document.getElementsByTagName('HEAD').item(0);
          var oScript = document.createElement('script');
          oScript.type = 'text/javascript';
          oScript.src = url;
          oScript.onload = function() {
            if (callback) callback();
          };
          oHead.appendChild(oScript);
        };
      },
      { './url': 39 },
    ],
    31: [
      function(require, module, exports) {
        /**
         * @fileoverview 根据配置渲染ui组件在父级组件中的layout
         * @author 首作<aloysious.ld@taobao.com>
         * @date 2015-01-12
         *
         * ui组件与layout相关的配置项
         * align {String}   'cc'  绝对居中
         *                | 'tl'  左上对齐，组件向左浮动，并以左上角作为偏移原点
         *                | 'tr'  右上对齐，组件向右浮动，并以右上角作为偏移原点
         *                | 'tlabs' 以左上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
         *                | 'trabs' 以右上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
         *                | 'blabs' 以左下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
         *                | 'brabs' 以右下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
         * x     {Number} x轴的偏移量，align为'cc'时无效
         * y     {Number} y轴的偏移量，align为'cc'时无效
         */

        var Dom = require('./dom');

        /**
         * 根据配置渲染dom元素的layout
         * @param el  {HTMLElement} dom元素
         * @param opt {Object}      layout配置对象
         */
        module.exports.render = function(el, opt) {
          var align = opt.align ? opt.align : 'tl',
            x = opt.x ? opt.x : 0,
            y = opt.y ? opt.y : 0,
            xunit = x.indexOf && x.indexOf('%') > 0 ? '' : 'px',
            yunit = y.indexOf && y.indexOf('%') > 0 ? '' : 'px';
          if (align === 'tl') {
            Dom.css(el, {
              float: 'left',
              'margin-left': x + xunit,
              'margin-top': y + yunit,
            });
          } else if (align === 'tr') {
            Dom.css(el, {
              float: 'right',
              'margin-right': x + xunit,
              'margin-top': y + yunit,
            });
          } else if (align === 'tlabs') {
            Dom.css(el, {
              position: 'absolute',
              left: x + xunit,
              top: y + yunit,
            });
          } else if (align === 'trabs') {
            Dom.css(el, {
              position: 'absolute',
              right: x + xunit,
              top: y + yunit,
            });
          } else if (align === 'blabs') {
            Dom.css(el, {
              position: 'absolute',
              left: x + xunit,
              bottom: y + yunit,
            });
          } else if (align === 'brabs') {
            Dom.css(el, {
              position: 'absolute',
              right: x + xunit,
              bottom: y + yunit,
            });
          } else if (align === 'cc') {
            Dom.css(el, {
              position: 'absolute',
              left: '50%',
              top: '50%',
              'margin-top': el.offsetHeight / -2 + 'px',
              'margin-left': el.offsetWidth / -2 + 'px',
            });
          }
        };
      },
      { './dom': 24 },
    ],
    32: [
      function(require, module, exports) {
        var hasOwnProp = Object.prototype.hasOwnProperty;
        /**
         * Object.create shim for prototypal inheritance
         *
         * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
         *
         * @function
         * @param  {Object}   obj Object to use as prototype
         * @private
         */
        module.exports.create =
          Object.create ||
          function(obj) {
            //Create a new function called 'F' which is just an empty object.
            function F() {}

            //the prototype of the 'F' function should point to the
            //parameter of the anonymous function.
            F.prototype = obj;

            //create a new constructor function based off of the 'F' function.
            return new F();
          };

        /**
         * Loop through each property in an object and call a function
         * whose arguments are (key,value)
         * @param  {Object}   obj Object of properties
         * @param  {Function} fn  Function to be called on each property.
         * @this {*}
         * @private
         */

        module.exports.isArray = function(arr) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };

        module.exports.isEmpty = function(obj) {
          for (var prop in obj) {
            // Inlude null properties as empty.
            if (obj[prop] !== null) {
              return false;
            }
          }
          return true;
        };

        module.exports.each = function(obj, fn, context) {
          //
          if (module.exports.isArray(obj)) {
            for (var i = 0, len = obj.length; i < len; ++i) {
              if (fn.call(context || this, obj[i], i) === false) {
                break;
              }
            }
          } else {
            for (var key in obj) {
              if (hasOwnProp.call(obj, key)) {
                // if (key=="code") {
                //   console.log(obj);
                // };
                // console.log(key);
                // console.log(obj[key]);
                if (fn.call(context || this, key, obj[key]) === false) {
                  break;
                }
              }
            }
          }

          return obj;
        };

        /**
         * Merge two objects together and return the original.
         * @param  {Object} obj1
         * @param  {Object} obj2
         * @return {Object}
         * @private
         */
        module.exports.merge = function(obj1, obj2) {
          if (!obj2) {
            return obj1;
          }
          for (var key in obj2) {
            if (hasOwnProp.call(obj2, key)) {
              obj1[key] = obj2[key];
            }
          }
          return obj1;
        };

        /**
         * Merge two objects, and merge any properties that are objects
         * instead of just overwriting one. Uses to merge options hashes
         * where deeper default settings are important.
         * @param  {Object} obj1 Object to override
         * @param  {Object} obj2 Overriding object
         * @return {Object}      New object. Obj1 and Obj2 will be untouched.
         * @private
         */
        module.exports.deepMerge = function(obj1, obj2) {
          var key, val1, val2;

          // make a copy of obj1 so we're not ovewriting original values.
          // like prototype.options_ and all sub options objects
          obj1 = module.exports.copy(obj1);

          for (key in obj2) {
            if (hasOwnProp.call(obj2, key)) {
              val1 = obj1[key];
              val2 = obj2[key];

              // Check if both properties are pure objects and do a deep merge if so
              if (module.exports.isPlain(val1) && module.exports.isPlain(val2)) {
                obj1[key] = module.exports.deepMerge(val1, val2);
              } else {
                obj1[key] = obj2[key];
              }
            }
          }
          return obj1;
        };

        /**
         * Make a copy of the supplied object
         * @param  {Object} obj Object to copy
         * @return {Object}     Copy of object
         * @private
         */
        module.exports.copy = function(obj) {
          return module.exports.merge({}, obj);
        };

        /**
         * Check if an object is plain, and not a dom node or any object sub-instance
         * @param  {Object} obj Object to check
         * @return {Boolean}     True if plain, false otherwise
         * @private
         */
        module.exports.isPlain = function(obj) {
          return (
            !!obj &&
            typeof obj === 'object' &&
            obj.toString() === '[object Object]' &&
            obj.constructor === Object
          );
        };

        /**
         * Check if an object is Array
         *  Since instanceof Array will not work on arrays created in another frame we need to use Array.isArray, but since IE8 does not support Array.isArray we need this shim
         * @param  {Object} obj Object to check
         * @return {Boolean}     True if plain, false otherwise
         * @private
         */
        module.exports.isArray =
          Array.isArray ||
          function(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
          };

        module.exports.unescape = function(str) {
          return str.replace(/&([^;]+);/g, function(m, $1) {
            return (
              {
                amp: '&',
                lt: '<',
                gt: '>',
                quot: '"',
                '#x27': "'",
                '#x60': '`',
              }[$1.toLowerCase()] || m
            );
          });
        };
      },
      {},
    ],
    33: [
      function(require, module, exports) {
        var _ = require('./object');

        var oo = function() {};
        // Manually exporting module.exports['oo'] here for Closure Compiler
        // because of the use of the extend/create class methods
        // If we didn't do this, those functions would get flattend to something like
        // `a = ...` and `this.prototype` would refer to the global object instead of
        // oo

        var oo = function() {};
        /**
         * Create a new object that inherits from this Object
         *
         *     var Animal = oo.extend();
         *     var Horse = Animal.extend();
         *
         * @param {Object} props Functions and properties to be applied to the
         *                       new object's prototype
         * @return {module.exports.oo} An object that inherits from oo
         * @this {*}
         */
        oo.extend = function(props) {
          var init, subObj;

          props = props || {};
          // Set up the constructor using the supplied init method
          // or using the init of the parent object
          // Make sure to check the unobfuscated version for external libs
          init =
            props['init'] ||
            props.init ||
            this.prototype['init'] ||
            this.prototype.init ||
            function() {};
          // In Resig's simple class inheritance (previously used) the constructor
          //  is a function that calls `this.init.apply(arguments)`
          // However that would prevent us from using `ParentObject.call(this);`
          //  in a Child constuctor because the `this` in `this.init`
          //  would still refer to the Child and cause an inifinite loop.
          // We would instead have to do
          //    `ParentObject.prototype.init.apply(this, argumnents);`
          //  Bleh. We're not creating a _super() function, so it's good to keep
          //  the parent constructor reference simple.
          subObj = function() {
            init.apply(this, arguments);
          };

          // Inherit from this object's prototype
          subObj.prototype = _.create(this.prototype);
          // Reset the constructor property for subObj otherwise
          // instances of subObj would have the constructor of the parent Object
          subObj.prototype.constructor = subObj;

          // Make the class extendable
          subObj.extend = oo.extend;
          // Make a function for creating instances
          subObj.create = oo.create;

          // Extend subObj's prototype with functions and other properties from props
          for (var name in props) {
            if (props.hasOwnProperty(name)) {
              subObj.prototype[name] = props[name];
            }
          }

          return subObj;
        };

        /**
         * Create a new instace of this Object class
         *
         *     var myAnimal = Animal.create();
         *
         * @return {module.exports.oo} An instance of a oo subclass
         * @this {*}
         */
        oo.create = function() {
          // Create a new object that inherits from this object's prototype
          var inst = _.create(this.prototype);

          // Apply this constructor function to the new object
          this.apply(inst, arguments);

          // Return the new object
          return inst;
        };

        module.exports = oo;
      },
      { './object': 32 },
    ],
    34: [
      function(require, module, exports) {
        var _ = require('./object');
        var cfg = require('../config');
        var Dom = require('./dom');
        var Cookie = require('./cookie');
        var constants = require('./constants');
        var UA = require('./ua');
        var EmptyComponent = require('../player/base/plugin/defaultemptycomponent');

        /**
         * 默认的配置项
         */
        var defaultOpt = {
          preload: true, // 是否预加载
          autoplay: true, // 是否自动播放
          useNativeControls: false, // 是否使用默认的控制面板
          width: '100%', // 播放器宽度
          height: '300px', // 播放器高度
          cover: '', // 默认封面图
          from: '', // 渠道来源
          trackLog: true, // 是否需要打点
          isLive: false, // 是否直播状态
          playsinline: true, //是否启用在页面播放
          showBarTime: 5000,
          rePlay: false,
          liveRetry: 5,
          liveRetryInterval: 1,
          liveRetryStep: 0,
          format: '', //mp4, m3u8, flv,mpd
          definition: '', //视频流清晰度，多个用逗号分隔。取值范围：FD（流畅）LD（标清）SD（高清）HD（超清）OD（原画）2K（2K）4K（4K）
          defaultDefinition: '', // 默认清晰度
          loadDataTimeout: 20, //加载数据超时s
          waitingTimeout: 60, //加载数据超时s
          controlBarForOver: false, //over出现controlbar
          controlBarVisibility: 'hover', //hover, always
          enableSystemMenu: false, //是否允许系统右键菜单显示
          qualitySort: 'asc', //用 desc 表示按倒序排序(即：从大到小排序)用 asc  表示按正序排序(即：从小到大排序)
          x5_video_position: 'normal', //top center normal
          x5_type: '', //h5 通过 video 属性 “x5-video-player-type” 声明启用同层H5播放器，支持的值：h5 https://x5.tencent.com/tbs/guide/video.html
          x5_fullscreen: false, //通过 video 属性 “x5-video-player-fullscreen” 声明视频播放时是否进入到 TBS 的全屏模式，支持的值：true
          x5_orientation: 'landscape|portrait', //通过 video 属性 “x5-video-orientation” 声明 TBS 播放器支持的方向，可选值：0（landscape 横屏）, 1：（portraint竖屏）, 2：（landscape | portrait跟随手机自动旋转）
          x5LandscapeAsFullScreen: true, //全屏是否横屏 // 视频id
          /* vid 淘宝视频的视频id，必填 */ autoPlayDelay: 0, //延迟多少s以后开始播放， autoplay属性需要设置为false
          autoPlayDelayDisplayText: '', //延迟播放提示文字
          useHlsPluginForSafari: false, //
          enableMSEForAndroid: true,
          language: 'zh-cn',
          languageTexts: {},
          mediaType: 'video', //可选，取值video, audio,
          components: [],
          liveTimeShiftUrl: '',
          liveShiftSource: '',
          liveShiftTime: '',
          videoHeight: '100%',
          videoWidth: '100%',
          enableWorker: true,
          enableMockFullscreen: false,
          debug: false,
          snapshotWatermark: {
            left: '500',
            top: '100',
            text: '',
            font: '16px 宋体',
            fillColor: '#FFFFFF',
            strokeColor: '#FFFFFF',
          },
          hlsFragChangedEmpty: true,
          liveStartTime: '',
          liveOverTime: '',
          enableStashBufferForFlv: true, //是否启用播放缓存，只在直播下起作用
          stashInitialSizeForFlv: 32, //初始缓存大小，只在直播下起作用
          flvOption: {},
          hlsLoadingTimeOut: 20000, //对于hls插件播放起作用，毫秒
          nudgeMaxRetry: 5,
          tracks: [], //{kind:"thumbnails", url:""}
          recreatePlayer: function() {},
          diagnosisButtonVisible: true, //检测按钮是否显示
          ai: {
            label: false, //AI打标
            meta: {
              url: 'http://172.19.61.105:8085/meta/query',
              getMeta: '', //function
            },
            boxes: '',
            host: '',
            app: '',
            streamName: '',
            startDateTime: 0,
            waitMetaDataTime: 2,
            displayAttrs: {
              header: '姓名',
              证件号码: 'text',
              性别: 'text',
              年龄: 'text',
              发型: 'text',
              人脸大图: function(value) {},
              人脸小图: function(value) {},
            },
          },
          skinRes:
            '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/atlas/defaultSkin', // String, ui皮肤图片地址，非必填，不填使用默认，纯h5播放器可以不考虑这个字段
        };

        module.exports.defaultH5Layout = [
          // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
          { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
          {
            name: 'H5Loading',
            align: 'cc',
          },
          { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
          // {name: "snapshot", align: "trabs", x: 10, y: "50%"},
          { name: 'infoDisplay' },
          { name: 'tooltip', align: 'blabs', x: 0, y: 56 },
          { name: 'thumbnail' },
          {
            name: 'controlBar',
            align: 'blabs',
            x: 0,
            y: 0,
            children: [
              { name: 'progress', align: 'blabs', x: 0, y: 44 },
              { name: 'playButton', align: 'tl', x: 15, y: 12 },
              { name: 'timeDisplay', align: 'tl', x: 10, y: 7 },
              { name: 'fullScreenButton', align: 'tr', x: 10, y: 12 },
              { name: 'subtitle', align: 'tr', x: 15, y: 12 },
              { name: 'setting', align: 'tr', x: 15, y: 12 },
              { name: 'volume', align: 'tr', x: 5, y: 10 },
            ],
          },
        ];

        module.exports.defaultAudioLayout = [
          {
            name: 'controlBar',
            align: 'blabs',
            x: 0,
            y: 0,
            children: [
              { name: 'progress', align: 'blabs', x: 0, y: 44 },
              { name: 'playButton', align: 'tl', x: 15, y: 12 },
              { name: 'timeDisplay', align: 'tl', x: 10, y: 7 },
              { name: 'volume', align: 'tr', x: 10, y: 10 },
            ],
          },
        ];

        module.exports.defaultFlashLayout = [
          // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
          { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
          {
            name: 'controlBar',
            align: 'blabs',
            x: 0,
            y: 0,
            children: [
              { name: 'progress', align: 'tlabs', x: 0, y: 0 },
              { name: 'playButton', align: 'tl', x: 15, y: 26 },
              { name: 'nextButton', align: 'tl', x: 10, y: 26 },
              { name: 'timeDisplay', align: 'tl', x: 10, y: 24 },
              { name: 'fullScreenButton', align: 'tr', x: 10, y: 25 },
              { name: 'streamButton', align: 'tr', x: 10, y: 23 },
              { name: 'volume', align: 'tr', x: 10, y: 25 },
            ],
          },
          {
            name: 'fullControlBar',
            align: 'tlabs',
            x: 0,
            y: 0,
            children: [
              { name: 'fullTitle', align: 'tl', x: 25, y: 6 },
              { name: 'fullNormalScreenButton', align: 'tr', x: 24, y: 13 },
              { name: 'fullTimeDisplay', align: 'tr', x: 10, y: 12 },
              { name: 'fullZoom', align: 'cc' },
            ],
          },
        ];

        module.exports.canPlayType = function(type) {
          var testEl = document.createElement('video');
          if (testEl.canPlayType) {
            return testEl.canPlayType(type);
          }
          return '';
        };

        module.exports.canPlayHls = function() {
          return module.exports.canPlayType('application/x-mpegURL') != '';
        };

        module.exports.isUsedHlsPluginOnMobile = function(used) {
          if (UA.IS_MOBILE && (UA.IS_CHROME || UA.IS_FIREFOX)) return true;
          else return false;
        };

        module.exports.isSafariUsedHlsPlugin = function(used) {
          if (UA.os.pc && UA.browser.safari && used)
            //&& UA.browser.version.indexOf('11.') < 0
            return true;
          else return false;
        };

        module.exports.hasUIComponent = function(skinLayout, name) {
          if (typeof skinLayout == 'undefined' || !skinLayout || skinLayout.length == 0) {
            return false;
          }
          var index = 0,
            length = skinLayout.length;
          for (index; index < length; index++) {
            var layoutName = skinLayout[index].name;
            if (layoutName == name) {
              return true;
            } else if (layoutName == 'controlBar') {
              return module.exports.hasUIComponent(skinLayout[index].children, name);
            }
          }
          return false;
        };

        module.exports.validateSource = function(source) {
          return true;
          if (source) {
            var patt1 = new RegExp('.m3u8|.mp4|.mp3|.flv|rtmp', 'i');
            if (patt1.test(source)) {
              return true;
            }
            return false;
          }
          return true;
        };

        module.exports.supportH5Video = function() {
          var testEl = document.createElement('video');
          return typeof testEl.canPlayType != 'undefined';
        };

        module.exports.createWrapper = function(option) {
          var id = option.id,
            tag;

          //如果是一个字符串，我们就认为是元素的id
          if ('string' === typeof id) {
            // id为#string的情况
            if (id.indexOf('#') === 0) {
              id = id.slice(1);
            }

            tag = Dom.el(id);
          } else {
            //否则就认为是dom 元素
            tag = id;
          }

          if (!tag || !tag.nodeName) {
            throw new TypeError('没有为播放器指定容器');
          }

          module.exports.adjustContainerLayout(tag, option);

          return tag;
        };

        module.exports.adjustContainerLayout = function(container, option) {
          if (option.width && !container.style.width) {
            container.style.width = option.width;
          }
          if (option.height && !container.style.height) {
            container.style.height = option.height;
          }
        };

        module.exports.isSupportHls = function() {
          var mediaSource = (window.MediaSource = window.MediaSource || window.WebKitMediaSource);
          var sourceBuffer = (window.SourceBuffer =
            window.SourceBuffer || window.WebKitSourceBuffer);
          var isTypeSupported =
            mediaSource &&
            typeof mediaSource.isTypeSupported === 'function' &&
            mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');

          // if SourceBuffer is exposed ensure its API is valid
          // safari and old version of Chrome doe not expose SourceBuffer globally so checking SourceBuffer.prototype is impossible
          var sourceBufferValidAPI =
            !sourceBuffer ||
            (sourceBuffer.prototype &&
              typeof sourceBuffer.prototype.appendBuffer === 'function' &&
              typeof sourceBuffer.prototype.remove === 'function');
          return isTypeSupported && sourceBufferValidAPI;
        };

        module.exports.isSupportFlv = function() {
          return module.exports.isSupportHls();
        };

        module.exports.isSupportMSE = function() {
          // Basic features needed for the library to be usable.
          var basic = !!window.Promise && !!window.Uint8Array && !!Array.prototype.forEach;
          return basic && module.exports.isSupportedMediaSource();
        };

        module.exports.isSupportedMediaSource = function() {
          return !!window.MediaSource && !!MediaSource.isTypeSupported;
        };

        module.exports.isSupportedDrm = function() {
          var basic =
            !!window.MediaKeys &&
            !!window.navigator &&
            !!window.navigator.requestMediaKeySystemAccess &&
            !!window.MediaKeySystemAccess &&
            !!window.MediaKeySystemAccess.prototype.getConfiguration;

          return basic && module.exports.isSupportMSE();
        };

        module.exports.isAudio = function(src) {
          return src && src.toLowerCase().indexOf('.mp3') > 0;
        };

        module.exports.isLiveShift = function(option) {
          return option.isLive && option.liveTimeShiftUrl; // && module.exports.isHls(option.source);
        };

        module.exports.isHls = function(src) {
          return src && src.toLowerCase().indexOf('.m3u8') > 0;
        };

        module.exports.isDash = function(src) {
          return src && src.toLowerCase().indexOf('.mpd') > 0;
        };

        module.exports.isFlv = function(src) {
          return src && src.toLowerCase().indexOf('.flv') > 0;
        };

        module.exports.isRTMP = function(src) {
          return src && src.toLowerCase().indexOf('rtmp:') > -1;
        };

        module.exports.findSelectedStreamLevel = function(urls, defaultDefinition) {
          var level = defaultDefinition;
          if (!level) {
            level = Cookie.get(constants.SelectedStreamLevel);
            if (!level) {
              Cookie.set(constants.SelectedStreamLevel, urls[0].definition, 365);
              return 0;
            }
          }
          for (var i = 0; i < urls.length; i++) {
            if (urls[i].definition == level) {
              return i;
            }
          }

          return 0;
        };

        // module.exports.handleUIOption=function(option)
        // {
        //   var hasErrorDisplay = false,
        //       hasInfo = false;
        //   for(var i=0;i<length;i++)
        //   {
        //      if(option.skinLayout[i].name == "errorDisplay")
        //      {
        //        hasErrorDisplay = true;
        //      }
        //      else if(option.skinLayout[i].name == "infoDisplay")
        //      {
        //        hasInfo = true;
        //      }
        //   }
        //   if(  hasInfo == false)
        //   {
        //      option.skinLayout.push({name: "errorDisplay", align: 'tl', x:0, y:0});
        //   }
        //   if(  hasInfo == false)
        //   {
        //      option.skinLayout.push({name: "infoDisplay",  align: "cc"});
        //   }
        //   return option;
        // };

        module.exports.handleOption = function(opt, type) {
          var option = _.merge(_.copy(defaultOpt), opt);
          //isLive 判断
          var liveControlbarChildren = [
            { name: 'fullScreenButton', align: 'tr', x: 20, y: 12 },
            { name: 'subtitle', align: 'tr', x: 15, y: 12 },
            { name: 'setting', align: 'tr', x: 15, y: 12 },
            { name: 'volume', align: 'tr', x: 5, y: 10 },
          ];
          var isFlash = false;
          if (opt.useFlashPrism || module.exports.isRTMP(opt.source)) {
            isFlash = true;
            liveControlbarChildren = [
              //liveDisplay
              { name: 'liveIco', align: 'tlabs', x: 15, y: 25 },
              { name: 'fullScreenButton', align: 'tr', x: 10, y: 25 },
              { name: 'volume', align: 'tr', x: 10, y: 25 },
            ];
          } else {
            var isLiveShift = module.exports.isLiveShift(option);
            if (isLiveShift) {
              liveControlbarChildren.push({
                name: 'liveShiftProgress',
                align: 'tlabs',
                x: 0,
                y: 0,
              });
              liveControlbarChildren.push({ name: 'playButton', align: 'tl', x: 15, y: 12 });
              liveControlbarChildren.push({ name: 'liveDisplay', align: 'tl', x: 15, y: 6 });
            } else {
              liveControlbarChildren.push({ name: 'liveDisplay', align: 'tlabs', x: 15, y: 6 });
            }
          }
          if (opt.isLive) {
            if (typeof opt.skinLayout == 'undefined') {
              option.skinLayout = [
                { name: 'errorDisplay', align: 'tlabs', x: 0, y: 0 },
                { name: 'infoDisplay' },
                { name: 'bigPlayButton', align: 'blabs', x: 30, y: 80 },
                { name: 'tooltip', align: 'blabs', x: 0, y: 56 },
                { name: 'H5Loading', align: 'cc' },
                {
                  name: 'controlBar',
                  align: 'blabs',
                  x: 0,
                  y: 0,
                  children: liveControlbarChildren,
                },
              ];
            } else if (opt.skinLayout != false) {
              var length = opt.skinLayout.length;
              var childlayout = [],
                index = -1;
              for (var i = 0; i < length; i++) {
                if (option.skinLayout[i].name == 'controlBar') {
                  index = i;
                  var childrenLength = option.skinLayout[i].children.length;
                  for (var j = 0; j < childrenLength; j++) {
                    var name = option.skinLayout[i].children[j].name;
                    if (
                      name == 'liveDisplay' ||
                      name == 'liveIco' ||
                      name == 'fullScreenButton' ||
                      name == 'volume' ||
                      name == 'snapshot' ||
                      name == 'setting' ||
                      name == 'subtitle' ||
                      (isLiveShift &&
                        (name == 'progress' || name == 'playButton' || name == 'timeDisplay'))
                    ) {
                      var item = option.skinLayout[i].children[j];
                      if (name == 'progress') {
                        item.name = 'liveShiftProgress';
                      } else if (name == 'timeDisplay') {
                        item.name = 'liveShiftTimeDisplay';
                      } else if (isFlash && name == 'liveDisplay') {
                        item.name = 'liveIco';
                      }
                      childlayout.push(item);
                    }
                  }
                  break;
                }
              }
              if (index != -1) {
                option.skinLayout[index].children = childlayout;
              }
            }
          }

          if (
            (typeof opt.components == 'undefined' ||
              !opt.components ||
              (_.isArray(opt.components) && opt.components.length == 0)) &&
            opt.components != 'false'
          ) {
            option.components = [EmptyComponent];
          }

          return option;
        };
      },
      {
        '../config': 11,
        '../player/base/plugin/defaultemptycomponent': 68,
        './constants': 21,
        './cookie': 22,
        './dom': 24,
        './object': 32,
        './ua': 38,
      },
    ],
    35: [
      function(require, module, exports) {
        module.exports = require(34);
      },
      {
        '../config': 11,
        '../player/base/plugin/defaultemptycomponent': 68,
        './constants': 21,
        './cookie': 22,
        './dom': 24,
        './object': 32,
        './ua': 38,
        '/Users/lmq/aliplayer/prismplayer/src/lib/playerUtil.js': 34,
      },
    ],
    36: [
      function(require, module, exports) {
        if (!Date.now)
          Date.now = function() {
            return new Date().getTime();
          };

        (function() {
          'use strict';

          var vendors = ['webkit', 'moz', 'ms', 'o'];
          for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
              window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
          }
          if (
            /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
            !window.requestAnimationFrame ||
            !window.cancelAnimationFrame
          ) {
            var lastTime = 0;
            window.requestAnimationFrame = function(callback) {
              var now = Date.now();
              var nextTime = Math.max(lastTime + 16, now);
              return setTimeout(function() {
                callback((lastTime = nextTime));
              }, nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
          }
        })();

        module.exports = {};
      },
      {},
    ],
    37: [
      function(require, module, exports) {
        module.exports.set = function(key, data) {
          try {
            if (window.localStorage) {
              localStorage.setItem(key, data);
            }
          } catch (e) {
            window[key + '_localStorage'] = data;
          }
        };

        module.exports.get = function(key) {
          var items;
          try {
            if (window.localStorage) {
              return localStorage.getItem(key);
            }
          } catch (e) {
            return window[key + '_localStorage'];
          }

          return '';
        };
      },
      {},
    ],
    38: [
      function(require, module, exports) {
        module.exports.USER_AGENT = navigator.userAgent;

        /**
         * Device is an iPhone
         * @type {Boolean}
         * @constant
         * @private
         */
        module.exports.IS_IPHONE = /iPhone/i.test(module.exports.USER_AGENT);
        module.exports.IS_IPAD = /iPad/i.test(module.exports.USER_AGENT);
        module.exports.IS_IPOD = /iPod/i.test(module.exports.USER_AGENT);
        module.exports.IS_MAC = /mac/i.test(module.exports.USER_AGENT);
        module.exports.IS_EDGE = /Edge/i.test(module.exports.USER_AGENT);
        module.exports.IS_IE11 = /Trident\/7.0/i.test(module.exports.USER_AGENT);
        module.exports.IS_X5 = /qqbrowser/i.test(module.exports.USER_AGENT.toLowerCase());
        module.exports.IS_CHROME =
          /Chrome/i.test(module.exports.USER_AGENT) &&
          !module.exports.IS_EDGE &&
          !module.exports.IS_X5;
        module.exports.IS_SAFARI =
          /Safari/i.test(module.exports.USER_AGENT) && !module.exports.IS_CHROME;
        module.exports.IS_FIREFOX = /Firefox/i.test(module.exports.USER_AGENT);

        if (document.all) {
          // IE
          try {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
              module.exports.HAS_FLASH = true;
            } else {
              module.exports.HAS_FLASH = false;
            }
          } catch (e) {
            module.exports.HAS_FLASH = false;
          }
        } else {
          // others
          if (navigator.plugins && navigator.plugins.length > 0) {
            var swf = navigator.plugins['Shockwave Flash'];
            if (swf) {
              module.exports.HAS_FLASH = true;
            } else {
              module.exports.HAS_FLASH = false;
            }
          } else {
            module.exports.HAS_FLASH = false;
          }
        }

        module.exports.IS_MAC_SAFARI =
          module.exports.IS_MAC &&
          module.exports.IS_SAFARI &&
          !module.exports.IS_CHROME &&
          !module.exports.HAS_FLASH;
        module.exports.IS_IOS =
          module.exports.IS_IPHONE || module.exports.IS_IPAD || module.exports.IS_IPOD;

        module.exports.IOS_VERSION = (function() {
          var match = module.exports.USER_AGENT.match(/OS (\d+)_/i);
          if (match && match[1]) {
            return match[1];
          }
        })();

        module.exports.IS_ANDROID = /Android/i.test(module.exports.USER_AGENT);
        module.exports.ANDROID_VERSION = (function() {
          // This matches Android Major.Minor.Patch versions
          // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
          var match = module.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),
            major,
            minor;

          if (!match) {
            return null;
          }

          major = match[1] && parseFloat(match[1]);
          minor = match[2] && parseFloat(match[2]);

          if (major && minor) {
            return parseFloat(match[1] + '.' + match[2]);
          } else if (major) {
            return major;
          } else {
            return null;
          }
        })();
        // Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser
        module.exports.IS_OLD_ANDROID =
          module.exports.IS_ANDROID &&
          /webkit/i.test(module.exports.USER_AGENT) &&
          module.exports.ANDROID_VERSION < 2.3;

        module.exports.TOUCH_ENABLED = !!(
          'ontouchstart' in window ||
          (window.DocumentTouch && document instanceof window.DocumentTouch)
        );

        module.exports.IS_MOBILE = module.exports.IS_IOS || module.exports.IS_ANDROID;
        module.exports.IS_H5 = module.exports.IS_MOBILE || !module.exports.HAS_FLASH;
        module.exports.IS_PC = !module.exports.IS_H5;
        module.exports.is_X5 =
          /micromessenger/i.test(module.exports.USER_AGENT) ||
          /qqbrowser/i.test(module.exports.USER_AGENT);

        module.exports.getHost = function(url) {
          var host = '';
          if (typeof url == 'undefined' || url == null || url == '') {
            return '';
          }
          var index = url.indexOf('//'),
            str = url;
          if (index > -1) {
            str = url.substring(index + 2);
          }
          var host = str;
          var arr = str.split('/');
          if (arr && arr.length > 0) {
            host = arr[0];
          }
          arr = host.split(':');
          if (arr && arr.length > 0) {
            host = arr[0];
          }
          return host;
        };

        module.exports.dingTalk = function() {
          var ua = module.exports.USER_AGENT.toLowerCase();
          return /dingtalk/i.test(ua);
        };

        module.exports.wechat = function() {
          var ua = module.exports.USER_AGENT.toLowerCase();
          return /micromessenger/i.test(ua);
        };

        module.exports.inIFrame = function() {
          return self != top;
        };

        module.exports.getReferer = function() {
          var referer = document.referrer;
          if (module.exports.inIFrame()) {
            try {
              referer = top.document.referrer;
            } catch (e) {
              referer = document.referrer;
            }
          }
          return referer;
        };

        module.exports.getHref = function() {
          var href = location.href;
          if (module.exports.inIFrame()) {
            try {
              href = top.location.href;
            } catch (e) {
              href = location.href;
            }
          }
          return location.href;
        };

        //     Zepto.js
        //     (c) 2010-2016 Thomas Fuchs
        //     Zepto.js may be freely distributed under the MIT license.
        (function(exports) {
          function detect(ua, platform) {
            var os = (this.os = {}),
              browser = (this.browser = {}),
              webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
              android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
              osx = !!ua.match(/\(Macintosh\; Intel /),
              ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
              ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
              iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
              webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
              win = /Win\d{2}|Windows/.test(platform),
              wp = ua.match(/Windows Phone ([\d.]+)/),
              touchpad = webos && ua.match(/TouchPad/),
              kindle = ua.match(/Kindle\/([\d.]+)/),
              silk = ua.match(/Silk\/([\d._]+)/),
              blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
              bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
              rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
              playbook = ua.match(/PlayBook/),
              chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
              firefox = ua.match(/Firefox\/([\d.]+)/),
              firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
              ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
              webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
              safari =
                webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

            // Todo: clean this up with a better OS/browser seperation:
            // - discern (more) between multiple browsers on android
            // - decide if kindle fire in silk mode is android or not
            // - Firefox on Android doesn't specify the Android version
            // - possibly devide in os, device and browser hashes

            if ((browser.webkit = !!webkit)) browser.version = webkit[1];

            if (android) (os.android = true), (os.version = android[2]);
            if (iphone && !ipod)
              (os.ios = os.iphone = true), (os.version = iphone[2].replace(/_/g, '.'));
            if (ipad) (os.ios = os.ipad = true), (os.version = ipad[2].replace(/_/g, '.'));
            if (ipod)
              (os.ios = os.ipod = true), (os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null);
            if (wp) (os.wp = true), (os.version = wp[1]);
            if (webos) (os.webos = true), (os.version = webos[2]);
            if (touchpad) os.touchpad = true;
            if (blackberry) (os.blackberry = true), (os.version = blackberry[2]);
            if (bb10) (os.bb10 = true), (os.version = bb10[2]);
            if (rimtabletos) (os.rimtabletos = true), (os.version = rimtabletos[2]);
            if (playbook) browser.playbook = true;
            if (kindle) (os.kindle = true), (os.version = kindle[1]);
            if (silk) (browser.silk = true), (browser.version = silk[1]);
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
            if (chrome) (browser.chrome = true), (browser.version = chrome[1]);
            if (firefox) (browser.firefox = true), (browser.version = firefox[1]);
            if (firefoxos) (os.firefoxos = true), (os.version = firefoxos[1]);
            if (ie) (browser.ie = true), (browser.version = ie[1]);
            if (safari && (osx || os.ios || win || android)) {
              browser.safari = true;
              if (!os.ios) browser.version = safari[1];
            }
            if (webview) browser.webview = true;
            if (osx) {
              var version = ua.match(/[\d]*_[\d]*_[\d]*/);
              if (version && version.length > 0 && version[0]) {
                os.version = version[0].replace(/_/g, '.');
              }
            }

            os.tablet = !!(
              ipad ||
              playbook ||
              (android && !ua.match(/Mobile/)) ||
              (firefox && ua.match(/Tablet/)) ||
              (ie && !ua.match(/Phone/) && ua.match(/Touch/))
            );
            os.phone = !!(
              !os.tablet &&
              !os.ipod &&
              (android ||
                iphone ||
                webos ||
                blackberry ||
                bb10 ||
                (chrome && ua.match(/Android/)) ||
                (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
                (firefox && ua.match(/Mobile/)) ||
                (ie && ua.match(/Touch/)))
            );

            os.pc = !os.tablet && !os.phone;
            if (osx) {
              os.name = 'macOS';
            } else if (win) {
              os.name = 'windows';
              os.version = getWinVersion();
            } else {
              os.name = getOSName();
            }
            browser.name = getBrowserType();
          }

          detect.call(exports, navigator.userAgent, navigator.platform);
          // make available to unit tests
        })(module.exports);

        function getOSName() {
          var sUserAgent = navigator.userAgent;
          var operator = 'other',
            os = module.exports.os;
          if (!!os.ios) {
            return 'iOS';
          }
          if (!!os.android) {
            return 'android';
          }
          if (sUserAgent.indexOf('Baiduspider') > -1) {
            return 'Baiduspider';
          }
          if (sUserAgent.indexOf('PlayStation') > -1) {
            return 'PS4';
          }
          var isWin =
            navigator.platform == 'Win32' ||
            navigator.platform == 'Windows' ||
            sUserAgent.indexOf('Windows') > -1;
          var isMac =
            navigator.platform == 'Mac68K' ||
            navigator.platform == 'MacPPC' ||
            navigator.platform == 'Macintosh' ||
            navigator.platform == 'MacIntel';
          if (isMac) operator = 'macOS';
          var isUnix = navigator.platform == 'X11' && !isWin && !isMac;
          if (isUnix) operator = 'Unix';
          var isLinux = String(navigator.platform).indexOf('Linux') > -1;
          if (isLinux) operator = 'Linux';
          if (isWin) {
            return 'windows';
          }
          return operator;
        }

        function getWinVersion() {
          var sUserAgent = navigator.userAgent;
          var operator = '';
          var isWin2K =
            sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;
          if (isWin2K) operator = '2000';
          var isWinXP =
            sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;
          if (isWinXP) operator = 'XP';
          var isWin2003 =
            sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;
          if (isWin2003) operator = '2003';
          var isWinVista =
            sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;
          if (isWinVista) operator = 'Vista';
          var isWin7 =
            sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;
          if (isWin7) operator = '7';
          var isWin8 =
            sUserAgent.indexOf('Windows NT 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1;
          if (isWin8) operator = '8';
          var isWin81 =
            sUserAgent.indexOf('Windows NT 6.3') > -1 || sUserAgent.indexOf('Windows 8.1') > -1;
          if (isWin81) operator = '8.1';
          var isWin10 =
            sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1;
          if (isWin10) operator = '10';

          return operator;
        }

        function getBrowserType() {
          var UserAgent = navigator.userAgent.toLowerCase(),
            browser = module.exports.browser;
          if (!!browser.firefox) {
            return 'Firefox';
          } else if (!!browser.ie) {
            if (/edge/.test(UserAgent)) return 'Edge';
            return 'IE';
          } else if (/micromessenger/.test(UserAgent)) {
            return '微信内置浏览器';
          } else if (/qqbrowser/.test(UserAgent)) {
            return 'QQ浏览器';
          } else if (!!browser.webview) {
            return 'webview';
          } else if (!!browser.chrome) {
            return 'Chrome';
          } else if (!!browser.safari) {
            return 'Safari';
          } else if (/baiduspider/.test(UserAgent)) {
            return 'Baiduspider';
          } else if (/ucweb/.test(UserAgent) || /UCBrowser/.test(UserAgent)) {
            return 'UC';
          } else if (/opera/.test(UserAgent)) {
            return 'Opera';
          } else if (/ucweb/.test(UserAgent)) {
            return 'UC';
          } else if (/360se/.test(UserAgent)) {
            return '360浏览器';
          } else if (/bidubrowser/.test(UserAgent)) {
            return '百度浏览器';
          } else if (/metasr/.test(UserAgent)) {
            return '搜狗浏览器';
          } else if (/lbbrowser/.test(UserAgent)) {
            return '猎豹浏览器';
          } else if (/playstation/.test(UserAgent)) {
            return 'PS4浏览器';
          }
        }
      },
      {},
    ],
    39: [
      function(require, module, exports) {
        var Dom = require('./dom');

        /**
         * Get abosolute version of relative URL. Used to tell flash correct URL.
         * http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
         * @param  {String} url URL to make absolute
         * @return {String}     Absolute URL
         * @private
         */
        module.exports.getAbsoluteURL = function(url) {
          // Check if absolute URL
          if (!url.match(/^https?:\/\//)) {
            // Convert to absolute URL. Flash hosted off-site needs an absolute URL.
            url = Dom.createEl('div', {
              innerHTML: '<a href="' + url + '">x</a>',
            }).firstChild.href;
          }

          return url;
        };

        /**
         * Resolve and parse the elements of a URL
         * @param  {String} url The url to parse
         * @return {Object}     An object of url details
         */
        module.exports.parseUrl = function(url) {
          var div, a, addToBody, props, details;

          props = ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'host'];

          // add the url to an anchor and let the browser parse the URL
          a = Dom.createEl('a', { href: url });

          // IE8 (and 9?) Fix
          // ie8 doesn't parse the URL correctly until the anchor is actually
          // added to the body, and an innerHTML is needed to trigger the parsing
          addToBody = a.host === '' && a.protocol !== 'file:';
          if (addToBody) {
            div = Dom.createEl('div');
            div.innerHTML = '<a href="' + url + '"></a>';
            a = div.firstChild;
            // prevent the div from affecting layout
            div.setAttribute('style', 'display:none; position:absolute;');
            document.body.appendChild(div);
          }

          // Copy the specific URL properties to a new object
          // This is also needed for IE8 because the anchor loses its
          // properties when it's removed from the dom
          details = {};
          for (var i = 0; i < props.length; i++) {
            details[props[i]] = a[props[i]];
          }
          details['segments'] = a.pathname.replace(/^\//, '').split('/');

          if (addToBody) {
            document.body.removeChild(div);
          }

          return details;
        };
      },
      { './dom': 24 },
    ],
    40: [
      function(require, module, exports) {
        var dom = require('./dom');
        var UA = require('./ua');
        var playerutil = require('./playerutil');
        // 将秒格式化为00:00:00格式
        module.exports.formatTime = function(seconds) {
          var raw = Math.floor(seconds), //不应该4舍5入
            hour,
            min,
            sec;

          hour = Math.floor(raw / 3600);
          raw = raw % 3600;
          min = Math.floor(raw / 60);
          sec = raw % 60;

          if (
            hour === Infinity ||
            isNaN(hour) ||
            min === Infinity ||
            isNaN(min) ||
            sec === Infinity ||
            isNaN(sec)
          ) {
            return false;
          }

          hour = hour >= 10 ? hour : '0' + hour;
          min = min >= 10 ? min : '0' + min;
          sec = sec >= 10 ? sec : '0' + sec;

          return (hour === '00' ? '' : hour + ':') + min + ':' + sec;
        };

        module.exports.extractTime = function(date) {
          if (date) {
            var hour = parseInt(date.getHours()),
              min = parseInt(date.getMinutes()),
              sec = parseInt(date.getSeconds());
            hour = hour >= 10 ? hour : '0' + hour;
            min = min >= 10 ? min : '0' + min;
            sec = sec >= 10 ? sec : '0' + sec;

            return (hour === '00' ? '' : hour + ':') + min + ':' + sec;
          }
          return '';
        };

        module.exports.convertToTimestamp = function(date, misc) {
          var timestamp = '';
          if (date) {
            if (!misc) {
              timestamp = Date.parse(date);
              timestamp = timestamp / 1000;
            } else {
              timestamp = date.gettime();
            }
          }

          return timestamp;
        };

        module.exports.convertToDate = function(timestamp, misc) {
          var newDate = '';
          if (timestamp) {
            newDate = new Date();
            var multi = 1;
            if (!misc) {
              multi = 1000;
            }
            newDate.setTime(timestamp * 1000);
          }
          return newDate;
        };

        // 将00:00:00格式解析为秒
        module.exports.parseTime = function(timeStr) {
          if (!timeStr) {
            return '00:00:00';
          }
          var timeArr = timeStr.split(':'),
            h = 0,
            m = 0,
            s = 0;

          if (timeArr.length === 3) {
            h = timeArr[0];
            m = timeArr[1];
            s = timeArr[2];
          } else if (timeArr.length === 2) {
            m = timeArr[0];
            s = timeArr[1];
          } else if (timeArr.length === 1) {
            s = timeArr[0];
          }

          h = parseInt(h, 10);
          m = parseInt(m, 10);
          // 秒可能有小数位，需要向上取整
          s = Math.ceil(parseFloat(s));

          return h * 3600 + m * 60 + s;
        };

        module.exports.formatDate = function(date, fmt) {
          //author: meizz
          var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'H+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
          };
          if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
              fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
              );
          return fmt;
        };

        /**
         * sleep function
         */
        module.exports.sleep = function(d) {
          for (var t = Date.now(); Date.now() - t <= d; );
        };

        module.exports.htmlEncodeAll = function(e) {
          return null == e
            ? ''
            : e
                .replace(/\</g, '&lt;')
                .replace(/\>/g, '&gt;')
                .replace(/\&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        module.exports.toBinary = function(base64) {
          if (!window.atob) return '';
          var binary = atob(base64);
          var len = binary.length;
          var buf = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            buf[i] = binary.charCodeAt(i);
          }

          return buf;
        };

        module.exports.readyBinary = function(bufferArray) {
          var dataView = new Uint8Array(bufferArray),
            len = dataView.length,
            data = '';
          for (var i = 0; i < len; i++) {
            data += dataView[i];
          }
          return data;
        };

        module.exports.delayHide = function(obj, delay) {
          if (!obj) {
            return;
          }
          if (typeof delay == 'undefined') {
            delay = 1000;
          }
          if (obj.delayHanlder) {
            clearTimeout(obj.delayHanlder);
          }
          obj.delayHanlder = setTimeout(function() {
            dom.css(obj, 'display', 'none');
          }, delay);
        };

        module.exports.openInFile = function() {
          if (window.location.protocol.toLowerCase().indexOf('file') != -1) {
            return true;
          }

          return false;
        };

        module.exports.contentProtocolMixed = function(url) {
          if (
            UA.os.pc &&
            ((playerutil.isHls(url) && !UA.browser.safari) || playerutil.isFlv(url))
          ) {
            if (window.location.protocol.toLowerCase() == 'https:') {
              if (url && url.toLowerCase().indexOf('http://') > -1) {
                return true;
              }
            }
          }

          return false;
        };

        module.exports.queryString = function(url) {
          var a, arr, b, i, search;
          url = decodeURIComponent(url);
          arr = url.split('?');
          if (arr.length !== 2) {
            return {};
          }
          search = arr[1];
          a = search.split('&');
          if (!a) {
            return {};
          }
          b = {};
          i = 0;
          $(a).each(function() {
            var p;
            p = a[i].split('=');
            if (p.length !== 2) {
              i++;
              return;
            }
            b[p[0]] = p[1].replace(/\+/g, ' ');
            i++;
          });
          return b;
        };

        module.exports.log = function(info) {
          var url = window.location.href;
          var search = module.exports.queryString(url);
          if (search && search.debug == 1) {
            console.log(info);
          }
        };
      },
      { './dom': 24, './playerutil': 35, './ua': 38 },
    ],
    41: [
      function(require, module, exports) {
        var VTTParser = require('./vttparse');
        // String.prototype.startsWith is not supported in IE11
        var startsWith = function(inputString, searchString, position) {
          return inputString.substr(position || 0, searchString.length) === searchString;
        };

        var cueString2millis = function(timeString) {
          var ts = parseInt(timeString.substr(-3));
          var secs = parseInt(timeString.substr(-6, 2));
          var mins = parseInt(timeString.substr(-9, 2));
          var hours =
            timeString.length > 9 ? parseInt(timeString.substr(0, timeString.indexOf(':'))) : 0;

          if (isNaN(ts) || isNaN(secs) || isNaN(mins) || isNaN(hours)) {
            return -1;
          }

          ts += 1000 * secs;
          ts += 60 * 1000 * mins;
          ts += 60 * 60 * 1000 * hours;

          return ts;
        };

        // From https://github.com/darkskyapp/string-hash
        var hash = function(text) {
          var hash = 5381;
          var i = text.length;
          while (i) {
            hash = (hash * 33) ^ text.charCodeAt(--i);
          }
          return (hash >>> 0).toString();
        };

        var calculateOffset = function(vttCCs, cc, presentationTime) {
          var currCC = vttCCs[cc];
          var prevCC = vttCCs[currCC.prevCC];

          // This is the first discontinuity or cues have been processed since the last discontinuity
          // Offset = current discontinuity time
          if (!prevCC || (!prevCC['new'] && currCC['new'])) {
            vttCCs.ccOffset = vttCCs.presentationOffset = currCC.start;
            currCC['new'] = false;
            return;
          }

          // There have been discontinuities since cues were last parsed.
          // Offset = time elapsed
          while (prevCC && prevCC['new']) {
            vttCCs.ccOffset += currCC.start - prevCC.start;
            currCC['new'] = false;
            currCC = prevCC;
            prevCC = vttCCs[currCC.prevCC];
          }

          vttCCs.presentationOffset = presentationTime;
        };

        var ThumbnailVTTParser = {
          parse: function(lines, callBack, errorCallBack) {
            // Convert byteArray into string, replacing any somewhat exotic linefeeds with "\n", then split on that character.
            var re = /\r\n|\n\r|\n|\r/g;
            var vttLines = lines
              .trim()
              .replace(re, '\n')
              .split('\n');
            var cueTime = '00:00.000';
            var mpegTs = 0;
            var localTime = 0;
            var presentationTime = 0;
            var cues = [];
            var parsingError;
            // var VTTCue = VTTCue || window.TextTrackCue;

            // Create parser object using VTTCue with TextTrackCue fallback on certain browsers.
            var parser = new VTTParser();

            parser.oncue = function(cue) {
              // Create a unique hash id for a cue based on start/end times and text.
              // This helps timeline-controller to avoid showing repeated captions.
              cue.id = hash(cue.startTime) + hash(cue.endTime) + hash(cue.text);

              // Fix encoding of special characters. TODO: Test with all sorts of weird characters.
              cue.text = decodeURIComponent(escape(cue.text));
              cue.isBig = false;
              var segments = cue.text.split('#xywh=');
              if (segments.length == 2) {
                var positions = segments[1].split(',');
                cue.x = positions[0];
                cue.y = positions[1];
                cue.w = positions[2];
                cue.h = positions[3];
                cue.isBig = true;
              }
              if (cue.endTime > 0) {
                cues.push(cue);
              }
            };

            parser.onparsingerror = function(e) {
              parsingError = e;
            };

            parser.onflush = function() {
              if (parsingError && errorCallBack) {
                errorCallBack(parsingError);
                console.log(parsingError);
                return;
              }
              callBack(cues);
            };

            // Go through contents line by line.
            vttLines.forEach(function(line) {
              // Parse line by default.
              parser.parse(line + '\n');
            });

            parser.flush();
          },
        };

        module.exports = ThumbnailVTTParser;
      },
      { './vttparse': 43 },
    ],
    42: [
      function(require, module, exports) {
        /**
         * Copyright 2013 vtt.js Contributors
         *
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         *
         *   http://www.apache.org/licenses/LICENSE-2.0
         *
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the License.
         */

        module.exports = (function() {
          if (typeof window !== 'undefined' && window.VTTCue) {
            return window.VTTCue;
          }

          var autoKeyword = 'auto';
          var directionSetting = {
            '': true,
            lr: true,
            rl: true,
          };
          var alignSetting = {
            start: true,
            middle: true,
            end: true,
            left: true,
            right: true,
          };

          function findDirectionSetting(value) {
            if (typeof value !== 'string') {
              return false;
            }
            var dir = directionSetting[value.toLowerCase()];
            return dir ? value.toLowerCase() : false;
          }

          function findAlignSetting(value) {
            if (typeof value !== 'string') {
              return false;
            }
            var align = alignSetting[value.toLowerCase()];
            return align ? value.toLowerCase() : false;
          }

          function extend(obj) {
            var i = 1;
            for (; i < arguments.length; i++) {
              var cobj = arguments[i];
              for (var p in cobj) {
                obj[p] = cobj[p];
              }
            }

            return obj;
          }

          function VTTCue(startTime, endTime, text) {
            var cue = this;
            var isIE8 = (function() {
              if (typeof navigator === 'undefined') {
                return;
              }
              return /MSIE\s8\.0/.test(navigator.userAgent);
            })();
            var baseObj = {};

            if (isIE8) {
              cue = document.createElement('custom');
            } else {
              baseObj.enumerable = true;
            }

            /**
             * Shim implementation specific properties. These properties are not in
             * the spec.
             */

            // Lets us know when the VTTCue's data has changed in such a way that we need
            // to recompute its display state. This lets us compute its display state
            // lazily.
            cue.hasBeenReset = false;

            /**
             * VTTCue and TextTrackCue properties
             * http://dev.w3.org/html5/webvtt/#vttcue-interface
             */

            var _id = '';
            var _pauseOnExit = false;
            var _startTime = startTime;
            var _endTime = endTime;
            var _text = text;
            var _region = null;
            var _vertical = '';
            var _snapToLines = true;
            var _line = 'auto';
            var _lineAlign = 'start';
            var _position = 50;
            var _positionAlign = 'middle';
            var _size = 50;
            var _align = 'middle';

            Object.defineProperty(
              cue,
              'id',
              extend({}, baseObj, {
                get: function() {
                  return _id;
                },
                set: function(value) {
                  _id = '' + value;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'pauseOnExit',
              extend({}, baseObj, {
                get: function() {
                  return _pauseOnExit;
                },
                set: function(value) {
                  _pauseOnExit = !!value;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'startTime',
              extend({}, baseObj, {
                get: function() {
                  return _startTime;
                },
                set: function(value) {
                  if (typeof value !== 'number') {
                    throw new TypeError('Start time must be set to a number.');
                  }
                  _startTime = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'endTime',
              extend({}, baseObj, {
                get: function() {
                  return _endTime;
                },
                set: function(value) {
                  if (typeof value !== 'number') {
                    throw new TypeError('End time must be set to a number.');
                  }
                  _endTime = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'text',
              extend({}, baseObj, {
                get: function() {
                  return _text;
                },
                set: function(value) {
                  _text = '' + value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'region',
              extend({}, baseObj, {
                get: function() {
                  return _region;
                },
                set: function(value) {
                  _region = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'vertical',
              extend({}, baseObj, {
                get: function() {
                  return _vertical;
                },
                set: function(value) {
                  var setting = findDirectionSetting(value);
                  // Have to check for false because the setting an be an empty string.
                  if (setting === false) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                  }
                  _vertical = setting;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'snapToLines',
              extend({}, baseObj, {
                get: function() {
                  return _snapToLines;
                },
                set: function(value) {
                  _snapToLines = !!value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'line',
              extend({}, baseObj, {
                get: function() {
                  return _line;
                },
                set: function(value) {
                  if (typeof value !== 'number' && value !== autoKeyword) {
                    throw new SyntaxError('An invalid number or illegal string was specified.');
                  }
                  _line = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'lineAlign',
              extend({}, baseObj, {
                get: function() {
                  return _lineAlign;
                },
                set: function(value) {
                  var setting = findAlignSetting(value);
                  if (!setting) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                  }
                  _lineAlign = setting;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'position',
              extend({}, baseObj, {
                get: function() {
                  return _position;
                },
                set: function(value) {
                  if (value < 0 || value > 100) {
                    throw new Error('Position must be between 0 and 100.');
                  }
                  _position = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'positionAlign',
              extend({}, baseObj, {
                get: function() {
                  return _positionAlign;
                },
                set: function(value) {
                  var setting = findAlignSetting(value);
                  if (!setting) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                  }
                  _positionAlign = setting;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'size',
              extend({}, baseObj, {
                get: function() {
                  return _size;
                },
                set: function(value) {
                  if (value < 0 || value > 100) {
                    throw new Error('Size must be between 0 and 100.');
                  }
                  _size = value;
                  this.hasBeenReset = true;
                },
              }),
            );

            Object.defineProperty(
              cue,
              'align',
              extend({}, baseObj, {
                get: function() {
                  return _align;
                },
                set: function(value) {
                  var setting = findAlignSetting(value);
                  if (!setting) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                  }
                  _align = setting;
                  this.hasBeenReset = true;
                },
              }),
            );

            /**
             * Other <track> spec defined properties
             */

            // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
            cue.displayState = undefined;

            if (isIE8) {
              return cue;
            }
          }

          /**
           * VTTCue methods
           */

          VTTCue.prototype.getCueAsHTML = function() {
            // Assume WebVTT.convertCueToDOMTree is on the global.
            var WebVTT = window.WebVTT;
            return WebVTT.convertCueToDOMTree(window, this.text);
          };

          return VTTCue;
        })();
      },
      {},
    ],
    43: [
      function(require, module, exports) {
        /*
         * Source: https://github.com/mozilla/vtt.js/blob/master/dist/vtt.js#L1716
         */

        var VTTCue = require('./vttcue');

        var StringDecoder = function StringDecoder() {
          return {
            decode: function(data) {
              if (!data) {
                return '';
              }
              if (typeof data !== 'string') {
                throw new Error('Error - expected string data.');
              }
              return decodeURIComponent(encodeURIComponent(data));
            },
          };
        };

        function VTTParser() {
          this.window = window;
          this.state = 'INITIAL';
          this.buffer = '';
          this.decoder = new StringDecoder();
          this.regionList = [];
        }

        // Try to parse input as a time stamp.
        function parseTimeStamp(input) {
          function computeSeconds(h, m, s, f) {
            return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
          }

          var m = input.match(/^(\d+):(\d{2})(:\d{2})?(\.\d{3})?/);
          if (!m) {
            return null;
          }
          var m4 = m[4];
          if (m4) {
            m4 = m4.replace('.', '');
          }
          if (m[3]) {
            // Timestamp takes the form of [hours]:[minutes]:[seconds].[milliseconds]
            return computeSeconds(m[1], m[2], m[3].replace(':', ''), m4);
          } else if (m[1] > 59) {
            // Timestamp takes the form of [hours]:[minutes].[milliseconds]
            // First position is hours as it's over 59.
            return computeSeconds(m[1], m[2], 0, m4);
          } else {
            // Timestamp takes the form of [minutes]:[seconds].[milliseconds]
            return computeSeconds(0, m[1], m[2], m4);
          }
        }

        // A settings object holds key/value pairs and will ignore anything but the first
        // assignment to a specific key.
        function Settings() {
          this.values = Object.create(null);
        }

        Settings.prototype = {
          // Only accept the first assignment to any key.
          set: function(k, v) {
            if (!this.get(k) && v !== '') {
              this.values[k] = v;
            }
          },
          // Return the value for a key, or a default value.
          // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
          // a number of possible default values as properties where 'defaultKey' is
          // the key of the property that will be chosen; otherwise it's assumed to be
          // a single value.
          get: function(k, dflt, defaultKey) {
            if (defaultKey) {
              return this.has(k) ? this.values[k] : dflt[defaultKey];
            }
            return this.has(k) ? this.values[k] : dflt;
          },
          // Check whether we have a value for a key.
          has: function(k) {
            return k in this.values;
          },
          // Accept a setting if its one of the given alternatives.
          alt: function(k, v, a) {
            for (var n = 0; n < a.length; ++n) {
              if (v === a[n]) {
                this.set(k, v);
                break;
              }
            }
          },
          // Accept a setting if its a valid (signed) integer.
          integer: function(k, v) {
            if (/^-?\d+$/.test(v)) {
              // integer
              this.set(k, parseInt(v, 10));
            }
          },
          // Accept a setting if its a valid percentage.
          percent: function(k, v) {
            var m;
            if ((m = v.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
              v = parseFloat(v);
              if (v >= 0 && v <= 100) {
                this.set(k, v);
                return true;
              }
            }
            return false;
          },
        };

        // Helper function to parse input into groups separated by 'groupDelim', and
        // interprete each group as a key/value pair separated by 'keyValueDelim'.
        function parseOptions(input, callback, keyValueDelim, groupDelim) {
          var groups = groupDelim ? input.split(groupDelim) : [input];
          for (var i in groups) {
            if (typeof groups[i] !== 'string') {
              continue;
            }
            var kv = groups[i].split(keyValueDelim);
            if (kv.length !== 2) {
              continue;
            }
            var k = kv[0];
            var v = kv[1];
            callback(k, v);
          }
        }

        var defaults = new VTTCue(0, 0, 0);
        // 'middle' was changed to 'center' in the spec: https://github.com/w3c/webvtt/pull/244
        // Chrome and Safari don't yet support this change, but FF does
        var center = defaults.align === 'middle' ? 'middle' : 'center';

        function parseCue(input, cue, regionList) {
          // Remember the original input if we need to throw an error.
          var oInput = input;
          // 4.1 WebVTT timestamp
          function consumeTimeStamp() {
            var ts = parseTimeStamp(input);
            if (ts === null) {
              throw new Error('Malformed timestamp: ' + oInput);
            }
            // Remove time stamp from input.
            input = input.replace(/^[^\sa-zA-Z-]+/, '');
            return ts;
          }

          // 4.4.2 WebVTT cue settings
          function consumeCueSettings(input, cue) {
            var settings = new Settings();

            parseOptions(
              input,
              function(k, v) {
                switch (k) {
                  case 'region':
                    // Find the last region we parsed with the same region id.
                    for (var i = regionList.length - 1; i >= 0; i--) {
                      if (regionList[i].id === v) {
                        settings.set(k, regionList[i].region);
                        break;
                      }
                    }
                    break;
                  case 'vertical':
                    settings.alt(k, v, ['rl', 'lr']);
                    break;
                  case 'line':
                    var vals = v.split(','),
                      vals0 = vals[0];
                    settings.integer(k, vals0);
                    if (settings.percent(k, vals0)) {
                      settings.set('snapToLines', false);
                    }
                    settings.alt(k, vals0, ['auto']);
                    if (vals.length === 2) {
                      settings.alt('lineAlign', vals[1], ['start', center, 'end']);
                    }
                    break;
                  case 'position':
                    vals = v.split(',');
                    settings.percent(k, vals[0]);
                    if (vals.length === 2) {
                      settings.alt('positionAlign', vals[1], [
                        'start',
                        center,
                        'end',
                        'line-left',
                        'line-right',
                        'auto',
                      ]);
                    }
                    break;
                  case 'size':
                    settings.percent(k, v);
                    break;
                  case 'align':
                    settings.alt(k, v, ['start', center, 'end', 'left', 'right']);
                    break;
                }
              },
              /:/,
              /\s/,
            );

            // Apply default values for any missing fields.
            cue.region = settings.get('region', null);
            cue.vertical = settings.get('vertical', '');
            var line = settings.get('line', 'auto');
            if (line === 'auto' && defaults.line === -1) {
              // set numeric line number for Safari
              line = -1;
            }
            cue.line = line;
            cue.lineAlign = settings.get('lineAlign', 'start');
            cue.snapToLines = settings.get('snapToLines', true);
            cue.size = settings.get('size', 100);
            cue.align = settings.get('align', center);
            var position = settings.get('position', 'auto');
            if (position === 'auto' && defaults.position === 50) {
              // set numeric position for Safari
              position =
                cue.align === 'start' || cue.align === 'left'
                  ? 0
                  : cue.align === 'end' || cue.align === 'right'
                  ? 100
                  : 50;
            }
            cue.position = position;
          }

          function skipWhitespace() {
            input = input.replace(/^\s+/, '');
          }

          // 4.1 WebVTT cue timings.
          skipWhitespace();
          cue.startTime = consumeTimeStamp(); // (1) collect cue start time
          skipWhitespace();
          if (input.substr(0, 3) !== '-->') {
            // (3) next characters must match '-->'
            throw new Error(
              "Malformed time stamp (time stamps must be separated by '-->'): " + oInput,
            );
          }
          input = input.substr(3);
          skipWhitespace();
          cue.endTime = consumeTimeStamp(); // (5) collect cue end time

          // 4.1 WebVTT cue settings list.
          skipWhitespace();
          consumeCueSettings(input, cue);
        }

        function fixLineBreaks(input) {
          return input.replace(/<br(?: \/)?>/gi, '\n');
        }

        VTTParser.prototype = {
          parse: function(data) {
            var self = this;

            // If there is no data then we won't decode it, but will just try to parse
            // whatever is in buffer already. This may occur in circumstances, for
            // example when flush() is called.
            if (data) {
              // Try to decode the data that we received.
              self.buffer += self.decoder.decode(data, { stream: true });
            }

            function collectNextLine() {
              var buffer = self.buffer;
              var pos = 0;

              buffer = fixLineBreaks(buffer);

              while (pos < buffer.length && buffer[pos] !== '\r' && buffer[pos] !== '\n') {
                ++pos;
              }
              var line = buffer.substr(0, pos);
              // Advance the buffer early in case we fail below.
              if (buffer[pos] === '\r') {
                ++pos;
              }
              if (buffer[pos] === '\n') {
                ++pos;
              }
              self.buffer = buffer.substr(pos);
              return line;
            }

            // 3.2 WebVTT metadata header syntax
            function parseHeader(input) {
              parseOptions(
                input,
                function(k, v) {
                  switch (k) {
                    case 'Region':
                      // 3.3 WebVTT region metadata header syntax
                      console.log('parse region', v);
                      //parseRegion(v);
                      break;
                  }
                },
                /:/,
              );
            }

            // 5.1 WebVTT file parsing.
            try {
              var line;
              if (self.state === 'INITIAL') {
                // We can't start parsing until we have the first line.
                if (!/\r\n|\n/.test(self.buffer)) {
                  return this;
                }

                line = collectNextLine();

                var m = line.match(/^WEBVTT([ \t].*)?$/);
                if (!m || !m[0]) {
                  throw new Error('Malformed WebVTT signature.');
                }

                self.state = 'HEADER';
              }

              var alreadyCollectedLine = false;
              while (self.buffer) {
                // We can't parse a line until we have the full line.
                if (!/\r\n|\n/.test(self.buffer)) {
                  return this;
                }

                if (!alreadyCollectedLine) {
                  line = collectNextLine();
                } else {
                  alreadyCollectedLine = false;
                }

                switch (self.state) {
                  case 'HEADER':
                    // 13-18 - Allow a header (metadata) under the WEBVTT line.
                    if (/:/.test(line)) {
                      parseHeader(line);
                    } else if (!line) {
                      // An empty line terminates the header and starts the body (cues).
                      self.state = 'ID';
                    }
                    continue;
                  case 'NOTE':
                    // Ignore NOTE blocks.
                    if (!line) {
                      self.state = 'ID';
                    }
                    continue;
                  case 'ID':
                    // Check for the start of NOTE blocks.
                    if (/^NOTE($|[ \t])/.test(line)) {
                      self.state = 'NOTE';
                      break;
                    }
                    // 19-29 - Allow any number of line terminators, then initialize new cue values.
                    if (!line) {
                      continue;
                    }
                    self.cue = new VTTCue(0, 0, '');
                    self.state = 'CUE';
                    // 30-39 - Check if self line contains an optional identifier or timing data.
                    if (line.indexOf('-->') === -1) {
                      self.cue.id = line;
                      continue;
                    }
                  // Process line as start of a cue.
                  /*falls through*/
                  case 'CUE':
                    // 40 - Collect cue timings and settings.
                    try {
                      parseCue(line, self.cue, self.regionList);
                    } catch (e) {
                      // In case of an error ignore rest of the cue.
                      self.cue = null;
                      self.state = 'BADCUE';
                      continue;
                    }
                    self.state = 'CUETEXT';
                    continue;
                  case 'CUETEXT':
                    var hasSubstring = line.indexOf('-->') !== -1;
                    // 34 - If we have an empty line then report the cue.
                    // 35 - If we have the special substring '-->' then report the cue,
                    // but do not collect the line as we need to process the current
                    // one as a new cue.
                    if (!line || (hasSubstring && (alreadyCollectedLine = true))) {
                      // We are done parsing self cue.
                      if (self.oncue) {
                        self.oncue(self.cue);
                      }
                      self.cue = null;
                      self.state = 'ID';
                      continue;
                    }
                    if (self.cue.text) {
                      self.cue.text += '\n';
                    }
                    self.cue.text += line;
                    continue;
                  case 'BADCUE': // BADCUE
                    // 54-62 - Collect and discard the remaining cue.
                    if (!line) {
                      self.state = 'ID';
                    }
                    continue;
                }
              }
            } catch (e) {
              // If we are currently parsing a cue, report what we have.
              if (self.state === 'CUETEXT' && self.cue && self.oncue) {
                self.oncue(self.cue);
              }
              self.cue = null;
              // Enter BADWEBVTT state if header was not parsed correctly otherwise
              // another exception occurred so enter BADCUE state.
              self.state = self.state === 'INITIAL' ? 'BADWEBVTT' : 'BADCUE';
            }
            return this;
          },
          flush: function() {
            var self = this;
            try {
              // Finish decoding the stream.
              self.buffer += self.decoder.decode();
              // Synthesize the end of the current cue or region.
              if (self.cue || self.state === 'HEADER') {
                self.buffer += '\n\n';
                self.parse();
              }
              // If we've flushed, parsed, and we're still on the INITIAL state then
              // that means we don't have enough of the stream to parse the first
              // line.
              if (self.state === 'INITIAL') {
                throw new Error('Malformed WebVTT signature.');
              }
            } catch (e) {
              throw e;
            }
            if (self.onflush) {
              self.onflush();
            }
            return this;
          },
        };

        module.exports = VTTParser;
      },
      { './vttcue': 42 },
    ],
    44: [
      function(require, module, exports) {
        var oo = require('../lib/oo');
        var _ = require('../lib/object');
        var Cookie = require('../lib/cookie');
        var Data = require('../lib/data');
        var IO = require('../lib/io');
        var UA = require('../lib/ua');
        var CONF = require('../config');
        var eventType = require('../player/base/event/eventtype');

        var updateTime = 0;

        var EVENT = {
          INIT: 1001, // 初始化
          CLOSE: 1002, // 关闭播放器
          STARTFETCHDATA: 1003, //开始获取URL
          COMPLETEFETCHDATA: 1004, //结束获取URL
          STARTPLAY: 1005, //开始播放
          PLAY: 2001, // 可以开始播放
          STOP: 2002, // 停止，h5下指播放完毕
          PAUSE: 2003, // 暂停
          SEEK: 2004, // 拖动
          FULLSREEM: 2005, // 全屏
          QUITFULLSCREEM: 2006, // 退出全屏
          RESOLUTION: 2007, // 切换清晰度，h5暂时不实现
          RESOLUTION_DONE: 2008, // 切换清晰度完成，h5暂时不实现
          RECOVER: 2010, // 暂停恢复
          SEEK_END: 2011, // 拖动结束，h5暂时不实现
          LOADSTART: 2015, //当浏览器开始寻找指定的音频/视频时，会发生 loadstart 事件。即当加载过程开始时
          LOADEDMETADATA: 2016, //当指定的音频/视频的元数据已加载时
          LOADEDDATA: 2017, //当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时
          CANPLAY: 2018, //当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件
          CANPLAYTHROUGH: 2019, //播放器完全可以播放
          FETCHEDIP: 2020, //成功获取IP
          CDNDETECT: 2021, //CDN检测
          DETECT: 2022, //检测
          UNDERLOAD: 3002, // 卡顿
          LOADED: 3001, // 卡顿恢复
          HEARTBEAT: 9001, // 心跳，5秒间隔。  20170425 -- 30秒
          ERROR: 4001, // 发生错误
        };

        //实时监测id
        var checkIntervalInt;
        var checkTimeUpdate;

        var Monitor = oo.extend({
          /**
           * @param player  {Player} 播放器实例
           * @param options {Object} 监控的配置参数
           *     - lv      (log_version)     日志版本，初始版本为1
           *     - b       (bussiness_id)    业务方id, 初始为prism_aliyun, 输入参数from
           *     - lm      (live_mode)       直播点播区分：prism_live,prism_vod
           *     - t       (terminal_type)   终端类型
           *     - pv      (player_version)  播放器版本号，1
           *     - uuid    (uuid)            设备或机器id，h5保存在cookie中
           *     - v       (video_id)        视频id
           *     - u       (user_id)         用户id
           *     - s       (session_id)      播放行为id，一个视频正常播放后需要重置（动态生成）
           *     - e       (event_id)        事件id（动态生成）
           *     - args    (args)            事件携带参数
           *     - d       (definition)      清晰度
           *     - cdn_ip  (cdn_ip)          下载数据的cdn地址，h5无法设置host，这个字段无用，写死为0.0.0.0
           *     - ct      (client_timestamp) 客户端事件戳
           */

          /**
           * 2017-04-18 日志改版
           * @param player  {Player} 播放器实例
           * @param options {Object} 监控的配置参数
           *     - t       (time)             时间戳，毫秒级
           *     - ll      (log_level)        日志级别
           *     - lv      (log_version)      日志版本，初始版本为1
           *     - pd      (product)          player,pusher,mixer
           *     - md      (module)           saas,paas,mixer,publisher
           *     - hn      (hostname)         ip地址
           *     - bi      (business_id)      阿里云账号
           *     - ri      (session_id)       uuid
           *     - e       (event_id)         事件id（动态生成）
           *     - args    (args)             事件携带参数
           *     - vt      (video_type)       直播点播区分：prism_live,prism_vod
           *     - tt      (terminal_type)    终端类型
           *     - dm      (device_model)     设备型号
           *     - av      (app_version)      播放器版本号
           *     - uuid    (uuid)             设备或机器id，h5保存在cookie中
           *     - vu      (video_url)        推流或播放url，为避免url中有&等特殊字符，编码前要做urlencode
           *     - ua       (user_id)         用户id
           *     - dn       (definition)      清晰度
           *     - cdn_ip  (cdn_ip)           下载数据的cdn地址，h5无法设置host，这个字段无用，写死为0.0.0.0
           *     - r  (referer)               来源网站和链接信息 ／/to do
           */

          init: function(player, options, trackLog) {
            if (typeof trackLog == 'undefined') trackLog = true;
            this.trackLog = trackLog;
            this.player = player;
            this.requestId = '';
            this.sessionId = Data.guid();
            this.playId = 0;
            this.firstPlay = true;
            this.osName = UA.os.name;
            this.osVersion = UA.os.version || '';
            this.exName = UA.browser.name;
            this.exVersion = UA.browser.version || '';
            var po = this.player.getOptions();

            var h5_log_version = '1';
            var h5_bussiness_id = options.from ? options.from : '';
            var h5_live_mode = po.isLive ? 'prism_live' : 'prism_vod';

            var h5_product = 'player'; //po.isLive ? "pusher" : "player";
            var h5_video_type = po.isLive ? 'live' : 'vod';

            // default: pcweb
            var h5_terminal_type = 'pc';
            if (UA.IS_IPAD) {
              h5_terminal_type = 'pad';
            } else if (UA.os.phone) {
              h5_terminal_type = 'phone';
            }
            var referer = encodeURIComponent(UA.getReferer()),
              address = UA.getHref(),
              pageUrl = encodeURIComponent(address),
              app_n = '';
            if (address) {
              app_n = UA.getHost(address);
            }

            var h5_device_model = 'h5'; //UA.IS_PC ? 'pc_h5' : 'h5';
            var h5_player_version = CONF.h5Version;
            var h5_uuid = this._getUuid();
            var h5_video_id = po.source ? encodeURIComponent(po.source) : '';
            var video_cdn_name = UA.getHost(po.source);
            var h5_user_id = po.userId || '0';
            var h5_session_id = this.sessionId;
            var h5_event_id = '0';
            var h5_args = '0';
            var h5_definition = 'custom';
            var h5_cdn_ip = '0.0.0.0';
            var h5_local_ip = '0.0.0.0';
            var h5_client_timestamp = new Date().getTime();
            this._userNetInfo = {
              cdnIp: '',
              localIp: '',
            };

            var that = this;
            try {
              var reportError = function(err) {
                that._log('FETCHEDIP', {
                  error: err || '获取IP出错',
                });
              };
              var getLDNS = function(cb) {
                if (!that.trackLog) return;
                return IO.jsonp(
                  'https://cdn.dns-detect.alicdn.com/api/cdnDetectHttps?method=createDetectHttps',
                  function(data) {
                    if (data.content) {
                      return IO.jsonp(data.content, cb, reportError);
                    }
                  },
                  reportError,
                );
              };

              getLDNS(function(data) {
                if (data && data.content) {
                  h5_cdn_ip = that._userNetInfo.cdnIp = data.content.ldns;
                  h5_local_ip = that._userNetInfo.localIp = data.content.localIp;
                  that._log('FETCHEDIP', {
                    cdn_ip: h5_cdn_ip,
                    local_ip: h5_local_ip,
                  });
                }
              });
            } catch (e) {
              console.log(e);
            }

            this.opt = {
              APIVersion: '0.6.0',
              t: h5_client_timestamp,
              ll: 'info',
              lv: '1.0',
              pd: h5_product,
              md: 'saas_player',
              ui: 'saas_player',
              sm: 'play',
              os: this.osName,
              ov: this.osVersion,
              et: this.exName,
              ev: this.exVersion,
              uat: UA.USER_AGENT,
              hn: '0.0.0.0',
              bi: h5_bussiness_id,
              ri: h5_session_id,
              e: h5_event_id,
              args: h5_args,
              vt: h5_video_type,
              tt: h5_terminal_type,
              dm: h5_device_model,
              av: h5_player_version,
              uuid: h5_uuid,
              vu: h5_video_id,
              vd: video_cdn_name,
              ua: h5_user_id,
              dn: h5_definition,
              cdn_ip: h5_cdn_ip,
              app_n: app_n,
              r: referer,
              pu: pageUrl,
            };

            // this.opt = {
            //     APIVersion: '0.6.0',
            //     lv: h5_log_version,           //log_version
            //     b: h5_bussiness_id,           //business_id
            //     lm: h5_live_mode,             //live_mode
            //     t: h5_terminal_type,          //terminal_type
            //     m: h5_device_model,           //device_model
            //     pv: h5_player_version,        //player_version
            //     uuid: h5_uuid,                //uuid
            //     v: h5_video_id,               //video_id
            //     u: h5_user_id,                //user_id
            //     s: h5_session_id,             //session_id
            //     e: h5_event_id,               //event_id
            //     args: h5_args,                //args
            //     d: h5_definition,             //definition
            //     cdn_ip: h5_cdn_ip,            //cdn_ip
            //     ct: h5_client_timestamp,      //client_timestamp
            // };

            this.bindEvent();
          },
          //更新视频信息,当播放器实例不变,播放内容更换时使用
          updateVideoInfo: function(options) {
            var h5_bussiness_id = options.from ? options.from : '';
            this.opt.bi = h5_bussiness_id;
            this.updateSourceInfo();
          },

          updateSourceInfo: function() {
            var po = this.player.getOptions();
            if (!po) {
              return;
            }
            var h5_video_id = po.source ? encodeURIComponent(po.source) : '';
            var video_cdn_name = UA.getHost(po.source);
            this.opt.vu = h5_video_id;
            this.opt.vd = video_cdn_name;
          },

          //event
          bindEvent: function() {
            var that = this;
            this.player.on(eventType.Player.Init, function() {
              that._onPlayerInit();
            });
            window.addEventListener('beforeunload', function() {
              that._onPlayerClose();
            });
            this.player.on(eventType.Video.LoadStart, function() {
              that.loadstartTime = new Date().getTime();
              that._onPlayerloadstart();
            });
            this.player.on(eventType.Video.LoadedMetadata, function() {
              that._onPlayerLoadMetadata();
            });
            this.player.on(eventType.Video.LoadedData, function() {
              that._onPlayerLoaddata();
            });

            this.player.on(eventType.Video.Play, function() {
              that._onPlayerPlay();
            });
            this.player.on(eventType.Player.Ready, function() {
              that._onPlayerReady();
            });
            this.player.on(eventType.Video.Ended, function() {
              that._onPlayerFinish();
            });
            this.player.on(eventType.Video.Pause, function() {
              that._onPlayerPause();
            });
            //this.player.on('seeking',      function(e){that._onPlayerSeekStart(e);});
            //this.player.on('seeked',       function(e){that._onPlayerSeekEnd(e);});
            this.player.on(eventType.Private.SeekStart, function(e) {
              that._onPlayerSeekStart(e);
            });
            this.player.on(eventType.Private.EndStart, function(e) {
              that._onPlayerSeekEnd(e);
            });
            this.player.on(eventType.Player.Waiting, function() {
              that._onPlayerLoaded();
            });
            this.player.on(eventType.Video.CanPlayThrough, function() {
              that._onPlayerUnderload();
            });
            this.player.on(eventType.Video.CanPlay, function() {
              that._onPlayerCanplay();
            });
            //this.player.on('canplay',        function() {that._onPlayerUnderload();});
            //this.player.on('timeupdate',     function() {that._onPlayerHeartBeat();});
            this.player.on(eventType.Player.Error, function() {
              that._onPlayerError();
            });
            this.player.on(eventType.Player.RequestFullScreen, function() {
              that._onFullscreenChange(1);
            });
            this.player.on(eventType.Player.CancelFullScreen, function() {
              that._onFullscreenChange(0);
            });
            // this.player.on('qualitychange', function() {that._onPlayerSwitchResolution()});

            checkIntervalInt = setInterval(function() {
              // 卡顿开始
              if (that.player.readyState() === 2 || that.player.readyState() === 3) {
                that._onPlayerLoaded();
                //alert("state_buffer");
                // 卡顿恢复
              } else if (that.player.readyState() === 4) {
                that._onPlayerUnderload();
              }
            }, 100);

            checkTimeUpdate = setInterval(function() {
              if (!that.player.getCurrentTime()) {
                return;
              }

              var currTime = Math.floor(that.player.getCurrentTime() * 1000);
              if (that.player.paused()) {
                return;
              }
              updateTime++;
              if (updateTime >= 30) {
                that._log('HEARTBEAT', {
                  vt: currTime,
                  interval: updateTime * 1000,
                });
                updateTime = 0;
              }
            }, 1000);
          },

          removeEvent: function() {
            var that = this;
            this.player.off('init');
            this.player.off('ready');
            this.player.off('ended');
            this.player.off('play');
            this.player.off('pause');
            this.player.off('seekStart');
            this.player.off('seekEnd');
            this.player.off('canplaythrough');
            //this.player.off('timeupdate', function() {that._onPlayerHeartBeat();});
            this.player.off('error');
            this.player.off('fullscreenchange');
            //this.player.off('qualitychange');

            clearInterval(checkIntervalInt);
          },

          _onFullscreenChange: function(isFullScreen) {
            if (isFullScreen) {
              this._log('FULLSREEM', {});
            } else {
              this._log('QUITFULLSCREEM', {});
            }
          },

          _onPlayerloadstart: function() {
            this.playId = Data.guid();
            this._log('LOADSTART', {
              pt: new Date().getTime(),
            });
          },

          _onPlayerLoadMetadata: function() {
            this._log('LOADEDMETADATA', {
              cost: new Date().getTime() - this.loadstartTime,
            });
          },

          _onPlayerLoaddata: function() {
            this._LoadedData = true;
            this._log('LOADEDDATA', {
              cost: new Date().getTime() - this.loadstartTime,
            });
            this._reportPlay();
          },

          _onPlayerCanplay: function() {
            this._log('CANPLAY', {
              pt: new Date().getTime() - this.loadstartTime,
            });
          },

          //init
          _onPlayerInit: function() {
            // 重置sessionId
            this._log('INIT', {});
            this.buffer_flag = 0; //after first play, set 1
            this.pause_flag = 0; //pause status
          },

          //beforeunload
          _onPlayerClose: function() {
            this._log('CLOSE', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
            });
          },

          //ready
          _onPlayerReady: function() {
            //保存开始播放时间戳
            this.startTimePlay = new Date().getTime();
          },

          //end
          _onPlayerFinish: function() {
            this._log('STOP', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
            });
            // 重置sessionId
            this.sessionId = Data.guid();
            this.playId = 0;
          },

          _reportPlay: function() {
            //若为autoplay,点击开始才上报2001
            if (
              !this.buffer_flag &&
              this.player._options &&
              this.player._options.autoplay &&
              this._LoadedData
            ) {
              this.first_play_time = new Date().getTime();
              this._log('PLAY', {
                dsm: 'fix',
                vt: 0,
                start_cost: this.first_play_time - this.player.getReadyTime(),
              });
              this.buffer_flag = 1;
              return true;
            }
            return false;
          },

          //play
          _onPlayerPlay: function() {
            this._log('STARTPLAY', {});
            if (this.playId == 0) {
              this.playId = Data.guid();
            }
            // 重置sessionId
            if (!this.firstPlay && this.pause_flag == 0 && !this.seeking) {
              this.sessionId = Data.guid();
            }
            this.firstPlay = false;
            if (this._reportPlay()) {
              return;
            }

            //忽略播放前的暂停
            if (!this.buffer_flag) return;
            //若非暂停则返回
            if (!this.pause_flag) return;
            this.pause_flag = 0;
            this.pauseEndTime = new Date().getTime();
            this._log('RECOVER', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
              cost: this.pauseEndTime - this.pauseTime,
            });
          },

          //pause
          _onPlayerPause: function() {
            //忽略播放前的暂停
            if (!this.buffer_flag) return;
            //未赋值不记录暂停
            if (!this.startTimePlay) return;
            //忽略seek时的暂停
            if (this.seeking) return;
            this.pause_flag = 1;
            this.pauseTime = new Date().getTime();
            this._log('PAUSE', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
            });
          },

          //seekstart
          _onPlayerSeekStart: function(e) {
            this.seekStartTime = e.paramData.fromTime;
            this.seeking = true;
            this.seekStartStamp = new Date().getTime();
          },

          //seekend
          _onPlayerSeekEnd: function(e) {
            this.seekEndStamp = new Date().getTime();
            this._log('SEEK', {
              drag_from_timestamp: Math.floor(this.seekStartTime * 1000),
              drag_to_timestamp: Math.floor(e.paramData.toTime * 1000),
            });
            this._log('SEEK_END', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
              cost: this.seekEndStamp - this.seekStartStamp,
            });
            this.seeking = false;
          },

          //waiting
          _onPlayerLoaded: function() {
            // 第一次播放前不记录卡顿，卡顿不置位，不产生卡顿恢复
            if (!this.buffer_flag) return;
            //未赋值不记录卡顿
            if (!this.startTimePlay) return;
            // 已经处于卡顿或者拖拽过程中不去记录卡顿
            if (this.stucking || this.seeking) return;

            // 如果卡顿在开始播放1s以内发生则忽略
            this.stuckStartTime = new Date().getTime();
            //console.log(this.stuckStartTime);
            //console.log(this.startTimePlay);
            if (this.stuckStartTime - this.startTimePlay <= 1000) return;

            //alert("load_buffer");
            this.stucking = true;
            this._log('UNDERLOAD', {
              vt: Math.floor(this.player.getCurrentTime() * 1000),
            });
            this.stuckStartTime = new Date().getTime();
          },

          //canplaythrough, canplay:有些浏览器没有
          _onPlayerUnderload: function() {
            //卡顿恢复
            //第一次恢复,并且非自动播放，认为开始播放,(自动播放会提起load数据，导致上报过早)
            if (!this.buffer_flag && this.player._options && !this.player._options.autoplay) {
              this.first_play_time = new Date().getTime();
              this._log('PLAY', {
                play_mode: 'fix',
                vt: 0,
                start_cost: this.first_play_time - this.player.getReadyTime(),
              });
              this.buffer_flag = 1;
              return;
            }

            //若未开播，且autoplay,则返回
            if (!this.buffer_flag && this.player._options && this.player._options.autoplay) return;

            // 如果当前不在卡顿中，或者在拖拽过程中，不应该记录卡顿恢复
            if (!this.stucking || this.seeking) return;

            var currTime = Math.floor(this.player.getCurrentTime() * 1000),
              startTime = this.stuckStartTime || new Date().getTime(),
              cost = Math.floor(new Date().getTime() - startTime);

            if (cost < 0) cost = 0;
            this._log('LOADED', {
              vt: currTime,
              cost: cost,
            });
            this.stucking = false;
          },

          _onPlayerHeartBeat: function() {
            // 拖拽过程中不去记录心跳
            if (this.seeking) return;

            var currTime = Math.floor(this.player.getCurrentTime() * 1000),
              that = this;

            if (!this.timer) {
              this.timer = setTimeout(function() {
                !that.seeking &&
                  that._log('HEARTBEAT', {
                    progress: currTime,
                  });
                clearTimeout(that.timer);
                that.timer = null;
              }, 60000);
            }

            console.log('timeupdate');
          },

          //error
          _onPlayerError: function() {
            this.playId = 0;
          },

          _log: function(eventType, extCfg) {
            if (!this.trackLog) {
              return;
            }
            this.updateSourceInfo();
            var cfg = _.copy(this.opt);
            this.requestId = Data.guid();
            if (eventType == 'ERROR' && eventType != 'FETCHEDIP' && eventType != 'CDNDETECT') {
              var that = this;
              IO.jsonp(
                'https://cdn.dns-detect.alicdn.com/api/cdnDetectHttps?method=createDetectHttps',
                function(data) {
                  that._log('CDNDETECT', {
                    flag: 0,
                    error: '',
                    eri: that.requestId,
                  });
                },
                function(err) {
                  that._log('CDNDETECT', {
                    flag: 1,
                    error: err || '访问CDN错误',
                    eri: that.requestId,
                  });
                },
              );
            }

            //var url='//log.video.taobao.com/stat/';
            //var url='//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track';
            var url = CONF.logReportTo;

            cfg.e = EVENT[eventType];
            // cfg.s = this.sessionId;
            // cfg.ct = new Date().getTime();

            //2017-04-18 新版日志

            cfg.ri = this.sessionId; //每次请求ID不一样
            cfg.t = new Date().getTime();
            cfg.cdn_ip = this._userNetInfo.cdnIp;
            cfg.hn = this._userNetInfo.localIp;
            var qualityInfo = this.player.getCurrentQuality();
            if (qualityInfo != '') {
              cfg.definition = qualityInfo.definition;
            }

            var args_params = [];
            _.each(extCfg, function(k, v) {
              args_params.push(k + '=' + v);
            });
            var vid = '';
            var op = this.player.getOptions();
            if (op && op.vid) {
              vid = op.vid;
            }
            args_params.push('vid=' + vid);

            try {
              if (Aliplayer && Aliplayer.__logCallback__) {
                cfg.args = args_params;
                Aliplayer.__logCallback__(cfg);
              }
            } catch (e) {
              console.log(e);
            }

            args_params = args_params.join('&');

            if (args_params == '') {
              args_params = '0';
            }
            cfg.args = encodeURIComponent(args_params);

            /*
        if (extCfg.vt) {
            extCfg.vt = Math.round(extCfg.vt);
        }
        if (extCfg.cost) {
            extCfg.cost = Math.round(extCfg.cost);
        }

        extCfg.systs = new Date().getTime();

        cfg = _.merge(cfg, extCfg);
        */

            var params = [];
            _.each(cfg, function(k, v) {
              params.push(k + '=' + v);
            });
            params = params.join('&');
            IO.jsonp(
              url + '?' + params,
              function() {},
              function() {},
            );
            return this.sessionId;
          },

          /**
           * 唯一表示播放器的id缓存在cookie中
           */
          _getUuid: function() {
            // p_h5_u表示prism_h5_uuid
            var uuid = Cookie.get('p_h5_u');

            if (!uuid) {
              uuid = Data.guid();
              Cookie.set('p_h5_u', uuid, 730);
            }

            return uuid;
          },
        });

        module.exports = Monitor;
      },
      {
        '../config': 11,
        '../lib/cookie': 22,
        '../lib/data': 23,
        '../lib/io': 30,
        '../lib/object': 32,
        '../lib/oo': 33,
        '../lib/ua': 38,
        '../player/base/event/eventtype': 48,
      },
    ],
    45: [
      function(require, module, exports) {
        var Player = require('./base/player');
        var FlashPlayer = require('./flash/flashplayer');
        var MtsPlayer = require('./saas/mtsplayer');
        var VodPlayer = require('./saas/vodplayer');
        var TaoTVPlayer = require('./taotv/taotvplayer');
        var AudioPlayer = require('./audio/audioplayer');
        var HlsPlayer = require('./hls/hlsplayer');
        var FlvPlayer = require('./flv/flvplayer');
        var DrmPlayer = require('./drm/drmplayer');
        var UA = require('../lib/ua');
        var playerUtil = require('../lib/playerutil');
        var Dom = require('../lib/dom');
        var IO = require('../lib/io');
        var lang = require('../lang/index');

        module.exports.create = function(opt, ready) {
          if (typeof ready != 'function') {
            ready = function() {};
          }
          opt.readyCallback = ready;
          lang.setCurrentLanguage(opt.language, 'h5', opt.languageTexts);
          var option = playerUtil.handleOption(opt);

          var src = option.source,
            isAudio = playerUtil.isAudio(src);
          if (isAudio) {
            option.height = 'auto';
            option.mediaType = 'audio';
          }
          var tag = playerUtil.createWrapper(option);
          //如果tag已指向一个存在的player，则返回这个player实例
          //否则初始化播放器
          if (tag['player']) return tag['player'];
          var player;
          if (isAudio) {
            player = new AudioPlayer(tag, option);
          } else if (!option.useFlashPrism && playerUtil.isFlv(src) && playerUtil.isSupportFlv()) {
            player = new FlvPlayer(tag, option);
          } else if (!UA.IS_MOBILE && (option.useFlashPrism || playerUtil.isRTMP(src))) {
            player = new FlashPlayer(tag, option);
          } else if (option.vid && !option.source) {
            if (option.authInfo) {
              player = new MtsPlayer(tag, option);
            } else if (option.playauth || (option.accessKeyId && option.accessKeySecret)) {
              player = new VodPlayer(tag, option);
            } else {
              player = new TaoTVPlayer(tag, option);
            }
          } else if (playerUtil.isDash(src) && playerUtil.isSupportMSE()) {
            player = new DrmPlayer(tag, option);
          } else if (playerUtil.isHls(src)) {
            if (playerUtil.canPlayHls()) {
              if (
                playerUtil.isSupportHls() &&
                (playerUtil.isUsedHlsPluginOnMobile() ||
                  playerUtil.isSafariUsedHlsPlugin(option.useHlsPluginForSafari))
              ) {
                player = new HlsPlayer(tag, option);
              } else {
                player = new Player(tag, option);
              }
            } else if (playerUtil.isSupportHls()) {
              player = new HlsPlayer(tag, option);
            } else if (!UA.os.pc) {
              player = new Player(tag, option);
            } else if (!option.userH5Prism && !option.useH5Prism) {
              player = new FlashPlayer(tag, option);
            }
          } else if (!UA.os.pc) {
            player = new Player(tag, option);
          } else {
            player = new Player(tag, option);
          }

          return player;
        };
      },
      {
        '../lang/index': 17,
        '../lib/dom': 24,
        '../lib/io': 30,
        '../lib/playerutil': 35,
        '../lib/ua': 38,
        './audio/audioplayer': 46,
        './base/player': 67,
        './drm/drmplayer': 74,
        './flash/flashplayer': 75,
        './flv/flvplayer': 77,
        './hls/hlsplayer': 79,
        './saas/mtsplayer': 83,
        './saas/vodplayer': 89,
        './taotv/taotvplayer': 98,
      },
    ],
    46: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var Component = require('../../ui/component');
        var Dom = require('../../lib/dom');
        var _ = require('../../lib/object');
        var playerUtil = require('../../lib/playerutil');

        var AudioPlayer = BasePlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            var that = this;
            this._isAudio = true;
            if (typeof options.skinLayout == 'undefined') {
              options.skinLayout = playerUtil.defaultAudioLayout;
            }
            BasePlayer.call(this, tag, options);
          },
        });

        AudioPlayer.prototype.createEl = function() {
          if (this.tag.tagName !== 'AUDIO') {
            this._el = this.tag;
            this.tag = Component.prototype.createEl.call(this, 'audio');
          }

          var el = this._el,
            tag = this.tag,
            that = this;

          //该audio已经被初始化为播放器
          tag['player'] = this;

          //把audio标签上的属性转移到外围容器上
          var attrs = Dom.getElementAttributes(tag);

          _.each(attrs, function(attr) {
            el.setAttribute(attr, attrs[attr]);
          });

          //设置video标签属性
          this.setVideoAttrs();

          // 把video标签包裹在el这个容器中
          if (tag.parentNode) {
            tag.parentNode.insertBefore(el, tag);
          }
          Dom.insertFirst(tag, el); // Breaks iPhone, fixed in HTML5 setup.*''

          return el;
        };

        module.exports = AudioPlayer;
      },
      {
        '../../lib/dom': 24,
        '../../lib/object': 32,
        '../../lib/playerutil': 35,
        '../../ui/component': 99,
        '../base/player': 67,
      },
    ],
    47: [
      function(require, module, exports) {
        var Event = require('../../../lib/event');
        var EventType = require('./eventtype');
        var videoHandler = require('../eventHandler/video/index');
        var playerHandler = require('../eventHandler/player/index');

        module.exports.offAll = function(player) {
          var tag = player.tag,
            el = player._el;
          for (var type in EventType.Video) {
            Event.off(tag, EventType.Video[type]);
          }
          for (var playerType in EventType.Player) {
            Event.off(el, EventType.Player[playerType]);
          }
          for (var privateType in EventType.Private) {
            Event.off(el, EventType.Private[privateType]);
          }
        };

        module.exports.onAll = function(player) {
          videoHandler.bind(player);
          playerHandler.bind(player);
        };
      },
      {
        '../../../lib/event': 25,
        '../eventHandler/player/index': 52,
        '../eventHandler/video/index': 61,
        './eventtype': 48,
      },
    ],
    48: [
      function(require, module, exports) {
        var videoEventType = {
          TimeUpdate: 'timeupdate',
          Play: 'play',
          playing: 'playing',
          Pause: 'pause',
          CanPlay: 'canplay',
          Waiting: 'waiting',
          Ended: 'ended',
          Error: 'error',
          Suspend: 'suspend',
          Stalled: 'stalled',
          LoadStart: 'loadstart',
          DurationChange: 'durationchange',
          LoadedData: 'loadeddata',
          LoadedMetadata: 'loadedmetadata',
          Progress: 'progress',
          CanPlayThrough: 'canplaythrough',
          ContextMenu: 'contextmenu',
          Seeking: 'seeking',
          Seeked: 'seeked',
          ManualEnded: 'manualended',
        };

        var playerEventType = {
          TimeUpdate: 'timeupdate',
          DurationChange: 'durationchange',
          Init: 'init',
          Ready: 'ready',
          Play: 'play',
          Pause: 'pause',
          CanPlay: 'canplay',
          Waiting: 'waiting',
          Ended: 'ended',
          Error: 'error',
          RequestFullScreen: 'requestFullScreen',
          CancelFullScreen: 'cancelFullScreen',
          Snapshoted: 'snapshoted',
          Snapshoting: 'snapshoting',
          OnM3u8Retry: 'onM3u8Retry',
          LiveStreamStop: 'liveStreamStop',
          AutoPlayPrevented: 'autoPlayPrevented',
          StartSeek: 'startSeek',
          CompleteSeek: 'completeSeek',
          TextTrackReady: 'textTrackReady',
          AudioTrackReady: 'audioTrackReady',
          AudioTrackUpdated: 'audioTrackUpdated',
          LevelsLoaded: 'levelsLoaded',
          AudioTrackSwitch: 'audioTrackSwitch',
          AudioTrackSwitched: 'audioTrackSwitched',
          LevelSwitch: 'levelSwitch',
          LevelSwitched: 'levelSwitched',
        };

        var privateEventType = {
          Play_Btn_Show: 'play_btn_show',
          UiH5Ready: 'uiH5Ready',
          Error_Hide: 'error_hide',
          Error_Show: 'error_show',
          Info_Show: 'info_show',
          Info_Hide: 'info_hide',
          H5_Loading_Show: 'h5_loading_show',
          H5_Loading_Hide: 'h5_loading_hide',
          HideProgress: 'hideProgress',
          CancelHideProgress: 'cancelHideProgress',
          Click: 'click',
          MouseOver: 'mouseover',
          MouseOut: 'mouseout',
          MouseEnter: 'mouseenter',
          MouseLeave: 'mouseleave',
          TouchStart: 'touchstart',
          TouchMove: 'touchmove',
          TouchEnd: 'touchend',
          HideBar: 'hideBar',
          ShowBar: 'showBar',
          ReadyState: 'readyState',
          SourceLoaded: 'sourceloaded',
          QualityChange: 'qualitychange',
          Play_Btn_Hide: 'play_btn_hide',
          Cover_Hide: 'cover_hide',
          Cover_Show: 'cover_show',
          SeekStart: 'seekStart',
          EndStart: 'endStart',
          UpdateProgressBar: 'updateProgressBar',
          LifeCycleChanged: 'lifeCycleChanged',
          Dispose: 'dispose',
          Created: 'created',
          Snapshot_Hide: 'snapshot_hide',
          AutoStreamShow: 'auto_stream_show',
          AutoStreamHide: 'auto_stream_hide',
          VolumnChanged: 'volumnchanged',
          LiveShiftQueryCompleted: 'liveShiftQueryCompleted',
          StreamSelectorHide: 'streamSelectorHide',
          SpeedSelectorHide: 'speedSelectorHide',
          SettingShow: 'settingShow',
          SettingHide: 'settingHide',
          SelectorShow: 'selectorShow',
          SelectorHide: 'selectorHide',
          SettingListShow: 'settingListShow',
          SettingListHide: 'settingListHide',
          ThumbnailHide: 'thumbnailHide',
          ThumbnailShow: 'thumbnailShow',
          ThumbnailLoaded: 'thumbnailLoaded',
          TooltipShow: 'tooltipShow',
          TooltipHide: 'tooltipHide',
          SelectorUpdateList: 'selectorUpdateList',
          SelectorValueChange: 'selectorValueChange',
          VolumeVisibilityChange: 'volumeVisibilityChange',
          ChangeURL: 'changeURL',
          UpdateToSettingList: 'updateToSettingList',
          CCChanged: 'CCChanged',
          CCStateChanged: 'CCStateChanged',
          PlayClick: 'click',
        };

        module.exports = {
          Video: videoEventType,
          Player: playerEventType,
          Private: privateEventType,
        };
      },
      {},
    ],
    49: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var Dom = require('../../../../lib/dom');
        var UA = require('../../../../lib/ua');

        module.exports.handle = function() {
          var that = this;

          if (!UA.IS_IOS) {
            Dom.removeClass(that.el(), 'prism-fullscreen');
          }
        };
      },
      { '../../../../lib/dom': 24, '../../../../lib/ua': 38, '../../event/eventtype': 48 },
    ],
    50: [
      function(require, module, exports) {
        var eventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          if (!e.paramData.notPlay) {
            that.play();
          }
          that._seeking = false;
          that.trigger(eventType.Player.CompleteSeek, e.paramData.toTime);
        };
      },
      { '../../event/eventtype': 48 },
    ],
    51: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var constants = require('../../../../lib/constants');
        var lang = require('../../../../lang/index');

        module.exports.handle = function(e) {
          var that = this;
          var paramData = e.paramData;
          that.trigger(EventType.Private.H5_Loading_Hide);
          that.trigger(EventType.Private.Cover_Hide);
          that.trigger(EventType.Private.Play_Btn_Hide);
          that.trigger(EventType.Private.SettingListHide);
          that.trigger(EventType.Private.SelectorHide);
          that.trigger(EventType.Private.VolumeVisibilityChange, '');

          paramData = paramData || {};
          if (that._monitor) {
            paramData.uuid = that._monitor._getUuid();
            paramData.requestId = that._serverRequestId;
            paramData.cdnIp = that._monitor._userNetInfo.cdnIp;
            paramData.localIp = that._monitor._userNetInfo.localIp;
          }

          that._isError = true;

          that.trigger(EventType.Private.Error_Show, paramData);
          that.trigger(EventType.Private.LifeCycleChanged, {
            type: EventType.Player.Error,
            data: paramData,
          });
        };
      },
      {
        '../../../../lang/index': 17,
        '../../../../lib/constants': 21,
        '../../event/eventtype': 48,
      },
    ],
    52: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var Event = require('../../../../lib/event');
        var commonHandle = require('./lifecyclecommon');

        var playerHandlers = {
          endStart: require('./endstart'),
          seekStart: require('./seekstart'),
          requestFullScreen: require('./requestfullscreen'),
          cancelFullScreen: require('./cancelfullscreen'),
          error: require('./error'),
        };

        var bindEventTypes = [
          EventType.Private.EndStart,
          EventType.Private.SeekStart,
          EventType.Player.RequestFullScreen,
          EventType.Player.CancelFullScreen,
          EventType.Player.Error,
          EventType.Player.Ready,
          EventType.Private.Dispose,
          EventType.Private.Created,
        ];

        var register = function(player, type, handler) {
          var el = player.el();
          Event.on(el, type, function(e) {
            var handle;
            if (handler && handler.handle) {
              handle = handler.handle;
            } else {
              handle = commonHandle.handle;
            }
            handle.call(player, e, type);
          });
        };

        module.exports.bind = function(player) {
          var el = player.el();
          for (var i = 0; i < bindEventTypes.length; i++) {
            var type = bindEventTypes[i];
            if (playerHandlers[type] != 'undefined') {
              register(player, type, playerHandlers[type]);
            }
          }
        };
      },
      {
        '../../../../lib/event': 25,
        '../../event/eventtype': 48,
        './cancelfullscreen': 49,
        './endstart': 50,
        './error': 51,
        './lifecyclecommon': 53,
        './requestfullscreen': 54,
        './seekstart': 55,
      },
    ],
    53: [
      function(require, module, exports) {
        var eventType = require('../../event/eventtype');

        module.exports.handle = function(e, type) {
          var that = this;
          that.trigger(eventType.Private.LifeCycleChanged, { type: type, data: e });
        };
      },
      { '../../event/eventtype': 48 },
    ],
    54: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var Dom = require('../../../../lib/dom');
        var UA = require('../../../../lib/ua');

        module.exports.handle = function() {
          var that = this;
          if (!UA.IS_IOS) {
            Dom.addClass(that.el(), 'prism-fullscreen');
          }
        };
      },
      { '../../../../lib/dom': 24, '../../../../lib/ua': 38, '../../event/eventtype': 48 },
    ],
    55: [
      function(require, module, exports) {
        var eventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that._seeking = true;
          that.trigger(eventType.Player.StartSeek, e.paramData.fromTime);
        };
      },
      { '../../event/eventtype': 48 },
    ],
    56: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that._retrySwitchUrlCount = 0;
          that._liveRetryCount = 0;
          that._clearLiveErrorHandle();
          var time = new Date().getTime() - that.readyTime;
          that.trigger(EventType.Player.CanPlay, {
            loadtime: time,
          });
        };
      },
      { '../../event/eventtype': 48 },
    ],
    57: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var Dom = require('../../../../lib/dom');
        var UA = require('../../../../lib/ua');

        module.exports.handle = function(e) {
          var that = this;
          that.trigger(EventType.Private.Cover_Hide);
          var tag = that.tag;
          if (tag.style.display === 'none' && UA.IS_IOS) {
            setTimeout(function() {
              Dom.css(tag, 'display', 'block');
            }, 100);
          }

          that.trigger(EventType.Video.CanPlayThrough);
        };
      },
      { '../../../../lib/dom': 24, '../../../../lib/ua': 38, '../../event/eventtype': 48 },
    ],
    58: [
      function(require, module, exports) {
        module.exports.handle = function(e, eventType) {
          var that = this;
          var data = '';
          if (e && e.paramData) {
            data = e.paramData;
          }
          that.trigger(eventType, data);
        };
      },
      {},
    ],
    59: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var lang = require('../../../../lang/index');

        module.exports.handle = function(e) {
          var that = this;
          that.waiting = false;
          if (that._options.rePlay) {
            that.seek(0);
            that.tag.play();
          } else if (that._options.isLive) {
            that.trigger(EventType.Private.H5_Loading_Hide);
            //that.trigger(EventType.Private.Info_Show, lang.get('Live_End'));
          }
          that.trigger(EventType.Player.Ended);
        };
      },
      { '../../../../lang/index': 17, '../../event/eventtype': 48 },
    ],
    60: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var UA = require('../../../../lib/ua');
        var playerUtil = require('../../../../lib/playerutil');
        var constants = require('../../../../lib/constants');
        var lang = require('../../../../lang/index');

        module.exports.handle = function(e) {
          var that = this;
          that.waiting = false;
          that._clearTimeout();
          if (!that.checkOnline()) {
            return;
          }
          var errcode = '',
            srcElement = e.target || e.srcElement,
            innerErrorMsg = srcElement.error.message,
            code,
            errcode = '';
          if (srcElement.error.code) {
            code = srcElement.error.code;
            errcode = constants.VideoErrorCode[srcElement.error.code];
            innerErrorMsg = code + ' || ' + innerErrorMsg;
          }
          if (that._options.isLive) {
            if (that._options.liveRetry > that._liveRetryCount) {
              that._reloadAndPlayForM3u8();
            } else {
              that._liveRetryCount = 0;
              that.trigger(EventType.Player.LiveStreamStop);
              that._liveErrorHandle = setTimeout(function() {
                var paramData = {
                  mediaId: 'ISLIVE',
                  error_code: errcode,
                  error_msg: lang.get('Error_Play_Text') + '，' + lang.get('Error_Retry_Text'),
                };
                that.logError(paramData);
                that.trigger('error', paramData);
              }, 500);
            }
          } else {
            var msg = lang.get('Error_Play_Text'),
              isSwitch = false,
              notPopError = false;
            if (code < 4) {
              if (code == 3 && that._firstDecodeError) {
                var time = that.getCurrentTime() + 1;
                that._loadByUrlInner(that._options.source, time, true);
                that._firstDecodeError = false;
                return;
              }
              msg = constants.VideoErrorCodeText[code];
            } else {
              if (that._eventState == constants.SUSPEND) {
                msg = lang.get('Error_Load_Abort_Text');
                errcode = constants.ErrorCode.RequestDataError;
              } else if (that._eventState == constants.LOAD_START) {
                msg = lang.get('Error_Network_Text');
                if (that._options.source.indexOf('auth_key') > 0) {
                  msg = msg + '，' + lang.get('Error_AuthKey_Text');
                }
                errcode = constants.ErrorCode.StartLoadData;
              } else if (that._eventState == constants.LOADED_METADATA) {
                msg = lang.get('Error_Play_Text');
                errcode = constants.ErrorCode.PlayingError;
              }
            }
            msg = msg + '，' + lang.get('Error_Retry_Text');
            if (
              that._urls.length > 1 &&
              that._retrySwitchUrlCount < 3 &&
              that._options.source.indexOf('.mpd') == -1
            ) {
              that.switchUrl();
              notPopError = true;
            }

            var paramData = {
              mediaId: that._options.vid ? that._options.vid : '',
              error_code: errcode,
              error_msg: innerErrorMsg,
            };

            that.logError(paramData);
            paramData.display_msg = msg;
            if (!notPopError) {
              that.trigger(EventType.Player.Error, paramData);
            }
          }
        };
      },
      {
        '../../../../lang/index': 17,
        '../../../../lib/constants': 21,
        '../../../../lib/playerutil': 35,
        '../../../../lib/ua': 38,
        '../../event/eventtype': 48,
      },
    ],
    61: [
      function(require, module, exports) {
        var Event = require('../../../../lib/event');
        var EventType = require('../../event/eventtype');

        var videoHandlers = {
          canplay: require('./canplay'),
          canplaythrough: require('./canplaythrough'),
          common: require('./common'),
          ended: require('./ended'),
          error: require('./error'),
          pause: require('./pause'),
          play: require('./play'),
          playing: require('./playing'),
          waiting: require('./waiting'),
          timeupdate: require('./timeupdate'),
          manualended: require('./ended'),
        };

        var register = function(player, typeName, handler) {
          var tag = player.tag;
          Event.on(tag, typeName, function(e) {
            handler.handle.call(player, e, typeName);
            if (typeName != EventType.Video.Error) {
              if (typeName == EventType.Video.ManualEnded) {
                typeName = EventType.Video.Ended;
              }
              player.trigger(EventType.Private.LifeCycleChanged, { type: typeName, data: e });
            }
          });
        };

        module.exports.bind = function(player) {
          var tag = player.tag,
            handler = null;
          for (var type in EventType.Video) {
            var typeName = EventType.Video[type];
            if (typeof videoHandlers[typeName] != 'undefined') {
              handler = videoHandlers[typeName];
            } else {
              handler = videoHandlers['common'];
            }

            register(player, typeName, handler);
          }
        };
      },
      {
        '../../../../lib/event': 25,
        '../../event/eventtype': 48,
        './canplay': 56,
        './canplaythrough': 57,
        './common': 58,
        './ended': 59,
        './error': 60,
        './pause': 62,
        './play': 63,
        './playing': 64,
        './timeupdate': 65,
        './waiting': 66,
      },
    ],
    62: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that._clearTimeout();
          that.trigger(EventType.Private.AutoStreamHide);
          that.trigger(EventType.Player.Pause);
          that.waiting = false;
        };
      },
      { '../../event/eventtype': 48 },
    ],
    63: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that.trigger(EventType.Private.Error_Hide);
          that.trigger(EventType.Private.Cover_Hide);
          that.trigger(EventType.Private.AutoStreamHide);
          that.waiting = false;
          that.trigger(EventType.Player.Play);
        };
      },
      { '../../event/eventtype': 48 },
    ],
    64: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that.trigger(EventType.Private.H5_Loading_Hide);
          that.trigger(EventType.Private.Cover_Hide);
          that.trigger(EventType.Private.Info_Hide);
          that.waiting = false;
          that._liveRetryCount = 0;
          that._firstDecodeError = true;
          if (that._checkTimeoutHandle) {
            clearTimeout(that._checkTimeoutHandle);
          }
          if (that._waitingTimeoutHandle) {
            clearTimeout(that._waitingTimeoutHandle);
          }
          that.trigger(EventType.Private.AutoStreamHide);
          that.trigger(EventType.Player.Playing);
          that.trigger(EventType.Private.Play_Btn_Hide);
          that.trigger(EventType.Private.Error_Hide);
        };
      },
      { '../../event/eventtype': 48 },
    ],
    65: [
      function(require, module, exports) {
        var eventType = require('../../event/eventtype');

        module.exports.handle = function(e) {
          var that = this;
          that.trigger(eventType.Player.TimeUpdate, e.timeStamp);
          var currentTime = this.getCurrentTime();
          if (that.waiting && !that._TimeUpdateStamp) {
            that._TimeUpdateStamp = currentTime;
          }
          if (that.waiting == false || that._TimeUpdateStamp != currentTime) {
            that.trigger(eventType.Private.H5_Loading_Hide);
            that.trigger(eventType.Private.AutoStreamHide);
            if (that._checkTimeoutHandle) {
              clearTimeout(that._checkTimeoutHandle);
            }
            if (that._waitingTimeoutHandle) {
              clearTimeout(that._waitingTimeoutHandle);
            }
            that.waiting = false;
          }
          that._TimeUpdateStamp = currentTime;
        };
      },
      { '../../event/eventtype': 48 },
    ],
    66: [
      function(require, module, exports) {
        var EventType = require('../../event/eventtype');
        var constants = require('../../../../lib/constants');
        var Event = require('../../../../lib/event');
        var lang = require('../../../../lang/index');

        module.exports.handle = function(e) {
          var that = this;
          if (!that._options.isLive) {
            var currentTime = this.getCurrentTime(),
              duration = this.getDuration();
            if (duration - currentTime < 0.1) {
              Event.trigger(this.tag, EventType.Video.ManualEnded);
              return;
            }
          }
          that.trigger(EventType.Private.H5_Loading_Show);
          that.waiting = true;
          var func = function() {
            if (that._checkTimeoutHandle) {
              clearTimeout(that._checkTimeoutHandle);
            }
            if (that._waitingTimeoutHandle) {
              clearTimeout(that._waitingTimeoutHandle);
            }
          };

          func();
          that._TimeUpdateStamp = null;
          that._checkTimeoutHandle = setTimeout(function() {
            that.trigger(EventType.Private.AutoStreamShow);
          }, that._options.loadDataTimeout * 1000);
          that.trigger(EventType.Player.Waiting);
          that._waitingTimeoutHandle = setTimeout(function() {
            if (!that.tag || !that._options) {
              return;
            }
            that.pause();
            var paramData = {
              mediaId: that._options.vid ? that._options.vid : '',
              error_code: constants.ErrorCode.LoadingTimeout,
              error_msg: lang.get('Error_Waiting_Timeout_Text'),
            };
            that.logError(paramData);
            that.trigger('error', paramData);
          }, that._options.waitingTimeout * 1000);
          that.on('error', function() {
            func();
          });
        };
      },
      {
        '../../../../lang/index': 17,
        '../../../../lib/constants': 21,
        '../../../../lib/event': 25,
        '../../event/eventtype': 48,
      },
    ],
    67: [
      function(require, module, exports) {
        /*
         * 播放器核心类
         *
         */
        var Component = require('../../ui/component');
        var _ = require('../../lib/object');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var io = require('../../lib/io');
        var UI = require('../../ui/exports');
        var ErrorDisplay = require('../../ui/component/error-display');
        var InfoDisplay = require('../../ui/component/info-display');
        var Monitor = require('../../monitor/monitor');
        var UA = require('../../lib/ua');
        var constants = require('../../lib/constants');
        var util = require('../../lib/util');
        var cfg = require('../../config');
        var playerUtil = require('../../lib/playerutil');
        var x5Play = require('./x5play');
        var Cookie = require('../../lib/cookie');
        var lang = require('../../lang/index');
        var AutoPlayDelay = require('../../feature/autoPlayDelay');
        var eventManager = require('./event/eventmanager');
        var Cover = require('../../ui/component/cover');
        var PlayAnimation = require('../../ui/component/play-animation');
        var AutoStreamSelector = require('../../commonui/autostreamselector');
        var eventType = require('./event/eventtype');
        var LifeCycleManager = require('./plugin/lifecyclemanager');
        var FullscreenService = require('../service/fullscreenservice');
        var LiveshiftService = require('../service/liveshiftservice');
        var AiLabelService = require('../service/ailabelservice');
        var AudioTrackService = require('../service/audiotrackservice');
        var CCService = require('../service/ccservice');
        var services = require('../service/export');

        var debug_flag = 0;

        var Player = Component.extend({
          init: function(tag, options) {
            this.tag = tag;
            this.loaded = false;
            this.played = false;
            this.waiting = false;
            this._urls = [];
            this._currentPlayIndex = 0;
            this._retrySwitchUrlCount = 0;
            this._isError = false;
            this._isHls = false;
            this._liveRetryCount = 0;
            this._seeking = false;
            this._serverRequestId = 0;
            this._created = false;
            this._firstDecodeError = true;
            this._liveShiftSeekStartTime = 0;
            if (typeof options.skinLayout == 'undefined') {
              options.skinLayout = playerUtil.defaultH5Layout;
            }
            // playerUtil.handleUIOption(options);
            //调用父类的构造函数
            Component.call(this, this, options);
            this.addClass('prism-player');

            //初始化所有插件
            if (options['plugins']) {
              _.each(
                options['plugins'],
                function(key, val) {
                  this[key](val);
                },
                this,
              );
            }
            this._createService();
            //this._thumbnailService.get("http://player.alicdn.com/video/ppt.vtt");
            // this._thumbnailService.get("http://outputfirst.oss-test.aliyun-inc.com/lingkongtest/package/hls/d27290d727a0411da547b58bb329022c/a90e731254794f0985e405b9f7398476/thumbnails/thumbnails.vtt")

            // 如果不使用默认的controls，并且不是iphone，才初始化ui组件
            this.UI = {};
            if (!options['useNativeControls'] /*&& !UA.IS_IPHONE*/) {
              // 将所有可用的ui组件挂载在player下，供初始化组件时索引
              this.UI = UI;
              // 否则设置controls即可
            } else {
              this.tag.setAttribute('controls', 'controls');
            }

            this.initChildren();

            //监听视频播放器的事件
            eventManager.onAll(this);

            this._lifeCycleManager = new LifeCycleManager(this);

            if (this._options['trackLog']) {
              this._monitor = new Monitor(
                this,
                {
                  video_id: 0,
                  album_id: 0,
                  from: this._options.from,
                  source: this._options.source,
                },
                this._options['trackLog'],
              );
            }
            if (!this.checkOnline()) {
              return;
            }

            this._overrideNativePlay();

            if (this._liveshiftService && !this._liveshiftService.validate()) {
              var paramData = {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.InvalidParameter,
                error_msg: lang.get('ShiftLiveTime_Error'),
              };
              this.trigger(eventType.Player.Error, paramData);
              return;
            }
            this._extraMultiSources();
            // 如果采用直接传入视频源的方式，则直接播放
            if (this._options.source) {
              // 否则，调用接口加载视频资源
              if (this._options.autoPlayDelay) {
                this._autoPlayDelay = new AutoPlayDelay(this);
                var that = this;
                this._autoPlayDelay.handle(function() {
                  that.initPlay();
                });
              } else {
                this.initPlay();
              }
            }

            if (this._options.extraInfo) {
              var dict = this._options.extraInfo;
              if (dict.liveRetry) this._options.liveRetry = dict.liveRetry;
            }
            this.on(eventType.Private.ReadyState, function() {
              this.trigger(eventType.Player.Ready);
            });
            if (this._options.source || !this._options.vid) {
              this._executeReadyCallback();
            }
          },
        });

        Player.prototype.initPlay = function(reload) {
          this._initPlayBehavior(reload, this._options.source);
        };

        /**
         * 重写component的initChildren，
         * player的children通过options.skin传入
         */
        (Player.prototype.initChildren = function() {
          var opt = this.options(),
            skin = opt.skinLayout;

          // 必须是false或者array
          if (skin !== false && !_.isArray(skin)) {
            throw new Error('PrismPlayer Error: skinLayout should be false or type of array!');
          }

          // 如果是false或者[]，隐藏ui组件
          if (skin !== false && skin.length !== 0) {
            this.options({
              children: skin,
            });
            Component.prototype.initChildren.call(this);
          }
          if (!opt.preload && !opt.autoplay) {
            this.UI.cover = Cover;
            this.addChild('cover', opt);
          }

          this.UI.playanimation = PlayAnimation;
          this.addChild('playanimation', opt);

          this.UI.autoStreamSelector = AutoStreamSelector;
          this.addChild('autoStreamSelector', opt);

          // 所有ui组件被正式添加到dom树后触发
          this.trigger(eventType.Private.UiH5Ready);
        }),
          (Player.prototype.createEl = function() {
            var hasVideo = false;
            if (this.tag.tagName !== 'VIDEO') {
              this._el = this.tag;
              this.tag = Component.prototype.createEl.call(this, 'video');
              //如果设置了 inline 播放
              if (this._options.playsinline) {
                this.tag.setAttribute('webkit-playsinline', '');
                this.tag.setAttribute('playsinline', '');
                this.tag.setAttribute('x-webkit-airplay', '');
                this.tag.setAttribute('x5-playsinline', '');
              }
            } else {
              hasVideo = true;
              this._el = this.tag.parentNode;
            }
            var el = this._el,
              tag = this.tag,
              that = this;
            // Event.on(tag,'contextmenu',function() {
            //     return false;
            // });
            if (!this._options.enableSystemMenu) {
              if (tag.addEventListener) {
                tag.addEventListener(
                  'contextmenu',
                  function(e) {
                    e.preventDefault();
                  },
                  false,
                );
              } else {
                tag.attachEvent('oncontextmenu', function() {
                  window.event.returnValue = false;
                });
              }
            }

            //该video已经被初始化为播放器
            tag['player'] = this;

            //把video标签上的属性转移到外围容器上
            var attrs = Dom.getElementAttributes(tag);

            _.each(attrs, function(attr) {
              el.setAttribute(attr, attrs[attr]);
            });

            //设置video标签属性
            this.setVideoAttrs();

            // 把video标签包裹在el这个容器中
            if (!hasVideo) {
              if (tag.parentNode) {
                tag.parentNode.insertBefore(el, tag);
              }
              Dom.insertFirst(tag, el); // Breaks iPhone, fixed in HTML5 setup.*''
            }
            // if (UA.IS_IOS) {
            //     Dom.css(tag, 'display', 'none');
            // }

            return el;
          });

        Player.prototype.setVideoAttrs = function() {
          var preload = this._options.preload,
            autoplay = this._options.autoplay;

          this.tag.style.width = this._options.videoWidth || '100%';
          this.tag.style.height = this._options.videoHeight || '100%';

          if (preload) {
            this.tag.setAttribute('preload', 'preload');
          }

          if (autoplay && !this._isEnabledAILabel()) {
            this.tag.setAttribute('autoplay', 'autoplay');
          }
          // if(playerUtil.hasUIComponent(this._options.skinLayout, 'snapshot'))
          // {
          //     this.tag.setAttribute('crossOrigin', "anonymous");
          // }
          this.tag.setAttribute(
            'poster',
            'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
          );

          if (this._options.extraInfo) {
            for (var key in this._options.extraInfo) {
              this.tag.setAttribute(key, this._options.extraInfo[key]);
            }
          }
          x5Play.adaptX5Play(this);
        };

        Player.prototype.checkOnline = function() {
          if (!this._options || this._options.debug) {
            return true;
          }
          var value = navigator.onLine;
          if (value == false) {
            var paramData = {
              mediaId: this._options.vid ? this._options.vid : '',
              error_code: constants.ErrorCode.NetworkUnavaiable,
              error_msg: lang.get('Error_Offline_Text'),
            };
            this.logError(paramData);
            paramData.display_msg = lang.get('Error_Offline_Text');
            this.trigger(eventType.Player.Error, paramData);
            return false;
          }
          return true;
        };

        /**
         * player的id直接返回组件的id
         */
        Player.prototype.id = function() {
          return this.el().id;
        };

        Player.prototype.renderUI = function() {};

        Player.prototype.switchUrl = function() {
          if (this._urls.length == 0) return;
          this._currentPlayIndex = this._currentPlayIndex + 1;
          if (this._urls.length <= this._currentPlayIndex) {
            this._currentPlayIndex = 0;
            this._retrySwitchUrlCount++;
          }
          var urlItem = this._urls[this._currentPlayIndex];
          Cookie.set(constants.SelectedStreamLevel, urlItem.definition, 365);
          this.trigger(
            eventType.Private.QualityChange,
            lang.get('Quality_Change_Fail_Switch_Text'),
          );
          var currentTime = this.getCurrentTime();
          this._options.source = urlItem.Url;
          this.tag.setAttribute('src', this._options.source);
          this.tag.play();
        };

        Player.prototype.setControls = function() {
          var options = this.options();
          //如果指定使用系统默认的控制面板
          if (options.useNativeControls) {
            this.tag.setAttribute('controls', 'controls');
          } else {
            //否则使用我们自定义的控制面板
            // TODO
            if (typeof options.controls === 'object') {
              //options.controls为controbar的配置项
              var controlBar = this._initControlBar(options.controls);
              this.addChild(controlBar);
            }
          }
        };
        //
        Player.prototype._initControlBar = function(options) {
          var controlBar = new ControlBar(this, options);
          return controlBar;
        };

        /**
         * 获取视频元数据信息
         */
        Player.prototype.getMetaData = function() {
          var that = this,
            timer = null,
            video = this.tag;

          timer = window.setInterval(function(t) {
            if (!that.tag) {
              clearInterval(timer);
              return;
            }
            if (video.readyState > 0) {
              that._duration = video.duration;
              var vid_duration = Math.round(video.duration);
              //that.tag.duration = vid_duration;
              //that.readyTime = new Date().getTime();
              that.trigger(eventType.Private.ReadyState);
              clearInterval(timer);
            }
          }, 100);
        };

        Player.prototype.getReadyTime = function() {
          return this.readyTime;
        };

        Player.prototype.readyState = function() {
          return this.tag.readyState;
        };

        Player.prototype.getError = function() {
          return this.tag.error;
        };

        Player.prototype.getRecentOccuredEvent = function() {
          return this._eventState;
        };

        Player.prototype.getSourceUrl = function() {
          return this._options ? this._options.source : '';
        };

        Player.prototype.getMonitorInfo = function() {
          if (this._monitor) {
            return this._monitor.opt;
          }
          return {};
        };

        Player.prototype.getCurrentQuality = function() {
          if (this._urls.length > 0) {
            var url = this._urls[this._currentPlayIndex];
            return { width: url.width, url: url.Url, definition: url.definition };
          }
          return '';
        };

        /* 标准化播放器api
============================================================================= */

        Player.prototype.setSpeed = function(speed) {
          if (this.tag) {
            this._originalPlaybackRate = speed;
            this.tag.playbackRate = speed;
          }
        };
        //开始播放视频
        Player.prototype.play = function() {
          if (this.tag) {
            var that = this;
            // if (!this._options.autoplay && !this._options.preload && !this.loaded) {
            if ((!this._options.preload && !this.loaded) || !this.tag.src) {
              this._initLoad(this._options.source);
            }
            that.trigger(eventType.Private.Cover_Hide);
            this.tag.play();
          }
          return this;
        };

        //replay
        Player.prototype.replay = function() {
          this.seek(0);
          this.tag.play();
          return this;
        };
        //暂停视频
        Player.prototype.pause = function() {
          if (this.tag) {
            this.tag.pause();
          }
          return this;
        };
        //停止视频
        Player.prototype.stop = function() {
          this.tag.setAttribute('src', null);
          return this;
        };
        Player.prototype.paused = function() {
          // The initial state of paused should be true (in Safari it's actually false)
          if (this.tag) {
            return this.tag.paused === false ? false : true;
          }
        };
        //获取视频总时长
        Player.prototype.getDuration = function() {
          var totalDuration = 0;
          if (this.tag) {
            totalDuration = this.tag.duration;
          }
          return totalDuration;
        };
        //设置或者获取当前播放时间

        Player.prototype.getCurrentTime = function() {
          if (!this.tag) {
            return 0;
          }
          var currentTime = this.tag.currentTime;
          return currentTime;
        };

        Player.prototype.seek = function(time) {
          if (time === this.tag.duration) time--;
          var playbackRate = this._originalPlaybackRate || this.tag.playbackRate;
          try {
            var that = this;
            this.tag.currentTime = time;
            setTimeout(function() {
              if (that.tag) {
                that.tag.playbackRate = playbackRate; //fix ie11 bug
              }
            });
          } catch (e) {
            console.log(e);
          }
          return this;
        };

        //通过url加载视频,第一次请求视频url，不直接播放。播放由用户手动操作。  2017-04-18
        Player.prototype.firstNewUrlloadByUrl = function(url, seconds) {
          this._clearTimeout();
          this._options.vid = 0;
          this._options.source = url;
          // this._options.autoplay=true;
          // var test = this._options.autoplay;
          // 开始监控
          if (this._monitor) {
            this._monitor.updateVideoInfo({
              video_id: 0,
              album_id: 0,
              source: url,
              from: this._options.from,
            });
          }
          this.trigger(eventType.Private.ChangeURL);

          // 可以认为此时player init
          this.initPlay();

          //if not preload/autoplay, canplaythrough delete cover; else play delete cover
          if (this._options.preload || this._options.autoplay) {
            this.trigger(eventType.Private.Cover_Hide);
          }

          //增加播放时
          if (this._options.autoplay) {
            this.trigger(eventType.Player.Play);
          } else {
            this.trigger(eventType.Player.Pause);
          }

          // this.tag.play();
          if (!seconds) {
            seconds = 0;
          }
          if ((seconds || seconds == 0) && !isNaN(seconds)) {
            this.seek(seconds);
          }
        };

        Player.prototype._loadByUrlInner = function(url, seconds, autoPlay) {
          this.loadByUrl(url, seconds, autoPlay, true);
        };

        Player.prototype.loadByUrl = function(url, seconds, autoPlay, isInner) {
          this._clearTimeout();
          this.trigger(eventType.Private.Error_Hide);
          this._options.vid = 0;
          this._options.source = url;
          // this._options.autoplay=true;
          // 开始监控
          if (this._monitor) {
            this._monitor.updateVideoInfo({
              video_id: 0,
              album_id: 0,
              source: url,
              from: this._options.from,
            });
          }
          if (!isInner) {
            this.trigger(eventType.Private.ChangeURL);
          }

          // 可以认为此时player init
          this._options._autoplay = autoPlay;
          this.initPlay(autoPlay);

          //if not preload/autoplay, canplaythrough delete cover; else play delete cover
          if (this._options.preload || this._options.autoplay) {
            this.trigger(eventType.Private.Cover_Hide);
          }

          //增加播放时
          if (this._options.autoplay || autoPlay) {
            this.trigger(eventType.Player.Play);
          } else {
            this.trigger(eventType.Player.Pause);
          }
          var that = this;
          if (!this._options.isLive) {
            Event.one(this.tag, eventType.Video.CanPlay, function(e) {
              // this.tag.play();
              if ((seconds || seconds == 0) && !isNaN(seconds)) {
                that.seek(seconds);
              }
            });
          }
        };

        //播放器销毁方法在清除节点前调用
        Player.prototype.dispose = function() {
          this.trigger(eventType.Private.Dispose);
          this.tag.pause();
          //remove events
          eventManager.offAll(this);
          this.tag = null;
          this._options.recreatePlayer = null;
          this._options = null;

          if (this._monitor) {
            this._monitor.removeEvent();
            this._monitor = null;
          }
          this._el.innerHTML = '';
          if (this._autoPlayDelay) {
            this._autoPlayDelay.dispose();
          }
          this._clearTimeout();
          this.destroy();
        };

        //设置静音或者获取是否静音

        Player.prototype.mute = function() {
          this._muteInner();
          this._originalVolumn = this.tag.volume;
          var displaytext = lang.get('Volume_Mute');
          this._player.trigger(eventType.Private.Info_Show, {
            text: displaytext,
            duration: 1000,
            align: 'lb',
          });
          this._setInnerVolume(0);
          return this;
        };

        Player.prototype._muteInner = function() {
          this.tag.muted = true;
          this.trigger(eventType.Private.VolumnChanged, -1);
        };

        Player.prototype.unMute = function() {
          this._unMuteInner();
          var displaytext = lang.get('Volume_UnMute');
          this._player.trigger(eventType.Private.Info_Show, {
            text: displaytext,
            duration: 1000,
            align: 'lb',
          });
          this._setInnerVolume(this._originalVolumn || 0.5);
          return this;
        };

        Player.prototype._unMuteInner = function() {
          this.tag.muted = false;
          this.trigger(eventType.Private.VolumnChanged, -2);
        };

        Player.prototype.muted = function() {
          return this.tag.muted;
        };

        //设置或者获取音量
        Player.prototype.getVolume = function() {
          return this.tag.volume;
        };
        //获取配置
        Player.prototype.getOptions = function() {
          return this._options;
        };
        /*
    0-1区间
    */
        Player.prototype.setVolume = function(volume, isInner) {
          if (volume != 0) {
            this._unMuteInner();
          } else if (volume == 0) {
            this._muteInner();
          }
          this._setInnerVolume(volume);
          var displaytext =
            lang.get('Curent_Volume') + '<span>' + (volume * 100).toFixed() + '%</span>';
          this._player.trigger(eventType.Private.Info_Show, {
            text: displaytext,
            duration: 1000,
            align: 'lb',
          });
        };

        Player.prototype._setInnerVolume = function(volume) {
          this.tag.volume = volume;
          this.trigger(eventType.Private.VolumnChanged, volume);
        };

        //隐藏进度条控制
        Player.prototype.hideProgress = function() {
          var that = this;
          that.trigger(eventType.Private.HideProgress);
        };
        //取消隐藏进度条控制
        Player.prototype.cancelHideProgress = function() {
          var that = this;
          that.trigger(eventType.Private.CancelHideProgress);
        };

        //set player size when play
        Player.prototype.setPlayerSize = function(input_w, input_h) {
          this._el.style.width = input_w;
          this._el.style.height = input_h;
        };

        /**
         * 获取已经缓存的时间区间
         *
         * @method getBuffered
         * @return {Array} 时间区间数组timeRanges
         */
        Player.prototype.getBuffered = function() {
          return this.tag.buffered;
        };

        Player.prototype.setRotate = function(rotate) {
          //正数顺时针
          if (this.tag) {
            this._rotate = rotate;
            this._setTransform();
          }
        };

        Player.prototype.getRotate = function(rotate) {
          //正数顺时针
          if (typeof this._rotate == 'undefined') {
            return 0;
          }
          return this._rotate;
        };

        Player.prototype.setImage = function(
          direct, //horizon, vertical
        ) {
          //正数顺时针
          if (this.tag) {
            this._image = direct;
            this._setTransform();
          }
        };

        Player.prototype.getImage = function() //horizon, vertical
        {
          return this._image;
        };

        Player.prototype.cancelImage = function() //horizon, vertical
        {
          //正数顺时针
          if (this.tag) {
            this._image = '';
            this._setTransform();
          }
        };

        Player.prototype._setTransform = function() {
          if (!this._transformProp) {
            this._transformProp = Dom.getTransformName(this.tag);
          }
          var value = ' translate(-50%, -50%)';
          if (this._rotate) {
            value += ' rotate(' + this._rotate + 'deg)';
          }
          if (this._image) {
            if (this._image == 'vertical') {
              value += ' scaleY(-1)';
            } else if (this._image == 'horizon') {
              value += ' scaleX(-1)';
            }
          }

          this.tag.style[this._transformProp] = value;
        };

        Player.prototype._startPlay = function() {
          if (this._aiLabelService) {
            var that = this;
            this.trigger(eventType.Private.H5_Loading_Show);
            this.trigger(eventType.Private.Play_Btn_Hide);
            this.one('canplay', function() {
              that._aiLabelService.startMeta();
            });
          } else {
            if (this.tag.paused) {
              this.tag.play();
            }
          }
        };

        Player.prototype._initPlayBehavior = function(reload, src) {
          if (this._checkSupportVideoType()) {
            return false;
          }
          if (!playerUtil.validateSource(src)) {
            var paramData = {
              mediaId: this._options.vid ? this._options.vid : '',
              error_code: constants.ErrorCode.InvalidSourceURL,
              error_msg: 'InvalidSourceURL',
            };
            this.logError(paramData);
            paramData.display_msg = lang.get('Error_Invalidate_Source');
            this.trigger(eventType.Player.Error, paramData);
            return false;
          }
          this.trigger(eventType.Private.H5_Loading_Hide);
          if (typeof reload == 'undefined') {
            reload = false;
          }
          if (!this._created) {
            this._created = true;
            this.trigger(eventType.Private.Created);
          }
          // 可以认为此时player init
          if (!this.loaded) {
            this.trigger(eventType.Player.Init);
          }
          if (this._options.autoplay || this._options.preload || reload) {
            this._initLoad(src);
            if (this._options.autoplay || this._options._autoplay) {
              this._startPlay();
            } else {
              this.trigger(eventType.Private.Play_Btn_Show);
            }
          }
          return true;
        };

        Player.prototype._initLoad = function(src) {
          if (this._options.autoplay) {
            this.trigger(eventType.Private.H5_Loading_Show);
          }
          this.getMetaData();
          if (src) {
            this.tag.setAttribute('src', src);
          }
          this.loaded = true;
        };

        Player.prototype._clearLiveErrorHandle = function() {
          if (this._liveErrorHandle) {
            clearTimeout(this._liveErrorHandle);
            this._liveErrorHandle = null;
          }
        };

        Player.prototype._reloadAndPlayForM3u8 = function() {
          if (this._liveRetryCount == 0) {
            this.trigger(eventType.Player.OnM3u8Retry);
          }
          var option = this._options;
          var count = option.liveRetryInterval + option.liveRetryStep * this._liveRetryCount;
          util.sleep(count * 1000);
          this._liveRetryCount++;
          this.tag.load(this._options.source);
          this.tag.play();
        };

        Player.prototype._checkSupportVideoType = function() {
          if (!this.tag.canPlayType || !this._options.source || !UA.IS_MOBILE) {
            return '';
          }
          var source = this._options.source;
          var msg = '';
          if (source.indexOf('m3u8') > 0) {
            if (this.tag.canPlayType('application/x-mpegURL') == '' && !playerUtil.isSupportHls()) {
              msg = lang.get('Error_Not_Support_M3U8_Text');
            }
          } else if (source.indexOf('mp4') > 0) {
            if (this.tag.canPlayType('video/mp4') == '') {
              msg = lang.get('Error_Not_Support_MP4_Text');
            }
          } else if ((playerUtil.isRTMP(source) || playerUtil.isFlv(source)) && UA.IS_MOBILE) {
            msg = lang.get('Error_Not_Support_Format_On_Mobile');
          }
          if (msg) {
            var paramData = {
              mediaId: this._options.vid ? this._options.vid : '',
              error_code: constants.ErrorCode.FormatNotSupport,
              error_msg: msg,
            };
            this.logError(paramData);
            paramData.display_msg = msg;
            this.trigger(eventType.Player.Error, paramData);
          }
          return msg;
        };

        Player.prototype.getComponent = function(name) {
          return this._lifeCycleManager.getComponent(name);
        };

        Player.prototype.logError = function(paramData) {
          if (!paramData) {
            paramData = {};
          }
          paramData.vt = this.getCurrentTime();
          this._serverRequestId = this.log('ERROR', paramData);
        };

        Player.prototype.log = function(logType, logInfo) {
          var playerVid = 0,
            playerFrom = 0;
          if (this._monitor) {
            if (this._options) {
              playerVid = this._options.vid || '0';
              playerFrom = this._options.from || '0';
            }
            this._monitor.updateVideoInfo({
              video_id: playerVid,
              album_id: 0,
              source: this._options.source,
              from: playerFrom,
            });

            return this._monitor._log(logType, logInfo);
          }
        };

        Player.prototype.setSanpshotProperties = function(width, height, rate) {
          if (!this._snapshotMatric) {
            this._snapshotMatric = {};
          }
          this._snapshotMatric.width = width;
          this._snapshotMatric.height = height;
          if (rate > 1) {
            throw new Error("rate doesn't allow more than 1");
          }
          this._snapshotMatric.rate = rate;
        };

        Player.prototype.getStatus = function() {
          if (this._status) {
            return this._status;
          }
          return 'init';
        };

        Player.prototype._getSanpshotMatric = function() {
          if (!this._snapshotMatric) {
            this._snapshotMatric = {};
          }

          return this._snapshotMatric;
        };

        Player.prototype._overrideNativePlay = function() {
          var originalPlay = this.tag.play;
          var that = this;
          this.tag.play = function() {
            if (!that._options.source) {
              var paramData = {
                mediaId: that._options.vid ? that._options.vid : '',
                error_code: constants.ErrorCode.InvalidSourceURL,
                error_msg: 'InvalidSourceURL',
              };
              paramData.display_msg = lang.get('Error_Invalidate_Source');
              that.trigger(eventType.Player.Error, paramData);
              return;
            }

            that.readyTime = new Date().getTime();
            var promise = originalPlay.apply(that.tag);
            if (promise !== undefined) {
              promise['catch'](function(error) {
                // Auto-play was prevented
                // Show a UI element to let the user manually start playback
                that.trigger(eventType.Private.Play_Btn_Show);
                that.trigger(eventType.Private.H5_Loading_Hide);
                that.trigger(eventType.Player.AutoPlayPrevented);
              }).then(function() {
                // Auto-play started
              });
            }
            var playbackRate = that._originalPlaybackRate || that.tag.playbackRate;
            setTimeout(function() {
              if (that.tag) {
                that.tag.playbackRate = playbackRate; //fix ie11 bug
              }
            });
          };
        };

        Player.prototype._extraMultiSources = function() {
          var source = this._options.source;
          if (source && source.indexOf('{') > -1 && source.indexOf('}') > -1) {
            var jsonStr = '';
            try {
              jsonStr = JSON.parse(source);
            } catch (e) {
              console.error(e);
              console.error('地址json串格式不对');
            }
            var urls = [];
            for (var key in jsonStr) {
              var desc = constants.QualityLevels[key];
              urls.push({
                definition: key,
                Url: jsonStr[key],
                desc: desc || key,
              });
            }
            if (urls.length > 0) {
              this._currentPlayIndex = playerUtil.findSelectedStreamLevel(urls);
              var url = urls[this._currentPlayIndex];
              this._urls = urls;
              this._options.source = url.Url;
              this.trigger(eventType.Private.SourceLoaded, url);
            }
          }
        };

        Player.prototype._isEnabledAILabel = function() {
          return this._options.ai && this._options.ai.label;
        };

        Player.prototype._createService = function() {
          if (services) {
            var length = services.length;
            for (var i = 0; i < length; i++) {
              var service = services[i];
              var condition = service.condition;
              if (typeof condition == 'undefined') {
                condition = true;
              } else if (typeof condition == 'function') {
                condition = condition.call(this);
              }
              if (condition) {
                this[service.name] = new service.service(this);
              }
            }
          }
        };

        Player.prototype._executeReadyCallback = function() {
          this._options.readyCallback(this);
        };

        Player.prototype._clearTimeout = function() {
          if (this._checkTimeoutHandle) {
            clearTimeout(this._checkTimeoutHandle);
            this._checkTimeoutHandle = null;
          }
          if (this._waitingTimeoutHandle) {
            clearTimeout(this._waitingTimeoutHandle);
            this._waitingTimeoutHandle = null;
          }
          this._clearLiveErrorHandle();
        };

        module.exports = Player;
      },
      {
        '../../commonui/autostreamselector': 8,
        '../../config': 11,
        '../../feature/autoPlayDelay': 13,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/cookie': 22,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/io': 30,
        '../../lib/object': 32,
        '../../lib/playerutil': 35,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../monitor/monitor': 44,
        '../../ui/component': 99,
        '../../ui/component/cover': 105,
        '../../ui/component/error-display': 106,
        '../../ui/component/info-display': 109,
        '../../ui/component/play-animation': 111,
        '../../ui/exports': 130,
        '../service/ailabelservice': 90,
        '../service/audiotrackservice': 91,
        '../service/ccservice': 92,
        '../service/export': 93,
        '../service/fullscreenservice': 94,
        '../service/liveshiftservice': 95,
        './event/eventmanager': 47,
        './event/eventtype': 48,
        './plugin/lifecyclemanager': 70,
        './x5play': 72,
      },
    ],
    68: [
      function(require, module, exports) {
        var Component = require('../../../lib/oo');

        var defaultComponent = Component.extend({});

        module.exports = defaultComponent;
      },
      { '../../../lib/oo': 33 },
    ],
    69: [
      function(require, module, exports) {
        module.exports = {
          createEl: 'createEl',
          created: 'created',
          ready: 'ready',
          loading: 'loading',
          play: 'play',
          pause: 'pause',
          playing: 'playing',
          waiting: 'waiting',
          timeUpdate: 'timeupdate',
          error: 'error',
          ended: 'ended',
          dispose: 'dispose',
        };
      },
      {},
    ],
    70: [
      function(require, module, exports) {
        var _ = require('../../../lib/object');
        var eventType = require('../event/eventtype');
        var lifecycle = require('./lifecycle');
        var status = require('./status');

        var LifeCycleManager = function(player) {
          this._player = player;
          player._status = 'init';
          this.components = [];
          var components = player.getOptions().components;
          if (components && _.isArray(components) && components.length > 0) {
            for (var i = 0; i < components.length; i++) {
              var componentType = components[i],
                constr =
                  typeof componentType.type == 'undefined' ? componentType : componentType.type,
                args = typeof componentType.args == 'undefined' ? [] : componentType.args,
                name = typeof componentType.name == 'undefined' ? '' : componentType.name;
              if (args && args.length > 0) {
                args = [].concat.call([constr], args);
              } else {
                args = [];
              }
              var component = new (Function.prototype.bind.apply(constr, args))();
              createEl = component[lifecycle.createEl];
              if (createEl && typeof createEl == 'function') {
                createEl.call(component, player.el());
              }
              this.components.push({ name: name, obj: component });
            }
          }
          var that = this;
          player.on(eventType.Private.LifeCycleChanged, function(e) {
            if (that.components.length != 0) {
              handle.call(that, player, e);
            }
          });
        };

        LifeCycleManager.prototype.getComponent = function(name) {
          var componet = null;
          var length = this.components.length;
          if (name) {
            for (var i = 0; i < length; i++) {
              if (this.components[i].name == name) {
                componet = this.components[i].obj;
                break;
              }
            }
          }

          return componet;
        };

        var isLoading = function(type) {
          return (
            type == eventType.Video.LoadStart ||
            type == eventType.Video.LoadedData ||
            type == eventType.Video.LoadedMetadata
          );
        };

        var handle = function(player, e) {
          if (!e) {
            return;
          }
          var data = e.paramData,
            type = data.type,
            paraData = data.data;
          if (isLoading(type)) {
            type = lifecycle.loading;
          }
          setSatus(player, type);
          var length = this.components.length;
          for (var i = 0; i < length; i++) {
            var component = this.components[i].obj,
              func = component[type];
            if (func && typeof func == 'function') {
              func.call(component, player, paraData);
            }
          }
          if (type == eventType.Private.Dispose) {
            this.components = [];
          }
        };

        var setSatus = function(player, type) {
          if (typeof status[type] == 'undefined') {
            return;
          }
          if (
            type == status.pause &&
            (player._status == status.error || player._status == status.ended)
          ) {
            return;
          }

          player._status = type;
        };

        module.exports = LifeCycleManager;
      },
      { '../../../lib/object': 32, '../event/eventtype': 48, './lifecycle': 69, './status': 71 },
    ],
    71: [
      function(require, module, exports) {
        module.exports = {
          init: 'init',
          ready: 'ready',
          loading: 'loading',
          play: 'play',
          pause: 'pause',
          playing: 'playing',
          waiting: 'waiting',
          error: 'error',
          ended: 'ended',
        };
      },
      {},
    ],
    72: [
      function(require, module, exports) {
        var UA = require('../../lib/ua');
        var Dom = require('../../lib/dom');

        var setLayout = function(player, isFullScreen) {
          var containerHeight = player.el().style.height,
            containerWidth = player.el().style.width;
          player.originalLayout = {
            container: {
              height: containerHeight,
              width: containerWidth,
            },
            video: {
              width: player.tag.style.width,
              height: player.tag.style.height,
            },
          };
          var screenHeight = document.body.clientHeight * (window.devicePixelRatio || 1) + 'px';
          var screenWidth = document.body.clientWidth + 'px';
          if (!isFullScreen) {
            height = containerHeight.indexOf('%') ? containerHeight : containerHeight + 'px';
            width = containerWidth.indexOf('%') ? containerWidth : containerWidth + 'px';
          } else {
            height = screenHeight;
            width = screenWidth;
          }
          player.tag.style.width = screenWidth;
          player.tag.style.height = screenHeight;
          if (isFullScreen) {
            player.el().style.height = screenHeight;
          } else {
            player.el().style.height = height;
          }
        };

        var recoverLayout = function(player, isFullScreen) {
          if (!player.originalLayout) {
            return;
          }
          var layout = player.originalLayout;
          player.el().style.height = layout.container.height;
          player.el().style.width = layout.container.width;
          player.tag.style.width = layout.video.width;
          player.tag.style.height = layout.video.height;
        };

        var setLandscapeLayout = function(player) {
          if (player._x5VideoOrientation == 'landscape') {
            player._originalTagWidth = player.tag.style.width;
            player._originalTagHeight = player.tag.style.height;
            var controlBar = document.querySelector('#' + player.id() + ' .prism-controlbar');
            var controlbarHeight = 0;
            if (controlBar) {
              controlbarHeight = parseFloat(controlBar.offsetHeight);
            }

            player.tag.style.height = '100%';
            player.tag.style.width = window.screen.width + 'px';
          }
        };

        var CancelLandscapeLayout = function(player) {
          if (player._x5VideoOrientation == 'portrait') {
            player.tag.style.width = player._originalTagWidth;
            player.tag.style.height = player._originalTagHeight;
          }
        };

        module.exports.isAndroidX5 = function() {
          return (UA.os.android && UA.is_X5) || UA.dingTalk();
        };

        module.exports.adaptX5Play = function(player) {
          if (UA.os.android && UA.is_X5) {
            if (player._options.x5_type == 'h5') {
              player.tag.setAttribute('x5-video-player-type', player._options.x5_type);
              window.onresize = function() {
                setLayout(
                  player,
                  player._options.x5_fullscreen || player._options.x5_video_position == 'center',
                );
                setLandscapeLayout(player);
                //CancelLandscapeLayout(player);
              };

              player.tag.addEventListener('x5videoenterfullscreen', function() {
                setLayout(
                  player,
                  player._options.x5_fullscreen || player._options.x5_video_position == 'center',
                );
                player.trigger('x5requestFullScreen');
              });
              player.tag.addEventListener('x5videoexitfullscreen', function() {
                recoverLayout(player);
                player.trigger('x5cancelFullScreen');
              });

              player.on('requestFullScreen', function() {
                if (player._options.x5_video_position == 'top') {
                  Dom.removeClass(player.tag, 'x5-top-left');
                }
                if (UA.os.android && UA.is_X5 && player._options.x5LandscapeAsFullScreen) {
                  player.tag.setAttribute('x5-video-orientation', 'landscape');
                  player._x5VideoOrientation = 'landscape';
                }
              });
              player.on('cancelFullScreen', function() {
                if (player._options.x5_video_position == 'top') {
                  Dom.addClass(player.tag, 'x5-top-left');
                }
                if (UA.os.android && UA.is_X5 && player._options.x5LandscapeAsFullScreen) {
                  player.tag.setAttribute('x5-video-orientation', 'portrait');
                  setLayout(
                    player,
                    player._options.x5_fullscreen || player._options.x5_video_position == 'center',
                  );
                  player._x5VideoOrientation = 'portrait';
                }
              });
            }

            if (typeof player._options.x5_fullscreen != 'undefined') {
              if (player._options.x5_fullscreen) {
                player.tag.setAttribute(
                  'x5-video-player-fullscreen',
                  player._options.x5_fullscreen,
                );
                Dom.addClass(player.tag, 'x5-full-screen');
              }
            }
            var position = player._options.x5_video_position;
            if (position == 'top') {
              Dom.addClass(player.tag, 'x5-top-left');
            }
            if (typeof player._options.x5_orientation != 'undefined') {
              player.tag.setAttribute('x5-video-orientation', player._options.x5_orientation);
            }
          }
        };
      },
      { '../../lib/dom': 24, '../../lib/ua': 38 },
    ],
    73: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var cfg = require('../../config');
        var constants = require('../../lib/constants');
        var util = require('../../lib/util');
        var playerUtil = require('../../lib/playerutil');
        var Dom = require('../../lib/dom');
        var lang = require('../../lang/index');
        var eventType = require('../base/event/eventtype');
        var drm = require('../saas/drm');

        var shouldInjectDrm = function(obj, src) {
          if (!obj._drm && playerUtil.isDash(src)) {
            return true;
          }
          return false;
        };

        var getDrm = function(callback) {
          var url =
            '//' + cfg.domain + '/de/prismplayer/' + cfg.h5Version + '/drm/aliplayer-drm-min.js';
          // if (typeof define === 'function' && define['amd']) {
          // 	requirejs('alihls', function (Hls){
          // 　　　　window.Hls = Hls;
          //        callback();
          // 　　});
          // }
          // else if(typeof exports === 'object' && typeof module === 'object')
          // {
          // 	window.Hls = require(url);
          // 	callback();
          // }
          // else
          // {
          var that = this;
          io.loadJS(url, function() {
            shaka.polyfill.installAll();
            callback.apply(that);
          });
          // }
        };

        module.exports.inject = function(
          obj,
          objType,
          superPt,
          option,
          ready,
          isForce,
          encryptionType,
        ) {
          var src = option.source;
          if (!isForce && !shouldInjectDrm(obj, src)) {
            return;
          }
          objType.prototype._checkDrmReady = function() {
            if (obj._drm == null) {
              throw new Error('please invoke this method after ready event');
            }
          };
          obj._isDrm = true;
          obj._drm = null;
          obj._isLoadedDrm = false;

          objType.prototype.play = function() {
            this._checkDrmReady();
            var that = this;
            that.trigger(eventType.Private.Cover_Hide);
            if (this.tag.ended) {
              this.replay();
            } else {
              var time = this.getCurrentTime();
              if (this.tag.paused) {
                this.tag.play();
              }
            }

            return this;
          };
          //replay
          objType.prototype.replay = function() {
            // this.initPlay(true);
            if (this.tag.paused) {
              var that = this;
              this._drm
                .load(this._options.source)
                .then(function() {
                  that._options._autoplay = true;
                  that._initPlayBehavior(true);
                  console.log('The video has now been loaded!');
                })
                ['catch'](onError);
            }
            return this;
          };
          //暂停视频
          objType.prototype.pause = function() {
            this._checkDrmReady();
            this.tag.pause();
            return this;
          };
          //停止视频
          objType.prototype.stop = function() {
            this._checkDrmReady();
            this.tag.setAttribute('src', null);
            return this;
          };

          objType.prototype.initPlay = function(reload) {
            if (util.contentProtocolMixed(src)) {
              var paramData = {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.InvalidSourceURL,
                error_msg: 'InvalidSourceURL',
              };
              paramData.display_msg = lang.get('Request_Block_Text');
              this.trigger(eventType.Player.Error, paramData);
              return;
            }
            that = this;
            if (!this._isLoadedDrm) {
              this.trigger(eventType.Private.H5_Loading_Show);
              getDrm.call(that, function() {
                this.trigger(eventType.Private.H5_Loading_Hide);
                this._isLoadedDrm = true;
                buildDrm(this, reload);
                this._options.readyCallback(this);
              });
            } else {
              buildDrm(this, reload);
            }
            function buildDrm(that, reload) {
              var innerFunc = function() {
                bindEvents(that, that._drm);
                var drmConfig = {
                  drm: {
                    requestLicenseKey: drm.requestLicenseKey(that),
                    servers: {},
                  },
                };
                //encryptionType
                var keySystem = constants.DRMKeySystem[4];
                if (keySystem) {
                  // //drmConfig.drm.servers[constants.DRMKeySystem[5]] = "https://usp.services.irdeto.com/widevine/getlicense?CrmId=ps-dbdc-dev&AccountId=ps-dbdc-dev&ContentId=cc80bb63004a4ecc8b318028e43c385e&SessionId=5C41A79A4AD9BCF8&Ticket=0E496730473D85B2";
                  drmConfig.drm.servers[constants.DRMKeySystem[5]] = 'https://foo.bar/drm/widevine';
                  drmConfig.drm.servers[constants.DRMKeySystem[4]] =
                    'https://foo.bar/drm/playready';
                  //drmConfig.drm.servers[constants.DRMKeySystem[4]] = "https://usp.services.irdeto.com/playready/rightsmanager.asmx?CrmId=ps-dbdc-dev&AccountId=ps-dbdc-dev&ContentId=a7101bac50514dbaa010a238047bee33&SessionId=5C41A79A4AD9BCF8&Ticket=0E496730473D85B2";
                }
                that._drm.configure(drmConfig);

                if (ready) {
                  ready(that._drm);
                }

                // Try to load a manifest.
                // This is an asynchronous process.
                that._drm
                  .load(that._options.source)
                  .then(function() {
                    that._initPlayBehavior(reload);
                    // This runs if the asynchronous load is successful.
                    console.log('The video has now been loaded!');
                  })
                  ['catch'](function(error) {
                    onError(that, error);
                  }); // onError is executed if the asynchronous load fails.
              };

              var _checkSupport = function(type) {
                if (!type || (that.__support && that.__support.drm[type])) {
                  innerFunc();
                } else {
                  var paramData = {
                    mediaId: that._options.vid ? that._options.vid : '',
                    error_code: constants.ErrorCode.EncrptyVideoNotSupport,
                    error_msg: lang.get('Not_Support_DRM'),
                  };

                  that.trigger(eventType.Player.Error, paramData);
                }
              };

              var _create = function(that) {
                try {
                  that._drm = new shaka.Player(that.tag);
                  var item = that._getItemBySource();
                  if (item) {
                    var type = constants.DRMKeySystem[item.encryptionType];
                    if (that.__support) {
                      _checkSupport(type);
                    } else {
                      shaka.Player.probeSupport().then(function(support) {
                        that.__support = support;
                        _checkSupport(type);
                      });
                    }
                  }
                } catch (ex) {
                  console.log(ex);
                }
              };
              that.destroy(_create);
            }
          };

          objType.prototype.destroy = function(func) {
            if (this._drm) {
              var that = this;
              this._drm.destroy().then(function() {
                that._drm = null;
                func(that);
              });
            } else {
              func(this);
            }
          };

          objType.prototype._executeReadyCallback = function() {};

          objType.prototype.dispose = function() {
            superPt.dispose.call(this);
            this.destroy();
          };

          objType.prototype._getDRMEncryptItem = function() {
            var urls = this._urls;
            if (urls && urls.length > 0) {
              var length = urls.length;
              for (var i = 0; i < length; i++) {
                var item = urls[i];
                if (item.Url == this._options.source && item.encryption * 1) {
                  return item;
                }
              }
              return '';
            }
            return '';
          };

          objType.prototype._getItemBySource = function() {
            var urls = this._urls;
            if (urls && urls.length > 0) {
              var length = urls.length;
              for (var i = 0; i < length; i++) {
                var item = urls[i];
                if (item.Url == this._options.source) {
                  return item;
                }
              }
              return '';
            }
            return '';
          };

          var bindEvents = function(player, dash) {
            // Listen for error events.
            dash.addEventListener('error', function(event) {
              onErrorEvent(player, event);
            });
          };

          function onErrorEvent(player, event) {
            // Extract the shaka.util.Error object from the event.
            onError(player, event.detail);
          }

          function onError(player, error) {
            // Log the error.
            var errorMsg = 'Error code:' + error.code + 'message:' + error.message;
            console.log(errorMsg);
            var errorCode = constants.ErrorCode.OtherError,
              errorMsg = lang.get('Error_Play_Text');
            if (error.code == shaka.util.Error.Code.EXPIRED) {
              errorCode = constants.ErrorCode.AuthKeyExpired;
              errorMsg = lang.get('DRM_License_Expired');
              // player.__licenseKeys = {};
              // if(!player.__expiredCount)
              // {
              // 	player.__expiredCount = 1;
              // 	player.loadByUrl(player._options.source,player.getCurrentTime(),!player.paused());
              // }
              //return ;
            } else if (error.code == shaka.util.Error.Code.HTTP_ERROR) {
              errorCode = constants.ErrorCode.NetworkError;
              errorMsg = lang.get('Http_Error');
            } else if (error.code == shaka.util.Error.Code.HTTP_ERROR) {
              errorCode = constants.ErrorCode.LoadingTimeout;
              errorMsg = lang.get('Http_Timeout');
            } else if (error.category == shaka.util.Error.NETWORK) {
              errorCode = constants.ErrorCode.NetworkError;
              errorMsg = lang.get('Error_Network_Text');
            }
            var handelError = function() {
              setTimeout(function() {
                player.trigger(eventType.Private.Play_Btn_Hide);
              });
              if (!player.checkOnline()) {
                return;
              }
              var paramData = {
                mediaId: player._options.vid ? player._options.vid : '',
                error_code: errorCode,
                error_msg: error.message,
              };

              player.logError(paramData);
              paramData.display_msg = error.code + '|' + errorMsg;
              player.trigger(eventType.Player.Error, paramData);
            };

            handelError();
          }
        };
      },
      {
        '../../config': 11,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/dom': 24,
        '../../lib/io': 30,
        '../../lib/playerutil': 35,
        '../../lib/util': 40,
        '../base/event/eventtype': 48,
        '../saas/drm': 81,
      },
    ],
    74: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var drmInjector = require('./drminjector');

        var DrmPlayer = BasePlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            var that = this;

            drmInjector.inject(this, DrmPlayer, BasePlayer.prototype, options, function(hls) {});
            BasePlayer.call(this, tag, options);
          },
        });
        module.exports = DrmPlayer;
      },
      { '../base/player': 67, './drminjector': 73 },
    ],
    75: [
      function(require, module, exports) {
        /*
         * flash播放器核心类
         */
        var Component = require('../../ui/component');
        var Data = require('../../lib/data');
        var UA = require('../../lib/ua');
        var constants = require('../../lib/constants');
        var Dom = require('../../lib/dom');
        var _ = require('../../lib/object');
        var cfg = require('../../config');
        var lang = require('../../lang/index');
        var playerUtil = require('../../lib/playerutil');
        var util = require('../../lib/util');
        var InfoDisplay = require('../../ui/component/info-display');
        var ErrorDisplay = require('../../ui/component/error-display');
        var AutoPlayDelay = require('../../feature/autoPlayDelay');
        var AutoStreamSelector = require('../../commonui/autostreamselector');
        var EventType = require('../base/event/eventtype');
        var stsToken = require('../saas/ststoken');
        //var swfobj=require('../lib/swfobject');

        var FlashPlayer = Component.extend({
          init: function(tag, options) {
            if (typeof options.skinLayout == 'undefined') {
              options.skinLayout = playerUtil.defaultFlashLayout;
            }
            Component.call(this, this, options);
            //Dom.addClass(tag,'prism-player');
            // 在window下挂载变量,便于flash调用
            this._id = 'prism-player-' + Data.guid();
            this.tag = tag;
            this._el = this.tag;
            this._childrenUI = [InfoDisplay, ErrorDisplay];
            this.initChildren();
            this.id = this._id;
            window[this.id] = this;
            lang.setCurrentLanguage(this._options.language, 'flash', this._options.languageTexts);
            if (util.openInFile()) {
              var errorInfo = {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.FormatNotSupport,
                error_msg: lang.get('Open_Html_By_File', 'flash'),
              };
              this.trigger(EventType.Private.Error_Show, errorInfo);
              return;
            }
            if (UA.IS_MOBILE) {
              this.trigger(EventType.Private.Error_Show, {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.FormatNotSupport,
                error_msg: lang.get('Cant_Use_Flash_On_Mobile', 'flash'),
              });
              return;
            }
            if (
              this._options.vid &&
              this._options.accessKeyId &&
              this._options.securityToken &&
              this._options.accessKeySecret
            ) {
              var that = this;
              stsToken.getPlayAuth(
                this._options,
                function(data) {
                  that._options.playauth = data;
                  that._createPlayer();
                },
                function(error) {
                  var paramData = {
                    mediaId: that._options.vid,
                    error_code: error.Code,
                    error_msg: error.Message,
                  };
                  if (error.sri) {
                    paramData.sri = error.sri;
                  }
                  paramData.display_msg = error.display_msg;
                  that.trigger(EventType.Private.Error_Show, paramData);
                },
                'flash',
              );
            } else {
              this._createPlayer();
            }

            this._status = 'init';

            //swfobj.registerObject(this._id, "10.1.0");
          },

          _createPlayer: function() {
            if (this._options.autoPlayDelay) {
              var autoPlayDelay = new AutoPlayDelay(this);
              var that = this;
              autoPlayDelay.handle(function() {
                that._options.autoplay = true;
                that._initPlayer();
                that._childrenUI.push(AutoStreamSelector);
                that.initChildren();
              });
            } else {
              this._initPlayer();
              this._childrenUI.push(AutoStreamSelector);
              this.initChildren();
            }
          },

          _initPlayer: function() {
            var width = '100%';
            var height = '100%';
            // TODO 临时先用日常的
            var swfUrl =
              '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/PrismPlayer.swf';
            if (!cfg.domain) {
              swfUrl = 'de/prismplayer-flash/' + cfg.flashVersion + '/PrismPlayer.swf';
            } else if (cfg.domain.indexOf('localhost') > -1) {
              swfUrl = '//' + cfg.domain + '/build/flash//PrismPlayer.swf';
            }
            //var swfUrl = "http://aplay-vod.cn-beijing.aliyuncs.com/hapame/player.swf?embsig=1%5F1509010122%5F1fb738a441b5aaa3ccd9b35751974f0a&isHapame=true&playerId=ytec&clientId=908a519d032263f8&autoPlay=true&xcode=CODA4NjU1Mg%3D%3D";
            var flashVar = this._comboFlashVars();
            var wmode = this._options.wmode ? this._options.wmode : 'opaque';
            this.tag.innerHTML =
              '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="' +
              width +
              '" height="' +
              height +
              '" id="' +
              this.id +
              '">' +
              '<param name=movie value="' +
              swfUrl +
              '">' +
              '<param name=quality value=High>' +
              '<param name="FlashVars" value="' +
              flashVar +
              '">' +
              '<param name="WMode" value="' +
              wmode +
              '">' +
              '<param name="AllowScriptAccess" value="always">' +
              '<param name="AllowFullScreen" value="true">' +
              '<param name="AllowFullScreenInteractive" value="true">' +
              '<embed name="' +
              this.id +
              '" src="' +
              swfUrl +
              '" quality=high pluginspage="//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="' +
              width +
              '" height="' +
              height +
              '" AllowScriptAccess="always" AllowFullScreen="true" AllowFullScreenInteractive="true" WMode="' +
              wmode +
              '" FlashVars="' +
              flashVar +
              '">' +
              '</embed>' +
              '</object>';
          },

          _getPlayer: function(id) {
            if (navigator.appName.indexOf('Microsoft') != -1) {
              return document.getElementById(id);
            } else {
              return document[id];
            }
          },

          _getLowerQualityLevel: function() {
            var videoInfo = this._getVideoUrls();
            if (!videoInfo) {
              return '';
            }
            var urls = videoInfo.Urls,
              currentPlayIndex = videoInfo.index;
            if ((urls && urls.length == 0) || currentPlayIndex == -1) {
              return '';
            }

            if (currentPlayIndex > 0) {
              return {
                item: urls[currentPlayIndex - 1],
                index: currentPlayIndex - 1,
              };
            }
            return '';
          },

          //增加对 domain,statisticService,videoInfoService,vurl(调整为 source) 的设置支持
          _comboFlashVars: function() {
            var referer = encodeURIComponent(UA.getReferer()),
              address = UA.getHref(),
              pageUrl = encodeURIComponent(address),
              app_n = '';
            if (address) {
              app_n = UA.getHost(address);
            }
            var opt = this._options,
              flashVarArr = {
                autoPlay: opt.autoplay ? 1 : 0,

                //20170419 日志改版，不在让用户传from >=1.6.8
                // from: opt.from,

                isInner: 0,
                actRequest: 1,
                //ref: 'share',
                vid: opt.vid,
                diagnosisButtonVisible: opt.diagnosisButtonVisible ? 1 : 0,
                domain: opt.domain ? opt.domain : '//tv.taobao.com',
                //statisticService: opt.statisticService ? opt.statisticService : '//log.video.taobao.com/stat/',
                //statisticService: opt.statisticService ? opt.statisticService : '//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track',
                statisticService: opt.statisticService ? opt.statisticService : cfg.logReportTo,
                videoInfoService: opt.videoInfoService
                  ? opt.videoInfoService
                  : '/player/json/getBaseVideoInfo.do',
                disablePing: opt.trackLog ? 0 : 1,
                namespace: this.id,
                barMode: opt.barMode != 0 ? 1 : 0,
                //直播状态
                isLive: opt.isLive ? 1 : 0,
                //水印
                waterMark: opt.waterMark,
                environment: opt.environment,
                //直接播放的地址
                vurl: opt.source ? encodeURIComponent(opt.source) : '',
                //插件
                plugins: opt.plugins ? opt.plugins : '',
                snapShotShow: opt.snapshot ? 1 : 0,

                accessId: opt.accId ? opt.accId : '',
                accessKey: opt.accSecret ? opt.accSecret : '',
                apiKey: opt.apiKey ? opt.apiKey : '',

                flashApiKey: opt.flashApiKey ? opt.flashApiKey : '',
                // fromAdress_taoTV : opt.fromAdress_taoTV ? opt.fromAdress_taoTV : "",

                disableSeek: opt.disableSeek ? 1 : 0, //禁止seek按钮
                disableFullScreen: opt.disableFullScreen ? 1 : 0, //禁止全屏

                stsToken: opt.stsToken ? opt.stsToken : '',
                domainRegion: opt.domainRegion ? opt.domainRegion : '',
                authInfo: opt.authInfo ? encodeURIComponent(opt.authInfo) : '',
                playDomain: opt.playDomain ? opt.playDomain : '',

                stretcherZoomType: opt.stretcherZoomType ? opt.stretcherZoomType : '',

                playauth: opt.playauth ? opt.playauth.replace(/\+/g, '%2B') : '',
                prismType: opt.prismType ? opt.prismType : 0,

                formats: opt.formats ? opt.formats : '',
                notShowTips: opt.notShowTips ? 1 : 0,
                showBarTime: opt.showBarTime ? opt.showBarTime : 0,
                showBuffer: opt.showBuffer == 0 ? 0 : 1,
                rePlay: opt.rePlay ? 1 : 0,
                encryp: opt.encryp ? opt.encryp : '',
                secret: opt.secret ? opt.secret : '',
                mediaType: 'video', //可选，取值video, audio
                logInfo: {
                  ud: UA.getHost(opt.source),
                  os: UA.os.name,
                  ov: UA.os.version || '',
                  et: UA.browser.name,
                  ev: UA.browser.version || '',
                  uat: UA.USER_AGENT,
                  r: referer,
                  pu: pageUrl,
                  app_n: app_n,
                },
              },
              flashVar = [];

            if (opt.cover) {
              flashVarArr.cover = opt.cover;
            }
            if (opt.extraInfo) {
              flashVarArr.extraInfo = encodeURIComponent(JSON.stringify(opt.extraInfo));
            }
            if (flashVarArr.logInfo) {
              flashVarArr.logInfo = encodeURIComponent(JSON.stringify(flashVarArr.logInfo));
            }
            flashVarArr.languageData = encodeURIComponent(
              JSON.stringify(lang.getLanguageData('flash')),
            );
            flashVarArr.language = lang.getCurrentLanguage();

            _.each(flashVarArr, function(k, v) {
              flashVar.push(k + '=' + v);
            });

            return flashVar.join('&');
          },

          initChildren: function() {
            var length = this._childrenUI.length;
            for (var i = 0; i < length; i++) {
              var info = new this._childrenUI[i](this, this._options);
              var ele = info['el']();
              ele.id = info['id']();
              this.contentEl().appendChild(ele);
              info.bindEvent();
            }
            var infoEle = document.querySelector('#' + this._options.id + ' .prism-info-display');
            Dom.css(infoEle, 'display', 'none');
          },

          /************************ flash调用js的函数 ***********************/

          /**
           * flashPlayer初始化完毕
           */
          flashReady: function() {
            this.flashPlayer = this._getPlayer(this.id);
            this._isReady = true;

            // 传递skin相关
            var skinRes = this._options.skinRes,
              skinLayout = this._options.skinLayout,
              skin;

            // 必须是false或者array
            if (skinLayout !== false && !_.isArray(skinLayout)) {
              throw new Error('PrismPlayer Error: skinLayout should be false or type of array!');
            }
            if (typeof skinRes !== 'string') {
              throw new Error('PrismPlayer Error: skinRes should be string!');
            }

            // 如果是false或者[]，隐藏ui组件
            if (skinLayout == false || skinLayout.length === 0) {
              skin = false;
            } else {
              skin = {
                skinRes: skinRes,
                skinLayout: skinLayout,
              };
            }
            this.flashPlayer.setPlayerSkin(skin);

            this.trigger('ready');

            // 告知flash播放器页面关闭
            var that = this;
            window.addEventListener('beforeunload', function() {
              try {
                that.flashPlayer.setPlayerCloseStatus();
              } catch (e) {}
            });
          },

          /**
           * flash调用该函数，轮询js的函数声明是否完成
           */
          jsReady: function() {
            return true;
          },

          snapshoted: function(data) {
            var binary = util.toBinary(data);
            var iamgeBase64 = 'data:image/jpeg;base64,' + data;
            this.trigger('snapshoted', {
              time: this.getCurrentTime(),
              base64: iamgeBase64,
              binary: binary,
            });
          },

          uiReady: function() {
            this._status = 'ready';
            this.trigger('uiReady');
          },

          loadedmetadata: function() {
            if (this._status != 'ended') {
              this._status = 'loading';
              this.trigger('loadedmetadata');
            }
          },

          onPlay: function() {
            this._status = 'play';
            this.trigger('play');
            this._clearTimeoutHandle();
            this.trigger(EventType.Private.AutoStreamHide);
          },

          onEnded: function() {
            this._clearTimeoutHandle();
            this._status = 'ended';
            this.trigger('ended');
          },

          onPause: function() {
            this._status = 'pause';
            this._clearTimeoutHandle();
            this.trigger(EventType.Private.AutoStreamHide);
            this.trigger('pause');
          },
          //flash弹幕插件初始化完成
          onBulletScreenReady: function() {
            this.trigger('bSReady');
          },
          //flash弹幕发送弹幕消息
          onBulletScreenMsgSend: function(msg) {
            this.trigger('bSSendMsg', msg);
          },

          //flash视频开始渲染播放器内逻辑做了单个视频的发送滤重,可以作为canplay的依赖
          onVideoRender: function(time) {
            this._clearTimeoutHandle();
            this.trigger('videoRender');
            this.trigger('canplay', {
              loadtime: time,
            });
          },
          //flash播放器捕捉到错误时调用
          onVideoError: function(type) {
            this._clearTimeoutHandle();
            this._status = 'error';
            this.trigger('error', {
              errortype: type,
            });
          },
          //flash catch m3u8 request error and retry
          onM3u8Retry: function() {
            this.trigger('m3u8Retry');
          },
          //send hide bar
          hideBar: function() {
            this.trigger('hideBar');
          },
          //send show bar: closed now
          showBar: function() {
            this.trigger('showBar');
          },
          //flash catch live stream stop
          liveStreamStop: function() {
            this.trigger('liveStreamStop');
          },
          //flash catch live stream stop
          stsTokenExpired: function() {
            this._status = 'error';
            this.trigger('stsTokenExpired');
          },
          //flash播放器捕捉到缓冲
          onVideoBuffer: function() {
            if (this._status == 'pause') {
              return;
            }
            this._status = 'waiting';
            this.trigger('waiting');
            this._clearTimeoutHandle();
            var that = this;
            this._checkTimeoutHandle = setTimeout(function() {
              that.trigger(EventType.Private.AutoStreamShow);
            }, this._options.loadDataTimeout * 1000);
            this._checkVideoStatus();
          },
          //start seek
          startSeek: function(time) {
            this.trigger('startSeek', time);
          },
          //complete seek
          completeSeek: function(time) {
            this.trigger('completeSeek', time);
          },

          /**
           * js调用flash函数的基础方法
           */
          _invoke: function() {
            var fnName = arguments[0],
              args = arguments;

            Array.prototype.shift.call(args);

            if (!this.flashPlayer) {
              throw new Error(
                'PrismPlayer Error: flash player is not ready，please use api after ready event occured!',
              );
            }
            if (typeof this.flashPlayer[fnName] !== 'function') {
              throw new Error('PrismPlayer Error: function ' + fnName + ' is not found!');
            }

            return this.flashPlayer[fnName].apply(this.flashPlayer, args);
          },

          /* ================ 公共接口 ====================== */

          play: function() {
            this._invoke('playVideo');
          },
          replay: function() {
            this._invoke('replayVideo');
          },

          pause: function() {
            this._invoke('pauseVideo');
          },
          stop: function() {
            this._invoke('stopVideo');
          },
          // 秒
          seek: function(time) {
            this._invoke('seekVideo', time);
          },

          getCurrentTime: function() {
            return this._invoke('getCurrentTime');
          },

          getDuration: function() {
            return this._invoke('getDuration');
          },

          getStatus: function() {
            return this._status;
          },

          _getVideoUrls: function() {
            var urls = this._invoke('getVideoUrls');
            var arrayUrls = [];
            if (urls && urls.Urls) {
              for (var i = 0; i < urls.Urls.length; i++) {
                var item = urls.Urls[i].value,
                  index = item.desc.indexOf('_'),
                  definitionText = lang.get(item.definition, 'flash');
                if (index > 0) {
                  item.desc = definitionText + '_' + item.height;
                } else {
                  item.desc = definitionText;
                }
                arrayUrls.push(item);
              }
            }

            return { Urls: arrayUrls, index: urls.index };
          },

          _getVideoStatus: function() {
            return this._invoke('getVideoStatus');
          },
          //直接显示加 showbuffer
          //缓冲空 需要加载 "buffeEmpty";
          //加载结束 "bufferFull";
          //缓冲清空 "bufferFlush";
          _checkVideoStatus: function() {
            if (!this.flashPlayer || this._checkVideoStatusHandler) {
              return;
            }
            var that = this;
            var tick = function() {
              that._checkVideoStatusHandler = setTimeout(function() {
                var state = that._getVideoStatus();
                if (state.videoStatus == 'playing' && state.bufferStatus == 'bufferFull') {
                  that._status = 'playing';
                  that._clearTimeoutHandle();
                } else if (state.videoStatus == 'videoPlayOver') {
                  that._status = 'ended';
                  that._clearTimeoutHandle();
                }
                tick();
              }, 500);
            };
            tick();
          },

          _clearTimeoutHandle: function() {
            if (this._checkTimeoutHandle) {
              clearTimeout(this._checkTimeoutHandle);
              this._checkTimeoutHandle = null;
            }
          },

          _changeStream: function(index) {
            return this._invoke('changeStream', index);
          },

          mute: function() {
            this.setVolume(0);
          },

          unMute: function() {
            this.setVolume(0.5);
          },

          // 0-1
          getVolume: function() {
            return this._invoke('getVolume');
          },

          // 0-1
          setVolume: function(vol) {
            this._invoke('setVolume', vol);
          },
          //新增接口============================
          //通过id加载视频
          loadByVid: function(vid) {
            this._invoke('loadByVid', vid, false);
          },
          //通过url加载视频
          loadByUrl: function(url, seconds) {
            this._invoke('loadByUrl', url, seconds);
          },
          //销毁 暂停视频,其余的由业务逻辑处理
          dispose: function() {
            this._invoke('pauseVideo');
          },
          //推送弹幕消息,js获取到消息后推送给flash显示
          showBSMsg: function(msg) {
            this._invoke('showBSMsg', msg);
          },
          //设置是否启用toast信息提示
          setToastEnabled: function(enabled) {
            this._invoke('setToastEnabled', enabled);
          },
          //设置是否显示loading
          setLoadingInvisible: function() {
            this._invoke('setLoadingInvisible');
          },
          //set player size
          setPlayerSize: function(input_w, input_h) {
            this._el.style.width = input_w;
            this._el.style.height = input_h;
          },
        });

        module.exports = FlashPlayer;
      },
      {
        '../../commonui/autostreamselector': 8,
        '../../config': 11,
        '../../feature/autoPlayDelay': 13,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/data': 23,
        '../../lib/dom': 24,
        '../../lib/object': 32,
        '../../lib/playerutil': 35,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../ui/component': 99,
        '../../ui/component/error-display': 106,
        '../../ui/component/info-display': 109,
        '../base/event/eventtype': 48,
        '../saas/ststoken': 86,
      },
    ],
    76: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var cfg = require('../../config');
        var constants = require('../../lib/constants');
        var util = require('../../lib/util');
        var playerUtil = require('../../lib/playerutil');
        var Dom = require('../../lib/dom');
        var UA = require('../../lib/ua');
        var lang = require('../../lang/index');
        var eventType = require('../base/event/eventtype');
        var BasePlayer = require('../base/player');

        var shouldInjectFlv = function(obj, src) {
          if (!obj._flv && playerUtil.isFlv(src)) {
            return true;
          }
          return false;
        };

        var getFlv = function(callback, debug) {
          var fileName = 'aliplayer-flv-min.js';
          if (debug) {
            fileName = 'aliplayer-flv.js';
          }
          var url =
            'https://' + cfg.domain + '/de/prismplayer/' + cfg.h5Version + '/flv/' + fileName;
          if (!cfg.domain) {
            url = '/de/prismplayer/' + cfg.h5Version + '/flv/' + fileName;
          } else if (cfg.domain.indexOf('localhost') > -1) {
            url = '//' + cfg.domain + '/build/flv/' + fileName;
          }
          var that = this;
          io.loadJS(url, function() {
            callback.apply(that);
          });
        };

        module.exports.inject = function(obj, objType, supperType, option, ready, isForce) {
          var src = option.source;
          if (!isForce && !shouldInjectFlv(obj, src)) {
            return;
          }
          obj._Type = objType;
          obj._superType = supperType;
          obj._superPt = supperType.prototype;
          obj._disposed = false;
          objType.prototype._checkFlvReady = function() {
            if (obj._flv == null) {
              throw new Error('please invoke this method after ready event');
            }
          };
          obj._isFlv = true;
          obj._flv = null;
          obj._isLoadedFlv = false;
          obj._originalUrl = '';

          objType.prototype.play = function(liveForceLoad) {
            this._checkFlvReady();
            var that = this;
            that.trigger(eventType.Private.Cover_Hide);
            if (this._options.isLive && liveForceLoad) {
              this._loadByUrlInner(this._options.source, 0, liveForceLoad);
            } else {
              if (this._seeking == false && !this._options.isLive) {
                if (this.tag.ended) {
                  this.seek(0);
                }
              }
              if (this.tag.paused) {
                if (!that._hasLoaded) {
                  this.getMetaData();
                  this._flv.load();
                }
                this._flv.play();
                //this.tag.play();
              }
            }

            return this;
          };
          //replay
          objType.prototype.replay = function() {
            this._checkFlvReady();
            this._loadByUrlInner(this._options.source, 0, true);
            return this;
          };

          objType.prototype.seek = function(time) {
            this._checkFlvReady();

            if (time === this.tag.duration) time--;
            try {
              this._flv.currentTime = time;
              //this.tag.currentTime = time;
            } catch (e) {
              console.log(e);
            }

            return this;
          };

          //暂停视频
          objType.prototype.pause = function() {
            if (this._flv && this._flv.pause) {
              this._checkFlvReady();
              this._flv.pause();
            }
            return this;
          };
          //     //停止视频
          // objType.prototype.stop = function() {
          // 	this._checkHlsReady();
          //     this.tag.setAttribute('src', null);
          //     return this;
          // }
          objType.prototype.getProgramDateTime = function() {
            this._checkFlvReady();
            if (!this._metadata) {
              return '';
            }
            var sample = this._flv.getFirstSample();
            var pts = sample && sample.pts ? sample.pts : 0;
            console.log('推流时间：' + this._metadata.NtpTime);
            console.log('首帧PTS：' + pts);
            return this._metadata.NtpTime + pts;
          };

          objType.prototype.initPlay = function(reload) {
            if (UA.browser.safari) {
              this.trigger(eventType.Private.Snapshot_Hide);
            }
            if (util.contentProtocolMixed(src)) {
              var paramData = {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.InvalidSourceURL,
                error_msg: 'InvalidSourceURL',
              };
              paramData.display_msg = lang.get('Request_Block_Text');
              this.trigger(eventType.Player.Error, paramData);
              return;
            }
            var that = this;
            if (!this._isLoadedFlv) {
              this.trigger(eventType.Private.H5_Loading_Show);
              getFlv.call(
                that,
                function() {
                  this.trigger(eventType.Private.H5_Loading_Hide);
                  this._isLoadedFlv = true;
                  this.destroy();
                  buildFlv(this, reload);
                  this._options.readyCallback(this);
                },
                this._options.debug,
              );
            } else {
              that.destroy();
              that.buildFlvHandler = setTimeout(function() {
                buildFlv(that, reload);
              }, 1000);
            }
            function buildFlv(that, reload) {
              flvjs.LoggingControl.enableAll = that._options.debug;
              var isLive = that._options.isLive;
              var config = {
                isLive: isLive,
                enableWorker: that._options.enableWorker,
                stashInitialSize: 2048,
              };
              if (isLive) {
                config.enableStashBuffer = that._options.enableStashBufferForFlv;
                config: stashInitialSize = that._options.stashInitialSizeForFlv;
                config.autoCleanupSourceBuffer = false;
                // config.lazyLoadMaxDuration = 1*60;
              } else {
                config.lazyLoadMaxDuration = 10 * 60;
              }
              for (var key in that._options.flvOption) {
                config[key] = that._options.flvOption[key];
              }
              that._originalUrl = that._options.source;
              that._flv = flvjs.createPlayer(
                {
                  type: 'flv',
                  isLive: isLive,
                  url: that._options.source,
                },
                config,
              );
              bindEvent(that, that._flv);
              that._flv.on(flvjs.Events.MEDIA_INFO, function(data) {
                that._metadata = data.metadata;
              });
              that._flv.attachMediaElement(that.tag);
              var ret = that._initPlayBehavior(reload);
              if (!ret) {
                return;
              }
              if (that._options.preload || that._options.autoplay) {
                that._hasLoaded = true;
                that._flv.load();
              }
              if (that._options.autoplay && !that.tag.paused) {
                that._flv.play();
              }
              if (ready) {
                ready(that._flv);
              }
            }
          };

          objType.prototype.destroy = function() {
            try {
              if (this._flv) {
                this._flv.pause();
                this._flv.destroy();
              }
            } catch (e) {
              console.log(e);
            }
            this.loaded = false;
            this._hasLoaded = false;
            this._flv = null;
          };

          objType.prototype.dispose = function() {
            if (this._disposed) {
              return;
            }
            if (this.buildFlvHandler) {
              clearTimeout(this.buildFlvHandler);
            }
            this._disposed = true;
            if (this._superPt) {
              this._superPt.dispose.call(this);
            }
            this.destroy();
            if (this._superPt) {
              objType.prototype.play = this._superPt.play;
              objType.prototype.pause = this._superPt.pause;
              objType.prototype.initPlay = this._superPt.initPlay;
              objType.prototype.replay = this._superPt.replay;
              objType.prototype.seek = this._superPt.seek;
              objType.prototype.canSeekable = this._superPt.canSeekable;
              objType.prototype._executeReadyCallback = this._superPt._executeReadyCallback;
            }
          };

          objType.prototype.canSeekable = function(sec) {
            var mediaInfo = this._flv.mediaInfo;
            if (!this._flv._isTimepointBuffered(sec) && mediaInfo && !mediaInfo.hasKeyframesIndex) {
              return false;
            }

            return true;
          };

          objType.prototype._reloadAndPlayForM3u8 = function() {
            if (this._liveRetryCount == 0) {
              this.trigger(eventType.Player.OnM3u8Retry);
            }
            this._liveRetryCount++;
          };

          objType.prototype._executeReadyCallback = function() {};

          var bindEvent = function(player, flv) {
            var directlyHandleError = false;
            flv.on(flvjs.Events.ERROR, function(type, code, detail) {
              player._clearTimeout();
              if (!player._options) {
                return;
              }
              var errorCode = constants.ErrorCode.OtherError,
                errorMsg = lang.get('Error_Play_Text');
              if (code == flvjs.ErrorDetails.NETWORK_EXCEPTION) {
                var source = player.getOptions().source;
                if (
                  !source ||
                  (source.toLowerCase().indexOf('http://') != 0 &&
                    source.toLowerCase().indexOf('https://') != 0)
                ) {
                  errorCode = constants.ErrorCode.InvalidSourceURL;
                  errorMsg = lang.get('Error_Invalidate_Source');
                  directlyHandleError = true;
                } else if (navigator.onLine) {
                  errorCode = constants.ErrorCode.RequestDataError;
                  errorMsg = lang.get('Maybe_Cors_Error');
                } else {
                  errorCode = constants.ErrorCode.NetworkError;
                  errorMsg = lang.get('Error_Network_Text');
                }
              } else if (code == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
                if (detail.code == '404') {
                  errorCode = constants.ErrorCode.NotFoundSourceURL;
                  errorMsg = lang.get('Error_Not_Found');
                } else if (detail.code == '403') {
                  errorCode = constants.ErrorCode.AuthKeyExpired;
                  errorMsg = lang.get('Error_AuthKey_Text');
                  directlyHandleError = true;
                } else {
                  errorCode = constants.ErrorCode.NetworkError;
                  errorMsg = lang.get('Error_Network_Text');
                }
              } else if (code == flvjs.ErrorDetails.NETWORK_TIMEOUT) {
                errorCode = constants.ErrorCode.LoadingTimeout;
                errorMsg = lang.get('Error_Waiting_Timeout_Text');
              } else if (
                code == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED ||
                code == flvjs.ErrorDetails.MEDIA_CODEC_UNSUPPORTED
              ) {
                errorCode = constants.ErrorCode.FormatNotSupport;
                errorMsg = lang.get('Error_H5_Not_Support_Text');
                directlyHandleError = true;
              }
              var handelError = function() {
                setTimeout(function() {
                  player.trigger(eventType.Private.Play_Btn_Hide);
                });
                if (!player.checkOnline()) {
                  return;
                }
                var paramData = {
                  mediaId: player._options.vid ? player._options.vid : '',
                  error_code: errorCode,
                  error_msg: detail.msg,
                };

                player.logError(paramData);
                paramData.display_msg = errorMsg;
                if (cfg.cityBrain) {
                  player.flv = null;
                }
                player.trigger(eventType.Player.Error, paramData);
              };

              if (player._options && player._options.isLive && !directlyHandleError) {
                var option = player._options;
                if (option.liveRetry > player._liveRetryCount) {
                  if (player._liveRetryCount == 0) {
                    player.trigger(eventType.Player.OnM3u8Retry);
                  }
                  var count =
                    option.liveRetryInterval + option.liveRetryStep * player._liveRetryCount;
                  player._liveRetryCount++;
                  util.sleep(count * 1000);
                  player._loadByUrlInner(player._options.source, 0, true);
                } else {
                  player.trigger(eventType.Player.LiveStreamStop);
                  player._liveErrorHandle = setTimeout(handelError, 500);
                }
              } else {
                handelError();
              }
            });
          };
        };
      },
      {
        '../../config': 11,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/dom': 24,
        '../../lib/io': 30,
        '../../lib/playerutil': 35,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../base/event/eventtype': 48,
        '../base/player': 67,
      },
    ],
    77: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var flvInjector = require('./flvinjector');

        var FlvPlayer = BasePlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            var that = this;

            flvInjector.inject(this, FlvPlayer, BasePlayer, options, function(flv) {});
            BasePlayer.call(this, tag, options);
          },
        });
        module.exports = FlvPlayer;
      },
      { '../base/player': 67, './flvinjector': 76 },
    ],
    78: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var cfg = require('../../config');
        var constants = require('../../lib/constants');
        var util = require('../../lib/util');
        var playerUtil = require('../../lib/playerutil');
        var Dom = require('../../lib/dom');
        var lang = require('../../lang/index');
        var eventType = require('../base/event/eventtype');
        var BasePlayer = require('../base/player');

        var shouldInjectHls = function(obj, src, usePlugin) {
          if (
            !obj._hls &&
            playerUtil.isHls(src) &&
            (!playerUtil.canPlayHls() ||
              playerUtil.isSafariUsedHlsPlugin(usePlugin) ||
              playerUtil.isUsedHlsPluginOnMobile())
          ) {
            return true;
          }
          return false;
        };

        var getHls = function(callback, debug) {
          var fileName = 'aliplayer-hls-min.js';
          if (debug) {
            fileName = 'aliplayer-hls.js';
          }
          var url =
            'https://' + cfg.domain + '/de/prismplayer/' + cfg.h5Version + '/hls/' + fileName;
          if (!cfg.domain) {
            url = '/de/prismplayer/' + cfg.h5Version + '/hls/' + fileName;
          } else if (cfg.domain.indexOf('localhost') > -1) {
            url = '//' + cfg.domain + '/build/hls/' + fileName;
          }
          // if (typeof define === 'function' && define['amd']) {
          // 	requirejs('alihls', function (Hls){
          // 　　　　window.Hls = Hls;
          //        callback();
          // 　　});
          // }
          // else if(typeof exports === 'object' && typeof module === 'object')
          // {
          // 	window.Hls = require(url);
          // 	callback();
          // }
          // else
          // {
          var that = this;
          io.loadJS(url, function() {
            callback.apply(that);
          });
          // }
        };

        module.exports.inject = function(obj, objType, supperType, option, ready, isForce) {
          var src = option.source,
            usePlugin = option.useHlsPluginForSafari;
          if (!isForce && !shouldInjectHls(obj, src, usePlugin)) {
            return;
          }
          obj._Type = objType;
          obj._superType = supperType;
          obj._superPt = supperType.prototype;
          obj._disposed = false;
          objType.prototype._checkHlsReady = function() {
            if (obj._hls == null) {
              throw new Error('please invoke this method after ready event');
            }
          };
          obj._isHls = true;
          obj._hls = null;
          obj._isLoadedHls = false;

          objType.prototype.play = function() {
            this._checkHlsReady();
            var that = this;
            that.trigger(eventType.Private.Cover_Hide);
            if (!this._options.autoplay && !this._options.preload && !this._loadSourced) {
              this._loadSourced = true;
              this._hls.loadSource(that._options.source);
            }
            if (this.tag.ended) {
              this.replay();
            } else {
              var time = this.getCurrentTime();
              //this._hls.startLoad(time);
              if (this.tag.paused) {
                this.tag.play();
              }
            }

            return this;
          };
          //replay
          objType.prototype.replay = function() {
            this.initPlay(true);
            if (this.tag.paused) {
              this.tag.play();
            }
            return this;
          };
          //暂停视频
          objType.prototype.pause = function() {
            if (this.tag) {
              this._checkHlsReady();
              this.tag.pause();
              this._hls.stopLoad();
            }
            return this;
          };
          //停止视频
          objType.prototype.stop = function() {
            this._checkHlsReady();
            this.tag.setAttribute('src', null);
            this._hls.stopLoad();
            return this;
          };

          objType.prototype.seek = function(time) {
            this._checkHlsReady();

            try {
              this._superPt.seek.call(this, time);
              if (this.tag.paused) {
                this._hls.startLoad(time);
              }
            } catch (e) {
              console.log(e);
            }

            return this;
          };

          objType.prototype.getProgramDateTime = function() {
            this._checkHlsReady();
            if (this._hls.currentLevel == -1) {
              return '';
            }
            var currentLevel = this._hls.currentLevel,
              detail = this._hls.levels[currentLevel].details;
            if (detail) {
              var date = detail.programDateTime;
              console.log('ProgramDateTime=' + date);
              if (date) {
                return new Date(date).valueOf();
              }
            }
            return 0;
          };

          objType.prototype._reloadAndPlayForM3u8 = function() {
            if (this._liveRetryCount == 0) {
              this.trigger(eventType.Player.OnM3u8Retry);
            }
            this._liveRetryCount++;
          };

          objType.prototype._switchLevel = function(url) {
            this.trigger(eventType.Player.LevelSwitch);
            var levels = this._hls.levels;
            for (var i = 0; i < levels.length; i++) {
              if (levels[i].url == url) {
                this._hls.currentLevel = i;
                break;
              }
            }
            var that = this;
            setTimeout(function() {
              that.trigger(eventType.Player.LevelSwitched);
            }, 1000);
          };

          objType.prototype.initPlay = function(reload) {
            if (util.contentProtocolMixed(src)) {
              var paramData = {
                mediaId: this._options.vid ? this._options.vid : '',
                error_code: constants.ErrorCode.InvalidSourceURL,
                error_msg: 'InvalidSourceURL',
              };
              paramData.display_msg = lang.get('Request_Block_Text');
              this.trigger(eventType.Player.Error, paramData);
              return;
            }
            var that = this;
            if (!this._isLoadedHls) {
              this.trigger(eventType.Private.H5_Loading_Show);
              getHls.call(
                that,
                function() {
                  this.trigger(eventType.Private.H5_Loading_Hide);
                  this._isLoadedHls = true;
                  buildHls(this, reload);
                  this._options.readyCallback(this);
                },
                this._options.debug,
              );
            } else {
              buildHls(this, reload);
            }
            function buildHls(that, reload) {
              that.destroy();
              var option = {
                xhrSetup: function(xhr, url) {
                  xhr.withCredentials = that._options.withCredentials || false; // do send cookies
                },
              };
              var loadingTimeOut = that._options.loadingTimeOut || that._options.hlsLoadingTimeOut;
              if (loadingTimeOut) {
                option.manifestLoadingTimeOut = loadingTimeOut;
                option.levelLoadingTimeOut = loadingTimeOut;
                option.fragLoadingTimeOut = loadingTimeOut;
              }
              if (that._options.nudgeMaxRetry) {
                option.nudgeMaxRetry = that._options.nudgeMaxRetry;
              }
              if (that._options.maxMaxBufferLength) {
                option.maxMaxBufferLength = that._options.maxMaxBufferLength;
              }
              if (that._options.maxBufferSize) {
                option.maxBufferSize = that._options.maxBufferSize;
              }
              if (that._options.maxBufferLength) {
                option.maxBufferLength = that._options.maxBufferLength;
              }
              option.enableWorker = that._options.enableWorker;
              option.debug = that._options.debug;
              that._hls = new Hls(option);

              if (ready) {
                ready(that._hls);
              }
              bindEvents(that, that._hls);
              that._loadSourced = false;
              if (that._options.autoplay || that._options.preload || reload) {
                that._loadSourced = true;
                that._hls.loadSource(that._options.source);
              }
              that._hls.attachMedia(that.tag);
              that._hls.on(Hls.Events.MANIFEST_PARSED, function() {
                that._initPlayBehavior(reload);
              });
              that._hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function(name, audioTrack) {
                that.trigger(eventType.Player.AudioTrackUpdated, audioTrack);
              });
              that._hls.on(Hls.Events.MANIFEST_LOADED, function(name, data) {
                that.trigger(eventType.Player.LevelsLoaded, data);
              });

              that._hls.on(Hls.Events.LEVEL_SWITCHED, function(name, data) {
                if (!that._qualityService) {
                  return;
                }

                var url = that._hls.levels[data.level].url,
                  levels = that._qualityService.levels,
                  desc = '';
                for (var i = 0; i < levels.length; i++) {
                  if (levels[i].Url == url) {
                    desc = levels[i].desc;
                    break;
                  }
                }
                if (desc) {
                  that.trigger(eventType.Private.QualityChange, {
                    levelSwitch: true,
                    url: url,
                    desc: desc,
                  });
                }
              });

              that._hls.on(Hls.Events.AUDIO_TRACK_SWITCH, function(name, data) {
                that.trigger(eventType.Player.AudioTrackSwitch, data);
                setTimeout(function() {
                  that.trigger(eventType.Player.AudioTrackSwitched, data);
                }, 1000);
              });
              if (that._options.hlsFragChangedEmpty) {
                that._hls.on(Hls.Events.FRAG_CHANGED, function(e, data) {
                  var range = { startOffset: 0, endOffset: data.frag.startDTS };
                  that._hls.trigger(Hls.Events.BUFFER_FLUSHING, range);
                  console.dir(range);
                });
              }
            }
          };

          // objType.prototype._startPlay = function()
          //    {

          //    }

          objType.prototype._executeReadyCallback = function() {};

          objType.prototype.destroy = function() {
            if (this._hls) {
              this._hls.destroy();
            }
            this.loaded = false;
            this._hls = null;
          };

          objType.prototype.dispose = function() {
            if (this._disposed) {
              return;
            }
            this._disposed = true;
            if (this._superPt) {
              this._superPt.dispose.call(this);
            }

            this.destroy();
            if (this._superPt) {
              objType.prototype.play = this._superPt.play;
              objType.prototype.pause = this._superPt.pause;
              objType.prototype.initPlay = this._superPt.initPlay;
              objType.prototype.replay = this._superPt.replay;
              objType.prototype.stop = this._superPt.stop;
              objType.prototype.seek = this._superPt.seek;
              objType.prototype._executeReadyCallback = this._superPt._executeReadyCallback;
            }
          };

          var bindEvents = function(player, hls) {
            //data: { type : error type, details : error details,
            // Identifier for a network error (loading error / timeout ...)
            // NETWORK_ERROR: 'networkError',
            // // Identifier for a media Error (video/parsing/mediasource error)
            // MEDIA_ERROR: 'mediaError',
            // // Identifier for a mux Error (demuxing/remuxing)
            // MUX_ERROR: 'muxError',
            // // Identifier for all other errors
            // OTHER_ERROR: 'otherError'
            hls.on(Hls.Events.ERROR, function(event, data) {
              if (
                !player._options ||
                data.details == Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR ||
                player._seeking == true ||
                (data.fatal == false && data.type != Hls.ErrorTypes.NETWORK_ERROR)
              )
                return;
              player._clearTimeout();
              var errorCode = constants.ErrorCode.LoadedMetadata,
                errorMsg = lang.get('Error_Play_Text'),
                minifestError = false;
              if (data.details == Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                minifestError = true;
                var networkDetails = data.networkDetails;
                if (!data.response) {
                  errorMsg = lang.get('Error_Load_M3U8_Failed_Text');
                } else if (data.response.code == '404') {
                  errorCode = constants.ErrorCode.NotFoundSourceURL;
                  errorMsg = lang.get('Error_Not_Found');
                } else if (data.response.code == '403') {
                  errorCode = constants.ErrorCode.AuthKeyExpired;
                  errorMsg = lang.get('Error_AuthKey_Text');
                } else if (data.response.code == '0' && navigator.onLine) {
                  errorCode = constants.ErrorCode.RequestDataError;
                  errorMsg = errorMsg + '，' + lang.get('Maybe_Cors_Error');
                } else {
                  errorMsg = lang.get('Error_Load_M3U8_Failed_Text');
                }
              } else if (data.details == Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
                minifestError = true;
                errorMsg = lang.get('Error_Load_M3U8_Timeout_Text');
              } else if (
                data.details == Hls.ErrorDetails.MANIFEST_PARSING_ERROR ||
                data.details == Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR
              ) {
                minifestError = true;
                errorMsg = lang.get('Error_M3U8_Decode_Text');
              } else if (data.type == Hls.ErrorTypes.NETWORK_ERROR) {
                errorCode = constants.ErrorCode.NetworkError;
                errorMsg = lang.get('Error_Network_Text');
              } else if (
                data.type == Hls.ErrorTypes.MUX_ERROR ||
                data.type == Hls.ErrorTypes.MEDIA_ERROR
              ) {
                errorCode = constants.ErrorCode.PlayDataDecode;
                errorMsg = lang.get('Error_TX_Decode_Text');
              }
              errorMsg = errorMsg + '(' + data.details + ')';
              var handelError = function() {
                player.pause();
                setTimeout(function() {
                  player.trigger(eventType.Private.Play_Btn_Hide);
                });
                if (!player.checkOnline()) {
                  return;
                }
                var paramData = {
                  mediaId: player._options.vid ? player._options.vid : '',
                  error_code: errorCode,
                  error_msg: data.details,
                };
                //var networkDetails = data.networkDetails;
                // if(networkDetails)
                // {
                // 	paramData.cdnVia = networkDetails.getResponseHeader('Via');
                // 	paramData.eagleID = networkDetails.getResponseHeader('EagleId');
                // 	paramData.cdnError = networkDetails.getResponseHeader('X-Tengine-Error');
                // }

                player.logError(paramData);
                paramData.display_msg = errorMsg;
                player.trigger(eventType.Player.Error, paramData);
              };

              if (player._options && player._options.isLive) {
                var option = player._options;
                if (option.liveRetry > player._liveRetryCount) {
                  if (player._liveRetryCount == 0) {
                    player.trigger(eventType.Player.OnM3u8Retry);
                  }
                  var count =
                    option.liveRetryInterval + option.liveRetryStep * player._liveRetryCount;
                  player._liveRetryCount++;
                  util.sleep(count * 1000);
                  if (minifestError) {
                    player._loadByUrlInner(player._options.source, 0, true);
                  }
                } else {
                  player.trigger(eventType.Player.LiveStreamStop);
                  player._liveErrorHandle = setTimeout(handelError, 500);
                }
              } else {
                handelError();
              }
            });
          };
        };
      },
      {
        '../../config': 11,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/dom': 24,
        '../../lib/io': 30,
        '../../lib/playerutil': 35,
        '../../lib/util': 40,
        '../base/event/eventtype': 48,
        '../base/player': 67,
      },
    ],
    79: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var hlsInjector = require('./hlsinjector');

        var HlsPlayer = BasePlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            var that = this;

            hlsInjector.inject(this, HlsPlayer, BasePlayer, options, function(hls) {});
            BasePlayer.call(this, tag, options);
          },
        });
        module.exports = HlsPlayer;
      },
      { '../base/player': 67, './hlsinjector': 78 },
    ],
    80: [
      function(require, module, exports) {
        var constants = require('../../lib/constants');
        var oo = require('../../lib/oo');

        var AuthkeyExpiredHandle = oo.extend({
          init: function(player) {
            this.player = player;
            this.tickhandle = null;
          },
        });

        AuthkeyExpiredHandle.prototype.tick = function(timeout, callback) {
          var that = this;
          this.tickhandle = setTimeout(function() {
            if (that.player) {
              that.player.trigger(constants.AuthKeyExpiredEvent);
            }
            if (callback) {
              callback();
            }
          }, timeout * 1000);
        };

        AuthkeyExpiredHandle.prototype.clearTick = function(tickhandle) {
          if (this.tickhandle) {
            clearTimeout(this.tickhandle);
          }
        };

        module.exports = AuthkeyExpiredHandle;
      },
      { '../../lib/constants': 21, '../../lib/oo': 33 },
    ],
    81: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var UA = require('../../lib/ua');
        var bufferbase64 = require('../../lib/bufferbase64');
        var constants = require('../../lib/constants');
        var signature = require('./signature');
        var util = require('./util');
        var lang = require('../../lang/index');

        // window.onerror  = function(sMsg,sUrl,sLine){
        //    var str ="<b>An error was thrown and caught.</b><p>";
        //    str +="Error: " + sMsg + "<br>";
        //    str +="Line: " + sLine + "<br>";
        //    str +="URL: " + sUrl + "<br>";
        //    alert(str);
        //    return false;
        // }

        var requestLicenseKey = function(player) {
          var __player = player;
          if (__player._options.vid) {
            __player.__vid = __player._options.vid;
          }
          return function(event, callback) {
            var options = __player._options,
              item = __player._getDRMEncryptItem();
            // alert('getLicenseKey:' + item);
            if (item) {
              var params = {
                vid: __player.__vid,
                accessId: options.accId,
                accessSecret: options.accSecret,
                stsToken: options.stsToken,
                domainRegion: options.domainRegion,
                authInfo: options.authInfo,
                encryptionType: item.encryptionType,
              };
              if (item.encryptionType == constants.EncryptionType.Widevine) {
                params.data = bufferbase64.encode(event.message);
              } else if (item.encryptionType == constants.EncryptionType.PlayReady) {
                var data = bufferbase64.unpackPlayReady(event.message);
                params.data = data.changange;
                if (data.header) {
                  params.header = JSON.stringify(data.header);
                }
              }
              console.log(params.data);
              var licenseKeys = __player.__licenseKeys,
                keyStr = __player.__vid + item.Url;
              if (licenseKeys && licenseKeys[keyStr] && false) {
                var arrayBuffer = bufferbase64.decode(licenseKeys[keyStr]);
                callback(arrayBuffer);
              } else {
                //getLicenseTest(params.data, callback);
                getLicenseKey(
                  params,
                  function(license) {
                    if (!__player.__licenseKeys) {
                      __player.__licenseKeys = {};
                    }
                    if (params.data.length > 10) {
                      __player.__licenseKeys[keyStr] = license;
                    }
                    var arrayBuffer = bufferbase64.decode(license);
                    callback(arrayBuffer);
                  },
                  function(error) {
                    var paramData = {
                      mediaId: __player.__vid,
                      error_code: error.Code,
                      error_msg: error.Message,
                    };

                    // 开始监控
                    __player.logError(paramData);
                    __player.trigger('error', paramData);
                  },
                );
              }
            }
          };
        };

        var getLicenseTest = function(bodydata, callback) {
          var url =
            'https://usp.services.irdeto.com/playready/rightsmanager.asmx?CrmId=ps-dbdc-dev&AccountId=ps-dbdc-dev&ContentId=a7101bac50514dbaa010a238047bee33';
          io.post(
            url,
            bodydata,
            function(data) {
              if (data) {
                callback(data);
              } else {
                if (error) {
                  error(util.createError('MPS获取License失败'));
                }
              }
            },
            function(errorText) {
              if (error) {
                var arg = JSON.parse(errorText);
                error({
                  Code: constants.ErrorCode.ServerAPIError,
                  Message: arg.Code + '|' + arg.Message,
                  sri: arg.requestId,
                });
              }
            },
          );
        };

        var getDRMType = function() {
          if (UA.IS_CHROME) {
            return constants.DRMType.Widevine;
          } else if (UA.IS_EDGE || UA.IS_IE11) {
            return constants.DRMType.PlayReady;
          } else {
            return '';
          }
        };

        var getLicenseKey = function(params, callback, error) {
          var SignatureNonceNum = signature.randomUUID();
          var SignatureMethodT = 'HMAC-SHA1',
            url = 'https://mts.' + params.domainRegion + '.aliyuncs.com/?';
          var newAry = {
            AccessKeyId: params.accessId,
            Action: 'GetLicense',
            MediaId: params.vid,
            LicenseUrl: url,
            data: params.data,
            SecurityToken: params.stsToken,
            Format: 'JSON',
            Type: params.encryptionType,
            Version: '2014-06-18',
            SignatureMethod: SignatureMethodT,
            SignatureVersion: '1.0',
            SignatureNonce: SignatureNonceNum,
          };

          if (params.header) {
            newAry.Header = params.header;
          }

          var pbugramsdic =
            'Signature=' +
            signature.AliyunEncodeURI(
              signature.makeChangeSiga(newAry, params.accessSecret, 'POST'),
            );

          var httpUrlend = url + pbugramsdic;
          var bodydata = signature.makeUTF8sort(newAry, '=', '&');
          io.post(
            httpUrlend,
            bodydata,
            function(data) {
              if (data) {
                var jsonData = JSON.parse(data);
                if (callback) {
                  var license = jsonData.License;
                  callback(license);
                }
              } else {
                if (error) {
                  error(util.createError('MPS获取License失败'));
                }
              }
            },
            function(errorText) {
              if (error) {
                var arg = {
                  Code: '',
                  Message: lang.get('Error_MTS_Fetch_Urls_Text'),
                };
                try {
                  arg = JSON.parse(errorText);
                } catch (ex) {}
                error({
                  Code: constants.ErrorCode.ServerAPIError,
                  Message: arg.Code + '|' + arg.Message,
                  sri: arg.requestId || '',
                });
              }
            },
          );
        };

        module.exports.requestLicenseKey = requestLicenseKey;
      },
      {
        '../../lang/index': 17,
        '../../lib/bufferbase64': 19,
        '../../lib/constants': 21,
        '../../lib/io': 30,
        '../../lib/ua': 38,
        './signature': 85,
        './util': 87,
      },
    ],
    82: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var constants = require('../../lib/constants');
        var signature = require('./signature');
        var util = require('./util');
        var lang = require('../../lang/index');
        var UA = require('../../lib/ua');

        function getDataByAuthInfo(parame, qualitySort, callback, error) {
          var timemts = signature.returnUTCDate();
          var randNum = signature.randomUUID();
          var SignatureNonceNum = signature.randomUUID();
          // var Timestampmts = ISODateString(new Date());
          var SignatureMethodT = 'HMAC-SHA1';
          var newAry = {
            AccessKeyId: parame.accessId,
            Action: 'PlayInfo',
            MediaId: parame.vid,
            Formats: parame.format, //'mp4', //|m3u8|flv
            AuthInfo: parame.authInfo,
            AuthTimeout: constants.AuthKeyExpired,
            IncludeSnapshotList: parame.includeSnapshotList,
            Rand: randNum,
            SecurityToken: parame.stsToken,
            Format: 'JSON',
            Version: '2014-06-18',
            SignatureMethod: SignatureMethodT,
            // 'Timestamp': Timestampmts,
            SignatureVersion: '1.0',
            Terminal: getTerminal(),
            SignatureNonce: SignatureNonceNum,
          };

          var pbugramsdic =
            signature.makeUTF8sort(newAry, '=', '&') +
            '&Signature=' +
            signature.AliyunEncodeURI(signature.makeChangeSiga(newAry, parame.accessSecret));

          var httpUrlend = 'https://mts.' + parame.domainRegion + '.aliyuncs.com/?' + pbugramsdic;
          //var httpUrlend = 'https://mts.aliyuncs.com/?' + pbugramsdic;
          // return callback({urls:[{
          //   Url:"https://presigned.oss-cn-hangzhou.aliyuncs.com/mengchen.mc/2018-01-19/bento4-dash/dash.mpd",
          //   encryption:1,
          //   definition:'OD'
          // }]});
          io.get(
            httpUrlend,
            function(data) {
              if (data) {
                var jsonData = JSON.parse(data);
                var playInfoAry = jsonData.PlayInfoList.PlayInfo;
                var thumbnailList = jsonData.SnapshotList ? jsonData.SnapshotList.Snapshot : [];
                var thumbnailUrl = '';
                if (thumbnailList && thumbnailList.length > 0) {
                  thumbnailUrl = thumbnailList[0].Url;
                }
                var urls = objectPlayerMessageSort(playInfoAry, qualitySort);
                if (callback) {
                  callback({
                    requestId: jsonData.RequestId,
                    urls: urls,
                    thumbnailUrl: thumbnailUrl,
                  });
                }
              } else {
                if (error) {
                  error(util.createError('MPS获取取数失败'));
                }
              }
            },
            function(errorText) {
              if (error) {
                var arg = {
                  Code: '',
                  Message: lang.get('Error_MTS_Fetch_Urls_Text'),
                };
                try {
                  arg = JSON.parse(errorText);
                } catch (ex) {}
                error({
                  Code: constants.ErrorCode.ServerAPIError,
                  Message: arg.Code + '|' + arg.Message,
                  sri: arg.requestId || '',
                });
              }
            },
          );
        }

        function getTerminal() {
          if (UA.IS_CHROME) {
            return 'Chrome';
          } else if (UA.IS_EDGE) {
            return 'Edge';
          } else if (UA.IS_IE11) {
            return 'IE';
          } else if (UA.IS_SAFARI) {
            return 'Safari';
          } else if (UA.IS_FIREFOX) {
            return 'Firefox';
          } else {
            return '';
          }
        }

        function objectPlayerMessageSort(arrobj, qualitySort) {
          // body...
          var m3u8Urls = [],
            mp4Urls = [],
            mp3Urls = [],
            flvUrls = [];

          for (var i = arrobj.length - 1; i >= 0; i--) {
            var b = arrobj[i];
            // b.width = b.width*1;
            // b.height = b.height *1;
            // //宽高问题，可能出现 宽<=高，由于旋转引起的
            // if (b.width <= b.height) {
            //   b.width = b.height;
            // };
            // b.definition = constants.WidthMapToLevel[b.width];
            if (b.format == 'mp4') {
              mp4Urls.push(b);
            } else if (b.format == 'mp3') {
              mp3Urls.push(b);
            } else if (b.format == 'm3u8') {
              m3u8Urls.push(b);
            } else {
              flvUrls.push(b);
            }
          }

          if (mp3Urls.length > 0) {
            sortMP3Urls(mp3Urls, qualitySort);
            return mp3Urls;
          } else if (mp4Urls.length > 0) {
            sortUrls(mp4Urls, qualitySort);
            return mp4Urls;
          } else if (m3u8Urls.length > 0) {
            sortUrls(m3u8Urls, qualitySort);
            return m3u8Urls;
          } else {
            sortUrls(flvUrls, qualitySort);
            return flvUrls;
          }
        }

        var sortMP3Urls = function(urls, qualitySort) {
          var previous = '';
          urls.sort(function(a, b) {
            var s = parseInt(a.bitrate);
            var t = parseInt(b.bitrate);
            if (qualitySort == 'desc') {
              if (s > t) return -1;
              if (s < t) return 1;
            } else {
              if (s < t) return -1;
              if (s > t) return 1;
            }
          });
          var length = urls.length;
          for (var i = 0; i < length; i++) {
            var item = urls[i];
            var text = constants.QualityLevels[item.definition],
              desc = '';
            if (typeof text == 'undefined') {
              desc = item.bitrate;
            } else if (previous == text) {
              desc = text + item.bitrate;
            } else {
              desc = text;
            }
            item.desc = desc;

            previous = text;
          }
        };

        var sortUrls = function(urls, qualitySort) {
          var previous = '';
          urls.sort(function(a, b) {
            var s = parseInt(a.width);
            var t = parseInt(b.width);
            if (qualitySort == 'desc') {
              if (s > t) return -1;
              if (s < t) return 1;
            } else {
              if (s < t) return -1;
              if (s > t) return 1;
            }
          });
          var length = urls.length;
          for (var i = 0; i < length; i++) {
            var item = urls[i];
            var text = constants.QualityLevels[item.definition],
              desc = '';
            if (typeof text == 'undefined') {
              desc = '未知';
            } else if (previous == text) {
              desc = text + item.height;
            } else {
              desc = text;
            }
            item.desc = desc;

            previous = text;
          }
        };

        module.exports.getDataByAuthInfo = getDataByAuthInfo;
      },
      {
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/io': 30,
        '../../lib/ua': 38,
        './signature': 85,
        './util': 87,
      },
    ],
    83: [
      function(require, module, exports) {
        var SaaSPlayer = require('./saasplayer');
        var constants = require('../../lib/constants');
        var mts = require('./mts');

        var MtsPlayer = SaaSPlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            SaaSPlayer.call(this, tag, options);
            this.service = mts;
            this.loadByMts();
            // //增加参数 来确定用户使用 版本和逻辑   默认 vid + playauth 播放
            // if(typeof this._options.authInfo !='undefined' && this._options.authInfo)
            // {
            //     this.reloadNewVideoInfo();
            // }
            // else if(typeof this._options.playauth != "undefined" && this._options.playauth)
            // {
            //     this.userPlayInfoAndVidRequestMts();
            // }
            // else
            // {
            //     throw new Error('Miss playauth or authInfo parameter.')
            // }
          },
        });

        MtsPlayer.prototype.loadByMts = function(preload) {
          var params = {
            vid: this._options.vid,
            accessId: this._options.accId,
            accessSecret: this._options.accSecret,
            stsToken: this._options.stsToken,
            domainRegion: this._options.domainRegion,
            authInfo: this._options.authInfo,
            format: this._options.format,
            includeSnapshotList: this._options.includeSnapshotList || false,
            defaultDefinition: this._options.defaultDefinition,
          };
          this.loadData(params, preload);
        };

        //用于对外接口 ，重新播放 authinfo
        MtsPlayer.prototype.replayByVidAndAuthInfo = function(
          vid,
          accessId,
          accessSecret,
          user_stsToken,
          user_authInfo,
          user_domainRegion,
        ) {
          this.reloadNewVideoInfo(
            vid,
            accessId,
            accessSecret,
            user_stsToken,
            user_authInfo,
            user_domainRegion,
          );
        };

        //用于对外接口 ，重新播放 authinfo
        MtsPlayer.prototype.reloadNewVideoInfo = function(
          vid,
          accessId,
          accessSecret,
          user_stsToken,
          user_authInfo,
          user_domainRegion,
        ) {
          this.trigger('error_hide');
          this._options.source = '';
          if (vid) {
            this._options.vid = vid;
            this._options.accId = accessId;
            this._options.accessSecret = accessSecret;
            this._options.stsToken = user_stsToken;
            this._options.domainRegion = user_domainRegion;
            this._options.authInfo = user_authInfo;
          }
          if (
            !this._options.vid ||
            !this._options.accId ||
            !this._options.accessSecret ||
            !this._options.stsToken ||
            !this._options.domainRegion ||
            !this._options.authInfo
          ) {
            throw new Error(
              '需要提供vid、accId、accessSecret、stsToken、domainRegion和authInfo参数',
            );
          }

          this.loadByMts(true);
        };

        module.exports = MtsPlayer;
      },
      { '../../lib/constants': 21, './mts': 82, './saasplayer': 84 },
    ],
    84: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var AudioPlayer = require('../audio/audioplayer');
        var Event = require('../../lib/event');
        var io = require('../../lib/io');
        var constants = require('../../lib/constants');
        var signature = require('./signature');
        var AuthKeyExpiredHandle = require('./authkeyexpiredhandle');
        var hlsInjector = require('../hls/hlsinjector');
        var flvInjector = require('../flv/flvinjector');
        var drmInjector = require('../drm/drminjector');
        var Cookie = require('../../lib/cookie');
        var lang = require('../../lang/index');
        var playerUtil = require('../../lib/playerutil');
        var eventType = require('../base/event/eventtype');

        var SaasPlayer = BasePlayer.extend({
          init: function(tag, options) {
            this._authKeyExpiredHandle = new AuthKeyExpiredHandle(this);
            //调用父类的构造函数
            if (options.format == 'mp3') {
              options.height = 'auto';
              options.mediaType = 'audio';
              BasePlayer.prototype.createEl = AudioPlayer.prototype.createEl;
              AudioPlayer.call(this, tag, options);
            } else {
              BasePlayer.call(this, tag, options);
            }
          },
        });

        SaasPlayer.prototype.loadData = function(params, preload) {
          var startTime = new Date().getTime();
          this.log('STARTFETCHDATA', {});
          var that = this;
          this._urls = [];
          this._currentPlayIndex = 0;
          this._retrySwitchUrlCount = 0;
          this._authKeyExpiredHandle.clearTick();
          this.service.getDataByAuthInfo(
            params,
            this._options.qualitySort,
            function(data) {
              that.log('COMPLETEFETCHDATA', {
                cost: new Date().getTime() - startTime,
              });
              if (data.urls && data.urls.length == 0) {
                that._mtsError_message(
                  that,
                  {
                    Code: constants.ErrorCode.URLsIsEmpty,
                    Message: lang.get('Error_Vod_URL_Is_Empty_Text'),
                  },
                  '',
                );
                return;
              }
              that._urls = data.urls;
              that._currentPlayIndex = playerUtil.findSelectedStreamLevel(
                that._urls,
                params.defaultDefinition,
              );
              var url = data.urls[that._currentPlayIndex];
              var src = url.Url;
              that._options.source = src;
              if (playerUtil.isHls(src)) {
                hlsInjector.inject(that, SaasPlayer, BasePlayer, that._options);
              } else if (playerUtil.isFlv(src)) {
                flvInjector.inject(that, SaasPlayer, BasePlayer, that._options);
              } else if (playerUtil.isDash(src)) {
                drmInjector.inject(that, SaasPlayer, BasePlayer, that._options);
              } else {
                that._player._options.readyCallback(that._player);
              }
              that._authKeyExpiredHandle.tick(constants.AuthKeyRefreshExpired);
              that.trigger(eventType.Private.SourceLoaded, url);
              that.initPlay(preload);
              that.trigger(eventType.Private.ChangeURL);
              if (data.thumbnailUrl) {
                that._thumbnailService.get(data.thumbnailUrl);
              }
            },
            function(errorData) {
              that._mtsError_message(that, errorData, '');
            },
          );
        };

        SaasPlayer.prototype._changeStream = function(index, tipText) {
          if (this._urls.length > index) {
            this.loadByUrl(this._urls[index].Url, this.getCurrentTime());
            this._currentPlayIndex = index;
            this.trigger(
              eventType.Private.QualityChange,
              tipText || lang.get('Quality_Change_Fail_Switch_Text'),
            );
          }
        };

        SaasPlayer.prototype._getLowerQualityLevel = function() {
          if (this._urls.length == 0 || this._currentPlayIndex == -1) {
            return '';
          }
          var options = this.options();
          if (options.qualitySort == 'asc') {
            if (this._currentPlayIndex > 0) {
              return {
                item: this._urls[this._currentPlayIndex - 1],
                index: this._currentPlayIndex - 1,
              };
            }
          } else {
            if (this._currentPlayIndex < this._urls.length - 1) {
              return {
                item: this._urls[this._currentPlayIndex + 1],
                index: this._currentPlayIndex + 1,
              };
            }
          }
          return '';
        };

        //mts请求错误时 日志上报
        SaasPlayer.prototype._mtsError_message = function(playerObj, errorObjc, address) {
          var that = playerObj;
          that.trigger('h5_loading_hide');
          var errorObjcCode = errorObjc.Code ? errorObjc.Code : 'OTHER_ERR_CODE';
          var errorObjcMsg = errorObjc.Message ? errorObjc.Message : 'OTHER_ERR_MSG';

          var errorCode = constants.ErrorCode.ServerAPIError;

          var display_msg = errorObjc.display_msg || '';
          //判断加密的只能flash播放
          if (
            errorObjcMsg.indexOf('InvalidParameter.Rand') > -1 ||
            errorObjcMsg.indexOf('"Rand" is not valid.') > -1
          ) {
            errorCode = constants.ErrorCode.EncrptyVideoNotSupport;
            display_msg = lang.get('Error_Not_Support_encrypt_Text');
          } else if (errorObjcMsg.indexOf('SecurityToken.Expired') > -1) {
            errorCode = constants.ErrorCode.AuthKeyExpired;
            display_msg = lang.get('Error_Playauth_Expired_Text');
          } else if (errorObjcMsg.indexOf('InvalidVideo.NoneStream') > -1) {
            errorCode = constants.ErrorCode.URLsIsEmpty;
            display_msg =
              lang.get('Error_Fetch_NotStream') +
              '(' +
              that._options.format +
              '|' +
              that._options.definition +
              ')';
          }

          //mts request_error

          var playerVid = that._options.vid ? that._options.vid : '0';
          var playerFrom = that._options.from ? that._options.from : '0';

          var paramData = {
            mediaId: playerVid,
            error_code: errorObjcCode,
            error_msg: errorObjcMsg,
          };
          if (errorObjc.sri) {
            paramData.sri = errorObjc.sri;
          }

          // 开始监控
          that.logError(paramData);
          paramData.display_msg = display_msg || lang.get('Error_Vod_Fetch_Urls_Text');

          that.trigger('error', paramData);

          console.log('PrismPlayer Error: ' + address + '! ' + 'error_msg :' + errorObjcMsg + ';');
        };

        function validateDRMType(encryptionType) {
          if (encryptionType == constants.EncryptionType.Widevine && !UA.IS_CHROME) {
            return lang.get('Use_Chrome_From_DRM');
          } else if (
            encryptionType == constants.EncryptionType.Playready &&
            !UA.IS_IE11 && !UA.IS_EDGE
          ) {
            return lang.get('Use_Edge_From_DRM');
          } else if (encryptionType == constants.EncryptionType.ChinaDRM) {
            return lang.get('Not_Support_China_DRM_TYPE');
          }
          return '';
        }

        module.exports = SaasPlayer;
      },
      {
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/cookie': 22,
        '../../lib/event': 25,
        '../../lib/io': 30,
        '../../lib/playerutil': 35,
        '../audio/audioplayer': 46,
        '../base/event/eventtype': 48,
        '../base/player': 67,
        '../drm/drminjector': 73,
        '../flv/flvinjector': 76,
        '../hls/hlsinjector': 78,
        './authkeyexpiredhandle': 80,
        './signature': 85,
      },
    ],
    85: [
      function(require, module, exports) {
        // var CryptoJS = require("crypto-js");
        // var jsrsasign = require('jsrsasign');
        var hmacSHA1 = require('crypto-js/hmac-sha1');
        var base64 = require('crypto-js/enc-base64');
        var utf8 = require('crypto-js/enc-utf8');

        module.exports.randomUUID = function() {
          var s = [];
          var hexDigits = '0123456789abcdef';
          for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
          s[8] = s[13] = s[18] = s[23] = '-';

          var uuid = s.join('');
          return uuid;
        };

        //返回utc时间
        module.exports.returnUTCDate = function() {
          var date = new Date();
          var y = date.getUTCFullYear();
          var m = date.getUTCMonth();
          var d = date.getUTCDate();
          var h = date.getUTCHours();
          var M = date.getUTCMinutes();
          var s = date.getUTCSeconds();
          var mms = date.getUTCMilliseconds();
          var utc = Date.UTC(y, m, d, h, M, s, mms);
          return utc;
        };

        //utf8
        module.exports.AliyunEncodeURI = function(input) {
          var output = encodeURIComponent(input);
          //(+)  --> %2B
          //(*)  --> %2A
          //%7E --> ~
          output = output.replace('+', '%2B');
          output = output.replace('*', '%2A');
          output = output.replace('%7E', '~');

          return output;
        };

        module.exports.makesort = function(ary, str1, str2) {
          if (!ary) {
            throw new Error('PrismPlayer Error: vid should not be null!');
          }
          var keys = [];
          for (var key in ary) {
            keys.push(key);
          }
          var pbugramsdic = keys.sort();
          var outputPub = '',
            length = pbugramsdic.length;
          for (var key = 0; key < length; key++) {
            if (outputPub == '') {
              outputPub = pbugramsdic[key] + str1 + ary[pbugramsdic[key]];
            } else {
              outputPub += str2 + pbugramsdic[key] + str1 + ary[pbugramsdic[key]];
            }
          }
          return outputPub;
        };

        module.exports.makeUTF8sort = function(ary, str1, str2) {
          if (!ary) {
            throw new Error('PrismPlayer Error: vid should not be null!');
          }
          var keys = [];
          for (var key in ary) {
            keys.push(key);
          }
          var pbugramsdic = keys.sort();
          var outputPub = '',
            length = pbugramsdic.length;
          for (var key = 0; key < length; key++) {
            var a3 = module.exports.AliyunEncodeURI(pbugramsdic[key]);
            var b3 = module.exports.AliyunEncodeURI(ary[pbugramsdic[key]]);

            if (outputPub == '') {
              outputPub = a3 + str1 + b3;
            } else {
              outputPub += str2 + a3 + str1 + b3;
            }
          }
          return outputPub;
        };

        //signature
        module.exports.makeChangeSiga = function(obj, secStr, type) {
          if (!obj) {
            throw new Error('PrismPlayer Error: vid should not be null!');
          }
          if (!type) {
            type = 'GET';
          }
          return base64.stringify(
            hmacSHA1(
              type +
                '&' +
                module.exports.AliyunEncodeURI('/') +
                '&' +
                module.exports.AliyunEncodeURI(module.exports.makeUTF8sort(obj, '=', '&')),
              secStr + '&',
            ),
          );
        };

        module.exports.ISODateString = function(d) {
          function pad(n) {
            return n < 10 ? '0' + n : n;
          }
          return (
            d.getUTCFullYear() +
            '-' +
            pad(d.getUTCMonth() + 1) +
            '-' +
            pad(d.getUTCDate()) +
            'T' +
            pad(d.getUTCHours()) +
            ':' +
            pad(d.getUTCMinutes()) +
            ':' +
            pad(d.getUTCSeconds()) +
            'Z'
          );
        };

        module.exports.encPlayAuth = function(playauth) {
          var playauth = utf8.stringify(base64.parse(playauth));
          if (!playauth) {
            throw new Error('playuth参数解析为空');
          }
          return JSON.parse(playauth);
        };

        module.exports.encRsa = function() {};
      },
      { 'crypto-js/enc-base64': 2, 'crypto-js/enc-utf8': 3, 'crypto-js/hmac-sha1': 4 },
    ],
    86: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var constants = require('../../lib/constants');
        var signature = require('./signature');
        var util = require('./util');
        var lang = require('../../lang/index');

        var getPlayAuth = function(params, callback, error, pd) {
          var randNum = signature.randomUUID();
          var SignatureNonceNum = signature.randomUUID();
          var SignatureMethodT = 'HMAC-SHA1';

          var newAry = {
            AccessKeyId: params.accessKeyId,
            Action: 'GetVideoPlayAuth',
            VideoId: params.vid,
            AuthTimeout: constants.AuthInfoExpired,
            SecurityToken: params.securityToken,
            Format: 'JSON',
            Version: '2017-03-21',
            SignatureMethod: SignatureMethodT,
            SignatureVersion: '1.0',
            SignatureNonce: SignatureNonceNum,
          };

          var pbugramsdic =
            signature.makeUTF8sort(newAry, '=', '&') +
            '&Signature=' +
            signature.AliyunEncodeURI(signature.makeChangeSiga(newAry, params.accessKeySecret));

          var httpUrlend = 'https://vod.cn-shanghai.aliyuncs.com/?' + pbugramsdic;

          io.get(
            httpUrlend,
            function(data) {
              if (data) {
                var playInfo = JSON.parse(data);
                if (callback) {
                  callback(playInfo.PlayAuth);
                }
              } else {
                if (error) {
                  error(util.createError('获取视频播放凭证失败'));
                }
              }
            },
            function(errorText) {
              if (error) {
                var arg = JSON.parse(errorText);
                error({
                  Code: constants.ErrorCode.ServerAPIError,
                  Message: arg.Code + '|' + arg.Message,
                  sri: arg.requestId,
                  display_msg: lang.get('Fetch_Playauth_Error', pd),
                });
              }
            },
          );
        };

        module.exports.getPlayAuth = getPlayAuth;
      },
      {
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/io': 30,
        './signature': 85,
        './util': 87,
      },
    ],
    87: [
      function(require, module, exports) {
        module.exports.createError = function(msg, code) {
          return {
            requestId: '',
            code: code || '',
            message: msg,
          };
        };
      },
      {},
    ],
    88: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var constants = require('../../lib/constants');
        var signature = require('./signature');
        var util = require('./util');
        var config = require('../../config');
        var lang = require('../../lang/index');

        function getDataByAuthInfo(parame, qualitySort, callback, error) {
          var randNum = signature.randomUUID();
          var SignatureNonceNum = signature.randomUUID();
          // var Timestampmts = ISODateString(new Date());
          var SignatureMethodT = 'HMAC-SHA1';

          var newAry = {
            AccessKeyId: parame.accessId,
            Action: 'GetPlayInfo',
            VideoId: parame.vid,
            Formats: parame.format, //'mp4', //|m3u8|flv
            AuthInfo: parame.authInfo,
            AuthTimeout: constants.AuthKeyExpired,
            Rand: randNum,
            SecurityToken: parame.stsToken,
            StreamType: parame.mediaType,
            Format: 'JSON',
            Version: '2017-03-21',
            SignatureMethod: SignatureMethodT,
            SignatureVersion: '1.0',
            SignatureNonce: SignatureNonceNum,
            PlayerVersion: config.h5Version,
            Definition: parame.definition,
            Channel: 'HTML5',
          };

          var pbugramsdic =
            signature.makeUTF8sort(newAry, '=', '&') +
            '&Signature=' +
            signature.AliyunEncodeURI(signature.makeChangeSiga(newAry, parame.accessSecret));

          var httpUrlend = 'https://vod.cn-shanghai.aliyuncs.com/?' + pbugramsdic;

          io.get(
            httpUrlend,
            function(data) {
              if (data) {
                var jsonData = JSON.parse(data);
                var thumbnailUrl = '';
                var thumbnailList = jsonData.VideoBase.ThumbnailList;
                if (
                  thumbnailList &&
                  thumbnailList.Thumbnail &&
                  thumbnailList.Thumbnail.length > 0
                ) {
                  thumbnailUrl = thumbnailList.Thumbnail[0].URL;
                }
                var playInfoAry = jsonData.PlayInfoList.PlayInfo;
                var urls = objectPlayerMessageSort(playInfoAry, qualitySort);
                if (callback) {
                  callback({
                    requestId: jsonData.RequestId,
                    urls: urls,
                    thumbnailUrl: thumbnailUrl,
                  });
                }
              } else {
                if (error) {
                  error(util.createError('点播服务获取取数失败'));
                }
              }
            },
            function(errorText) {
              if (error) {
                var arg = {
                  Code: '',
                  Message: lang.get('Error_Vod_Fetch_Urls_Text'),
                };
                try {
                  arg = JSON.parse(errorText);
                } catch (ex) {}
                error({
                  Code: constants.ErrorCode.ServerAPIError,
                  Message: arg.Code + '|' + arg.Message,
                  sri: arg.requestId || '',
                });
              }
            },
          );
        }

        function getItem(item) {
          var obj = {};
          obj.width = item.Width;
          obj.height = item.Height;
          obj.definition = item.Definition;
          obj.Url = item.PlayURL;
          obj.format = item.Format;
          obj.desc = constants.QualityLevels[obj.definition];
          return obj;
        }

        function objectPlayerMessageSort(arrobj, qualitySort) {
          var m3u8Urls = [],
            mp4Urls = [],
            mp3Urls = [],
            flvUrls = [];

          for (var i = arrobj.length - 1; i >= 0; i--) {
            var b = arrobj[i];
            var item = getItem(b);
            if (item.format == 'mp4') {
              mp4Urls.push(item);
            } else if (item.format == 'mp3') {
              mp3Urls.push(item);
            } else if (item.format == 'm3u8') {
              m3u8Urls.push(item);
            } else {
              flvUrls.push(item);
            }
          }
          var urls = [];
          if (mp3Urls.length > 0) {
            urls = mp3Urls;
          } else if (mp4Urls.length > 0) {
            urls = mp4Urls;
          } else if (m3u8Urls.length > 0) {
            urls = m3u8Urls;
          } else {
            urls = flvUrls;
          }

          if (qualitySort == 'asc') {
            urls.reverse();
          }
          return urls;
        }

        module.exports.getDataByAuthInfo = getDataByAuthInfo;
      },
      {
        '../../config': 11,
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/io': 30,
        './signature': 85,
        './util': 87,
      },
    ],
    89: [
      function(require, module, exports) {
        var SaaSPlayer = require('./saasplayer');
        var constants = require('../../lib/constants');
        var vod = require('./vod');
        var signature = require('./signature');
        var AuthKeyExpiredHandle = require('./authkeyexpiredhandle');
        var stsToken = require('./ststoken');

        var VodPlayer = SaaSPlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            SaaSPlayer.call(this, tag, options);
            this.service = vod;
            var that = this;
            if (this._options.accessKeyId && this._options.accessKeySecret) {
              stsToken.getPlayAuth(
                this._options,
                function(data) {
                  that._options.playauth = data;
                  that.loadByVod();
                },
                function(error) {
                  that._mtsError_message(that, error, '');
                },
              );
            } else {
              that.loadByVod();
            }
          },
        });

        //vid playInfo -> mts 2017-04-19  playauth
        VodPlayer.prototype.loadByVod = function(preload) {
          try {
            var playauth = signature.encPlayAuth(this._options.playauth);
          } catch (e) {
            var paramData = {
              Code: constants.ErrorCode.PlayauthDecode,
              Message: 'playauth decoded failed.',
              displayMessage: 'playauth解析错误',
            };
            this._mtsError_message(this, paramData, this._options.playauth);
            return;
          }

          //buisness_id
          this._options.from = playauth.CustomerId ? playauth.CustomerId : '';
          var coverUrl = playauth.VideoMeta.CoverURL;
          if (this.UI.cover && coverUrl && !this._options.cover) {
            var el = document.querySelector('#' + this.id() + ' .prism-cover');
            el.style.backgroundImage = 'url(' + coverUrl + ')';
          }

          var params = {
            vid: this._options.vid,
            accessId: playauth.AccessKeyId,
            accessSecret: playauth.AccessKeySecret,
            stsToken: playauth.SecurityToken,
            domainRegion: playauth.Region,
            authInfo: playauth.AuthInfo,
            playDomain: playauth.PlayDomain,
            format: this._options.format,
            mediaType: this._options.mediaType,
            definition: this._options.definition,
            defaultDefinition: this._options.defaultDefinition,
          };

          this.loadData(params, preload);
        };

        //用于对外接口 ，重新播放 playAuth
        VodPlayer.prototype.replayByVidAndPlayAuth = function(vid, playAuth) {
          this.trigger('error_hide');
          this._options.source = '';
          this._options.vid = vid;
          this._options.playauth = playAuth;

          this.loadByVod(true);
        };

        VodPlayer.prototype.updateSourcesByVidAndPlayAuth = function(vid, playAuth) {
          if (vid != this._options.vid) {
            console.log('不能更新地址，vid和播放中的不一致');
            return;
          }
          this._options.vid = vid;
          this._options.playauth = playAuth;
          try {
            var playauth = signature.encPlayAuth(this._options.playauth);
          } catch (e) {
            console.log('playauth解析错误');
            return;
          }

          var params = {
            vid: vid,
            accessId: playauth.AccessKeyId,
            accessSecret: playauth.AccessKeySecret,
            stsToken: playauth.SecurityToken,
            domainRegion: playauth.Region,
            authInfo: playauth.AuthInfo,
            playDomain: playauth.PlayDomain,
            format: this._options.format,
            mediaType: this._options.mediaTyp,
          };
          this._authKeyExpiredHandle.clearTick();
          var that = this;
          this.service.loadData(
            params,
            this._options.qualitySort,
            function(data) {
              that._serverRequestId = data.requestId;

              if (data.urls.length != 0) {
                that._urls = data.urls;
              }
              that._authKeyExpiredHandle.tick(constants.AuthKeyRefreshExpired);
            },
            function(errorData) {
              console.log(errorData);
            },
          );
        };

        //用于对外接口 ，重新播放 playAuth
        VodPlayer.prototype.reloaduserPlayInfoAndVidRequestMts = function(vid, playAuth) {
          this.replayByVidAndPlayAuth(vid, playAuth);
        };

        module.exports = VodPlayer;
      },
      {
        '../../lib/constants': 21,
        './authkeyexpiredhandle': 80,
        './saasplayer': 84,
        './signature': 85,
        './ststoken': 86,
        './vod': 88,
      },
    ],
    90: [
      function(require, module, exports) {
        var ra = require('../../lib/requestanimation');
        var AiRect = require('../../ui/component/ai/rect');
        var AiContainer = require('../../ui/component/ai/aicontainer');
        var io = require('../../lib/io');
        var util = require('../../lib/util');
        var Url = require('../../lib/url');
        var eventType = require('../base/event/eventtype');

        var AiLabelService = function(player, absoluteDate) {
          this._player = player;
          this._absoluteDate = absoluteDate || player._options.ai.startDateTime || 0;
          this._aiContainer = null;
          this._aiSetting = [];
          this._aiRects = [];
          this._status = 'init';
          var that = this;
          this._player.on('pause', function() {
            that.cancel();
          });
          this._player.on('ended', function() {
            that.cancel();
          });
          this._player.on('error', function() {
            that.cancel();
          });

          this._player.on('completeSeek', function() {
            this._aiSetting = [];
            that._queryStartDate = 0;
          });

          var recomputeLayout = function() {
            if (that._aiContainer) {
              setTimeout(function() {
                that._aiContainer.reLayout();
              }, 1000);
            }
          };
          this._player.on('requestFullScreen', recomputeLayout);

          this._player.on('cancelFullScreen', recomputeLayout);
        };

        var mock = function(that) {
          that._aiSetting = that._player._options.ai.boxes;
        };

        AiLabelService.prototype.startMeta = function() {
          this._status = 'running';
          var that = this;
          var ai = that._player._options.ai;
          var time = ai.waitMetaDataTime || 0;
          if (this._player.getProgramDateTime && !this._absoluteDate) {
            var dateTime = this._player.getProgramDateTime();
            if (dateTime != '') {
              this._absoluteDate = dateTime - time * 1000 || 0;
            }
            // var that = this;
            // setInterval(function(){
            // 	that._player.getProgramDateTime();
            // 	console.log('currentTime=' + that._player.getCurrentTime());
            // },1000);
          }
          this._startQueryAiSetting(this._player._options.source, this._absoluteDate, function() {
            //that._player.trigger(eventType.Private.Play_Btn_Show);
            var execute = function() {
              if (that._player.paused()) {
                that._player.play();
              }
              that.start();
              that._player.one('canplay', function() {
                if (!that.__id) {
                  that.start();
                }
              });
              that._player.on('play', function() {
                that.start();
              });
            };
            if (that._aiSetting.length == 0) {
              setTimeout(execute, time * 1000);
            } else {
              execute();
            }
          });
        };

        AiLabelService.prototype.start = function() {
          if (this._status == 'rectRunning') {
            return;
          }
          this._status = 'rectRunning';
          var that = this;
          if (!this._aiContainer) {
            this._aiContainer = new AiContainer(this._player);
            this._player.addChild(this._aiContainer);
            this._aiContainer.computeLayout();
          }
          var handle = function() {
            var settings = this._findAvailableSetting();
            if (settings && settings.length > 0) {
              var rect = null,
                newRects = [];
              for (var i = 0; i < settings.length; i++) {
                rect = null;
                var setting = settings[i];
                if (!setting.tid) {
                  continue;
                }
                setting.w = setting.xmax - setting.xmin;
                setting.h = setting.ymax - setting.ymin;
                setting.x = setting.xmin;
                setting.y = setting.ymin;
                if (this._aiRects.length > i) {
                  rect = this._findAvailableRect(setting);
                  if (rect) {
                    rect.show();
                  }
                }
                if (!rect) {
                  rect = this._createRect(setting);
                  newRects.push(rect);
                }
                if (!setting.videoWidth) {
                  setting.videoWidth = this._player.tag.videoWidth;
                }
                if (!setting.videoHeight) {
                  setting.videoHeight = this._player.tag.videoHeight;
                }
                setting.containerWidth = this._aiContainer.getWidth();
                setting.containerHeight = this._aiContainer.getHeight();
                rect.using = true;
                rect.updateLayout(setting);
              }
              var keepRects = [],
                removeRects = [];
              for (var j = 0; j < this._aiRects.length; j++) {
                var rectObj = this._aiRects[j];
                if (rectObj.using == false) {
                  var count = rectObj.count || 0;
                  rectObj.count = count + 1;
                  rectObj.hide();
                  if (count > 5) {
                    this._aiContainer.removeChild(rectObj);
                  } else {
                    keepRects.push(rectObj);
                  }
                } else {
                  keepRects.push(rectObj);
                  rectObj.count = 0;
                }
              }
              this._aiRects = keepRects.concat(newRects);
            } else if (this._aiSetting.length == 0) {
              this.hideRect();
            }
          };

          this.__id = requestAnimationFrame(function render() {
            //that._player.trigger(eventType.Private.Play_Btn_Hide);
            for (var j = 0; j < that._aiRects.length; j++) {
              that._aiRects[j].using = false;
            }
            handle.call(that);
            if (that._status != 'cancel') {
              that.__id = requestAnimationFrame(render);
            }
          });
        };

        AiLabelService.prototype.cancel = function() {
          this._status = 'cancel';
          if (this.__id) {
            cancelAnimationFrame(this.__id);
            this.__id = null;
          }
          this._cancelQueryAiSetting();
          this._currentSettingIndex = 0;
        };

        AiLabelService.prototype.hideRect = function() {
          for (var j = 0; j < this._aiRects.length; j++) {
            this._aiRects[j].hide();
          }
        };

        AiLabelService.prototype._findAvailableRect = function(setting) {
          for (var j = 0; j < this._aiRects.length; j++) {
            var rect = this._aiRects[j];
            if (rect.getTid() == setting.tid) {
              return rect;
            }
          }
          return '';
        };

        AiLabelService.prototype._findAvailableSetting = function() {
          if (!this._aiSetting) {
            return [];
          }
          var time = this._player.getCurrentTime(),
            absoluteDateTime = this._absoluteDate * 1 + time * 1000,
            settings = [],
            setting = null,
            length = this._aiSetting.length,
            count = 0;
          for (var i = count; i < length; i++) {
            var timeStamp = this._aiSetting[i].timestamp || this._aiSetting[i].timeStamp;
            var duration = timeStamp * 1 - absoluteDateTime;
            //console.log("duration=" + duration);
            if (0 < duration && duration <= 40) {
              var boxes = this._aiSetting[i].boxes;
              if (boxes) {
                settings = settings.concat(boxes);
              }
              count++;
            } else if (duration > 40) {
              break;
            } else {
              count++;
            }
          }
          if (count > 0) {
            //this._currentSettingIndex = count;
            this._aiSetting.splice(0, count);
          }
          return settings;
        };

        AiLabelService.prototype._startQueryAiSetting = function(url, absoluteDate, callback) {
          var optionAI = this._player._options.ai;
          if (optionAI.boxes) {
            mock(this);
            if (callback) {
              callback();
              callback = null;
            }
            return;
          }
          var that = this,
            urlValues = Url.parseUrl(url),
            segments = urlValues.segments,
            host = urlValues.hostname;

          var retrieve = function() {
            that._queryStartDate = that._queryStartDate || absoluteDate;
            var time = that._player.getCurrentTime(),
              absoluteDateTime = absoluteDate * 1 + time * 1000;
            if (absoluteDateTime > that._queryStartDate) {
              that._queryStartDate = Math.floor(absoluteDateTime);
            }
            var endDate = that._queryStartDate * 1 + 1000 * 2;
            var streams = segments[1].split('.');
            var data = {
              domain: optionAI.host || host, //"qt01.alivecdn.com",
              stream: optionAI.streamName || streams[0], //"test1",
              start_time: that._queryStartDate * 1,
              end_time: endDate,
            };
            var loop = function() {
              if (that._status != 'cancel') {
                that.__retrieveHandlerId = setTimeout(function() {
                  retrieve.call(that);
                }, 500);
              }
            };
            util.log(JSON.stringify(data));
            util.log(optionAI.metaQueryUrl);
            var func = function(cb, error) {
              var meta = optionAI.meta;
              if (typeof meta.getMeta == 'function') {
                meta.getMeta(data, cb, error);
              } else {
                io.post(meta.url, JSON.stringify(data), cb, error);
              }
            };
            func(
              function(res) {
                util.log(res);
                if (res) {
                  if (callback) {
                    callback();
                    callback = null;
                  }
                  if (typeof res.Code == 'undefined') {
                    res = JSON.parse(res);
                  }
                  if (!res.Code) {
                    if (res.Content) {
                      var length = res.Content.length;
                      if (length > 0) {
                        that._queryStartDate = res.Content[length - 1].timestamp;
                      }
                      that._aiSetting = that._aiSetting.concat(res.Content);
                    }
                  }
                  loop();
                }
              },
              function(error) {
                loop();
              },
            );
          };
          retrieve();
        };

        AiLabelService.prototype._cancelQueryAiSetting = function() {
          if (this.__retrieveHandlerId) {
            clearTimeout(this.__retrieveHandlerId);
            this.__retrieveHandlerId = null;
            this._queryStartDate = null;
          }
        };

        AiLabelService.prototype._createRect = function(setting) {
          var rect = new AiRect(this._player, setting);
          this._aiContainer.addChild(rect);
          return rect;
        };

        module.exports = AiLabelService;
      },
      {
        '../../lib/io': 30,
        '../../lib/requestanimation': 36,
        '../../lib/url': 39,
        '../../lib/util': 40,
        '../../ui/component/ai/aicontainer': 100,
        '../../ui/component/ai/rect': 101,
        '../base/event/eventtype': 48,
      },
    ],
    91: [
      function(require, module, exports) {
        var EventType = require('../base/event/eventtype');

        var AudioTrackService = function(player) {
          this._player = player;
          this._video = player.tag;
          var that = this;
          (this._isCreated = false), (this._canPlayTriggered = false);
          this._defaultTrack = '';
          player.on(EventType.Private.ChangeURL, function() {
            that._isCreated = false;
            that._canPlayTriggered = false;
            that._defaultTrack = '';
          });
          player.on(EventType.Player.CanPlay, function() {
            if (!that._canPlayTriggered) {
              var tracks = that._getTracks();
              if (tracks) {
                that._isCreated = true;
                player.trigger(EventType.Player.AudioTrackReady, tracks);
                that._notifyDefaultValue(tracks);
              }
              that._canPlayTriggered = true;
            }
          });

          player.on(EventType.Player.AudioTrackUpdated, function(audioTrack) {
            if (!that._isCreated) {
              var tracks = that._getTracks(audioTrack.paramData.audioTracks);
              if (tracks) {
                that._isCreated = true;
                player.trigger(EventType.Player.AudioTrackReady, tracks);
                that._notifyDefaultValue(tracks);
              }
            }
          });
        };

        AudioTrackService.prototype._notifyDefaultValue = function(tracks) {
          if (!this._defaultTrack && tracks.length > 0) {
            this._defaultTrack = tracks[0];
          }
          if (this._defaultTrack) {
            this._player.trigger(EventType.Private.SelectorUpdateList, {
              type: 'audio',
              text: this._defaultTrack.text,
            });
          }
        };

        AudioTrackService.prototype.support = function() {
          if (this._video.audioTracks) {
            return true;
          }
          return false;
        };

        AudioTrackService.prototype._getTracks = function(audioTracks) {
          if (!this.support() && !audioTracks) {
            return null;
          }
          if (
            this._video &&
            this._video.audioTracks &&
            (!audioTracks || (audioTracks && audioTracks.length == 0))
          ) {
            audioTracks = this._video.audioTracks;
          }
          var tracks = [],
            length = audioTracks ? audioTracks.length : 0;
          for (var i = 0; i < length; i++) {
            var curTrack = audioTracks[i];
            var item = {
              value: curTrack.id,
              text: curTrack.label || curTrack.name,
            };
            if (curTrack['default'] || curTrack.enabled) {
              this._defaultTrack = item;
            }
            tracks.push(item);
          }
          return tracks;
        };

        AudioTrackService.prototype['switch'] = function(value) {
          if (this._player._hls) {
            this._player._hls.audioTrack = value * 1;
          } else {
            var length = this._video.audioTracks ? this._video.audioTracks.length : 0;
            for (var i = 0; i < length; i++) {
              var track = this._video.audioTracks[i];
              if (track.id == value) {
                track.enabled = true;
              } else {
                track.enabled = false;
              }
            }
          }
        };

        module.exports = AudioTrackService;
      },
      { '../base/event/eventtype': 48 },
    ],
    92: [
      function(require, module, exports) {
        var EventType = require('../base/event/eventtype');
        var Dom = require('../../lib/dom');
        var UA = require('../../lib/ua');

        var CCService = function(player) {
          this._video = player.tag;
          this._player = player;
          this._isCreated = false;
          this._backupCC = '';
          this.tracks = [];
          this._defaultTrack = '';
          var that = this;
          player.on(EventType.Private.ChangeURL, function() {
            that._disabledTracks();
            that._isCreated = false;
            that._defaultTrack = '';
          });
          player.on(EventType.Player.CanPlay, function() {
            if (!that._isCreated) {
              that.tracks = that._getTracks();
              that._isCreated = true;
              player.trigger(EventType.Player.TextTrackReady, that.tracks);
              if (that._defaultTrack) {
                player.trigger(EventType.Private.SelectorUpdateList, {
                  type: 'cc',
                  text: that._defaultTrack.text,
                });
              }
            }
          });
          this._adaptiveCueStype();
          player.on(EventType.Player.RequestFullScreen, function() {
            that._adaptiveCueStype();
          });
          player.on(EventType.Player.CancelFullScreen, function() {
            that._adaptiveCueStype();
          });
        };

        CCService.prototype._adaptiveCueStype = function() {
          var value = -10;
          if (UA.IS_SAFARI) {
            value = -65;
            var service = this._player.fullscreenService;
            if (service && service.getIsFullScreen()) {
              value = -95;
            }
          } else if (UA.IS_MOBILE) {
            value = -30;
          }

          Dom.addCssByStyle(
            'video::-webkit-media-text-track-container{transform: translateY(' +
              value +
              'px) !important;}',
          );
        };

        CCService.prototype.close = function() {
          var length = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
          for (var i = 0; i < length; i++) {
            var track = this._video.textTracks[i];
            if (track.mode == 'expired') {
              continue;
            }
            if (track.mode == 'showing') {
              this._backupCC = track;
            }
            track.mode = 'disabled';
          }
        };

        CCService.prototype.open = function() {
          if (!this.tracks || this.tracks.length < 2) {
            return;
          }
          var language = this._backupCC ? this._backupCC.language : '',
            label = this._backupCC ? this._backupCC.label : '';
          if (!language) {
            language = this.tracks[1].value;
            label = this.tracks[1].text;
          }
          this['switch'](language);
          return label;
        };

        CCService.prototype._getTracks = function() {
          var length = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
          this._defaultTrack = { value: 'off', text: 'Off' };
          var tracks = [this._defaultTrack];
          for (var i = 0; i < length; i++) {
            var curTrack = this._video.textTracks[i];
            if (curTrack.mode == 'expired') {
              continue;
            }
            if (curTrack.kind == 'subtitles') {
              var item = {
                value: curTrack.language,
                text: curTrack.label,
              };
              if (curTrack['default']) {
                this._defaultTrack = item;
              }
              tracks.push(item);
            }
          }
          return tracks;
        };

        CCService.prototype._disabledTracks = function() {
          var length = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
          for (var i = 0; i < length; i++) {
            var curTrack = this._video.textTracks[i];
            curTrack.mode = 'expired';
          }
        };

        CCService.prototype['switch'] = function(value) {
          this.close();
          if (value != 'off') {
            var length = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
            for (var i = 0; i < length; i++) {
              var textTrack = this._video.textTracks[i];
              if (textTrack.language === value && textTrack.mode != 'expired') {
                this._video.textTracks[i].mode = 'showing';
              }
            }
          } else {
            this.close();
          }
        };

        module.exports = CCService;
      },
      { '../../lib/dom': 24, '../../lib/ua': 38, '../base/event/eventtype': 48 },
    ],
    93: [
      function(require, module, exports) {
        var playerUtil = require('../../lib/playerutil');
        module.exports = [
          {
            service: require('./ccservice'),
            name: '_ccService',
            condition: true,
          },
          {
            service: require('./audiotrackservice'),
            name: '_audioTrackService',
          },
          {
            service: require('./qualityservice'),
            name: '_qualityService',
          },
          {
            service: require('./ailabelservice'),
            name: '_aiLabelService',
            condition: function() {
              return this._isEnabledAILabel();
            },
          },

          {
            service: require('./fullscreenservice'),
            name: 'fullscreenService',
            condition: function() {
              return true;
            },
          },
          {
            service: require('./liveshiftservice'),
            name: '_liveshiftService',
            condition: function() {
              var options = this.options();
              return playerUtil.isLiveShift(options);
            },
          },
          {
            service: require('./thumbnailservice'),
            name: '_thumbnailService',
            condition: function() {
              return true;
            },
          },
        ];
      },
      {
        '../../lib/playerutil': 35,
        './ailabelservice': 90,
        './audiotrackservice': 91,
        './ccservice': 92,
        './fullscreenservice': 94,
        './liveshiftservice': 95,
        './qualityservice': 96,
        './thumbnailservice': 97,
      },
    ],
    94: [
      function(require, module, exports) {
        var UA = require('../../lib/ua');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var EventType = require('../base/event/eventtype');
        var x5Play = require('../base/x5play');
        var lang = require('../../lang/index');

        // 检测fullscreen的支持情况，即时函数
        var __supportFullscreen = (function() {
          var prefix, requestFS, div;

          div = Dom.createEl('div');
          requestFS = {};

          var apiMap = [
            // Spec: https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
            [
              'requestFullscreen',
              'exitFullscreen',
              'fullscreenElement',
              'fullscreenEnabled',
              'fullscreenchange',
              'fullscreenerror',
              'fullScreen',
            ],
            // WebKit
            [
              'webkitRequestFullscreen',
              'webkitExitFullscreen',
              'webkitFullscreenElement',
              'webkitFullscreenEnabled',
              'webkitfullscreenchange',
              'webkitfullscreenerror',
              'webkitfullScreen',
            ],
            // Old WebKit(Safari 5.1)
            [
              'webkitRequestFullScreen',
              'webkitCancelFullScreen',
              'webkitCurrentFullScreenElement',
              'webkitFullscreenEnabled',
              'webkitfullscreenchange',
              'webkitfullscreenerror',
              'webkitIsFullScreen',
            ],
            // // safari iOS
            // [
            //   'webkitEnterFullscreen',
            //   'webkitExitFullscreen',
            //   'webkitCurrentFullScreenElement',
            //   'webkitCancelFullScreen',
            //   'webkitfullscreenchange',
            //   'webkitfullscreenerror',
            //   'webkitDisplayingFullscreen'
            // ],
            // Mozilla
            [
              'mozRequestFullScreen',
              'mozCancelFullScreen',
              'mozFullScreenElement',
              'mozFullScreenEnabled',
              'mozfullscreenchange',
              'mozfullscreenerror',
              'mozFullScreen',
            ],
            // Microsoft
            [
              'msRequestFullscreen',
              'msExitFullscreen',
              'msFullscreenElement',
              'msFullscreenEnabled',
              'MSFullscreenChange',
              'MSFullscreenError',
              'MSFullScreen',
            ],
          ];
          var isMatch = false;
          if (UA.IS_IOS) {
            //IOS 特殊处理
            requestFS.requestFn = 'webkitEnterFullscreen';
            requestFS.cancelFn = 'webkitExitFullscreen';
            requestFS.fullscreenElement = 'webkitFullscreenElement';
            requestFS.eventName = 'webkitfullscreenchange';
            requestFS.isFullScreen = 'webkitDisplayingFullscreen';
            if (document[requestFS.requestFn]) {
              isMatch = true;
            }
          }
          if (!isMatch) {
            var l = 5;
            for (var i = 0; i < l; i++) {
              // check for exitFullscreen function
              if (apiMap[i][1] in document) {
                requestFS.requestFn = apiMap[i][0];
                requestFS.cancelFn = apiMap[i][1];
                requestFS.fullscreenElement = apiMap[i][2];
                requestFS.eventName = apiMap[i][4];
                requestFS.isFullScreen = apiMap[i][6];
                break;
              }
            }

            //modify if has write fun
            //full screen
            if ('requestFullscreen' in document) {
              requestFS.requestFn = 'requestFullscreen';
            } else if ('webkitRequestFullscreen' in document) {
              requestFS.requestFn = 'webkitRequestFullscreen';
            } else if ('webkitRequestFullScreen' in document) {
              requestFS.requestFn = 'webkitRequestFullScreen';
            } else if ('webkitEnterFullscreen' in document) {
              requestFS.requestFn = 'webkitEnterFullscreen';
            } else if ('mozRequestFullScreen' in document) {
              requestFS.requestFn = 'mozRequestFullScreen';
            } else if ('msRequestFullscreen' in document) {
              requestFS.requestFn = 'msRequestFullscreen';
            }

            //full screen change
            if ('fullscreenchange' in document) {
              requestFS.eventName = 'fullscreenchange';
            } else if ('webkitfullscreenchange' in document) {
              requestFS.eventName = 'webkitfullscreenchange';
            } else if ('webkitfullscreenchange' in document) {
              requestFS.eventName = 'webkitfullscreenchange';
            } else if ('webkitfullscreenchange' in document) {
              requestFS.eventName = 'webkitfullscreenchange';
            } else if ('mozfullscreenchange' in document) {
              requestFS.eventName = 'mozfullscreenchange';
            } else if ('MSFullscreenChange' in document) {
              requestFS.eventName = 'MSFullscreenChange';
            }

            //full screen status
            if ('fullScreen' in document) {
              requestFS.isFullScreen = 'fullScreen';
            } else if ('webkitfullScreen' in document) {
              requestFS.isFullScreen = 'webkitfullScreen';
            } else if ('webkitIsFullScreen' in document) {
              requestFS.isFullScreen = 'webkitIsFullScreen';
            } else if ('webkitDisplayingFullscreen' in document) {
              requestFS.isFullScreen = 'webkitDisplayingFullscreen';
            } else if ('mozFullScreen' in document) {
              requestFS.isFullScreen = 'mozFullScreen';
            } else if ('mozfullScreen' in document) {
              requestFS.isFullScreen = 'mozfullScreen';
            } else if ('MSFullScreen' in document) {
              requestFS.isFullScreen = 'MSFullScreen';
            }

            //full screen change
            if ('fullscreenElement' in document) {
              requestFS.fullscreenElement = 'fullscreenElement';
            } else if ('webkitFullscreenElement' in document) {
              requestFS.fullscreenElement = 'webkitFullscreenElement';
            } else if ('webkitFullScreenElement' in document) {
              requestFS.fullscreenElement = 'webkitFullScreenElement';
            } else if ('mozFullScreenElement' in document) {
              requestFS.fullscreenElement = 'mozFullScreenElement';
            } else if ('msFullscreenElement' in document) {
              requestFS.fullscreenElement = 'msFullscreenElement';
            } else if ('MSFullscreenElement' in document) {
              requestFS.fullscreenElement = 'MSFullscreenElement';
            }
          }

          if (requestFS.requestFn) {
            return requestFS;
          }

          // 如果浏览器不支持全屏接口，返回null
          return null;
        })();
        // 注意，即时函数

        var FullScreenService = function(player) {
          this.isFullWindow = false;
          this.isFullScreen = false;
          this.isFullScreenChanged = false;
          this._requestFullScreenTimer = null;
          this._cancelFullScreenTimer = null;
          this._player = player;
          var that = this;
          var requestFullScreen = __supportFullscreen;
          if (requestFullScreen) {
            Event.on(document, requestFullScreen.eventName, function(e) {
              var fullscreen = document[requestFullScreen.isFullScreen];
              if (typeof fullscreen != 'undefined') {
                that.isFullScreen = fullscreen;
              } else {
                var fullscreenElement = document[requestFullScreen.fullscreenElement];
                that.isFullScreen = fullscreenElement != null;
              }
              that.isFullScreenChanged = true;
              if (that.isFullScreen === true) {
                that._player.trigger(EventType.Player.RequestFullScreen);
              } else {
                that._player.trigger(EventType.Player.CancelFullScreen);
              }
            });
          }
        };

        /**
         * 设置全屏
         *
         * @method requestFullScreen
         */
        FullScreenService.prototype.requestFullScreen = function() {
          if (x5Play.isAndroidX5() && this._player.paused()) {
            this._player.trigger(EventType.Private.Info_Show, lang.get('Play_Before_Fullscreen'));
            return;
          }
          var requestFullScreen = __supportFullscreen,
            conTag = this._player.el(),
            that = this;
          if (UA.IS_IOS) {
            conTag = this._player.tag;
            conTag[requestFullScreen.requestFn]();
            that._player.trigger(EventType.Player.RequestFullScreen);
            return this;
          }

          this.isFullScreen = true;
          this.isFullScreenChanged = false;
          this._requestFullScreenTimer = null;
          if (!this._cancelFullScreenTimer) {
            clearTimeout(this._cancelFullScreenTimer);
          }
          var that = this;
          // 如果浏览器支持全屏接口

          if (requestFullScreen && !this._player._options.enableMockFullscreen) {
            conTag[requestFullScreen.requestFn]();
            this._requestFullScreenTimer = setTimeout(function() {
              if (!that.isFullScreenChanged) {
                enterFullWindow.apply(that);
                that._player.trigger(EventType.Player.RequestFullScreen);
              }
              that._requestFullScreenTimer = null;
            }, 1000);
            // 如果不支持全屏接口，则模拟实现
          } else {
            enterFullWindow.apply(that);
            this._player.trigger(EventType.Player.RequestFullScreen);
          }

          return this._player;
        };

        /**
         * 取消全屏
         *
         * @method cancelFullScreen
         */
        FullScreenService.prototype.cancelFullScreen = function() {
          var requestFullScreen = __supportFullscreen,
            that = this;
          this.isFullScreen = false;
          this.isFullScreenChanged = false;
          this._cancelFullScreenTimer = null;
          if (!this._requestFullScreenTimer) {
            clearTimeout(this._requestFullScreenTimer);
          }
          var that = this;
          if (requestFullScreen && !this._player._options.enableMockFullscreen) {
            document[requestFullScreen.cancelFn]();
            that._cancelFullScreenTimer = setTimeout(function() {
              if (!that.isFullScreenChanged) {
                exitFullWindow.apply(that);
                that._player.trigger(EventType.Player.CancelFullScreen);
              }
              that._cancelFullScreenTimer = null;
            }, 500);
            if (!this._player.tag.paused) {
              this._player.trigger(EventType.Player.Play);
            }
          } else {
            exitFullWindow.apply(that);
            this._player.trigger(EventType.Player.CancelFullScreen);
            if (!this._player.tag.paused) {
              this._player.trigger(EventType.Player.Play);
            }
          }

          return this._player;
        };

        /**
         * 是否处于全屏
         *
         * @method getIsFullScreen
         * @return {Boolean} 是否为全屏
         */
        FullScreenService.prototype.getIsFullScreen = function() {
          return this.isFullScreen;
        };

        /**
         * 不支持fullscreenAPI时的全屏模拟
         *
         * @method _enterFullWindow
         * @private
         */
        var enterFullWindow = function() {
          var that = this;

          this.isFullWindow = true;
          this.docOrigOverflow = document.documentElement.style.overflow;

          document.documentElement.style.overflow = 'hidden';
          Dom.addClass(document.getElementsByTagName('body')[0], 'prism-full-window');
          //this.trigger('enterfullwindow');
        };

        /**
         * 不支持fullscreenAPI时的取消全屏模拟
         *
         * @method _exitFullWindow
         * @private
         */
        var exitFullWindow = function() {
          this.isFullWindow = false;

          document.documentElement.style.overflow = this.docOrigOverflow;
          Dom.removeClass(document.getElementsByTagName('body')[0], 'prism-full-window');
          //this.trigger('exitfullwindow');
        };

        module.exports = FullScreenService;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/ua': 38,
        '../base/event/eventtype': 48,
        '../base/x5play': 72,
      },
    ],
    95: [
      function(require, module, exports) {
        var io = require('../../lib/io');
        var util = require('../../lib/util');
        var playerUtil = require('../../lib/playerUtil');
        var lang = require('../../lang/index');
        var flvInjector = require('../flv/flvinjector');
        var hlsInjector = require('../hls/hlsinjector');
        var constants = require('../../lib/constants');
        var eventType = require('../base/event/eventtype');
        var Url = require('../../lib/url');

        var getTimeRange = function(liveStartTime, liveOverTime) {
          if (!liveStartTime || !liveStartTime) {
            return;
          }
          var startTime = new Date(liveStartTime),
            endTime = new Date(liveOverTime),
            totalSec = endTime.valueOf() / 1000 - startTime.valueOf() / 1000,
            end = util.extractTime(endTime);
          return {
            start: startTime,
            end: endTime,
            endDisplay: end,
            totalTime: totalSec,
          };
        };

        var compute = function(that, currentTime) {
          if (currentTime) {
            that.currentTimestamp = currentTime;
            that.currentTime = util.convertToDate(currentTime);
            that.currentTimeDisplay = util.extractTime(that.currentTime);
            that.liveShiftStart = that.liveTimeRange.start;
            that.liveShiftEnd = that.liveTimeRange.end;
            that.liveShiftStartDisplay = util.extractTime(that.liveShiftStart);
            that.liveShiftEndDisplay = util.extractTime(that.liveShiftEnd);
            that.availableLiveShiftTime = currentTime - that.liveShiftStart.valueOf() / 1000;
            that.timestampStart = util.convertToTimestamp(that.liveShiftStart);
            that.timestampEnd - util.convertToTimestamp(that.liveShiftEnd);
          }
        };

        var LiveShiftService = function(player) {
          this._player = player;
          this._isLiveShift = false;
          var that = this;
          var init = function() {
            var source = player._options.source;
            this._originalPlayUrl = source;
            this._liveShiftUrl = player._options.liveTimeShiftUrl;
            this.liveTimeRange = getTimeRange(
              player._options.liveStartTime,
              player._options.liveOverTime,
            );
            this.availableLiveShiftTime = 0;
            this.seekTime = -1;
          };
          init.call(this);
          player.liveShiftSerivce = {
            setLiveTimeRange: function(start, end) {
              that.setLiveTimeRange(start, end);
            },
            queryLiveShift: function(url, success, error) {
              that.queryLiveShift(url, success, error);
            },
          };

          player.on(eventType.Private.ChangeURL, function() {
            init.call(that);
          });
        };

        LiveShiftService.prototype.validate = function() {
          if (this.liveTimeRange.start >= this.liveTimeRange.end) {
            return false;
          }
          return true;
        };

        LiveShiftService.prototype.switchToLive = function() {
          var recreatePlayer = that._player._options.recreatePlayer;
          if (recreatePlayer && this._isLiveShift) {
            this._player.dispose();
            recreatePlayer();
            this._isLiveShift = false;
          }
        };

        LiveShiftService.prototype.getBaseTime = function() {
          var baseTime = this.liveShiftStartDisplay;
          if (this.seekTime == -1) {
            baseTime = util.parseTime(this.currentTimeDisplay);
          } else {
            baseTime = util.parseTime(this.liveShiftStartDisplay) + this.seekTime;
          }
          return baseTime;
        };

        LiveShiftService.prototype.getSourceUrl = function(startTime, callback) {
          var url = this._originalPlayUrl;
          if (this.availableLiveShiftTime <= startTime) {
            return url;
          }
          this._isLiveShift = true;
          startTime = parseInt(startTime);
          if (startTime <= 5) {
            startTime = 5;
          }
          url = this._switchLiveShiftPlayer(callback);
          if (url) {
            url = url.replace('lhs_offset_unix_s_0', 'z');
          }
          if (url.indexOf('?') == -1) {
            url = url + '?lhs_offset_unix_s_0=' + startTime;
          } else {
            url = url + '&lhs_offset_unix_s_0=' + startTime;
          }
          return url;
        };

        LiveShiftService.prototype._switchLiveShiftPlayer = function() {
          var url = this._originalPlayUrl,
            liveShiftSource = this._player._options.liveShiftSource,
            source = this._player._options.source;
          if (playerUtil.isHls(source)) {
            url = source;
          } else if (
            playerUtil.isFlv(url) &&
            liveShiftSource &&
            playerUtil.isHls(liveShiftSource)
          ) {
            if (this._player._flv) {
              this._player.destroy();
            }
            var superType = this._player._superType,
              type = this._player._Type;
            this._player._options._autoplay = true;
            hlsInjector.inject(
              this._player,
              type,
              superType,
              this._player._options,
              function() {},
              true,
            );
            return liveShiftSource;
          }
          return url;
        };

        LiveShiftService.prototype._switchLivePlayer = function() {
          var url = this._originalPlayUrl;
          if (playerUtil.isFlv(url)) {
            if (this._player._hls) {
              this._player.destroy();
            }
            var superType = this._player._superType,
              type = this._player._Type;
            this._player._options._autoplay = true;
            flvInjector.inject(
              this._player,
              type,
              superType.prototype,
              this._player._options,
              function() {},
              true,
            );
          }
          return url;
        };

        LiveShiftService.prototype.getTimeline = function(success, error) {
          // var test = '{"retCode":0,"description":"success","timeline":[{"start":1513524809,"end":1513524841},{"start":1513525048,"end":1513525056},{"start":1513525095,"end":1513525129},{"start":1513525156,"end":1513525200}]}';
          // var testData = JSON.parse(test);
          // compute(this,testData);
          // this._player.trigger(eventType.Private.LiveShiftQueryCompleted, testData);
          // return;
          this._player.trigger(eventType.Private.LiveShiftQueryCompleted);
          if (!this._liveShiftUrl) {
            return;
          }
          var that = this;
          this.queryLiveShift(
            this._liveShiftUrl,
            function(data) {
              if (data) {
                var jsonData = data;
                if (jsonData.retCode == 0) {
                  compute(that, jsonData.content.current);
                  if (success) {
                    success();
                  }
                } else {
                  error({
                    Code: constants.ErrorCode.ServerAPIError,
                    Message: jsonData.retCode + '|' + jsonData.description + '|' + jsonData.content,
                  });
                }
              } else {
                console.log('获取直播时移数据失败');
              }
            },
            function(errorText) {
              if (error && errorText) {
                var message = {};
                if (errorText) {
                  if (errorText.indexOf('403 Forbidden') > -1) {
                    (message.Code = constants.ErrorCode.AuthKeyExpired),
                      (message.Message =
                        'Query liveshift failed:' + lang.get('Error_AuthKey_Text'));
                  } else {
                    var arg,
                      message = errorText;
                    try {
                      arg = JSON.parse(errorText);
                    } catch (e) {}
                    if (arg) {
                      message.Code = constants.ErrorCode.ServerAPIError;
                      message.Message = arg.retCode + '|' + arg.description + '|' + arg.content;
                    }
                  }
                  error(message);
                }
              }
            },
          );
        };

        LiveShiftService.prototype.start = function(interval, error) {
          var that = this;
          var loop = function() {
            that._loopHandler = setTimeout(function() {
              that.getTimeline(function() {}, error);
              loop();
            }, interval);
          };
          that.getTimeline(function(data) {
            if (!that._localLiveTimeHandler) {
              that.tickLocalLiveTime();
            }
          }, error);
          loop();
        };

        LiveShiftService.prototype.tickLocalLiveTime = function() {
          var that = this;
          var tick = function() {
            that._localLiveTimeHandler = setTimeout(function() {
              that.currentTimestamp++;
              compute(that, that.currentTimestamp);
              that._player.trigger(eventType.Private.LiveShiftQueryCompleted);
              tick();
            }, 1000);
          };
          tick();
        };

        LiveShiftService.prototype.setLiveTimeRange = function(start, end) {
          if (!start) {
            start = this._player._options.liveStartTime;
          }
          if (!end) {
            end = this._player._options.liveOverTime;
          }
          this.liveTimeRange = getTimeRange(start, end);
          compute(this, this.currentTimestamp);
          this._player.trigger(eventType.Private.LiveShiftQueryCompleted);
        };

        LiveShiftService.prototype.queryLiveShift = function(url, success, error) {
          var that = this;
          io.get(
            url,
            function(data) {
              if (data) {
                var jsonData = JSON.parse(data);
                if (jsonData.retCode == 0) {
                  if (success) {
                    success(jsonData);
                  }
                } else {
                  if (error) {
                    error(jsonData);
                  }
                }
              } else {
                if (error) {
                  error(data);
                }
              }
            },
            function(errorText) {
              if (error) {
                error(errorText);
              }
            },
          );
        };

        LiveShiftService.prototype.stop = function(interval) {
          if (this._loopHandler) {
            clearTimeout(this._loopHandler);
            this._loopHandler = null;
          }
        };

        module.exports = LiveShiftService;
      },
      {
        '../../lang/index': 17,
        '../../lib/constants': 21,
        '../../lib/io': 30,
        '../../lib/playerUtil': 34,
        '../../lib/url': 39,
        '../../lib/util': 40,
        '../base/event/eventtype': 48,
        '../flv/flvinjector': 76,
        '../hls/hlsinjector': 78,
      },
    ],
    96: [
      function(require, module, exports) {
        var EventType = require('../base/event/eventtype');
        var lang = require('../../lang/index');
        var HlsParse = require('../../lib/hls/hlsparse');
        var object = require('../../lib/object');
        var playerUtil = require('../../lib/playerutil');

        var QualityService = function(player) {
          this.levels = [];
          this._player = player;
          var that = this;
          player.on(EventType.Player.LevelsLoaded, function(data) {
            if (that.levels.length > 0) {
              that.levels = [];
            }
            var data = data.paramData;
            if (data && data.levels) {
              var length = data.levels.length;
              for (var i = length - 1; i > -1; i--) {
                var item = data.levels[i];
                if (item.url && item.url.length > 0 && item.attrs && item.attrs.BANDWIDTH) {
                  var url = item.url;
                  if (object.isArray(url)) {
                    url = url[0];
                  }
                  var level = {
                    Url: url,
                    desc: item.height || item.width,
                    bitrate: item.bitrate,
                    resolution: item.attrs.RESOLUTION,
                    bandwidth: item.attrs.BANDWIDTH,
                  };
                  that.levels.push(level);
                }
              }
              if (that.levels.length > 0) {
                var desc = lang.get('Auto');
                that.levels.push({
                  Url: data.url,
                  desc: desc,
                });
                player.trigger(EventType.Private.SelectorUpdateList, {
                  type: 'quality',
                  text: desc,
                });
              }
            }
          });

          player.on(EventType.Video.LoadStart, function() {
            if (player._options) {
              var source = player._options.source;
              if (!player._hls && source && playerUtil.isHls(source)) {
                that.loadLevels(source);
              }
            }
          });
        };

        QualityService.prototype = {
          loadLevels: function(url) {
            var hlsparse = new HlsParse();
            var that = this;
            hlsparse.load(url, function(data) {
              that._player.trigger(EventType.Player.LevelsLoaded, data);
            });
          },
        };

        module.exports = QualityService;
      },
      {
        '../../lang/index': 17,
        '../../lib/hls/hlsparse': 29,
        '../../lib/object': 32,
        '../../lib/playerutil': 35,
        '../base/event/eventtype': 48,
      },
    ],
    97: [
      function(require, module, exports) {
        var IO = require('../../lib/io');
        var URL = require('../../lib/url');
        var thumbnailVTT = require('../../lib/vtt/thumbnailvtt');
        var eventType = require('../base/event/eventtype');

        var ThumbnailService = function(player) {
          this._player = player;
          this.cues = [];
          this.baseUrl = '';
          var that = this;
          player.on(eventType.Private.ChangeURL, function() {
            that.cues = [];
            that.baseUrl = '';
          });
        };

        var getBaseUrl = function(url) {
          var baseurl = '';
          var pathes = URL.parseUrl(url);
          if (pathes) {
            var segment = pathes.segments;
            if (segment && segment.length > 0) {
              var fileName = segment[segment.length - 1];
              baseUrl = url.replace(fileName, '');
            }
          }
          return baseUrl;
        };

        ThumbnailService.prototype = {
          get: function(url) {
            var that = this;
            this.baseUrl = getBaseUrl(url);
            IO.get(
              url,
              function(data) {
                if (data) {
                  thumbnailVTT.parse(data, function(cues) {
                    that.cues = cues;
                    that._player.trigger(eventType.Private.ThumbnailLoaded, cues);
                  });
                }
              },
              function(err) {
                console.log(err);
              },
            );
          },
          findAvailableCue: function(time) {
            var length = this.cues.length;
            for (var i = 0; i < length; i++) {
              var cue = this.cues[i];

              if (cue.startTime <= time && time < cue.endTime) {
                return cue;
              }
            }
            return null;
          },
          makeUrl: function(url) {
            if (url.indexOf('://') == -1) {
              url = this.baseUrl + url;
            }
            return url;
          },
        };
        module.exports = ThumbnailService;
      },
      {
        '../../lib/io': 30,
        '../../lib/url': 39,
        '../../lib/vtt/thumbnailvtt': 41,
        '../base/event/eventtype': 48,
      },
    ],
    98: [
      function(require, module, exports) {
        var BasePlayer = require('../base/player');
        var hlsInjector = require('../hls/hlsinjector');
        var io = require('../../lib/io');

        var TaoTVPlayer = BasePlayer.extend({
          init: function(tag, options) {
            //调用父类的构造函数
            BasePlayer.call(this, tag, options);
            //兼容 taotv和youku
            this.loadVideoInfo();
          },
        });

        /**
         * 异步获取videoinfo，成功后触发readyState的检测hack，
         * 因为有很多ui组件的ui更新需要依赖于metadata（时长、buffered等）
         */

        TaoTVPlayer.prototype.loadVideoInfo = function(ready) {
          this.trigger('error_hide');
          var vid = this._options.vid,
            that = this;

          if (!vid) {
            throw new Error('PrismPlayer Error: vid should not be null!');
          }

          // tv.taobao.com
          io.jsonp(
            '//tv.taobao.com/player/json/getBaseVideoInfo.do?vid=' + vid + '&playerType=3',
            function(data) {
              // applewatch 和 new iphone的临时修改，由于这个活动访问量较大，接口请求临时走cdn
              //io.jsonp('//www.taobao.com/go/rgn/tv/ajax/applewatch-media.php?vid=' + vid + '&playerType=3', function(data) {

              if (data.status === 1 && data.data.source) {
                var src,
                  maxDef = -1;
                _.each(data.data.source, function(k, v) {
                  var def = +k.substring(1);
                  if (def > maxDef) maxDef = def;
                });
                src = data.data.source['v' + maxDef];
                src = _.unescape(
                  src,
                ) /*.replace(/n\.videotest\.alikunlun\.com/g, 'd.tv.taobao.com')*/;
                that._options.source = src;
                hlsInjector.inject(that, TaobaoTVPlayer, BasePlayer.prototype, that._options);
                that.initPlay();
                if (ready) {
                  ready();
                }
              } else {
                throw new Error('PrismPlayer Error: #vid:' + vid + ' cannot find video resource!');
              }
            },
            function() {
              throw new Error('PrismPlayer Error: network error!');
            },
          );
        };

        //通过id加载视频
        TaoTVPlayer.prototype.loadByVid = function(vid) {
          this._options.vid = vid;
          var that = this;

          if (!vid) {
            throw new Error('PrismPlayer Error: vid should not be null!');
          }
          if (this._monitor) {
            this._monitor.updateVideoInfo({
              video_id: vid,
              album_id: data.data.baseInfo.aid,
              source: src,
              from: that._options.from,
            });
          }
          this._options.autoplay = true;
          this.loadVideoInfo(function() {
            //if preload/autoplay, canplaythrough delete cover; else play delete cover
            if (that.cover && that._options.autoplay) {
              Dom.css(that.cover, 'display', 'none');
              delete that.cover;
            }
            that.tag.play();
          });
        };

        module.exports = TaoTVPlayer;
      },
      { '../../lib/io': 30, '../base/player': 67, '../hls/hlsinjector': 78 },
    ],
    99: [
      function(require, module, exports) {
        var oo = require('../lib/oo');
        var Data = require('../lib/data');
        var _ = require('../lib/object');
        var Dom = require('../lib/dom');
        var Event = require('../lib/event');
        var Fn = require('../lib/function');
        var Layout = require('../lib/layout');
        var constants = require('../lib/constants');
        var util = require('../lib/util');
        var eventType = require('../player/base/event/eventtype');
        var componentUtil = require('./component/util');

        var Component = oo.extend({
          init: function(player, options) {
            var that = this;

            this._player = player;
            this._eventState = '';

            // Make a copy of prototype.options_ to protect against overriding global defaults
            this._options = _.copy(options);
            this._el = this.createEl();
            var ids = player.id;
            if (typeof player.id == 'function') {
              ids = player.id();
            }
            this._id = ids + '_component_' + Data.guid();

            this._children = [];
            this._childIndex = {};

            // 只有组件真正被添加到dom树中后再同步ui、绑定事件
            // 从而避免获取不到dom元素
            this._player.on(eventType.Private.UiH5Ready, function() {
              that.renderUI();
              that.syncUI();
              that.bindEvent();
            });
          },
        });

        /**
         * 渲染ui
         */
        Component.prototype.renderUI = function() {
          // 根据ui组件的配置渲染layout
          Layout.render(this.el(), this.options());
          // 设置id
          this.el().id = this.id();
        };

        /**
         * 同步ui状态，子类中实现
         */
        Component.prototype.syncUI = function() {};

        /**
         * 绑定事件，子类中实现
         */
        Component.prototype.bindEvent = function() {};

        /**
         * 生成compoent的dom元素
         *
         */
        Component.prototype.createEl = function(tagName, attributes) {
          return Dom.createEl(tagName, attributes);
        };

        // Component.prototype.createIcon = function(type,Name,iconName)
        // {
        //   if(!type)
        //   {
        //     return;
        //   }
        //   type = type.toLowercase();
        //   if(type == constants.IconType.FontClass)
        //   {
        //     if(!Name)
        //     {
        //       name ="iconfont";
        //     }
        //     var name = util.htmlEncodeAll(name);
        //     var ele = Component.prototype.createEl('i',{
        //       class:name + " " + iconName
        //     });

        //     Dom.insertFirst(ele, this);
        //   }
        //   else if(type == constants.IconType.Symbol)
        //   {
        //     if(!Name)
        //     {
        //       name ="icon";
        //     }
        //     var name = util.htmlEncodeAll(name);
        //     var svg = Component.prototype.createEl('svg',{
        //       class:name
        //     });
        //     svg.innerHtml = ' <use xlink:href=#'+iconName +'></use>';

        //     Dom.insertFirst(svg, this);
        //   }
        // }

        /**
         * 获取component的所有配置项
         *
         */

        Component.prototype.options = function(obj) {
          if (obj === undefined) return this._options;

          return (this._options = _.merge(this._options, obj));
        };

        /**
         * 获取componet的dom元素
         *
         */
        Component.prototype.el = function() {
          return this._el;
        };

        Component.prototype._contentEl;

        Component.prototype.player = function() {
          return this._player;
        };

        /**
         * Return the component's DOM element for embedding content.
         * Will either be el_ or a new element defined in createEl.
         *
         * @return {Element}
         */
        Component.prototype.contentEl = function() {
          return this._contentEl || this._el;
        };

        /**
         * 设置元素id
         *
         */

        Component.prototype._id;

        /**
         * 获取元素id
         *
         */
        Component.prototype.id = function() {
          return this._id;
        };

        /**
         * 获取元素id
         *
         */
        Component.prototype.getId = function() {
          return this._id;
        };

        /* 子元素相关操作
============================================================================= */

        /**
         * 添加所有子元素
         *
         */
        Component.prototype.addChild = function(child, options) {
          var component, componentClass, componentName, componentId;

          // 如果child是一个字符串
          if (typeof child === 'string') {
            if (!this._player.UI[child]) return;
            component = new this._player.UI[child](this._player, options);
          } else {
            // child是一个compnent对象
            component = child;
          }

          //
          this._children.push(component);

          if (typeof component.id === 'function') {
            this._childIndex[component.id()] = component;
          }

          // 把子元素的dom元素插入父元素中
          if (typeof component['el'] === 'function' && component['el']()) {
            var ele = component['el']();
            ele.id = component['id']();
            this.contentEl().appendChild(ele);
          }

          // 返回添加的子元素
          return component;
        };
        /**
         * 删除指定的子元素
         *
         */
        Component.prototype.removeChild = function(component) {
          if (!component || !this._children) return;

          var childFound = false;
          for (var i = this._children.length - 1; i >= 0; i--) {
            if (this._children[i] === component) {
              childFound = true;
              this._children.splice(i, 1);
              break;
            }
          }

          if (!childFound) return;

          this._childIndex[component.id] = null;

          var compEl = component.el();
          if (compEl && compEl.parentNode === this.contentEl()) {
            this.contentEl().removeChild(component.el());
          }
        };
        /**
         * 初始化所有子元素
         *
         */
        Component.prototype.initChildren = function() {
          var parent, children, child, name, opts;

          parent = this;
          children = this.options()['children'];

          if (children) {
            // 如果多个子元素是一个数组
            if (_.isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                child = children[i];

                if (typeof child == 'string') {
                  name = child;
                  opts = {};
                } else {
                  name = child.name;
                  opts = child;
                }

                parent.addChild(name, opts);
              }
            } else {
              _.each(children, function(name, opts) {
                // Allow for disabling default components
                // e.g. vjs.options['children']['posterImage'] = false
                if (opts === false) return;

                parent.addChild(name, opts);
              });
            }
          }
        };

        /* 事件操作
============================================================================= */

        /**
         * 在component上的的dom元素上添加一个事件监听器
         *
         *     var myFunc = function(){
         *       var myPlayer = this;
         *       // Do something when the event is fired
         *     };
         *
         *     myPlayer.on("eventName", myFunc);
         *
         * The context will be the component.
         *
         * @param  {String}   type The event type e.g. 'click'
         * @param  {Function} fn   The event listener
         * @return {Component} self
         */
        Component.prototype.on = function(type, fn) {
          Event.on(this._el, type, Fn.bind(this, fn));
          return this;
        };

        /**
         * 从component上删除指定事件的监听器
         *
         *     myComponent.off("eventName", myFunc);
         *
         * @param  {String=}   type Event type. Without type it will remove all listeners.
         * @param  {Function=} fn   Event listener. Without fn it will remove all listeners for a type.
         * @return {Component}
         */
        Component.prototype.off = function(type, fn) {
          Event.off(this._el, type, fn);
          return this;
        };

        /**
         * 在组件的元素上添加一个只执行一次的事件监听器
         *
         * @param  {String}   type Event type
         * @param  {Function} fn   Event listener
         * @return {Component}
         */
        Component.prototype.one = function(type, fn) {
          Event.one(this._el, type, Fn.bind(this, fn));
          return this;
        };

        /**
         * 在组件的元素上触发一个事件
         */
        Component.prototype.trigger = function(event, paramData) {
          //
          if (!this._el) {
            return;
          }
          if (paramData || paramData == 0) {
            this._el.paramData = paramData;
          }

          this._eventState = event;

          Event.trigger(this._el, event);
          return this;
        };

        Component.prototype.off = function(event) {
          //
          Event.off(this._el, event);
          return this;
        };

        /* 组件展现
============================================================================= */

        /**
         * 在component上添加指定的className
         *
         * @param {String} classToAdd Classname to add
         * @return {Component}
         */
        Component.prototype.addClass = function(classToAdd) {
          Dom.addClass(this._el, classToAdd);
          return this;
        };

        /**
         * 从component删除指定的className
         *
         * @param {String} classToRemove Classname to remove
         * @return {Component}
         */
        Component.prototype.removeClass = function(classToRemove) {
          Dom.removeClass(this._el, classToRemove);
          return this;
        };

        /**
         * 显示组件
         *
         * @return {Component}
         */
        Component.prototype.show = function() {
          this._el.style.display = 'block';
          return this;
        };

        /**
         * 隐藏组件
         *
         * @return {Component}
         */
        Component.prototype.hide = function() {
          this._el.style.display = 'none';
          return this;
        };

        /**
         * 销毁component
         *
         * @return
         */

        Component.prototype.destroy = function() {
          this.trigger({
            type: 'destroy',
            bubbles: false,
          });

          // 销毁所有子元素
          if (this._children) {
            for (var i = this._children.length - 1; i >= 0; i--) {
              if (this._children[i].destroy) {
                this._children[i].destroy();
              }
            }
          }

          // 删除所有children引用
          this.children_ = null;
          this.childIndex_ = null;

          // 删除所有事件监听器.
          this.off();

          // 从dom中删除所有元素
          if (this._el.parentNode && this._el.id != player.id()) {
            this._el.parentNode.removeChild(this._el);
          }
          // 删除所有data引用
          Data.removeData(this._el);
          this._el = null;
        };

        Component.prototype.registerControlBarTooltip = componentUtil.registerTooltipEvent;

        module.exports = Component;
      },
      {
        '../lib/constants': 21,
        '../lib/data': 23,
        '../lib/dom': 24,
        '../lib/event': 25,
        '../lib/function': 26,
        '../lib/layout': 31,
        '../lib/object': 32,
        '../lib/oo': 33,
        '../lib/util': 40,
        '../player/base/event/eventtype': 48,
        './component/util': 127,
      },
    ],
    100: [
      function(require, module, exports) {
        var Component = require('../../component');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');

        var AiContainer = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass('prism-ai-container');
            this.width = 0;
            this.height = 0;
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this);
            this.bindEvent();
            return el;
          },

          bindEvent: function() {
            var that = this;
            Event.on(window, 'resize', function() {
              that.reLayout();
            });
          },

          computeLayout: function(el) {
            el = el || this.el();
            (videoTag = this._player.tag),
              (playerEle = this._player.el()),
              (videoW = videoTag.videoWidth),
              (videoH = videoTag.videoHeight),
              (eleWidth = playerEle.offsetWidth),
              (eleHeight = playerEle.offsetHeight),
              (tagW = videoTag.offsetWidth),
              (tagH = videoTag.offsetHeight);
            width = eleWidth > tagW ? tagW : eleWidth;
            height = eleHeight > tagH ? tagH : eleHeight;
            if (height / width < videoH / videoW) {
              var videoWidth = (videoW / videoH) * height;
              el.style.width = videoWidth + 'px';
              if (height < eleHeight) {
                //视频不100%填充
                el.style.top = (eleHeight - height) / 2 + 'px';
                el.style.height = height + 'px';
                this.height = height;
              } else {
                el.style.top = '0px';
                el.style.height = '100%';
                this.height = eleHeight;
              }
              el.style.left = (width - videoWidth) / 2 + 'px';
              this.width = videoWidth;
            } else {
              var videoHeight = (videoH / videoW) * width;
              el.style.height = videoHeight + 'px';
              if (width < eleWidth) {
                el.left = (eleWidth - width) / 2 + 'px';
                el.style.width = width + 'px';
                this.width = width;
              } else {
                el.style.width = '100%';
                el.style.left = '0px';
                this.width = eleWidth;
              }
              el.style.top = (height - videoHeight) / 2 + 'px';
              this.height = videoHeight;
            }
          },

          reLayout: function() {
            this.computeLayout();
            var length = this._children.length;
            for (var i = 0; i < length; i++) {
              this._children[i].reset();
            }
          },

          getWidth: function() {
            return this.width;
          },
          getHeight: function() {
            return this.height;
          },
        });

        module.exports = AiContainer;
      },
      { '../../../lib/dom': 24, '../../../lib/event': 25, '../../component': 99 },
    ],
    101: [
      function(require, module, exports) {
        var Component = require('../../component');
        var Dom = require('../../../lib/dom');
        var util = require('../../../lib/util');
        var Event = require('../../../lib/event');

        var AiRect = Component.extend({
          init: function(player, options) {
            Component.call(this, player, options);
            this.addClass('prism-ai-marking');
            this._width = 0;
            this._height = 0;
            this._tid = '';
          },
          createEl: function() {
            var el = Component.prototype.createEl.call(this);
            var plug =
              '<?xml version="1.0" encoding="UTF-8"?>' +
              '<svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
              '<!-- Generator: Sketch 49.1 (51147) - http://www.bohemiancoding.com/sketch -->' +
              '<title>Artboard 2</title>' +
              '<desc>Created with Sketch.</desc>' +
              '<defs></defs>' +
              '<g id="plug" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
              '<path d="M3,3 L3,0 L5,0 L5,3 L8,3 L8,5 L5,5 L5,8 L3,8 L3,5 L0,5 L0,3 L3,3 Z" id="Combined-Shape" fill="#FF1D00" fill-rule="nonzero"></path>' +
              '</g>' +
              '</svg>';
            el.innerHTML =
              '<div class="prism-ai-rect-region"><div class="prism-ai-title"><div class="top-left-anchor"></div><div class="top-right-anchor"></div><p></p></div>' +
              '<div class="prism-ai-rect"><div class="prism-ai-slash-container"><div class="prism-ai-top-slash prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div><div class="prism-ai-slash"></div></div></div>' +
              '<div class="anchor-plug top-left">' +
              plug +
              '</div>' +
              '<div class="anchor-plug top-right">' +
              plug +
              '</div>' +
              '<div class="anchor-plug bottom-left">' +
              plug +
              '</div>' +
              '<div class="anchor-plug bottom-right">' +
              plug +
              '</div></div>' +
              '<div class="prism-ai-labels"></div>';
            return el;
            // + '<span class="vertical top-left"><i></i></span><span class="horizental top-left"><i></i></span>'
            // + '<span class="vertical top-right"><i></i></span><span class="horizental top-right"><i></i></span>'
            // + '<span class="vertical bottom-left"><i></i></span><span class="horizental bottom-left"><i></i></span>'
            // + '<span class="vertical bottom-right"><i></i></span><span class="horizental bottom-right"><i></i></span>
          },

          updateLayout: function(setting) {
            this._tid = setting.tid;
            var ele = this.el(),
              transformName = Dom.getTransformName(ele),
              // translate = " translate("+setting.x*100/setting.videoWidth + "%, " + setting.y*100/setting.videoHeight + "%)",
              scale = '';
            var rectEle = document.querySelector('#' + this.id() + ' .prism-ai-rect');
            // if(!this._width)
            // {
            this._width = setting.w;
            this._height = setting.h;
            util.log(
              'tid=' +
                setting.tid +
                ' width=' +
                setting.w +
                ' videoWidth=' +
                setting.videoWidth +
                ' containerWidth=' +
                setting.containerWidth,
            );
            rectEle.style.width = (setting.w / setting.videoWidth) * setting.containerWidth + 'px';
            rectEle.style.height =
              (setting.h / setting.videoHeight) * setting.containerHeight + 'px';
            // }
            // else
            // {
            // 	rectEle.style[transformName] = " scale("+setting.w/this._width + "," + setting.h/this._height + ")";
            // }
            var borderColor, borderWidth;
            if (setting.color) {
              borderColor = setting.color ? setting.color : '#00ff00';
              rectEle.style['border-style'] = 'solid';
              rectEle.style['border-color'] = borderColor;
            }
            if (setting.thickness) {
              borderWidth = setting.thickness;
              rectEle.style['border-width'] = borderWidth + 'px';
            }

            // ele.style[transformName]= translate;
            ele.style['left'] = (setting.x * 100) / setting.videoWidth + '%';
            ele.style['top'] = (setting.y * 100) / setting.videoHeight + '%';
            var title = this.updateLabels(setting.attrs);
            if (title) {
              title = title;
              util.log(
                'tid=' +
                  setting.tid +
                  '|xmax=' +
                  setting.xmax +
                  '|xmin=' +
                  setting.xmin +
                  '|ymax=' +
                  setting.ymax +
                  '|ymin=' +
                  setting.ymin,
              );
              this.updateTitle(title);
            }
            if (borderColor && borderWidth) {
              //this.updateCross(borderWidth,borderColor);
            }
            if (borderWidth) {
              //this.updateAnchor(borderWidth);
            }
          },
          updateTitle: function(title) {
            var ele = document.querySelector('#' + this.id() + ' .prism-ai-title p');
            ele.innerText = title;
          },

          updateAnchor: function(borderWidth) {
            var ele = document.querySelector('#' + this.id() + ' .top-left-anchor');
            ele.style['border-width'] = borderWidth + 'px';
            ele = document.querySelector('#' + this.id() + ' .top-right-anchor');
            ele.style['border-width'] = borderWidth + 'px';
          },

          updateCross: function(borderWidth, borderColor) {
            var eles = document.querySelectorAll(
              '#' + this.id() + ' .prism-ai-rect-region span.vertical',
            );
            if (eles) {
              eles.forEach(function(ele) {
                ele.style.height = borderWidth + 'px';
              });
            }

            eles = document.querySelectorAll('#' + this.id() + ' .prism-ai-rect-region span i');
            if (eles) {
              eles.forEach(function(ele) {
                ele.style['background'] = borderColor;
              });
            }

            eles = document.querySelectorAll(
              '#' + this.id() + ' .prism-ai-rect-region span.horizental',
            );
            if (eles) {
              eles.forEach(function(ele) {
                ele.style.width = borderWidth + 'px';
              });
            }
          },

          updateLabels: function(words) {
            if (words && words.length == 0) {
              return;
            }
            var text = wrapperLabels(words, this._player._options.ai);
            var labels = document.querySelector('#' + this.id() + ' .prism-ai-labels');
            labels.innerHTML = text.text;
            return text.title;
          },

          getTid: function() {
            return this._tid;
          },

          hide: function() {
            Dom.css(this.el(), 'opacity', '0');
          },
          show: function() {
            Dom.css(this.el(), 'opacity', '1');
          },

          reset: function() {
            this._width = 0;
            this._height = 0;
          },
        });

        var wrapperLabels = function(words, optonssAI) {
          if (optonssAI.displayAttrs) {
          }
          if (!words || words.length == 0) {
            return '';
          }
          var text = [],
            title = '';
          for (var i = 0; i < words.length; i++) {
            Object.keys(words[i]).forEach(function(key) {
              var value = words[i][key],
                type = optonssAI.displayAttrs[key];
              if (key == optonssAI.displayAttrs.header) {
                title = value;
              } else if (typeof type == 'function') {
                text.push(
                  '<a href="javascript:void(0);" class="prism-ai-clickable" data-value=' +
                    value +
                    '>' +
                    key +
                    '</a>',
                );
              } else if (type == 'text') {
                text.push('<p>' + value + '</p>');
              }
            });
          }
          text = text.join('');
          return {
            text: text,
            title: title,
          };
        };

        module.exports = AiRect;
      },
      {
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/util': 40,
        '../../component': 99,
      },
    ],
    102: [
      function(require, module, exports) {
        /**
         * @fileoverview 大播放按钮
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var eventType = require('../../player/base/event/eventtype');
        var status = require('../../player/base/plugin/status');

        var BigPlayButton = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-big-play-btn');
            // Component.prototype.createIcon.call(this, 'div');
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML = '<div class="outter"></div>';
            return el;
          },

          bindEvent: function() {
            var that = this;

            this._player.on(eventType.Player.Play, function() {
              that.addClass('playing');
              that.removeClass('pause');
              that._hide();
            });

            this._player.on(eventType.Player.Pause, function() {
              if (that._player._switchSourcing) {
                return;
              }
              that.removeClass('playing');
              that.addClass('pause');
              var _status = that._player._status;
              if (_status != status.ended && _status != status.error) {
                that._show();
              }
            });
            var outter = document.querySelector('#' + that.id() + ' .outter');
            Event.on(this.el(), 'mouseover', function() {
              Dom.addClass(outter, 'big-playbtn-hover-animation');
            });

            Event.on(this.el(), 'mouseout', function() {
              Dom.removeClass(outter, 'big-playbtn-hover-animation');
            });

            this.on(eventType.Private.PlayClick, function() {
              if (that._player.paused()) {
                that._player.play(true);
              } else {
                that._player.pause();
              }
            });

            this._player.on(eventType.Private.Play_Btn_Show, function() {
              //that.removeClass('playing');
              that._show();
            });
            //除了播放器状态下，其它情况下隐藏播放按钮
            this._player.on(eventType.Private.Play_Btn_Hide, function() {
              //that.removeClass('playing');
              that._hide();
            });
          },
          _show: function() {
            Dom.css(this.el(), 'display', 'block');
          },
          _hide: function() {
            Dom.css(this.el(), 'display', 'none');
          },
        });

        module.exports = BigPlayButton;
      },
      {
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../player/base/event/eventtype': 48,
        '../../player/base/plugin/status': 71,
        '../component': 99,
      },
    ],
    103: [
      function(require, module, exports) {
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var componentUtil = require('./util');
        var lang = require('../../lang/index');
        var eventType = require('../../player/base/event/eventtype');

        var CCButton = Component.extend({
          init: function(player, options) {
            var that = this;
            that.isOpened = false;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-cc-btn');
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            return el;
          },

          bindEvent: function() {
            var that = this;
            this.on('click', function() {
              Dom.addClass(that._el, 'disabled');
              var value = 'on',
                language = '';
              if (that.isOpened) {
                that._player._ccService.close();
                value = 'off';
              } else {
                language = that._player._ccService.open();
              }
              that.isOpened = !that.isOpened;
              that._player.trigger(eventType.Private.CCStateChanged, {
                value: value,
                lang: language,
              });
              setTimeout(function() {
                Dom.removeClass(that._el, 'disabled');
              }, 1000);
            });

            this._player.on(eventType.Private.CCChanged, function(data) {
              var value = data.paramData;
              that.isOpened = value == 'off' ? false : true;
            });

            componentUtil.registerTooltipEvent.call(this, this.el(), function() {
              if (that.isOpened) {
                return lang.get('CloseSubtitle');
              } else {
                return lang.get('OpenSubtitle');
              }
            });
          },
        });

        module.exports = CCButton;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
      },
    ],
    104: [
      function(require, module, exports) {
        /**
         * @fileoverview 控制条组件
         */
        var Component = require('../component');
        var eventType = require('../../player/base/event/eventtype');
        var Event = require('../../lib/event');

        var ControlBar = Component.extend({
          init: function(player, options) {
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-controlbar');
            this.initChildren();
            this.onEvent();
          },
          createEl: function() {
            var el = Component.prototype.createEl.call(this);
            el.innerHTML = '<div class="prism-controlbar-bg"></div>';
            return el;
          },
          onEvent: function() {
            var player = this.player(),
              option = player.options();
            var that = this;

            this.timer = null;
            var controlBarVisibility = option.controlBarVisibility;
            if (option.controlBarForOver == true) {
              controlBarVisibility = 'hover';
            }
            if (controlBarVisibility == 'hover') {
              that.hide();
              var _showBar = function() {
                if (that._hideHandler) {
                  clearTimeout(that._hideHandler);
                }
                that._show();
                if (player.fullscreenService.getIsFullScreen()) {
                  that._hide();
                }
              };
              player.on(eventType.Private.MouseOver, function() {
                _showBar();
              });

              Event.on(this._player.tag, 'click', function(e) {
                if (e && e.target == e.currentTarget) {
                  _showBar();
                }
              });

              Event.on(this._player.tag, 'touchstart', function(e) {
                if (e && e.target == e.currentTarget) {
                  _showBar();
                }
              });

              player.on(eventType.Private.MouseOut, function() {
                that._hideHandler = setTimeout(function() {
                  that.hide();
                  player.trigger(eventType.Private.HideBar);
                  player.trigger(eventType.Private.VolumeVisibilityChange, '');
                  player.trigger(eventType.Private.SettingListHide);
                });
              });
            } else if (controlBarVisibility == 'click') {
              player.on(eventType.Private.Click, function(e) {
                if (!player._isError) {
                  e.preventDefault();
                  e.stopPropagation();
                  that._show();
                  that._hide();
                }
              });
              player.on(eventType.Player.Ready, function() {
                that._hide();
              });
              player.on(eventType.Private.TouchStart, function() {
                that._show();
              });
              player.on(eventType.Private.TouchMove, function() {
                that._show();
              });
              player.on(eventType.Private.TouchEnd, function() {
                that._hide();
              });
            } else {
              that._show();
            }
          },
          _show: function() {
            this.show();
            this._player.trigger(eventType.Private.ShowBar);
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
          },
          _hide: function() {
            var that = this;
            var player = this.player();
            var curOptions = player.options();
            var hideTime = curOptions.showBarTime;
            this.timer = setTimeout(function() {
              that.hide();
              that._player.trigger(eventType.Private.HideBar);
              that._player.trigger(eventType.Private.VolumeVisibilityChange, '');
              that._player.trigger(eventType.Private.SettingListHide);
            }, hideTime);
          },
        });

        module.exports = ControlBar;
      },
      { '../../lib/event': 25, '../../player/base/event/eventtype': 48, '../component': 99 },
    ],
    105: [
      function(require, module, exports) {
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var eventType = require('../../player/base/event/eventtype');

        var Cover = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-cover');
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            var cover = this.options().cover;
            if (cover) {
              el.style.backgroundImage = 'url(' + cover + ')';
            }
            return el;
          },

          _hide: function(e) {
            var that = this,
              node = document.querySelector('#' + that.id() + ' .prism-cover');
            if (node) {
              Dom.css(node, 'display', 'none');
            }
          },
          _show: function(e) {
            var that = this,
              node = document.querySelector('#' + that.id() + ' .prism-cover');
            if (node) {
              Dom.css(node, 'display', 'block');
            }
          },
          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.Cover_Show, that._show);
            that._player.on(eventType.Private.Cover_Hide, that._hide);
          },
        });

        module.exports = Cover;
      },
      { '../../lib/dom': 24, '../../player/base/event/eventtype': 48, '../component': 99 },
    ],
    106: [
      function(require, module, exports) {
        /**
         * @fileoverview 错误显示
         */
        var Component = require('../component');
        var Util = require('../../lib/util');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var UA = require('../../lib/ua');
        var lang = require('../../lang/index');
        var eventType = require('../../player/base/event/eventtype');

        var ErrorDisplay = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.className = options.className ? options.className : 'prism-ErrorMessage';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              "<div class='prism-error-content'><p></p></div><div class='prism-error-operation'><a class='prism-button prism-button-refresh'>" +
              lang.get('Refresh_Text') +
              '</a>' +
              "<a class='prism-button prism-button-retry'  target='_blank'>" +
              lang.get('Retry') +
              '</a>' +
              "<a class='prism-button prism-button-orange'  target='_blank'>" +
              lang.get('Detection_Text') +
              '</a></div>' +
              "<div class='prism-detect-info prism-center'><p class='errorCode'><span class='info-label'>code：</span><span class='info-content'></span></p>" +
              "<p class='vid'><span class='info-label'>vid:</span><span class='info-content'></span></p>" +
              "<p class='uuid'><span class='info-label'>uuid:</span><span class='info-content'></span></p>" +
              "<p class='requestId'><span class='info-label'>requestId:</span><span class='info-content'></span></p>" +
              "<p class='dateTime'><span class='info-label'>" +
              lang.get('Play_DateTime') +
              "：</span><span class='info-content'></span></p></div>";

            return el;
          },

          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.Error_Show, function(e) {
              var monitorInfo = null;
              if (that._player.getMonitorInfo) {
                monitorInfo = that._player.getMonitorInfo();
              }
              that._show(e, monitorInfo);
            });
            that._player.on(eventType.Private.Error_Hide, function() {
              that._hide();
            });
            var ele = document.querySelector('#' + that.id() + ' .prism-button-refresh');
            Event.on(ele, 'click', function() {
              location.reload(true);
            });
            if (UA.IS_MOBILE) {
              var ele = document.querySelector('#' + that.id() + ' .prism-detect-info');
              Dom.addClass(ele, 'prism-width90');
            }
            var retry = document.querySelector('#' + that.id() + ' .prism-button-retry');
            Event.on(retry, 'click', function() {
              var time = that._player.getCurrentTime(),
                url = that._player._options.source;
              that._player._loadByUrlInner(url, time, true);
            });
          },

          _show: function(e, monitorInfo) {
            var errorData = e.paramData,
              vid = '',
              source = '';
            if (errorData.mediaId) {
              vid = errorData.mediaId;
            }
            var ele = document.querySelector('#' + this.id() + ' .prism-button-orange');
            if (!ele) {
              return;
            }
            if (monitorInfo && this._player._options.diagnosisButtonVisible) {
              if (monitorInfo.vu) {
                source = decodeURIComponent(monitorInfo.vu);
              }

              var url =
                'http://player.alicdn.com/detection.html?from=h5&vid=' +
                vid +
                '&source=' +
                source +
                '&pd=' +
                monitorInfo.pd +
                '&vt=' +
                monitorInfo.vt +
                '&tt=' +
                monitorInfo.tt +
                '&uuid=' +
                monitorInfo.uuid +
                '&av=' +
                monitorInfo.av +
                '&bi=' +
                monitorInfo.bi +
                '&md=' +
                monitorInfo.md +
                '&vu=' +
                source +
                '&lang=' +
                lang.getCurrentLanguage();
              if (ele) {
                ele.href = url;
              }
            } else {
              Dom.css(ele, 'display', 'none');
            }
            var message = errorData.display_msg || errorData.error_msg;
            document.querySelector('#' + this.id() + ' .prism-error-content p').innerHTML = message;
            document.querySelector('#' + this.id() + ' .errorCode .info-content').innerText =
              errorData.error_code;
            var vidEle = document.querySelector('#' + this.id() + ' .vid');
            if (errorData.mediaId) {
              Dom.css(vidEle, 'display', 'block');
              document.querySelector('#' + this.id() + ' .vid .info-content').innerText =
                errorData.mediaId;
            } else {
              Dom.css(vidEle, 'display', 'none');
            }
            if (errorData.uuid) {
              document.querySelector('#' + this.id() + ' .uuid .info-content').innerText =
                errorData.uuid;
            } else {
              var uuid = document.querySelector('#' + this.id() + ' .uuid');
              Dom.css(uuid, 'display', 'none');
            }
            if (errorData.requestId) {
              document.querySelector('#' + this.id() + ' .requestId .info-content').innerText =
                errorData.requestId;
            } else {
              var requestId = document.querySelector('#' + this.id() + ' .requestId');
              Dom.css(requestId, 'display', 'none');
            }
            document.querySelector(
              '#' + this.id() + ' .dateTime .info-content',
            ).innerText = Util.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var element = document.querySelector('#' + this.id());
            Dom.css(element, 'display', 'block');
            var that = this;
            setTimeout(function() {
              that._player.trigger('play_btn_hide');
            });
          },

          _hide: function() {
            var element = document.querySelector('#' + this.id());
            Dom.css(element, 'display', 'none');
          },
        });

        module.exports = ErrorDisplay;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
      },
    ],
    107: [
      function(require, module, exports) {
        /**
         * @fileoverview 全屏按钮
         */
        var Component = require('../component');
        var eventType = require('../../player/base/event/eventtype');
        var Event = require('../../lib/event');
        var UA = require('../../lib/ua');
        var lang = require('../../lang/index');
        var util = require('./util');

        var FullScreenButton = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-fullscreen-btn');
          },

          bindEvent: function() {
            var that = this;
            this._player.on(eventType.Player.RequestFullScreen, function() {
              if (!UA.IS_IOS) {
                that.addClass('fullscreen');
              }
            });

            this._player.on(eventType.Player.CancelFullScreen, function() {
              that.removeClass('fullscreen');
            });
            util.registerTooltipEvent.call(this, this.el(), function() {
              if (that._player.fullscreenService.getIsFullScreen()) {
                return lang.get('ExistFullScreen');
              } else {
                return lang.get('Fullscreen');
              }
            });

            this.on('click', function() {
              //alert("click_full_status:" + this._player.getIsFullScreen());
              if (!that._player.fullscreenService.getIsFullScreen()) {
                that._player.fullscreenService.requestFullScreen();
              } else {
                that._player.fullscreenService.cancelFullScreen();
              }
            });
          },
        });

        module.exports = FullScreenButton;
      },
      {
        '../../lang/index': 17,
        '../../lib/event': 25,
        '../../lib/ua': 38,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
      },
    ],
    108: [
      function(require, module, exports) {
        /**
         * Created by yuyingjie on 2017/3/24.
         */
        'use strict';
        /**
         * @fileoverview 大播放按钮
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var eventType = require('../../player/base/event/eventtype');

        var H5_Loading = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-hide');
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML = '<div class="circle"></div> <div class="circle1"></div>';
            return el;
          },
          _loading_hide: function(e) {
            var that = this,
              loadingNode = document.querySelector('#' + that.id() + ' .prism-loading');
            if (loadingNode) {
              loadingNode.className = 'prism-hide';
            }
          },
          _loading_show: function(e) {
            var that = this,
              loadingNode = document.querySelector('#' + that.id() + ' .prism-hide');
            if (loadingNode) {
              loadingNode.className = 'prism-loading';
            }
          },
          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.H5_Loading_Show, that._loading_show);
            that._player.on(eventType.Private.H5_Loading_Hide, that._loading_hide);
          },
        });

        module.exports = H5_Loading;
      },
      { '../../lib/dom': 24, '../../player/base/event/eventtype': 48, '../component': 99 },
    ],
    109: [
      function(require, module, exports) {
        /**
         * @fileoverview 错误显示
         */
        var Component = require('../component');
        var Util = require('../../lib/util');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var UA = require('../../lib/ua');
        var lang = require('../../lang/index');
        var eventType = require('../../player/base/event/eventtype');

        var InfoDisplay = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.className = options.className ? options.className : 'prism-info-display';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'p');
            return el;
          },

          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.Info_Show, function(e) {
              var element = document.querySelector('#' + that.getId()),
                info = e.paramData;
              if (info) {
                if (typeof info.text != 'undefined' && info.text) {
                  element.innerHTML = info.text;
                  if (typeof info.duration != 'undefined' && info.duration) {
                    setTimeout(function() {
                      Dom.css(element, 'display', 'none');
                    }, info.duration);
                  }
                  if (typeof info.align != 'bl') {
                    Dom.addClass(element, 'prism-info-left-bottom');
                  } else {
                    Dom.removeClass(element, 'prism-info-left-bottom');
                  }
                } else {
                  element.innerHTML = info;
                }
                Dom.css(element, 'display', 'block');
              }
            });
            that._player.on(eventType.Private.Info_Hide, function(e) {
              var element = document.querySelector('#' + that.getId());
              Dom.css(element, 'display', 'none');
            });
          },
        });

        module.exports = InfoDisplay;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
      },
    ],
    110: [
      function(require, module, exports) {
        /**
         * @fileoverview 直播状态 icon
         */
        var Component = require('../component');
        var componentUtil = require('./util');
        var Util = require('../../lib/util');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var playerUtil = require('../../lib/playerUtil');
        var lang = require('../../lang/index');

        var LiveDisplay = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);

            this.className = options.className ? options.className : 'prism-live-display';
            this.addClass(this.className);
          },
          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'p');
            el.innerText = 'LIVE';
            if (playerUtil.isLiveShift(this._player._options)) {
              Dom.addClass(el, 'live-shift-display');
            }
            return el;
          },
          bindEvent: function() {
            var ele = document.querySelector('#' + this.id());
            var that = this;
            if (playerUtil.isLiveShift(this._player._options)) {
              Event.on(ele, 'click', function() {
                that._player._liveshiftService.switchToLive();
              });
              componentUtil.registerTooltipEvent.call(this, this.el(), lang.get('SwitchToLive'));
            }
          },
        });

        module.exports = LiveDisplay;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/playerUtil': 34,
        '../../lib/util': 40,
        '../component': 99,
        './util': 127,
      },
    ],
    111: [
      function(require, module, exports) {
        /**
         * @fileoverview 大播放按钮
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var eventType = require('../../player/base/event/eventtype');
        var status = require('../../player/base/plugin/status');

        var PlayAnimation = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-animation');
            // Component.prototype.createIcon.call(this, 'div');
          },

          bindEvent: function() {
            var that = this;
            this._player.on(eventType.Player.Play, function() {
              that.removeClass('prism-pause-animation');
              that.addClass('prism-play-animation');
              that.removeClass('play-apply-animation');
              setTimeout(function() {
                that.addClass('play-apply-animation');
              });
            });

            this._player.on(eventType.Player.Pause, function() {
              var _status = that._player._status;
              if (_status != status.ended && _status != status.error) {
                that.removeClass('prism-play-animation');
                that.addClass('prism-pause-animation');
                that.removeClass('play-apply-animation');
                setTimeout(function() {
                  that.addClass('play-apply-animation');
                });
              }
            });
          },
        });

        module.exports = PlayAnimation;
      },
      {
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../player/base/event/eventtype': 48,
        '../../player/base/plugin/status': 71,
        '../component': 99,
      },
    ],
    112: [
      function(require, module, exports) {
        /**
         * @fileoverview 播放按钮
         */
        var Component = require('../component');
        var eventType = require('../../player/base/event/eventtype');
        var componentUtil = require('./util');
        var lang = require('../../lang/index');

        var PlayButton = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-play-btn');
          },

          bindEvent: function() {
            var that = this;

            this._player.on(eventType.Player.Play, function() {
              that.addClass('playing');
            });

            this._player.on(eventType.Player.Pause, function() {
              that.removeClass('playing');
            });

            this.on(eventType.Private.PlayClick, function() {
              //alert("click_play:" + that._player.paused())
              if (that._player.paused()) {
                that._player.play(true);
                that.addClass('playing');
              } else {
                that._player.pause();
                that.removeClass('playing');
              }
            });

            componentUtil.registerTooltipEvent.call(this, this.el(), function() {
              if (that._player.paused()) {
                return lang.get('Play');
              } else {
                return lang.get('Pause');
              }
            });
          },
        });

        module.exports = PlayButton;
      },
      {
        '../../lang/index': 17,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
      },
    ],
    113: [
      function(require, module, exports) {
        /**
         * @fileoverview 进度条
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var UA = require('../../lib/ua');
        var Fn = require('../../lib/function');
        var lang = require('../../lang/index');
        var cfg = require('../../config');
        var Util = require('../../lib/util');
        var eventType = require('../../player/base/event/eventtype');

        var Progress = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);

            this.className = options.className ? options.className : 'prism-progress';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this);
            el.innerHTML =
              '<div class="prism-progress-loaded"></div>' +
              '<div class="prism-progress-played"></div>' +
              '<div class="prism-progress-cursor"><img></img></div>' +
              '<p class="prism-progress-time"></p>';
            return el;
          },

          bindEvent: function() {
            var that = this;

            this.loadedNode = document.querySelector('#' + this.id() + ' .prism-progress-loaded');
            this.playedNode = document.querySelector('#' + this.id() + ' .prism-progress-played');
            this.cursorNode = document.querySelector('#' + this.id() + ' .prism-progress-cursor');
            this.timeNode = document.querySelector('#' + this.id() + ' .prism-progress-time');
            this.controlNode = document.querySelector(
              '#' + this._player._options.id + ' .prism-controlbar',
            );
            var progressNode = document.querySelector('#' + this.id());
            var cursorNodeImg = document.querySelector(
              '#' + this.id() + ' .prism-progress-cursor img',
            );
            var url =
              'https://' +
              cfg.domain +
              '/de/prismplayer/' +
              cfg.h5Version +
              '/skins/default/img/dragcursor.png';
            if (!cfg.domain) {
              url = '/de/prismplayer/' + cfg.h5Version + '/skins/default/img/dragcursor.png';
            } else if (cfg.domain.indexOf('localhost') > -1) {
              url = '//' + cfg.domain + '/build/skins/default/img/dragcursor.png';
            }
            cursorNodeImg.src = url;
            Event.on(this.cursorNode, 'mousedown', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.cursorNode, 'touchstart', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.cursorNode, 'mouseover', function() {
              Dom.addClass(that.cursorNode, 'cursor-hover');
            });
            Event.on(this.cursorNode, 'mouseout', function(e) {
              Dom.removeClass(that.cursorNode, 'cursor-hover');
            });
            Event.on(progressNode, 'mousemove', function(e) {
              that._progressMove(e);
            });
            Event.on(progressNode, 'touchmove', function(e) {
              that._progressMove(e);
            });
            Event.on(this._el, 'click', function(e) {
              that._onMouseClick(e);
            });
            this._player.on(eventType.Private.HideProgress, function(e) {
              that._hideProgress(e);
            });
            this._player.on(eventType.Private.CancelHideProgress, function(e) {
              that._cancelHideProgress(e);
            });

            Event.on(progressNode, eventType.Private.MouseOver, function(e) {
              that._onMouseOver(e);
            });

            Event.on(progressNode, eventType.Private.MouseOut, function(e) {
              that._onMouseOut(e);
            });

            Event.on(this.controlNode, eventType.Private.MouseLeave, function(e) {
              that._offMouseUp();
            });

            this.bindTimeupdate = Fn.bind(this, this._onTimeupdate);
            this._player.on(eventType.Player.TimeUpdate, this.bindTimeupdate);

            // ipad下播放无法触发progress事件，原因待查
            if (UA.IS_IPAD) {
              this.interval = setInterval(function() {
                that._onProgress();
              }, 500);
            } else {
              this._player.on(eventType.Video.Progress, function() {
                that._onProgress();
              });
            }
          },

          _progressMove: function(e) {
            var sec = this._getSeconds(e);
            if (sec == Infinity) {
              return;
            }
            var time = Util.formatTime(sec),
              distince = this._getDistance(e);
            if (this.cursorNode) {
              this._player.trigger(eventType.Private.ThumbnailShow, {
                time: sec,
                formatTime: time,
                left: distince,
                progressWidth: this.el().offsetWidth,
              });
            }
          },
          //取消控制进度条
          _hideProgress: function(e) {
            var that = this;
            Event.off(this.cursorNode, 'mousedown');
            Event.off(this.cursorNode, 'touchstart');
          },

          //打开控制进度条
          _cancelHideProgress: function(e) {
            var that = this;
            Event.on(this.cursorNode, 'mousedown', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.cursorNode, 'touchstart', function(e) {
              that._onMouseDown(e);
            });
          },

          _canSeekable: function(sec) {
            var canSeekable = true;
            if (typeof this._player.canSeekable == 'function') {
              canSeekable = this._player.canSeekable(sec);
            }
            return canSeekable;
          },

          _onMouseOver: function(e) {
            if (this._cursorHideHandler) {
              clearTimeout(this._cursorHideHandler);
              this._cursorHideHandler = null;
            }
            if (!this._mouseInProgress) {
              this._updateCursorPosition(this._player.getCurrentTime());
              var that = this;
              setTimeout(function() {
                if (that.cursorNode) {
                  Dom.css(that.cursorNode, 'display', 'block');
                }
              });
              //Dom.css(this.timeNode, 'display', 'block');
            }
            this._mouseInProgress = true;
          },

          _onMouseOut: function(e) {
            var that = this;
            this._cursorHideHandler = setTimeout(function() {
              if (that.cursorNode) {
                Dom.css(that.cursorNode, 'display', 'none');
                // Dom.css(that.timeNode, 'display', 'none');
                that._player.trigger(eventType.Private.ThumbnailHide);
                that._mouseInProgress = false;
              }
            });
          },

          _getSeconds: function(e) {
            var distance = this._getDistance(e),
              width = this.el().offsetWidth,
              sec = this._player.getDuration()
                ? (distance / width) * this._player.getDuration()
                : 0;
            if (sec < 0) sec = 0;
            if (sec > this._player.getDuration()) sec = this._player.getDuration();
            return sec;
          },
          _getDistance: function(e) {
            //解决鼠标 和 进度条 不统一bug
            var x = this.el().offsetLeft;
            var b = this.el();

            while ((b = b.offsetParent)) {
              var transformX = Dom.getTranslateX(b);
              x += b.offsetLeft + transformX;
            }
            var pageX = e.touches ? e.touches[0].pageX : e.pageX,
              distance = Math.abs(pageX - x); //,this.el().offsetLeft,
            return distance;
          },

          //handle click
          _onMouseClick: function(e) {
            var that = this;
            var sec = this._getSeconds(e);
            if (!this._canSeekable(sec)) {
              this._player.trigger(eventType.Private.Info_Show, {
                text: lang.get('Can_Not_Seekable'),
                duration: 2000,
              });
              return;
            }

            this._player.trigger(eventType.Private.SeekStart, {
              fromTime: this._player.getCurrentTime(),
            });
            this._updateCursorPosition(sec);
            this._player.seek(sec);
            var that = this;
            that._player.trigger(eventType.Private.EndStart, { toTime: sec });
            // setTimeout(function(){
            // 	that._player.play();
            // });
          },

          _onMouseDown: function(e) {
            var that = this;

            e.preventDefault();
            //e.stopPropagation();

            this._player.trigger(eventType.Private.SeekStart, {
              fromTime: this._player.getCurrentTime(),
            });

            Event.on(this.controlNode, 'mousemove', function(e) {
              that._onMouseMove(e);
            });
            //Event.on(this.cursorNode, 'mouseup', function(e) {that._onMouseUp(e);});
            Event.on(this.controlNode, 'touchmove', function(e) {
              that._onMouseMove(e);
            });
            //Event.on(this.cursorNode, 'touchend', function(e) {that._onMouseUp(e);});

            Event.on(this._player.tag, 'mouseup', function(e) {
              that._onPlayerMouseUp(e);
            });
            Event.on(this._player.tag, 'touchend', function(e) {
              that._onPlayerMouseUp(e);
            });
            Event.on(this.controlNode, 'mouseup', function(e) {
              that._onControlBarMouseUp(e);
            });
            Event.on(this.controlNode, 'touchend', function(e) {
              that._onControlBarMouseUp(e);
            });
          },

          _onMouseUp: function(e) {
            this._onMouseUpIntern(e);
          },

          _onControlBarMouseUp: function(e) {
            this._onMouseUpIntern(e);
          },

          _onPlayerMouseUp: function(e) {
            this._onMouseUpIntern(e);
          },

          _offMouseUp: function() {
            Event.off(this.controlNode, 'mousemove');
            //Event.off(this.cursorNode, 'mouseup');
            Event.off(this.controlNode, 'touchmove');
            //Event.off(this.cursorNode, 'touchend');
            Event.off(this._player.tag, 'mouseup');
            Event.off(this._player.tag, 'touchend');
            Event.off(this.controlNode, 'mouseup');
            Event.off(this.controlNode, 'touchend');
          },
          _onMouseUpIntern: function(e) {
            var that = this;
            e.preventDefault();

            this._offMouseUp();
            // 设置当前时间，播放视频
            var sec =
              (this.playedNode.offsetWidth / this.el().offsetWidth) * this._player.getDuration();
            var sec_now = this._player.getDuration();
            if (!isNaN(sec)) {
              this._player.seek(sec);
            }

            this._player.trigger(eventType.Private.EndStart, { toTime: sec });
          },

          _onMouseMove: function(e) {
            e.preventDefault();
            //e.stopPropagation();
            var sec = this._getSeconds(e);
            if (!this._player._hls) {
              this._player.seek(sec);
              this._player.play();
            }
            this._updateProgressBar(this.playedNode, sec);
            this._updateCursorPosition(sec);
          },

          _onTimeupdate: function(e) {
            // ios下
            // 为了解决seek会跳转到原来的位置，需要进入lock的机制。。。丑陋的代码
            // 只有当前时刻与seekto的时刻间隔小于1秒，并且连续三次，才放开lock
            /*
		if (S.UA.ios) {
			var thre = Math.abs(this._player.getCurrentTime() - this._player.getLastSeekTime());
			if (this._player.getSeekLock()) {
				if (thre < 1 && this.lockCount > 3) {
					this._player.setSeekLock(false);
					this.lockCount = 1;
				} else if (thre < 1){
					this.lockCount++;
				}
			}

			if (!this._player.getSeekLock() ) {
				this._updateProgressBar(this.playedNode, this._player.getCurrentTime());
				this._updateCursorPosition(this._player.getCurrentTime());
				this._updateTip(this._player.getCurrentTime());
				
				this._player.fire('updateProgressBar', {
					time: this._player.getCurrentTime()
				});
			}
		
		} else {
		*/
            this._updateProgressBar(this.playedNode, this._player.getCurrentTime());
            this._updateCursorPosition(this._player.getCurrentTime());

            this._player.trigger(eventType.Private.UpdateProgressBar, {
              time: this._player.getCurrentTime(),
            });
            //}
          },

          _onProgress: function(e) {
            // 此时buffer可能还没有准备好
            if (this._player.getDuration()) {
              if (this._player.getBuffered().length >= 1) {
                this._updateProgressBar(
                  this.loadedNode,
                  this._player.getBuffered().end(this._player.getBuffered().length - 1),
                );
              }
            }
          },

          _updateProgressBar: function(node, sec) {
            var duration = this._player.getDuration();
            if (this._player._switchSourcing == true || !duration) return;
            var percent = sec / duration + 0.005;
            if (percent > 1) {
              percent = 1;
            }
            if (node) {
              Dom.css(node, 'width', percent * 100 + '%');
            }
          },

          _updateCursorPosition: function(sec) {
            var duration = this._player.getDuration();
            if (this._player._switchSourcing == true || !duration) return;
            var cursorWidth = 18;
            var maxPercent = 1;
            var clientWidth = this._player.el().clientWidth;
            var cursonPercent = cursorWidth / clientWidth;
            var percent = sec / duration - cursonPercent;
            if (clientWidth != 0) {
              maxPercent = 1 - cursonPercent;
            }
            if (this.cursorNode) {
              if (percent > maxPercent) {
                Dom.css(this.cursorNode, 'right', '0px');
                Dom.css(this.cursorNode, 'left', 'auto');
              } else {
                Dom.css(this.cursorNode, 'right', 'auto');
                Dom.css(this.cursorNode, 'left', percent * 100 + '%');
              }
            }
          },
        });

        module.exports = Progress;
      },
      {
        '../../config': 11,
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/function': 26,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
      },
    ],
    114: [
      function(require, module, exports) {
        var Selector = require('./selector');
        var _ = require('../../../lib/object');
        var Util = require('../../../lib/util');
        var Cookie = require('../../../lib/cookie');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');
        var constants = require('../../../lib/constants');
        var lang = require('../../../lang/index');
        var eventType = require('../../../player/base/event/eventtype');

        var QualitySelector = Selector.extend({
          init: function(player, options) {
            this.Name = lang.get('Quality');
            this.Type = 'quality';
            this.Tooltip = lang.get('Quality_Switch_To');
            Selector.call(this, player, options);
            this._isMasterLevel = false;
          },

          showTip: function(text, time) {
            this._player.trigger(eventType.Private.Info_Show, {
              text: text,
              duration: time,
              align: 'lb',
            });
          },

          bindEvent: function() {
            this.bindCommonEvent();
            var that = this;

            this._player.on(eventType.Private.QualityChange, function(e) {
              var urls = that._player._urls,
                data = e.paramData;
              if (data.levelSwitch) {
                var desc = data.desc;
                that._autoSWitchDesc = desc;
                that._updateText(desc);
              } else if (that._player._currentPlayIndex > 0) {
                that._autoSWitchDesc = '';
                var currentIndex = that._player._currentPlayIndex;
                var previousText = urls[currentIndex - 1].desc;
                var text = urls[currentIndex].desc;
                that.showTip(previousText + e.paramData + text, 1000);
                that._player.trigger(eventType.Private.SelectorValueChange, urls[currentIndex].Url);
              }
            });
            var list = document.querySelector('#' + that.id() + ' .selector-list');
            this._player.on(eventType.Player.LevelSwitch, function() {
              Dom.addClass(list, 'disabled');
            });
            this._player.on(eventType.Player.LevelSwitched, function() {
              Dom.removeClass(list, 'disabled');
            });
          },
          generateList: function(value) {
            var urls = this._player._urls;
            var currentIndex = this._player._currentPlayIndex;
            var levels = this._player._qualityService.levels;
            if (levels.length > 0) {
              this._isMasterLevel = true;
              urls = levels;
              currentIndex = levels.length - 1;
            }
            var list = document.querySelector('#' + this.id() + ' .selector-list');
            if (urls.length > 0) {
              var that = this;
              _.each(urls, function(v, index) {
                var liEle = Dom.createEl.call(this, 'li', {
                  key: v.Url,
                  index: index,
                  text: v.desc,
                });
                var span = Dom.createEl.call(this, 'span', {
                  key: v.Url,
                  index: index,
                  text: v.desc,
                });
                if (index == currentIndex) {
                  Dom.addClass(liEle, 'current');
                  that._previousSelection = liEle;
                }
                span.innerText = v.desc;
                liEle.appendChild(span);
                list.appendChild(liEle);
              });
            }
            if (this._autoSWitchDesc) {
              this._updateText(this._autoSWitchDesc);
            }
          },
          execute: function(value) {
            this._player._switchSourcing = true;
            if (!this._isMasterLevel) {
              var length = this._player._urls.length;
              for (var i = 0; i < length; i++) {
                if (this._player._urls[i].Url == value) {
                  this._player._currentPlayIndex = i;
                  Cookie.set(constants.SelectedStreamLevel, this._player._urls[i].definition, 365);
                  break;
                }
              }
              this._player._loadByUrlInner(
                value,
                this._player.getCurrentTime(),
                !this._player.paused(),
              );
            } else {
              var levels = this._player._qualityService.levels;
              for (var i = 0; i < levels.length; i++) {
                if (levels[i].Url == value && levels[i].desc != lang.get('Auto')) {
                  this._updateText('');
                }
              }
              if (this._player._switchLevel) {
                this._player._switchLevel(value);
              }
            }
            var that = this;
            setTimeout(function() {
              that._player._switchSourcing = false;
            });
          },
          _updateText: function(desc) {
            var ele = document.querySelector('#' + this.id() + ' .selector-list .current');
            var span = document.querySelector('#' + this.id() + ' .selector-list .current span');
            var autoText = lang.get('Auto');
            if (span && span.innerText && span.innerText.indexOf(autoText) > -1) {
              autoText = autoText + (desc ? '(' + desc + ')' : '');
              span.innerText = autoText;
              if (ele) {
                ele.text = autoText;
              }
            }
          },
        });

        module.exports = QualitySelector;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/constants': 21,
        '../../../lib/cookie': 22,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/object': 32,
        '../../../lib/util': 40,
        '../../../player/base/event/eventtype': 48,
        './selector': 120,
      },
    ],
    115: [
      function(require, module, exports) {
        var Selector = require('./selector');
        var _ = require('../../../lib/object');
        var Util = require('../../../lib/util');
        var Cookie = require('../../../lib/cookie');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');
        var util = require('./util');
        var lang = require('../../../lang/index');
        var eventType = require('../../../player/base/event/eventtype');

        var AudioSelector = Selector.extend({
          init: function(player, options) {
            this.Name = lang.get('AudioTrack');
            this.Type = 'audio';
            this.Tooltip = lang.get('AudioTrack_Switch_To');
            Selector.call(this, player, options);
          },

          bindEvent: function() {
            this.bindCommonEvent();
            var that = this;
            var list = document.querySelector('#' + that.id() + ' .selector-list');
            var header = document.querySelector('#' + that.id() + ' .header');
            that._player.on(eventType.Private.ChangeURL, function() {
              that._hasGeneratedList = false;
            });

            this._player.on(eventType.Player.AudioTrackSwitch, function() {
              Dom.addClass(list, 'disabled');
            });
            this._player.on(eventType.Player.AudioTrackSwitched, function() {
              Dom.removeClass(list, 'disabled');
            });

            that._player.on(eventType.Player.AudioTrackReady, function(tracks) {
              if (that._hasGeneratedList) {
                return;
              }
              that._clear();
              var tracks = tracks.paramData;
              if (!tracks) {
                return;
              }
              _.each(tracks, function(v, index) {
                var liEle = Dom.createEl.call(that, 'li', {
                  key: v.value,
                  text: v.text,
                });
                var span = Dom.createEl.call(that, 'span', {
                  key: v.value,
                  text: v.text,
                });
                span.innerText = v.text;
                liEle.appendChild(span);
                list.appendChild(liEle);
              });
              that._hasGeneratedList = true;
            });
          },
          execute: function(value) {
            this._player._audioTrackService['switch'](value);
          },
        });

        module.exports = AudioSelector;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/cookie': 22,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/object': 32,
        '../../../lib/util': 40,
        '../../../player/base/event/eventtype': 48,
        './selector': 120,
        './util': 122,
      },
    ],
    116: [
      function(require, module, exports) {
        var Component = require('../../component');
        var Dom = require('../../../lib/dom');
        var eventType = require('../../../player/base/event/eventtype');
        var List = require('./list');
        var lang = require('../../../lang/index');
        var componentUtil = require('../util');

        var SettingButtom = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-setting-btn');
            this._settingList = new List(player, options);
            player.addChild(this._settingList, options);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            return el;
          },

          bindEvent: function() {
            var that = this;
            this.on('click', function() {
              if (!that._settingList.isOpened) {
                that._player.trigger(eventType.Private.SettingListShow);
                that._player.trigger(eventType.Private.SelectorHide);
              } else {
                that._player.trigger(eventType.Private.SettingListHide);
                that._player.trigger(eventType.Private.SelectorHide);
              }
              that._player.trigger(eventType.Private.VolumeVisibilityChange, '');
            });
            componentUtil.registerTooltipEvent.call(this, this.el(), lang.get('Setting'));
          },
        });

        module.exports = SettingButtom;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/dom': 24,
        '../../../player/base/event/eventtype': 48,
        '../../component': 99,
        '../util': 127,
        './list': 119,
      },
    ],
    117: [
      function(require, module, exports) {
        var Selector = require('./selector');
        var _ = require('../../../lib/object');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');
        var util = require('./util');
        var lang = require('../../../lang/index');
        var eventType = require('../../../player/base/event/eventtype');

        var CCSelector = Selector.extend({
          init: function(player, options) {
            this.Name = lang.get('Subtitle');
            this.Type = 'cc';
            this.Tooltip = lang.get('CC_Switch_To');
            Selector.call(this, player, options);
          },

          bindEvent: function() {
            this.bindCommonEvent();
            var that = this;
            this._player.on(eventType.Private.CCStateChanged, function(data) {
              var value = data.paramData.value,
                lang = data.paramData.lang;
              if (value == 'on' && lang) {
                that._backCCText = lang;
              } else if (value == 'off' && that._backCCText == '') {
                that._backCCText = that._previousSelection.text;
              }
              var text = 'Off';
              if (value == 'on') {
                text = that._backCCText;
              }
              that._player.trigger(eventType.Private.SelectorUpdateList, {
                type: 'cc',
                text: text,
              });
            });
          },

          generateList: function(text) {
            var list = document.querySelector('#' + this.id() + ' .selector-list');
            var tracks = this._player._ccService.tracks;
            var that = this;
            _.each(tracks, function(v, index) {
              var liEle = Dom.createEl.call(this, 'li', {
                key: v.value,
                text: v.text,
              });
              var span = Dom.createEl.call(this, 'span', {
                key: v.value,
                text: v.text,
              });
              if (v.text == text) {
                Dom.addClass(liEle, 'current');
                that._previousSelection = liEle;
              }
              span.innerText = v.text;
              liEle.appendChild(span);
              list.appendChild(liEle);
            });
          },
          execute: function(value) {
            this._backCCText = '';
            this._player._ccService['switch'](value);
            this._player.trigger(eventType.Private.CCChanged, value);
          },
        });

        module.exports = CCSelector;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/object': 32,
        '../../../player/base/event/eventtype': 48,
        './selector': 120,
        './util': 122,
      },
    ],
    118: [
      function(require, module, exports) {
        module.exports = {
          CC: require('./cc'),
          Speed: require('./speed'),
          Quality: require('./Quality'),
          Audio: require('./audio'),
        };
      },
      { './Quality': 114, './audio': 115, './cc': 117, './speed': 121 },
    ],
    119: [
      function(require, module, exports) {
        var Component = require('../../component');
        var Dom = require('../../../lib/dom');
        var UA = require('../../../lib/ua');
        var Event = require('../../../lib/event');
        var eventType = require('../../../player/base/event/eventtype');
        var setting = require('./export');
        var util = require('./util');
        var lang = require('../../../lang/index');

        var SettingList = Component.extend({
          init: function(player, options) {
            var that = this;
            that.isOpened = false;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-setting-list');
            for (var key in setting) {
              var obj = new setting[key](player, options);
              player.addChild(obj, options);
            }
          },

          createEl: function() {
            var setting = Component.prototype.createEl.call(this, 'div');
            var template =
                "<div class='prism-setting-item prism-setting-{type}' type={type}>" +
                "<div class='setting-content'><span class='setting-title'>{value}</span><span class='array'></span><span class='current-setting'></span></div>" +
                '</div>',
              speedHtml = template
                .replace(/{type}/g, 'speed')
                .replace('{value}', lang.get('Speed')),
              ccHtml = template.replace(/{type}/g, 'cc').replace('{value}', lang.get('Subtitle')),
              audioHtml = template
                .replace(/{type}/g, 'audio')
                .replace('{value}', lang.get('AudioTrack')),
              qualityHtml = template
                .replace(/{type}/g, 'quality')
                .replace('{value}', lang.get('Quality'));

            setting.innerHTML = speedHtml + ccHtml + audioHtml + qualityHtml;

            return setting;
          },

          bindEvent: function() {
            var speed = document.querySelector(
              '#' + this.id() + ' .prism-setting-speed .current-setting',
            );
            speed.innerText = lang.get('Speed_1X_Text');
            var that = this;
            var _hide = function() {
              that._player.trigger(eventType.Private.SettingListHide);
              that.isOpened = false;
            };
            var setSelectedValue = function(data) {
              if (data && data.text) {
                var ele = document.querySelector(
                  '#' + that.id() + ' .prism-setting-' + data.type + ' .current-setting',
                );
                ele.innerText = data.text;
              }
            };
            this._player.on(eventType.Private.SettingListShow, function(data) {
              that.isOpened = true;
              var data = data.paramData;
              setSelectedValue(data);
              Dom.css(that.el(), 'display', 'block');
            });

            this._player.on(eventType.Private.UpdateToSettingList, function(data) {
              var data = data.paramData;
              setSelectedValue(data);
            });

            this._player.on(eventType.Private.SelectorUpdateList, function(data) {
              var data = data.paramData;
              setSelectedValue(data);
              that._player.trigger(eventType.Private.SelectorValueChange, data);
            });

            this._player.on(eventType.Private.SettingListHide, function() {
              that.isOpened = false;
              Dom.css(that.el(), 'display', 'none');
            });
            Event.on(this.el(), 'click', function(event) {
              that._player.trigger(eventType.Private.SettingListHide);
              var obj = event.srcElement ? event.srcElement : event.target;
              obj = util.findItemElementForList(obj);
              if (obj) {
                var type = obj.getAttribute('type');
                that._player.trigger(eventType.Private.SelectorShow, { type: type });
              }
            });

            var enentName = UA.IS_MOBILE ? 'touchleave' : 'mouseleave';
            Event.on(this.el(), enentName, function() {
              _hide();
            });
            Event.on(this._player.tag, 'click', function(e) {
              if (e && e.target == e.currentTarget) {
                _hide();
              }
            });

            Event.on(this._player.tag, 'touchstart', function(e) {
              if (e && e.target == e.currentTarget) {
                _hide();
              }
            });

            this._player.on(eventType.Private.QualityChange, function(e) {
              var data = e.paramData;
              if (data.levelSwitch) {
                var ele = document.querySelector(
                    '#' + that.id() + ' .prism-setting-quality .current-setting',
                  ),
                  autoText = lang.get('Auto');
                if (ele.innerText.indexOf(autoText) > -1) {
                  ele.innerText = autoText + (data.desc ? '(' + data.desc + ')' : '');
                }
              }
            });
          },
        });

        module.exports = SettingList;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/ua': 38,
        '../../../player/base/event/eventtype': 48,
        '../../component': 99,
        './export': 118,
        './util': 122,
      },
    ],
    120: [
      function(require, module, exports) {
        var Component = require('../../component');
        var _ = require('../../../lib/object');
        var Util = require('../../../lib/util');
        var UA = require('../../../lib/ua');
        var Cookie = require('../../../lib/cookie');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');
        var util = require('./util');
        var lang = require('../../../lang/index');
        var eventType = require('../../../player/base/event/eventtype');

        var Selector = Component.extend({
          init: function(player, options) {
            var that = this;
            this._hasGeneratedList = false;
            this._previousSelection = null;
            this._backupSelector = '';
            Component.call(this, player, options);
            this.className = options.className
              ? options.className
              : 'prism-' + this.Type + '-selector prism-setting-selector';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              '<div class="header"><div class="left-array"></div><span>' +
              this.Name +
              '</span></div><ul class="selector-list"></ul>';
            return el;
          },

          bindEvent: function() {
            this.bindCommonEvent();
          },

          bindCommonEvent: function() {
            var that = this;
            var list = document.querySelector('#' + that.id() + ' .selector-list');
            var header = document.querySelector('#' + that.id() + ' .header');

            this._player.on(eventType.Private.ChangeURL, function() {
              that._hasGeneratedList = false;
            });
            Event.on(header, 'click', function() {
              that._player.trigger(eventType.Private.SelectorHide);
              that._player.trigger(eventType.Private.SettingListShow, {
                type: that.Type,
                text: that._previousSelection ? that._previousSelection.text : '',
              });
            });

            Event.on(list, 'click', function(event) {
              var obj = event.srcElement ? event.srcElement : event.target;
              var key = obj.key,
                text = obj.text;
              if (typeof text == 'undefined') {
                return;
              }
              if (that._previousSelection) {
                Dom.removeClass(that._previousSelection, 'current');
              }
              that._previousSelection = util.findliElementForSelector(obj);
              Dom.addClass(that._previousSelection, 'current');
              if (that.execute) {
                that.execute(key);
              }
              var displaytext = that.Tooltip + '<span>' + text + '</span>';
              that._player.trigger(eventType.Private.Info_Show, {
                text: displaytext,
                duration: 1000,
                align: 'lb',
              });
            });

            that._player.on(eventType.Private.SelectorHide, function() {
              Dom.css(that.el(), 'display', 'none');
            });

            that._player.on(eventType.Private.SelectorValueChange, function(data) {
              var paramData = data.paramData;
              if (paramData) {
                if (paramData.type != that.Type) {
                  return;
                }
                var selectors = document.querySelectorAll('#' + that.id() + ' .selector-list li');
                if (selectors) {
                  var length = selectors.length;
                  if (length == 0) {
                    that._backupSelector = paramData.text;
                  }
                  for (var i = 0; i < length; i++) {
                    if (selectors[i].text == paramData.text) {
                      if (that._previousSelection) {
                        Dom.removeClass(that._previousSelection, 'current');
                      }
                      Dom.addClass(selectors[i], 'current');
                      that._previousSelection = selectors[i];
                      break;
                    }
                  }
                }
              }
            });

            that._player.on(eventType.Private.SelectorShow, function(data) {
              var data = data.paramData;
              if (data.type != that.Type) {
                return;
              }
              var selector = document.querySelector(
                '#' + that._player.id() + ' .prism-' + data.type + '-selector',
              );
              if (that._hasGeneratedList) {
                Dom.css(selector, 'display', 'block');
              } else {
                that._clear();
                that.generateList(that._backupSelector);
                that._backupSelector = '';
                that._hasGeneratedList = true;
                Dom.css(selector, 'display', 'block');
              }
            });
            var _hide = function() {
              Dom.css(that.el(), 'display', 'none');
              that._player.trigger(eventType.Private.UpdateToSettingList, {
                type: that.Type,
                text: that._previousSelection ? that._previousSelection.text : '',
              });
            };
            var enentName = UA.IS_MOBILE ? 'touchleave' : 'mouseleave';
            Event.on(this.el(), enentName, function() {
              _hide();
            });
            Event.on(this._player.tag, 'click', function(e) {
              if (e && e.target == e.currentTarget) {
                _hide();
              }
            });

            Event.on(this._player.tag, 'touchstart', function(e) {
              if (e && e.target == e.currentTarget) {
                _hide();
              }
            });
          },
          setSelected: function(key) {},

          generateList: function() {},

          _clear: function() {
            var list = document.querySelector('#' + this.id() + ' .selector-list');
            list.innerHTML = '';
          },
        });

        module.exports = Selector;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/cookie': 22,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/object': 32,
        '../../../lib/ua': 38,
        '../../../lib/util': 40,
        '../../../player/base/event/eventtype': 48,
        '../../component': 99,
        './util': 122,
      },
    ],
    121: [
      function(require, module, exports) {
        var Selector = require('./selector');
        var _ = require('../../../lib/object');
        var Util = require('../../../lib/util');
        var Cookie = require('../../../lib/cookie');
        var Dom = require('../../../lib/dom');
        var Event = require('../../../lib/event');
        var util = require('./util');
        var constants = require('../../../lib/constants');
        var lang = require('../../../lang/index');
        var eventType = require('../../../player/base/event/eventtype');

        var SpeedSelector = Selector.extend({
          init: function(player, options) {
            this.Name = lang.get('Speed');
            this.Type = 'speed';
            this.Tooltip = lang.get('Speed_Switch_To');
            Selector.call(this, player, options);
          },

          generateList: function() {
            var list = document.querySelector('#' + this.id() + ' .selector-list');
            var speedLevels = constants.SpeedLevels;
            var that = this;
            _.each(speedLevels, function(v, index) {
              var liEle = Dom.createEl.call(this, 'li', {
                key: v.key,
                text: v.text,
              });
              var span = Dom.createEl.call(this, 'span', {
                key: v.key,
                text: v.text,
              });
              span.innerText = v.text;
              if (v.text == lang.get('Speed_1X_Text')) {
                Dom.addClass(liEle, 'current');
                that._previousSelection = liEle;
              }
              liEle.appendChild(span);
              list.appendChild(liEle);
            });
          },
          execute: function(value) {
            this._player.setSpeed(value);
          },
        });

        module.exports = SpeedSelector;
      },
      {
        '../../../lang/index': 17,
        '../../../lib/constants': 21,
        '../../../lib/cookie': 22,
        '../../../lib/dom': 24,
        '../../../lib/event': 25,
        '../../../lib/object': 32,
        '../../../lib/util': 40,
        '../../../player/base/event/eventtype': 48,
        './selector': 120,
        './util': 122,
      },
    ],
    122: [
      function(require, module, exports) {
        module.exports.findliElementForSelector = function(obj) {
          if (!obj || obj.tagName.toLowerCase() == 'li') {
            return obj;
          }
          var parent = obj.parentElement;
          if (parent && parent.tagName.toLowerCase() == 'li') {
            return parent;
          }
          return null;
        };

        module.exports.findliElementByKey = function(selector, key) {
          var elements = document.querySelectors(selector);
          return null;
        };

        module.exports.findItemElementForList = function(obj) {
          if (!obj || obj.className.indexOf('prism-setting-item') > -1) {
            return obj;
          }
          var parent = obj.parentElement;
          if (parent) {
            obj = module.exports.findItemElementForList(parent);
          }
          return obj;
        };
      },
      {},
    ],
    123: [
      function(require, module, exports) {
        /**
         * @fileoverview 大播放按钮
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var util = require('../../lib/util');
        var lang = require('../../lang/index');
        var eventType = require('../../player/base/event/eventtype');
        var componentUtil = require('./util');

        var Snapshot = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-snapshot-btn');
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            return el;
          },

          bindEvent: function() {
            var that = this;
            this._player.on(eventType.Private.Snapshot_Hide, function() {
              Dom.css(that._el, 'display', 'none');
            });
            componentUtil.registerTooltipEvent.call(this, this.el(), lang.get('Snapshot'));

            this.on('click', function() {
              that.trigger(eventType.Player.Snapshoting);
              var canvas = document.createElement('canvas'), //document.getElementById('canvastest'), //
                video = that._player.tag,
                w = video.videoWidth, //视频原有尺寸
                h = video.videoHeight; //视频原有尺寸
              var matric = that._player._getSanpshotMatric();
              canvas.width = matric.width || w;
              canvas.height = matric.height || h;
              var currentTime = that._player.getCurrentTime();
              var ctx = canvas.getContext('2d');
              ctx.save();
              var image = that._player.getImage();
              if (image == 'vertical') {
                //horizon, vertical
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
              } else if (image == 'horizon') {
                //horizon, vertical
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
              }
              //draw image to canvas. scale to target dimensions
              ctx.drawImage(video, 0, 0, w, h);
              ctx.restore();
              drawText(ctx, that._player.getOptions());
              //convert to desired file format
              var imageData = '',
                error = '';
              try {
                var imageData = canvas.toDataURL('image/jpeg', matric.rate || 1);
              } catch (e) {
                error = e;
              }
              var dataURI = '',
                base64 = '',
                binary = '';
              if (imageData) {
                dataURI = imageData; // can also use 'image/png'
                base64 = dataURI.substr(dataURI.indexOf(',') + 1);
                binary = util.toBinary(base64);
              }
              that.trigger(eventType.Player.Snapshoted, {
                time: currentTime,
                base64: dataURI,
                binary: binary,
                error: error,
              });
            });
          },
        });

        var drawText = function(ctx, options) {
          var watermark = options.snapshotWatermark;
          if (watermark && watermark.text) {
            //设置字体样式
            ctx.font = watermark.font;
            //设置字体填充颜色
            if (watermark.fillColor) {
              ctx.fillStyle = watermark.fillColor;
              ctx.fillText(watermark.text, watermark.left, watermark.top);
            }
            if (watermark.strokeColor) {
              ctx.strokeStyle = watermark.strokeColor;
              ctx.strokeText(watermark.text, watermark.left, watermark.top);
            }
            ctx.stroke();
          }
        };

        module.exports = Snapshot;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/util': 40,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
      },
    ],
    124: [
      function(require, module, exports) {
        var Component = require('../component');
        var Util = require('../../lib/util');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var UA = require('../../lib/ua');
        var lang = require('../../lang/index');
        var eventType = require('../../player/base/event/eventtype');

        var Thumbnail = Component.extend({
          init: function(player, options) {
            Component.call(this, player, options);
            this.className = options.className ? options.className : 'prism-thumbnail';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML = '<img></img><span></span>';
            return el;
          },

          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.ThumbnailLoaded, function(data) {
              var cues = data.paramData;
              if (cues && cues.length > 0) {
                var url = that._player._thumbnailService.makeUrl(cues[0].text);
                if (cues[0].isBig) {
                  Dom.css(that.el(), 'background', 'url(' + url + ')');
                  Dom.css(that.el(), 'width', cues[0].w + 'px');
                  Dom.css(that.el(), 'height', cues[0].h + 'px');
                } else {
                  var img = document.querySelector('#' + that.id() + ' img');
                  img.onload = function() {
                    var width = img.width;
                    var height = img.height;
                    Dom.css(that.el(), 'width', width + 'px');
                    Dom.css(that.el(), 'height', height + 'px');
                  };
                  img.src = url;
                }
              }
            });
            that._player.on(eventType.Private.ThumbnailShow, function(e) {
              var handle = function() {
                var element = document.querySelector('#' + that.id() + ' span'),
                  info = e.paramData;
                if (info) {
                  var cue = that._player._thumbnailService.findAvailableCue(info.time);
                  if (!cue) {
                    return;
                  }
                  var width = that.el().offsetWidth;
                  if (cue.isBig) {
                    var url = that._player._thumbnailService.makeUrl(cue.text);
                    Dom.css(that.el(), 'background', 'url(' + url + ')');
                    var size = cue.w + 'px ' + cue.h + 'px',
                      position = cue.x * -1 + 'px ' + cue.y * -1 + 'px';
                    Dom.css(that.el(), 'background-position', position);
                  } else {
                    var img = document.querySelector('#' + that.id() + ' img');
                    var url = that._player._thumbnailService.makeUrl(cue.text);
                    if (img.src != url) {
                      img.src = url;
                    }
                  }
                  var left = 0;
                  if (info.left + width > info.progressWidth) {
                    left = info.left - width;
                  } else {
                    left = info.left - width / 2;
                    left = left < 0 ? 0 : left;
                  }

                  Dom.css(that.el(), 'left', left + 'px');
                  element.innerText = info.formatTime;
                  Dom.css(that.el(), 'display', 'block');
                }
              };

              if (that._thumbnailShowHanlde) {
                clearTimeout(that._thumbnailShowHanlde);
              }
              that._thumbnailShowHanlde = setTimeout(handle, 30);
            });
            that._player.on(eventType.Private.ThumbnailHide, function(e) {
              if (that._thumbnailShowHanlde) {
                clearTimeout(that._thumbnailShowHanlde);
              }
              Dom.css(that.el(), 'display', 'none');
            });
          },
          _createSamllThumbnail: function() {},
        });

        module.exports = Thumbnail;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../lib/ua': 38,
        '../../lib/util': 40,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
      },
    ],
    125: [
      function(require, module, exports) {
        /**
         * @fileoverview 播放时间
         */
        var Component = require('../component');
        var Util = require('../../lib/util');
        var eventType = require('../../player/base/event/eventtype');

        var TimeDisplay = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);

            this.className = options.className ? options.className : 'prism-time-display';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="duration">00:00</span>';
            return el;
          },

          bindEvent: function() {
            var that = this;

            this._player.on(eventType.Video.DurationChange, function() {
              var dur = Util.formatTime(that._player.getDuration());
              if (dur) {
                document.querySelector('#' + that.id() + ' .time-bound').style.display = 'inline';
                document.querySelector('#' + that.id() + ' .duration').style.display = 'inline';
                document.querySelector('#' + that.id() + ' .duration').innerText = dur;
              } else {
                document.querySelector('#' + that.id() + ' .duration').style.display = 'none';
                document.querySelector('#' + that.id() + ' .time-bound').style.display = 'none';
              }
            });

            this._player.on(eventType.Video.TimeUpdate, function() {
              var curr_time = that._player.getCurrentTime();
              var curr = Util.formatTime(curr_time);

              /*
            if (!this._player.last_curT) {
                this._player.last_curT = curr_time;
            }
            else {
                var diff = curr - this._player.last_curT;
                console.log("diff_time" + diff);
                this._player.last_curT = curr_time;
            }
            */
              var curTime = document.querySelector('#' + that.id() + ' .current-time');
              if (!curTime) {
                return;
              }
              if (curr) {
                document.querySelector('#' + that.id() + ' .current-time').style.display = 'inline';
                document.querySelector('#' + that.id() + ' .current-time').innerText = curr;
              } else {
                document.querySelector('#' + that.id() + ' .current-time').style.display = 'none';
              }
            });
          },
        });

        module.exports = TimeDisplay;
      },
      { '../../lib/util': 40, '../../player/base/event/eventtype': 48, '../component': 99 },
    ],
    126: [
      function(require, module, exports) {
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var eventType = require('../../player/base/event/eventtype');

        var Tooltip = Component.extend({
          init: function(player, options) {
            Component.call(this, player, options);
            this.className = options.className ? options.className : 'prism-tooltip';
            this.addClass(this.className);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'p');
            el.innerText = '提示信息';
            return el;
          },

          bindEvent: function() {
            var that = this;
            that._player.on(eventType.Private.TooltipShow, function(e) {
              var element = document.querySelector('#' + that.id()),
                info = e.paramData;
              element.innerText = info.text;
              Dom.css(element, 'display', 'block');
              var width = element.offsetWidth;
              var controlBar = document.querySelector(
                '#' + that._player.id() + ' .prism-controlbar',
              );
              if (controlBar) {
                var barWidth = controlBar.offsetWidth;
                if (info.left + width > barWidth) {
                  Dom.css(element, 'left', barWidth - width + 'px');
                } else {
                  Dom.css(element, 'left', info.left - (width - info.width) / 2 + 'px');
                }
              }
            });
            that._player.on(eventType.Private.TooltipHide, function(e) {
              var element = document.querySelector('#' + that.id());
              Dom.css(element, 'display', 'none');
            });
          },
        });

        module.exports = Tooltip;
      },
      { '../../lib/dom': 24, '../../player/base/event/eventtype': 48, '../component': 99 },
    ],
    127: [
      function(require, module, exports) {
        var Event = require('../../lib/event');
        var eventType = require('../../player/base/event/eventtype');

        module.exports.registerTooltipEvent = function(ele, func) {
          var that = this;
          var clearTimeoutHandler = function() {
            if (that._controlbarTooltipHandler) {
              clearTimeout(that._controlbarTooltipHandler);
              that._controlbarTooltipHandler = null;
            }
          };
          Event.on(this.el(), 'mouseover', function(e) {
            clearTimeoutHandler();

            that._controlbarTooltipHandler = setTimeout(function() {
              that._player.trigger(eventType.Private.TooltipHide);
            }, 4000);
            //解决鼠标 和 进度条 不统一bug
            var x = that.el().offsetLeft;
            var width = that.el().offsetWidth;
            // var b = that.el();

            // while(b = b.offsetParent)
            // {
            //    	x += b.offsetLeft;
            // };
            var text = func;
            if (typeof text == 'function') {
              text = func.call(this);
            }
            that._player.trigger(eventType.Private.TooltipShow, {
              left: x,
              width: width,
              text: text,
            });
          });
          Event.on(this.el(), 'mouseout', function() {
            clearTimeoutHandler();
            that._player.trigger(eventType.Private.TooltipHide);
          });
        };
      },
      { '../../lib/event': 25, '../../player/base/event/eventtype': 48 },
    ],
    128: [
      function(require, module, exports) {
        /**
         * @fileoverview 音量按钮，h5下只做静音非静音的控制
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var eventType = require('../../player/base/event/eventtype');
        var componentUtil = require('./util');
        var lang = require('../../lang/index');
        var VolumeControl = require('./volumecontrol');

        var Volume = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-volume');
            var volumeControl = new VolumeControl(player, options);
            player.addChild(volumeControl, options);
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              '<div class="volume-icon"><div class="short-horizontal"></div><div class="long-horizontal"></div></div>';
            return el;
          },

          bindEvent: function() {
            var that = this;
            this.icon = document.querySelector('#' + that.id() + '  .volume-icon');
            componentUtil.registerTooltipEvent.call(this, this.el(), function() {
              if (that._player.muted() || that._player.getVolume() == 0) {
                return lang.get('Muted');
              } else {
                return lang.get('Volume');
              }
            });
            Event.on(this.icon, 'click', function(e) {
              var x = that.el().offsetLeft;
              // var b = that.el();

              // while(b = b.offsetParent)
              // {
              //    	x += b.offsetLeft;
              // };
              that._player.trigger(eventType.Private.SettingListHide);
              that._player.trigger(eventType.Private.SelectorHide);
              that._player.trigger(eventType.Private.VolumeVisibilityChange, x);
            });

            var long = document.querySelector('#' + that.id() + '  .long-horizontal');
            var short = document.querySelector('#' + that.id() + '  .short-horizontal');

            Event.on(this.el(), 'mouseover', function() {
              Dom.removeClass(long, 'volume-hover-animation');
              setTimeout(function() {
                Dom.addClass(long, 'volume-hover-animation');
              });
              setTimeout(function() {
                Dom.removeClass(long, 'volume-hover-animation');
                Dom.addClass(short, 'volume-hover-animation');
                setTimeout(function() {
                  Dom.removeClass(short, 'volume-hover-animation');
                  Dom.addClass(long, 'volume-hover-animation');
                }, 300);
              }, 300);
            });
          },
        });

        module.exports = Volume;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
        './volumecontrol': 129,
      },
    ],
    129: [
      function(require, module, exports) {
        /**
         * @fileoverview 音量按钮，h5下只做静音非静音的控制
         */
        var Component = require('../component');
        var Dom = require('../../lib/dom');
        var Event = require('../../lib/event');
        var eventType = require('../../player/base/event/eventtype');
        var componentUtil = require('./util');
        var lang = require('../../lang/index');

        var VolumeControl = Component.extend({
          init: function(player, options) {
            var that = this;
            Component.call(this, player, options);
            this.addClass(options.className || 'prism-volume-control');
            this._shown = false;
          },

          createEl: function() {
            var el = Component.prototype.createEl.call(this, 'div');
            el.innerHTML =
              '<div class="volume-range"><div class="volume-value"></div><div class="volume-cursor"></div></div>';

            return el;
          },

          bindEvent: function() {
            var that = this;
            this.icon = document.querySelector('#' + that._player.id() + '  .volume-icon');
            this.control = document.querySelector('#' + that.id());
            this.volumnValue = document.querySelector('#' + that.id() + '  .volume-value');
            this.volumnRange = document.querySelector('#' + that.id() + '  .volume-range');
            this.volumnCursor = document.querySelector('#' + that.id() + '  .volume-cursor');

            this._player.on(eventType.Private.VolumeVisibilityChange, function(data) {
              var left = data.paramData;
              if (!that._shown && left) {
                var volumnValue = that._player.getVolume();
                that._setVolumnUI(volumnValue);
                Dom.css(that.control, 'display', 'block');
                if (left) {
                  Dom.css(that.control, 'left', left - 5 + 'px');
                }
                that._shown = true;
              } else {
                Dom.css(that.control, 'display', 'none');
                that._shown = false;
              }
            });
            Event.on(this.volumnRange, 'click', function(e) {
              var volumnValue = that._getPosition(e).toFixed(2);
              if (volumnValue < 0) volumnValue = 0;
              if (volumnValue > 1) volumnValue = 1;
              that._setVolumnUI(volumnValue);
              that._setMuteUI(volumnValue);
              that._player.setVolume(volumnValue);
            });

            Event.on(this._player.tag, 'click', function(e) {
              if (e && e.target == e.currentTarget) {
                Dom.css(that.control, 'display', 'none');
              }
            });

            Event.on(this._player.tag, 'touchstart', function(e) {
              if (e && e.target == e.currentTarget) {
                Dom.css(that.control, 'display', 'none');
              }
            });

            Event.on(this.volumnCursor, 'mousedown', function(e) {
              that._onMouseDown(e);
            });
            Event.on(this.volumnCursor, 'touchstart', function(e) {
              that._onMouseDown(e);
            });
            this._player.on(eventType.Private.VolumnChanged, function(e) {
              var value = e.paramData;
              if (value > -1) {
                that._setVolumnUI(value);
              }
              that._setMuteUI(value);
            });
            Event.on(this.control, 'mouseleave', function() {
              Dom.css(that.control, 'display', 'none');
              that._shown = false;
            });

            Event.on(this.control, 'mouseover', function() {
              Dom.addClass(that.control, 'hover');
            });

            that._rangeBottom = that._getBottom();
          },

          _getBottom: function() {
            if (window.getComputedStyle) {
              var bottom = window
                .getComputedStyle(this.volumnRange, null)
                .getPropertyValue('bottom');
              return parseFloat(bottom);
            } else {
              return 26;
            }
          },
          _onMouseDown: function(e) {
            var that = this;

            e.preventDefault();

            Event.on(this.control, 'mousemove', function(e) {
              that._onMouseMove(e);
            });
            Event.on(this.control, 'touchmove', function(e) {
              that._onMouseMove(e);
            });

            Event.on(this._player.tag, 'mouseup', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this._player.tag, 'touchend', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this.control, 'mouseup', function(e) {
              that._onMouseUp(e);
            });
            Event.on(this.control, 'touchend', function(e) {
              that._onMouseUp(e);
            });
          },

          _onMouseUp: function(e) {
            var that = this;
            e.preventDefault();

            that._offEvent();

            // 设置当前时间，播放视频
            if (this.volumnRange.offsetHeight) {
              var value = (this.volumnValue.offsetHeight / this.volumnRange.offsetHeight).toFixed(
                2,
              );
              this._player.setVolume(value);
              this._setMuteUI(value);
            }
          },

          _onMouseMove: function(e) {
            e.preventDefault();
            var volumnValue = this._getPosition(e);

            if (volumnValue < 0) volumnValue = 0;
            if (volumnValue > 1) volumnValue = 1;
            this._setVolumnUI(volumnValue);
          },

          _getPosition: function(e) {
            var b = this.volumnRange,
              y = 0;
            while ((b = b.offsetParent)) {
              y += b.offsetTop;
            }
            var height = this.volumnRange.offsetHeight;
            var cursorHeight = this.volumnCursor.offsetHeight;
            //(y<e.pageY?e.clientY
            var pageY = e.touches ? e.touches[0].pageY : e.pageY,
              distance = height - (pageY - y) + cursorHeight,
              height = this.volumnRange.offsetHeight,
              volumnValue = distance / height;
            return volumnValue;
          },

          _offEvent: function() {
            Event.off(this._player.tag, 'mouseup');
            Event.off(this._player.tag, 'touchend');
            Event.off(this.control, 'mousemove');
            Event.off(this.control, 'touchmove');
            Event.off(this.control, 'mouseup');
            Event.off(this.control, 'touchend');
          },

          _setMuteUI: function(value) {
            if (isNaN(value)) {
              return;
            }
            if (value == 0 || value == -1) {
              Dom.addClass(this.icon, 'mute');
            } else {
              Dom.removeClass(this.icon, 'mute');
            }
          },
          _setVolumnUI: function(value) {
            if (isNaN(value)) {
              return;
            }
            Dom.css(this.volumnValue, 'height', value * 100 + '%');

            if (value == 1) {
              value = 0.99;
            }
            Dom.css(this.volumnCursor, 'bottom', value * 100 + '%');
          },
        });

        module.exports = VolumeControl;
      },
      {
        '../../lang/index': 17,
        '../../lib/dom': 24,
        '../../lib/event': 25,
        '../../player/base/event/eventtype': 48,
        '../component': 99,
        './util': 127,
      },
    ],
    130: [
      function(require, module, exports) {
        /**
         * @fileoverview ui组件列表，fullversion会将定义的所有ui组件列于此做统一加载
         *               后期补上根据实际需求配置组件列表，从而一定程度上减少体积
         * @author 首作<aloysious.ld@taobao.com>
         * @date 2015-01-05
         */
        module.exports = {
          H5Loading: require('./component/h5-loading'),
          bigPlayButton: require('./component/big-play-button'),
          controlBar: require('./component/controlbar'),
          progress: require('./component/progress'),
          playButton: require('./component/play-button'),
          liveDisplay: require('./component/live-display'),
          timeDisplay: require('./component/time-display'),
          fullScreenButton: require('./component/fullscreen-button'),
          volume: require('./component/volume'),
          // 'streamButton': require('./component/stream-selector'),
          // 'speedButton': require('./component/speed-selector'),
          snapshot: require('./component/snapshot'),
          errorDisplay: require('./component/error-display'),
          infoDisplay: require('./component/info-display'),
          liveShiftProgress: require('../commonui/liveshiftprogress'),
          liveShiftTimeDisplay: require('../commonui/livetimedisplay'),
          setting: require('./component/setting/button'),
          subtitle: require('./component/cc-button'),
          thumbnail: require('./component/thumbnail'),
          tooltip: require('./component/tooltip'),
        };
      },
      {
        '../commonui/liveshiftprogress': 9,
        '../commonui/livetimedisplay': 10,
        './component/big-play-button': 102,
        './component/cc-button': 103,
        './component/controlbar': 104,
        './component/error-display': 106,
        './component/fullscreen-button': 107,
        './component/h5-loading': 108,
        './component/info-display': 109,
        './component/live-display': 110,
        './component/play-button': 112,
        './component/progress': 113,
        './component/setting/button': 116,
        './component/snapshot': 123,
        './component/thumbnail': 124,
        './component/time-display': 125,
        './component/tooltip': 126,
        './component/volume': 128,
      },
    ],
  },
  {},
  [12],
);
