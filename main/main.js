import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'https://cdn.rawgit.com/mrdoob/stats.js/master/src/Stats.js';

let stats = new Stats();
stats.showPanel(0);

const menuBlock = document.getElementById("menu");
const playButton = document.getElementById("play");
const loadingInfo = document.getElementById("loadinginfo");
const loadingSymbol = document.getElementById("loadingsymbol");

window.onload = menu;

/** TEST VARIABLES */
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

/** SCENE GLOBALS */
let canvas;
let renderer;
let scene;
let camera;
let thirdPersonCamera;
let birdsEyeViewCamera;
let cameraType;
let ambientLight;
let pointLight;

/** PLAYER MISC */
let controls;
let clock;
let player;
let currentLevel = 0;

/** ALIEN */
let alien;

/** LOADERS */
let textureLoader;
let gltfLoader;
let loadingManager;
let numModels = 0;
let numModelsLoaded = 0;

/** ANIMATION */
let mixers = [];
let idleCalled = false;

/** SKYBOX TEXTURES */
let skyboxURLs = ["cubemap/space_one/px.png", "cubemap/space_one/nx.png",
                  "cubemap/space_one/py.png", "cubemap/space_one/ny.png", 
                  "cubemap/space_one/pz.png", "cubemap/space_one/nz.png"]

/** OBJECTS */
let starFieldOne;
let starFieldTwo;
let box;

function modelTests(gltf) {
    
}

