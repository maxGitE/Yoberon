class AudioCollection {
    constructor() {
        this._wildlife;
        this._weapon;
        this._headshotAnnouncer;
        this._headshot;
        this._hitmarker;
        this._alienWeapon;
        this._jumpboost;
        this._paper;
        this._totemSelect;
        this._wrongTotemOrder;
        this._correctTotemOrder;
        this._rockSink;
        this._rockSlide;
        this._tooltipCompleted;
        this._playerInjured;
        this._playerDeath;
        this._deathAudio;
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

    get headshotAnnouncer() {
        return this._headshotAnnouncer;
    }

    set headshotAnnouncer(audio) {
        this._headshotAnnouncer = audio;
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

    get alienWeapon() {
        return this._alienWeapon;
    }

    set alienWeapon(audio) {
        this._alienWeapon = audio;
    }

    get playerInjured() {
        return this._playerInjured;
    }

    set playerInjured(audio) {
        this._playerInjured = audio;
    }

    get playerDeath() {
        return this._playerDeath;
    }

    set playerDeath(audio) {
        this._playerDeath = audio;
    }

    get deathAudio() {
        return this._deathAudio;
    }

    set deathAudio(audio) {
        this._deathAudio = audio;
    }
}