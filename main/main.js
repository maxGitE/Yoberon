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

/** BOUNDARY BOX GLOBALS */
let boundaryFactor = 5; // Account for skipped frames and fucked behaviour with game loop
let boxArr = new Array(9);

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
let currentLevel = 1;
let xPos;
let zPos;

/** ALIEN */
let alienArray = [];
let alien1;
let alien2;
let alien3;
let alien4;
let alien5;
let alien6;

/** BOUNTY HUNTER */
let bountyArray = [];
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

        // Update animations
        for (let i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.delta);            
        }

        // Update star field colours 
        starFieldA.updateColour(0.0035);
        starFieldB.updateColour(0.0075);

        // console.clear();
        // console.log(camera.position.x, camera.position.y, camera.position.z); // save two previous positions?

        updateLevel();
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
    player.playerModel = gltf.scene;
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

function initAlienModels(gltf) {
    alien1.setPosition(-10, 0, -40);
    alienArray.push(alien1);

    alien2.setPosition(10, 0, -40);
    alienArray.push(alien2);

    alien3.setPosition(0, 0, -45);
    alienArray.push(alien3);

    alien4.setPosition(-5, 0, -50);
    alienArray.push(alien4);

    alien5.setPosition(5, 0, -50);
    alienArray.push(alien5);

    alien6.setPosition(0, 0, -55);
    alienArray.push(alien6);

    instantiateUnits(gltf, alienArray, "Alien_(Armature)");  
}

function initBountyHunters(gltf) {
    bountyHunter1.setPosition(-10, 0, -15);
    bountyHunter1.setRotation(0, Math.PI, 0);
    bountyHunter1.defaultAnim = "Side";
    bountyArray.push(bountyHunter1);

    bountyHunter2.setPosition(5, 0, -30);
    bountyHunter2.defaultAnim = "Up";
    bountyArray.push(bountyHunter2);

    bountyHunter3.setPosition(10, 0, -20);
    bountyHunter3.defaultAnim = "Down";
    bountyArray.push(bountyHunter3);
    
    instantiateUnits(gltf, bountyArray, "vanguard_Mesh");
}

/**
 * Clone a mesh object and apply all relevant transformations.
 * Populate all animation fields for the mesh and start the default animation.
 * @param {array} units Array containing meshes to clone
 * @param {string} meshName Name of the mesh to animate
 */
