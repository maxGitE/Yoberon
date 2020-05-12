class Alien {
    constructor() {
        this._currentHealth = 100;
        this._maxHealth = 100;
        this._inventory = [];
        this._postition = {x: 0, y: 0, z: 0};
        this._alienModel = undefined;
        this._hitbox = undefined;
        this._idleAnim = undefined;
        this._walkAnim = undefined;
        this._strafeLAnim = undefined;
        this._strafeRAnim = undefined;
        this._walkBackwardsAnim = undefined;
        this._deathAnim = undefined;        
        this._shootAnim = undefined;
    }

    /** GETTERS */
    get currentHealth() {
        return this._currentHealth;
    }

    get maxHealth() {
        return this._maxHealth;
    }

    get inventory() {
        return this._inventory;
    }

    get positionX() {
        return this._postition.x;
    }

    get positionY() {
        return this._postition.y;
    }

    get positionZ() {
        return this._postition.z;
    }

    get alienModel() {
        return this._alienModel;
    }

    get hitbox() {
        return this._hitbox;
    }

    get idleAnim() {
        return this._idleAnim;
    }

    get shootAnim() {
        return this._shootAnim;
    }

    get strafeLAnim() {
        return this._strafeLAnim;
    }

    get strafeRAnim() {
        return this._strafeRAnim;
    }

    get walkAnim() {
        return this._walkAnim;
    }

    get walkBackwardsAnim() {
        return this._walkBackwardsAnim;
    }

    get deathAnim() {
        return this._deathAnim;
    }

    /** SETTERS */
    set currentHealth(health) {
        this._currentHealth = health;
    }

    set maxHealth(health) {
        this._maxHealth = health;
    }

    addItem(item) {
        this._inventory.push(item);
    }

    set positionX(x) {
        this._postition.x = x;
    }

    set positionY(y) {
        this._postition.y = y;
    }

    set positionZ(z) {
        this._postition.z = z;
    }

    set alienModel(model) {
        this._alienModel = model;
    }

    set hitbox(hitbox) {
        this._hitbox = hitbox;
    }

    set idleAnim(animation) {
        this._idleAnim = animation;
    }

    set shootAnim(animation) {
        this._shootAnim = animation;
    }

    set strafeLAnim(animation) {
        this._strafeLAnim = animation;
    }

    set strafeRAnim(animation) {
        this._strafeRAnim = animation;
    }

    set walkAnim(animation) {
        this._walkAnim = animation;
    }

    set walkBackwardsAnim(animation) {
        this._walkBackwardsAnim = animation;
    }

    set deathAnim(animation) {
        this._deathAnim = animation;
    }
}