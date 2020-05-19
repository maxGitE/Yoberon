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
const wakeUp = document.getElementById("wake-up");
const playerDeath = document.getElementById("playerdeath");
const deathBlock = document.getElementById("deathmenu");
const restart = document.getElementById("restart");
const pauseBlock = document.getElementById("pausemenu");
const resume = document.getElementById("resume");
const health = document.getElementById("health");
const healthbar = document.getElementById("healthbar");
const healthbarTrailing = document.getElementById("healthbar-trailing");
const healthNumber = document.getElementById("health-number");
const crosshair = document.getElementById("crosshair");
const weaponCooldownBar = document.getElementById("weaponcooldown");
const interact = document.getElementById("interact");
const tooltip = document.getElementById("tooltip");
const paper = document.getElementById("paper");
const dancecontrols = document.getElementById("dancecontrols");
const playButton = document.getElementById("play");
const loadingInfo = document.getElementById("loadinginfo");
const loadingSymbol = document.getElementById("loadingsymbol");

window.onload = menu;

/** BOUNDARY BOX GLOBALS */
let boundaryFactor = 5; // Account for skipped frames and fucked behaviour with game loop
let boxArr = new Array(9);
let currentBox; // Check which box the player is in as a separate variable to handle combat interactions

/** SCENE GLOBALS */
let canvas;
let renderer;
let scene;

/** CAMERAS */
let camera;
let thirdPersonCamera;
let birdsEyeViewCamera;
let puzzleTwoCamera;
let cameraType;

/** LIGHTS */
let ambientLight;
let pointLight;
let spotLight;

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
let alien7;
let alien8;
let alien9;
let alien10;
let alien11;
let alien12;
let alien13;

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
let blockingTrees;

/** LEVEL 1 */
let cameraDirectionLevelOne;
let totemCollection;
let totemOne;
let totemTwo;
let totemThree;
let totemFour;
let selectedTotem;
let selectedTotems = [];
let correctTotemOrder = [];
let finishedPuzzleOne = false;
let frog;
let eagle;
let lion;
let rooster;
let boulder_one;
let rockOverClueOne;
let rockOverClueTwo;
let rockOverClueThree;
let rockOverClueFour;
let selectedRock;
let directionRockSlides;
let paper_clueOne;
let paper_clueTwo;
let paper_clueThree;
let paper_clueFour;
let clueWords = ["AIR", "WATER", "FIRE", "EARTH"];
let levelOneCollidableMeshList = [];

/** PUZZLE 2 */
let inPuzzleTwo = false;
let finishedPuzzleTwo = false;
let inPosition = false;
let spotLightColour = 0;
let chickenDanceCorrect = false;
let gangnamStyleCorrect = false;
let macarenaDanceCorrect = false;
let ymcaDanceCorrect = false;
let danceIncorrect = 0;
let answered = false;
let lastPlayed;
let countCorrect = 0;

/** HUD */
let tooltipVisible = false;
let completedTooltip = false;
let healthbarWidth = 10.25;
let healthbarTrailingWidth = healthbarWidth;

let lockingClick = true;
let bulletCollidableMeshList = [];

/** HEALTH PACKS */
let healthPackCollidableMeshList = [];
let selectedHealthPack;
let pickedUpHealthPacks = [];

let interactableObject;

function gameLoop() {

    requestAnimationFrame(gameLoop);

    if(player.currentHealth > 0) {

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
                if(inPuzzleTwo && !finishedPuzzleTwo) {
                    player.velocityZ = player.velocityZ - 150 * clock.delta;
                }
                else {
                    player.velocityZ = player.velocityZ - 400 * clock.delta * player.runFactor;
                }
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
            else if(cameraType != "puzzleTwo") {
              player.playerModel.visible = false;
            }
            player.playerModel.rotation.set(0, controls.getObject().rotation.y, 0);

            if(cameraType == "fp") { // Hide the weapon unless the player is in the first person camera mode
                player.weapon.model.visible = true;
            }
            else {
                player.weapon.model.visible = false;
            }
          
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
            updateBullets(); // So anyway I started blasting

            alienArray.forEach(alien => { // So anyway they started blasting
                if(alienCanShoot(alien)) {
                    alien.model.lookAt(player.playerModel.position.clone());
                    createAlienBullet(alien);
                    updateAlienBullet(alien);
        
                    if(alien.movement.distanceMoved >= alien.movement.boundary) { // Reached movement boundary
                        alien.movement.moveOrRemain = Math.floor(Math.random() * 2) == 0 ? "move" : "remain"; // Choose a random option to move again or stand still

                        if(alien.movement.moveOrRemain == "move") {
                            if(alien.movement.leftOrRight == "left") {
                                alien.movement.leftOrRight = "right"; // If the alien was moving left before reaching the boundary, move right
                            }
                            else {
                                alien.movement.leftOrRight = "left"; // If the alien was moving right before reaching the boundary, move left
                            }
                        }   
                        else { // The alien should remain in place for a brief period until being assigned a new direction to move
                            updateAlienAnimation(alien, alien.shootAnim);
                            let directionTemp;
                            if(alien.movement.leftOrRight == "left") {
                                directionTemp = "right";
                            }
                            else {
                                directionTemp = "left";
                            }
                            alien.movement.leftOrRight = null;
                            setTimeout(() => {
                                alien.movement.leftOrRight = directionTemp;
                            }, 1000); 
                        }

                        alien.movement.distanceMoved = 0;
                    }
                    
                    if(alien.movement.leftOrRight == "left") { // Moving left
                        updateAlienAnimation(alien, alien.strafeLAnim);
                        alien.model.position.x -= 0.05;
                        alien.movement.distanceMoved += 0.05;
                    }
                    else if(alien.movement.leftOrRight == "right") { // Moving right
                        updateAlienAnimation(alien, alien.strafeRAnim);
                        alien.model.position.x += 0.05;
                        alien.movement.distanceMoved += 0.05;
                    }
            
                }
                else { // Either the alien is dead, the player is dead or the alien is out of range of the player. In all cases remove the alien's bullets from the scene
                    alien.weapon.bullets.forEach((item, index) => {
                        scene.remove(item.bullet); // Remove the bullet from the scene
                        alien.weapon.bullets.splice(index, 1); // Remove the bullet from the alien's bullets array
                    });

                    if(alien.currentHealth > 0) { // If the alien is alive, the player is dead or the player is out of range so set the alien's animation to idle
                        updateAlienAnimation(alien, alien.idleAnim);
                    }
                }
                
                if(alien.currentHealth > 0 && player.currentHealth < 0) { // Player is dead but alien is alive TODO: remove bullets ?
                    updateAlienAnimation(alien, alien.idleAnim);
                }
            });

            // Updates the animations on the healthbar if the player has been damaged
            updateHealthBar();

            // Update clock time
            clock.timeBefore = clock.timeNow;
        }
    }

    render();
}

function levelOnePuzzle() {
    if(!finishedPuzzleOne) {
        cameraDirectionLevelOne = new THREE.Vector3();
        cameraDirectionLevelOne.normalize();
        controls.getDirection(cameraDirectionLevelOne);
        let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirectionLevelOne);
        // scene.add(new THREE.ArrowHelper(playerRaycaster.ray.direction, playerRaycaster.ray.origin, 10));
        let intersects = playerRaycaster.intersectObjects(levelOneCollidableMeshList, false);

        if(intersects.length > 0 && intersects[0].distance < 10) {
            interact.style.visibility = "visible";
   
            if(intersects[0].object.name == "totem") { // Totem
                interactableObject = "totem";
                selectedTotem = intersects[0];
            }
            else if(intersects[0].object.name == "rockOverClueOne") { // Rock over clue one
                interactableObject = "rockOverClueOne";
            }
            else if(intersects[0].object.name == "rockOverClueTwo") { // Rock over clue two
                interactableObject = "rockOverClueTwo";
            }
            else if(intersects[0].object.name == "rockOverClueThree") { // Rock over clue three
                interactableObject = "rockOverClueThree";
            }
            else if(intersects[0].object.name == "rockOverClueFour") { // Rock over clue four
                interactableObject = "rockOverClueFour";
            }
            else if(intersects[0].object.name == "clueOne") { // Clue one
                interactableObject = "clueOne";
            }
            else if(intersects[0].object.name == "clueTwo") { // Clue two
                interactableObject = "clueTwo";
            }
            else if(intersects[0].object.name == "clueThree") { // Clue three
                interactableObject = "clueThree";
            }
            else if(intersects[0].object.name == "clueFour") { // Clue four
                interactableObject = "clueFour";
            }
        }
        else {
            interact.style.visibility = "hidden";
            paper.style.visibility = "hidden";
        }

        if(audioCollection.rockSlide.isPlaying) {   
            switch(selectedRock) {
                case rockOverClueOne:
                    rockOverClueOne.position.add(directionRockSlides.clone().multiplyScalar(0.1));
                    break;
                case rockOverClueTwo:
                    rockOverClueTwo.position.add(directionRockSlides.clone().multiplyScalar(0.1));
                    break;
                case rockOverClueThree:
                    rockOverClueThree.position.add(directionRockSlides.clone().multiplyScalar(0.1));
                    break;
                case rockOverClueFour:
                    rockOverClueFour.position.add(directionRockSlides.clone().multiplyScalar(0.1));
                    break;
            }
        }

    }
    else { // Solved puzzle
        if(audioCollection.rockSink.isPlaying) {
            if(boulder_one.position.y > -16.5) {
                boulder_one.position.y -= 0.02;
            }
        }
    }
}

