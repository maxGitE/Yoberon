import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from 'https://threejs.org/examples/jsm/utils/SkeletonUtils.js';
import Stats from 'https://cdn.rawgit.com/mrdoob/stats.js/master/src/Stats.js';

let stats = new Stats();
stats.showPanel(0);

let rendererStats = new THREEx.RendererStats();
rendererStats.domElement.style.position	= 'fixed'
rendererStats.domElement.style.right = '0px'
rendererStats.domElement.style.bottom = '0px'
document.body.appendChild(rendererStats.domElement);

const title = document.getElementById("title");
const menuBlock = document.getElementById("menu");
const pauseBlock = document.getElementById("pause");
const resume = document.getElementById("resume");
const controlspause = document.getElementById("controlspause");
const crosshair = document.getElementById("crosshair");
const weaponCooldownBar = document.getElementById("weaponcooldown");
const playButton = document.getElementById("play");
const loadingInfo = document.getElementById("loadinginfo");
const loadingSymbol = document.getElementById("loadingsymbol");

window.onload = menu;

/** TEST VARIABLES */
// Boundary values for the respective box divisions
let boxOneBottom = 30;
let boxOneTop = -550;
let boxOneLeft = -40;
let boxOneRight = -boxOneLeft;

let boxTwoBottom = -420;
let boxTwoTop = -450;

let boxThreeBottom = boxTwoBottom;
let boxThreeTop = -615;
let boxThreeLeft = 60;
let boxThreeRight = 130;

let boxFourBottom = -585;
let boxFourTop = boxThreeTop;

let xTempleEntrance = 60;
let boundaryFactor = 5; // Account for skipped frames and fucked behaviour with game loop

/** SCENE GLOBALS */
let canvas;
let renderer;
let scene;

/** CAMERAS */
let camera;
let thirdPersonCamera;
let birdsEyeViewCamera;
let cameraType;

/** LIGHTS */
let ambientLight;
let pointLight;

/** AUDIO */
let listener;
let audioCollection;
let menuAudioSource; // Buffer source for the menu audio

/** PLAYER MISC */
let controls;
let clock;
let player;
let currentLevel = 0;

/** ALIEN */
let alien;

/** BOUNTY HUNTER */
let bountyHunter1;
let bountyHunter2;
let bountyHunter3;

/** LOADERS */
let textureLoader;
let gltfLoader;
let audioLoader;
let loadingManager;

/** ANIMATION */
let mixers = [];
let idleCalled = false;

/** SKYBOX TEXTURES */
let skyboxURLs = ["cubemap/space_one/px.png", "cubemap/space_one/nx.png",
                  "cubemap/space_one/py.png", "cubemap/space_one/ny.png", 
                  "cubemap/space_one/pz.png", "cubemap/space_one/nz.png"]

/** OBJECTS */
let starFieldA;
let starFieldB;
let box;

let lockingClick = true;
let collidableMeshList = [];

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
        starFieldA.updateColour(0.0035);
        starFieldB.updateColour(0.0075);

        // console.clear();
        // console.log(camera.position.x, camera.position.y, camera.position.z); // save two previous positions?

        updateBullets();

        // Update clock time
        clock.timeBefore = clock.timeNow;
    }

    render();
}

function loadFirstLevel() {
    let direction = new THREE.Vector3();
    controls.getDirection(direction);
    let playerRaycaster = new THREE.Raycaster(controls.getObject().position, direction);
    scene.add(new THREE.ArrowHelper(playerRaycaster.ray.direction, playerRaycaster.ray.origin, 10));

}

