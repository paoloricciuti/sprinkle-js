'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./sprinkle-js.cjs.prod.js");
} else {
  module.exports = require("./sprinkle-js.cjs.dev.js");
}
