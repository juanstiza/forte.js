(function(){

  'use strict';

  describe('fortejs PitchClass', function(){

    it('Should instantiate PitchClass Class',
      function(){

        expect(forte.PitchClass.withInt(0).getIntValue()).toEqual(0);

    });

    it('Should transpose a PitchClass',function(){

      expect(forte.PitchClass.withInt(0).transpose(1).getIntValue()).toEqual(1);
      expect(forte.PitchClass.withInt(0).transpose(-1).getIntValue()).toEqual(11);
      expect(forte.PitchClass.withInt(0).transpose(13).getIntValue()).toEqual(1);

      expect(forte.PitchClass.withInt(0).transpose(5).transpose(-3).getIntValue()).toEqual(2);

    });

    it('Should represent a PitchClass as string value', function(){

      var aPC = forte.PitchClass.withInt(0);
      expect(aPC.toString(forte.pitchClassCollectionFormats.numeric)).toEqual('0');
      expect(aPC.toString(forte.pitchClassCollectionFormats.latin)).toEqual('do');
      expect(aPC.toString()).toEqual('0');

      expect(aPC.toString('numeric')).toEqual('0');
      expect(aPC.toString('latin')).toEqual('do');

    });

    it('Should invert a PitchClass',
      function(){

      expect(forte.PitchClass.withInt(7).invert().getIntValue()).toEqual(5);

      expect(forte.PitchClass.withInt(13).invert().getIntValue()).toEqual(11);

      expect(forte.PitchClass.withInt(7).invert().invert().getIntValue()).toEqual(7);

    });

    it('Should invert and transpose a PitchClass',
      function(){

      expect(forte.PitchClass.withInt(7).invert().transpose(3).getIntValue()).toEqual(8);

    });

  });

})();
