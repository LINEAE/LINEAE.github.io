
const TenseEnum = Object.freeze({"present":1, "past":2, "future":3})
const PersonEnum = Object.freeze({"first":1, "second":2, "third":3})
const PluralEnum = Object.freeze({"singular":1, "plural":2})

function tenseToString(tense) {
  var ret = "";
  switch(tense) {
    case TenseEnum.present:  
      ret = "present";
      break;
    case TenseEnum.past:  
      ret = "past";
      break;
    case TenseEnum.present:  
      ret = "future";
      break;
  }
  return ret;
}

function personToString(person) {
  var ret = "";
  switch(person) {
    case PersonEnum.first:  
      ret = "first";
      break;
    case PersonEnum.second:  
      ret = "second";
      break;
    case PersonEnum.third:  
      ret = "third";
      break;
  }
  return ret;
}

function pluralToString(plural) {
  var ret = "";
  switch(plural) {
    case PluralEnum.singular:  
      ret = "singular";
      break;
    case PluralEnum.plural:  
      ret = "plural";
      break;
  }
  return ret;
}

function tenseToString(tense) {
  var ret = "";
  switch(tense) {
    case TenseEnum.present:  
      ret = "present";
      break;
    case TenseEnum.past:  
      ret = "past";
      break;
    case TenseEnum.present:  
      ret = "future";
      break;
  }
  return ret;
}

class Subject{
  constructor(name, person, plural) {
      this.name = name;
      this.person = person;
      this.plural = plural;
  }
  toString(){
    return "name:" + this.name + 
    "\nperson:" + personToString(this.person) + 
    "\nplural:" + pluralToString(this.plural);
  }
}

const subjects = [
    new Subject("I", PersonEnum.first, PluralEnum.singular),
    new Subject("You", PersonEnum.second, PluralEnum.singular),
    new Subject("He", PersonEnum.third, PluralEnum.singular),
    new Subject("She", PersonEnum.third, PluralEnum.singular),
    new Subject("It", PersonEnum.third, PluralEnum.singular),
    new Subject("We", PersonEnum.first, PluralEnum.plural),
    new Subject("You", PersonEnum.second, PluralEnum.plural),
    new Subject("They", PersonEnum.third, PluralEnum.plural)
];


class Tense{
  constructor(tense, progressive, perfect) {
      this.tense = tense;
      this.progressive = progressive;
      this.perfect = perfect;
  }

  toString(){
    return "tense:" + tenseToString(this.tense) + 
    "\nprogressive:" + this.progressive + 
    "\nperfect:" + this.perfect;
  }

}

const tenses = [
    new Tense(TenseEnum.present, false, false),
    new Tense(TenseEnum.present, true, false),
    new Tense(TenseEnum.present, false, true),
    new Tense(TenseEnum.present, true, true),

    new Tense(TenseEnum.past, false, false),
    new Tense(TenseEnum.past, true, false),
    new Tense(TenseEnum.past, false, true),
    new Tense(TenseEnum.past, true, true),

    new Tense(TenseEnum.future, false, false),
    new Tense(TenseEnum.future, true, false),
    new Tense(TenseEnum.future, false, true),
    new Tense(TenseEnum.future, true, true),
];

class Verb {
  constructor(base, past, perfect, progressive, kor, third) {
    this.base = base;
    this.past = past;
    this.perfect = perfect;
    this.progressive = progressive;
    this.kor = kor;
    this.third = third;
  }

  toString(){
    return "base:" + this.base + 
    "\npast:" + this.past + 
    "\nperfect:" + this.perfect +
    "\nprogressive:" + this.progressive +
    "\nkor:" + this.kor +
    "\nthird:" + this.third;
  }
}

const verbs = []

function loadVerbs() {
    for(var i = 0; i < data.length; i++) {
        var item = data[i]
        verbs[i] = new Verb(item[0], item[1], item[2], item[3], item[4])
    }
}

loadVerbs()

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function pickSubject() {
    var index = getRandomInt(0, subjects.length);
    return subjects[index];
}

function pickTense() {
    var index = getRandomInt(0, tenses.length);
    return tenses[index];
}

function pickVerb() {
    var index = getRandomInt(0, verbs.length);
    return verbs[index];
}

function getResult(subject, verb, tense) {
  var name = subject.name;

  var verbPrefix = "";
  var displayVerb = "";
    switch(tense.tense) {
      case TenseEnum.present: {
        if(tense.perfect == true) {
          if(subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
            verbPrefix += "has ";
          }else {
            verbPrefix += "have ";
          }

          if(tense.progressive == true) {
            verbPrefix += "been ";
            displayVerb = verb.progressive;
          }else {
            displayVerb = verb.perfect;
          }

        }else{
          if(tense.progressive == true) {
            if(subject.person == PersonEnum.first && subject.plural == PersonEnum.singular) {
              verbPrefix += "am ";
            } else if(subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
              verbPrefix += "is ";
            }else {
              verbPrefix += "are ";
            }
            displayVerb = verb.progressive;
          }else {
            if(subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
              displayVerb = verb.third;
            } else {
              displayVerb = verb.base;
            }
          }
        }
        break;
      }
      case TenseEnum.past: {
        if(tense.perfect == true) {
          verbPrefix += "had ";

          if(tense.progressive == true) {
            verbPrefix += "been ";
            displayVerb = verb.progressive;
          }else {
            displayVerb = verb.perfect;
          }

        }else {
          if(tense.progressive == true) {
            if(subject.person == PersonEnum.first && subject.plural == PersonEnum.singular) {
              verbPrefix += "was ";
            } else if(subject.person == PersonEnum.third && subject.plural == PluralEnum.singular) {
              verbPrefix += "was ";
            }else {
              verbPrefix += "were ";
            }
            displayVerb = verb.progressive;
          } else {
            displayVerb = verb.past;
          }
        }
        break;
      }
      case TenseEnum.future: {
        verbPrefix += "will ";
        if(tense.perfect == true) {
          verbPrefix += "have ";

          if(tense.progressive == true) {
            verbPrefix += "been ";
            displayVerb = verb.progressive;
          } else {
            displayVerb = verb.perfect;
          }
        } else {

          if(tense.progressive == true) {
            verbPrefix += "be ";
            displayVerb = verb.progressive;
          } else {
            displayVerb = verb.base;
          }
        }
        break;
      }
    }
  
    return name + " " + verbPrefix + displayVerb

}