function instantiateUnits(gltf, units, meshName) {
    for (let i = 0; i < units.length; i++) {        
        let clonedScene = SkeletonUtils.clone(gltf.scene);
        units[i].model = clonedScene;

        if(clonedScene) { // THREE.Scene is cloned properly
            let clonedMesh = clonedScene.getObjectByName(meshName);

            let mixer = new THREE.AnimationMixer(clonedMesh);

            /** Populate all animation fields for the relevant mesh */
            if(meshName == "vanguard_Mesh") {
                units[i].sideAnim = mixer.clipAction(gltf.animations[0]);
                units[i].upAnim = mixer.clipAction(gltf.animations[1]);
                units[i].downAnim = mixer.clipAction(gltf.animations[2]);

                units[i].sideAnim.play();
                units[i].upAnim.play();
                units[i].downAnim.play();

                units[i].sideAnim.enabled = false;
                units[i].upAnim.enabled = false;
                units[i].downAnim.enabled = false;
            }
            else if(meshName == "Alien_(Armature)") {
                units[i].idleAnim = mixer.clipAction(gltf.animations[0]);
                units[i].walkAnim = mixer.clipAction(gltf.animations[1]);
                units[i].strafeLAnim = mixer.clipAction(gltf.animations[2]);
                units[i].strafeRAnim = mixer.clipAction(gltf.animations[3]);
                units[i].walkBackwardsAnim = mixer.clipAction(gltf.animations[4]);
                units[i].deathAnim = mixer.clipAction(gltf.animations[5]);
                units[i].shootAnim = mixer.clipAction(gltf.animations[6]);
            
                units[i].deathAnim.setLoop(THREE.LoopOnce);
                units[i].deathAnim.clampWhenFinished = true;
            
                units[i].idleAnim.play();
                units[i].walkAnim.play();
                units[i].strafeLAnim.play();
                units[i].strafeRAnim.play();
                units[i].walkBackwardsAnim.play();
                units[i].deathAnim.play();
                units[i].shootAnim.play();
            
                units[i].idleAnim.enabled = false;
                units[i].walkAnim.enabled = false;
                units[i].strafeLAnim.enabled = false;
                units[i].strafeRAnim.enabled = false;
                units[i].walkBackwardsAnim.enabled = false;
                units[i].deathAnim.enabled = false;
                units[i].shootAnim.enabled = false;

                /** Hitboxes */
                units[i].hitbox = new Hitbox("alien");
                units[i].model.add(units[i].hitbox.mesh);
                units[i].model.name = "alien" + (i + 1);

                collidableMeshList.push(units[i].hitbox.mesh);
            }

            /** Play default animation */
            let clip = THREE.AnimationClip.findByName(gltf.animations, units[i].defaultAnim);

            if(clip) {
                let action = mixer.clipAction(clip);
                action.enabled = true;
            }
            
            mixers.push(mixer);            

            scene.add(clonedScene); // Add cloned scene to the world scene
            
            /** Apply transformations to the cloned scene */
            clonedScene.position.set(units[i].position.x, units[i].position.y, units[i].position.z);

            clonedScene.scale.set(units[i].scale.x, units[i].scale.y, units[i].scale.z);

            clonedScene.rotation.x = units[i].rotation.x;
            clonedScene.rotation.y = units[i].rotation.y;
            clonedScene.rotation.z = units[i].rotation.z;
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
    let groundGeom = new THREE.PlaneBufferGeometry(2000, 4000, 100, 100);
    let groundTexture = loadTexture("textures/texture_path_outline.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(80, 160);
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

/** 
 * Sets the value of boxArr at the index of the current box number to true, and sets all other values to false.
 * The player can only be in one box at any given point in time.
 * @param {number} boxNo The current box that the player is in
 * @param {number} level The current level that the player is on (used for printing purposes only)
 */
function setBox(boxNo, level) {
    for (let i = 0; i < boxArr.length; i++) {
        boxArr[i] = false;                
    }
    switch(boxNo) {
        case 1:             
            boxArr[1] = true;  
            break;
        case 2:
            boxArr[2] = true;
            break;
        case 3:
            boxArr[3] = true;
            break;
        case 4:
            boxArr[4] = true;
            break;
        case 5:
            boxArr[5] = true;
            break;
        case 6:
            boxArr[6] = true;
            break;
        case 7:
            boxArr[7] = true;
            break;
        case 8:
            boxArr[8] = true;
            break;
    }
    // console.clear();
    // console.log("Level: " + level + ", Box: " + boxArr.findIndex(item => item == true));
}

/** Changes which bounding boxes to load depending on what the current level is */
function updateLevel() {
    xPos = controls.getObject().position.x;
    zPos = controls.getObject().position.z;

    switch(currentLevel) {
        case 1: 
            levelOneBoundingBox();
            break;
        case 1.5:
            puzzleOneBoundingBox();
            break;
        case 2:
            levelTwoBoundingBox();
            break;
        case 2.5:
            puzzleTwoBoundingBox();
            break;  
        case 3:
            levelThreeBoundingBox();
            break;
        case 3.5:
            puzzleThreeBoundingBox();
            break;   
        case 4:
            levelFourBoundingBox();
            break; 
    }
}

/** 
 *  Handles bound checking for the first level.
 *  Called by updateLevel() if currentLevel = 1.
 */
function levelOneBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = 30;
    let boxOneTop = -550;
    let boxOneLeft = -40;
    let boxOneRight = -boxOneLeft;

    let boxTwoBottom = -420;
    let boxTwoTop = -450;
    let boxTwoLeft = boxOneRight;
    let boxTwoRight = 60;

    let boxThreeBottom = boxTwoBottom;
    let boxThreeTop = -615;
    let boxThreeLeft = 60;
    let boxThreeRight = 130;

    let boxFourBottom = -585;
    let boxFourTop = boxThreeTop;
    let boxFourLeft = boxOneRight;
    let boxFourRight = boxThreeRight;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 1);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 1);
    }
    else if(xPos > boxThreeLeft && xPos < boxThreeRight && zPos < boxThreeBottom && zPos > boxThreeTop) {
        setBox(3, 1);
    }
    else if(xPos > boxFourLeft && xPos < boxFourRight && zPos < boxFourBottom && zPos > boxFourTop) {
        setBox(4, 1);
    }

    if(boxArr[1]) { // In box one
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
            if(zPos > boxTwoBottom || zPos < boxTwoTop)
                controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(zPos < boxTwoTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
    }
    else if(boxArr[3]) { // In box three
        if(zPos > boxThreeBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxThreeBottom - boundaryFactor;
        }
        if(zPos < boxThreeTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxThreeTop + boundaryFactor;
        }
        if(zPos < boxTwoTop && zPos > boxFourBottom) { // Place left boundary excluding overlaps on boxTwo and boxFour
            if(xPos < boxThreeLeft + boundaryFactor)
                controls.getObject().position.x = boxThreeLeft + boundaryFactor;
        }
        if(xPos > boxThreeRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxThreeRight - boundaryFactor;
        }
        if(zPos > boxThreeBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxThreeBottom - boundaryFactor;
        }
    }
    else if(boxArr[4]) { // In box four
        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        if(xPos < boxFourLeft) { // Change the level once the player leaves the box
            currentLevel = 1.5;
        }
    }
}

/** 
 *  Handles bound checking for the first puzzle.
 *  Called by updateLevel() if currentLevel = 1.5.
 */
function puzzleOneBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -585;
    let boxOneLeft = -40;
    let boxOneRight = -boxOneLeft;
    let boxOneTop = -685;

    let boxTwoBottom = boxOneTop;
    let boxTwoLeft = -15;
    let boxTwoRight = 15;
    let boxTwoTop = -715;

    let puzzleCompleted = true;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 1.5);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 1.5);
    }
    
    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxOneBottom - boundaryFactor;
        }
        if(zPos < boxOneTop + boundaryFactor) { // Place top boundary
            if(puzzleCompleted) { // Allow player through the path only after the puzzle is completed
                if(xPos < boxTwoLeft || xPos > boxTwoRight)
                    controls.getObject().position.z = boxOneTop + boundaryFactor;
            }
            else {
                controls.getObject().position.z = boxOneTop + boundaryFactor;
            }
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight) { // Place right boundary
            controls.getObject().position.x = boxOneRight;
        }
    }
    else if(boxArr[2]) { // In box two
        if(xPos < boxTwoLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
        if(zPos < boxTwoTop) { // Change the level once the player leaves the box
            currentLevel = 2;
        }
    }
}

