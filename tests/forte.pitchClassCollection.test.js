(function(){

  'use strict';

  describe('fortejs PitchClassCollection', function(){

    it('Should compose a collection string value as prime form',function(){

      var collection = forte.PitchClassCollection.withArrayAndType([0,1,2,3], forte.pitchClassCollectionTypes.primeForm);
      expect(collection.toString()).toEqual('(0,1,2,3)');

    });

    it('Should compose a collection string value as prime inversion',function(){

      var collection = forte.PitchClassCollection.withArrayAndType([0,1,2,3],
        forte.pitchClassCollectionTypes.primeInversion);
      expect(collection.toString()).toEqual('[0,1,2,3]');

    });

    it('Should compose a collection string value as normal form',function(){

      var collection = forte.PitchClassCollection.withArrayAndType([0,1,2,3],
        forte.pitchClassCollectionTypes.normalForm);
      expect(collection.toString()).toEqual('0,1,2,3');

    });

    it('Should compose a collection string value as interval vector',function(){

      var collection = forte.PitchClassCollection.withArrayAndType([1,1,2,2,3,3],
        forte.pitchClassCollectionTypes.intervalVector);
      expect(collection.toString()).toEqual('<112233>');

    });

    it('Should throw exception on malformed interval vector',
      function(){

      expect(function(forte){
        forte.PitchClassCollection.withArrayAndType([1,1,2,2,3],
          forte.pitchClassCollectionTypes.intervalVector);
      }).toThrow();

    });

    it('Should throw error on malformed pitch class set',
      function(){

      expect(function(forte){
        forte.PitchClassCollection.withArrayAndType([1,2,3,4,5,6,7,8,9,10,11,12],
          forte.pitchClassCollectionTypes.primeForm);
      }).toThrow();

      expect(function(forte){
        forte.PitchClassCollection.withArrayAndType([1,2],
          forte.pitchClassCollectionTypes.primeForm);
      }).toThrow();

    });

  });

})();
