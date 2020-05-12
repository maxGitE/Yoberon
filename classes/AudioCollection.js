class AudioCollection {
    constructor() {
        this._wildlife;
        this._weapon;
        this._headshot;
        this._jumpboost;
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

    get jumpBoost() {
        return this._jumpboost;
    }

    set jumpBoost(audio) {
        this._jumpboost = audio;
    }

    get headshot() {
        return this._headshot;
    }

    set headshot(audio) {
        this._headshot = audio;
    }
}