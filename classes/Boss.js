class Boss {
    constructor() {
        this._currentHealth = 1000;
        this._model = undefined;
        this._hitbox = undefined;
        this._currentAnimation = undefined;
        this._walkAnim = undefined;
        this._attackAnim = undefined;
        this._idleAnim = undefined;
        this._flexAnim = undefined;
        this._deathAnim = undefined;
        this._range = 25;
        this._movement = {distanceMoved: 0, moveOrRemain: undefined};
    }

    get currentHealth() {
        return this._currentHealth;
    }

    get model() {
        return this._model;
    }

    get hitbox() {
        return this._hitbox;
    }

    get currentAnimation() {
        return this._currentAnimation;
    }

    get walkAnim() {
        return this._walkAnim;
    }

    get attackAnim() {
        return this._attackAnim;
    }

    get idleAnim() {
        return this._idleAnim;
    }

    get flexAnim() {
        return this._flexAnim;
    }

    get deathAnim() {
        return this._deathAnim;
    }

    get range() {
        return this._range;
    }

    get movement() {
        return this._movement;
    }

    set currentHealth(health) {
        this._currentHealth = health;
    }

    set model(model) {
        this._model = model;
    }

    set hitbox(hitbox) {
        this._hitbox = hitbox;
    }

    set currentAnimation(animation) {
        this._currentAnimation = animation;
    }

    set walkAnim(animation) {
        this._walkAnim = animation;
    }

    set attackAnim(animation) {
        this._attackAnim = animation;
    }

    set idleAnim(animation) {
        this._idleAnim = animation;
    }

    set flexAnim(animation) {
        this._flexAnim = animation;
    }

    set deathAnim(animation) {
        this._deathAnim = animation;
    }

    set range(range) {
        this._range = range;
    }
}