function initPlayerModel(gltf) {
    player.playerModel = gltf.scene; // ** TODO **
    let animations = gltf.animations;
 
    player.playerModel.scale.set(0.5, 0.5, -0.5);
    scene.add(player.playerModel);
    
    let mixer = new THREE.AnimationMixer(player.playerModel);
    mixers.push(mixer);

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

function initAlienModel(gltf) {
    alien.alienModel = gltf.scene;
    let animations = gltf.animations;

    alien.alienModel.scale.set(5, 5, 5);
    alien.alienModel.position.set(0, 0, -20);
    scene.add(alien.alienModel);

    let mixer = new THREE.AnimationMixer(alien.alienModel);
    mixers.push(mixer);

    alien.idleAnim = mixer.clipAction(animations[0]);
    alien.walkAnim = mixer.clipAction(animations[1]);
    alien.strafeLAnim = mixer.clipAction(animations[2]);
    alien.strafeRAnim = mixer.clipAction(animations[3]);
    alien.walkBackwardsAnim = mixer.clipAction(animations[4]);
    alien.deathAnim = mixer.clipAction(animations[5]);
    alien.shootAnim = mixer.clipAction(animations[6]);

    alien.idleAnim.play();
    alien.walkAnim.play();
    alien.strafeLAnim.play();
    alien.strafeRAnim.play();
    alien.walkBackwardsAnim.play();
    alien.deathAnim.play();
    alien.shootAnim.play();

    alien.idleAnim.enabled = false;
    alien.walkAnim.enabled = false;
    alien.strafeLAnim.enabled = false;
    alien.strafeRAnim.enabled = false;
    alien.walkBackwardsAnim.enabled = false;
    alien.deathAnim.enabled = false;
    alien.shootAnim.enabled = true;
}

function initPineTree(gltf) {
    let pinetree = gltf.scene;
    let treeGeometry = pinetree.children[0].geometry;
    let treeMaterial = pinetree.children[0].material;

    let cluster = new THREE.InstancedMesh(treeGeometry, treeMaterial, 550);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 550; i++) {
        if(i < 180) { // Left rows
            if(i < 60) { // First row
                clusterX = Math.random() * 10 - 55; // x positions between -45 and -55
            }
            else if(i >= 60 && i < 120) { // Second row
                clusterX = Math.random() * 10 - 75; // x positions between -65 and -75
            }
            else { // Third row
                clusterX = Math.random() * 10 - 95; // x positions between -85 and -95
            }
            clusterZ = Math.random() * 600 - 550; // z positions between 50 and -550  
        }
        else if(i >= 180 && i < 220) { // Back rows
            if(i < 190) { // First row
                clusterZ = Math.random() * 10 + 40; // z positions between 40 and 50
            }
            else if(i >= 190 && i < 200) { // Second row
                clusterZ = Math.random() * 10 + 60; // z positions between 60 and 70
            }
            else if(i >= 200 && i < 210){ // Third row
                clusterZ = Math.random() * 10 + 80; // z positions between 80 and 90
            }
            else { // Fourth row
                clusterZ = Math.random() * 10 + 90; // z positions between 90 and 100
            }
            clusterX = Math.random() * 130 - 65; // x positions between -65 and 65  
        }
        else if(i >= 220 && i < 340) { // First right rows
            if(i < 260) { // First row
                clusterX = Math.random() * 10 + 45; // x positions between 45 and 55
            }
            else if(i >= 260 && i < 300) { // Second row
                clusterX = Math.random() * 10 + 65; // x positions between 65 and 75
            }
            else { // Third row
                clusterX = Math.random() * 10 + 85; // x positions between 85 and 95
            }
            clusterZ = Math.random() * 460 - 410; // z positions between 50 and -410
        }
        else if(i >= 340 && i < 430) {
            if(i < 370) { // First row
                clusterX = Math.random() * 10 + 105; // x positions between 105 and 115
            }
            else if(i >= 370 && i < 400) { // Second row
                clusterX = Math.random() * 10 + 125; // x positions between 125 and 135
            }
            else { // Third row
                clusterX = Math.random() * 10 + 145; // x positions between 145 and 155
            }
            clusterZ = Math.random() * 300 - 650; // z positions between -350 and -650 
        }
        else if(i >= 430 && i < 520) {
            if(i < 460) { // First row
                clusterZ = Math.random() * 10 - 645; // z positions between -635 and -645
            }
            else if(i >= 460 && i < 490) { // Second row
                clusterZ = Math.random() * 10 - 675; // z positions between -665 and -675
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 705; // z positions between -695 and -705
            }
            clusterX = Math.random() * 65 + 40; // x positions between 40 and 105
        }
        else if(i >= 520 && i < 550) {
            if(i < 550) { // First row
                clusterX = Math.random() * 10 + 30; // x positions between 30 and 40
            }
            clusterZ = Math.random() * 115 - 585; // z positions between -470 and -585
        }

        let scalingFactor = Math.random() * 0.3 + 0.7;
        let rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.position.set(clusterX, -8, clusterZ);
        tempCluster.rotation.set(0, rotationFactor, 0);
    
        tempCluster.updateMatrix();
    
        cluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(cluster);
}

function initBroadLeaf(gltf) {
    /* let broadleaf = gltf.scene;

    let shellBarkGeometry = broadleaf.children[0].children[0].geometry;
    let shellBarkMaterial = broadleaf.children[0].children[0].material;

    let branchGeometry = broadleaf.children[0].children[1].geometry;
    let branchMaterial = broadleaf.children[0].children[1].material;

    let leafGeometry = broadleaf.children[0].children[2].geometry;
    let leafMaterial = broadleaf.children[0].children[2].material;

    let barkGeometry = broadleaf.children[0].children[3].geometry;
    let barkMaterial = broadleaf.children[0].children[3].material;

    let shellCluster = new THREE.InstancedMesh(shellBarkGeometry, shellBarkMaterial, 4);
    let branchCluster = new THREE.InstancedMesh(branchGeometry, branchMaterial, 4);
    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 4);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 4);

    let tempCluster = new THREE.Object3D();

    for(let i = 0; i < 4; i++) {
        tempCluster.scale.set(50, 50, 50);
        tempCluster.position.set(0, 0, -10);

        tempCluster.updateMatrix();
        
        shellCluster.setMatrixAt(i, tempCluster.matrix);
        branchCluster.setMatrixAt(i, tempCluster.matrix);
        leafCluster.setMatrixAt(i, tempCluster.matrix);
        barkCluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(shellCluster);
    scene.add(branchCluster);
    scene.add(leafCluster);
    scene.add(barkCluster); */

    let broadLeafGroup = new THREE.Object3D();

    let broadleaf_one = gltf.scene;
    let broadleaf_two = broadleaf_one.clone();
    let broadleaf_three = broadleaf_one.clone();
    let broadleaf_four = broadleaf_one.clone();

    broadleaf_one.scale.set(50, 50, 50);
    broadleaf_two.scale.set(50, 50, 50);
    broadleaf_three.scale.set(80, 80, 80);
    broadleaf_four.scale.set(60, 60, 60);

    broadleaf_one.position.set(-100, 0, -50);
    broadleaf_two.position.set(100, 0, -300);
    broadleaf_three.position.set(120, 0, 100);
    broadleaf_four.position.set(-120, 0, -600);
    
    broadLeafGroup.add(broadleaf_one);
    broadLeafGroup.add(broadleaf_two);
    broadLeafGroup.add(broadleaf_three);
    broadLeafGroup.add(broadleaf_four);

    scene.add(broadLeafGroup);
}

function initRockOne(gltf) {
   
}

function initRockTwo(gltf) {
   
}

function initRockThree(gltf) {

}

function drawTrees() {
    loadModel("models/environment/trees/pinetree.glb", "pinetree");
    loadModel("models/environment/trees/broadleaf.glb", "broadleaf");
}

function initBushOne(gltf) {
    let bush = gltf.scene;
    let leafGeometry = bush.children[0].children[0].geometry;
    let leafMaterial = bush.children[0].children[0].material;

    let barkGeometry = bush.children[0].children[1].geometry;
    let barkMaterial = bush.children[0].children[1].material;

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 45);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 45);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 45; i++) {
        if(i < 20) { // Left row
            clusterX = Math.random() * 10 - 35; // x positions between -25 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 20 && i < 40) { // Right row
            clusterX = Math.random() * 10 + 25; // x positions between 25 and 35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 40 && i < 45) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        let scalingFactor = Math.random() * 0.02 + 0.08; // set scale to between 0.08 and 0.1
        let rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.position.set(clusterX, -4, clusterZ);
        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(Math.PI/2, rotationFactor, 0);

        tempCluster.updateMatrix();

        leafCluster.setMatrixAt(i, tempCluster.matrix);             
        barkCluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(leafCluster);
    scene.add(barkCluster);
}

function initBushTwo(gltf) {
    let bush = gltf.scene;
    let leafGeometry = bush.children[0].children[0].geometry;
    let leafMaterial = bush.children[0].children[0].material;

    let barkGeometry = bush.children[0].children[1].geometry;
    let barkMaterial = bush.children[0].children[1].material;

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 105);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 105);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 105; i++) {
        if(i < 50) { // Left row
            clusterX = Math.random() * 10 - 35; // x positions between -25 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 50 && i < 100) { // Right row
            clusterX = Math.random() * 10 + 25; // x positions between 25 and 35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 100 && i < 105) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        let scalingFactor = Math.random() * 1 + 1; // set scale to between 1 and 2
        let rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.position.set(clusterX, 0, clusterZ);
        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);

        tempCluster.updateMatrix();

        leafCluster.setMatrixAt(i, tempCluster.matrix);             
        barkCluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(leafCluster);
    scene.add(barkCluster);
}