function initPlayerModel(gltf) {
    player.playerModel = gltf.scene; // ** TODO **
    let animations = gltf.animations;
 
    player.playerModel.scale.set(-0.5, 0.5, -0.5);
    scene.add(player.playerModel);
    
    let mixer = new THREE.AnimationMixer(player.playerModel);
    mixers.push(mixer);

    /** Animations without gun */
    // player.walkAnim = mixer.clipAction(animations[0]);
    // player.idleAnim = mixer.clipAction(animations[1]);
    // player.backwardsAnim = mixer.clipAction(animations[2]);
    // player.runAnim = mixer.clipAction(animations[3]);
    // player.jumpAnim = mixer.clipAction(animations[4]);

    /** Animations with gun */    
    player.shootAnim = mixer.clipAction(animations[0]);    
    player.walkAnim = mixer.clipAction(animations[1]);
    player.runAnim = mixer.clipAction(animations[2]);
    player.backwardsAnim = mixer.clipAction(animations[3]);
    player.strafeLAnim = mixer.clipAction(animations[4]);
    player.strafeRAnim = mixer.clipAction(animations[5]);
    player.idleAnim = mixer.clipAction(animations[6]);
    player.jumpAnim = mixer.clipAction(animations[7]);

    player.walkAnim.play();
    player.idleAnim.play();
    player.backwardsAnim.play();
    player.jumpAnim.play();
    player.runAnim.play();
    player.shootAnim.play();
    player.strafeLAnim.play();
    player.strafeRAnim.play();

    player.walkAnim.enabled = false;
    player.idleAnim.enabled = true;
    player.backwardsAnim.enabled = false;
    player.jumpAnim.enabled = false;
    player.runAnim.enabled = false;
    player.shootAnim.enabled = false;
    player.strafeLAnim.enabled = false;
    player.strafeRAnim.enabled = false;
    
    player.currentAnimation = player.idleAnim;
}

