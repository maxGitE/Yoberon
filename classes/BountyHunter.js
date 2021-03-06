class BountyHunter {
    constructor() {
        this._model = undefined;
        this._position = {x: 0, y: 0, z: 0};
        this._scale = {x: 5, y: 5, z: 5};
        this._rotation = {x: 0, y: 0, z: 0};
        this._defaultAnim = undefined;
        this._downAnim = undefined;
        this._upAnim = undefined;
        this._sideAnim = undefined;
    }

    /** GETTERS */    
    get model() {
        return this._model;
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

    get defaultAnim() {
        return this._defaultAnim;
    }

    get downAnim() {
        return this._downAnim;
    }

    get upAnim() {
        return this._upAnim;
    }

    get sideAnim() {
        return this._sideAnim;
    }

    /** SETTERS */
    set model(model) {
        this._model = model;
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

    set downAnim(animation) {
        this._downAnim = animation;
    }

    set upAnim(animation) {
        this._upAnim = animation;
    }

    set sideAnim(animation) {
        this._sideAnim = animation;
    }
}