function initBushThree(gltf) {
    let bush = gltf.scene;
    let barkGeometry = bush.children[0].children[0].geometry;
    let barkMaterial = bush.children[0].children[0].material;

    let capGeometry = bush.children[0].children[1].geometry;
    let capMaterial = bush.children[0].children[1].material;

    let leafGeometry = bush.children[0].children[2].geometry;
    let leafMaterial = bush.children[0].children[2].material;

    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 105);
    let capCluster = new THREE.InstancedMesh(capGeometry, capMaterial, 105);
    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 105);    
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 105; i++) {
        if(i < 50) { // Left row
            clusterX = Math.random() * 10 - 35; // x positions between -25 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 50 && i < 100) { // Right row
            clusterX = Math.random() * 10 + 25; // x positions between 25 and 35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 100 && i < 105) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        let scalingFactor = Math.random() * 1 + 2; // set scale to between 2 and 3
        let rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.position.set(clusterX, 0, clusterZ);
        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);

        tempCluster.updateMatrix();

        barkCluster.setMatrixAt(i, tempCluster.matrix);
        capCluster.setMatrixAt(i, tempCluster.matrix);
        leafCluster.setMatrixAt(i, tempCluster.matrix);             
    }
    scene.add(barkCluster);
    scene.add(capCluster);
    scene.add(leafCluster);
}

