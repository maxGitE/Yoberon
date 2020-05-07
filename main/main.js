import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'https://cdn.rawgit.com/mrdoob/stats.js/master/src/Stats.js';

let stats = new Stats();
stats.showPanel(0);

let menuBlock = document.getElementById("menu");
let playButton = document.getElementById("play");
let loading = document.getElementById("loading");

window.onload = menu;
 
/** SCENE GLOBALS */
let canvas;
let renderer;
let scene;
let camera;
let thirdPersonCamera;
let cameraType;
let ambientLight;

/** PLAYER MISC */
let controls;
let clock;
let player;
let currentLevel = 0;

/** LOADERS */
let textureLoader;
let gltfLoader;
let numModels = 0;
let numModelsLoaded = 0;

/** ANIMATION */
let mixer;
let idleCalled = false;

/** SKYBOX TEXTURES */
let skyboxURLs = ["cubemap/space_one/px.png", "cubemap/space_one/nx.png",
                  "cubemap/space_one/py.png", "cubemap/space_one/ny.png", 
                  "cubemap/space_one/pz.png", "cubemap/space_one/nz.png"]

/** OBJECTS */
let starFieldOne;
let starFieldTwo;
let box;

function initTests(gltf) {
    let tree = gltf.scene;
    tree.position.set(-20, -5, 0);
    tree.scale.set(10, 10, 10);
    scene.add(tree);
}

function initPlayerModel(gltf) {
    player.playerModel = gltf.scene; // ** TODO **
    let animations = gltf.animations;
 
    player.playerModel.scale.set(0.5, 0.5, -0.5);
    scene.add(player.playerModel);
    
    mixer = new THREE.AnimationMixer(player.playerModel);

    player.walkAnim = mixer.clipAction(animations[0]);
    player.idleAnim = mixer.clipAction(animations[1]);
    player.backwardsAnim = mixer.clipAction(animations[2]);
    player.runAnim = mixer.clipAction(animations[3]);
    player.jumpAnim = mixer.clipAction(animations[4]);

    player.walkAnim.play();
    player.idleAnim.play();
    player.backwardsAnim.play();
    player.jumpAnim.play();
    player.runAnim.play();

    player.walkAnim.enabled = false;
    player.idleAnim.enabled = true;
    player.backwardsAnim.enabled = false;
    player.jumpAnim.enabled = false;
    player.runAnim.enabled = false;
    
    player.currentAnimation = player.idleAnim;
}

function initTrees(gltf) {
    let tree = gltf.scene;
    let treeGeometry = tree.children[0].geometry;
    let treeMaterial = tree.children[0].material;
    console.log(tree);

    let cluster = new THREE.InstancedMesh(treeGeometry, treeMaterial, 50);

    let temp = new THREE.Object3D();

    for (let i = 0; i < 50; i++) {
        tree.position.set(-20, -5, -i*30);
        tree.scale.set(10, 10, 10);
    
        temp.updateMatrix();
    
        cluster.setMatrixAt(i, temp.matrix);
    }
    scene.add(cluster);
}

