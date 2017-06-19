/**
 * @function
 *
 * world is a constructor function
 * with utility properties,
 * destined to be used in step definitions
 */

var {defineSupportCode} = require('cucumber');

function CustomWorld() {
  
}

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})