function updateTotemSelection() {
    selectedTotem.object.userData.selected = !selectedTotem.object.userData.selected;

    if(selectedTotem.object.userData.selected) { // From unselected to selected
        selectedTotem.object.material.color.setHex(0xffffff);
        selectedTotems.push(selectedTotem);

        if(selectedTotems.length == 4) { // Combination finished
            let correct = true;
            
            for(let i = 0; i < 3; i++) {
                if(selectedTotems[i].object.id != correctTotemOrder[i].id) { // Wrong order entered. The items in correctTotemOrder are objects so we can directly reference their id's.
                                                                             // The items in selectedTotems are intersections so we need to explicitly reference the object attribute of the intersection to get the id.
                    correct = false;
                }
            }

            if(correct) {
                audioCollection.correctTotemOrder.play();
                setTimeout(() => {
                    audioCollection.rockSink.play();
                }, 4000);
                finishedPuzzleOne = true; // Stop casting the ray
                interact.style.visibility = "hidden";
            }
            else {
                audioCollection.wrongTotemOrder.play();
                selectedTotems.forEach(totem => {
                    totem.object.material.color.setHex(0x706d71);
                    totem.object.userData.selected = false;
                });
                selectedTotems = [];
            }
        }
    }
    else { // From selected to unselected
        selectedTotem.object.material.color.setHex(0x706d71);
        let totemIndex = selectedTotems.findIndex(totem => totem.object.id == selectedTotem.object.id);
        selectedTotems.splice(totemIndex, 1);
    }   
}

function updateRockOverClue(rock, name) {
    if(audioCollection.rockSlide.isPlaying) return; // Another rock is being pushed

    selectedRock = rock;
    audioCollection.rockSlide.play();

    directionRockSlides = cameraDirectionLevelOne.clone(); // The direction the rock will move is the same direction that the camera is facing
    directionRockSlides.y = 0; // Ignore the y direction of the camera as the rocks will slide along the xz-plane

    let indexToRemove = levelOneCollidableMeshList.findIndex(object => object.name == name); // Remove the selected rock from the collidable mesh list
    levelOneCollidableMeshList.splice(indexToRemove, 1);
}

function showClue(name) {
    switch(name) {
        case "clueOne":
            paper.style.visibility = "visible";
            paper.innerHTML = clueWords[0];
            break;
        case "clueTwo":
            paper.style.visibility = "visible";
            paper.innerHTML = clueWords[1];
            break;
        case "clueThree":
            paper.style.visibility = "visible";
            paper.innerHTML = clueWords[2];
            break;
        case "clueFour":
            paper.style.visibility = "visible";
            paper.innerHTML = clueWords[3];
            break;            
    }

    hideTooltip(); // Hide the tool tip once a clue has been found
}

/********** LEVEL TWO START **********/
function levelTwoPuzzle() {
    if(!finishedPuzzleTwo) {
        inPuzzleTwo = true;

        /** Set the camera to look at the player from the front */
        puzzleTwoCamera.position.set(camera.position.x, camera.position.y + 2, camera.position.z + 25);
        puzzleTwoCamera.lookAt(camera.position.x, camera.position.y, camera.position.z);

        /** Place the spotlight above the player looking down */
        spotLight.position.set(camera.position.x, camera.position.y + 10, camera.position.z);
        spotLight.target = player.playerModel;

        /** Cycle through light colours */
        if(spotLightColour >= 0) spotLight.color.setHex(0x00ffff);
        if(spotLightColour >= 1) spotLight.color.setHex(0x00ff00);
        if(spotLightColour >= 2) spotLight.color.setHex(0xffff00);
        if(spotLightColour >= 3) spotLight.color.setHex(0xff0000);

        if(spotLightColour > 3) {
            spotLightColour = 0;
        }
        spotLightColour += 0.05;

        /** Set up the hud and player model for the puzzle */
        crosshair.style.visibility = "hidden";
        player.playerModel.visible = true;
        player.weapon.model.visible = false;
        player.playerModel.rotation.set(0, Math.PI, 0);
        cameraType = "puzzleTwo";
        audioCollection.wildlife.stop();

        /** Move the player to the center of the box */
        if(controls.getObject().position.z < -1020) {
            player.movingForward = true;
            updatePlayerAnimation(player.walkAnim);

            /** Slowly dim the point light */
            if(pointLight.intensity > 0) {
                pointLight.intensity -= 0.01;
            }
        }
        else if(!inPosition) {
            player.movingForward = false;
            updatePlayerAnimation(player.idleAnim);
            inPosition = true;
            dancecontrols.style.visibility = "visible";
            pointLight.intensity = 0;
        }

        if(inPosition) {        
            setTimeout(() => {            
                if(!audioCollection.recordScratch.isPlaying && danceIncorrect != 2) { // Start the music after a short delay
                    playMusic(); 
                }
                spotLight.intensity = 2;
            }, 500);
        }
        
        initDanceChecks();

         /** If the wrong dance is done two times, restart the puzzle */
        if(danceIncorrect == 2) {
            danceIncorrect = 0;
            lastPlayed = "";
            countCorrect = 0;
        }        

        /** If the player gets all four dances correct, end the puzzle */
        if(chickenDanceCorrect && gangnamStyleCorrect && macarenaDanceCorrect && ymcaDanceCorrect) {
            finishedPuzzleTwo = true;
        }
    }
    else { // Solved puzzle        
        dancecontrols.style.visibility = "hidden";
        crosshair.style.visibility = "visible";
        pointLight.intensity = 1.5;
        scene.remove(spotLight);
        cameraType = "fp";
    }
}

/** Randomly plays each song for the second puzzle */
function playMusic() {
    /** Return if one of the songs is already playing */
    if(audioCollection.chickenDance.isPlaying || audioCollection.gangnamStyle.isPlaying || audioCollection.macarenaDance.isPlaying || audioCollection.ymcaDance.isPlaying) return;

    let songNumber = Math.floor(Math.random() * 4);

    switch(songNumber) {
        case 0:
            if(!chickenDanceCorrect && (lastPlayed != "chicken_dance" || countCorrect == 2)) {
                answered = false;
                audioCollection.chickenDance.play();
                lastPlayed = "chicken_dance";
            }
            break;
        case 1:
            if(!gangnamStyleCorrect && (lastPlayed != "gangnam_style" || countCorrect == 2)) {
                answered = false;
                audioCollection.gangnamStyle.play();
                lastPlayed = "gangnam_style";
            }
            break;
        case 2:
            if(!macarenaDanceCorrect && (lastPlayed != "macarena_dance" || countCorrect == 2)) {
                answered = false;
                audioCollection.macarenaDance.play();
                lastPlayed = "macarena_dance";
            }
            break;
        case 3:
            if(!ymcaDanceCorrect && (lastPlayed != "ymca_dance" || countCorrect == 2)) {
                answered = false;
                audioCollection.ymcaDance.play();
                lastPlayed = "ymca_dance";
            }
            break;
    }
}