function drawGround() {
    let groundGeom = new THREE.PlaneBufferGeometry(200, 1000);
    let groundTexture = loadTexture("textures/texture_grass_seamless.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(2, 10);
    let ground = new THREE.Mesh(groundGeom,
                                    new THREE.MeshLambertMaterial({
                                        color: "#aa3e13", 
                                        side: THREE.DoubleSide,
                                        map: groundTexture
                                    }));
    ground.rotation.x = -Math.PI/2;
    ground.position.z -= 490;
    scene.add(ground);
}

function drawStars() {
    starFieldOne = new Starfield("black");
    starFieldTwo = new Starfield("white");

    scene.add(starFieldOne.starField);
    scene.add(starFieldTwo.starField);
}

function gameLoop() {
    setTimeout( function() {

        requestAnimationFrame(gameLoop);

    }, 1000 / 120);

    if(controls.isLocked) {

        clock.timeNow = performance.now();
        clock.delta = (clock.timeNow - clock.timeBefore) / 1000;

        player.velocityX = player.velocityX - player.velocityX * 10 * clock.delta;
        player.velocityY = player.velocityY - 9.807 * 50 * clock.delta;
        player.velocityZ = player.velocityZ - player.velocityZ * 10 * clock.delta;

        if(player.movingLeft) {
            player.velocityX = player.velocityX - 400 * clock.delta * player.runFactor;
        }
        if(player.movingRight) {
            player.velocityX = player.velocityX + 400 * clock.delta * player.runFactor;
        }
        if(player.movingForward) {
            player.velocityZ = player.velocityZ - 400 * clock.delta * player.runFactor;
        }
        if(player.movingBackward) {
            player.velocityZ = player.velocityZ + 400 * clock.delta * player.runFactor;
        }

        controls.moveRight(player.velocityX * clock.delta);
        controls.moveForward(-player.velocityZ * clock.delta); // Negate the value as moveForward() uses left-handed coordinates
        controls.getObject().position.y += player.velocityY * clock.delta;

        if(controls.getObject().position.y < 8) {
            controls.getObject().position.y = 8;
            player.velocityY = 0;
        }

        player.playerModel.position.x = controls.getObject().position.x;
        player.playerModel.position.z = controls.getObject().position.z;
        player.playerModel.position.y = controls.getObject().position.y - 8;
        if(cameraType == "tp") {
            player.playerModel.visible = true;
            if(controls.getObject().rotation.x * 180 / Math.PI > 12) {
                controls.getObject().rotation.x = 12 * Math.PI / 180;
            }
            else if(controls.getObject().rotation.x * 180 / Math.PI < -28) {
                controls.getObject().rotation.x = -28 * Math.PI / 180;
            }

            controls.getObject().rotation.z = 0;
            controls.getObject().rotation.order = "YXZ";
        }
        else {
            player.playerModel.visible = false;
        }
        player.playerModel.rotation.set(0, controls.getObject().rotation.y, 0);

        boundingBox();

        // Update animations
        if(mixer !== undefined) {
            mixer.update(clock.delta);
        }

        // Update star field colours 
        starFieldOne.updateColour(0.0025);
        starFieldTwo.updateColour(0.005);

        // Update clock time
        clock.timeBefore = clock.timeNow;
    }

    render();
}

function boundingBox() {
    switch(currentLevel) {
        case 0: 
            levelZeroBoundingBox();
            break;
    }
}

/** Handles bound checking for the initial level.
 *  Called by boundingBox() if currentLevel = 0.
 */
function levelZeroBoundingBox() {
    let xPos = controls.getObject().position.x;
    let zPos = controls.getObject().position.z;

    let boxOne;
    let boxTwo;
    let boxThree;
    let boxFour;

    // Boundary values for the respective box divisions
    let boxOneBottom = 10;
    let boxOneTop = -550;
    let boxOneLeft = -20;
    let boxOneRight = -boxOneLeft;

    let boxTwoBottom = -420;
    let boxTwoTop = -450;
    
    let boxThreeBottom = boxTwoBottom;
    let boxThreeTop = -605;
    let boxThreeLeft = 50;
    let boxThreeRight = 80;
    
    let boxFourBottom = -585;
    let boxFourTop = boxThreeTop;

    let xTempleEntrance = 40;
    let boundaryFactor = 5; // Account for skipped frames and fucked behaviour with game loop

    if(xPos >= boxOneLeft && xPos <= boxOneRight) {
        setBox(1);
    }
    else if(xPos > boxOneRight && xPos <= boxThreeLeft && zPos <= boxTwoBottom && zPos >= boxTwoTop) {
        setBox(2);
    }
    else if(xPos > boxThreeLeft && xPos <= boxThreeRight) {
        setBox(3);
    }
    else if(xPos >= xTempleEntrance && xPos <= boxThreeLeft && zPos <= boxFourBottom && zPos >= boxFourTop) {
        setBox(4);
    }

    if(boxOne) {
        if(zPos > boxOneBottom - boundaryFactor) { // Place boundary behind where player spawns
            controls.getObject().position.z = boxOneBottom - boundaryFactor;
        }
        if(zPos < boxOneTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxOneTop + boundaryFactor;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary except where secret entrance is
            if(zPos > boxTwoBottom || zPos < boxTwoTop) {
                controls.getObject().position.x = boxOneRight - boundaryFactor;
            }
        }
    }
    else if(boxTwo) {
        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(zPos < boxTwoTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
    }
    else if(boxThree) {
        if(zPos > boxThreeBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxThreeBottom - boundaryFactor;
        }
        if(zPos < boxThreeTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxThreeTop + boundaryFactor;
        }
        if(zPos < boxTwoTop && zPos > boxFourBottom) { // Place left boundary excluding overlaps on boxTwo and boxFour
            if(xPos < boxThreeLeft + boundaryFactor) {
                controls.getObject().position.x = boxThreeLeft + boundaryFactor;
            }
        }
        if(xPos > boxThreeRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxThreeRight - boundaryFactor;
        }
    }
    else {
        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        if(xPos < xTempleEntrance) { // Enter first temple
            currentLevel = 1;
            // loadFirstLevel();
        }
    }

    function setBox(quadrant) {
        switch(quadrant) {
            case 1:
                boxOne = true;
                boxTwo = false;
                boxThree = false;
                boxFour = false;
                break;
            case 2:
                boxOne = false;
                boxTwo = true;
                boxThree = false;
                boxFour = false;
                break;
            case 3:
                boxOne = false;
                boxTwo = false;
                boxThree = true;
                boxFour = false;
                break;
            case 4:
                boxOne = false;
                boxTwo = false;
                boxThree = false;
                boxFour = true;
                break;
        }
    }

    //boundingBoxVis(boxOneBottom, boxOneRight, boxOneTop, boxTwoBottom, boxTwoTop, xTempleEntrance, boxThreeLeft, boxThreeRight, boxFourBottom, boxFourTop);
}

function boundingBoxVis(boxOneBottom, boxOneRight, boxOneTop, boxTwoBottom, boxTwoTop, xTempleEntrance, boxThreeLeft, boxThreeRight, boxFourBottom, boxFourTop) {
    let linematerial = new THREE.LineBasicMaterial({
        color: 0xffff00
    });

    let points = [];

    points.push(new THREE.Vector3(xTempleEntrance, 0, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, 0, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, 0, boxTwoBottom));

    points.push(new THREE.Vector3(boxOneRight, 0, boxTwoBottom));
    points.push(new THREE.Vector3(boxOneRight, 0, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, 0, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, 0, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, 0, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, 0, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, 0, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, 0, boxFourBottom));
    points.push(new THREE.Vector3(xTempleEntrance, 0, boxFourBottom));

    let geometry = new THREE.BufferGeometry().setFromPoints(points);

    let boundingBox = new THREE.Line(geometry, linematerial);
    scene.add(boundingBox);
}

/** Standalone function to handle the jump animation.
 *  Starts the jump animation, stores the animation that was playing before and stops it.
 *  Starts the previous animation again after running the jump animation for 600ms, unless idle was called while jumping (keyup). 
 */
function handleJumpAnimation() { 
    player.jumpAnim.enabled = true;
    let tempAnimation = player.currentAnimation;
    player.currentAnimation.enabled = false;
    player.currentAnimation = player.jumpAnim;

    setTimeout(function() {
        player.jumping = false;
        if(idleCalled == true) {
            updatePlayerAnimation(player.idleAnim);
            idleCalled = false;
        }
        else {
            if(tempAnimation == player.runAnim && player.movingForward && !player.running) {
                updatePlayerAnimation(player.walkAnim);
            }
            else {
                updatePlayerAnimation(tempAnimation);
            }
        }
    }, 600);
}

/** Takes in the next animation to play. 
 *  If the player is not jumping, stops the current animation and starts the next animation.
 *  If the player is jumping and the next animation is idle, schedule idle to play at the end of the jump. 
 */
function updatePlayerAnimation(newAnimation) { 
    if(cameraType == "fp") return;

    if(!player.jumping) {
        player.currentAnimation.enabled = false;
        newAnimation.enabled = true;
        player.currentAnimation = newAnimation;
    }
    else {
        if(newAnimation == player.idleAnim)
            idleCalled = true;
    }
}

function loadTexture(url) {
    function callback(material) {
        if(material) {
            material.map = texture;
            material.needsUpdate = true;
        }
    }
    let texture = new THREE.TextureLoader().load(url, callback);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max reduction in texture blur at glancing angles
    texture.encoding = THREE.sRGBEncoding;
    return texture;
}

function loadModel(url, key) {
    numModels++;
    function callback(gltf) {
        switch(key) {
            case "player":
                initPlayerModel(gltf);
                break;
            case "tree":
                initTrees(gltf);
                break;
        }
    }
    gltfLoader.load(url, callback, progress, (error) => console.log(error));
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
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2500);
    camera.position.set(0, 8, 0);
    scene.add(camera);

    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 2500);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y - 2, camera.position.z + 26);
    camera.add(thirdPersonCamera);

    cameraType = "fp";
}

