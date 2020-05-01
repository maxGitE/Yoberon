window.onload = init;

let canvas;
let renderer;
let scene;
let camera;
let thirdPersonCamera;
let controls;
let clock;
let player;

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

        clock.timeBefore = clock.timeNow;
    }

    render();
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
        player.velocity = [0, 0, 0];
        console.log(player.velocityX, player.velocityY, player.velocityZ);
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