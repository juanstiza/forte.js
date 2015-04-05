(function() {

  'use strict';

  describe('fortejs PitchClassSet', function() {

    it('Should return a PitchClassSet as an array', function() {

      expect(forte.PitchClassSet.withArray([0, 1, 2, 3]).getArrayValue()).toEqual([0, 1, 2, 3]);

    });

    it('Should return a PitchClassSet cardinal number',
      function() {

        expect(forte.PitchClassSet.withArray([0, 1, 2, 3]).getCardinal()).toEqual(4);

      });

    it('Should transpose, invert and normalize a PitchClassSet',
      function() {

        expect(forte.PitchClassSet.withArray([0, 1, 2, 3]).transpose(5).getArrayValue()).toEqual([5, 6, 7, 8]);
        expect(forte.PitchClassSet.withArray([0, 1, 2, 3]).transpose(5).normalize().getArrayValue()).toEqual([0, 1, 2, 3]);

        expect(forte.PitchClassSet.withArray([0, 1, 2, 3]).invert().getArrayValue()).toEqual([0, 11, 10, 9]);

        expect(
          forte.PitchClassSet.withArray([2, 3, 4]).invert().getArrayValue()
        ).toEqual([10, 9, 8]);
        expect(
          forte.PitchClassSet.withArray([2, 3, 4]).invert().transpose(-8).getArrayValue()
        ).toEqual([2, 1, 0]);

      });

    it('Should return a PitchClassSet as string values',
      function() {

        var aPCSet = forte.PitchClassSet.withArray([0, 1, 2, 3]);
        expect(aPCSet.getNormalForm().toString()).toEqual('(0,1,2,3)');

        expect(forte.PitchClassSet.withArray([5, 2, 4, 1]).getIv().toString()).toEqual('<212100>');

      });

    it('Should return prime and inverted forms as arrays',
      function() {

        var aPCSet = forte.PitchClassSet.withArray([0, 1, 7, 11]);
        expect(aPCSet.getPrimeForm().toArray()).toEqual([0, 1, 2, 6]);
        expect(aPCSet.getPrimeInversion().toArray()).toEqual([0, 4, 5, 6]);

      });

    it('Should return Pitch class set map',
      function() {

        var aPCSet = forte.PitchClassSet.withArray([0, 4, 7, 8]);
        expect(aPCSet.getHash().map).toEqual([1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0]);

      });

  });

})();
