const TenseEnum = Object.freeze({
    "present": 1,
    "past": 2,
    "future": 3
})
const PersonEnum = Object.freeze({
    "first": 1,
    "second": 2,
    "third": 3
})
const PluralEnum = Object.freeze({
    "singular": 1,
    "plural": 2
})

function tenseToString(tense) {
    var ret = "";
    switch (tense) {
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
    switch (person) {
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
    switch (plural) {
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
    switch (tense) {
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

class Subject {
    constructor(name, person, plural) {
        this.name = name;
        this.person = person;
        this.plural = plural;
    }
    toString() {
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
    new Subject("We", PersonEnum.first, PluralEnum.plural),
    new Subject("You", PersonEnum.second, PluralEnum.plural),
    new Subject("They", PersonEnum.third, PluralEnum.plural)
];


class Tense {
    constructor(tense, progressive, perfect) {
        this.tense = tense;
        this.progressive = progressive;
        this.perfect = perfect;
    }

    toString() {
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

    toString() {
        return "base:" + this.base +
            "\npast:" + this.past +
            "\nperfect:" + this.perfect +
            "\nprogressive:" + this.progressive +
            "\nkor:" + this.kor +
            "\nthird:" + this.third;
    }
}

const verbs = [];

(function () {
    for (var i = 0; i < irregularVerbsData.length; i++) {
        var item = irregularVerbsData[i];
        verbs[i] = new Verb(item[0], item[1], item[2], item[3], item[4], item[5]);
    }
})()

class Article {
    constructor(index, description) {
        this.index = index;
        this.description = description;
    }
}

const articles = [];
(function () {
    for (var i = 0; i < imageArticlesData.length; i++) {
        var item = imageArticlesData[i];
        articles[i] = new Article(i + 1, item[0]);
    }
})()

class Adjective {
    constructor(category, eng, kor) {
        this.category = category;
        this.eng = eng;
        this.kor = kor;
    }
}

const adjectives = [];
(function () {
    for (var i = 0; i < adjectivesData.length; i++) {
        var item = adjectivesData[i];
        adjectives[i] = new Adjective(item[0], item[1], item[2]);
    }
})()