/** Check if the player is doing the correct dance for the song */
function checkDance() {
    answered = true;

    if(audioCollection.chickenDance.isPlaying) {
        if(player.chickenDance.enabled) {
            audioCollection.correct.play();

            audioCollection.chickenDance.source.onended = function() {
                chickenDanceCorrect = true;
                countCorrect++;         
                updatePlayerAnimation(player.idleAnim);
                audioCollection.chickenDance.isPlaying = false;
            };
            
        }
        else {
            audioCollection.chickenDance.stop();

            audioCollection.recordScratch.play();
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;  
                updatePlayerAnimation(player.idleAnim);
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.gangnamStyle.isPlaying) {
        if(player.gangnamStyle.enabled) {
            audioCollection.correct.play();

            audioCollection.gangnamStyle.source.onended = function() {
                gangnamStyleCorrect = true;
                countCorrect++;     
                updatePlayerAnimation(player.idleAnim);
                audioCollection.gangnamStyle.isPlaying = false;
            };
        }
        else {
            audioCollection.gangnamStyle.stop();

            audioCollection.recordScratch.play();
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;  
                updatePlayerAnimation(player.idleAnim);
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.macarenaDance.isPlaying) {
        if(player.macarenaDance.enabled) {
            audioCollection.correct.play();

            audioCollection.macarenaDance.source.onended = function() {
                macarenaDanceCorrect = true;
                countCorrect++;          
                updatePlayerAnimation(player.idleAnim);
                audioCollection.macarenaDance.isPlaying = false;
            };
        }
        else {
            audioCollection.macarenaDance.stop();

            audioCollection.recordScratch.play();
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;  
                updatePlayerAnimation(player.idleAnim);
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.ymcaDance.isPlaying) {
        if(player.ymcaDance.enabled) {
            audioCollection.correct.play();

            audioCollection.ymcaDance.source.onended = function() {
                ymcaDanceCorrect = true;
                countCorrect++;          
                updatePlayerAnimation(player.idleAnim);
                audioCollection.ymcaDance.isPlaying = false;
            };
        }
        else {
            audioCollection.ymcaDance.stop();

            audioCollection.recordScratch.play();
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;  
                updatePlayerAnimation(player.idleAnim);
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }
}

/** Mark the song as incorrect if the player does not answer */
function initDanceChecks() {
    if(!answered) {

        if(audioCollection.chickenDance.isPlaying) {
            audioCollection.chickenDance.source.onended = function() {                
                audioCollection.chickenDance.isPlaying = false;
                
                audioCollection.recordScratch.play();
                audioCollection.recordScratch.source.onended = function() {              
                    danceIncorrect++;
                    audioCollection.recordScratch.isPlaying = false;
                };
                
            };
        }

        if(audioCollection.gangnamStyle.isPlaying) {
            audioCollection.gangnamStyle.source.onended = function() {                
                audioCollection.gangnamStyle.isPlaying = false;
                
                audioCollection.recordScratch.play();
                audioCollection.recordScratch.source.onended = function() {              
                    danceIncorrect++;
                    audioCollection.recordScratch.isPlaying = false;
                };
                
            };
        }

        if(audioCollection.macarenaDance.isPlaying) {
            audioCollection.macarenaDance.source.onended = function() {                
                audioCollection.macarenaDance.isPlaying = false;
                
                audioCollection.recordScratch.play();
                audioCollection.recordScratch.source.onended = function() {              
                    danceIncorrect++;
                    audioCollection.recordScratch.isPlaying = false;
                };
                
            };
        }

        if(audioCollection.ymcaDance.isPlaying) {
            audioCollection.ymcaDance.source.onended = function() {                
                audioCollection.ymcaDance.isPlaying = false;
                
                audioCollection.recordScratch.play();
                audioCollection.recordScratch.source.onended = function() {              
                    danceIncorrect++;
                    audioCollection.recordScratch.isPlaying = false;
                };
                
            };
        }

    }
}
/********** LEVEL TWO END **********/

function initPlayerModel(gltf) {
    player.playerModel = gltf.scene;
    let animations = gltf.animations;
    
    player.playerModel.scale.set(-0.5, 0.5, -0.5);
    player.playerModel.add(player.hitbox.mesh);
    scene.add(player.playerModel);
    
    let mixer = new THREE.AnimationMixer(player.playerModel);
    mixers.push(mixer);

    /** Animations without gun */
    player.walkAnim = mixer.clipAction(animations[0]);
    player.idleAnim = mixer.clipAction(animations[1]);
    player.backwardsAnim = mixer.clipAction(animations[2]);
    player.runAnim = mixer.clipAction(animations[3]);
    player.jumpAnim = mixer.clipAction(animations[4]);
    player.strafeLAnim = mixer.clipAction(animations[5]);
    player.strafeRAnim = mixer.clipAction(animations[6]);
    player.chickenDance = mixer.clipAction(animations[7]);
    player.gangnamStyle = mixer.clipAction(animations[8]);
    player.macarenaDance = mixer.clipAction(animations[9]);
    player.ymcaDance = mixer.clipAction(animations[10]);
    player.breakdance = mixer.clipAction(animations[11]);

    /** Animations with gun */    
    // player.shootAnim = mixer.clipAction(animations[0]);    
    // player.walkAnim = mixer.clipAction(animations[1]);
    // player.runAnim = mixer.clipAction(animations[2]);
    // player.backwardsAnim = mixer.clipAction(animations[3]);
    // player.strafeLAnim = mixer.clipAction(animations[4]);
    // player.strafeRAnim = mixer.clipAction(animations[5]);
    // player.idleAnim = mixer.clipAction(animations[6]);
    // player.jumpAnim = mixer.clipAction(animations[7]);

    player.walkAnim.play();
    player.idleAnim.play();
    player.backwardsAnim.play();
    player.jumpAnim.play();
    player.runAnim.play();
    // player.shootAnim.play();
    player.strafeLAnim.play();
    player.strafeRAnim.play();
    player.chickenDance.play();
    player.gangnamStyle.play();
    player.macarenaDance.play();
    player.ymcaDance.play();
    player.breakdance.play();

    player.walkAnim.enabled = false;
    player.idleAnim.enabled = true;
    player.backwardsAnim.enabled = false;
    player.jumpAnim.enabled = false;
    player.runAnim.enabled = false;
    // player.shootAnim.enabled = false;
    player.strafeLAnim.enabled = false;
    player.strafeRAnim.enabled = false;
    player.chickenDance.enabled = false;
    player.gangnamStyle.enabled = false;
    player.macarenaDance.enabled = false;
    player.ymcaDance.enabled = false;
    player.breakdance.enabled = false;
    
    player.currentAnimation = player.idleAnim;
}

function initAlienModels(gltf) {
    alien1.setPosition(-150, 0, -940);
    alien1.canShoot.level = 2;
    alien1.canShoot.box = 2;
    alienArray.push(alien1);

    alien2.setPosition(-170, 0, -960);
    alien2.canShoot.level = 2;
    alien2.canShoot.box = 2;
    alienArray.push(alien2);

    alien3.setPosition(-170, 0, -920);
    alien3.canShoot.level = 2;
    alien3.canShoot.box = 2;
    alienArray.push(alien3);

    alien4.setPosition(-100, 0, -1140);
    alien4.canShoot.level = 2;
    alien4.canShoot.box = 4;
    alienArray.push(alien4);

    alien5.setPosition(-90, 0, -1160);
    alien5.canShoot.level = 2;
    alien5.canShoot.box = 4;
    alienArray.push(alien5);

    alien6.setPosition(-80, 0, -1120);
    alien6.canShoot.level = 2;
    alien6.canShoot.box = 4;
    alienArray.push(alien6);

    alien7.setPosition(400, 0, -1150);
    alien7.canShoot.level = 2;
    alien7.canShoot.box = 4;
    alienArray.push(alien7);

    alien8.setPosition(400, 0, -1130);
    alien8.canShoot.level = 2;
    alien8.canShoot.box = 4;
    alienArray.push(alien8);

    alien9.setPosition(230, 0, -620);
    alien9.canShoot.level = 3;
    alien9.canShoot.box = 2;
    alienArray.push(alien9);

    alien10.setPosition(270, 0, -635);
    alien10.canShoot.level = 3;
    alien10.canShoot.box = 2;
    alienArray.push(alien10);

    alien11.setPosition(220, 0, -660);
    alien11.canShoot.level = 3;
    alien11.canShoot.box = 2;
    alienArray.push(alien11);

    alien12.setPosition(375, 0, -435);
    alien12.canShoot.level = 3;
    alien12.canShoot.box = 4;
    alienArray.push(alien12);

    alien13.setPosition(380, 0, -400);
    alien13.canShoot.level = 3;
    alien13.canShoot.box = 4;
    alienArray.push(alien13);

    instantiateUnits(gltf, alienArray, "Alien_(Armature)");  
}

function initBountyHunterModels(gltf) {
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

        units[i].model.traverse((child) => { // Prevent frustum culling of the mesh
            if(child.isMesh) {
                // child.frustumCulled = false;
                child.geometry.computeBoundingBox();
                child.geometry.boundingBox.expandByScalar(2);
            }
        })

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

                units[i].currentAnimation = units[i].idleAnim;

                /** Hitboxes */
                units[i].hitbox = new Hitbox("alien");
                units[i].model.add(units[i].hitbox.mesh);
                units[i].model.name = "alien" + (i + 1);

                bulletCollidableMeshList.push(units[i].hitbox.mesh);

                /** Add an object3D to each alien that controls the position where their bullets originate from */
                units[i].weapon.bulletStart = new THREE.Object3D();
                units[i].weapon.bulletStart.position.set(0, 1, 1);
                units[i].model.add(units[i].weapon.bulletStart);
                units[i].weapon.cooldown = Math.floor(Math.random() * 30 + 30); // Random cooldown between 30 and 60

                units[i].movement.moveOrRemain = Math.floor(Math.random() * 2) == 0 ? "move" : "remain"; // Choose a random initial value of whether to move or remain in place
                units[i].movement.leftOrRight = Math.floor(Math.random() * 2) == 0 ? "left" : "right"; // Choose a random initial direction to move
                units[i].movement.boundary = Math.floor(Math.random() * 3) + 5; // Choose a random initial integer boundary factor between 5 and 8, i.e. max distance that the alien can move in a movement cycle 
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

function initBlockingTree(gltf) {
    let blockingTreeOne = gltf.scene;
    let blockingTreeTwo = blockingTreeOne.clone();
    let blockingTreeThree = blockingTreeOne.clone();

    blockingTrees = new THREE.Object3D();

    blockingTreeOne.position.set(-5, 0, 0);
    blockingTreeTwo.position.set(0, 0, 0);
    blockingTreeThree.position.set(5, 0, 0);

    blockingTrees.add(blockingTreeOne);
    blockingTrees.add(blockingTreeTwo);
    blockingTrees.add(blockingTreeThree);

    blockingTrees.position.set(0, 0, -10);
    scene.add(blockingTrees);
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

function initRockFive(gltf) {
    boulder_one = gltf.scene; 
    boulder_one.scale.set(10, 15, 10);
    boulder_one.rotation.y = -Math.PI/2;
    boulder_one.position.set(0, 0, -695);
    scene.add(boulder_one);
}

function initRockOverClueOne(gltf) {
    rockOverClueOne = gltf.scene.children[0];

    rockOverClueOne.scale.set(0.005, 0.005, 0.005);
    rockOverClueOne.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueOne.position.set(-20, 0, -625);

    levelOneCollidableMeshList.push(rockOverClueOne);
 
    scene.add(rockOverClueOne);
}

function initRockOverClueTwo(gltf) {
    rockOverClueTwo = gltf.scene.children[0];

    rockOverClueTwo.scale.set(0.006, 0.006, 0.006);
    rockOverClueTwo.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueTwo.position.set(25, 0, -620);

    levelOneCollidableMeshList.push(rockOverClueTwo);
 
    scene.add(rockOverClueTwo);
}

function initRockOverClueThree(gltf) {
    rockOverClueThree = gltf.scene.children[0];

    rockOverClueThree.scale.set(0.0055, 0.0055, 0.0055);
    rockOverClueThree.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueThree.position.set(-15, 0, -675);

    levelOneCollidableMeshList.push(rockOverClueThree);
 
    scene.add(rockOverClueThree);
}

function initRockOverClueFour(gltf) {
    rockOverClueFour = gltf.scene.children[0];

    rockOverClueFour.scale.set(0.0045, 0.0045, 0.0045);
    rockOverClueFour.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueFour.position.set(-10, 0, -590);

    levelOneCollidableMeshList.push(rockOverClueFour);
 
    scene.add(rockOverClueFour);
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
    loadModel("models/environment/trees/blocking_tree.glb", "blocking_tree");
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
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add(ground);
}

function drawRocks() {
    loadModel("models/environment/rocks/rock_three.glb", "rock_three");
    loadModel("models/environment/rocks/rock_four.glb", "rock_four");
    loadModel("models/environment/rocks/rock_five.glb", "rock_five");
    loadModel("models/environment/rocks/rock_over_clue_one.glb", "rock_over_clue_one");
    loadModel("models/environment/rocks/rock_over_clue_two.glb", "rock_over_clue_two");
    loadModel("models/environment/rocks/rock_over_clue_three.glb", "rock_over_clue_three");
    loadModel("models/environment/rocks/rock_over_clue_four.glb", "rock_over_clue_four");
}

function drawStars() {
    starFieldA = new Starfield("black");
    starFieldB = new Starfield("white");

    scene.add(starFieldA.starField);
    scene.add(starFieldB.starField);
}

function drawTotems() {
    totemCollection = new THREE.Object3D();

    let totemTexture = loadTexture("textures/totem_wood.png");
    let normalMap = loadTexture("textures/totem_wood_normal.png");

    let totemGeometry = new THREE.CylinderBufferGeometry(3, 3, 12, 32);
    let totemOneMaterial = new THREE.MeshStandardMaterial( {color: "#706d71", map: totemTexture, normalMap: normalMap} );
    let totemTwoMaterial = totemOneMaterial.clone();
    let totemThreeMaterial = totemOneMaterial.clone();
    let totemFourMaterial = totemOneMaterial.clone();

    totemOne = new THREE.Mesh(totemGeometry, totemOneMaterial);
    totemTwo = new THREE.Mesh(totemGeometry, totemTwoMaterial);
    totemThree = new THREE.Mesh(totemGeometry, totemThreeMaterial);
    totemFour = new THREE.Mesh(totemGeometry, totemFourMaterial);

    totemOne.castShadow = true;
    totemTwo.castShadow = true;
    totemThree.castShadow = true;
    totemFour.castShadow = true;

    totemOne.position.set(-16.5, 6, 0);
    totemTwo.position.set(-5.5, 6, 0);
    totemThree.position.set(5.5, 6, 0);
    totemFour.position.set(16.5, 6, 0);

    totemOne.userData = {selected: false, animal: "eagle"};
    totemTwo.userData = {selected: false, animal: "frog"};
    totemThree.userData = {selected: false, animal: "lion"};
    totemFour.userData = {selected: false, animal: "rooster"};

    totemOne.name = "totem";
    totemTwo.name = "totem";
    totemThree.name = "totem";
    totemFour.name = "totem";

    correctTotemOrder.push(totemOne);
    correctTotemOrder.push(totemTwo);
    correctTotemOrder.push(totemThree);
    correctTotemOrder.push(totemFour);

    // Randomise the correct order of totems and their respective clue words using the Durstenfeld shuffle
    for(let i = 3; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let totemTemp = correctTotemOrder[i];
        correctTotemOrder[i] = correctTotemOrder[j];
        correctTotemOrder[j] = totemTemp;

        let clueTemp = clueWords[i];
        clueWords[i] = clueWords[j];
        clueWords[j] = clueTemp;
    }
    
    totemCollection.add(totemOne);
    totemCollection.add(totemTwo);
    totemCollection.add(totemThree);
    totemCollection.add(totemFour);

    levelOneCollidableMeshList.push(totemOne);
    levelOneCollidableMeshList.push(totemTwo);
    levelOneCollidableMeshList.push(totemThree);
    levelOneCollidableMeshList.push(totemFour);

    loadModel("models/totems/frog.glb", "frog");
    loadModel("models/totems/eagle.glb", "eagle");
    loadModel("models/totems/lion.glb", "lion");
    loadModel("models/totems/rooster.glb", "rooster");

    totemCollection.rotation.set(0, Math.PI/2, 0);
    totemCollection.position.set(-10, 0, -635);

    scene.add(totemCollection);
}

function drawPaper() {
    paper_clueOne = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueOne.rotation.y = Math.random() * 2*Math.PI;
    paper_clueOne.position.set(-20, 0, -625);
    paper_clueOne.name = "clueOne";
    levelOneCollidableMeshList.push(paper_clueOne);

    paper_clueTwo = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueTwo.rotation.y = Math.random() * 2*Math.PI;
    paper_clueTwo.position.set(25, 0, -620);
    paper_clueTwo.name = "clueTwo";
    levelOneCollidableMeshList.push(paper_clueTwo);

    paper_clueThree = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueThree.rotation.y = Math.random() * 2*Math.PI;
    paper_clueThree.position.set(-15, 0, -675);
    paper_clueThree.name = "clueThree";
    levelOneCollidableMeshList.push(paper_clueThree);

    paper_clueFour = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueFour.rotation.y = Math.random() * 2*Math.PI;
    paper_clueFour.position.set(-10, 0, -590);
    paper_clueFour.name = "clueFour";
    levelOneCollidableMeshList.push(paper_clueFour);

    scene.add(paper_clueOne);
    scene.add(paper_clueTwo);
    scene.add(paper_clueThree);
    scene.add(paper_clueFour);
}

function drawHealthPacks() {
    loadModel("models/environment/healthpack/healthpack.glb", "healthpack");
    // let healthPack = new THREE.Object3D();

    // let healthPackGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    // let healthPackMaterial = new THREE.MeshLambertMaterial( {color: "#ff0000", transparent: true} );

    // let centre = new THREE.Mesh(healthPackGeometry, healthPackMaterial.clone());

    // let left = new THREE.Mesh(healthPackGeometry, healthPackMaterial.clone());
    // left.position.set(-0.5, 0, 0);

    // let right = new THREE.Mesh(healthPackGeometry, healthPackMaterial.clone());
    // right.position.set(0.5, 0, 0);

    // let top = new THREE.Mesh(healthPackGeometry, healthPackMaterial.clone());
    // top.position.set(0, 0.5, 0);

    // let bottom = new THREE.Mesh(healthPackGeometry, healthPackMaterial.clone());
    // bottom.position.set(0, -0.5, 0);

    // healthPack.add(centre);
    // healthPack.add(left);
    // healthPack.add(right);
    // healthPack.add(top);
    // healthPack.add(bottom);

    // let healthPackOne = healthPack.clone();
    // let healthPackTwo = healthPack.clone();
    // let healthPackThree = healthPack.clone();

    // healthPackOne.position.set(-245, 1, -1050);
    // healthPackTwo.position.set(-240, 1, -1050);
    // healthPackThree.position.set(-235, 1, -1050);

    // healthPackCollidableMeshList.push(healthPackOne);
    // healthPackCollidableMeshList.push(healthPackTwo);
    // healthPackCollidableMeshList.push(healthPackThree);

    // scene.add(healthPackOne);
    // scene.add(healthPackTwo);
    // scene.add(healthPackThree);
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
            levelOnePuzzle();
            puzzleOneBoundingBox();
            break;
        case 2:
            levelTwoBoundingBox();
            break;
        case 2.5:
            levelTwoPuzzle();
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
            currentBox = 1;           
            boxArr[1] = true;  
            break;
        case 2:
            currentBox = 2; 
            boxArr[2] = true;
            break;
        case 3:
            currentBox = 3; 
            boxArr[3] = true;
            break;
        case 4:
            currentBox = 4; 
            boxArr[4] = true;
            break;
        case 5:
            currentBox = 5; 
            boxArr[5] = true;
            break;
        case 6:
            currentBox = 6; 
            boxArr[6] = true;
            break;
        case 7:
            currentBox = 7; 
            boxArr[7] = true;
            break;
        case 8:
            currentBox = 8; 
            boxArr[8] = true;
            break;
    }
    // console.clear();
    // console.log("Level: " + level + ", Box: " + boxArr.findIndex(item => item == true));
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
        if(zPos < boxTwoBottom + 20) { // Show level one tooltip
            displayTooltip("The path is blocked. Find a way around!");
        }

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
        hideTooltip(); // Hide the tooltip once the secret path is found

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
            completedTooltip = false;
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

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 1.5);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 1.5);
    }
    
    if(boxArr[1]) { // In box one
        if(zPos < -615) { // Show puzzle one tooltip
             displayTooltip("The environment may contain useful information.");
        }

        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxOneBottom - boundaryFactor;
        }
        if(zPos < boxOneTop + boundaryFactor) { // Place top boundary
            if(finishedPuzzleOne && boulder_one.position.y < -8) { // Allow player through the path only after the puzzle is completed and the rock has sufficiently sunk
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
    if(boulder_one.position.y < 0) { // Move the rock back up to it's original position
        boulder_one.position.y += 0.02;
    }

    hideTooltip(); // Hides the first puzzle's tooltip if it's still visible

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
        handleHealthPacks();
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
            inPuzzleTwo = false;
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

        if(item.originalPosition.distanceTo(item.bullet.position) > 200) { // Restrict the bullet from travelling past 200 units
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

        let intersects = item.raycaster.intersectObjects(bulletCollidableMeshList, true);
        
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
                            damageAlien(alien1, intersect);
                            break;
                        case "alien2":
                            damageAlien(alien2, intersect);
                            break;
                        case "alien3":
                            damageAlien(alien3, intersect);
                            break;
                        case "alien4":
                            damageAlien(alien4, intersect);
                            break;
                        case "alien5":
                            damageAlien(alien5, intersect);
                            break;
                        case "alien6":
                            damageAlien(alien6, intersect);
                            break;
                        case "alien7":
                            damageAlien(alien7, intersect);
                            break;
                        case "alien8":
                            damageAlien(alien8, intersect);
                            break;
                        case "alien9":
                            damageAlien(alien9, intersect);
                            break;
                        case "alien10":
                            damageAlien(alien10, intersect);
                            break;
                        case "alien11":
                            damageAlien(alien11, intersect);
                            break;
                        case "alien12":
                            damageAlien(alien12, intersect);
                            break;
                        case "alien13":
                            damageAlien(alien13, intersect);
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

function updateAlienBullet(alien) {
    if(alien.weapon.bullets.length > 2) {
        scene.remove(alien.weapon.bullets[0].bullet);
        alien.weapon.bullets.shift();
    }
    
    alien.weapon.bullets.forEach((item, index) => {

        if(item.originalPosition.distanceTo(item.bullet.position) > 200) { // Restrict the bullet from travelling past 200 units
            scene.remove(item.bullet); // Remove the bullet from the scene
            alien.weapon.bullets.splice(index, 1); // Remove the bullet from the array
            return; // Iterate to the next bullet
        }

        item.bullet.translateZ(300 * clock.delta);
        item.bullet.getWorldPosition(item.raycaster.ray.origin); // Update the ray's new origin as the bullet's current position

        item.raycaster.ray.set(item.raycaster.ray.origin, item.raycaster.ray.direction);

        // scene.add(new THREE.ArrowHelper(item.raycaster.ray.direction, item.raycaster.ray.origin, 1));

        let intersects = item.raycaster.intersectObjects([player.hitbox.mesh], true);

        if(intersects.length > 0) {
            let intersect = intersects[0];
            let distance_one = intersect.distance;
            let distance_twoVec = new THREE.Vector3();
            distance_twoVec.subVectors(item.bullet.position, item.lastPosition);
            let distance_two = distance_twoVec.length();

            if(distance_one <= distance_two) { // Alien bullet hit player
                if(audioCollection.playerInjured.isPlaying) {
                    audioCollection.playerInjured.stop();
                }
                audioCollection.playerInjured.play();
                player.currentHealth -= 35;
                
                if(player.currentHealth < 0) {
                    player.currentHealth = 0;
                    audioCollection.playerDeath.play();
                    playerDeath.classList.add("fadein");
                    playerDeath.style.visibility = "visible";
                    setTimeout(() => audioCollection.deathAudio.play(), 500);
                    controls.unlock();
                }
                updatePlayerHealth();
            }
        }
        item.lastPosition.copy(item.bullet.position);
    });

    if(alien.weapon.cooldown > 0) {
        alien.weapon.cooldown -= 1;
    }
}

/**
 * Called when a bullet from the player collides with an alien.
 * Checks where the bullet collided with the current alien and reduces the alien's health accordingly.
 * Changes the crosshair to the hitmarker when a collision takes place.
 * Plays death animation for the current alien when health drops to zero and removes the hitbox from the scene.
 * @param {alien} alien The alien that was shot
 * @param {*} intersect First index of the intersects array
 */
function damageAlien(alien, intersect) {
    if(intersect.object.name == "head") { // Headshot
        alien.currentHealth -= 100;
        if(audioCollection.headshotAnnouncer.isPlaying) {
            audioCollection.headshotAnnouncer.stop();
        }
        if(audioCollection.headshot.isPlaying) {
            audioCollection.headshot.stop();
        }
        audioCollection.headshotAnnouncer.play();
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
        updateAlienAnimation(alien, alien.deathAnim);
        let indexOfCollidableMesh = bulletCollidableMeshList.indexOf(alien.hitbox.mesh);
        bulletCollidableMeshList.splice(indexOfCollidableMesh, 1);
        alien.model.remove(alien.hitbox.mesh);
    }

    setTimeout(() => {
        crosshair.style.background = "url(hud/crosshairs/crosshair.svg)";
        crosshair.style.filter = "none";
    }, 300);
}

/**
 * Called every game loop.
 * Checks whether the auxiliary "trailing" health bar is the same width as the primary health bar.
 * If they are not the same, reduce the trailing health bar's width to match the primary's width after a short delay.
 */
function updateHealthBar() {
    if(healthbarTrailingWidth != healthbarWidth) {
        setTimeout(() => {
            if(healthbarWidth < healthbarTrailingWidth) { // If the primary health bar has a shorter width than the trailing health bar i.e. the player has just been shot
                healthbarTrailingWidth -= 0.1; // Need to decrease the trailing health bar's width to match
            }
            
            if(healthbarTrailingWidth < healthbarWidth) {
                console.log('matched width');
                healthbarTrailingWidth = healthbarWidth;
            }
            healthbarTrailing.setAttribute("style", "width: " + healthbarTrailingWidth + "%");
        }, 1000);
    }
}

/**
 * Called whenever the player's health changes. This could be a decrease from receiving damage or an increase from healing.
 * Updates the CSS elements (health bar, health number) appropriately.
 */
function updatePlayerHealth() {
    if(player.currentHealth >= 100) { // Account for the extra 0.25% on the width of the health bar
        healthbar.setAttribute("style", "width: 10.25%");
        healthbarWidth = 10.25;
    }
    else {
        healthbar.setAttribute("style", "width: " + player.currentHealth / 10.25 + "%");
        healthbarWidth = player.currentHealth / 10.25;
    }
    healthNumber.innerHTML = player.currentHealth;
}

function alienCanShoot(alien) {
    return alien.currentHealth > 0 && player.currentHealth > 0 && inRangeOfPlayer(alien) && 
        alien.canShoot.level == currentLevel && alien.canShoot.box <= currentBox;
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

/** Takes in a new alien animation to play.
 *  Disables the current animation and plays the new one.
 *  @param {alien} alien The target alien
 *  @param {animation} newAnimation The new animation to play 
 */
function updateAlienAnimation(alien, newAnimation) {
    if(newAnimation == alien.shootAnim && alien.currentAnimation == alien.shootAnim) {
        alien.currentAnimation.enabled = false;
        setTimeout(() => alien.currentAnimation.enabled = true, 1);
    }
    else {
        alien.currentAnimation.enabled = false;
        alien.currentAnimation = newAnimation;
        alien.currentAnimation.enabled = true;
    }
}

/**
 * Called when the player is in an area with health packs.
 * Handles the raycasting logic to allow them to pick up the health packs and regenerate health.
 */
function handleHealthPacks() {
    let cameraDirection = new THREE.Vector3();
    cameraDirection.normalize();
    controls.getDirection(cameraDirection);
    let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

    let intersects = playerRaycaster.intersectObjects(healthPackCollidableMeshList, true);

    if(intersects.length > 0 && intersects[0].distance < 10) {
        interact.style.visibility = "visible";
        interactableObject = "healthpack";
        selectedHealthPack = intersects[0];
    }
    else {
        interact.style.visibility = "hidden";
    }
}

function healthPackPickup() {
    if(player.currentHealth == 100) {
        audioCollection.wrongTotemOrder.play(); 
        return;
    }

    pickedUpHealthPacks.push(selectedHealthPack.object);
    let indexOfHealthPack = healthPackCollidableMeshList.indexOf(selectedHealthPack.object);
    healthPackCollidableMeshList.splice(indexOfHealthPack, 1);
    scene.remove(selectedHealthPack.object);

    if(player.currentHealth < 100) {
        player.currentHealth += 25;
        if(player.currentHealth > 100) {
            player.currentHealth = 100;
        }
        updatePlayerHealth();
    }

    if(audioCollection.healthRefill.isPlaying) {
        audioCollection.healthRefill.stop();
    }
    audioCollection.healthRefill.play();
}

function loadTexture(url) {
    function callback(material) {
        if(material) {
            material.map = texture;
            material.needsUpdate = true;
        }
    }
    let texture = textureLoader.load(url, callback);
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
                initBountyHunterModels(gltf);
                break;
            case "weapon":
                initWeapon(gltf);
                break;
            case "healthpack":
                initHealthPacks(gltf);
                break;
            case "pinetree":
                initPineTree(gltf);
                break;
            case "broadleaf":
                initBroadLeaf(gltf);
                break;
            case "blocking_tree":
                initBlockingTree(gltf);
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
            case "rock_five":
                initRockFive(gltf);
                break;
            case "rock_over_clue_one":
                initRockOverClueOne(gltf);
                break;
            case "rock_over_clue_two":
                initRockOverClueTwo(gltf);
                break;
            case "rock_over_clue_three":
                initRockOverClueThree(gltf);
                break;
            case "rock_over_clue_four":
                initRockOverClueFour(gltf);
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
            case "eagle":
                eagle = gltf.scene.children[0];
                eagle.scale.set(0.2, 0.2, 0.2);
                eagle.rotation.set(0, Math.PI/4, 0);
                eagle.position.copy(totemOne.position);
                eagle.position.y = 12;
                totemCollection.add(eagle);
                break;
            case "frog":
                frog = gltf.scene.children[0];
                frog.scale.set(1.65, 1.65, 1.65);
                frog.position.copy(totemTwo.position);
                frog.position.y = 12;
                totemCollection.add(frog);
                break;
            case "lion":
                lion = gltf.scene.children[0];
                lion.scale.set(0.0375, 0.0375, 0.0375);
                lion.position.copy(totemThree.position);
                lion.position.y = 12;
                totemCollection.add(lion);
                break;
            case "rooster":
                rooster = gltf.scene.children[0];
                rooster.scale.set(0.075, 0.075, 0.075);
                rooster.rotation.set(0, -Math.PI/4, 0);
                rooster.position.copy(totemFour.position);
                rooster.position.y = 12;
                totemCollection.add(rooster);
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
        case "headshot_announcer":
            audioCollection.headshotAnnouncer = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.headshotAnnouncer.setBuffer(buffer);
                audioCollection.headshotAnnouncer.setLoop(false);
                audioCollection.headshotAnnouncer.setVolume(0.3);
            });
            break;
        case "headshot":
            audioCollection.headshot = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.headshot.setBuffer(buffer);
                audioCollection.headshot.setLoop(false);
                audioCollection.headshot.setVolume(0.2);
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
        case "paper":
            audioCollection.paper = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.paper.setBuffer(buffer);
                audioCollection.paper.setLoop(false);
                audioCollection.paper.setVolume(0.3);
            });
            break;
        case "totem_select":
            audioCollection.totemSelect = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.totemSelect.setBuffer(buffer);
                audioCollection.totemSelect.setLoop(false);
                audioCollection.totemSelect.setVolume(0.3);
            });
            break;
        case "wrong_totem_order":
            audioCollection.wrongTotemOrder = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.wrongTotemOrder.setBuffer(buffer);
                audioCollection.wrongTotemOrder.setLoop(false);
                audioCollection.wrongTotemOrder.setVolume(0.3);
            });
            break;
        case "correct_totem_order":
            audioCollection.correctTotemOrder = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.correctTotemOrder.setBuffer(buffer);
                audioCollection.correctTotemOrder.setLoop(false);
                audioCollection.correctTotemOrder.setVolume(0.3);
            });
            break;
        case "rock_sink":
            audioCollection.rockSink = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.rockSink.setBuffer(buffer);
                audioCollection.rockSink.setLoop(false);
                audioCollection.rockSink.setVolume(0.5);
            });
            break;
        case "rock_slide":
            audioCollection.rockSlide = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.rockSlide.setBuffer(buffer);
                audioCollection.rockSlide.setLoop(false);
                audioCollection.rockSlide.setVolume(0.5);
            });
            break;
        case "tooltip_completed":
            audioCollection.tooltipCompleted = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.tooltipCompleted.setBuffer(buffer);
                audioCollection.tooltipCompleted.setLoop(false);
                audioCollection.tooltipCompleted.setVolume(0.5);
            });
            break;
        case "alien_weapon_shot":
            audioCollection.alienWeapon = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.alienWeapon.setBuffer(buffer);
                audioCollection.alienWeapon.setLoop(false);
                audioCollection.alienWeapon.setVolume(0.3);
            });
            break;
        case "player_injured":
            audioCollection.playerInjured = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.playerInjured.setBuffer(buffer);
                audioCollection.playerInjured.setLoop(false);
                audioCollection.playerInjured.setVolume(0.3);
            });
            break;
        case "player_death":
            audioCollection.playerDeath = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.playerDeath.setBuffer(buffer);
                audioCollection.playerDeath.setLoop(false);
                audioCollection.playerDeath.setVolume(0.3);
            });
            break;
        case "death_audio":
            audioCollection.deathAudio = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.deathAudio.setBuffer(buffer);
                audioCollection.deathAudio.setLoop(false);
                audioCollection.deathAudio.setVolume(0.5);
            });
            break;
         case "chicken_dance":
            audioCollection.chickenDance = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.chickenDance.setBuffer(buffer);
                audioCollection.chickenDance.setLoop(false);
                audioCollection.chickenDance.setVolume(0.25);
            });
            break;
        case "gangnam_style":
            audioCollection.gangnamStyle = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.gangnamStyle.setBuffer(buffer);
                audioCollection.gangnamStyle.setLoop(false);
                audioCollection.gangnamStyle.setVolume(0.25);
            });
            break;
        case "macarena_dance":
            audioCollection.macarenaDance = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.macarenaDance.setBuffer(buffer);
                audioCollection.macarenaDance.setLoop(false);
                audioCollection.macarenaDance.setVolume(0.25);
            });
            break;
        case "ymca_dance":
            audioCollection.ymcaDance = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.ymcaDance.setBuffer(buffer);
                audioCollection.ymcaDance.setLoop(false);
                audioCollection.ymcaDance.setVolume(0.25);
            });
            break;
        case "incorrect":
            audioCollection.incorrect = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.incorrect.setBuffer(buffer);
                audioCollection.incorrect.setLoop(false);
                audioCollection.incorrect.setVolume(0.75);
            });
            break;
        case "correct":
            audioCollection.correct = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.correct.setBuffer(buffer);
                audioCollection.correct.setLoop(false);
                audioCollection.correct.setVolume(0.75);
            });
            break;
        case "record_scratch":
            audioCollection.recordScratch = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.recordScratch.setBuffer(buffer);
                audioCollection.recordScratch.setLoop(false);
                audioCollection.recordScratch.setVolume(0.5);
            });
            break;
        case "health_refill":
            audioCollection.healthRefill = new THREE.Audio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.healthRefill.setBuffer(buffer);
                audioCollection.healthRefill.setLoop(false);
                audioCollection.healthRefill.setVolume(0.5);
            });
            break;
    }
}

