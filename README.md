# Forte.js

Version 0.0.2

## API

## Pitch Class

    var pc = forte.PitchClass.withInt(7);

    pc.toString();
    //returns '7';
    pc.toString('latin');
    //returns 'Sol'
    pc.toString('american');
    //returns 'g'

    pc.getIntValue();
    //returns 7

## Pitch Class Set

### Create new Pitch Class Set

    var pcs = forte.PitchClassSet.withArray([0,4,7,8]);

### Get prime form

    pcs.getPrimeForm().toString();
    //returns '(0,1,4,8)'

### Get prime inversion

    pcs.getPrimeInversion().toString();
    //returns '[0,3,4,8]'

### Get interval vector

    pcs.getIv().toString();
    //returns '<101310>'