function initAlienModel(gltf) {
    alien.alienModel = gltf.scene;
    let animations = gltf.animations;

    alien.alienModel.scale.set(5, 5, 5);
    alien.alienModel.position.set(0, 0, -20);

    scene.add(alien.alienModel);

    alien.hitbox = new Hitbox("alien");
    alien.alienModel.add(alien.hitbox.mesh);
    alien.alienModel.name = "alien";

    collidableMeshList.push(alien.hitbox.mesh);

    let mixer = new THREE.AnimationMixer(alien.alienModel);
    mixers.push(mixer);

    alien.idleAnim = mixer.clipAction(animations[0]);
    alien.walkAnim = mixer.clipAction(animations[1]);
    alien.strafeLAnim = mixer.clipAction(animations[2]);
    alien.strafeRAnim = mixer.clipAction(animations[3]);
    alien.walkBackwardsAnim = mixer.clipAction(animations[4]);
    alien.deathAnim = mixer.clipAction(animations[5]);
    alien.shootAnim = mixer.clipAction(animations[6]);

    alien.deathAnim.setLoop(THREE.LoopOnce);
    alien.deathAnim.clampWhenFinished = true;

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

function initBountyHunters(gltf) {
    let bountyArray = [];

    bountyHunter1 = new BountyHunter();
    bountyHunter1.model = gltf.scene;
    bountyHunter1.animations = gltf.animations;
    bountyHunter1.setPosition(-10, 0, -15);
    bountyHunter1.setRotation(0, Math.PI, 0);
    bountyHunter1.defaultAnim = "Side";
    bountyArray.push(bountyHunter1);

    bountyHunter2 = new BountyHunter();
    bountyHunter2.setPosition(5, 0, -30);
    bountyHunter2.defaultAnim = "Up";
    bountyArray.push(bountyHunter2);

    bountyHunter3 = new BountyHunter();
    bountyHunter3.setPosition(10, 0, -20);
    bountyHunter3.defaultAnim = "Down";
    bountyArray.push(bountyHunter3);
    
    instantiateUnits(bountyArray, "vanguard_Mesh");
}

/**
 * Clone a mesh object and apply all relevant transformations.
 * Populate all animation fields for the mesh and start the default animation.
 * @param {array} units Array containing meshes to clone
 * @param {string} meshName Name of the mesh to animate
 */
function instantiateUnits(units, meshName) {
    for (let i = 0; i < units.length; i++) {        
        let clonedScene = SkeletonUtils.clone(units[0].model);

        if(clonedScene) { // THREE.Scene is cloned properly
            let clonedMesh = clonedScene.getObjectByName(meshName);

            let mixer = new THREE.AnimationMixer(clonedMesh);

            /** Populate all animation fields for the relevant mesh */
            if(meshName == "vanguard_Mesh") {
                units[i].sideAnim = mixer.clipAction(units[0].animations[0]);
                units[i].upAnim = mixer.clipAction(units[0].animations[1]);
                units[i].downAnim = mixer.clipAction(units[0].animations[2]);

                units[i].sideAnim.play();
                units[i].upAnim.play();
                units[i].downAnim.play();

                units[i].sideAnim.enabled = false;
                units[i].upAnim.enabled = false;
                units[i].downAnim.enabled = false;
            }

            /** Play default animation */
            let clip = THREE.AnimationClip.findByName(units[0].animations, units[i].defaultAnim);

            if(clip) {
                let action = mixer.clipAction(clip);
                action.enabled = true;
            }
            
            mixers.push(mixer);            

            scene.add(clonedScene); // Add cloned scene to the world scene
            
            /** Apply transformations to the cloned scene */
            clonedScene.position.set(units[i].getPosition().x, units[i].getPosition().y, units[i].getPosition().z);

            clonedScene.scale.set(units[i].getScale().x, units[i].getScale().y, units[i].getScale().z);

            clonedScene.rotation.x = units[i].getRotation().x;
            clonedScene.rotation.y = units[i].getRotation().y;
            clonedScene.rotation.z = units[i].getRotation().z;
        }
    }
}

function initPineTree(gltf) {
    let pinetree = gltf.scene;
    let treeGeometry = pinetree.children[0].geometry;
    let treeMaterial = pinetree.children[0].material;

    let cluster = new THREE.InstancedMesh(treeGeometry, treeMaterial, 552);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < 552; i++) {
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
            clusterZ = Math.random() * 450 - 400; // z positions between 50 and -400
        }
        else if(i >= 340 && i < 430) { // Secret path right
            if(i < 370) { // First row
                clusterX = Math.random() * 10 + 135; // x positions between 135 and 145
            }
            else if(i >= 370 && i < 400) { // Second row
                clusterX = Math.random() * 10 + 155; // x positions between 155 and 165
            }
            else { // Third row
                clusterX = Math.random() * 10 + 185; // x positions between 175 and 185
            }
            clusterZ = Math.random() * 300 - 650; // z positions between -350 and -650 
        }
        else if(i >= 430 && i < 520) { // Secret path top
            if(i < 460) { // First row
                clusterZ = Math.random() * 10 - 645; // z positions between -635 and -645
            }
            else if(i >= 460 && i < 490) { // Second row
                clusterZ = Math.random() * 10 - 675; // z positions between -665 and -675
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 705; // z positions between -695 and -705
            }
            clusterX = Math.random() * 90 + 40; // x positions between 40 and 130
        }
        else if(i >= 520 && i < 550) { // Secret path left
            if(i < 550) { // First row
                clusterX = Math.random() * 5 + 45; // x positions between 40 and 45
            }
            clusterZ = Math.random() * 105 - 575; // z positions between -470 and -575
        }
        else if(i == 550) { // Left side of secret path entrance
            clusterX = 50;
            clusterZ = -400;
        }
        else if(i == 551) { // Right side of secret path entrance
            clusterX = 50;
            clusterZ = -470;
        }

        scalingFactor = Math.random() * 0.3 + 0.7;
        rotationFactor = Math.random() * 2*Math.PI; // Set rotation to between 0 and 2*PI

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);
        tempCluster.position.set(clusterX, -8, clusterZ);
        
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
    let rock_three = gltf.scene;
    let rock_threeGeometry = rock_three.children[0].geometry;
    let rock_threeMaterial = rock_three.children[0].material;
    let numInstances = 100;

    let cluster = new THREE.InstancedMesh(rock_threeGeometry, rock_threeMaterial, numInstances);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < numInstances; i++) {
        clusterX = Math.random() * 400 - 200;
        clusterZ = Math.random() * 800 - 700;
        scalingFactor = Math.random() * 0.15 + 0.1;
        rotationFactor = Math.random() * 2*Math.PI; // Set rotation between 0 and 2*PI

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);
        tempCluster.position.set(clusterX, 0, clusterZ);

        tempCluster.updateMatrix();
        cluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(cluster);
}