function initLights() {
    ambientLight = new THREE.AmbientLight("white", 0.25);
    scene.add(ambientLight);
}

function initControls() {
    controls = new THREE.PointerLockControls(camera, canvas);
    scene.add(controls.getObject());

    document.addEventListener("click", function() {
        controls.lock();
        gameLoop();
    });

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
                player.movingForward = true;
                updatePlayerAnimation(player.walkAnim);
                break;
            case 65:    // A
                if(cameraType == "fp")
                    player.movingLeft = true;
                break;
            case 83:    // S
                player.movingBackward = true;
                updatePlayerAnimation(player.backwardsAnim);
                break;
            case 68:    // D
                if(cameraType == "fp")
                    player.movingRight = true;
                break;
            case 32:    // Space
                if(!player.jumping) {
                    player.jumping = true;
                    player.velocityY += 150;
                    handleJumpAnimation();
                }
                break;
            case 16:    // Shift
                if(!player.running) {
                    player.running = true;
                    if(player.movingForward) {
                        player.runFactor = 1.5;
                        updatePlayerAnimation(player.runAnim);
                    }
                }
                break;
            case 49:    // 1
                cameraType = "fp";
                break;
            case 50:    // 2
                cameraType = "tp";
                if(player.movingForward) {
                    if(player.running) {
                        updatePlayerAnimation(player.runAnim);
                    }
                    else {
                        updatePlayerAnimation(player.walkAnim);
                    }
                }
                if(player.movingBackward) {
                    updatePlayerAnimation(player.walkAnim);
                }
                   
                break;
        }
    }

    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87:    // W
                player.movingForward = false;
                if(!player.movingBackward)
                    updatePlayerAnimation(player.idleAnim);
                break;
            case 65:    // A
                player.movingLeft  = false;
                break;
            case 83:    // S
                player.movingBackward = false;
                if(!player.movingForward)
                    updatePlayerAnimation(player.idleAnim);
                break;
            case 68:    // D
                player.movingRight = false;
                break;
            case 16:    // Shift
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                    if(player.movingForward)
                        updatePlayerAnimation(player.walkAnim);
                }
                break;
        }
    }
}

