window.onload = init;

var canvas;
var renderer;
var scene;
var camera;
var thirdPersonCamera;
var controls;
var clock;
var player;

function gameLoop() {
    requestAnimationFrame(gameLoop);

    if(controls.isLocked) {
        clock.timeNow = performance.now();
        clock.delta = (clock.timeNow - clock.timeBefore) / 1000;

        player.velocityX = player.velocityX - player.velocityX * 10 * clock.delta;
        player.velocityY = player.velocityY - 9.807 * 50 * clock.delta;
        player.velocityZ = player.velocityZ - player.velocityZ * 10 * clock.delta;

        if(player.movingLeft) {
            player.velocityX = player.velocityX - 400 * clock.delta;
        }
        if(player.movingRight) {
            player.velocityX = player.velocityX + 400 * clock.delta;
        }
        if(player.movingForwards) {
            player.velocityZ = player.velocityZ - 400 * clock.delta;
        }
        if(player.movingBackwards) {
            player.velocityZ = player.velocityZ + 400 * clock.delta;
        }

        controls.moveRight(player.velocityX * clock.delta);
        controls.moveForward(-player.velocityZ * clock.delta); // Negate the value as moveForward() uses left-handed coordinates
        controls.getObject().position.y += player.velocityY * clock.delta;

        if(controls.getObject().position.y < 5) {
            controls.getObject().position.y = 5;
            player.velocityY = 0;
            player.jumping = false;
        }

        initialBoundingBox();

        clock.timeBefore = clock.timeNow;
    }

    render();
}

function initialBoundingBox() {
    let x = controls.getObject().position.x;
    let z = controls.getObject().position.z;

    let zBoundBehind = 5;
    let xBoundFirst = 15;
    let zBoundFirst = -50;
    let xBoundSecond = 30;
    let zBoundSecond = -100;

    if(z > zBoundFirst) {
        if(z > zBoundBehind) {
            controls.getObject().position.z = zBoundBehind;
            player.velocityZ = 0;
        }

        if(x > xBoundFirst) {
            controls.getObject().position.x = xBoundFirst;
            player.velocityX = 0;
        }
        if(x < -xBoundFirst) {
            controls.getObject().position.x = -xBoundFirst;
            player.velocityX = 0;
        }
    }
    else if(z > zBoundSecond) {
        if(x > xBoundFirst) {
            if(z > zBoundFirst - 1) {
                controls.getObject().position.z = zBoundFirst - 1;
                player.velocityZ = 0;
            }
            if(x > xBoundSecond) {
                controls.getObject().position.x = xBoundSecond;
                player.velocityX = 0;
            }
        }
        if(x < -xBoundFirst) {
            if(z > zBoundFirst - 1) {
                controls.getObject().position.z = zBoundFirst - 1;
                player.velocityZ = 0;
            }
            if(x < -xBoundSecond) {
                controls.getObject().position.x = -xBoundSecond;
                player.velocityX = 0;
            }
        }
    }
    else {
        controls.getObject().position.z = zBoundSecond;
        player.velocityZ = 0;
        if(x > xBoundSecond) {
            controls.getObject().position.x = xBoundSecond;
            player.velocityX = 0;
        }
        if(x < -xBoundSecond) {
            controls.getObject().position.x = -xBoundSecond;
            player.velocityX = 0;
        }
    }
}

function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    thirdPersonCamera.aspect = canvas.width / canvas.height;
    thirdPersonCamera.updateProjectionMatrix();

    renderer.setSize(canvas.width, canvas.height);
}

function initRenderer() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer( {
        canvas: canvas,
        antialias: true
    } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor("lightblue");
    window.addEventListener("resize", onResize);
}

function initScene() {
    scene = new THREE.Scene();
}

function initCameras() {
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2000);
    camera.position.set(0, 5, 0);
    scene.add(camera);
    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2000);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y + 5, camera.position.z + 5);
    camera.add(thirdPersonCamera);
}

function initControls() {
    let menuBlock = document.getElementById("menu");
    let playButton = document.getElementById("play");

    controls = new THREE.PointerLockControls(camera, canvas);
    scene.add(controls.getObject());

    playButton.addEventListener("click", () => controls.lock());
    controls.addEventListener("lock", lock);
    controls.addEventListener("unlock", unlock);

    function lock() {
        menuBlock.style.display = "none";
    }

    function unlock() {
        menuBlock.style.display = "block";
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    function onKeyDown(event) {
        switch(event.keyCode) {
            case 87:    // W
                player.movingForwards = true;
                break;
            case 65:    // A
                player.movingLeft = true;
                break;
            case 83:    // S
                player.movingBackwards = true;
                break;
            case 68:    // D
                player.movingRight = true;
                break;
            case 32:    // Space
                if(!player.jumping) {
                    player.jumping = true;
                    player.velocityY += 125;
                }
                break;
        }
    }

    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87:    // W
                player.movingForwards = false;
                break;
            case 65:    // A
                player.movingLeft  = false;
                break;
            case 83:    // S
                player.movingBackwards = false;
                break;
            case 68:    // D
                player.movingRight = false;
                break;
        }
    }
}

function initTime() {
    clock = new Clock();
}

function initPlayer() {
    player = new Player("Joax");
}

function initWorld() {
    let ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial( {color: "green"} ));
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);

    let box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshBasicMaterial( {color: "white"} ));
    box.position.set(0, 2.5, -10);
    scene.add(box);

    let linematerial = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    let points = [];
    points.push(new THREE.Vector3(-15, 0, 5));
    points.push(new THREE.Vector3(15, 0, 5));
    points.push(new THREE.Vector3(15, 0, -50));
    points.push(new THREE.Vector3(30, 0, -50));
    points.push(new THREE.Vector3(30, 0, -100));
    points.push(new THREE.Vector3(-30, 0, -100));
    points.push(new THREE.Vector3(-30, 0, -50));
    points.push(new THREE.Vector3(-15, 0, -50));

    let geometry = new THREE.BufferGeometry().setFromPoints(points);

    let boundingBox = new THREE.LineLoop(geometry, linematerial);
    scene.add(boundingBox);

}

function render() {
    renderer.render(scene, camera);
}

function init() {
    initRenderer();
    initScene();
    initCameras();
    initControls();
    initTime();
    initPlayer();
    initWorld();

    gameLoop();
}