function initRockFour(gltf) {
    let rock_four = gltf.scene;
    let rock_fourGeometry = rock_four.children[0].geometry;
    let rock_fourMaterial = rock_four.children[0].material;
    let numInstances = 500;

    let cluster = new THREE.InstancedMesh(rock_fourGeometry, rock_fourMaterial, numInstances);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < numInstances; i++) {
        clusterX = Math.random() * 400 - 200; // x positions between -200 and 200
        clusterZ = Math.random() * 800 - 700; // z positions between 100 and -700
        scalingFactor = Math.random() * 0.0075 + 0.0025;
        rotationFactor = Math.random() * 2*Math.PI; // Set rotation between 0 and 2*PI

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);
        tempCluster.position.set(clusterX, 0, clusterZ);

        tempCluster.updateMatrix();
        cluster.setMatrixAt(i, tempCluster.matrix);
    }
    scene.add(cluster);
}

function initBushOne(gltf) {
    let bush = gltf.scene;
    let leafGeometry = bush.children[0].children[0].geometry;
    let leafMaterial = bush.children[0].children[0].material;

    let barkGeometry = bush.children[0].children[1].geometry;
    let barkMaterial = bush.children[0].children[1].material;

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 45);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 55);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < 45; i++) {
        if(i < 20) { // Left row
            clusterX = Math.random() * 15 - 35; // x positions between -20 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 20 && i < 40) { // Right row
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 440 - 410; // z positions between 30 and -410
        }
        else if(i >= 40 && i < 45) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        scalingFactor = Math.random() * 0.02 + 0.08; // set scale to between 0.08 and 0.1
        rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.position.set(clusterX, -3, clusterZ);
        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(Math.PI/3, rotationFactor, 0);

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

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 280);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 280);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 280; i++) {
        if(i < 60) { // Left row
            clusterX = Math.random() * 15 - 35; // x positions between -20 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 60 && i < 120) { // Right row before secret path
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 450 - 420; // z positions between 30 and -420
        }
        else if(i >= 120 && i < 140) { // Right row after secret path
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 100 - 550; // z positions between -450 and -550
        }
        else if(i >= 140 && i < 145) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        else if(i >= 145 && i < 150) { // Secret path 
            clusterX = Math.random() * 15 + 35; // x positions between 35 and 50
            clusterZ = Math.random() * 30 - 450; // z positions between -420 and -450
        }
        else if(i >= 150 && i < 170) { // Secret path bottom
            clusterX = Math.random() * 80 + 50; // x positions between 50 and 130
            clusterZ = Math.random() * 15 - 425; // z positions between -410 and -425
        }
        else if(i >= 170 && i < 220) { // Secret path right
            clusterX = Math.random() * 10 + 120; // x positions between 120 and 130
            clusterZ = Math.random() * 195 - 615; // z positions between -420 and -615
        }
        else if(i >= 220 && i < 240) { // Secret path top
            clusterX = Math.random() * 80 + 50; // x positions between 50 and 130
            clusterZ = Math.random() * 15 - 620; // z positions between -605 and -620
        }
        else if(i >= 240 && i < 280) { // Secret path left
            clusterX = Math.random() * 10 + 60; // x positions between 60 and 70
            clusterZ = Math.random() * 130 - 580; // z positions between -450 and -580
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
    let leafGeometry = bush.children[0].children[2].geometry;
    let leafMaterial = bush.children[0].children[2].material;

    let barkGeometry = bush.children[0].children[0].geometry;
    let barkMaterial = bush.children[0].children[0].material;

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, 280);  
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, 280);  
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    for(let i = 0; i < 280; i++) {
        if(i < 60) { // Left row
            clusterX = Math.random() * 15 - 35; // x positions between -20 and -35
            clusterZ = Math.random() * 570 - 550; // z positions between 30 and -550
        }
        else if(i >= 60 && i < 120) { // Right row before secret path
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 450 - 420; // z positions between 30 and -420
        }
        else if(i >= 120 && i < 140) { // Right row after secret path
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 100 - 550; // z positions between -450 and -550
        }
        else if(i >= 140 && i < 145) { // Back row
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 + 15; // z positions between 15 and 30
        }
        else if(i >= 145 && i < 150) { // Secret path 
            clusterX = Math.random() * 15 + 35; // x positions between 35 and 50
            clusterZ = Math.random() * 30 - 450; // z positions between -420 and -450
        }
        else if(i >= 150 && i < 170) { // Secret path bottom
            clusterX = Math.random() * 80 + 50; // x positions between 50 and 130
            clusterZ = Math.random() * 15 - 425; // z positions between -410 and -425
        }
        else if(i >= 170 && i < 220) { // Secret path right
            clusterX = Math.random() * 10 + 120; // x positions between 120 and 130
            clusterZ = Math.random() * 195 - 615; // z positions between -420 and -615
        }
        else if(i >= 220 && i < 240) { // Secret path top
            clusterX = Math.random() * 80 + 50; // x positions between 50 and 130
            clusterZ = Math.random() * 15 - 620; // z positions between -605 and -620
        }
        else if(i >= 240 && i < 280) { // Secret path left
            clusterX = Math.random() * 10 + 60; // x positions between 60 and 70
            clusterZ = Math.random() * 130 - 580; // z positions between -450 and -580
        }
        
        let scalingFactor = Math.random() * 1 + 2; // set scale to between 2 and 3
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

function drawTrees() {
    loadModel("models/environment/trees/pinetree.glb", "pinetree");
    loadModel("models/environment/trees/broadleaf.glb", "broadleaf");
}

function drawBushes() {
    loadModel("models/environment/bushes/bush_one.glb", "bush_one");
    loadModel("models/environment/bushes/bush_two.glb", "bush_two");
    loadModel("models/environment/bushes/bush_three.glb", "bush_three");
}

function drawGround() {
    /** Texture for the secret path */
    let pathGeom = new THREE.PlaneBufferGeometry(90, 250, 100, 100);
    let pathTexture = loadTexture("textures/texture_grass_dead.jpg");
    pathTexture.wrapS = THREE.RepeatWrapping;
    pathTexture.wrapT = THREE.RepeatWrapping;
    pathTexture.repeat.set(9, 25);
    let path = new THREE.Mesh(pathGeom,
                                    new THREE.MeshLambertMaterial({
                                        color: "#454545",
                                        side: THREE.DoubleSide,
                                        map: pathTexture
                                    }));
    path.rotation.x = -Math.PI/2;
    path.position.set(85, 0.01, -545);
    scene.add(path);

    /** Texture for general path */
    let groundGeom = new THREE.PlaneBufferGeometry(1000, 1000, 100, 100);
    let groundTexture = loadTexture("textures/texture_path_outline.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(70, 70);
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
    loadModel("models/environment/rocks/rock_three.glb", "rock_three")
    loadModel("models/environment/rocks/rock_four.glb", "rock_four");
}

function drawStars() {
    starFieldA = new Starfield("black");
    starFieldB = new Starfield("white");

    scene.add(starFieldA.starField);
    scene.add(starFieldB.starField);
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
            loadFirstLevel();
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

    // boundingBoxVis(boxOneBottom, boxOneRight, boxOneTop, boxTwoBottom, boxTwoTop, xTempleEntrance, boxThreeLeft, boxThreeRight, boxFourBottom, boxFourTop);
}

function updateBullets() {
    if(player.weapon.bullets.length > 5) {
        scene.remove(player.weapon.bullets[0].bullet);
        player.weapon.bullets.shift();
    }
    
    player.weapon.bullets.forEach((item, index) => {

        if(item.originalPosition.distanceTo(item.bullet.position) > 200) { // Restrict the bullet from travelling past 100 units
            scene.remove(item.bullet); // Remove the bullet from the scene
            player.weapon.bullets.splice(index, 1); // Remove the bullet from the array
            return; // Iterate to the next bullet
        }

        item.bullet.translateZ(-300 * clock.delta);
        item.bullet.getWorldPosition(item.raycaster.ray.origin); // Update the ray's new origin as the bullet's current position
        // console.clear(); // SAME
        // console.log(item.bullet.position);
        // console.log(item.raycaster.ray.origin);
        item.raycaster.ray.set(item.raycaster.ray.origin, item.raycaster.ray.direction);

        // scene.add(new THREE.ArrowHelper(item.raycaster.ray.direction, item.raycaster.ray.origin, 1));

        let intersects = item.raycaster.intersectObjects(collidableMeshList, true);

        if(intersects.length > 0) {
            let intersect = intersects[0];
            let distance_one = intersect.distance;
            let distance_twoVec = new THREE.Vector3();
            distance_twoVec.subVectors(item.bullet.position, item.lastPosition);
            let distance_two = distance_twoVec.length();

            if(distance_one <= distance_two) {
                audioCollection.hitmarker.play();

                if(intersect.object.parent.parent.name != null) {
                    switch(intersect.object.parent.parent.name) { // The name of the model that the hitbox mesh is attached to
                        case "alien":
    
                            if(intersect.object.name == "head") { // Headshot
                                alien.currentHealth -= 100;
                                audioCollection.headshot.play();
                                crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
                                crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
                            }
                            else { // Bodyshot
                                alien.currentHealth -= 20;
                                crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
                                if(alien.currentHealth <= 0) {
                                    crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
                                }
                            }

                            if(alien.currentHealth <= 0) {
                                alien.deathAnim.enabled = true;
                                alien.shootAnim.enabled = false;
                                let indexOfCollidableMesh = collidableMeshList.indexOf(alien.hitbox.mesh);
                                collidableMeshList.splice(indexOfCollidableMesh, 1);
                                alien.alienModel.remove(alien.hitbox.mesh);
                                alien.hitbox = null;
                            }

                            setTimeout(() => {
                                crosshair.style.background = "url(hud/crosshairs/crosshair.svg)";
                                crosshair.style.filter = "none";
                            }, 300);
                        
                        break;
                    }
                }
            }
        }
        item.lastPosition.copy(item.bullet.position);
    });


    if(player.weapon.cooldown > 0) {
        /** Handle weapon cooldown bar */
        player.weapon.cooldown -= 1;
        weaponCooldownBar.setAttribute("style", "width:" + player.weapon.cooldown / 50.0 + "%");

        /** Handle recoil of the weapon */
        if(player.weapon.model.rotation.x < 0) {
            player.weapon.model.rotation.x = 0;
            player.weapon.recoil.reachedBottom = true;
            player.weapon.recoil.direction = "up";
        }
        if(player.weapon.model.rotation.x > 0.2) {
            player.weapon.model.rotation.x = 0.2;
            player.weapon.recoil.reachedTop = true;
            player.weapon.recoil.direction = "down";
        }

        if(player.weapon.recoil.direction == "up" && !player.weapon.recoil.reachedTop) {
            player.weapon.model.rotation.x += 0.05;
        }
        else if(player.weapon.recoil.direction == "down" && !player.weapon.recoil.reachedBottom) {
            player.weapon.model.rotation.x -= 0.02;
        }
    
    }
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
    audioCollection.jumpBoost.play();
    let tempAnimation = player.currentAnimation;
    player.currentAnimation.enabled = false;
    player.currentAnimation = player.jumpAnim;

    setTimeout(function() {
        player.jumping = false;
        audioCollection.jumpBoost.stop();
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
            case "bounty_hunter":
                initBountyHunters(gltf);
                break;
            case "weapon":
                initWeapon(gltf);
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
            case "rock_four":
                initRockFour(gltf);
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

function loadAudio(url, key) {
    switch(key) {
        case "wildlife":
            audioCollection.wildlife = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.wildlife.setBuffer(buffer);
	            audioCollection.wildlife.setLoop(true);
	            audioCollection.wildlife.setVolume(0.1);
	            audioCollection.wildlife.play();
            });
            break;
        case "weapon":
            audioCollection.weapon = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.weapon.setBuffer(buffer);
                audioCollection.weapon.setLoop(false);
                audioCollection.weapon.setVolume(0.3);
            });
            break;
        case "headshot":
            audioCollection.headshot = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.headshot.setBuffer(buffer);
                audioCollection.headshot.setLoop(false);
                audioCollection.headshot.setVolume(0.3);
            });
            break;
        case "hitmarker":
            audioCollection.hitmarker = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.hitmarker.setBuffer(buffer);
                audioCollection.hitmarker.setLoop(false);
                audioCollection.hitmarker.setVolume(0.5);
            });
            break;
        case "jump_boost":
            audioCollection.jumpBoost = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.jumpBoost.setBuffer(buffer);
                audioCollection.jumpBoost.setLoop(false);
                audioCollection.jumpBoost.setVolume(0.3);
            });
            break;
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
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    camera.position.set(0, 8, 0);
    scene.add(camera);

    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y - 2, camera.position.z + 26);
    camera.add(thirdPersonCamera);

    cameraType = "fp";

    birdsEyeViewCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 2500);
    birdsEyeViewCamera.position.set(-15, 8, -20);
    birdsEyeViewCamera.lookAt(0, 8, -20);
    scene.add(birdsEyeViewCamera);
}

