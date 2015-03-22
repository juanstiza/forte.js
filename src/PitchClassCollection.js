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
