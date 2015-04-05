forte.PitchClassSet = (function(PitchClass,
  PitchClassCollectionFormats,
  PitchClassCollectionTypes,
  PitchClassCollection,
  PitchClassSetData){

    function PitchClassSet(anArray, isSet) {
        this._ = {
            theSet : [],
            PitchClassCollectionFormat: PitchClassCollectionFormats.numeric,
            PitchClassCollectionType: PitchClassCollectionTypes.primeForm
        };
        if (isSet) {
            this._.theSet = anArray;
        } else {
            _.forEach(anArray, function(value, index){
                this.push(PitchClass.withInt(parseInt(value)));
            }, this._.theSet);
        }
    }

    PitchClassSet.prototype = {
        get arrayValue() {
            var theResult = [];
            _.forEach(this._.theSet, function(value, index) {
                this.push(value.getIntValue());
            }, theResult);
            return theResult;
        },
        get normalForm() {
            return PitchClassCollection.withArrayTypeAndFormat(this.arrayValue,
                this._.PitchClassCollectionType,
                this._.PitchClassCollectionFormat);
        },
        get primeForm() {
            return getPrimeForm(this).primeForm;
        },
        get primeInversion() {
            return getPrimeForm(this).primeInversion;
        },
        get cardinal() {
            return this._.theSet.length;
        },
        get forteCode() {
            return getPrimeForm(this).forteCode;
        },
        get hash() {
            return {
                value: hashValue(this.arrayValue),
                map: hashMap(this.arrayValue)
            };
        },
        get iv() {
            return getIv(this._.theSet);
        }
    };

    function getSmallest(aPitchClassSet) {
        var multi = [];
        _.forEach(aPitchClassSet._.theSet, function(aPitchClass, index) {
            this.push({
                sd:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize().sd(),
                string:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize().normalForm.toString(),
                value:aPitchClassSet.copy().transpose(aPitchClass.getIntValue()).normalize()
            });
        }, multi);
        var ordered = _.sortBy(multi, 'sd');
        return ordered[0].value.arrayValue;
    }

    //TODO: find also inverted form, if it exists (should be either original or inverted).
    function getPrimeForm(aPitchClassSet) {
        var originalHash = getSmallest(aPitchClassSet.copy());
        var invertedHash = getSmallest(aPitchClassSet.copy().invert());
        var setData = PitchClassSetData[aPitchClassSet.arrayValue.length];
        var result = {
            forteCode: "",
            primeForm: {},
            primeInversion: {},
        };
        _.forEach(setData, function(value, index){
            if (_.isEqual(value, originalHash)) {
                result.primeForm = PitchClassCollection.withArrayTypeAndFormat(value, PitchClassCollectionTypes.primeForm, PitchClassCollectionFormats.numeric);
                result.forteCode = index;
                result.primeInversion = PitchClassCollection.withArrayTypeAndFormat(invertedHash, PitchClassCollectionTypes.primeInversion, PitchClassCollectionFormats.numeric);
            }
            if (_.isEqual(value, invertedHash)) {
                result.primeForm = PitchClassCollection.withArrayTypeAndFormat(value, PitchClassCollectionTypes.primeForm, PitchClassCollectionFormats.numeric);
                result.forteCode = index;
                result.primeInversion = PitchClassCollection.withArrayTypeAndFormat(originalHash, PitchClassCollectionTypes.primeInversion, PitchClassCollectionFormats.numeric);
            }
        });
        return result;
    }

    PitchClassSet.prototype.transpose = function(transposition) {
        _.forEach(this._.theSet, function(aPitchClass, index){
          aPitchClass.transpose(transposition);
        });
        return this;
    };

    PitchClassSet.prototype.normalize = function() {
        var newSet = _.sortBy(this._.theSet, function(n){
          return n.getIntValue();
        });
        var index = newSet[0].getIntValue();
        this._.theSet = newSet;
        this.transpose(-index);
        return this;
    };

    PitchClassSet.prototype.invert = function() {
        _.forEach(this._.theSet, function(aPitchClass){
            aPitchClass.invert();
        });
        return this;
    };

    PitchClassSet.prototype.sd = function() {
        var mean = this.mean();
        var sd = 0;
        var sum = 0;
        _.forEach(this.arrayValue, function(value){
            sum = (mean - value) + sum;
        });
        return Math.sqrt(mean / this.arrayValue.length);
    };

    /**
     * Get the mean out of an array.
     * @param anArray
     */
    PitchClassSet.prototype.mean = function() {
        var mean = 0;
        _.forEach(this.arrayValue, function(value){
            mean += value;
        }, mean);
        return mean/this.arrayValue.length;
    };

    PitchClassSet.prototype.copy = function() {
        return PitchClassSet.withSet(this._.theSet);
    };

    function hashValue(anArray) {
        var value = hashMap(anArray);
        return parseInt(value.join(''), 2);
    }

    function hashMap(anArray) {
        var value = [];
        for (var i = 0; i < 12; i++) {
            if (anArray.indexOf(i) != -1) {
                value[i] = 1;
            } else value[i] = 0;
        }
        return value;
    }

    /**
     * Interval Vector
     * @returns {*}
     */
    function getIv(aSet) {
        var setHashMap = {};
        _.forEach(aSet, function(a) {
            _.forEach(aSet, function(b){
                if (a.getIntValue() != b.getIntValue()) {
                    var hash = ((a.getIntValue() + b.getIntValue() + 1) / ((a.getIntValue() * b.getIntValue()) + 1)).toString();
                    setHashMap[hash] = [a.getIntValue(), b.getIntValue()];
                }
            });
        });
        var diffSet = [];
        _.forEach(setHashMap, function(value){
            diffSet.push(Math.abs(value[0] - value[1]));
        });
        var countSet = {};
        for (var i = 1; i < 7; i++) {
            countSet[i] = 0;
        }
        _.forEach(diffSet, function(value){
            countSet[value%6] += 1;
        });
        var intervalVector = [];
        _.forEach(countSet, function(value) {
            this.push(value);
        }, intervalVector);
        return PitchClassCollection.withArrayTypeAndFormat(intervalVector,
            PitchClassCollectionTypes.intervalVector,
            PitchClassCollectionFormats.numeric);
    }

    PitchClassSet.withArray = function(anArray) {
        return new PitchClassSet(anArray);
    };

    PitchClassSet.withSet = function(aSet) {
        return new PitchClassSet(aSet, true);
    };

    PitchClassSet.withMap = function(aMap) {
        var set = [];
        _.forEach(aMap, function(value, index){
            if (value == 1) set.push(index);
        });
        return new PitchClassSet(set);
    };

    return PitchClassSet;

})(forte.PitchClass,
  forte.pitchClassCollectionFormats,
  forte.pitchClassCollectionTypes,
  forte.PitchClassCollection,
  forte.pitchClassSetData);