function initLights() {
    ambientLight = new THREE.AmbientLight("white", 0.15);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight("white", 1.5);
    pointLight.distance = 40;
    camera.add(pointLight);
    camera.children[1].position.y = 5; // Lower the point light from 8 to 5
}

function initControls() {
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    document.addEventListener("click", initialPointerLock);

    function initialPointerLock() {
        controls.lock();
        document.removeEventListener("click", initialPointerLock);
        resume.addEventListener("click", () => controls.lock());
        lockingClick = false;
    }

    controls.addEventListener("lock", lock);
    controls.addEventListener("unlock", unlock);

    function lock() {
        if(!audioCollection.wildlife.isPlaying)
            audioCollection.wildlife.play();
        crosshair.style.visibility = "visible";
        pauseBlock.style.display = "none";
        lockingClick = false;
    }

    function unlock() {
        lockingClick = true;
        audioCollection.wildlife.pause();
        crosshair.style.visibility = "hidden";
        pauseBlock.style.display = "block";
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    function onKeyDown(event) {

        event.preventDefault();

        switch(event.keyCode) {
            case 87:    // W
                player.movingForward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.walkAnim);
                break;
            case 65:    // A
                player.movingLeft = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.strafeLAnim);
                break;
            case 83:    // S
                player.movingBackward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.backwardsAnim);
                break;
            case 68:    // D
                player.movingRight = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.strafeRAnim);
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
                    if(player.movingForward && !player.movingLeft && !player.movingRight) {
                        player.runFactor = 1.5;
                        updatePlayerAnimation(player.runAnim);
                    }
                }
                break;
            case 49:    // 1
                cameraType = "fp";
                crosshair.style.top = "50.625%";
                crosshair.style.transform = "translate(-50%, -50.625%)"; 
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
                crosshair.style.top = "55.625%";
                crosshair.style.transform = "translate(-50%, -55.625%)";                 
                break;
            case 51:    // 3
                cameraType = "bev"; break;
        }
    }

    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87:    // W
                player.movingForward = false;
                if(!player.movingBackward && !player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.idleAnim);
                break;
            case 65:    // A
                player.movingLeft  = false;
                if(!player.movingRight && !player.movingForward && !player.movingBackward)
                    updatePlayerAnimation(player.idleAnim);
                else if(player.movingForward)
                    updatePlayerAnimation(player.walkAnim);
                else if(player.movingBackward)
                    updatePlayerAnimation(player.walkBackwardsAnim);
                break;
            case 83:    // S
                player.movingBackward = false;
                if(!player.movingForward && !player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.idleAnim);
                break;
            case 68:    // D
                player.movingRight = false;
                if(!player.movingLeft && !player.movingForward && !player.movingBackward)
                    updatePlayerAnimation(player.idleAnim);
                else if(player.movingForward)
                    updatePlayerAnimation(player.walkAnim);
                else if(player.movingBackward)
                    updatePlayerAnimation(player.walkBackwardsAnim);
                break;
            case 16:    // Shift
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                    if(player.movingForward && !player.movingLeft && !player.movingRight)
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
    audioLoader = new THREE.AudioLoader(loadingManager);
}