function respawnAliens() {
    alienArray.forEach(alien => {
        if(alien.currentHealth < 100) {
            alien.currentHealth = 100;
            alien.model.add(alien.hitbox.mesh);
            bulletCollidableMeshList.push(alien.hitbox.mesh);
            alien.deathAnim.clampWhenFinished = false;
        }
    });
}

function restartLastCheckpoint() {
    if(audioCollection.deathAudio.isPlaying) {
        audioCollection.deathAudio.stop();
    }

    pickedUpHealthPacks.forEach(healthPack => {
        scene.add(healthPack);
        healthPackCollidableMeshList.push(healthPack);
    });

    pickedUpHealthPacks = [];

    playerDeath.classList.remove("fadein");
    playerDeath.style.visibility = "hidden";

    player.velocityX = 0;
    player.velocityY = 0;
    player.velocityZ = 0;

    player.currentHealth = 100;
    healthbar.setAttribute("style", "width: 10.25%");
    healthbarTrailing.setAttribute("style", "width: 10.25%");
    healthNumber.innerHTML = player.currentHealth;
    healthbarWidth = 10.25;
    healthbarTrailingWidth = healthbarWidth;

    controls.lock();

    switch(currentLevel) {
        case 1:
            controls.getObject().position.set(0, 8, 0);
            camera.lookAt(0, 8, -1);
            break;
        case 2:
            controls.getObject().position.set(0, 8, -720);
            camera.lookAt(0, 8, -720);
            respawnAliens();
    }
}

