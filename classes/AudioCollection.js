class AudioCollection {
    constructor() {
        this._wildlife;
        this._weapon;
    }

    get wildlife() {
        return this._wildlife;
    }

    set wildlife(audio) {
        this._wildlife = audio;
    }
    
    get weapon() {
        return this._weapon;
    }

    set weapon(audio) {
        this._weapon = audio;
    }
}