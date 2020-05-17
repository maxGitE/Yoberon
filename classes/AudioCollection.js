class AudioCollection {
    constructor() {
        this._wildlife;
        this._weapon;
        this._headshot;
        this._hitmarker;
        this._jumpboost;
        this._paper;
        this._totemSelect;
        this._wrongTotemOrder;
        this._correctTotemOrder;
        this._rockSink;
        this._rockSlide;
        this._tooltipCompleted;
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

    get paper() {
        return this._paper;
    }

    set paper(audio) {
        this._paper = audio;
    }

    get headshot() {
        return this._headshot;
    }

    set headshot(audio) {
        this._headshot = audio;
    }

    get hitmarker() {
        return this._hitmarker;
    }

    set hitmarker(audio) {
        this._hitmarker = audio;
    }

    get totemSelect() {
        return this._totemSelect;
    }

    set totemSelect(audio) {
        this._totemSelect = audio;
    }

    get wrongTotemOrder() {
        return this._wrongTotemOrder
    }

    set wrongTotemOrder(audio) {
        this._wrongTotemOrder = audio;
    }

    get correctTotemOrder() {
        return this._correctTotemOrder;
    }

    set correctTotemOrder(audio) {
        this._correctTotemOrder = audio;
    }

    get rockSink() {
        return this._rockSink;
    }

    set rockSink(audio) {
        this._rockSink = audio;
    }

    get rockSlide() {
        return this._rockSlide;
    }

    set rockSlide(audio) {
        this._rockSlide = audio;
    }

    get tooltipCompleted() {
        return this._tooltipCompleted;
    }

    set tooltipCompleted(audio) {
        this._tooltipCompleted = audio;
    }
}