function drawBushes() {
    loadModel("models/environment/bushes/bush_one.glb", "bush_one");
    loadModel("models/environment/bushes/bush_two.glb", "bush_two");
    loadModel("models/environment/bushes/bush_three.glb", "bush_three");
}

function drawGround() {
    let pathGeom = new THREE.PlaneBufferGeometry(100, 250, 100, 100);
    let pathTexture = loadTexture("textures/texture_grass_dead.jpg");
    pathTexture.wrapS = THREE.RepeatWrapping;
    pathTexture.wrapT = THREE.RepeatWrapping;
    pathTexture.repeat.set(10, 25);
    let path = new THREE.Mesh(pathGeom,
                                    new THREE.MeshLambertMaterial({
                                        color: "#454545",
                                        side: THREE.DoubleSide,
                                        map: pathTexture
                                    }));
    path.rotation.x = -Math.PI/2;
    path.position.set(70, 0.01, -545);
    scene.add(path);

    let groundGeom = new THREE.PlaneBufferGeometry(400, 1000, 100, 100);
    let groundTexture = loadTexture("textures/texture_path_outline.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(40, 100);
    let ground = new THREE.Mesh(groundGeom,
                                    new THREE.MeshLambertMaterial({
                                        color: "#5e503e",
                                        side: THREE.DoubleSide,
                                        map: groundTexture
                                    }));
    ground.rotation.x = -Math.PI/2;
    ground.position.set(0, 0, -350);
    scene.add(ground);
}

function drawRocks() {
    loadModel("models/environment/rocks/type_one/rock_one.glb", "rock_one");
}

function drawStars() {
    starFieldOne = new Starfield("black");
    starFieldTwo = new Starfield("white");

    scene.add(starFieldOne.starField);
    scene.add(starFieldTwo.starField);
}

function gameLoop() {

    // setTimeout( function() {

    //     requestAnimationFrame(gameLoop);

    // }, 1000 / 180);

    requestAnimationFrame(gameLoop);

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
        for (let i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.delta);            
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

    // // Boundary values for the respective box divisions
    // let boxOneBottom = 10;
    // let boxOneTop = -550;
    // let boxOneLeft = -20;
    // let boxOneRight = -boxOneLeft;

    // let boxTwoBottom = -420;
    // let boxTwoTop = -450;
    
    // let boxThreeBottom = boxTwoBottom;
    // let boxThreeTop = -605;
    // let boxThreeLeft = 50;
    // let boxThreeRight = 80;
    
    // let boxFourBottom = -585;
    // let boxFourTop = boxThreeTop;

    // let xTempleEntrance = 40;
    // let boundaryFactor = 5; // Account for skipped frames and fucked behaviour with game loop

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

    points.push(new THREE.Vector3(xTempleEntrance, .1, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, .1, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, .1, boxTwoBottom));

    points.push(new THREE.Vector3(boxOneRight, .1, boxTwoBottom));
    points.push(new THREE.Vector3(boxOneRight, .1, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, .1, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, .1, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, .1, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, .1, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, .1, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, .1, boxFourBottom));
    points.push(new THREE.Vector3(xTempleEntrance, .1, boxFourBottom));

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
    function callback(gltf) {
        switch(key) {
            case "player":
                initPlayerModel(gltf);
                break;
            case "alien":
                initAlienModel(gltf);
                break;
            case "pinetree":
                initPineTree(gltf);
                break;
            case "broadleaf":
                initBroadLeaf(gltf);
                break;
            case "rock_one":
                initRockOne(gltf);
                break;
            case "rock_two":
                initRockTwo(gltf);
                break;
            case "rock_three":
                initRockThree(gltf);
                break;
            case "bush_one":
                initBushOne(gltf);
                break;
            case "bush_two":
                initBushTwo(gltf);
                break;
            case "bush_three":
                initBushThree(gltf);
                break;
        }
    }
    gltfLoader.load(url, callback, undefined, (error) => console.log(error));
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
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    camera.position.set(0, 8, 0);
    scene.add(camera);

    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y - 2, camera.position.z + 26);
    camera.add(thirdPersonCamera);

    cameraType = "fp";

    birdsEyeViewCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    birdsEyeViewCamera.position.set(-100, 300, 100);
    birdsEyeViewCamera.lookAt(0, 0, 0);
    scene.add(birdsEyeViewCamera);
}