function displayTooltip(message) {
    if(!completedTooltip) {
        tooltip.innerHTML = message;
        tooltip.style.visibility = "visible";
    }
    tooltipVisible = true;
}

function hideTooltip() {
    if(!completedTooltip) {
        tooltip.style.visibility = "hidden";
        audioCollection.tooltipCompleted.play();
    }
    completedTooltip = true;
    tooltipVisible = false;
}

/**
 * Called in the game loop when checking if a given alien must shoot at the player.
 * Returns true if the player is within 250 units of the alien in question.
 * @param {alien} alien The alien that is checked to see if they are in range of the player.
 */
function inRangeOfPlayer(alien) {
    return alien.model.position.clone().distanceTo(player.playerModel.position.clone()) < 250;
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
    // renderer.shadowMap.enabled = true;
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
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
    camera.position.set(0, 8, 0);
    scene.add(camera);

    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y - 2, camera.position.z + 26);
    camera.add(thirdPersonCamera);

    cameraType = "fp";

    birdsEyeViewCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
    birdsEyeViewCamera.position.set(-15, 8, -20);
    birdsEyeViewCamera.lookAt(0, 8, -20);
    scene.add(birdsEyeViewCamera);

    puzzleTwoCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
}

function initLights() {
    ambientLight = new THREE.AmbientLight("white", 0.15);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight("white", 1.5);
    pointLight.distance = 40;
    pointLight.castShadow = true;
    pointLight.shadow.bias = 0.005;
    camera.add(pointLight);
    camera.children[1].position.y = 5; // Lower the point light from 8 to 5

    spotLight = new THREE.SpotLight("green", 0, 0, Math.PI/5, 0, 2);
    scene.add(spotLight);
}

