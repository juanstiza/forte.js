@import "../tmp/lodash.js";

(function(){

  var VERSION = '0.0.3';

  var forte = forte || {};

  @import "constants/constants.js";

  @import "PitchClass.js";
  @import "PitchClassCollection.js";
  @import "PitchClassSet.js";

  forte.VERSION = VERSION;

  this.forte = forte;

}());
