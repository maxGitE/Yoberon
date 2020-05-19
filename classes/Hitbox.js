class Hitbox {
    constructor(model) {
        this._mesh = new THREE.Object3D();
        this._body = undefined;
        this._head = undefined;

        switch(model) {
            case "player": 
                this._body = new THREE.Mesh(new THREE.CylinderBufferGeometry(3, 5, 16), new THREE.MeshBasicMaterial( {transparent: true, opacity: 0} ));
                this._body.position.y = 8;

                this._mesh.add(this._body);

                break;

            case "alien":
                this._body = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0.5, 2.8), new THREE.MeshBasicMaterial( {transparent: true, opacity: 0} ));
                this._head = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 8, 6, 0, 2*Math.PI, 0, Math.PI/2), new THREE.MeshBasicMaterial( {transparent: true, opacity: 0} ));
                this._head.position.set(0, 1.4, 0.075);

                this._body.name = "body";
                this._head.name = "head";

                this._mesh.add(this._body);
                this._mesh.add(this._head);

                break;
        }
    }

    get mesh() {
        return this._mesh;
    }

    get body() {
        return this._body;
    }

    get head() {
        return this._head;
    }
}