function initControls() {
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    document.addEventListener("click", initialPointerLock);

    function initialPointerLock() {
        controls.lock();
        wakeUp.classList.add("fadeout");
        setTimeout( () => wakeUp.style.visibility = "hidden", 1000); // Hide the initial screen after 1 second (the length of the fade-out animation)
        document.body.appendChild(stats.dom);
        document.removeEventListener("click", initialPointerLock);
        resume.addEventListener("click", () => controls.lock());
        restart.addEventListener("click", restartLastCheckpoint);
        lockingClick = false;
    }

    controls.addEventListener("lock", lock);
    controls.addEventListener("unlock", unlock);

    function lock() {
        controls.isLocked = true;
        lockingClick = false;
        if(!audioCollection.wildlife.isPlaying)
            audioCollection.wildlife.play();
        health.style.visibility = "visible";
        crosshair.style.visibility = "visible";
        if(tooltipVisible) {
            tooltip.style.visibility = "visible";
        }

        pauseBlock.style.display = "none";
        deathBlock.style.display = "none";
    }

    function unlock() {
        controls.isLocked = false;
        lockingClick = true;
        audioCollection.wildlife.pause();
        health.style.visibility = "hidden";
        crosshair.style.visibility = "hidden";
        if(tooltipVisible) {
            tooltip.style.visibility = "hidden";
        }

        if(player.currentHealth > 0) {
            pauseBlock.style.display = "block";
        }
        else {
            setTimeout(() => deathBlock.style.display = "block", 5000);
        }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    function onKeyDown(event) {

        event.preventDefault();

        switch(event.keyCode) {
            case 87:    // W
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                player.movingForward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.walkAnim);
                break;
            case 65:    // A
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                player.movingLeft = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.strafeLAnim);
                break;
            case 83:    // S
                if(inPuzzleTwo && !finishedPuzzleTwo) return;
            
                player.movingBackward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.backwardsAnim);
                break;
            case 68:    // D
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                player.movingRight = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.strafeRAnim);
                break;
            case 32:    // Space
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                if(!player.jumping) {
                    player.jumping = true;
                    player.velocityY += 150;
                    handleJumpAnimation();
                }
                break;
            case 16:    // Shift
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                if(!player.running) {
                    player.running = true;
                    if(player.movingForward && !player.movingLeft && !player.movingRight) {
                        player.runFactor = 1.5;
                        updatePlayerAnimation(player.runAnim);
                    }
                }
                break;
            case 112:   // F1
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                cameraType = "fp";
                crosshair.style.top = "50.625%";
                crosshair.style.transform = "translate(-50%, -50.625%)"; 
                break;
            case 113:   // F2
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

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
            case 114:   // F3
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                cameraType = "bev"; break;
            case 84:  // R
                controls.getObject().position.set(0, 8, -720);
                currentLevel = 2;
                break;
            case 84:  // T
                controls.getObject().position.set(460, 8, -945);
                currentLevel = 3;
                break;
            case 89:    // Y
                currentLevel = 2;
                controls.getObject().position.set(460, 8, -1090);
                camera.lookAt(460, 8, -1080);
                break;
            case 69:    // E
                if(interact.style.visibility == "visible") {
                    switch(interactableObject) {
                        case "totem":
                            if(audioCollection.totemSelect.isPlaying) {
                                audioCollection.totemSelect.stop();
                            }
                            audioCollection.totemSelect.play();
                            updateTotemSelection();
                            break;
                        case "rockOverClueOne":
                            updateRockOverClue(rockOverClueOne, "rockOverClueOne");
                            break;
                        case "rockOverClueTwo":
                            updateRockOverClue(rockOverClueTwo, "rockOverClueTwo");
                            break;
                        case "rockOverClueThree":
                            updateRockOverClue(rockOverClueThree, "rockOverClueThree");
                            break;
                        case "rockOverClueFour":
                            updateRockOverClue(rockOverClueFour, "rockOverClueFour");
                            break;
                        case "clueOne":
                            audioCollection.paper.play();
                            showClue("clueOne");
                            break;
                        case "clueTwo":
                            audioCollection.paper.play();
                            showClue("clueTwo");
                            break;
                        case "clueThree":
                            audioCollection.paper.play();
                            showClue("clueThree");
                            break;
                        case "clueFour":
                            audioCollection.paper.play();
                            showClue("clueFour");
                            break;   
                        case "healthpack":
                            healthPackPickup();
                            break;       
                    }
                }
                break;
            case 49:    // 1
                if(!inPuzzleTwo || finishedPuzzleTwo) return;
                updatePlayerAnimation(player.chickenDance);
                checkDance();
                break;
            case 50:    // 2
                if(!inPuzzleTwo || finishedPuzzleTwo) return;
                updatePlayerAnimation(player.breakdance);
                checkDance();
                break;
            case 51:    // 3
                if(!inPuzzleTwo || finishedPuzzleTwo) return;
                updatePlayerAnimation(player.macarenaDance);
                checkDance();
                break;
            case 52:    // 4
                if(!inPuzzleTwo || finishedPuzzleTwo) return;
                updatePlayerAnimation(player.ymcaDance);
                checkDance();
                break;
            case 53:    // 5
                if(!inPuzzleTwo || finishedPuzzleTwo) return;
                updatePlayerAnimation(player.gangnamStyle);
                checkDance();
                break;
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
    let cube = new THREE.Mesh(new THREE.BoxGeometry(3000, 1000, 4000), material);
    cube.position.y += 250;
    scene.add(cube);
}

