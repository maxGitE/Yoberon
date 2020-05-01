class Clock {
    constructor() {
        this._timeBefore = performance.now();
        this._timeNow;
        this._delta;
    }

    get timeBefore() {
        return this._timeBefore;
    }
    
    get timeNow() {
        return this._timeNow;
    }

    get delta() {
        return this._delta;
    }

    set timeBefore(time) {
        this._timeBefore = time;
    }

    set timeNow(time) {
        this._timeNow = time;
    }

    set delta(delta) {
        this._delta = delta;
    }
}