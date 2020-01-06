/**
 * LocalStorage Checkbox
 */
class LSCheckbox {
    constructor(checkbox, keyName, defaultValue) {
        this.checkbox = checkbox
        this.keyName = keyName;
        this.defaultValue = defaultValue;

        this.load()
    }

    load() {
        if( null == window.localStorage.getItem(this.keyName) ) {
            this.checkbox.checked = this.defaultValue;
            this.save()
        } else {
            this.checkbox.checked = window.localStorage.getItem(this.keyName) == "true";
        }
    }

    save() {
        window.localStorage.setItem(this.keyName, this.checkbox.checked);
    }

    checked() {
        return window.localStorage.getItem(this.keyName) == "true"
    }
}

class LSValue {
    constructor(keyName, defaultValue) {
        this.keyName = keyName;
        this.defaultValue = defaultValue;
        this.value = null
        this.load()
    }

    load() {
        this.value = window.localStorage.getItem(this.keyName);
        if( null == window.localStorage.getItem(this.keyName) ) {
            this.value = this.defaultValue;
        }
    }

    save() {
        window.localStorage.setItem(this.keyName, this.value);
    }

    remove() {
        window.localStorage.removeItem(this.keyName)
        this.value = null
    }

    getValue() {
        if( null == this.value ) {
            this.load()
        }
        return this.value
    }

    getEval() {
        return eval(this.getValue())
    }

    setValue(value) {
        this.value = value
        this.save()
    }

}

function shuffle(array) {
    var j, x, i;
    for (i = array.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
}

function log(msg) {
    console.log(msg)
}