function initLoadingManager() {
    loadingManager = new THREE.LoadingManager(onLoad, onProgress);

    function onLoad() {
        loadingInfo.style.display = "none";
        loadingSymbol.style.display = "none";
        wakeUp.style.visibility = "visible";
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
    player = new Player();
    player.hitbox = new Hitbox("player");

    loadModel("models/characters/player/player_gun.glb", "player_gun");
    loadModel("models/characters/player/playermodel.glb", "player");
}

function initAliens() {
    alien1 = new Alien();
    alien2 = new Alien();
    alien3 = new Alien();
    alien4 = new Alien();
    alien5 = new Alien();
    alien6 = new Alien();
    alien7 = new Alien();
    alien8 = new Alien();
    alien9 = new Alien();
    alien10 = new Alien();
    alien11 = new Alien();
    alien12 = new Alien();
    alien13 = new Alien();

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

    document.addEventListener("mousedown", createPlayerBullet);
}

function initHealthPacks(gltf) {
    let healthPackOne = gltf.scene.children[0];
    healthPackOne.scale.set(0.5, 0.5, 0.5);
    let healthPackTwo = healthPackOne.clone();
    let healthPackThree = healthPackOne.clone();

    healthPackOne.position.set(-245, 1, -1050);
    healthPackOne.rotation.y = Math.random() * 2*Math.PI;

    healthPackTwo.position.set(-240, 1, -1050);
    healthPackTwo.rotation.y = Math.random() * 2*Math.PI;

    healthPackThree.position.set(-235, 1, -1050);
    healthPackThree.rotation.y = Math.random() * 2*Math.PI;

    healthPackCollidableMeshList.push(healthPackOne);
    healthPackCollidableMeshList.push(healthPackTwo);
    healthPackCollidableMeshList.push(healthPackThree);
    
    scene.add(healthPackOne);
    scene.add(healthPackTwo);
    scene.add(healthPackThree);
}

function createPlayerBullet() {
    if(lockingClick || player.weapon.cooldown != 0 || (inPuzzleTwo && !finishedPuzzleTwo)) return;

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

function createAlienBullet(alien) {
    if(alien.currentHealth <= 0 || alien.weapon.cooldown != 0) return;

    let cylinderGeometry = new THREE.CylinderBufferGeometry(0.05, 0.05, 5);
    cylinderGeometry.rotateX(-Math.PI/2);
    let singleBullet = new THREE.Mesh(cylinderGeometry, new THREE.MeshBasicMaterial( {color: "#ff0000"} ));
    alien.weapon.bulletStart.getWorldPosition(singleBullet.position);
    singleBullet.rotation.copy(alien.model.rotation);

    let lastPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);
    let originalPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);

    let direction = new THREE.Vector3();
    direction = player.playerModel.position.clone().sub(alien.model.position);

    let origin = new THREE.Vector3();
    singleBullet.getWorldPosition(origin);

    let raycaster = new THREE.Raycaster(origin, direction.normalize());

    alien.weapon.bullets.push({bullet: singleBullet, raycaster: raycaster, lastPosition: lastPosition, originalPosition: originalPosition});
    scene.add(singleBullet);

    if(audioCollection.alienWeapon.isPlaying) {
        audioCollection.alienWeapon.stop();
    }
    audioCollection.alienWeapon.play();

    updateAlienAnimation(alien, alien.shootAnim);
    
    alien.weapon.cooldown = Math.floor(Math.random() * 30 + 30); // Random cooldown between 30 and 60
}

