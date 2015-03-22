(function(){

  'use strict';

  describe('fortejs PitchClass', function(){

    it('Should instantiate PitchClass Class',
      function(){

        expect(forte.PitchClass.withInt(0).intValue).toEqual(0);

    });

    it('Should transpose a PitchClass',function(){

      expect(forte.PitchClass.withInt(0).transpose(1).intValue).toEqual(1);
      expect(forte.PitchClass.withInt(0).transpose(-1).intValue).toEqual(11);
      expect(forte.PitchClass.withInt(0).transpose(13).intValue).toEqual(1);

      expect(forte.PitchClass.withInt(0).transpose(5).transpose(-3).intValue).toEqual(2);

    });

    it('Should represent a PitchClass as string value', function(){

      var aPC = forte.PitchClass.withInt(0);
      expect(aPC.stringValue(forte.pitchClassCollectionFormats.numeric)).toEqual('0');
      expect(aPC.stringValue(forte.pitchClassCollectionFormats.latin)).toEqual('do');

    });

    it('Should invert a PitchClass',
      function(){

      expect(forte.PitchClass.withInt(7).invert().intValue).toEqual(5);

      expect(forte.PitchClass.withInt(13).invert().intValue).toEqual(11);

      expect(forte.PitchClass.withInt(7).invert().invert().intValue).toEqual(7);

    });

  });

})();
