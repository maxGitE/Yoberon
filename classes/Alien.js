class Alien {
    constructor() {
        this._currentHealth = 100;
        this._maxHealth = 100;
        this._damaged = false;
        this._inventory = [];
        this._position = {x: 0, y: 0, z: 0};
        this._scale = {x: 6.5, y: 6.5, z: 6.5};
        this._rotation = {x: 0, y: 0, z: 0};
        this._defaultAnim = "Idle";
        this._model = undefined;
        this._hitbox = undefined;
        this._currentAnimation = undefined;
        this._idleAnim = undefined;
        this._walkAnim = undefined;
        this._strafeLAnim = undefined;
        this._strafeRAnim = undefined;
        this._walkBackwardsAnim = undefined;
        this._deathAnim = undefined;        
        this._shootAnim = undefined;
        this._weapon = {bulletStart: undefined, bullets: [], cooldown: 0};
        this._canShoot = {level: undefined, box: undefined};
        this._range = 250;
        this._movement = {distanceMoved: 0, leftOrRight: undefined, moveOrRemain: undefined, boundary: undefined};
    }

    /** GETTERS */
    get currentHealth() {
        return this._currentHealth;
    }

    get maxHealth() {
        return this._maxHealth;
    }

    get damaged() {
        return this._damaged;
    }

    get inventory() {
        return this._inventory;
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

    get defaultAnim() {
        return this._defaultAnim;
    }

    get position() {
        return this._position;
    }

    get scale() {
        return this._scale;
    }

    get rotation() {
        return this._rotation;
    }

    get inRangeofPlayer() {
        return this._inRangeofPlayer;
    }

    get weapon() {
        return this._weapon;
    }

    get canShoot() {
        return this._canShoot;
    }

    get range() {
        return this._range;
    }

    get movement() {
        return this._movement;
    }

    /** SETTERS */
    set currentHealth(health) {
        this._currentHealth = health;
    }

    set maxHealth(health) {
        this._maxHealth = health;
    }

    set damaged(value) {
        this._damaged = value;
    }

    addItem(item) {
        this._inventory.push(item);
    }

    setPosition(x, y, z) {
        this._position.x = x;
        this._position.y = y;
        this._position.z = z;
    }

    setScale(x, y, z) {
        this._scale.x = x;
        this._scale.y = y;
        this._scale.z = z;
    }

    setRotation(x, y, z) {
        this._rotation.x = x;
        this._rotation.y = y;
        this._rotation.z = z;
    }

    set defaultAnim(animation) {
        this._defaultAnim = animation;
    }

    set model(model) {
        this._model = model;
    }

    set hitbox(hitbox) {
        this._hitbox = hitbox;
    }

    set range(range) {
        this._range = range;
    }

    set currentAnimation(animation) {
        this._currentAnimation = animation;
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

    set inRangeofPlayer(value) {
        this._inRangeofPlayer = value;
    }
}