function initAudio() {
    listener = new THREE.AudioListener();
    camera.add(listener);

    audioCollection = new AudioCollection();

    loadAudio("audio/environment/wildlife.wav", "wildlife");
    loadAudio("audio/weapon/weapon_shot.mp3", "weapon");
    loadAudio("audio/weapon/headshot_announcer.mp3", "headshot_announcer");
    loadAudio("audio/weapon/headshot.wav", "headshot");
    loadAudio("audio/weapon/hitmarker.mp3", "hitmarker");
    loadAudio("audio/items/paper.wav", "paper");
    loadAudio("audio/character/jump_boost.wav", "jump_boost");
    loadAudio("audio/environment/level_one/totem_select.wav", "totem_select");
    loadAudio("audio/environment/level_one/wrong_totem_order.wav", "wrong_totem_order");
    loadAudio("audio/environment/level_one/correct_totem_order.wav", "correct_totem_order");
    loadAudio("audio/environment/level_one/rock_sink.wav", "rock_sink");
    loadAudio("audio/environment/level_one/rock_slide.wav", "rock_slide");
    loadAudio("audio/hud/tooltip_completed.mp3", "tooltip_completed");
    loadAudio("audio/weapon/alien_weapon_shot.wav", "alien_weapon_shot");
    loadAudio("audio/character/player_injured.wav", "player_injured");
    loadAudio("audio/character/player_death.wav", "player_death");
    loadAudio("audio/character/death_audio.wav", "death_audio");
    loadAudio("audio/songs/chicken_dance.mp3", "chicken_dance");
    loadAudio("audio/songs/gangnam_style.mp3", "gangnam_style");
    loadAudio("audio/songs/macarena.mp3", "macarena_dance");
    loadAudio("audio/songs/ymca.mp3", "ymca_dance");
    loadAudio("audio/songs/incorrect.wav", "incorrect");
    loadAudio("audio/songs/correct.mp3", "correct");
    loadAudio("audio/songs/record_scratch.wav", "record_scratch");
    loadAudio("audio/character/health_refill.wav", "health_refill");
}

function initWorld() {
    // drawTrees();
    // drawBushes();
    drawGround();
    drawRocks();
    drawStars();
    drawTotems();
    drawPaper();
    drawHealthPacks();

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
        case "puzzleTwo": renderer.render(scene, puzzleTwoCamera); break;
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
    initLoadingManager();
    initLoaders();
    initSkybox();
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