function initPlayer() {
    player = new Player("Joax");
    loadModel("models/characters/player/player_gun.glb", "player");
}

function initAlien() {
    alien = new Alien("alien");
    loadModel("models/characters/enemy/alien.mintexture.glb", "alien");
}

function initBountyHunter() {
    loadModel("models/characters/bounty hunter/bounty_hunter.glb", "bounty_hunter");
}

function initWeaponModel() {
    loadModel("models/gun/pistol.glb", "weapon");
}

function initWeapon(gltf) {
    player.weapon.model = gltf.scene;
    player.weapon.model.scale.set(0.75, 0.75, -0.75);
    player.weapon.model.position.set(0, -3, -4);
    camera.add(player.weapon.model);

    player.weapon.bulletStart = new THREE.Object3D();
    player.weapon.bulletStart.position.set(0, -0.5, -1);
    camera.add(player.weapon.bulletStart);

    player.weapon.bullets = [];

    document.addEventListener("mousedown", onMouseDown);

    function onMouseDown() {
        if(lockingClick || player.weapon.cooldown != 0) return;

        player.weapon.recoil.reachedBottom = false;
        player.weapon.recoil.reachedTop = false;

        let cylinderGeometry = new THREE.CylinderBufferGeometry(0.05, 0.05, 5);
        cylinderGeometry.rotateX(-Math.PI/2);
        let singleBullet = new THREE.Mesh(cylinderGeometry, new THREE.MeshBasicMaterial( {color: "#03c3fb"} ));
        player.weapon.bulletStart.getWorldPosition(singleBullet.position);
        singleBullet.rotation.copy(camera.rotation);

        let lastPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);
        let originalPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);

        let direction = new THREE.Vector3();
        controls.getDirection(direction);

        let origin = new THREE.Vector3();
        singleBullet.getWorldPosition(origin);

        let raycaster = new THREE.Raycaster(origin, direction.normalize());

        player.weapon.bullets.push({bullet: singleBullet, raycaster: raycaster, lastPosition: lastPosition, originalPosition: originalPosition});
        scene.add(singleBullet);
        audioCollection.weapon.play();
        player.weapon.cooldown = 50;
    }
}