/** 
 *  Handles bound checking for the second level.
 *  Called by updateLevel() if currentLevel = 2.
 */
function levelTwoBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -715;
    let boxOneLeft = -40;
    let boxOneRight = -boxOneLeft;
    let boxOneTop = -900;

    let boxTwoBottom = boxOneTop;
    let boxTwoLeft = -200;
    let boxTwoRight = boxOneRight;
    let boxTwoTop = -980;

    let boxThreeBottom = boxTwoBottom;
    let boxThreeLeft = -280;
    let boxThreeRight = boxTwoLeft;
    let boxThreeTop = -1100;

    let boxFourBottom = boxThreeTop;
    let boxFourLeft = boxThreeLeft;
    let boxFourRight = 500;
    let boxFourTop = -1180;

    let boxFiveBottom = -1070;
    let boxFiveLeft = 445;
    let boxFiveRight = 475;
    let boxFiveTop = boxFourBottom;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 2);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 2);
    }
    else if(xPos > boxThreeLeft && xPos < boxThreeRight && zPos < boxThreeBottom && zPos > boxThreeTop) {
        setBox(3, 2);
    }
    else if(xPos > boxFourLeft && xPos < boxFourRight && zPos < boxFourBottom && zPos > boxFourTop) {
        setBox(4, 2);
    }
    else if(xPos > boxFiveLeft && xPos < boxFiveRight && zPos < boxFiveBottom && zPos > boxFiveTop) {
        setBox(5, 2);
    }

    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom) { // Place bottom boundary
            controls.getObject().position.z = boxOneBottom;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary except at box two overlap
            if(zPos > boxTwoBottom)
                controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary except at box one overlap
            if(xPos < boxOneLeft)
                controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(zPos < boxTwoTop + boundaryFactor) { // Place top boundary except at box three overlap
            if(xPos > boxThreeRight)
                controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
    }
    else if(boxArr[3]) { // In box three
        if(zPos > boxThreeBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxThreeBottom - boundaryFactor;
        }
        if(xPos < boxThreeLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxThreeLeft + boundaryFactor;
        }
        if(xPos > boxThreeRight - boundaryFactor) { // Place right boundary except at box two overlap
            if(zPos < boxTwoTop)
                controls.getObject().position.x = boxThreeRight - boundaryFactor;
        }
    }
    else if(boxArr[4]) { // In box four
        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary except at box four overlap and box five entrance
            if(xPos > boxThreeRight && (xPos < boxFiveLeft || xPos > boxFiveRight))
                controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        if(xPos < boxFourLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxFourLeft + boundaryFactor;
        }
        if(xPos > boxFourRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxFourRight - boundaryFactor;
        }
    }
    else if(boxArr[5]) { // In box five
        if(xPos < boxFiveLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxFiveLeft + boundaryFactor;
        }
        if(xPos > boxFiveRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxFiveRight - boundaryFactor;
        }
        if(zPos > boxFiveBottom) { // Change the level once the player leaves the box
            currentLevel = 2.5;
        }
    }
}

