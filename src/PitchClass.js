forte.PitchClass = (function(PitchClassCollectionFormats) {

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
