class Player {
    constructor() {
        this._currentHealth = 10000;
        this._maxHealth = 100;
        this._currentStamina = 100;
        this._maxStamina = 100;
        this._inventory = [];
        this._hitbox = undefined;
        this._weapon = {model: undefined, bulletStart: undefined, bullets: undefined, cooldown: 0, recoil: {direction: "up", reachedTop: false, reachedBottom: false}};
        this._weaponUpgrade = {model: undefined, hasWeaponUpgrade: false, onCooldown: false, weaponUpgradeEnabled: false};
        this._bullet = undefined;
        this._upgrades = [];
        this._velocity = {x: 0, y: 0, z: 0};
        this._movingForward = false;
        this._movingBackward = false;
        this._movingLeft = false;
        this._movingRight = false;
        this._moving = false;
        this._jumping = false;
        this._running = false;
        this._runFactor = 1;
        this._hasGun = false;
        this._shield = {model: undefined, hasShield: false, shieldValue: 100, shieldEnabled: false, rechargingShield: false}
        this._playerModel = undefined;
        this._animations = {currentAnimation: undefined, idleAnim: undefined, walkAnim: undefined, backwardsAnim: undefined, jumpAnim: undefined, runAnim: undefined,
                            shootAnim: undefined, strafeLAnim: undefined, strafeRAnim: undefined, chickenDance: undefined, gangnamStyle: undefined, macarenaDance: undefined,
                            ymcaDance: undefined, breakdance: undefined, deathAnim: undefined, fallAnim: undefined};
    }

    /** GETTERS */
    get name() {
        return this._name;
    }

    get currentHealth() {
        return this._currentHealth;
    }

    get maxHealth() {
        return this._maxHealth;
    }

    get currentStamina() {
        return this._currentStamina;
    }

    get maxStamina() {
        return this._maxStamina;
    }

    get inventory() {
        return this._inventory;
    }

    get hitbox() {
        return this._hitbox;
    }

    get weapon() {
        return this._weapon;
    }
    
    get weaponUpgrade() {
        return this._weaponUpgrade;
    }

    get upgrades() {
        return this._upgrades;
    }

    get velocityX() {
        return this._velocity.x;
    }

    get velocityY() {
        return this._velocity.y;
    }

    get velocityZ() {
        return this._velocity.z;
    }

    get movingForward() {
        return this._movingForward;
    }

    get movingBackward() {
        return this._movingBackward;
    }

    get movingLeft() {
        return this._movingLeft;
    }

    get movingRight() {
        return this._movingRight;
    }

    get jumping() {
        return this._jumping;
    }

    get running() {
        return this._running;
    }

    get runFactor() {
        return this._runFactor;
    }

    get hasGun() {
        return this._hasGun;
    }

    get shield() {
        return this._shield;
    }

    get playerModel() {
        return this._playerModel;
    }

    get animations() {
        return this._animations;
    }

    /** SETTERS */
    set currentHealth(health) {
        this._currentHealth = health;
    }

    set maxHealth(health) {
        this._maxHealth = health;
    }

    set currentStamina(stamina) {
        this._currentStamina = stamina;
    }

    set hitbox(hitbox) {
        this._hitbox = hitbox;
    }

    set velocityX(x) {
        this._velocity.x = x;
    }

    set velocityY(y) {
        this._velocity.y = y;
    }

    set velocityZ(z) {
        this._velocity.z = z;
    }

    set movingForward(value) {
        this._movingForward = value;
    }

    set movingBackward(value) {
        this._movingBackward = value;
    }

    set movingLeft(value) {
        this._movingLeft = value;
    }

    set movingRight(value) {
        this._movingRight = value;
    }

    set jumping(value) {
        this._jumping = value;
    }

    set running(value) {
        this._running = value;
    }

    set runFactor(value) {
        this._runFactor = value;
    }

    set hasGun(value) {
        this._hasGun = value;
    }

    set playerModel(model) {
        this._playerModel = model;
    }

    addItem(item) {
        this._inventory.push(item);
    }

    addUpgrade(upgrade) {
        this._upgrades.push(upgrade)
    }
}