/** 
 *  Handles bound checking for the second puzzle.
 *  Called by updateLevel() if currentLevel = 2.5.
 */
function puzzleTwoBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -970;
    let boxOneLeft = 420;
    let boxOneRight = 500;
    let boxOneTop = -1070;

    let boxTwoBottom = -940;
    let boxTwoLeft = 445;
    let boxTwoRight = 475;
    let boxTwoTop = boxOneBottom;

    let puzzleCompleted = true;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 2.5);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 2.5);
    }

    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            if(puzzleCompleted) { // Allow player through the path only after the puzzle is completed
                if(xPos < boxTwoLeft || xPos > boxTwoRight)
                    controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
            else {
                controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
        }
        if(zPos < boxOneTop) { // Place top boundary    
            controls.getObject().position.z = boxOneTop;

        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(xPos < boxTwoLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
        if(zPos > boxTwoBottom) { // Change the level once the player leaves the box
            currentLevel = 3;
        }
    }
}

/** 
 *  Handles bound checking for the third level.
 *  Called by updateLevel() if currentLevel = 3.
 */
function levelThreeBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -600;
    let boxOneLeft = 420;
    let boxOneRight = 500;
    let boxOneTop = -940;

    let boxTwoBottom = boxOneBottom;
    let boxTwoLeft = 200;
    let boxTwoRight = boxOneRight;
    let boxTwoTop = -680;

    let boxThreeBottom = -370;
    let boxThreeLeft = boxTwoLeft;
    let boxThreeRight = 280;
    let boxThreeTop = boxTwoTop;

    let boxFourBottom = boxThreeBottom;
    let boxFourLeft = boxThreeRight;
    let boxFourRight = 400;
    let boxFourTop = -450;

    let boxFiveBottom = -395;
    let boxFiveLeft = boxFourRight;
    let boxFiveRight = 430;
    let boxFiveTop = -425;

    /** SECRET PATH */
    let boxSixBottom = -810;
    let boxSixLeft = boxOneLeft;
    let boxSixRight = 550;
    let boxSixTop = -840;

    let boxSevenBottom = -740;
    let boxSevenLeft = boxSixRight;
    let boxSevenRight = 600;
    let boxSevenTop = boxSixTop;

    let boxEightBottom = boxSevenBottom;
    let boxEightLeft = boxOneLeft;
    let boxEightRight = boxSevenLeft;
    let boxEightTop = -770;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 3);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 3);
    }
    else if(xPos > boxThreeLeft && xPos < boxThreeRight && zPos < boxThreeBottom && zPos > boxThreeTop) {
        setBox(3, 3);
    }
    else if(xPos > boxFourLeft && xPos < boxFourRight && zPos < boxFourBottom && zPos > boxFourTop) {
        setBox(4, 3);
    }
    else if(xPos > boxFiveLeft && xPos < boxFiveRight && zPos < boxFiveBottom && zPos > boxFiveTop) {
        setBox(5, 3);
    }
    else if(xPos > boxSixLeft && xPos < boxSixRight && zPos < boxSixBottom && zPos > boxSixTop) {
        setBox(6, 3);
    }
    else if(xPos > boxSevenLeft && xPos < boxSevenRight && zPos < boxSevenBottom && zPos > boxSevenTop) {
        setBox(7, 3);
    }
    else if(xPos > boxEightLeft && xPos < boxEightRight && zPos < boxEightBottom && zPos > boxEightTop) {
        setBox(8, 3);
    }

    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxOneBottom - boundaryFactor;
        }
        if(zPos < boxOneTop) { // Place top boundary
            controls.getObject().position.z = boxOneTop;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary except at box two overlap
            if(zPos < boxTwoTop)
                controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary except at secret path entrance and exit
            if( (zPos < boxSixTop || zPos > boxSixBottom) && (zPos < boxEightTop || zPos > boxEightBottom) )
                controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary except at box three overlap
            if(xPos > boxThreeRight)
                controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(zPos < boxTwoTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
        if(xPos < boxThreeLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary except at box one overlap
            if(xPos < boxOneLeft)
                controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
    }
    else if(boxArr[3]) { // In box three
        if(zPos > boxThreeBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxThreeBottom - boundaryFactor;
        }
        if(xPos < boxThreeLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxThreeLeft + boundaryFactor;
        }
        if(xPos > boxThreeRight - boundaryFactor) { // Place right boundary except at box four overlap
            if(zPos < boxFourTop)
                controls.getObject().position.x = boxThreeRight - boundaryFactor;
        }
    }
    else if(boxArr[4]) { // In box four
        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        if(xPos > boxFourRight - boundaryFactor) { // Place right boundary except at box five entrance
            if(zPos < boxFiveTop || zPos > boxFiveBottom)
                controls.getObject().position.x = boxFourRight - boundaryFactor;
        }
    }
    else if(boxArr[5]) { // In box five
        if(zPos > boxFiveBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxFiveBottom - boundaryFactor;
        }
        if(zPos < boxFiveTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFiveTop + boundaryFactor;
        }
        if(xPos > boxFiveRight) { // Change the level once the player leaves the box
            currentLevel = 3.5;
        }
    }
    else if(boxArr[6]) { // In box six
        if(zPos > boxSixBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxSixBottom - boundaryFactor;
        }
        if(zPos < boxSixTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxSixTop + boundaryFactor;
        }
    }
    else if(boxArr[7]) { // In box seven
        if(zPos > boxSevenBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxSevenBottom - boundaryFactor;
        }
        if(zPos < boxSevenTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxSevenTop + boundaryFactor;
        }
        if(xPos < boxSevenLeft + boundaryFactor) { // Place left boundary except at box six and box eight overlaps
            if( (zPos < boxSixTop || zPos > boxSixBottom) && (zPos < boxEightTop || zPos > boxEightBottom) )
                controls.getObject().position.x = boxSevenLeft + boundaryFactor;
        }
        if(xPos > boxSevenRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxSevenRight - boundaryFactor;
        }
    }
    else if(boxArr[8]) { // In box eight
        if(zPos > boxEightBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxEightBottom - boundaryFactor;
        }
        if(zPos < boxEightTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxEightTop + boundaryFactor;
        }
    }
}

/** 
 *  Handles bound checking for the third puzzle.
 *  Called by updateLevel() if currentLevel = 3.5.
 */
function puzzleThreeBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -370;
    let boxOneLeft = 430;
    let boxOneRight = 530;
    let boxOneTop = -450;

    let boxTwoBottom = -340;
    let boxTwoLeft = 465;
    let boxTwoRight = 495;
    let boxTwoTop = -370;

    let puzzleCompleted = true;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 3.5);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 3.5);
    }

    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            if(puzzleCompleted) { // Allow player through the path only after the puzzle is completed
                if(xPos < boxTwoLeft || xPos > boxTwoRight)
                    controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
            else {
                controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
        }
        if(zPos < boxOneTop + boundaryFactor) { // Place top boundary    
            controls.getObject().position.z = boxOneTop + boundaryFactor;

        }
        if(xPos < boxOneLeft) { // Place left boundary
            controls.getObject().position.x = boxOneLeft;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(xPos < boxTwoLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
        if(zPos > boxTwoBottom) { // Change the level once the player leaves the box
            currentLevel = 4;
        }
    }
}

/** 
 *  Handles bound checking for the fourth level.
 *  Called by updateLevel() if currentLevel = 4.
 */
function levelFourBoundingBox() {
    // Boundary values for the respective box divisions
    let boxOneBottom = -40;
    let boxOneLeft = 330;
    let boxOneRight = 630;
    let boxOneTop = -340;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 4);
    }

    if(boxArr[1]) { // In box one
        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxOneBottom - boundaryFactor;
        }
        if(zPos < boxOneTop) { // Place top boundary
            controls.getObject().position.z = boxOneTop;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
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
                        case "alien1":
                            damageAlien(0, intersect);
                            break;
                        case "alien2":
                            damageAlien(1, intersect);
                            break;
                        case "alien3":
                            damageAlien(2, intersect);
                            break;
                        case "alien4":
                            damageAlien(3, intersect);
                            break;
                        case "alien5":
                            damageAlien(4, intersect);
                            break;
                        case "alien6":
                            damageAlien(5, intersect);
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

/**
 * Checks where the bullet collided with the current alien and reduces the alien's health accordingly.
 * Changes the crosshair to the hitmarker when a collision takes place.
 * Plays death animation for the current alien when health drops to zero and removes the hitbox from the scene.
 * @param {number} alienNumber Number of the alien which was shot
 * @param {*} intersect First index of the intersects array
 */
function damageAlien(alienNumber, intersect) {
    let currAlien = alienArray[alienNumber];

    if(intersect.object.name == "head") { // Headshot
        currAlien.currentHealth -= 100;
        audioCollection.headshot.play();
        crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
        crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
    }
    else { // Bodyshot
        currAlien.currentHealth -= 20;
        crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
        if(currAlien.currentHealth <= 0) {
            crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
        }
    }

    if(currAlien.currentHealth <= 0) {
        currAlien.deathAnim.enabled = true;
        currAlien.idleAnim.enabled = false;
        let indexOfCollidableMesh = collidableMeshList.indexOf(currAlien.hitbox.mesh);
        collidableMeshList.splice(indexOfCollidableMesh, 1);
        currAlien.model.remove(currAlien.hitbox.mesh);
        currAlien.hitbox = null;
    }

    setTimeout(() => {
        crosshair.style.background = "url(hud/crosshairs/crosshair.svg)";
        crosshair.style.filter = "none";
    }, 300);
}

function boundingBoxVis() {
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

    let linematerial = new THREE.LineBasicMaterial({
        color: 0xffff00
    });

    let points = [];
    let points2 = [];

    points.push(new THREE.Vector3(330, 1, -40));
    points.push(new THREE.Vector3(330, 1, -340)); // Entrance of level 4 box (left)

    points.push(new THREE.Vector3(465, 1, -340)); // Exit of level 3.5 box (left)
    points.push(new THREE.Vector3(465, 1, -370));
    points.push(new THREE.Vector3(430, 1, -370)); // Entrance of level 3.5 box (right)

    points.push(new THREE.Vector3(430, 1, -395)); // Exit of level 3 box (right)
    points.push(new THREE.Vector3(400, 1, -395));
    points.push(new THREE.Vector3(400, 1, -370));
    points.push(new THREE.Vector3(200, 1, -370));
    points.push(new THREE.Vector3(200, 1, -680));
    points.push(new THREE.Vector3(420, 1, -680));
    points.push(new THREE.Vector3(420, 1, -940));
    points.push(new THREE.Vector3(445, 1, -940)); // Entrance of level 3 box (right)

    points.push(new THREE.Vector3(445, 1, -970)); // Exit of level 2.5 box (right)
    points.push(new THREE.Vector3(420, 1, -970));
    points.push(new THREE.Vector3(420, 1, -1070));
    points.push(new THREE.Vector3(445, 1, -1070)); // Start of level 2.5 box (right)

    points.push(new THREE.Vector3(445, 1, -1100)); // Exit of level 2 box (right)
    points.push(new THREE.Vector3(-200, 1, -1100));
    points.push(new THREE.Vector3(-200, 1, -980));
    points.push(new THREE.Vector3(40, 1, -980));
    points.push(new THREE.Vector3(40, 1, -715));
    points.push(new THREE.Vector3(15, 1, -715)); // Entrance of level 2 box (right)

    points.push(new THREE.Vector3(15, 1, -685)); // Exit of level 1.5 box (right)
    points.push(new THREE.Vector3(40, 1, -685)); // Start of level 1.5 box (right)

    /** Level 1 box */
    points.push(new THREE.Vector3(boxOneRight, 1, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, 1, boxFourTop));
    points.push(new THREE.Vector3(boxThreeRight, 1, boxTwoBottom));
    
    points.push(new THREE.Vector3(boxOneRight, 1, boxTwoBottom));
    points.push(new THREE.Vector3(boxOneRight, 1, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, 1, boxOneBottom));
    points.push(new THREE.Vector3(-boxOneRight, 1, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, 1, boxOneTop));
    points.push(new THREE.Vector3(boxOneRight, 1, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, 1, boxTwoTop));
    points.push(new THREE.Vector3(boxThreeLeft, 1, boxFourBottom));
    points.push(new THREE.Vector3(boxOneRight, 1, boxFourBottom));

    points.push(new THREE.Vector3(-40, 1, -585)); // Start of level 1.5 box (left)
    points.push(new THREE.Vector3(-40, 1, -685));
    points.push(new THREE.Vector3(-15, 1, -685)); // Exit of level 1.5 box (left)

    points.push(new THREE.Vector3(-15, 1, -715)); // Entrance of level 2 box (left)
    points.push(new THREE.Vector3(-40, 1, -715));
    points.push(new THREE.Vector3(-40, 1, -900));
    points.push(new THREE.Vector3(-280, 1, -900));
    points.push(new THREE.Vector3(-280, 1, -1180));
    points.push(new THREE.Vector3(500, 1, -1180));
    points.push(new THREE.Vector3(500, 1, -1100));
    points.push(new THREE.Vector3(475, 1, -1100)); // Exit of level 2 box (left)

    points.push(new THREE.Vector3(475, 1, -1070)); // Start of level 2.5 box (left)
    points.push(new THREE.Vector3(500, 1, -1070));
    points.push(new THREE.Vector3(500, 1, -970));
    points.push(new THREE.Vector3(475, 1, -970)); // Exit of level 2.5 box (left)

    points.push(new THREE.Vector3(475, 1, -940)); // Entrance of level 3 box (left)
    points.push(new THREE.Vector3(500, 1, -940));
    points.push(new THREE.Vector3(500, 1, -840));

    points.push(new THREE.Vector3(600, 1, -840)); // Entrance of secret path
    points.push(new THREE.Vector3(600, 1, -740));
    points.push(new THREE.Vector3(500, 1, -740)); // Exit of secret path

    /** Secret path inner box */
    points2.push(new THREE.Vector3(500, 1, -810));
    points2.push(new THREE.Vector3(550, 1, -810));
    points2.push(new THREE.Vector3(550, 1, -770));
    points2.push(new THREE.Vector3(500, 1, -770));

    points.push(new THREE.Vector3(500, 1, -600));
    points.push(new THREE.Vector3(280, 1, -600));
    points.push(new THREE.Vector3(280, 1, -450));
    points.push(new THREE.Vector3(400, 1, -450));
    points.push(new THREE.Vector3(400, 1, -425));
    points.push(new THREE.Vector3(430, 1, -425)); // Exit of level 3 box (left)

    points.push(new THREE.Vector3(430, 1, -450)); // Entrance of level 3.5 box (left)
    points.push(new THREE.Vector3(530, 1, -450));
    points.push(new THREE.Vector3(530, 1, -370));
    points.push(new THREE.Vector3(495, 1, -370));
    points.push(new THREE.Vector3(495, 1, -340)); // Exit of level 3.5 box (right)

    points.push(new THREE.Vector3(630, 1, -340)); // Entrance of level 4 box (right)
    points.push(new THREE.Vector3(630, 1, -40));

    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

    let boundingBox = new THREE.LineLoop(geometry, linematerial);
    let secretPathInner = new THREE.LineLoop(geometry2, linematerial);
    scene.add(boundingBox);
    scene.add(secretPathInner);
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
                initAlienModels(gltf);
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

function initAliens() {
    alien1 = new Alien();
    alien2 = new Alien();
    alien3 = new Alien();
    alien4 = new Alien();
    alien5 = new Alien();
    alien6 = new Alien();
    loadModel("models/characters/enemy/alien.mintexture.glb", "alien");
}

function initBountyHunter() {
    bountyHunter1 = new BountyHunter();
    bountyHunter2 = new BountyHunter();
    bountyHunter3 = new BountyHunter();
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
    drawTrees();
    drawBushes();
    drawGround();
    drawRocks();
    drawStars();

    boundingBoxVis();
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
    initAliens();
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