function initTime() {
    clock = new Clock();
    clock.timeBefore = performance.now();
}

function initSkybox() {
    let material = [];
    for(let i = 0; i < 6; i++) {
        let texture = loadTexture(skyboxURLs[i]);
        material.push(new THREE.MeshBasicMaterial( {
            color: "white",
            side: THREE.DoubleSide,
            map: texture
        } ));
    }
    let cube = new THREE.Mesh(new THREE.BoxGeometry(1500, 1000, 2000), material);
    cube.position.y += 250;
    scene.add(cube);
}

function initLoaders() {
    textureLoader = new THREE.TextureLoader();
    gltfLoader = new GLTFLoader();
}

function initPlayer() {
    player = new Player("Joax");
    loadModel("models/characters/player/playermodel.glb", "player");
}

function initWorld() {
    box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshBasicMaterial( {color: "white"} ));
    box.position.set(0, 2.5, -10);
    scene.add(box);

    loadModel("models/environment/trees/broadleaf.glb", "tree");

    drawGround();
    drawStars();
}

function render() {
    stats.update();

    let cameraToRender = cameraType == "fp" ? camera : thirdPersonCamera;
    renderer.render(scene, cameraToRender);
}

function init() {
    menuBlock.style.display = "none";
    loading.style.display = "block";

    initRenderer();
    initScene();
    initCameras();
    initLights();
    initTime();
    initSkybox();
    initLoaders();
    initPlayer();
    initWorld();
}

function progress(xhr) {
    if((xhr.loaded / xhr.total) == 1) {
        numModelsLoaded++;
    }

    if(numModelsLoaded == numModels) {
        loading.style.display = "none";
        document.body.appendChild(stats.dom);
        initControls();
    }
}

function menu() {
    playButton.addEventListener("click", () => init());
}