function initAudio() {
    listener = new THREE.AudioListener();
    camera.add(listener);

    audioCollection = new AudioCollection();

    loadAudio("audio/environment/wildlife.wav", "wildlife");
    loadAudio("audio/weapon/weapon_shot.mp3", "weapon");
    loadAudio("audio/weapon/headshot.mp3", "headshot");
    loadAudio("audio/weapon/hitmarker.mp3", "hitmarker");
    loadAudio("audio/character/jump_boost.wav", "jump_boost");
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
    rendererStats.update(renderer);

    //let cameraToRender = cameraType == "fp" ? camera : thirdPersonCamera;
    switch(cameraType) {
        case "fp": renderer.render(scene, camera); break;
        case "tp": renderer.render(scene, thirdPersonCamera); break;
        case "bev": renderer.render(scene, birdsEyeViewCamera); break;
    }
    //renderer.render(scene, cameraToRender);
}

function init() {
    //menuAudioSource.stop();
    title.style.display = "none";
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
    initBountyHunter();
    initWeaponModel();
    initAudio();
    initWorld();
}

function initMenuAudio() {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let xmlhr = new XMLHttpRequest();
    xmlhr.open("GET", "audio/menu/Lyssna.mp3");
    xmlhr.responseType = "arraybuffer";
    xmlhr.addEventListener("load", () => {
        let playsound = (audioBuffer) => {
            menuAudioSource = audioContext.createBufferSource();
            menuAudioSource.buffer = audioBuffer;
            menuAudioSource.connect(audioContext.destination);
            menuAudioSource.loop = true;
           // menuAudioSource.start();
        };
        audioContext.decodeAudioData(xmlhr.response).then(playsound);
    });
    xmlhr.send();
}

function menu() {
    initMenuAudio();
    playButton.addEventListener("click", () => init());
}