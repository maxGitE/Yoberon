class Starfield {
    constructor(initialColour) {
        this._starVertices = [];

        for(let i = 0; i < 500; i++) {
            let x = Math.random() * 2200 - 1000;
            let y = Math.random() * 500 + 500;
            let z = Math.random() * 2200 - 1000;

            this._starVertices.push(x, y, z);
        }

        this._starGeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(this._starVertices, 3));
        this._starMaterial = new THREE.PointsMaterial( {color: initialColour, size: 3, opacity: 1, transparent: true} );
        this._starField = new THREE.Points(this._starGeometry, this._starMaterial);
        this._direction = initialColour == "black" ? "increase" : "decrease";
    }

    get starGeometry() {
        return this._starGeometry;
    }

    get starMaterial() {
        return this._starMaterial;
    }

    get starField() {
        return this._starField;
    }

    get direction() {
        return this._direction;
    }

    get r() {
        return this._starField.material.color.r;
    }

    get g() {
        return this._starField.material.color.g;
    }

    get b() {
        return this._starField.material.color.b;
    }

    set direction(direction) {
        this._direction = direction;
    }

    set r(r) {
        this._starField.material.color.r = r;
    }

    set g(g) {
        this._starField.material.color.g = g;
    }

    set b(b) {
        this._starField.material.color.b = b;
    }

    reachedColourBoundary() {
        return (this.r >= 1 && this.g >= 1 && this.b >= 1) || (this.r <= 0 && this.g <= 0 && this.b <= 0);
    }

    isWhite() {
        return this.r >= 1 && this.g >= 1 && this.b >= 1;
    }

    updateColour(colourDelta) {
        if(this.reachedColourBoundary()) {
            if(this.isWhite()) {
                this._direction = "decrease";
            }
            else {
                this._direction = "increase";
            }
        }

        if(this._direction == "decrease") {
            this.r -= colourDelta;
            this.g -= colourDelta;
            this.b -= colourDelta;
        }
        else {
            this.r += colourDelta;
            this.g += colourDelta;
            this.b += colourDelta;
        }
    }
}
