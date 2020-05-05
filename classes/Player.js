class Player {
    constructor(name) {
        this._name = name;
        this._currentHealth = 100;
        this._maxHealth = 100;
        this._currentStamina = 100;
        this._maxStamina = 100;
        this._inventory = [];
        this._currentAmmo = 0;
        this._upgrades = [];
        this._velocity = {x: 0, y: 0, z: 0};
        this._movingForward = false;
        this._movingBackward = false;
        this._movingLeft = false;
        this._movingRight = false;
        this._jumping = false;
        this._running = false;
        this._runFactor = 1;
        this._playerModel = undefined;
        this._idleAnim = undefined;
        this._walkAnim = undefined;
        this._backwardsAnim = undefined;
        this._jumpAnim = undefined;
        this._runAnim = undefined;
    }

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

    get currentAmmo() {
        return this._currentAmmo;
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

    get playerModel() {
        return this._playerModel;
    }

    get currentAnimation() {
        return this._currentAnimation;
    }

    get idleAnim() {
        return this._idleAnim;
    }
    
    get walkAnim() {
        return this._walkAnim;
    }

    get backwardsAnim() {
        return this._backwardsAnim;
    }

    get jumpAnim() {
        return this._jumpAnim;
    }

    get runAnim() {
        return this._runAnim;
    }

    set currentHealth(health) {
        this._currentHealth = health;
    }

    set maxHealth(health) {
        this._maxHealth = health;
    }

    set currentStamina(stamina) {
        this._currentStamina = stamina;
    }

    set currentAmmo(ammo) {
        this._currentAmmo = ammo;
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

    set playerModel(model) {
        this._playerModel = model;
    }

    set currentAnimation(animation) {
        this._currentAnimation = animation;
    }

    set idleAnim(animation) {
        this._idleAnim = animation;
    }
    
    set walkAnim(animation) {
        this._walkAnim = animation;
    }

    set backwardsAnim(animation) {
        this._backwardsAnim = animation;
    }

    set jumpAnim(animation) {
        this._jumpAnim = animation;
    }

    set runAnim(animation) {
        this._runAnim = animation;
    }

    addItem(item) {
        this._inventory.push(item);
    }

    addUpgrade(upgrade) {
        this._upgrades.push(upgrade)
    }
}