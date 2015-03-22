forte.PitchClass = (function(PitchClassCollectionFormats){

  function PitchClass(anInt) {
      this._ = {
          intValue: anInt
      };
  }

  PitchClass.prototype = {
      get intValue() {
          return this._.intValue;
      }
  };

  PitchClass.withInt = function(anInt) {
      return new PitchClass(anInt, PitchClassCollectionFormats.numeric);
  };

  PitchClass.prototype.transpose = function(transposition) {
      this._.intValue = normalize(this._.intValue + transposition);
      return this;
  };

  PitchClass.prototype.invert = function() {
      this._.intValue = invert(this._.intValue);
      return this;
  };

  PitchClass.prototype.stringValue = function(aFormat) {
      return composeStringValue(this._.intValue, aFormat);
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