function initLights() {
    ambientLight = new THREE.AmbientLight("white", 0.15);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight("white", 1.5);
    pointLight.distance = 50;
    camera.add(pointLight);
    camera.children[1].position.y = 5; // Lower the point light from 8 to 5
}

function initControls() {
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    document.addEventListener("click", () => controls.lock());

    controls.addEventListener("lock", lock);
    controls.addEventListener("unlock", unlock);

    function lock() {
        controls.connect();
        menuBlock.style.display = "none";
    }

    function unlock() {
        controls.isLocked = false;
        controls.disconnect();
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
            case 51:    // 3
                cameraType = "bev"; break;
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

function initLoadingManager() {
    loadingManager = new THREE.LoadingManager(onLoad, onProgress);

    function onLoad() {
        loadingInfo.style.display = "none";
        loadingSymbol.style.display = "none";
        document.body.appendChild(stats.dom);
        initControls();
        gameLoop();
    }

    function onProgress(url, itemsLoaded, itemsTotal) {
        loadingInfo.innerHTML = "Loading file: " + url + " " + itemsLoaded + " of " + itemsTotal;
    }
}

function initLoaders() {
    textureLoader = new THREE.TextureLoader(loadingManager);
    gltfLoader = new GLTFLoader(loadingManager);
}

function initPlayer() {
    player = new Player("Joax");
    loadModel("models/characters/player/playermodel.glb", "player");
}

function initAlien() {
    alien = new Alien();
    //loadModel("models/characters/enemy/alien.glb", "alien");
}

function initWorld() {
    box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), new THREE.MeshBasicMaterial( {color: "white"} ));
    box.position.set(0, 2.5, -10);
    scene.add(box);

    drawTrees();
    drawBushes();
    drawGround();
    drawRocks();
    drawStars();

    boundingBoxVis(boxOneBottom, boxOneRight, boxOneTop, boxTwoBottom, boxTwoTop, xTempleEntrance, boxThreeLeft, boxThreeRight, boxFourBottom, boxFourTop);
}

function render() {
    stats.update();

    //let cameraToRender = cameraType == "fp" ? camera : thirdPersonCamera;
    switch(cameraType) {
        case "fp": renderer.render(scene, camera); break;
        case "tp": renderer.render(scene, thirdPersonCamera); break;
        case "bev": renderer.render(scene, birdsEyeViewCamera); break;
    }
    //renderer.render(scene, cameraToRender);
}

function init() {
    menuBlock.style.display = "none";
    loadingSymbol.style.display = "block";

    initRenderer();
    initScene();
    initCameras();
    initLights();
    initTime();
    initSkybox();
    initLoadingManager();
    initLoaders();
    initPlayer();
    initAlien();
    initWorld();
}

function menu() {
    playButton.addEventListener("click", () => init());
}