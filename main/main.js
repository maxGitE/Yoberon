import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { SkeletonUtils } from 'https://threejs.org/examples/jsm/utils/SkeletonUtils.js';
import Stats from 'https://cdn.rawgit.com/mrdoob/stats.js/master/src/Stats.js';

let stats = new Stats();
stats.showPanel(0);

// let rendererStats = new THREEx.RendererStats();
// rendererStats.domElement.style.position	= 'fixed'
// rendererStats.domElement.style.right = '0px'
// rendererStats.domElement.style.bottom = '0px'
// document.body.appendChild(rendererStats.domElement);

const title = document.getElementById("title");
const menuBlock = document.getElementById("menu");
const keyControls = document.getElementById("controls");
const textures = document.getElementById("texture-quality");
const controlsButtonMainMenu = document.getElementById("controls-button-mainmenu");
const controlsButtonPauseMenu = document.getElementById("controls-button-pausemenu");
const shadowsButton = document.getElementById("shadows");
const menuCinematic = document.getElementById("menu-cinematic");
const introCutScene = document.getElementById("intro-cutscene");
const skipButton = document.getElementById("skip");
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
const shield = document.getElementById("shield");
const shieldbar = document.getElementById("shieldbar");
const shieldDisplay = document.getElementById("shield-display");
const shieldNumber = document.getElementById("shield-number");
const weaponUpgrade = document.getElementById("weapon-upgrade");
const weaponUpgradeBar = document.getElementById("weapon-upgrade-bar");
const poisonTick = document.getElementById("poison-tick");
const bossHealth = document.getElementById("boss-health");
const bossHealthBar = document.getElementById("boss-healthbar");
const puzzleBlock = document.getElementById("puzzle-failed");
const restartPuzzle = document.getElementById("restart-puzzle")
const crosshair = document.getElementById("crosshair");
const weaponCooldownBar = document.getElementById("weaponcooldown");
const interact = document.getElementById("interact");
const tooltip = document.getElementById("tooltip");
const checkpoint = document.getElementById("checkpoint");
const paper = document.getElementById("paper");
const cluePaper = document.getElementById("clue-paper");
const alienText = document.getElementById("alien-text");
const englishText = document.getElementById("english-text");
const scrollPaper = document.getElementById("scroll-paper");
const scrollTitle = document.getElementById("scroll-title");
const alienScroll = document.getElementById("alien-scroll");
const englishScroll = document.getElementById("english-scroll");
const dancecontrols = document.getElementById("dancecontrols");
const danceResults = document.getElementById("dance-circles");
const danceCorrect1 = document.getElementById("correct1");
const danceCorrect2 = document.getElementById("correct2");
const danceCorrect3 = document.getElementById("correct3");
const danceCorrect4 = document.getElementById("correct4");
const danceWrong1 = document.getElementById("wrong1");
const danceWrong2 = document.getElementById("wrong2");
const danceWrong3 = document.getElementById("wrong3");
const danceWrong4 = document.getElementById("wrong4");
const danceStrike1 = document.getElementById("strike1");
const danceStrike2 = document.getElementById("strike2");
const playButton = document.getElementById("play");
const loadingInfo = document.getElementById("loadinginfo");
const loadingSymbol = document.getElementById("loadingsymbol");
const endgameFadeIn = document.getElementById("endgame-fade-in");
const endGameDecision = document.getElementById("endgame-decision");
const takeHeartButton = document.getElementById("take-heart");
const leaveHeartButton = document.getElementById("leave-heart");
const takeHeartCutScene = document.getElementById("take-heart-cutscene");
const leaveHeartCutScene = document.getElementById("leave-heart-cutscene");
const creditsCutScene = document.getElementById("credits-cutscene");

window.onload = menu;

/** BOUNDARY BOX GLOBALS */
/** Account for skipped frames and unexpected behaviour with game loop */
let boundaryFactor = 5;
let boxArr = new Array(9);
/** Check which box the player is in as a separate variable to handle combat interactions */
let currentBox;

/** SCENE GLOBALS */
let canvas;
let renderer;
let scene;

/** CAMERAS */
let camera;
let thirdPersonCamera;
let birdsEyeViewCamera;
let puzzleTwoCamera;
let minimapCamera;
let minimapToggle = false;
let cameraType;

/** LIGHTS */
let ambientLight;
let pointLight;
let puzzleSpotLight;
let alienLight;
let speakerLight;

/** AUDIO */
let listener;
let audioCollection;
/** Buffer source for the menu audio */
let menuAudioSource;

/** PLAYER MISC */
let controls;
let clock;
let player;
let currentLevel = 1;
let xPos;
let zPos;
/** Used to hide the weapon upgrade tooltip */
let shotPoisonBullet = false;
/** Used to hide the shield tooltip */
let activatedShield = false;

/** ENEMIES */
let alienArray = [];
let alien1;
let alien2;
let alien3;
let alien4;
let alien5;
let alien6;
let boss;

/** BOUNTY HUNTER */
let bountyArray = [];
let bountyHunter1;
let bountyHunter2;
let bountyHunter3;
let bountyHunter4;

/** SHIP */
let ship;

/** HEART */
let heart;
let interactedWithHeart = false;
let pausedHeartAudio = false;

/** LOADERS */
let textureLoader;
let gltfLoader;
let gltfLoader2;
let audioLoader;
let cubeTextureLoader;
let loadingManager;

/** ANIMATION */
let mixers = [];
let idleCalled = false;

/** SKYBOX */
let skybox;
let skyboxURLs = ["cubemap/space_one/px.png", "cubemap/space_one/nx.png",
                  "cubemap/space_one/py.png", "cubemap/space_one/ny.png", 
                  "cubemap/space_one/pz.png", "cubemap/space_one/nz.png"]

/** OBJECTS */
let ground;
let starFieldA;
let starFieldB;
let pausedRockSinkAudio = false;
let shadowObjects = [];
let tripwireOne;
let tripwireTwo;
let tripwireOneActivated = false;
let tripwireTwoActivated = false;

/** LEVEL 1 */
let pole;
let paper_noteOne;
let noteCollidableMeshlist = [];

/** PUZZLE 1 */
let cameraDirectionPuzzleOne;
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
let puzzleOneCollidableMeshlist = [];
let disposedTotems = false;

/** LEVEL 2 */
let rightOfTree = false;
let onTree = false;
let crateAndBook;
let crateAndDonuts;
let crate;
let book;
let donut;
let donutCollidableMeshlist = [];
let selectedDonut;
let speakers;
let movedBlockingTreesLevelTwo = false;

/** PUZZLE 2 */
let removedLevelTwoAliens = false
let inPuzzleTwo = false;
let finishedPuzzleTwo = false;
let inPositionX  = false;
let inPositionZ = false;
let droppedGun = false;
let spotLightColour = 0;
let chickenDanceCorrect = false;
let gangnamStyleCorrect = false;
let macarenaDanceCorrect = false;
let ymcaDanceCorrect = false;
let danceIncorrect = 0;
let answered = false;
let lastPlayed;
let countCorrect = 0;
let dancePlaying = false;

/** LEVEL 3 */
let spawnedLevelThreeAliens = false;
let holeOne;
let inHole = false;
let barrelsAndScroll;
let holeTwo;
let platform;
let onPlatform = false;
let pausedHoleAudio = false;
let pausedHoleOne = false;
let pausedHoleTwo = false;
let cratesAndScroll;
let screamPlayed = false;
let movedBlockingTreesLevelThree = false;

/** LEVEL 4 */
let bossFightStarted = false;
let inBossFightStartedTimeout = false;
let startWaves = false;
let spawnedLevelFourAliens = false;
let waveDefeated = false;
let inWaveTimeout = false;
let defeatedBoss = false;
let playedRoarAudio = false;
let pausedRoarAudio = false;
let intro = true;
let bossAttacked = false;
let bossWalking = false;
let bossRoaring = false;
let updatedAlienRange = false;
let movedBlockingTreesLevelFour = false;
let endGameBlockingTrees;
let towerOne;
let towerTwo;
let towerThree;
let towerFour;
let orbOne = {mesh: undefined, active: true, statusMesh: undefined, health: 3};
let orbTwo = {mesh: undefined, active: true, statusMesh: undefined, health: 3};
let orbThree = {mesh: undefined, active: true, statusMesh: undefined, health: 3};
let orbFour = {mesh: undefined, active: true, statusMesh: undefined, health: 3};
let towerArray = [];
let orbArray = [orbOne, orbTwo, orbThree, orbFour];
let orbOneHealingRay;
let orbTwoHealingRay;
let orbThreeHealingRay;
let orbFourHealingRay;
let healingRayArray = [];
let resetBossTowers = false;

/** HUD */
let tooltipVisible = false;
let completedTooltip = false;
let healthbarWidth = 10.25;
let healthbarTrailingWidth = healthbarWidth;
let checkpointDisplayed = false;
let interactableObject;

/** GUN */
/** Used to ensure that the gun does not fire when locking the controls */
let lockingClick = true; 
let bulletCollidableMeshList = [];
let orbCollidableMeshList = [];

/** HEALTH PACKS */
let healthPackCollidableMeshList = [];
let selectedHealthPack;
let pickedUpHealthPacks = [];

/** TREES */
let blockingTrees;
let playedTreeAudio = false;
let playedEndGameTreeAudio = false;
let pausedTreeAudio = false;

/** TRANSMISSIONS */
let transmissionCount = 0;
/** Used to play a transmission in the first level sooner than a normal transmission timer  */
let playedInitialTransmission = false;
let pausedTransmissionAudio = false;
let pausedTransmissionOne = false;
let pausedTransmissionTwo = false;

/** MISC */
/** Used to control which models are loaded (high quality, medium quality or low quality) */
let textureQuality = "high";
/** Used to hide / display keyboard controls */
let displayedControls = false;
/** Allows a request for a gameloop frame to be referenced */
let requestId;
/** Needed to clear the weapon upgrade timeout in order for its cooldown to be a consistent 15 seconds */
let poisonTimerId;
/** Allows for a smooth transition from the wake up screen */
let firstUnlock = false;

function gameLoop() {
    requestId = requestAnimationFrame(gameLoop);

    if(player.currentHealth > 0) {

        if(controls.isLocked) {

            clock.timeNow = performance.now();
            clock.delta = (clock.timeNow - clock.timeBefore) / 1000;

            player.velocityX = player.velocityX - player.velocityX * 10 * clock.delta;
            player.velocityY = player.velocityY - 9.807 * 50 * clock.delta;
            player.velocityZ = player.velocityZ - player.velocityZ * 10 * clock.delta;

            if(player.movingLeft) {
                if(inPuzzleTwo && !finishedPuzzleTwo) {
                    player.velocityX = player.velocityX - 50 * clock.delta;
                }
                else {
                    player.velocityX = player.velocityX - 400 * clock.delta * player.runFactor;
                }
            }
            if(player.movingRight) {
                if(inPuzzleTwo && !finishedPuzzleTwo) {
                    player.velocityX = player.velocityX + 50 * clock.delta;
                }
                else {
                    player.velocityX = player.velocityX + 400 * clock.delta * player.runFactor;
                }
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

            // Play footsteps audio if the player is moving
            playFootsteps();

            minimapCamera.position.set(camera.position.x, 0, camera.position.z);

            if(inHole && controls.getObject().position.y <= -10) {
                controls.moveRight(0);
                controls.moveForward(0); // Negate the value as moveForward() uses left-handed coordinates
                controls.getObject().position.y += player.velocityY * clock.delta;
            }
            else {
                controls.moveRight(player.velocityX * clock.delta);
                controls.moveForward(-player.velocityZ * clock.delta); // Negate the value as moveForward() uses left-handed coordinates
                controls.getObject().position.y += player.velocityY * clock.delta;
            }

            if(!inHole) { // Remove gravity when the player is in the hole
                if(onTree) { // Allow the player to land on the fallen tree
                    if(controls.getObject().position.y < 18) {
                        controls.getObject().position.y = 18;
                        player.velocityY = 0;
                    }
                }
                else if(onPlatform) { // Allow the player to land on the platform
                    if(controls.getObject().position.y < 12) {
                        controls.getObject().position.y = 12;
                        player.velocityY = 0;
                    }
                }
                else {
                    if(controls.getObject().position.y < 8) {
                        controls.getObject().position.y = 8;
                        player.velocityY = 0;
                    }
                }
            }
            else if(controls.getObject().position.y < 5) {      
                updatePlayerAnimation(player.animations.fallAnim);
                if(!screamPlayed) {
                    audioCollection.scream.play();
                    screamPlayed = true;
                }                
            }

            player.playerModel.position.x = controls.getObject().position.x;
            player.playerModel.position.z = controls.getObject().position.z;
            player.playerModel.position.y = controls.getObject().position.y - 8;
            if(cameraType == "tp") {
                player.playerModel.visible = true;
                if(controls.getObject().rotation.x * 180 / Math.PI > 12) {
                    controls.getObject().rotation.x = 12 * Math.PI / 180;
                }
                else if(controls.getObject().rotation.x * 180 / Math.PI < -70) {
                    controls.getObject().rotation.x = -70 * Math.PI / 180;
                }

                controls.getObject().rotation.z = 0;
                controls.getObject().rotation.order = "YXZ";
            }
            else if(cameraType != "puzzleTwo") {
              player.playerModel.visible = false;
            }
            player.playerModel.rotation.set(0, controls.getObject().rotation.y, 0);

            if(cameraType == "fp" && !droppedGun) { // Hide the weapon unless the player is in the first person camera mode
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

            // Update hole rotation
            holeOne.rotation.z -= 0.001;
            holeTwo.rotation.z -= 0.001;

            updateLevel();
            updateBullets(); // So anyway I started blasting

            updateAlienCombat(); // So anyway they started blasting

            // Updates the animations on the healthbar if the player has been damaged
            updateHealthBar();

            // Updates the animations on the health packs
            updateHealthPackAnimation();

            // Updates the animation of the player's gun on the ground (before it is picked up)
            if(!player.hasGun && !finishedPuzzleTwo) {
                updateGunOnGroundAnimation();
            }

            // Updates the animation of the player's shield on the ground (before it is picked up)
            if(!player.shield.hasShield) {
                updateShieldOnGroundAnimation();
            }

            // Updates the animation of the weapon upgrade capsule on the ground (before it is picked up)
            if(!player.weaponUpgrade.hasWeaponUpgrade) {
                updateWeaponUpgradeOnGroundAnimation();
            }

            // Updates the animation of the heart on the ground (before it is picked up)
            updateHeartAnimation();

            // Handles recharge of the shield when it is broken
            rechargeShield();

            // Handles playing alien transmissions when transmission count has reached the appropriate value
            playAlienTransmission();

            // Update clock time
            clock.timeBefore = clock.timeNow;
        }
    }
    // if(player.currentHealth <= 0) {
    //     updatePlayerAnimation(player.animations.deathAnim);
    // }

    render();
}

/**
 * Called when the player is in an area with notes.
 * Handles the raycasting logic to allow them to select the note and read it.
 * This function must be called in a bounding box check.
 */
function handleNotes() {
    /** Handle raycasting with the player's position as the origin of the ray and the direction they are looking as the direction of the ray */
    let cameraDirection = new THREE.Vector3();
    cameraDirection.normalize();
    controls.getDirection(cameraDirection);
    let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

    let intersects = playerRaycaster.intersectObjects(noteCollidableMeshlist, true);

    if(intersects.length > 0 && intersects[0].distance < 10) {
        interact.style.visibility = "visible";

        if(intersects[0].object.name == "noteOne") { // Note one
            interactableObject = "noteOne";
        }
        else if(intersects[0].object.name == "noteTwo") { // Note two
            interactableObject = "noteTwo";
        }
        else if(intersects[0].object.name == "noteThree") { // Note three
            interactableObject = "noteThree";
        }
        else if(intersects[0].object.name == "noteFour") { // Note four
            interactableObject = "noteFour";
        }
    }
    else {
        interact.style.visibility = "hidden";
        cluePaper.style.visibility = "hidden";
        scrollPaper.style.visibility = "hidden";
    }
}

/**
 * Called when the player interacts with a note.
 * Shows the note with the relevant text.
 * @param {string} name name of the note to be displayed
 */
function showNote(name) {
    switch(name) {
        case "noteOne":
            cluePaper.style.visibility = "visible";
            alienText.innerHTML = "They are relentless. I haven’t seen my family in weeks but I must stop them, for the sake of my people.";
            englishText.innerHTML = alienText.innerHTML;
            break; 
            
        case "noteTwo":
            cluePaper.style.visibility = "visible";
            alienText.innerHTML = "Our numbers are decreasing fast. We must protect the heart at all costs. The protector is our last hope.";
            englishText.innerHTML = alienText.innerHTML;
            break;

        case "noteThree":
            scrollPaper.style.visibility = "visible";
            scrollTitle.innerHTML = "1846 - Yoberon Chronicles";
            alienScroll.innerHTML = "Since the dawn of time, the heart has powered Yoberon and allowed life to flourish. It must remain untouched, or total destruction shall ensue.";
            englishScroll.innerHTML = alienScroll.innerHTML;
            break;

        case "noteFour":
            scrollPaper.style.visibility = "visible";
            scrollTitle.innerHTML = "1851 - Yoberon Chronicles";
            alienScroll.innerHTML = "The heart is sought after by many in the galaxy for its tremendous power. If harnessed, it can provide unlimited fuel to whatever the user desires.";
            englishScroll.innerHTML = alienScroll.innerHTML;
            break;
    }
}

/**
 * Called when the player is in level two.
 * Handles the raycasting logic to allow them to select the note and donuts.
 * This function must be called in a bounding box check.
 */
function donutRaycast() {
    /** Handle raycasting with the player's position as the origin of the ray and the direction they are looking as the direction of the ray */
    let cameraDirection = new THREE.Vector3();
    cameraDirection.normalize();
    controls.getDirection(cameraDirection);
    let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);
    let intersects = playerRaycaster.intersectObjects(donutCollidableMeshlist, true);

    if(intersects.length > 0 && intersects[0].distance < 10) {
        interact.style.visibility = "visible";
        
        interactableObject = "donut";
        selectedDonut = intersects[0];
    }
    else {
        interact.style.visibility = "hidden";
        cluePaper.style.visibility = "hidden";
    }
}

/** Allow the player to eat a donut */
function eatDonut() {
    let indexToRemove = donutCollidableMeshlist.findIndex(item => item.id == selectedDonut.object.id); // Remove the selected donut from the collidable mesh list
    donutCollidableMeshlist.splice(indexToRemove, 1);

    /** Remove the selected donut from the collection */
    crateAndDonuts.remove(donut);
    
    if(audioCollection.burp.isPlaying) {
        audioCollection.burp.stop();
    }
    audioCollection.burp.play();

    if(player.currentHealth <= 90) {
        player.currentHealth += 10;
        updatePlayerHealth();
    }
}

/********** PUZZLE ONE START **********/
function levelOnePuzzle() {
    if(!finishedPuzzleOne) {
        cameraDirectionPuzzleOne = new THREE.Vector3();
        cameraDirectionPuzzleOne.normalize();
        controls.getDirection(cameraDirectionPuzzleOne);
        let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirectionPuzzleOne);
        // scene.add(new THREE.ArrowHelper(playerRaycaster.ray.direction, playerRaycaster.ray.origin, 10));
        let intersects = playerRaycaster.intersectObjects(puzzleOneCollidableMeshlist, false);

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
                audioCollection.wrongMove.play();
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

    directionRockSlides = cameraDirectionPuzzleOne.clone(); // The direction the rock will move is the same direction that the camera is facing
    directionRockSlides.y = 0; // Ignore the y direction of the camera as the rocks will slide along the xz-plane

    let indexToRemove = puzzleOneCollidableMeshlist.findIndex(object => object.name == name); // Remove the selected rock from the collidable mesh list
    puzzleOneCollidableMeshlist.splice(indexToRemove, 1);
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
/********** PUZZLE ONE END **********/

/********** PUZZLE TWO START **********/
function levelTwoPuzzle() {
    if(!finishedPuzzleTwo) {
        inPuzzleTwo = true;
        shieldDisplay.style.visibility = "hidden";

        /** Set the camera to look at the player from the front */
        puzzleTwoCamera.position.set(camera.position.x, camera.position.y + 2, camera.position.z + 25);
        puzzleTwoCamera.lookAt(camera.position.x, camera.position.y, camera.position.z);

        /** Place the spotlight above the player looking down */
        puzzleSpotLight.position.set(460, 18, -1020);
        puzzleSpotLight.target = player.playerModel;

        /** Cycle through light colours */
        if(spotLightColour >= 0) puzzleSpotLight.color.setHex(0x00ffff);
        if(spotLightColour >= 1) puzzleSpotLight.color.setHex(0x00ff00);
        if(spotLightColour >= 2) puzzleSpotLight.color.setHex(0xffff00);
        if(spotLightColour >= 3) puzzleSpotLight.color.setHex(0xff0000);

        if(spotLightColour > 4) {
            spotLightColour = 0;
        }
        spotLightColour += 0.05;

        /** Set up the hud and player model for the puzzle */
        crosshair.style.visibility = "hidden";        
        health.style.visibility = "hidden";
        shield.style.visibility = "hidden";
        player.playerModel.visible = true;
        controls.getObject().rotation.set(0, Math.PI, 0);
        player.playerModel.rotation.set(0, Math.PI, 0);
        cameraType = "puzzleTwo";
        audioCollection.wildlife.stop();

        /** Move the player to the center of the box in the x position after a timeout to account for lag when switching to new camera */
        setTimeout(() => {
            if(!inPositionX) {
                if(xPos < 460) {
                    player.movingRight = false;
                    player.movingLeft = true;
                }
                else if(xPos > 460) {
                    player.movingLeft = false;
                    player.movingRight = true;
                }
    
                if(Math.round(xPos) == 460) {            
                    player.movingLeft = false;
                    player.movingRight = false;
                    inPositionX = true;
                }
            }
        }, 2000);

        /** Move the player to the center of the box in the z position */
        if(zPos < -1020) {
            player.movingForward = true;
            updatePlayerAnimation(player.animations.walkAnim);

            /** Slowly dim the point light */
            if(pointLight.intensity > 0) {
                pointLight.intensity -= 0.01;
            }
        }
        else if(!inPositionZ) {
            player.movingForward = false;
            updatePlayerAnimation(player.animations.idleAnim);
            inPositionZ = true;
            danceResults.style.visibility = "visible";
            dancecontrols.style.visibility = "visible";
            pointLight.intensity = 0;
        }

        if(inPositionX && inPositionZ) {        
            setTimeout(() => {            
                if(!audioCollection.recordScratch.isPlaying && danceIncorrect < 2) { // Start the music after a short delay
                    playMusic(); 
                }
                puzzleSpotLight.intensity = 2;
            }, 500);
        }
        
        initDanceChecks();

         /** If the wrong dance is done two times, restart the puzzle */
        if(danceIncorrect == 2) {
            if(!audioCollection.losePuzzle.isPlaying)
                audioCollection.losePuzzle.play();
            controls.unlock();
            pauseSongs();
            dancecontrols.style.visibility = "hidden";
            danceResults.style.visibility = "hidden";
            hideDanceResults();
            puzzleSpotLight.color.setHex(0xff0000);

            restartPuzzle.addEventListener("click", () => {
                puzzleBlock.style.display = "none";                
                danceStrike1.style.visibility = "hidden";
                danceStrike2.style.visibility = "hidden";
                dancecontrols.style.visibility = "visible";
                danceResults.style.visibility = "visible";

                controls.lock();

                danceIncorrect = 0;
                lastPlayed = "";
                countCorrect = 0;
               
                chickenDanceCorrect = false;
                gangnamStyleCorrect = false;
                macarenaDanceCorrect = false;
                ymcaDanceCorrect = false;
            });          
        }        

        /** If the player gets all four dances correct, end the puzzle */
        if(chickenDanceCorrect && gangnamStyleCorrect && macarenaDanceCorrect && ymcaDanceCorrect) {
            finishedPuzzleTwo = true;
            audioCollection.winPuzzle.play();
        }
    }
    else { // Solved puzzle        
        dancecontrols.style.visibility = "hidden";
        danceResults.style.visibility = "hidden";
        hideDanceResults();        
        danceStrike1.style.visibility = "hidden";
        danceStrike2.style.visibility = "hidden";

        crosshair.style.visibility = "visible";        
        health.style.visibility = "visible";
        shield.style.visibility = "visible";
        pointLight.intensity = 1.5;
        scene.remove(puzzleSpotLight);
        cameraType = "fp";
        audioCollection.wildlife.play();

        if(!player.hasGun) {
            player.hasGun = true;
            droppedGun = false;
            audioCollection.gunCock.play();
            scene.remove(player.playerModel);
            gltfLoader2.load("models/characters/player/player_gun.glb", initPlayerGunModel, undefined, (error) => console.log(error)); // Load player model with gun
            player.weapon.model.position.set(0, -3, -4);
            player.weapon.model.rotation.set(0, 0, 0);
        }
    }
}

/** Randomly plays each song for the second puzzle */
function playMusic() {
    /** Return if one of the songs is already playing */
    if(audioCollection.chickenDance.isPlaying || audioCollection.gangnamStyle.isPlaying || audioCollection.macarenaDance.isPlaying || audioCollection.ymcaDance.isPlaying || !controls.isLocked) return;

    let songNumber = Math.floor(Math.random() * 4);

    switch(songNumber) {
        case 0:
            if(!chickenDanceCorrect && (lastPlayed != "chicken_dance" || countCorrect == 3)) {
                answered = false;
                audioCollection.chickenDance.play();
                lastPlayed = "chicken_dance";
            }
            break;
        case 1:
            if(!gangnamStyleCorrect && (lastPlayed != "gangnam_style" || countCorrect == 3)) {
                answered = false;
                audioCollection.gangnamStyle.play();
                lastPlayed = "gangnam_style";
            }
            break;
        case 2:
            if(!macarenaDanceCorrect && (lastPlayed != "macarena_dance" || countCorrect == 3)) {
                answered = false;
                audioCollection.macarenaDance.play();
                lastPlayed = "macarena_dance";
            }
            break;
        case 3:
            if(!ymcaDanceCorrect && (lastPlayed != "ymca_dance" || countCorrect == 3)) {
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
    dancePlaying = true;

    if(audioCollection.chickenDance.isPlaying) {
        if(player.animations.chickenDance.enabled) {
            audioCollection.correct.play();
            danceWrong1.style.visibility = "hidden";
            danceCorrect1.style.visibility = "visible";
            
            if(countCorrect != 3) {
                chickenDanceCorrect = true;
            }            
            countCorrect++;

            audioCollection.chickenDance.source.onended = function() {                 
                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;

                if(countCorrect == 4) {
                    chickenDanceCorrect = true;
                } 

                audioCollection.chickenDance.isPlaying = false;
            };
            
        }
        else {
            audioCollection.chickenDance.stop();

            audioCollection.recordScratch.play();
            danceWrong1.style.visibility = "visible";
            danceStrikes(); 

            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;

                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.gangnamStyle.isPlaying) {
        if(player.animations.gangnamStyle.enabled) {
            audioCollection.correct.play();
            danceWrong2.style.visibility = "hidden";
            danceCorrect2.style.visibility = "visible";

            if(countCorrect != 3) {
                gangnamStyleCorrect = true;
            } 
            countCorrect++;

            audioCollection.gangnamStyle.source.onended = function() {
                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;

                if(countCorrect == 4) {
                    gangnamStyleCorrect = true;
                }

                audioCollection.gangnamStyle.isPlaying = false;
            };
        }
        else {
            audioCollection.gangnamStyle.stop();

            audioCollection.recordScratch.play();
            danceWrong2.style.visibility = "visible";
            danceStrikes(); 
            
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;

                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.macarenaDance.isPlaying) {
        if(player.animations.macarenaDance.enabled) {
            audioCollection.correct.play();
            danceWrong3.style.visibility = "hidden";
            danceCorrect3.style.visibility = "visible";

            if(countCorrect != 3) {
                macarenaDanceCorrect = true;
            }  
            countCorrect++;

            audioCollection.macarenaDance.source.onended = function() {  
                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;

                if(countCorrect == 4) {
                    macarenaDanceCorrect = true;
                }

                audioCollection.macarenaDance.isPlaying = false;
            };
        }
        else {
            audioCollection.macarenaDance.stop();

            audioCollection.recordScratch.play();
            danceWrong3.style.visibility = "visible";
            danceStrikes(); 
            
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++;
                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;
                audioCollection.recordScratch.isPlaying = false;
            };
        }
    }

    if(audioCollection.ymcaDance.isPlaying) {
        if(player.animations.ymcaDance.enabled) {
            audioCollection.correct.play();
            danceWrong4.style.visibility = "hidden";
            danceCorrect4.style.visibility = "visible";

            if(countCorrect != 3) {
                ymcaDanceCorrect = true;
            } 
            countCorrect++;

            audioCollection.ymcaDance.source.onended = function() {                                  
                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;

                if(countCorrect == 4) {
                    ymcaDanceCorrect = true;
                } 

                audioCollection.ymcaDance.isPlaying = false;
            };
        }
        else {
            audioCollection.ymcaDance.stop();

            audioCollection.recordScratch.play();
            danceWrong4.style.visibility = "visible";
            danceStrikes(); 
            
            audioCollection.recordScratch.source.onended = function() {              
                danceIncorrect++; 

                updatePlayerAnimation(player.animations.idleAnim);
                dancePlaying = false;
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
                danceWrong1.style.visibility = "visible";
                danceStrikes(); 
                
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
                danceWrong2.style.visibility = "visible";
                danceStrikes(); 
                
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
                danceWrong3.style.visibility = "visible";
                danceStrikes(); 
                
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
                danceWrong4.style.visibility = "visible";
                danceStrikes(); 
                
                audioCollection.recordScratch.source.onended = function() {              
                    danceIncorrect++;
                    audioCollection.recordScratch.isPlaying = false;
                };
                
            };
        }

    }
}

/** Visual indicator of how many songs the player has gotten wrong */
function danceStrikes() {
    if(danceIncorrect == 0) {
        danceStrike1.style.visibility = "visible";
    }
    else if(danceIncorrect == 1) {
        danceStrike2.style.visibility = "visible";
    }
}

/** Hide all the dance result elements */
function hideDanceResults() {
    danceCorrect1.style.visibility = "hidden";
    danceCorrect2.style.visibility = "hidden";
    danceCorrect3.style.visibility = "hidden";
    danceCorrect4.style.visibility = "hidden";
    danceWrong1.style.visibility = "hidden";
    danceWrong2.style.visibility = "hidden";
    danceWrong3.style.visibility = "hidden";
    danceWrong4.style.visibility = "hidden";
}

/**
 * Stops the song which is currently playing and sets the player back to idle animation.
 * Called when controls are unlocked.
 */
function pauseSongs() {
    if(countCorrect != 4) {
        updatePlayerAnimation(player.animations.idleAnim);
        dancePlaying = false;

        switch (lastPlayed) {
            case "chicken_dance":
                audioCollection.chickenDance.stop();
                break;
            case "gangnam_style":
                audioCollection.gangnamStyle.stop();
                break;
            case "macarena_dance":
                audioCollection.macarenaDance.stop();
                break;
            case "ymca_dance":
                audioCollection.ymcaDance.stop();
                break;
        }
    }   
}
/********** PUZZLE TWO END **********/

/**
 * Called by loadModel function.
 * Positions the player model in the scene facing the negative z direction.
 * Populates all player animations and enables the idle animation.
 * @param {object} gltf model loaded by the gltf loader
 */
function initPlayerModel(gltf) {
    player.playerModel = gltf.scene;
    let animations = gltf.animations;
    
    player.playerModel.scale.set(-0.5, 0.5, -0.5);
    player.playerModel.add(player.hitbox.mesh);
    scene.add(player.playerModel);
    
    let mixer = new THREE.AnimationMixer(player.playerModel);
    mixers.push(mixer);

    player.animations.walkAnim = mixer.clipAction(animations[0]);
    player.animations.idleAnim = mixer.clipAction(animations[1]);
    player.animations.backwardsAnim = mixer.clipAction(animations[2]);
    player.animations.runAnim = mixer.clipAction(animations[3]);
    player.animations.jumpAnim = mixer.clipAction(animations[4]);
    player.animations.strafeLAnim = mixer.clipAction(animations[5]);
    player.animations.strafeRAnim = mixer.clipAction(animations[6]);
    player.animations.chickenDance = mixer.clipAction(animations[7]);
    player.animations.gangnamStyle = mixer.clipAction(animations[8]);
    player.animations.macarenaDance = mixer.clipAction(animations[9]);
    player.animations.ymcaDance = mixer.clipAction(animations[10]);
    player.animations.breakdance = mixer.clipAction(animations[11]);

    player.animations.walkAnim.play();
    player.animations.idleAnim.play();
    player.animations.backwardsAnim.play();
    player.animations.jumpAnim.play();
    player.animations.runAnim.play();
    player.animations.strafeLAnim.play();
    player.animations.strafeRAnim.play();
    player.animations.chickenDance.play();
    player.animations.gangnamStyle.play();
    player.animations.macarenaDance.play();
    player.animations.ymcaDance.play();
    player.animations.breakdance.play();

    player.animations.walkAnim.enabled = false;
    player.animations.idleAnim.enabled = true;
    player.animations.backwardsAnim.enabled = false;
    player.animations.jumpAnim.enabled = false;
    player.animations.runAnim.enabled = false;
    player.animations.strafeLAnim.enabled = false;
    player.animations.strafeRAnim.enabled = false;
    player.animations.chickenDance.enabled = false;
    player.animations.gangnamStyle.enabled = false;
    player.animations.macarenaDance.enabled = false;
    player.animations.ymcaDance.enabled = false;
    player.animations.breakdance.enabled = false;
    
    player.animations.currentAnimation = player.animations.idleAnim;
}

/**
 * Called when the player picks up the gun in level two.
 * Positions the player model with a gun in the scene facing the negative z direction.
 * Populates all player animations with the gun and enables the idle animation.
 * @param {object} gltf model loaded by the gltf loader
 */
function initPlayerGunModel(gltf) {
    player.playerModel = gltf.scene;
    let animations = gltf.animations;

    player.playerModel.scale.set(-0.5, 0.5, -0.5);
    player.playerModel.add(player.hitbox.mesh);
    scene.add(player.playerModel);
    
    let mixer = new THREE.AnimationMixer(player.playerModel);
    mixers.push(mixer);

    player.animations.shootAnim = mixer.clipAction(animations[0]);    
    player.animations.walkAnim = mixer.clipAction(animations[1]);
    player.animations.runAnim = mixer.clipAction(animations[2]);
    player.animations.backwardsAnim = mixer.clipAction(animations[3]);
    player.animations.strafeLAnim = mixer.clipAction(animations[4]);
    player.animations.strafeRAnim = mixer.clipAction(animations[5]);
    player.animations.idleAnim = mixer.clipAction(animations[6]);
    player.animations.jumpAnim = mixer.clipAction(animations[7]);
    player.animations.deathAnim = mixer.clipAction(animations[8]);
    player.animations.fallAnim = mixer.clipAction(animations[9]);

    player.animations.deathAnim.setLoop(THREE.LoopOnce);
    player.animations.deathAnim.clampWhenFinished = true;

    player.animations.walkAnim.play();
    player.animations.idleAnim.play();
    player.animations.backwardsAnim.play();
    player.animations.jumpAnim.play();
    player.animations.runAnim.play();
    player.animations.shootAnim.play();
    player.animations.strafeLAnim.play();
    player.animations.strafeRAnim.play();
    player.animations.deathAnim.play();
    player.animations.fallAnim.play();

    player.animations.walkAnim.enabled = false;
    player.animations.idleAnim.enabled = true;
    player.animations.backwardsAnim.enabled = false;
    player.animations.jumpAnim.enabled = false;
    player.animations.runAnim.enabled = false;
    player.animations.shootAnim.enabled = false;
    player.animations.strafeLAnim.enabled = false;
    player.animations.strafeRAnim.enabled = false;
    player.animations.deathAnim.enabled = false;
    player.animations.fallAnim.enabled = false;

    player.animations.currentAnimation = player.animations.idleAnim;
}

/**
 * Called by loadModel function.
 * Positions the first five aliens in the scene and adds them to the alien array.
 * Populates the relevant attributes for each alien which dictates where they
 * can shoot from.
 * Calls instantiateUnits function on the alien array.
 * @param {object} gltf model loaded by the gltf loader
 */
function initAlienModels(gltf) {
    alien1.setPosition(-150, 0, -940);
    alien1.canShoot.level = 2;
    alien1.canShoot.box = 2;
    alienArray.push(alien1);

    alien2.setPosition(-170, 0, -950);
    alien2.canShoot.level = 2;
    alien2.canShoot.box = 2;
    alienArray.push(alien2);

    alien3.setPosition(-170, 0, -930);
    alien3.canShoot.level = 2;
    alien3.canShoot.box = 2;
    alienArray.push(alien3);

    alien4.setPosition(-100, 0, -1150);
    alien4.canShoot.level = 2;
    alien4.canShoot.box = 4;
    alienArray.push(alien4);

    alien5.setPosition(-90, 0, -1130);
    alien5.canShoot.level = 2;
    alien5.canShoot.box = 4;
    alienArray.push(alien5);

    alien6.setPosition(400, 0, -1140);
    alien6.canShoot.level = 2;
    alien6.canShoot.box = 4;
    alienArray.push(alien6);

    instantiateUnits(gltf, alienArray, "Alien_(Armature)");  
}

/**
 * Called by loadModel function.
 * Positions the boss model in the scene and populates all animations for the boss.
 * @param {object} gltf model loaded by the gltf loader
 */
function initBossModel(gltf) {
    boss.model = gltf.scene;
    let animations = gltf.animations;

    boss.model.scale.set(20, 20, 20);
    boss.model.rotation.y = Math.PI;
    boss.model.position.set(480, 0, 20);
    boss.model.add(boss.hitbox.mesh);
    boss.model.add(audioCollection.bossFootstep);
    boss.model.name = "boss";

    bulletCollidableMeshList.push(boss.hitbox.mesh);

    boss.model.traverse(child => {
        if(child.isMesh) {
            child.frustumCulled = false;
        }
    });

    let mixer = new THREE.AnimationMixer(boss.model);
    mixers.push(mixer);

    boss.walkAnim = mixer.clipAction(animations[0]);
    boss.attackAnim = mixer.clipAction(animations[1]);
    boss.idleAnim = mixer.clipAction(animations[3]);
    boss.flexAnim = mixer.clipAction(animations[4]);
    boss.deathAnim = mixer.clipAction(animations[5]);

    // boss.walkAnim.play();
    // boss.attackAnim.play();
    // boss.idleAnim.play();
    // boss.flexAnim.play();
    // boss.deathAnim.play();

    boss.walkAnim.timeScale = 0.5;

    boss.deathAnim.setLoop(THREE.LoopOnce);
    boss.deathAnim.clampWhenFinished = true;

    boss.attackAnim.setLoop(THREE.LoopOnce);
    boss.attackAnim.timeScale = 2;

    // boss.walkAnim.enabled = false;
    // boss.attackAnim.enabled = false;
    // boss.idleAnim.enabled = false;
    // boss.flexAnim.enabled = false;
    // boss.deathAnim.enabled = false;

    boss.currentAnimation = boss.idleAnim;
}

/**
 * Called by loadModel function.
 * Positions the bounty hunter models in the scene and adds them to the bounty hunter array.
 * Sets each of their respective death poses.
 * Calls instantiatUnits function on the bounty hunter array.
 * @param {object} gltf model loaded by the gltf loader
 */
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

    bountyHunter4.setPosition(0, 0, -460);
    bountyHunter4.setRotation(0, Math.PI/2, 0);
    bountyHunter4.defaultAnim = "Side";
    bountyArray.push(bountyHunter4);
    
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
                // child.geometry.computeBoundingBox();
                // child.geometry.boundingBox.expandByScalar(2);
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

                /** Add a light to each alien */
                let clonedLight = alienLight.clone();
                clonedLight.position.set(0, 2, 0);
                units[i].model.add(clonedLight);
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

/**
 * Called by loadModel function.
 * Creates an instanced mesh of all the pinetrees in the game.
 * Positions the trees around the borders of the bounding box.
 * @param {object} gltf model loaded by gltf loader
 */
function initPineTrees(gltf) {
    let pinetree = gltf.scene;

    let treeGeometry = pinetree.children[0].geometry;
    let treeMaterial = pinetree.children[0].material;

    let numInstances = 4218;

    let cluster = new THREE.InstancedMesh(treeGeometry, treeMaterial, numInstances);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < numInstances; i++) {
        /******* LEVEL 1 START *******/
        if(i < 180) { // Left rows
            if(i < 60) { // First row
                clusterX = Math.random() * 10 - 45; // x positions between -45 and -35
            }
            else if(i >= 60 && i < 120) { // Second row
                clusterX = Math.random() * 10 - 65; // x positions between -65 and -55
            }
            else { // Third row
                clusterX = Math.random() * 10 - 85; // x positions between -85 and -75
            }

            if(i < 120) {
                clusterZ = Math.random() * 600 - 550; // z positions between 50 and -550  
            }
            else {
                clusterZ = i * -10 + 1250; // Make third row in set positions
            }
        }
        else if(i >= 180 && i < 220) { // Back rows
            if(i < 190) { // First row
                clusterZ = Math.random() * 10 + 25; // z positions between 25 and 35
            }
            else if(i >= 190 && i < 200) { // Second row
                clusterZ = Math.random() * 10 + 45; // z positions between 45 and 55
            }
            else if(i >= 200 && i < 210){ // Third row
                clusterZ = Math.random() * 10 + 65; // z positions between 65 and 75
            }
            else { // Fourth row
                clusterZ = Math.random() * 10 + 85; // z positions between 85 and 95
            }

            if(i < 190) {
                clusterX = i * -13 + 2405; // Make first row in set positions
            }
            else {
                clusterX = Math.random() * 130 - 65; // x positions between -65 and 65  
            }
        }
        else if(i >= 220 && i < 340) { // Right rows
            if(i < 260) { // First row
                clusterX = Math.random() * 10 + 35; // x positions between 35 and 45
            }
            else if(i >= 260 && i < 300) { // Second row
                clusterX = Math.random() * 10 + 55; // x positions between 55 and 65
            }
            else { // Third row
                clusterX = Math.random() * 10 + 75; // x positions between 75 and 85
            }
            
            if(i < 300) {
                clusterZ = Math.random() * 450 - 400; // z positions between 50 and -400
            }
            else {
                clusterZ = i * -10 + 3050; // Make third row in set positions
            }
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

            if(i < 400) {
                clusterZ = Math.random() * 300 - 650; // z positions between -350 and -650
            }
            else {
                clusterZ = i * -10 + 3650; // Make third row in set positions
            }
        }
        else if(i >= 430 && i < 520) { // Secret path top
            if(i < 460) { // First row
                clusterZ = Math.random() * 10 - 640; // z positions between -630 and -640
            }
            else if(i >= 460 && i < 490) { // Second row
                clusterZ = Math.random() * 10 - 660; // z positions between -650 and -660
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 680; // z positions between -670 and -680
            }

            if(i < 490) {
                clusterX = Math.random() * 90 + 40; // x positions between 40 and 130
            }
            else {
                clusterX = i * -3 + 1610; // Make third row in set positions
            }
        }
        else if(i >= 520 && i < 550) { // Secret path left
            if(i < 550) { // First row
                clusterX = Math.random() * 5 + 45; // x positions between 40 and 45
            }

            clusterZ = i * -3.5 + 1350; // Make row in set positions
        }
        else if(i == 550) { // Right side of secret path entrance
            clusterX = 50;
            clusterZ = -400;
        }
        else if(i == 551) { // Left side of secret path entrance
            clusterX = 50;
            clusterZ = -470;
        }
        else if(i > 551 && i < 590) { // Box one top
            clusterX = i * -4 + 2273; // Math.random() * 150 - 85; // x positions between -85 and 65
            clusterZ = Math.random() * 15 - 575; // z positions between -560 and -575
        }// ******* LEVEL TWO START *******
        else if(i >= 590 && i < 710) { // Left side of puzzle one and level 2 box one 
            if(i < 630) { // First row
                clusterX = Math.random() * 10 - 45; // x positions between -35 and -45
            }
            else if(i >= 630 && i < 670) { // Second row
                clusterX = Math.random() * 10 - 65; // x positions between -55 and -65
            }
            else { // Third row
                clusterX = Math.random() * 10 - 85; // x positions between -75 and -85
            }

            if(i < 670) {
                clusterZ = Math.random() * 315 - 900; // z positions between -585 and -900
            }
            else {
                clusterZ = i * -8 + 4775; // Make third row in set positions
            }
        }
        else if(i >= 710 && i < 830) { // Right side of level 2 box one
            if(i < 750) { // First row
                clusterX = Math.random() * 10 + 35; // x positions between 35 and 45
            }
            else if(i >= 750 && i < 790) { // Second row
                clusterX = Math.random() * 10 + 55; // x positions between 55 and 65
            }
            else { // Third row
                clusterX = Math.random() * 10 + 75; // x positions between 75 and 85
            }

            if(i < 790) {
                clusterZ = Math.random() * 315 - 1000; // z positions between -685 and -1000
            }
            else {
                clusterZ = i * -8 + 5635; 
            }
        }
        else if(i == 830) { // Left of rock
            clusterX = -35;
            clusterZ = -700;
        }
        else if(i == 831) { // Left of rock
            clusterX = -25;
            clusterZ = -700;
        }
        else if(i == 832) { // Right of rock
            clusterX = 30;
            clusterZ = -700;
        }
        else if(i > 832 && i < 950) { // Box two bottom
            if(i < 870) { // First row
                clusterZ = Math.random() * 10 - 900; // z positions between -890 and -900
            }
            else if(i >= 870 && i < 910) { // Second row
                clusterZ = Math.random() * 10 - 880; // z positions between -870 and -880
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 860; // z positions between -850 and -860
            }

            if(i < 910) {
                clusterX = Math.random() * 260 - 300; // x positions between -40 and -300
            }
            else {
                clusterX = i * -6.5 + 5875; // Make third row in set positions
            }
        }
        else if(i > 950 && i < 1070) { // Box two top
            if(i < 990) { // First row
                clusterZ = Math.random() * 10 - 990; // z positions between -980 and -990
            }
            else if(i >= 990 && i < 1030) { // Second row
                clusterZ = Math.random() * 10 - 1010; // z positions between -1000 and -1010
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 1030; // z positions between -1020 and -1030
            }

            if(i < 1030) {
                clusterX = Math.random() * 250 - 190; // x positions between 60 and -190
            }
            else {
                clusterX = i * -6.25 + 6497.5; // Make third row in set positions
            }
        }
        else if(i >= 1070 && i < 1190) { // Box three left
            if(i < 1110) { // First row
                clusterX = Math.random() * 10 - 290; // x positions between -280 and -290
            }
            else if(i >= 1110 && i < 1150) { // Second row
                clusterX = Math.random() * 10 - 310; // x positions between -300 and -310
            }
            else { // Third row
                clusterX = Math.random() * 10 - 330; // x positions between -320 and -330
            }

            if(i < 1150) {
                clusterZ = Math.random() * 320 - 1210; // z positions between -890 and -1210
            }
            else {
                clusterZ = i * -8 + 8310; // Make third row in set positions
            }
        }
        else if(i >= 1190 && i < 1430) { // Box four bottom
            if(i < 1270) { // First row
                clusterZ = Math.random() * 10 - 1090; // z positions between -1080 and -1090
            }
            else if(i >= 1270 && i < 1350) { // Second row
                clusterZ = Math.random() * 10 - 1070; // z positions between -1060 and -1070
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 1050; // z positions between -1040 and -1050
            }

            if(i < 1350) {
                clusterX = Math.random() * 615 - 190; // x positions between -190 and 425
            }
            else {
                clusterX = i * -7.6875 + 10803.125; // Make third row in set positions
            }
        }
        else if(i >= 1430 && i < 1700) { // Box four top
            if(i < 1520) { // First row
                clusterZ = Math.random() * 10 - 1200; // z positions between -1190 and -1200
            }
            else if(i >= 1520 && i < 1610) { // Second row
                clusterZ = Math.random() * 10 - 1220; // z positions between -1210 and -1220
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 1240; // z positions between -1230 and -1240
            }

            if(i < 1610) {
                clusterX = Math.random() * 800 - 280; // x positions between -280 and 520
            }
            else {
                clusterX = i * -9 + 15010; // Make third row in set positions
            }
        } // ******* LEVEL 3 START *******
        else if(i >= 1700 && i < 1820) { // Box four right + second puzzle right + first part of level 3 box one right 
            if(i < 1740) { // First row
                clusterX = Math.random() * 10 + 500; // x positions between 500 and 510
            }
            else if(i >= 1740 && i < 1780) { // Second row
                clusterX = Math.random() * 10 + 520; // x positions between 520 and 530
            }
            else { // Third row
                clusterX = Math.random() * 10 + 540; // x positions between 540 and 550
            }

            if(i < 1780) {
                clusterZ = Math.random() * 340 - 1190; // z positions between -850 and -1190
            }
            else {
                clusterZ = i * -8.5 + 14280; // Make third row in set positions
            }
        }
        else if(i >= 1820 && i < 2000) { // Second puzzle left + level 3 box one left
            if(i < 1880) { // First row
                clusterX = Math.random() * 10 + 390; // x positions between 390 and 400
            }
            else if(i >= 1880 && i < 1940) { // Second row
                clusterX = Math.random() * 10 + 370; // x positions between 370 and 380
            }
            else { // Third row
                clusterX = Math.random() * 10 + 350; // x positions between 350 and 360
            }

            if(i < 1940) {
                clusterZ = Math.random() * 400 - 1090; // z positions between -690 and -1090
            }
            else {
                clusterZ = i * -7 + 12890; // Make third row in set positions
            }
        }
        else if(i >= 2000 && i < 2090) { // Rest of level 3 box one right
            if(i < 2030) { // First row
                clusterX = Math.random() * 10 + 500; // x positions between 500 and 510
            }
            else if(i >= 2030 && i < 2060) { // Second row
                clusterX = Math.random() * 10 + 520; // x positions between 520 and 530
            }
            else { // Third row
                clusterX = Math.random() * 10 + 540; // x positions between 540 and 550
            }

            if(i < 2060) {
                clusterZ = Math.random() * 160 - 740; // z positions between -580 and -740
            }
            else {
                clusterZ = i * -5.5 + 10750; // Make third row in set positions
            }
        }
        else if(i >= 2090 && i < 2098) { // Secret path left
            if(i < 2094) { // First row
                clusterX = Math.random() * 10 + 500; // x positions between 500 and 510
            }
            else { // Second row
                clusterX = Math.random() * 10 + 520; // x positions between 520 and 530
            }
            
            if(i < 2094) {
                clusterZ = Math.random() * 20 - 800; // z positions between -780 and -800
            }
            else {
                clusterZ = i * -6.7 + 13249.8; // Make second row in set positions
            }
        }
        else if(i >= 2098 && i < 2122) { // Secret path top
            if(i < 2106) { // First row
                clusterZ = Math.random() * 10 - 850; // z positions between -840 and -850
            }
            else if(i >= 2106 && i < 2114) { // Second row
                clusterZ = Math.random() * 10 - 870; // z positions between -860 and -870
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 890; // z positions between -880 and -890
            }

            if(i < 2114) {
                clusterX = Math.random() * 60 + 560; // x positions between 560 and 620
            }
            else {
                clusterX = i * -7.5 + 16475; // Make third row in set positions
            }
        }
        else if(i >= 2122 && i < 2152) { // Secret path right
            if(i < 2132) { // First row
                clusterX = Math.random() * 10 + 600; // x positions between 600 and 610
            }
            else if(i >= 2132 && i < 2142) { // Second row
                clusterX = Math.random() * 10 + 620; // x positions between 620 and 630
            }
            else { // Third row
                clusterX = Math.random() * 10 + 640; // x positions between 640 and 650
            }

            if(i < 2142) {
                clusterZ = Math.random() * 130 - 850; // z positions between -720 and -850
            }
            else {
                clusterZ = i * -13 + 27126; // Make third row in set positions
            }
        }
        else if(i >= 2152 && i < 2164) { // Secret path bottom
            if(i < 2156) { // First row
                clusterZ = Math.random() * 10 - 740; // z positions between -730 and -740
            }
            else if(i >= 2156 && i < 2160) { // Second row
                clusterZ = Math.random() * 10 - 720; // z positions between -710 and -720
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 700; // z positions between -690 and -700
            }
            
            if(i < 2160) {
                clusterX = Math.random() * 50 + 550; // x positions between 550 and 600
            }
            else {
                clusterX = i * -12.5 + 27600; // Make third row in set positions
            }
        } // ******* PUZZLE TWO EXTRA TREES START *******
        else if(i == 2164) { // Puzzle two entrance left 
            clusterX = 425;
            clusterZ = -1085;
        }
        else if(i == 2165) { // Puzzle two entrance left
            clusterX = 425;
            clusterZ = -1085;
        }
        else if(i == 2166) { // Puzzle two entrance right
            clusterX = 495;
            clusterZ = -1085;
        }
        else if(i == 2167) { // Puzzle two entrance right
            clusterX = 505;
            clusterZ = -1085;
        }
        else if(i == 2168) { // Puzzle two exit left
            clusterX = 425;
            clusterZ = -955;
        }
        else if(i == 2169) { // Puzzle two exit left
            clusterX = 415;
            clusterZ = -955;
        }
        else if(i == 2170) { // Puzzle two exit right
            clusterX = 495;
            clusterZ = -955;
        }
        else if(i == 2171) { // Puzzle two exit right 
            clusterX = 505;
            clusterZ = -955;
        } // ******* PUZZLE TWO EXTRA TREES END *******
        else if(i > 2171 && i < 2261) { // Box two bottom
            if(i < 2201) { // First row
                clusterZ = Math.random() * 10 - 600; // z positions between -590 and -600
            }
            else if(i >= 2201 && i < 2231) { // Second row
                clusterZ = Math.random() * 10 - 580; // z positions between -570 and -580
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 560; // z positions between -550 and -560
            }

            if(i < 2231) {
                clusterX = Math.random() * 210 + 290; // x positions between 290 and 500
            }
            else {
                clusterX = i * -7 + 16117; // Make third row in set positions
            }
        }
        else if(i >= 2261 && i < 2351) { // Box two top
            if(i < 2291) { // First row
                clusterZ = Math.random() * 10 - 690; // z positions between -680 and -690
            }
            else if(i >= 2291 && i < 2321) { // Second row
                clusterZ = Math.random() * 10 - 710; // z positions between -700 and -710
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 730; // z positions between -720 and -730
            }

            if(i < 2321) {
                clusterX = Math.random() * 230 + 180; // x positions between 180 and 410
            }
            else {
                clusterX = i * -7.67 + 18212.07; // Make third row in set positions
            }
        }
        else if(i >= 2351 && i < 2390) { // Box three left
            clusterX = Math.random() * 10 + 170; // x positions between 170 and 180
            clusterZ = Math.random() * 310 - 680; // z positions between -680 and -370
        }
        else if(i >= 2390 && i < 2450) { // Box three right
            if(i < 2410) { // First row
                clusterX = Math.random() * 10 + 280; // x positions between 280 and 290
            }
            else if(i >= 2410 && i < 2430) { // Second row
                clusterX = Math.random() * 10 + 300; // x positions between 300 and 310
            }
            else { // Third row
                clusterX = Math.random() * 10 + 320; // x positions between 320 and 330
            }

            if(i < 2430) {
                clusterZ = Math.random() * 130 - 590; // z positions between -460 and -590
            }
            else {
                clusterZ = i * -6.5 + 15335; // Make third row in set positions
            }
        }
        else if(i >= 2450 && i < 2530) { // Box four bottom
            if(i < 2490) { // First row
                clusterZ = Math.random() * 10 - 365; // z positions between -365 and -375
            }
            else { // Second row
                clusterZ = Math.random() * 10 - 355; // z positions between -345 and -355
            }
            clusterX = Math.random() * 245 + 200; // x positions between 200 and 445
        }
        else if(i >= 2530 && i < 2680) { // Box four top
            if(i < 2580) { // First row
                clusterZ = Math.random() * 10 - 470; // z positions between -460 and -470
            }
            else if(i >= 2580 && i < 2630) { // Second row
                clusterZ = Math.random() * 10 - 490; // z positions between -480 and -490
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 510; // z positions between -500 and -510
            }

            if(i < 2630) {
                clusterX = Math.random() * 250 + 300; // x positions between 300 and 550
            }
            else {
                clusterX = i * -5 + 13700; // Make third row in set positions
            }
        } // ******* PUZZLE THREE START *******
        else if(i >= 2680 && i < 2710) { // Puzzle three right 
            if(i < 2690) { // First row
                clusterX = Math.random() * 10 + 520; // x positions between 520 and 530
            }
            else if(i >= 2690 && i < 2700) { // Second row
                clusterX = Math.random() * 10 + 540; // x positions between 540 and 550
            }
            else { // Third row
                clusterX = Math.random() * 10 + 560; // x positions between 560 and 570
            }

            if(i < 2700) {
                clusterZ = Math.random() * 100 - 460; // z positions between -360 and -460
            }
            else {
                clusterZ = i * -10 + 26640; // Make third row in set positions
            }
        } // ******* LEVEL FOUR START *******
        else if(i >= 2710 && i < 2790) { // Level 4 top 
            if(i < 2750) { // First row
                clusterZ = Math.random() * 10 - 365; // z positions between -365 and -375
            }
            else { // Second row
                clusterZ = Math.random() * 10 - 355; // z positions between -345 and -355
            }
            clusterX = Math.random() * 155 + 495; // x positions between 495 and 650
        }
        else if(i >= 2790 && i < 3030) { // Level 4 right
            if(i < 2870) { // First row
                clusterX = Math.random() * 10 + 630; // x positions between 630 and 640
            }
            else if(i >= 2870 && i < 2950) { // Second row
                clusterX = Math.random() * 10 + 650; // x positions between 650 and 660
            }
            else { // Third row
                clusterX = Math.random() * 10 + 670; // x positions between 670 and 680
            }

            if(i < 2950) {
                clusterZ = Math.random() * 340 - 360; // z positions between -20 and -360
            }
            else {
                clusterZ = i * -4.25 + 12517.5 // Make third row in set positions
            }
        }
        else if(i >= 3030 && i < 3270) { // Level 4 left
            if(i < 3110) { // First row
                clusterX = Math.random() * 10 + 300; // x positions between 300 and 310
            }
            else if(i >= 3110 && i < 3190) { // Second row
                clusterX = Math.random() * 10 + 280; // x positions between 280 and 290
            }
            else { // Third row
                clusterX = Math.random() * 10 + 260; // x positions between 260 and 270
            }

            if(i < 3190) {
                clusterZ = Math.random() * 340 - 360; // z positions between -20 and -360
            }
            else {
                clusterZ = i * -4.25 + 13537.5; // Make third row in set positions
            }
        }
        else if(i >= 3270 && i < 3390) { // Level four bottom left
            if(i < 3310) { // First row
                clusterZ = Math.random() * 10 - 40; // z positions between -30 and -40
            }
            else if(i >= 3310 && i < 3350) { // Second row
                clusterZ = Math.random() * 10 - 20; // z positions between -10 and -20
            }
            else { // Third row
                clusterZ = Math.random() * 10 + 0; // z positions between 0 and 10
            }

            if(i < 3350) {
                clusterX = Math.random() * 140 + 310; // x positions between 310 and 450
            }
            else {
                clusterX = i * -3.5 + 12175; // Make third row in set positions
            }
        }
        else if(i >= 3390 && i < 3510) { // Level four bottom right
            if(i < 3430) { // First row
                clusterZ = Math.random() * 10 - 40; // z positions between -30 and -40
            }
            else if(i >= 3430 && i < 3470) { // Second row
                clusterZ = Math.random() * 10 - 20; // z positions between -10 and -20
            }
            else { // Third row
                clusterZ = Math.random() * 10 + 0; // z positions between 0 and 10
            }

            if(i < 3470) {
                clusterX = Math.random() * 140 + 510; // x positions between 510 and 650
            }
            else {
                clusterX = i * -3.5 + 12795; // Make third row in set positions
            }
        } // ******* PUZZLE THREE EXTRA TREES START *******
        else if(i == 3510) { // Puzzle three entrance top 
            clusterX = 415;
            clusterZ = -435;
        }
        else if(i == 3511) { // Puzzle three entrance top
            clusterX = 415;
            clusterZ = -445;
        }
        else if(i == 3512) { // Puzzle three entrance bottom
            clusterX = 415;
            clusterZ = -375;
        }
        else if(i == 3513) { // Puzzle three entrance bottom 
            clusterX = 415;
            clusterZ = -385;
        } // ******* PUZZLE THREE EXTRA TREES END *******
        else if(i > 3513 && i < 3753) { // Level 4 box two right
            if(i < 3593) { // First row
                clusterX = Math.random() * 10 + 520; // x positions between 520 and 530
            }
            else if(i >= 3593 && i < 3673) { // Second row
                clusterX = Math.random() * 10 + 540; // x positions between 540 and 550
            }
            else { // Third row
                clusterX = Math.random() * 10 + 560; // x positions between 560 and 570
            }

            if(i < 3673) {
                clusterZ = Math.random() * 140 + 20; // z positions between 20 and 160
            }
            else {
                clusterZ = i * -1.75 + 6587.75; // Make third row in set positions
            }
        }
        else if(i > 3753 && i < 3993) { // Level 4 box two left
            if(i < 3883) { // First row
                clusterX = Math.random() * 10 + 430; // x positions between 430 and 440
            }
            else if(i >= 3883 && i < 3913) { // Second row
                clusterX = Math.random() * 10 + 410; // x positions between 410 and 420
            }
            else { // Third row
                clusterX = Math.random() * 10 + 390; // x positions between 390 and 400
            }

            if(i < 3913) {
                clusterZ = Math.random() * 140 + 20; // z positions between 20 and 160
            }
            else {
                clusterZ = i * -1.75 + 7007.75; // Make third row in set positions
            }
        }
        else if(i >= 3993 && i < 4173) { // Level 4 box two bottom
            if(i < 4053) { // First row
                clusterZ = Math.random() * 10 + 140; // z positions between 140 and 150
            }
            else if(i >= 4053 && i < 4113) { // Second row
                clusterZ = Math.random() * 10 + 160; // z positions between 160 and 170
            }
            else { // Third row
                clusterZ = Math.random() * 10 + 180; // z positions between 180 and 190
            }

            if(i < 4113) {
                clusterX = Math.random() * 90 + 430; // x positions between 430 and 520
            }
            else {
                clusterX = i * -1.5 + 6689.5; // Make third row in set positions
            }
        } // ******* FILLER TREES START *******
        else if(i >= 4173 && i < 4218) { // Level 1 box two bottom
            if(i < 4188) { // First row
                clusterZ = Math.random() * 10 - 415; // z positions between -415 and -405
            }
            else if(i >= 4188 && i < 4203) { // Second row
                clusterZ = Math.random() * 10 - 395; // z positions between -395 and -385
            }
            else { // Third row
                clusterZ = Math.random() * 10 - 375; // z positions between -375 and -365
            }

            if(i < 4203) {
                clusterX = Math.random() * 90 + 40; // x positions between 40 and 130
            }
            else {
                clusterX = i * -6 + 25348; // Make third row in set positions
            }
        }

        scalingFactor = Math.random() * 0.4 + 0.3; // Set scale to between 0.3 and 0.7
        rotationFactor = Math.random() * 2*Math.PI; // Set rotation to between 0 and 2*PI

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(-Math.PI/2, 0, rotationFactor);
        tempCluster.position.set(clusterX, scalingFactor * 50, clusterZ);
        
        tempCluster.updateMatrix();
    
        cluster.setMatrixAt(i, tempCluster.matrix);
    }

    cluster.matrixAutoUpdate = false;
    scene.add(cluster);
}

/**
 * Called by loadModel function.
 * Creates an Object3D containing a group of pinetrees.
 * Used to block openings where the player cannot pass through.
 * @param {object} gltf model loaded by gltf loader
 */
function initBlockingTrees(gltf) {
    let treeModel = gltf.scene.children[0];

    let treeOne = treeModel.clone();
    let treeOneScalingFactor = Math.random() * 0.4 + 0.3; // Scaling factor between 0.3 and 0.7
    treeOne.position.set(0, treeOneScalingFactor * 50, 0);
    treeOne.scale.set(treeOneScalingFactor, treeOneScalingFactor, treeOneScalingFactor);
    treeOne.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeTwo = treeModel.clone();
    let treeTwoScalingFactor = Math.random() * 0.4 + 0.3;
    treeTwo.position.set(15, treeTwoScalingFactor * 50, 0);
    treeTwo.scale.set(treeTwoScalingFactor, treeTwoScalingFactor, treeTwoScalingFactor);
    treeTwo.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeThree = treeModel.clone();
    let treeThreeScalingFactor = Math.random() * 0.4 + 0.3;
    treeThree.position.set(-15, treeThreeScalingFactor * 50, 0);
    treeThree.scale.set(treeThreeScalingFactor, treeThreeScalingFactor, treeThreeScalingFactor);
    treeThree.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeFour = treeModel.clone();
    let treeFourScalingFactor = Math.random() * 0.4 + 0.3;
    treeFour.position.set(7, treeFourScalingFactor * 50, 10);
    treeFour.scale.set(treeFourScalingFactor, treeFourScalingFactor, treeFourScalingFactor);
    treeFour.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeFive = treeModel.clone();
    let treeFiveScalingFactor = Math.random() * 0.4 + 0.3;
    treeFive.position.set(-7, treeFiveScalingFactor * 50, 10);
    treeFive.scale.set(treeFiveScalingFactor, treeFiveScalingFactor, treeFiveScalingFactor);
    treeFive.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeSix = treeModel.clone();
    let treeSixScalingFactor = Math.random() * 0.4 + 0.3;
    treeSix.position.set(0, treeSixScalingFactor * 50, 0);
    treeSix.scale.set(treeSixScalingFactor, treeSixScalingFactor, treeSixScalingFactor);
    treeSix.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeSeven = treeModel.clone();
    let treeSevenScalingFactor = Math.random() * 0.4 + 0.3;
    treeSeven.position.set(25, treeSevenScalingFactor * 50, 0);
    treeSeven.scale.set(treeSevenScalingFactor, treeSevenScalingFactor, treeSevenScalingFactor);
    treeSeven.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    let treeEight = treeModel.clone();
    let treeEightScalingFactor = Math.random() * 0.4 + 0.3;
    treeEight.position.set(-25, treeEightScalingFactor * 50, 0);
    treeEight.scale.set(treeEightScalingFactor, treeEightScalingFactor, treeEightScalingFactor);
    treeEight.rotation.set(-Math.PI/2, 0, Math.random() * 2*Math.PI);

    blockingTrees = new THREE.Object3D();
    blockingTrees.add(treeOne);
    blockingTrees.add(treeTwo);
    blockingTrees.add(treeThree);
    blockingTrees.add(treeFour);
    blockingTrees.add(treeFive);
    blockingTrees.add(treeSix);

    endGameBlockingTrees = blockingTrees.clone(); // Only 6 trees
    endGameBlockingTrees.position.set(480, 0, -30);
    scene.add(endGameBlockingTrees);

    blockingTrees.add(treeSeven);
    blockingTrees.add(treeEight);

    blockingTrees.position.set(50, -90, -600); // The initial position is just before puzzle one //blockingTrees.position.set(480, 0, -20);
    blockingTrees.rotation.y = Math.PI/2;
    scene.add(blockingTrees);
}

/**
 * Called by loadModel function.
 * Creates an Object3D containing a group of broadleaf trees.
 * Positioned around the edges of the map.
 * @param {object} gltf model loaded by gltf loader
 */
function initBroadLeaf(gltf) {
    let broadLeafGroup = new THREE.Object3D();

    let broadleaf_one = gltf.scene;
    let broadleaf_two = broadleaf_one.clone();
    let broadleaf_three = broadleaf_one.clone();
    let broadleaf_four = broadleaf_one.clone();
    let broadleaf_five = broadleaf_one.clone();
    let broadleaf_six = broadleaf_one.clone();
    let broadleaf_seven = broadleaf_one.clone();
    let broadleaf_eight = broadleaf_one.clone();
    let broadleaf_nine = broadleaf_one.clone();
    let broadleaf_ten = broadleaf_one.clone();

    broadleaf_one.scale.set(50, 50, 50);
    broadleaf_two.scale.set(50, 50, 50);
    broadleaf_three.scale.set(80, 80, 80);
    broadleaf_four.scale.set(60, 60, 60);
    broadleaf_five.scale.set(40, 40, 40);
    broadleaf_six.scale.set(50, 50, 50);
    broadleaf_seven.scale.set(50, 50, 50);
    broadleaf_eight.scale.set(50, 50, 50);
    broadleaf_nine.scale.set(50, 50, 50);
    broadleaf_ten.scale.set(50, 50, 50);

    broadleaf_one.position.set(-100, 0, -50);
    broadleaf_two.position.set(100, 0, -300);
    broadleaf_three.position.set(120, 0, 100);
    broadleaf_four.position.set(-120, 0, -600);
    broadleaf_five.position.set(0, -20, -1200);
    broadleaf_six.position.set(-330, 0, -920);
    broadleaf_seven.position.set(300, 0, -1260);
    broadleaf_eight.position.set(650, 0, -790);
    broadleaf_nine.position.set(700, 0, -50);
    broadleaf_ten.position.set(570, 0, -400);

    broadleaf_one.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_two.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_three.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_four.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_five.rotation.set(Math.PI/2, 0, 0);
    broadleaf_six.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_seven.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_eight.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_nine.rotation.y = Math.random() * 2*Math.PI;
    broadleaf_ten.rotation.y = Math.random() * 2*Math.PI;
    
    broadLeafGroup.add(broadleaf_one);
    broadLeafGroup.add(broadleaf_two);
    broadLeafGroup.add(broadleaf_three);
    broadLeafGroup.add(broadleaf_four);
    broadLeafGroup.add(broadleaf_five);
    broadLeafGroup.add(broadleaf_six);
    broadLeafGroup.add(broadleaf_seven);
    broadLeafGroup.add(broadleaf_eight);
    broadLeafGroup.add(broadleaf_nine);
    broadLeafGroup.add(broadleaf_ten);

    broadLeafGroup.matrixAutoUpdate = false;

    scene.add(broadLeafGroup);
}

function initBoulder(gltf) {
    boulder_one = gltf.scene; 
    boulder_one.scale.set(10, 15, 10);
    boulder_one.rotation.y = -Math.PI/2;
    boulder_one.position.set(0, 0, -695);
    scene.add(boulder_one);
}

function initRocks(gltf, numInstances, min, max) {
    let rock = gltf.scene;

    let rockGeometry = rock.children[0].geometry;
    let rockMaterial = rock.children[0].material;

    let cluster = new THREE.InstancedMesh(rockGeometry, rockMaterial, numInstances);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;
    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < numInstances; i++) {
        clusterX = Math.random() * 930 - 290; // x positions between -290 and 640
        clusterZ = Math.random() * 1230 - 1190; // Z positions between -1190 and 40
        // No rocks over the holes
        if((clusterX >= 445 && clusterX < 475 && clusterZ <= -850 && clusterZ > -870) ||
           (clusterX >= 430 && clusterX < 510 && clusterZ <= -370 && clusterZ > -450)) {
            continue;
        }
        scalingFactor = Math.random() * (max - min) + min; // Scaling factor between [min,max)
        rotationFactor = Math.random() * 2*Math.PI; // Set rotation between 0 and 2*PI

        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);
        tempCluster.position.set(clusterX, 0, clusterZ);

        tempCluster.updateMatrix();
        cluster.setMatrixAt(i, tempCluster.matrix);
    }

    scene.add(cluster);
}

function initRockOverClueOne(gltf) {
    rockOverClueOne = gltf.scene.children[0];

    rockOverClueOne.scale.set(0.005, 0.005, 0.005);
    rockOverClueOne.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueOne.position.set(-20, 0, -625);

    puzzleOneCollidableMeshlist.push(rockOverClueOne);
 
    scene.add(rockOverClueOne);
}

function initRockOverClueTwo(gltf) {
    rockOverClueTwo = gltf.scene.children[0];

    rockOverClueTwo.scale.set(0.006, 0.006, 0.006);
    rockOverClueTwo.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueTwo.position.set(25, 0, -620);

    puzzleOneCollidableMeshlist.push(rockOverClueTwo);
 
    scene.add(rockOverClueTwo);
}

function initRockOverClueThree(gltf) {
    rockOverClueThree = gltf.scene.children[0];

    rockOverClueThree.scale.set(0.0055, 0.0055, 0.0055);
    rockOverClueThree.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueThree.position.set(-15, 0, -675);

    puzzleOneCollidableMeshlist.push(rockOverClueThree);
 
    scene.add(rockOverClueThree);
}

function initRockOverClueFour(gltf) {
    rockOverClueFour = gltf.scene.children[0];

    rockOverClueFour.scale.set(0.0045, 0.0045, 0.0045);
    rockOverClueFour.rotation.z = Math.random() * 2*Math.PI;
    rockOverClueFour.position.set(-10, 0, -590);

    puzzleOneCollidableMeshlist.push(rockOverClueFour);
 
    scene.add(rockOverClueFour);
}

function initLettersRock(gltf) {
    let lettersRock = gltf.scene;
    lettersRock.scale.set(5, 5, 5);
    lettersRock.position.set(-10, 0, -665);
    lettersRock.rotation.set(0, Math.PI/2, 0);
    scene.add(lettersRock);
}

function initBushes(gltf, numInstances, min, max, type) {
    let bush = gltf.scene;
    let leafGeometry;
    let leafMaterial;

    let barkGeometry;
    let barkMaterial;

    if(type == "bush_one") {
        leafGeometry = bush.children[0].children[0].geometry;
        leafMaterial = bush.children[0].children[0].material;
    
        barkGeometry = bush.children[0].children[1].geometry;
        barkMaterial = bush.children[0].children[1].material;
    }
    else {
        leafGeometry = bush.children[0].children[2].geometry;
        leafMaterial = bush.children[0].children[2].material;

        barkGeometry = bush.children[0].children[0].geometry;
        barkMaterial = bush.children[0].children[0].material;
    }

    let leafCluster = new THREE.InstancedMesh(leafGeometry, leafMaterial, numInstances);
    let barkCluster = new THREE.InstancedMesh(barkGeometry, barkMaterial, numInstances);
    let tempCluster = new THREE.Object3D();

    let clusterX;
    let clusterZ;

    let scalingFactor;
    let rotationFactor;

    for(let i = 0; i < numInstances; i++) {
        /******* LEVEL 1 START *******/
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
        else if(i >= 280 && i < 300) { // Left row box one /******* LEVEL 2 START *******/
            clusterX = Math.random() * 15 - 35; // x positions between -20 and -35
            clusterZ = Math.random() * 185 - 900; // z positions between -715 and -900
        }
        else if(i >= 300 && i < 330) { // Right row box one / two
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 265 - 980; // z positions between -715 and -980
        }
        else if(i >= 330 && i < 350) { // Top row box two
            clusterX = Math.random() * 240 - 200; // x positions between -200 and 40
            clusterZ = Math.random() * 15 - 985; // z positions between -970 and -985
        }
        else if(i >= 350 && i < 380) { // Bottom row box two / three
            clusterX = Math.random() * 240 - 280; // x positions between -280 and -40
            clusterZ = Math.random() * 15 - 905; // z positions between -890 and -905
        }
        else if(i >= 380 && i < 410) { // Left row box three / four
            clusterX = Math.random() * 15 - 285; // x positions between -285 and -270
            clusterZ = Math.random() * 280 - 1180; // z positions between -900 and -1180
        }
        else if(i >= 410 && i < 440) { // Right row box three
            clusterX = Math.random() * 15 - 205; // x positions between -205 and -190
            clusterZ = Math.random() * 120 - 1100; // z positions between -980 and -1100
        }
        else if(i >= 440 && i < 500) { // Top row box four
            clusterX = Math.random() * 780 - 280; // x positions between -280 and 500
            clusterZ = Math.random() * 15 - 1185; // z positions between -1185 and -1170
        }
        else if(i >= 500 && i < 540) { // Bottom row box four
            clusterX = Math.random() * 645 - 200; // x positions between -200 and 445
            clusterZ = Math.random() * 15 - 1105; // z positions between -1105 and -1090
        }
        else if(i >= 540 && i < 545) { // Right row box four
            clusterX = Math.random() * 15 + 490; // x positions between 490 and 505 
            clusterZ = Math.random() * 80 - 1180; // z positions between -1180 and -1100
        }
        else if(i >= 280 && i < 300) { // Left row box one /******* LEVEL 2 START *******/
            clusterX = Math.random() * 15 - 35; // x positions between -20 and -35
            clusterZ = Math.random() * 185 - 900; // z positions between -715 and -900
        }
        else if(i >= 300 && i < 330) { // Right row box one / two
            clusterX = Math.random() * 15 + 20; // x positions between 20 and 35
            clusterZ = Math.random() * 265 - 980; // z positions between -715 and -980
        }
        else if(i >= 330 && i < 350) { // Top row box two
            clusterX = Math.random() * 240 - 200; // x positions between -200 and 40
            clusterZ = Math.random() * 15 - 985; // z positions between -970 and -985
        }
        else if(i >= 350 && i < 380) { // Bottom row box two / three
            clusterX = Math.random() * 240 - 280; // x positions between -280 and -40
            clusterZ = Math.random() * 15 - 905; // z positions between -890 and -905
        }
        else if(i >= 380 && i < 410) { // Left row box three / four
            clusterX = Math.random() * 15 - 285; // x positions between -285 and -270
            clusterZ = Math.random() * 280 - 1180; // z positions between -900 and -1180
        }
        else if(i >= 410 && i < 440) { // Right row box three
            clusterX = Math.random() * 15 - 205; // x positions between -205 and -190
            clusterZ = Math.random() * 120 - 1100; // z positions between -980 and -1100
        }
        else if(i >= 440 && i < 500) { // Top row box four
            clusterX = Math.random() * 780 - 280; // x positions between -280 and 500
            clusterZ = Math.random() * 15 - 1185; // z positions between -1185 and -1170
        }
        else if(i >= 500 && i < 540) { // Bottom row box four
            clusterX = Math.random() * 645 - 200; // x positions between -200 and 445
            clusterZ = Math.random() * 15 - 1105; // z positions between -1105 and -1090
        }
        else if(i >= 540 && i < 545) { // Right row box four
            clusterX = Math.random() * 15 + 490; // x positions between 490 and 505 
            clusterZ = Math.random() * 80 - 1180; // z positions between -1180 and -1100
        }
        else if(i >= 545 && i < 575) { // Left row box one /******* LEVEL 3 START *******/
            clusterX = Math.random() * 15 + 415; // x positions between 415 and 430 
            clusterZ = Math.random() * 250 - 940; // z positions between -940 and -690
        }
        else if(i >= 575 && i < 615) { // Right row box one / two
            clusterX = Math.random() * 15 + 490; // x positions between 490 and 505 
            clusterZ = Math.random() * 340 - 940; // z positions between -940 and -600
        }
        else if(i >= 615 && i < 625) { // Top row box six / seven (secret path)
            clusterX = Math.random() * 100 + 500; // x positions between 500 and 600 
            clusterZ = Math.random() * 15 - 845; // z positions between -845 and -830
        }
        else if(i >= 625 && i < 630) { // Bottom row box six (secret path)
            clusterX = Math.random() * 50 + 500; // x positions between 500 and 550 
            clusterZ = Math.random() * 15 - 820; // z positions between -805 and -820
        }
        else if(i >= 630 && i < 645) { // Right row box seven (secret path)
            clusterX = Math.random() * 15 + 590; // x positions between 605 and 590 
            clusterZ = Math.random() * 100 - 840; // z positions between -840 and -740
        }
        else if(i >= 645 && i < 650) { // Left row box seven (secret path)
            clusterX = Math.random() * 15 + 545; // x positions between 545 and 560 
            clusterZ = Math.random() * 40 - 810; // z positions between -810 and -770
        }
        else if(i >= 650 && i < 655) { // Top row box eight (secret path)
            clusterX = Math.random() * 50 + 500; // x positions between 500 and 550  
            clusterZ = Math.random() * 15 - 775; // z positions between -775 and -760
        }
        else if(i >= 655 && i < 660) { // Bottom row box eight (secret path)
            clusterX = Math.random() * 100 + 500; // x positions between 500 and 600 
            clusterZ = Math.random() * 40 - 745; // z positions between -745 and -730
        }
        else if(i >= 660 && i < 680) { // Top row box two / three
            clusterX = Math.random() * 220 + 200; // x positions between 200 and 420
            clusterZ = Math.random() * 15 - 685; // z positions between -685 and -670
        }
        else if(i >= 680 && i < 700) { // Bottom row box two
            clusterX = Math.random() * 220 + 280; // x positions between 280 and 500
            clusterZ = Math.random() * 15 - 610; // z positions between -610 and -595
        }
        else if(i >= 700 && i < 730) { // Left row box three
            clusterX = Math.random() * 15 + 195; // x positions between 195 and 210
            clusterZ = Math.random() * 310 - 680; // z positions between -680 and -370
        }
        else if(i >= 730 && i < 745) { // Right row box three
            clusterX = Math.random() * 15 + 270; // x positions between 270 and 285
            clusterZ = Math.random() * 150 - 600; // z positions between -600 and -450
        }
        else if(i >= 745 && i < 760) { // Top row box four
            clusterX = Math.random() * 120 + 280; // x positions between 280 and 400
            clusterZ = Math.random() * 15 - 455; // z positions between -455 and -440
        }
        else if(i >= 760 && i < 780) { // Bottom row box three / four
            clusterX = Math.random() * 200 + 200; // x positions between 200 and 400
            clusterZ = Math.random() * 15 - 380; // z positions between -380 and -365
        }
        else if(i >= 780 && i < 800) { // Top row left side /******* LEVEL 4 START *******/
            clusterX = Math.random() * 125 + 330; // x positions between 330 and 455
            clusterZ = Math.random() * 15 - 345; // z positions between -345 and -330
        }
        else if(i >= 800 && i < 840) { // Left row
            clusterX = Math.random() * 15 + 325; // x positions between 325 and 340
            clusterZ = Math.random() * 300 - 340; // z positions between -340 and -40
        }
        else if(i >= 840 && i < 855) { // Bottom row left side
            clusterX = Math.random() * 110 + 330; // x positions between 330 and 440
            clusterZ = Math.random() * 15 - 50; // z positions between -50 and -35
        }
        else if(i >= 855 && i < 870) { // Bottom row right side
            clusterX = Math.random() * 110 + 520; // x positions between 520 and 630
            clusterZ = Math.random() * 15 - 50; // z positions between -50 and -35
        }
        else if(i >= 870 && i < 910) { // Right row
            clusterX = Math.random() * 15 + 620; // x positions between 620 and 635
            clusterZ = Math.random() * 300 - 340; // z positions between -340 and -40
        }
        else if(i >= 910 && i < 930) { // Top row right side
            clusterX = Math.random() * 145 + 485; // x positions between 485 and 630
            clusterZ = Math.random() * 15 - 345; // z positions between -345 and -330
        }
        else if(i >= 930 && i < 960) { // Interior
            clusterX = Math.random() * 300 + 330; // x positions between 330 and 630
            clusterZ = Math.random() * 300 - 340; // z positions between -340 and -40
        }
        else if(i >= 960 && i < 965) { // Top row box one level one
            clusterX = Math.random() * 70 - 35; // x positions between -35 and 35
            clusterZ = Math.random() * 15 - 555; // z positions between -540 and -555
        }
        
        if(i >= 930 && i < 960) {
            scalingFactor = Math.random() * (max - min) + min * 0.35; // Smaller bushes in boss level interior
        }
        else {
            scalingFactor = Math.random() * (max - min) + min; // set scale to between [min,max)
        }
        rotationFactor = Math.random() * Math.PI/2; // set rotation to between 0 and PI/2

        tempCluster.position.set(clusterX, 0, clusterZ);
        tempCluster.scale.set(scalingFactor, scalingFactor, scalingFactor);
        tempCluster.rotation.set(0, rotationFactor, 0);

        tempCluster.updateMatrix();

        leafCluster.setMatrixAt(i, tempCluster.matrix);             
        barkCluster.setMatrixAt(i, tempCluster.matrix);
    }

    leafCluster.matrixAutoUpdate = false;
    barkCluster.matrixAutoUpdate = false;

    scene.add(leafCluster);
    scene.add(barkCluster);
}

function drawTrees() {
    if(textureQuality == "high") { // Load high quality models
        loadModel("models/environment/trees/pinetree_high.glb", "pinetree");
        loadModel("models/environment/trees/pinetree_high.glb", "blocking_tree");
        loadModel("models/environment/trees/broadleaf_high.glb", "broadleaf");
    }
    else if(textureQuality == "medium") { // Load medium quality models
        loadModel("models/environment/trees/pinetree_medium.glb", "pinetree");
        loadModel("models/environment/trees/pinetree_medium.glb", "blocking_tree");
        loadModel("models/environment/trees/broadleaf_medium.glb", "broadleaf");
    }
    else { // Load low quality models
        loadModel("models/environment/trees/pinetree_low.glb", "pinetree");
        loadModel("models/environment/trees/pinetree_low.glb", "blocking_tree");
        loadModel("models/environment/trees/broadleaf_low.glb", "broadleaf");
    }
}

function drawBushes() {
    if(textureQuality == "high") {
        loadModel("models/environment/bushes/bush_one_high.glb", "bush_one");
        loadModel("models/environment/bushes/bush_two_high.glb", "bush_two");
    }
    else if(textureQuality == "medium") {
        loadModel("models/environment/bushes/bush_one_medium.glb", "bush_one");
        loadModel("models/environment/bushes/bush_two_medium.glb", "bush_two");
    }
    else {
        loadModel("models/environment/bushes/bush_one_low.glb", "bush_one");
        loadModel("models/environment/bushes/bush_two_low.glb", "bush_two");
    }
}

function drawGround() {
    let groundGeometry = new THREE.PlaneBufferGeometry(2000, 4000, 100, 100);
    let groundTexture;
    if(textureQuality == "high") {
        groundTexture = loadTexture("textures/texture_path_outline_high.jpg");
    }
    else if(textureQuality == "medium") {
        groundTexture = loadTexture("textures/texture_path_outline_medium.jpg");
    }
    else {
        groundTexture = loadTexture("textures/texture_path_outline_low.jpg");
    }
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(80, 160);
    ground = new THREE.Mesh(groundGeometry,
                                    new THREE.MeshLambertMaterial({
                                        color: "#5e503e",
                                        map: groundTexture
                                    }));
    ground.rotation.x = -Math.PI/2;
    ground.position.set(0, 0, -350);
    ground.matrixAutoUpdate = false;
    ground.updateMatrix();
    scene.add(ground);
}

function drawRocks() {
    loadModel("models/environment/rocks/rock_over_clue_one.glb", "rock_over_clue_one");
    loadModel("models/environment/rocks/rock_over_clue_two.glb", "rock_over_clue_two");
    loadModel("models/environment/rocks/rock_over_clue_three.glb", "rock_over_clue_three");
    loadModel("models/environment/rocks/rock_over_clue_four.glb", "rock_over_clue_four");
    loadModel("models/environment/rocks/letters_rock.glb", "letters_rock");

    if(textureQuality == "high") {
        loadModel("models/environment/rocks/boulder_high.glb", "boulder");
        loadModel("models/environment/rocks/rock_one_high.glb", "rock_one");
        loadModel("models/environment/rocks/rock_two_high.glb", "rock_two");
    }
    else if(textureQuality == "medium") {
        loadModel("models/environment/rocks/boulder_medium.glb", "boulder");
        loadModel("models/environment/rocks/rock_one_medium.glb", "rock_one");
        loadModel("models/environment/rocks/rock_two_medium.glb", "rock_two");
    }
    else {
        loadModel("models/environment/rocks/boulder_low.glb", "boulder");
        loadModel("models/environment/rocks/rock_one_low.glb", "rock_one");
        loadModel("models/environment/rocks/rock_two_low.glb", "rock_two");
    }
}

function drawStars() {
    starFieldA = new Starfield("black");
    starFieldB = new Starfield("white");

    starFieldA.starField.matrixAutoUpdate = false;
    starFieldB.starField.matrixAutoUpdate = false;

    scene.add(starFieldA.starField);
    scene.add(starFieldB.starField);
}

function drawTotems() {
    totemCollection = new THREE.Object3D();

    let totemTexture = loadTexture("textures/texture_totem_wood.png");
    let normalMap = loadTexture("textures/texture_totem_wood_normal.png");

    let totemGeometry = new THREE.CylinderBufferGeometry(3, 3, 12, 32);
    let totemOneMaterial = new THREE.MeshStandardMaterial( {color: "#706d71", map: totemTexture, normalMap: normalMap} );
    let totemTwoMaterial = totemOneMaterial.clone();
    let totemThreeMaterial = totemOneMaterial.clone();
    let totemFourMaterial = totemOneMaterial.clone();

    totemOne = new THREE.Mesh(totemGeometry, totemOneMaterial);
    totemTwo = new THREE.Mesh(totemGeometry, totemTwoMaterial);
    totemThree = new THREE.Mesh(totemGeometry, totemThreeMaterial);
    totemFour = new THREE.Mesh(totemGeometry, totemFourMaterial);

    /** Add the totems to the list of objects that cast shadow */
    shadowObjects.push(totemOne);
    shadowObjects.push(totemTwo);
    shadowObjects.push(totemThree);
    shadowObjects.push(totemFour);

    totemOne.position.set(-16.5, 6, 0);
    totemOne.rotation.y = Math.random() * 2*Math.PI;
    totemTwo.position.set(-5.5, 6, 0);
    totemTwo.rotation.y = Math.random() * 2*Math.PI;
    totemThree.position.set(5.5, 6, 0);
    totemThree.rotation.y = Math.random() * 2*Math.PI;
    totemFour.position.set(16.5, 6, 0);
    totemFour.rotation.y = Math.random() * 2*Math.PI;

    /** Used to handle interactable and selected / unselected logic in the first puzzle */
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

    puzzleOneCollidableMeshlist.push(totemOne);
    puzzleOneCollidableMeshlist.push(totemTwo);
    puzzleOneCollidableMeshlist.push(totemThree);
    puzzleOneCollidableMeshlist.push(totemFour);

    /** Load the animal models on top of the totems */
    loadModel("models/totems/frog.glb", "frog");
    loadModel("models/totems/eagle.glb", "eagle");
    loadModel("models/totems/lion.glb", "lion");
    loadModel("models/totems/rooster.glb", "rooster");

    totemCollection.rotation.set(0, Math.PI/2, 0);
    totemCollection.position.set(-10, 0, -635);

    scene.add(totemCollection);
}

function drawTowers() { 
    /** TOWERS */
    let towerCollection = new THREE.Object3D();

    let towerTexture = loadTexture("textures/texture_totem_wood.png");
    let towerNormalMap = loadTexture("textures/texture_totem_wood_normal.png");

    let towerGeometry = new THREE.CylinderBufferGeometry(4, 4, 50, 32);
    let towerOneMaterial = new THREE.MeshStandardMaterial( {color: "#706d71", map: towerTexture, normalMap: towerNormalMap} );
    let towerTwoMaterial = towerOneMaterial.clone();
    let towerThreeMaterial = towerOneMaterial.clone();
    let towerFourMaterial = towerOneMaterial.clone();

    towerOne = new THREE.Mesh(towerGeometry, towerOneMaterial);
    towerTwo = new THREE.Mesh(towerGeometry, towerTwoMaterial);
    towerThree = new THREE.Mesh(towerGeometry, towerThreeMaterial);
    towerFour = new THREE.Mesh(towerGeometry, towerFourMaterial);

    /** Add the towers to the list of objects that cast shadow */
    shadowObjects.push(towerOne);
    shadowObjects.push(towerTwo);
    shadowObjects.push(towerThree);
    shadowObjects.push(towerFour);

    towerOne.position.set(-100, 25, 100);
    towerOne.rotation.y = Math.random() * 2*Math.PI;
    towerTwo.position.set(100, 25, 100);
    towerTwo.rotation.y = Math.random() * 2*Math.PI;
    towerThree.position.set(-100, 25, -100);
    towerThree.rotation.y = Math.random() * 2*Math.PI;
    towerFour.position.set(100, 25, -100);
    towerFour.rotation.y = Math.random() * 2*Math.PI;

    /** ORBS */
    let orbTexture = loadReflectiveTexture(skyboxURLs);

    let orbGeometry = new THREE.SphereBufferGeometry(3, 64, 16);
    let orbOneMaterial = new THREE.MeshBasicMaterial( {color: "white"} );
    let orbTwoMaterial = orbOneMaterial.clone();
    let orbThreeMaterial = orbOneMaterial.clone();
    let orbFourMaterial = orbOneMaterial.clone();

    orbOne.mesh = new THREE.Mesh(orbGeometry, orbOneMaterial);
    orbOne.mesh.name = "orbOne";
    orbTwo.mesh = new THREE.Mesh(orbGeometry, orbTwoMaterial);
    orbTwo.mesh.name = "orbTwo";
    orbThree.mesh = new THREE.Mesh(orbGeometry, orbThreeMaterial);
    orbThree.mesh.name = "orbThree";
    orbFour.mesh = new THREE.Mesh(orbGeometry, orbFourMaterial);
    orbFour.mesh.name = "orbFour";

    orbCollidableMeshList.push(orbOne.mesh);
    orbCollidableMeshList.push(orbTwo.mesh);
    orbCollidableMeshList.push(orbThree.mesh);
    orbCollidableMeshList.push(orbFour.mesh);

    /** Add the orbs to the list of objects that cast shadow */
    shadowObjects.push(orbOne);
    shadowObjects.push(orbTwo);
    shadowObjects.push(orbThree);
    shadowObjects.push(orbFour);

    orbOne.mesh.position.set(-100, 55, 100);
    orbOne.mesh.rotation.y = Math.random() * 2*Math.PI;
    orbTwo.mesh.position.set(100, 55, 100);
    orbTwo.mesh.rotation.y = Math.random() * 2*Math.PI;
    orbThree.mesh.position.set(-100, 55, -100);
    orbThree.mesh.rotation.y = Math.random() * 2*Math.PI;
    orbFour.mesh.position.set(100, 55, -100);
    orbFour.mesh.rotation.y = Math.random() * 2*Math.PI;

    let orbStatusGeometry = new THREE.CylinderBufferGeometry(4.2, 4.2, 0.5, 32);
    let orbStatusMaterial = new THREE.MeshBasicMaterial( {color: "#1ac3fd"} );

    orbOne.statusMesh = new THREE.Mesh(orbStatusGeometry, orbStatusMaterial.clone());
    orbTwo.statusMesh = new THREE.Mesh(orbStatusGeometry, orbStatusMaterial.clone());
    orbThree.statusMesh = new THREE.Mesh(orbStatusGeometry, orbStatusMaterial.clone());
    orbFour.statusMesh = new THREE.Mesh(orbStatusGeometry, orbStatusMaterial.clone());

    orbOne.statusMesh.position.set(-100, 35, 100);
    orbTwo.statusMesh.position.set(100, 35, 100);
    orbThree.statusMesh.position.set(-100, 35, -100);
    orbFour.statusMesh.position.set(100, 35, -100);

    towerCollection.add(towerOne);
    towerCollection.add(towerTwo);
    towerCollection.add(towerThree);
    towerCollection.add(towerFour);
    towerCollection.add(orbOne.mesh);
    towerCollection.add(orbTwo.mesh);
    towerCollection.add(orbThree.mesh);
    towerCollection.add(orbFour.mesh);
    towerCollection.add(orbOne.statusMesh);
    towerCollection.add(orbTwo.statusMesh);
    towerCollection.add(orbThree.statusMesh);
    towerCollection.add(orbFour.statusMesh);

    towerCollection.position.set(480, 0, -190);
    scene.add(towerCollection);

    towerCollection.updateMatrixWorld();

    let towerOnePosition = new THREE.Vector3();
    towerOne.getWorldPosition(towerOnePosition);

    let towerTwoPosition = new THREE.Vector3();
    towerTwo.getWorldPosition(towerTwoPosition);

    let towerThreePosition = new THREE.Vector3();
    towerThree.getWorldPosition(towerThreePosition);

    let towerFourPosition = new THREE.Vector3();
    towerFour.getWorldPosition(towerFourPosition);

    towerArray.push(towerOnePosition);
    towerArray.push(towerTwoPosition);
    towerArray.push(towerThreePosition);
    towerArray.push(towerFourPosition);

    let healingRayMaterial = new THREE.LineBasicMaterial( {color: "#1ac3fd", linewidth: 5} );

    let orbOnePosition = new THREE.Vector3();
    let orbOneHealingRayGeometry = new THREE.Geometry();
    orbOneHealingRayGeometry.vertices.push(
        orbOne.mesh.getWorldPosition(orbOnePosition),
        orbOnePosition
    );
    orbOneHealingRay = new THREE.Line(orbOneHealingRayGeometry, healingRayMaterial.clone());
    orbOneHealingRay.frustumCulled = false;

    let orbTwoPosition = new THREE.Vector3();
    let orbTwoHealingRayGeometry = new THREE.Geometry();
    orbTwoHealingRayGeometry.vertices.push(
        orbTwo.mesh.getWorldPosition(orbTwoPosition),
        orbTwoPosition
    );
    orbTwoHealingRay = new THREE.Line(orbTwoHealingRayGeometry, healingRayMaterial.clone());
    orbTwoHealingRay.frustumCulled = false;

    let orbThreePosition = new THREE.Vector3();
    let orbThreeHealingRayGeometry = new THREE.Geometry();
    orbThreeHealingRayGeometry.vertices.push(
        orbThree.mesh.getWorldPosition(orbThreePosition),
        orbThreePosition
    );
    orbThreeHealingRay = new THREE.Line(orbThreeHealingRayGeometry, healingRayMaterial.clone());
    orbThreeHealingRay.frustumCulled = false;

    let orbFourPosition = new THREE.Vector3();
    let orbFourHealingRayGeometry = new THREE.Geometry();
    orbFourHealingRayGeometry.vertices.push(
        orbFour.mesh.getWorldPosition(orbFourPosition),
        orbFourPosition
    );
    orbFourHealingRay = new THREE.Line(orbFourHealingRayGeometry, healingRayMaterial.clone());
    orbFourHealingRay.frustumCulled = false;
    
    healingRayArray.push(orbOneHealingRay);
    healingRayArray.push(orbTwoHealingRay);
    healingRayArray.push(orbThreeHealingRay);
    healingRayArray.push(orbFourHealingRay);
    
    scene.add(orbOneHealingRay);
    scene.add(orbTwoHealingRay);
    scene.add(orbThreeHealingRay);
    scene.add(orbFourHealingRay);
}

function drawPaper() {
    /** NOTES */
    paper_noteOne = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));    
    paper_noteOne.rotation.z = -Math.PI/4;    
    paper_noteOne.rotation.x = Math.PI/2;
    paper_noteOne.position.set(-14.28, 7, -29.28);
    paper_noteOne.name = "noteOne";
    noteCollidableMeshlist.push(paper_noteOne);
    
    /** PUZZLE 1 CLUES */
    paper_clueOne = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueOne.rotation.y = Math.random() * 2*Math.PI;
    paper_clueOne.position.set(-20, 0, -625);
    paper_clueOne.name = "clueOne";
    puzzleOneCollidableMeshlist.push(paper_clueOne);

    paper_clueTwo = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueTwo.rotation.y = Math.random() * 2*Math.PI;
    paper_clueTwo.position.set(25, 0, -620);
    paper_clueTwo.name = "clueTwo";
    puzzleOneCollidableMeshlist.push(paper_clueTwo);

    paper_clueThree = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueThree.rotation.y = Math.random() * 2*Math.PI;
    paper_clueThree.position.set(-15, 0, -675);
    paper_clueThree.name = "clueThree";
    puzzleOneCollidableMeshlist.push(paper_clueThree);

    paper_clueFour = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 0.01, 1), new THREE.MeshLambertMaterial( {color: "#f2eecb"} ));
    paper_clueFour.rotation.y = Math.random() * 2*Math.PI;
    paper_clueFour.position.set(-10, 0, -590);
    paper_clueFour.name = "clueFour";
    puzzleOneCollidableMeshlist.push(paper_clueFour);

    scene.add(paper_noteOne);
    scene.add(paper_clueOne);
    scene.add(paper_clueTwo);
    scene.add(paper_clueThree);
    scene.add(paper_clueFour);
}

function drawNotePoles() {
    let woodTexture = loadTexture("textures/texture_totem_wood.png");
    let normalMap = loadTexture("textures/texture_totem_wood_normal.png");

    let poleGeometry = new THREE.CylinderBufferGeometry(1, 1, 8, 32);
    let poleMaterial = new THREE.MeshStandardMaterial( {color: "#706d71", map: woodTexture, normalMap: normalMap} );

    pole = new THREE.Mesh(poleGeometry, poleMaterial);

    shadowObjects.push(pole);

    pole.position.set(-15, 4, -30);

    scene.add(pole);
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

function drawHoles() {
    let holeOneGeometry = new THREE.PlaneBufferGeometry(50, 50);
    let holeTwoGeometry = new THREE.PlaneBufferGeometry(130, 130);

    let holeTexture = loadTexture("textures/texture_hole.png");

    let holeMaterial = new THREE.MeshBasicMaterial( {map: holeTexture, transparent: true} );
    
    holeOne = new THREE.Mesh(holeOneGeometry, holeMaterial.clone()); 
    holeOne.rotation.x = -Math.PI/2;
    holeOne.position.set(460, 0.1, -860);
    holeOne.add(audioCollection.hole);

    holeTwo = new THREE.Mesh(holeTwoGeometry, holeMaterial.clone()); 
    holeTwo.rotation.x = -Math.PI/2;
    holeTwo.position.set(470, 0.1, -410);
    holeTwo.add(audioCollection.hole2);

    scene.add(holeOne);
    scene.add(holeTwo);
    // scene.add(baseHoleTwo);

    let platformTexture;
    if(textureQuality == "high") {
        platformTexture = loadTexture("textures/texture_platform_high.jpg");
    }
    else if(textureQuality == "medium") {
        platformTexture = loadTexture("textures/texture_platform_medium.jpg");
    }
    else {
        platformTexture = loadTexture("textures/texture_platform_low.jpg");
    }

    platform = new THREE.Mesh(new THREE.BoxBufferGeometry(24, 2, 12), new THREE.MeshLambertMaterial( {map: platformTexture }));
    platform.position.set(470, 3, -410);

    scene.add(platform);

    /** Black cylinder and cube mesh to fall through to hide the sky box and plane boundaries */
    let cyclinderGeometry = new THREE.CylinderBufferGeometry(75, 75, 275, 8);
    let cylinderMaterial = new THREE.MeshBasicMaterial( {color: "black", side: THREE.BackSide} );
    let cyclinder = new THREE.Mesh(cyclinderGeometry, cylinderMaterial);

    cyclinder.position.set(460, -140, -860);
    scene.add(cyclinder);

    let cube = new THREE.Mesh(new THREE.BoxBufferGeometry(200, 275, 200), new THREE.MeshBasicMaterial( {color: "black", side: THREE.BackSide} ));
    cube.position.set(480, -140, -410);
    scene.add(cube);

    // Cover the base of the trees
    let coverBig = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), new THREE.MeshBasicMaterial( {color: "black", side: THREE.BackSide} )); 
    let coverSmall = coverBig.clone();

    coverSmall.rotation.x = -Math.PI/2;
    coverSmall.position.set(460, -25, -860);
    scene.add(coverSmall);

    coverBig.rotation.x = -Math.PI/2;
    coverBig.position.set(480, -70, -410);
    scene.add(coverBig);
}

function drawCrateAndDonuts() {
    crateAndDonuts = new THREE.Object3D();

    let donutChoice = Math.floor(Math.random() * 2);

    if(donutChoice == 0) {
        loadModel("models/environment/donutOne.glb", "donut");
    }
    else {
        loadModel("models/environment/donutTwo.glb", "donut");
    }
    
    crateAndDonuts.scale.set(3, 3, 3);
    crateAndDonuts.position.set(-65, 0, -1120);
    scene.add(crateAndDonuts);
}

function drawCrateAndBook() {
    crateAndBook = new THREE.Object3D();

    loadModel("models/environment/crate.glb", "crate");
    loadModel("models/environment/book.glb", "book");

    crateAndBook.scale.set(4, 4, 4);
    crateAndBook.position.set(-160, 0, -925);
    scene.add(crateAndBook);
}

function initCrate(gltf) {
    crate = gltf.scene;

    crateAndBook.add(crate);

    let crate2 = crate.clone();
    let crate3 = crate.clone();
    let crate4 = crate.clone();

    let crate5 = crate.clone();
    crate5.rotation.y = Math.PI/6;
    crateAndDonuts.add(crate5);

    crate2.rotation.y = Math.PI/6;
    
    crate3.position.set(1.2, 0, 0);

    crate4.rotation.y = 4 * Math.PI/9;
    crate4.position.set(0.8, 1, -0.2);

    cratesAndScroll.add(crate2);
    cratesAndScroll.add(crate3);
    cratesAndScroll.add(crate4);
}

function initBook(gltf) {
    book = gltf.scene.children[0];
    book.rotation.set(-Math.PI/2, 0, Math.PI/6);
    book.position.set(0.2, 1.1, 0);

    book.name = "noteTwo";
    noteCollidableMeshlist.push(book);

    crateAndBook.add(book);
}

function initDonut(gltf) {
    donut = gltf.scene.children[0];
    donut.position.set(-0.1, 1.025, -0.1);
    donut.scale.set(1.5, 1.5, 1.5);
    donut.name = "donut";

    donutCollidableMeshlist.push(donut);

    crateAndDonuts.add(donut);
}

function drawBarrelsAndScroll() {
    barrelsAndScroll = new THREE.Object3D();

    loadModel("models/environment/barrels/barrel.glb", "barrel");
    loadModel("models/environment/barrels/barrel_open.glb", "barrel_open");
    loadModel("models/environment/scroll_draping.glb", "scroll");

    barrelsAndScroll.position.set(460, 0, -620);
    barrelsAndScroll.rotation.y = Math.PI;
    scene.add(barrelsAndScroll);
}

function drawTripwires() {
    let material = new THREE.LineBasicMaterial( {color: "#939999"} );

    let tripwireOnePoints = [];
    tripwireOnePoints.push(new THREE.Vector3(-70, 3, -300));
    tripwireOnePoints.push(new THREE.Vector3(70, 3, -300));

    let tripwireTwoPoints = [];
    tripwireTwoPoints.push(new THREE.Vector3(170, 3, -550));
    tripwireTwoPoints.push(new THREE.Vector3(310, 3, -550));

    let tripwireOneGeometry = new THREE.BufferGeometry().setFromPoints(tripwireOnePoints);
    let tripwireTwoGeometry = new THREE.BufferGeometry().setFromPoints(tripwireTwoPoints);

    tripwireOne = new THREE.Line(tripwireOneGeometry, material.clone());
    tripwireTwo = new THREE.Line(tripwireTwoGeometry, material.clone());

    tripwireOne.matrixAutoUpdate = false;
    tripwireTwo.matrixAutoUpdate = false;
    
    scene.add(tripwireOne);
    scene.add(tripwireTwo);
}

function initBarrel(gltf) {
    let barrelOne = gltf.scene;
    barrelOne.scale.set(5, 5, 5);

    let barrelTwo = barrelOne.clone();
    barrelTwo.rotation.set(Math.PI/2, 0, 0);
    barrelTwo.position.set(5.5, 1.5, -5);

    let barrelThree = barrelOne.clone();
    barrelThree.rotation.set(Math.PI/2, 0, 0);
    barrelThree.position.set(1.7, 1.5, -6);

    let barrelFour = barrelOne.clone();
    barrelFour.rotation.set(Math.PI/2, 0, 0);
    barrelFour.position.set(-2.1, 1.5, -6);

    let barrelFive = barrelOne.clone();
    barrelFive.rotation.set(Math.PI/2, 0, 0);
    barrelFive.position.set(-5.9, 1.5, -6);

    let barrelSix = barrelOne.clone();
    barrelSix.rotation.set(Math.PI/2, 0, 0);
    barrelSix.position.set(-3.8, 4.5, -6);

    let barrelSeven = barrelOne.clone();
    barrelSeven.rotation.set(Math.PI/2, 0, 0);
    barrelSeven.position.set(0, 4.5, -6);

    let barrelEight = barrelOne.clone();
    barrelEight.rotation.set(Math.PI/2, 0, 0);
    barrelEight.position.set(3.8, 4.5, -5.2);

    barrelsAndScroll.add(barrelOne);
    barrelsAndScroll.add(barrelTwo);
    barrelsAndScroll.add(barrelThree);
    barrelsAndScroll.add(barrelFour);
    barrelsAndScroll.add(barrelFive);
    barrelsAndScroll.add(barrelSix);
    barrelsAndScroll.add(barrelSeven);
    barrelsAndScroll.add(barrelEight);
}

function initOpenBarrel(gltf) {
    let barrel = gltf.scene;
    barrel.position.set(-4.5, 0, 1);
    barrel.rotation.set(0, Math.PI/6, 0);
    barrel.scale.set(-5, 5, 5);
    barrelsAndScroll.add(barrel);
}

function initScroll(gltf) {
    let scroll = gltf.scene;
    let scroll2 = scroll.clone();

    scroll.scale.set(0.7, 0.7, 0.7);
    scroll.rotation.set(-Math.PI/18, Math.PI/2, 0);
    scroll.position.set(0, 4.4, 0.8);
    
    scroll.children[2].name = "noteThree";
    noteCollidableMeshlist.push(scroll.children[2]);

    barrelsAndScroll.add(scroll);

    
    scroll2.scale.set(0.2, 0.2, 0.2);
    scroll2.rotation.set(0, Math.PI/6, -Math.PI/18);
    scroll2.position.set(-0.4, 1, 0.2);
    
    scroll2.children[2].name = "noteFour";
    noteCollidableMeshlist.push(scroll2.children[2]);

    cratesAndScroll.add(scroll2);
}

function drawCratesAndScroll() {
    cratesAndScroll = new THREE.Object3D();
    cratesAndScroll.scale.set(3, 3, 3);
    cratesAndScroll.position.set(380, 0, -390);
    cratesAndScroll.rotation.y = -Math.PI/2;
    scene.add(cratesAndScroll);
}

function drawSpeakers() {
    speakers = new THREE.Object3D();

    loadModel("models/environment/speaker.glb", "speakers");

    speakers.position.set(460, 0, -1060);
    speakers.scale.set(2, 2, 2);
    scene.add(speakers);
}

function initSpeakers(gltf) {
    let speaker1 = gltf.scene;
    let speaker2 = speaker1.clone();

    speaker1.position.set(-10, 0, 0);
    speaker1.rotation.set(0, Math.PI/6, 0);

    speaker2.position.set(10, 0, 0);
    speaker2.rotation.set(0, -Math.PI/6, 0);

    speakers.add(speaker1);
    speakers.add(speaker2);
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
        handleNotes();

        /** Tripwire */
        if(controls.getObject().position.y <= 8 && controls.getObject().position.z <= -299 && controls.getObject().position.z >= -301 && !tripwireOneActivated) {
            tripwireOneActivated = true;
            scene.remove(tripwireOne);

            audioCollection.tripwireActivated.play();
            setTimeout(() => {
                audioCollection.tripwireBuzz.play();
                audioCollection.playerInjured.play();
                player.currentHealth -= 50;
                updatePlayerHealth();
            }, 200);
        }

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

        if(!playedTreeAudio) {
            setTimeout(() =>  audioCollection.treeFall.play(), 500);
            playedTreeAudio = true;
        }

        if(blockingTrees.position.y < 0) {
            blockingTrees.position.y += 0.35;
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

    if(!disposedTotems) {
        totemCollection.traverse(child => {
            if(child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
                scene.remove(child);
            }
        });
        scene.remove(totemCollection);
        disposedTotems = true;
    }

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
        setCheckPoint();
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 2);
        handleNotes();
    }
    else if(xPos > boxThreeLeft && xPos < boxThreeRight && zPos < boxThreeBottom && zPos > boxThreeTop) {
        setBox(3, 2);
        handleHealthPacks();
    }
    else if(xPos > boxFourLeft && xPos < boxFourRight && zPos < boxFourBottom && zPos > boxFourTop) {
        setBox(4, 2);
        donutRaycast();
    }
    else if(xPos > boxFiveLeft && xPos < boxFiveRight && zPos < boxFiveBottom && zPos > boxFiveTop) {
        setBox(5, 2);
    }

    if(boxArr[1]) { // In box one
        /** Reset position and orientation of blocking trees to the start of puzzle two */
        if(playedTreeAudio) { // Will be true when the trees have emerged in puzzle one
            blockingTrees.rotation.y = 0;
            blockingTrees.position.set(460, -90, -1085);
            playedTreeAudio = false;
        }

        if(zPos > -745) {
            cameraType = "fp"; // Lock the player into first person to avoid visual glitches when loading the new model
        }
        if(zPos <= -745 && !player.hasGun) {            
            player.hasGun = true;
            audioCollection.gunCock.play();
            scene.remove(player.weapon.model);
            scene.remove(player.playerModel);
            gltfLoader2.load("models/characters/player/player_gun.glb", initPlayerGunModel, undefined, (error) => console.log(error)); // Load player model with gun
            player.weapon.model.position.set(0, -3, -4);
            player.weapon.model.rotation.set(0, 0, 0);
            camera.add(player.weapon.model);

            displayTooltip("Use this to protect yourself, soldier.");
        }

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
        hideTooltip();

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
        if(xPos >= 50 && !player.shield.hasShield) {  
            completedTooltip = false; // Reset tooltip so that it can reappear          
            player.shield.hasShield = true;
            audioCollection.shieldReady.play();
            scene.remove(player.shield.model);
            shield.style.visibility = "visible";
            displayTooltip("Press F to protect yourself in combat. Be mindful of recharge time!");
        }

        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary except at box four overlap and box five entrance
            if(xPos > boxThreeRight && (xPos < boxFiveLeft || xPos > boxFiveRight))
                controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        /** Fallen tree logic */
        if(!onTree) {
            if(!rightOfTree) {
                if(xPos < boxFourLeft + boundaryFactor) { // Place left boundary
                    controls.getObject().position.x = boxFourLeft + boundaryFactor;
                }
                if(xPos > -20) { // Place right boundary before the tree
                    if(controls.getObject().position.y < 16) { // Only allow player over if they jump to the correct height
                        controls.getObject().position.x = -20;
                    }
                }
            }
            else {
                if(xPos < 10) { // Place left boundary after the tree
                    if(controls.getObject().position.y < 16) { // Only allow player over if they jump to the correct height
                        controls.getObject().position.x = 10;
                    }
                }
                if(xPos > boxFourRight - boundaryFactor) { // Place right boundary
                    controls.getObject().position.x = boxFourRight - boundaryFactor;
                }
            }
        }

        if(xPos > -15 && xPos < 5) { // On top of tree
            onTree = true;
        }
        else {
            onTree = false;
            /** Check which side of the tree the player is on after getting off the tree */
            if(xPos < -15) {
                rightOfTree = false;
            }
            else if(xPos > 5) {
                rightOfTree = true;
            }
        }
    }
    else if(boxArr[5]) { // In box five
        hideTooltip(); // Hide the shield tooltip if it is still visible

        cameraType = "fp"; // Lock the player into first person to avoid visual glitches when loading the new model

        if(player.hasGun) {
            scene.remove(player.playerModel);
            gltfLoader2.load("models/characters/player/playermodel.glb", initPlayerModel, undefined, (error) => console.log(error)); // Load original player model
            player.hasGun = false;
            droppedGun = true;
            audioCollection.gunCock.play();
        }

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
    completedTooltip = false; // Reset the tooltip from the previous box
    checkpointDisplayed = false;

    if(!removedLevelTwoAliens){
        removedLevelTwoAliens = true;
        for(let i = 5; i < alienArray.length; i++) {
            scene.remove(alienArray[i].model);
        }
        alienArray.splice(5, 3);
    }

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
        if(!playedTreeAudio) {
            setTimeout(() =>  audioCollection.treeFall.play(), 500);
            playedTreeAudio = true;
        }

        if(blockingTrees.position.y < 0) {
            blockingTrees.position.y += 0.35;
        }

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
    if(!spawnedLevelThreeAliens) { // Spawn the aliens for level 3
        spawnLevelThreeAliens();
        spawnedLevelThreeAliens = true;
    }

    // Boundary values for the respective box divisions
    let boxOneBottom = -680;
    let boxOneLeft = 420;
    let boxOneRight = 500;
    let boxOneTop = -940;

    let boxTwoBottom = -600;
    let boxTwoLeft = 200;
    let boxTwoRight = boxOneRight;
    let boxTwoTop = boxOneBottom;

    let boxThreeBottom = -450;
    let boxThreeLeft = boxTwoLeft;
    let boxThreeRight = 280;
    let boxThreeTop = boxTwoBottom;

    let boxFourBottom = -370;
    let boxFourLeft = boxThreeLeft;
    let boxFourRight = 400;
    let boxFourTop = boxThreeBottom;

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
        setCheckPoint();
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 3);
    }
    else if(xPos > boxThreeLeft && xPos < boxThreeRight && zPos < boxThreeBottom && zPos > boxThreeTop) {
        setBox(3, 3);
        handleHealthPacks();
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
        if(!movedBlockingTreesLevelTwo) {
            /** Reset position and orientation of blocking trees to the end of puzzle two */
            if(playedTreeAudio) { // Will be true when the trees have emerged in puzzle one
                blockingTrees.rotation.y = 0;
                blockingTrees.position.set(460, -90, -955);
                playedTreeAudio = false;
            }
            movedBlockingTreesLevelTwo = true;
        }

        if(!playedTreeAudio) {
            setTimeout(() =>  audioCollection.treeFall.play(), 500);
            playedTreeAudio = true;
        }

        if(blockingTrees.position.y < 0) {
            blockingTrees.position.y += 0.35;
        }

        if(!audioCollection.hole.isPlaying) {
            audioCollection.hole.play();
        }
        /** Hole in the ground */
        if(zPos > -870 && zPos < -850 && xPos > 445 && xPos < 475 && controls.getObject().position.y == 8) {
            inHole = true;
        }

        if(controls.getObject().position.y <= -240) {
            player.currentHealth = 0;
            // audioCollection.playerDeath.play();
            playerDeath.classList.add("fadein");
            playerDeath.style.visibility = "visible";
            setTimeout(() => audioCollection.deathAudio.play(), 500);
            setTimeout(() => deathBlock.style.display = "block", 3000);
            controls.unlock();
        }

        if(zPos < boxOneTop) { // Place top boundary
            controls.getObject().position.z = boxOneTop;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary except at secret path entrance and exit
            if( (zPos < boxSixTop || zPos > boxSixBottom) && (zPos < boxEightTop || zPos > boxEightBottom) )
                controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        handleNotes();

        if(audioCollection.hole.isPlaying) {
            audioCollection.hole.stop();
        }

        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary except at box three overlap
            if(xPos > boxThreeRight)
                controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(zPos < boxTwoTop + boundaryFactor) { // Place top boundary except at box one overlap
            if(xPos < boxOneLeft)
                controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
        if(xPos < boxThreeLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary 
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
    }
    else if(boxArr[3]) { // In box three
        /** Tripwire */
        if(controls.getObject().position.y <= 8 && controls.getObject().position.z <= -549 && controls.getObject().position.z >= -551 && !tripwireTwoActivated) {
            tripwireTwoActivated = true;
            scene.remove(tripwireTwo);

            audioCollection.tripwireActivated.play();
            setTimeout(() => {
                audioCollection.tripwireBuzz.play();
                audioCollection.playerInjured.play();
                player.currentHealth -= 50;
                updatePlayerHealth();

                if(player.currentHealth <= 0) {
                    player.currentHealth = 0;
                    audioCollection.playerDeath.play();
                    playerDeath.classList.add("fadein");
                    playerDeath.style.visibility = "visible";
                    setTimeout(() => audioCollection.deathAudio.play(), 500);
                    controls.unlock();
                }
            }, 200);
        }

        if(xPos < boxThreeLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxThreeLeft + boundaryFactor;
        }
        if(xPos > boxThreeRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxThreeRight - boundaryFactor;
        }
    }
    else if(boxArr[4]) { // In box four
        handleNotes();

        if(!audioCollection.hole2.isPlaying) {
            audioCollection.hole2.play();
        }

        if(zPos > boxFourBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxFourBottom - boundaryFactor;
        }
        if(zPos < boxFourTop + boundaryFactor) { // Place top boundary except at box three overlap
            if(xPos > boxThreeRight)
                controls.getObject().position.z = boxFourTop + boundaryFactor;
        }
        if(xPos < boxFourLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxFourLeft + boundaryFactor;
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
        if(zPos >= -790 && !player.weaponUpgrade.hasWeaponUpgrade) { // Pick up weapon upgrade
            completedTooltip = false; // Reset tooltip so that it can reappear          
            player.weaponUpgrade.hasWeaponUpgrade = true;
            audioCollection.weaponUpgradeReady.play();
            scene.remove(player.weaponUpgrade.model);
            weaponUpgrade.style.visibility = "visible";
            displayTooltip("Right click to shoot an enhanced damage over time ray. Watch for the recharge!");
        }

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
    checkpointDisplayed = false;

    // Boundary values for the respective box divisions
    let boxOneBottom = -370;
    let boxOneLeft = 430;
    let boxOneRight = 510;
    let boxOneTop = -450;

    let boxTwoBottom = -340;
    let boxTwoLeft = 455;
    let boxTwoRight = 485;
    let boxTwoTop = -370;

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 3.5);
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 3.5);
    }

    if(boxArr[1]) { // In box one
        if(!movedBlockingTreesLevelThree) {
            /** Reset position and orientation of blocking trees to the start of puzzle three */
            if(playedTreeAudio) { // Will be true when the trees have emerged in puzzle two
                blockingTrees.rotation.y = Math.PI/2;
                blockingTrees.position.set(415, -90, -400);
                playedTreeAudio = false;
            }
            movedBlockingTreesLevelThree = true;
        }

        if(!playedTreeAudio) {
            setTimeout(() =>  audioCollection.treeFall.play(), 500);
            playedTreeAudio = true;
        }

        if(blockingTrees.position.y < 0) {
            blockingTrees.position.y += 0.35;
        }

        if(xPos > 455.5 && xPos < 484.5 && zPos > -416.5 && zPos < -403.5 && controls.getObject().position.y >= 10) {
            onPlatform = true;
            inHole = false;
        }
        else if(!inHole) {
            onPlatform = false;
            inHole = true;
        }
        else {
            if(controls.getObject().position.y <= -240) {
                player.currentHealth = 0;
                // audioCollection.playerDeath.play();
                playerDeath.classList.add("fadein");
                playerDeath.style.visibility = "visible";
                setTimeout(() => audioCollection.deathAudio.play(), 500);
                setTimeout(() => deathBlock.style.display = "block", 3000);
                controls.unlock();
            }
        }

        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary except at exit
            if(xPos < boxTwoLeft || xPos > boxTwoRight) {
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
        if(controls.getObject().position.y <= -240) {
            player.currentHealth = 0;
            // audioCollection.playerDeath.play();
            playerDeath.classList.add("fadein");
            playerDeath.style.visibility = "visible";
            setTimeout(() => audioCollection.deathAudio.play(), 500);
            setTimeout(() => deathBlock.style.display = "block", 3000);
            controls.unlock();
        }

        if(controls.getObject().position.y >= 8) {
            inHole = false;
        }
        
        if(zPos < boxTwoTop) {
            controls.getObject().position.z = boxTwoTop + boundaryFactor;
        }
        if(xPos < boxTwoLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
        if(zPos > boxTwoBottom - boundaryFactor) { // Change the level once the player leaves the box
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

    let boxTwoBottom = 140;
    let boxTwoLeft = 440;
    let boxTwoRight = 520;
    let boxTwoTop = boxOneBottom;

    if(!shotPoisonBullet) { // Hide the weapon upgrade tooltip if it is still visible once the player enters the boss fight
        shotPoisonBullet = true;
        hideTooltip();
    }

    if(!updatedAlienRange) { // Increase alien's range in the final boss fight
        updatedAlienRange = true;
        for(let i = 0; i < 4; i++) {
             alienArray[i].range = 300;
        }
    }

    // Check which box the player is in at any point in time
    if(xPos > boxOneLeft && xPos < boxOneRight && zPos < boxOneBottom && zPos > boxOneTop) {
        setBox(1, 4);

        if(audioCollection.hole2.isPlaying) {
            audioCollection.hole2.stop();
        }
        
        setCheckPoint();
        handleHealthPacks();

        if(!defeatedBoss) {
            spawnLevelFourAliens();
            bossFight();
        }
        else {
            if(bulletCollidableMeshList.length == 0) {
                if(!playedEndGameTreeAudio) {
                    audioCollection.treeFall.play();
                    playedEndGameTreeAudio = true;
                }

                if(endGameBlockingTrees.position.y > -100) {
                    endGameBlockingTrees.position.y -= 0.2;
                }

                if(!audioCollection.heartAudio.isPlaying) {
                    audioCollection.heartAudio.play();
                }
            }
        }
    }
    else if(xPos > boxTwoLeft && xPos < boxTwoRight && zPos < boxTwoBottom && zPos > boxTwoTop) {
        setBox(2, 4);
        handleHeartInteraction();

        if(endGameBlockingTrees.position.y > -100) {
            endGameBlockingTrees.position.y -= 0.1;
        }
    }

    if(boxArr[1]) { // In box one 
        if(!movedBlockingTreesLevelFour) {
            /** Reset position and orientation of blocking trees to the end of puzzle three */
            if(playedTreeAudio) { // Will be true when the trees have emerged in puzzle one
                blockingTrees.rotation.y = 0;
                blockingTrees.position.set(470, -90, -355);
                playedTreeAudio = false;
            }
            movedBlockingTreesLevelFour = true;
        }

        if(!playedTreeAudio && !defeatedBoss) {
            setTimeout(() =>  audioCollection.treeFall.play(), 500);
            playedTreeAudio = true;
        }

        if(blockingTrees.position.y < 0) {
            blockingTrees.position.y += 0.35;
        }

        if(zPos > boxOneBottom - boundaryFactor) { // Place bottom boundary (except at box two overlap if the boss is defeated)
            if(bulletCollidableMeshList.length == 0 && defeatedBoss) {
                if(xPos < (boxTwoLeft + 10) || xPos > (boxTwoRight - 10))
                    controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
            else {
                controls.getObject().position.z = boxOneBottom - boundaryFactor;
            }
        }
        if(zPos < boxOneTop + boundaryFactor) { // Place top boundary
            controls.getObject().position.z = boxOneTop + boundaryFactor;
        }
        if(xPos < boxOneLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxOneLeft + boundaryFactor;
        }
        if(xPos > boxOneRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxOneRight - boundaryFactor;
        }
    }
    else if(boxArr[2]) { // In box two
        if(zPos > boxTwoBottom - boundaryFactor) { // Place bottom boundary
            controls.getObject().position.z = boxTwoBottom - boundaryFactor;
        }
        if(xPos < boxTwoLeft + boundaryFactor) { // Place left boundary
            controls.getObject().position.x = boxTwoLeft + boundaryFactor;
        }
        if(xPos > boxTwoRight - boundaryFactor) { // Place right boundary
            controls.getObject().position.x = boxTwoRight - boundaryFactor;
        }
    }
}

/**
 * Called when a bullet should be removed from the scene.
 * Disposes of the bullet's geometry and material and removes it from the entity's bullets array.
 * @param {*} entity Player or alien whose bullet is being removed from the scene.
 * @param {bullet} bullet Bullet to be removed.
 * @param {number} index The index of the bullet in the entity's bullets array.
 */
function removeBullet(entity, bullet, index) {
    bullet.geometry.dispose();
    bullet.material.dispose();
    scene.remove(bullet); // Remove the bullet from the scene
    entity.weapon.bullets.splice(index, 1); // Remove the bullet from the array
}

/**
 * Called every game loop.
 * Updates the player's bullet positions and detects their intersections with enemies.
 */
function updateBullets() {
    player.weapon.bullets.forEach((item, index) => {

        if(item.originalPosition.distanceTo(item.bullet.position) > 250) { // Restrict the bullet from travelling past 250 units
            removeBullet(player, item.bullet, index);
            return; // Iterate to the next bullet
        }

        item.bullet.translateZ(-300 * clock.delta); // Move the bullet away from the player
        item.bullet.getWorldPosition(item.raycaster.ray.origin); // Update the ray's new origin as the bullet's current position
        item.raycaster.ray.set(item.raycaster.ray.origin, item.raycaster.ray.direction);

        // scene.add(new THREE.ArrowHelper(item.raycaster.ray.direction, item.raycaster.ray.origin, 1));
        let intersects = item.raycaster.intersectObjects(bulletCollidableMeshList, true);

        if(intersects.length > 0) {
            let intersect = intersects[0];
            let distance_one = intersect.distance;
            let distance_twoVec = new THREE.Vector3();
            distance_twoVec.subVectors(item.bullet.position, item.lastPosition);
            let distance_two = distance_twoVec.length();

            if(distance_one <= distance_two) { // Hit
               
                if(intersect.object.parent.parent.name != null) {
                    switch(intersect.object.parent.parent.name) { // The name of the model that the hitbox mesh is attached to
                        case "alien1":
                            if(item.box >= alien1.canShoot.box) { // Only allow the player's bullet to deal damage if the player is in the same bounding box as the alien
                                audioCollection.hitmarker.play();
                                damageAlien(alien1, intersect, item.type);
                                removeBullet(player, item.bullet, index); // Remove the bullet from the scene after hitting an alien
                            }
                            break;
                        case "alien2":
                            if(item.box >= alien2.canShoot.box) {
                                audioCollection.hitmarker.play();
                                damageAlien(alien2, intersect, item.type);
                                removeBullet(player, item.bullet, index);
                            }
                            break;
                        case "alien3":
                            if(item.box >= alien3.canShoot.box) {
                                audioCollection.hitmarker.play();
                                damageAlien(alien3, intersect, item.type);
                                removeBullet(player, item.bullet, index);
                            }
                            break;
                        case "alien4":
                            if(item.box >= alien4.canShoot.box) {
                                audioCollection.hitmarker.play();
                                damageAlien(alien4, intersect, item.type);
                                removeBullet(player, item.bullet, index);
                            }
                            break;
                        case "alien5":
                            if(item.box >= alien5.canShoot.box) {
                                audioCollection.hitmarker.play();
                                damageAlien(alien5, intersect, item.type);
                                removeBullet(player, item.bullet, index);
                            }
                            break;
                        case "alien6":
                            if(item.box >= alien6.canShoot.box) {
                                audioCollection.hitmarker.play();
                                damageAlien(alien6, intersect, item.type);
                                removeBullet(player, item.bullet, index);
                            }
                            break;
                        case "boss": // Boss
                            if(!bossFightStarted || intro || bossRoaring) return; // Prevent player from shooting boss before combat is enabled or while boss is roaring
                            audioCollection.hitmarker.play();
                            damageBoss(item.type);
                            removeBullet(player, item.bullet, index);
                            break;
                    }
                }
            }
        }

        if(currentLevel == 4 && !intro) {
            let intersects = item.raycaster.intersectObjects(orbCollidableMeshList, true);

            if(intersects.length > 0) {
                let intersect = intersects[0];
                let distance_one = intersect.distance;
                let distance_twoVec = new THREE.Vector3();
                distance_twoVec.subVectors(item.bullet.position, item.lastPosition);
                let distance_two = distance_twoVec.length();
    
                if(distance_one <= distance_two) { // Hit
                    if(audioCollection.orbExplosion.isPlaying) {
                        audioCollection.orbExplosion.stop();
                    }
                    audioCollection.orbExplosion.play();

                    switch(intersect.object.name) {
                        case "orbOne":
                            orbOne.active = false;
                            orbOne.statusMesh.material.color.setHex(0xff0000);
                            healingRayArray[0].visible = false;
                            orbOne.mesh.visible = false;
                            break;
                        case "orbTwo":
                            orbTwo.active = false;
                            orbTwo.statusMesh.material.color.setHex(0xff0000);
                            healingRayArray[1].visible = false;
                            orbTwo.mesh.visible = false;
                            break;
                        case "orbThree":
                            orbThree.active = false;
                            orbThree.statusMesh.material.color.setHex(0xff0000);
                            healingRayArray[2].visible = false;
                            orbThree.mesh.visible = false;
                            break;
                        case "orbFour":
                            orbFour.active = false;
                            orbFour.statusMesh.material.color.setHex(0xff0000);
                            healingRayArray[3].visible = false;
                            orbFour.mesh.visible = false;
                            break;
                    }
                }
            }
        }
        item.lastPosition.copy(item.bullet.position); // Set the bullet's last position as the bullet's current position
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

function updateAlienCombat() {
    alienArray.forEach(alien => {
        if(alienCanShoot(alien)) {
            alien.model.lookAt(player.playerModel.position.x, 0, player.playerModel.position.z);
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
                alien.model.position.z -= 0.05;
                alien.movement.distanceMoved += 0.05;
            }
            else if(alien.movement.leftOrRight == "right") { // Moving right
                updateAlienAnimation(alien, alien.strafeRAnim);
                alien.model.position.z += 0.05;
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
}

function updateAlienBullet(alien) {

    alien.weapon.bullets.forEach((item, index) => {

        if(item.originalPosition.distanceTo(item.bullet.position) > alien.range) { // Restrict the bullet from travelling past 250 units
            removeBullet(alien, item.bullet, index);
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

                if(player.shield.shieldEnabled) { // Shield is active
                    player.shield.shieldValue -= 50;

                    if(audioCollection.shieldHit.isPlaying) {
                        audioCollection.shieldHit.stop();
                    }
                    audioCollection.shieldHit.play();

                    if(player.shield.shieldValue <= 0) {
                        player.shield.shieldValue = 0;

                        if(audioCollection.shieldBreak.isPlaying) {
                            audioCollection.shieldBreak.stop();
                        }
                        audioCollection.shieldBreak.play();
                        
                        shieldDisplay.style.visibility = "hidden";
                        player.shield.shieldEnabled = false;

                        setTimeout(() => {
                            player.shield.shieldRecharging = true;
                        }, 4000)
                    }

                    shieldNumber.innerHTML = player.shield.shieldValue;
                    shieldbar.setAttribute("style", "width: " + player.shield.shieldValue / 10.25 + "%");
                }
                else {
                    if(audioCollection.playerInjured.isPlaying) {
                        audioCollection.playerInjured.stop();
                    }
                    audioCollection.playerInjured.play();
                    player.currentHealth -= 35;
                }

                if(player.currentHealth <= 0) {
                    if(audioCollection.bossFightMusic.isPlaying) {
                        audioCollection.bossFightMusic.stop();
                    }
                    player.currentHealth = 0;
                    audioCollection.playerDeath.play();
                    playerDeath.classList.add("fadein");
                    playerDeath.style.visibility = "visible";
                    setTimeout(() => audioCollection.deathAudio.play(), 500);
                    controls.unlock();
                }
                else {
                    removeBullet(alien, item.bullet, index); // Remove alien's bullet from the scene
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
 * Called when the player's bullet collides with an alien.
 * Checks where the bullet collided with the current alien and reduces the alien's health accordingly.
 * Plays the hitmarker audio and updates crosshair styling.
 * Plays death animation for the current alien when health drops to zero and removes the hitbox from the scene.
 * @param {alien} alien The alien that was shot
 * @param {*} intersect First index of the intersects array
 * @param {string} type The type of bullet that hit the alien. Possible values are normal and poison 
 */
function damageAlien(alien, intersect, type) {
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
    }
    else { // Bodyshot
        if(type == "normal") { // Normal shot
            alien.currentHealth -= 35;
            crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
        }
        else { // Poison shot
            alien.currentHealth -= 50;
            crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";

            if(alien.currentHealth > 0) {
                let ticks = 0;
                let intervalId; // Needed to clear interval when an enemy is poisoned

                intervalId = setInterval(() => {
                    if(player.currentHealth <= 0) { // Poison stops ticking if player dies
                        clearInterval(intervalId);
                        return;
                    }
                    ticks++;

                    alien.currentHealth -= 17; // Take 17 damage every tick (1 hit + 3 ticks is > 100 health lost)
                    if(alien.currentHealth <= 0) {
                        poisonTick.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
                    }

                    if(audioCollection.hitmarker.isPlaying) {
                        audioCollection.hitmarker.stop();
                    }
                    audioCollection.hitmarker.play();
                    poisonTick.style.visibility = "visible";
                    
                    setTimeout(() => {
                        poisonTick.style.visibility = "hidden";
                        poisonTick.style.filter = "none";
                    }, 500);

                    if(ticks == 3 || alien.currentHealth <= 0) {

                        if(alien.currentHealth <= 0) {
                            if(!alien.deathAnim.enabled) { // Only if the death sequence is not already playing
                                alien.deathAnim.reset();
                                updateAlienAnimation(alien, alien.deathAnim);
                                let indexOfCollidableMesh = bulletCollidableMeshList.indexOf(alien.hitbox.mesh);
                                bulletCollidableMeshList.splice(indexOfCollidableMesh, 1);
                                alien.model.remove(alien.hitbox.mesh);
                            }
                        }

                        if(intervalId) {
                            clearInterval(intervalId);
                        }   
                    }
                }, 1000);
            }
        }
    }

    if(alien.currentHealth <= 0) {
        crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
        alien.deathAnim.reset();
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
 * Called when the player's bullet collides with the boss.
 * Plays death animation and audio for the boss when health drops to zero and removes the boss's hitbox from the scene.
 * Plays the hitmarker audio and updates crosshair styling.
 * @param {string} type The type of bullet that hit the alien. Possible values are normal and poison 
 */
function damageBoss(type) {
    if(type == "normal") { // Normal shot
        boss.currentHealth -= 300;
        bossHealthBar.setAttribute("style", "width: " + boss.currentHealth / 33.33 + "%");
        crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";
    }
    else { // Poison shot
        boss.currentHealth -= 50;
        bossHealthBar.setAttribute("style", "width: " + boss.currentHealth / 33.33 + "%");
        crosshair.style.background = "url(hud/crosshairs/crosshair_hitmarker.svg)";

        if(boss.currentHealth > 0) {
            let ticks = 0;
            let timerId;

            timerId = setInterval(() => {
                ticks++;

                boss.currentHealth -= 10;
                bossHealthBar.setAttribute("style", "width: " + boss.currentHealth / 33.33 + "%");
                if(boss.currentHealth <= 0) {
                    poisonTick.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
                }

                if(audioCollection.hitmarker.isPlaying) {
                    audioCollection.hitmarker.stop();
                }
                audioCollection.hitmarker.play();
                poisonTick.style.visibility = "visible";
                
                setTimeout(() => {
                    poisonTick.style.visibility = "hidden";
                    poisonTick.style.filter = "none";
                }, 500);

                if(ticks == 3 || boss.currentHealth <= 0) {

                    if(boss.currentHealth <= 0) {
                        if(!boss.deathAnim.isPlaying) { // Only if the death sequence is not already playing
                            audioCollection.bossFightMusic.stop();
                            checkpoint.style.visibility = "visible"; // The player will only have to defeat the boss once
                            setTimeout(() => {
                                checkpoint.style.visibility = "hidden";
                            }, 2000);
                            
                            boss.deathAnim.reset();
                            updateBossAnimation(boss.deathAnim);
                            audioCollection.bossDeath.play();
                            let indexOfCollidableMesh = bulletCollidableMeshList.indexOf(boss.hitbox.mesh);
                            bulletCollidableMeshList.splice(indexOfCollidableMesh, 1);
                            boss.model.remove(boss.hitbox.mesh);
                            defeatedBoss = true;
                            bossHealth.style.visibility = "hidden";

                            resetBossTowers = true;
                            for(let i = 0; i < towerArray.length; i++) {
                                healingRayArray[i].visible = false;
                                orbArray[i].mesh.material.color.setHex(0xffffff);
                            }
                        }
                    }

                    if(timerId) {
                        clearInterval(timerId);
                    }   
                }
            }, 1000);
        }
    }
    
    if(boss.currentHealth <= 0) {
        audioCollection.bossFightMusic.stop();
        checkpoint.style.visibility = "visible"; // The player will only have to defeat the boss once
        setTimeout(() => {
            checkpoint.style.visibility = "hidden";
        }, 2000);
        
        crosshair.style.filter = "brightness(0) saturate(100%) invert(11%) sepia(96%) saturate(6875%) hue-rotate(0deg) brightness(91%) contrast(126%)";
        boss.deathAnim.reset();
        updateBossAnimation(boss.deathAnim);
        audioCollection.bossDeath.play();
        let indexOfCollidableMesh = bulletCollidableMeshList.indexOf(boss.hitbox.mesh);
        bulletCollidableMeshList.splice(indexOfCollidableMesh, 1);
        boss.model.remove(boss.hitbox.mesh);
        defeatedBoss = true;
        bossHealth.style.visibility = "hidden";

        resetBossTowers = true;
        for(let i = 0; i < towerArray.length; i++) {
            healingRayArray[i].visible = false;
            orbArray[i].mesh.material.color.setHex(0xffffff);
        }
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

/**
 * Called every game loop when looping through the alien array.
 * Checks the conditions that need to be true to allow the target alien to shoot at the player.
 * @param {alien} alien The target alien
 */
function alienCanShoot(alien) {
    return alien.currentHealth > 0 && player.currentHealth > 0 && alienInRangeOfPlayer(alien) && 
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

/** 
 * Standalone function to handle the jump animation.
 * Starts the jump animation, stores the animation that was playing before and stops it.
 * Starts the previous animation again after running the jump animation for 600ms, unless idle was called while jumping (keyup). 
 */
function handleJumpAnimation() { 
    player.animations.jumpAnim.enabled = true;
    audioCollection.jumpBoost.play();
    let tempAnimation = player.animations.currentAnimation;
    player.animations.currentAnimation.enabled = false;
    player.animations.currentAnimation = player.animations.jumpAnim;

    setTimeout(function() {
        player.jumping = false;
        audioCollection.jumpBoost.stop();
        if(idleCalled == true) {
            updatePlayerAnimation(player.animations.idleAnim);
            idleCalled = false;
        }
        else {
            if(tempAnimation == player.animations.runAnim && player.movingForward && !player.running) {
                updatePlayerAnimation(player.animations.walkAnim);
            }
            else {
                updatePlayerAnimation(tempAnimation);
            }
        }
    }, 600);
}

/** 
 * Takes in the next animation to play. 
 * If the player is not jumping, stops the current animation and starts the next animation.
 * If the player is jumping and the next animation is idle, schedule idle to play at the end of the jump. 
 */
function updatePlayerAnimation(newAnimation) { 
    if(cameraType == "fp") return;

    if(!player.jumping) {
        player.animations.currentAnimation.enabled = false;
        newAnimation.enabled = true;
        player.animations.currentAnimation = newAnimation;
    }
    else {
        if(newAnimation == player.animations.idleAnim)
            idleCalled = true;
    }
}

/** 
 * Called when an alien's current animation should change.
 * Takes in the new animation, disables the current animation and plays the new one.
 * Sets the new animation as the alien's current animation.
 * @param {alien} alien The target alien
 * @param {animation} newAnimation The new animation to play 
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
 * Called when the boss's current animation should change.
 * Takes in the new animation, stops the current animation and plays the new one.
 * Sets the new animation as the boss's current animation.
 * @param {animation} newAnimation The new animation to play
 */
function updateBossAnimation(newAnimation) {
    boss.currentAnimation.stop();
    newAnimation.play();
    boss.currentAnimation = newAnimation;
}

/**
 * Called when the player is in an area with health packs.
 * Handles the raycasting logic to allow them to pick up the health packs and regenerate health.
 * This function must be called in a bounding box check.
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

/**
 * Called when the player interacts with a health pack.
 * If the player has less than 100HP, they are healed for 25HP (100HP for a super health pack) and the health pack is removed from the scene.
 */
function healthPackPickup() {
    if(player.currentHealth == 100) {
        audioCollection.wrongMove.play();
        return;
    }

    pickedUpHealthPacks.push(selectedHealthPack.object);
    let indexOfHealthPack = healthPackCollidableMeshList.indexOf(selectedHealthPack.object);
    healthPackCollidableMeshList.splice(indexOfHealthPack, 1);
    scene.remove(selectedHealthPack.object);

    if(selectedHealthPack.object.material.color.g == 0) { // Regular health pack
        player.currentHealth += 25;
        if(player.currentHealth > 100) {
            player.currentHealth = 100;
        }
    }
    else { // Super health pack
        player.currentHealth = 100;
    }
    updatePlayerHealth();

    if(audioCollection.healthRefill.isPlaying) {
        audioCollection.healthRefill.stop();
    }
    audioCollection.healthRefill.play();
}

/**
 * Called every game loop.
 * Handles the animation of the health packs in the scene.
 */
function updateHealthPackAnimation() {
    healthPackCollidableMeshList.forEach(healthPack => {
        if(healthPack.material.color.g == 0) { // Regular health pack
            if(healthPack.position.y <= 6.25 || healthPack.position.y >= 7.75) { // Reached boundary
                if(healthPack.direction == "down") {
                    healthPack.direction = "up";
                }
                else {
                    healthPack.direction = "down";
                }
            }
        }
        else { // Super health pack
            if(healthPack.position.y <= 6.5 || healthPack.position.y >= 8) { // Reached boundary
                if(healthPack.direction == "down") {
                    healthPack.direction = "up";
                }
                else {
                    healthPack.direction = "down";
                }
            }
        }
       
        if(healthPack.direction == "down") { // Decrease y position
            healthPack.position.y -= 0.01;
        }
        else { // Increase y position
            healthPack.position.y += 0.01;
        }

        healthPack.rotation.y += 0.01; // Rotate counterclockwise
    });
}

/** 
 * Helper function. 
 * Handles the animation of an item in the world before the player has picked it up.
 * @param {object} model The model of the item.
 * @param {number} lowerBound The lower bound of the up-down animation
 * @param {number} upperBound The upper bound of the up-down animation
 */ 
function itemAnimation(model, lowerBound, upperBound) {
    if(model.position.y <= lowerBound || model.position.y >= upperBound) { // Reached boundary
        if(model.direction == "down") {
            model.direction = "up";
        }
        else {
            model.direction = "down";
        }
    }

    if(model.direction == "down") { // Decrease y position
        model.position.y -= 0.01;
    }
    else { // Increase y position
        model.position.y += 0.01;
    }

    if(model != heart) {
        model.rotation.y += 0.01; // Rotate counterclockwise
    }
}

/**
 * Called every game loop until the player picks up the gun.
 * Handles the animation of the gun on the ground.
 */
function updateGunOnGroundAnimation() {
    itemAnimation(player.weapon.model, 1, 2);
}

/**
 * Called every game loop until the player picks up the shield.
 * Handles the animation of the shield on the ground.
 */
function updateShieldOnGroundAnimation() {
    itemAnimation(player.shield.model, 2, 3);
}

function updateHeartAnimation() {
    itemAnimation(heart, 6, 7);
}

function playFootsteps() {
    if(player.moving) {
        if(player.running) { // Increase playback rate if the player is running
            audioCollection.footstepsLeaves.setPlaybackRate(1.25);
            audioCollection.footstepsWood.setPlaybackRate(1.25);
        }
        else {
            audioCollection.footstepsLeaves.setPlaybackRate(1);
            audioCollection.footstepsWood.setPlaybackRate(1);
        }

        if(!onTree && !onPlatform) { // On leaves / ground
            if(controls.getObject().position.y <= 8) {
                if(!audioCollection.footstepsLeaves.isPlaying) {
                    audioCollection.footstepsLeaves.play();
                }
            }
        }
        else if(onTree) { // On tree
            if(controls.getObject().position.y <= 18) {
                if(!audioCollection.footstepsWood.isPlaying) {
                    audioCollection.footstepsWood.play();
                }
            }
        }
        else { // On platform
            if(controls.getObject().position.y <= 12) {
                if(!audioCollection.footstepsWood.isPlaying) {
                    audioCollection.footstepsWood.play();
                }
            }
        }
    }
    else {
        if(audioCollection.footstepsLeaves.isPlaying) {
            audioCollection.footstepsLeaves.stop();
        }
        if(audioCollection.footstepsWood.isPlaying) {
            audioCollection.footstepsWood.stop();
        }
    }
}

function rechargeShield() {
    if(player.shield.hasShield && !player.shield.shieldEnabled && player.shield.shieldValue < 100 && player.shield.shieldRecharging) { // Shield has been broken
        player.shield.shieldValue += 0.2;
        shieldNumber.innerHTML = Math.floor(player.shield.shieldValue);
        shieldbar.style.width = player.shield.shieldValue / 10 + "%";

        if(player.shield.shieldValue >= 100) {
            player.shield.shieldValue = 100;
            player.shield.shieldRecharging = false;
            shieldbar.style.width = "10.25%";
            if(!inPuzzleTwo) {// Don't play shield recharge audio if player is in puzzle two
                audioCollection.shieldReady.play();
            }
        }
    }
}

function playAlienTransmission() {
    if(currentLevel != 4 && !inPuzzleTwo) {
        transmissionCount += 0.1;
        if(currentLevel == 1 && !playedInitialTransmission && Math.floor(transmissionCount) >= 25) { // Play initial early transmission
            transmissionCount = 0;
            playedInitialTransmission = true;
            if(Math.floor(Math.random() * 2) == 0) {
                audioCollection.transmissionOne.play();
            }
            else {
                audioCollection.transmissionTwo.play()
            }
        }

        if(Math.floor(transmissionCount) >= 500) {
            transmissionCount = 0;
            let random = Math.floor(Math.random() * 3);
            switch(random) {
                case 0: 
                    audioCollection.transmissionOne.play();
                    break;
                case 1:
                    audioCollection.transmissionTwo.play();
                    break;
                case 2: // Don't play any transmission
                    return;
            }
        }
    }
}

/**
 * Called every game loop until the player picks up the weapon upgrade.
 * Handles the animation of the weapon upgrade on the ground.
 */
function updateWeaponUpgradeOnGroundAnimation() {
    itemAnimation(player.weaponUpgrade.model, 2, 3);
}

/**
 * Called when the player has defeated the boss and walks into the final area.
 * Handles the raycasting logic to allow them to interact with the heart of the planet and make a final decision.
 */
function handleHeartInteraction() {
    let cameraDirection = new THREE.Vector3();
    cameraDirection.normalize();
    controls.getDirection(cameraDirection);
    let playerRaycaster = new THREE.Raycaster(controls.getObject().position, cameraDirection);

    let intersects = playerRaycaster.intersectObjects([heart], true);

    if(intersects.length > 0 && intersects[0].distance < 10) {
        interact.style.visibility = "visible";
        interactableObject = "heart";
    }
    else {
        interact.style.visibility = "hidden";
    }
}

function endGame() {
    takeHeartButton.addEventListener("click", playEndCutScene);
    leaveHeartButton.addEventListener("click", playEndCutScene);

    takeHeartButton.param = "takeHeart";
    leaveHeartButton.param = "leaveHeart";

    takeHeartButton.style.visibility = "visible";
    leaveHeartButton.style.visibility = "visible";

    interact.style.visibility = "hidden";

    interactedWithHeart = true;
    controls.unlock();
}

function playEndCutScene(event) {
    let endCutscene;
    let decision = event.currentTarget.param;

    takeHeartButton.style.visibility = "hidden";
    leaveHeartButton.style.visibility = "hidden";

    endgameFadeIn.classList.add("fadein");
    endgameFadeIn.style.visibility = "visible";

    openFullscreen();

    setTimeout(() => { // Play the ending cutscene 2 seconds after the fade in has finished
        switch(decision) {
            case "takeHeart":
                endCutscene = takeHeartCutScene;
                skipButton.param = "takeHeart";
                break;
            case "leaveHeart":
                endCutscene = leaveHeartCutScene;
                skipButton.param = "leaveHeart";
                break;
        }

        endCutscene.play();
        endCutscene.style.visibility = "visible";
        endCutscene.style.display = "block";

        skipButton.style.visibility = "visible";

        endCutscene.onended = function() {
            endCutscene.remove();
            skipButton.style.visibility = "hidden";
    
            setTimeout(() => {
                creditsCutScene.play();
                creditsCutScene.style.visibility = "visible";
                creditsCutScene.style.display = "block";
    
                skipButton.param = "credits";
                skipButton.style.visibility = "visible";

                creditsCutScene.onended = function() {
                    creditsCutScene.remove();
                    location.reload();
                };
            }, 3000);
        }
    }, 5000);
}

/**
 * Helper function. 
 * Called when a texture must be loaded.
 * @param {string} url Where the texture file is stored
 */
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

/**
 * Helper function.
 * Called when a model must be loaded.
 * Contains a callback that executes the appropriate function using the provided identifier key.
 * @param {string} url Where the model is stored
 * @param {string} key The unique indentifier key used by the callback function to execute the correct initializer
 */
function loadModel(url, key) {
    function callback(gltf) {
        switch(key) {
            case "player":
                initPlayerModel(gltf);
                break;
            case "alien":
                initAlienModels(gltf);
                break;
            case "boss":
                initBossModel(gltf);
                break;
            case "bounty_hunter":
                initBountyHunterModels(gltf);
                break;
            case "weapon":
                initWeaponModel(gltf);
                break;
            case "shield":
                initShieldModel(gltf);
                break;
            case "weapon_upgrade":
                initWeaponUpgradeModel(gltf);
                break;
            case "ship":
                initShipModel(gltf);
                break;
            case "heart":
                initHeartModel(gltf);
                break;
            case "healthpack":
                initHealthPacks(gltf);
                break;
            case "crate":
                initCrate(gltf);
                break;
            case "book":
                initBook(gltf);
                break;
            case "donut":
                initDonut(gltf);
                break;
            case "barrel":
                initBarrel(gltf);
                break;
            case "barrel_open":
                initOpenBarrel(gltf);
                break;
            case "scroll":
                initScroll(gltf);
                break;
            case "speakers":
                initSpeakers(gltf);
                break;              
            case "pinetree":
                initPineTrees(gltf);
                break;
            case "blocking_tree":
                initBlockingTrees(gltf);
                break;
            case "broadleaf":
                initBroadLeaf(gltf);
                break;
            case "boulder":
                initBoulder(gltf);
                break;
            case "rock_one":
                initRocks(gltf, 200, 0.1, 0.25);
                break;
            case "rock_two":
                initRocks(gltf, 300, 0.0025, 0.01);
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
            case "letters_rock":
                initLettersRock(gltf);
                break;
            case "bush_one":
                initBushes(gltf, 965, 1, 2, "bush_one");
                break;
            case "bush_two":
                initBushes(gltf, 965, 2, 3, "bush_two");
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

function configureAudio(url, audio, loop, volume, play) {
    audioLoader.load(url, function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(loop);
        audio.setVolume(volume);
        if(play) {
            audio.play();
        }
    });
}

/**
 * Helper function.
 * Called when an audio file must be loaded.
 * Contains a callback that initializes the appropriate object using the provided indentifier key.
 * @param {string} url Where the model is stored
 * @param {string} key The unique indentifier key used by the callback function to initialize the correct AudioCollection object
 */
function loadAudio(url, key) {
    switch(key) {
        case "wildlife":
            audioCollection.wildlife = new THREE.Audio(listener);
            configureAudio(url, audioCollection.wildlife, true, 0.1, true); // url, audio, looping, volume, play
            break;
        case "footsteps_leaves":
            audioCollection.footstepsLeaves = new THREE.Audio(listener);
            configureAudio(url, audioCollection.footstepsLeaves, false, 0.1, false);
            break;
        case "footsteps_wood":
            audioCollection.footstepsWood = new THREE.Audio(listener);
            configureAudio(url, audioCollection.footstepsWood, false, 0.1, false);
            break;   
        case "weapon":
            audioCollection.weapon = new THREE.Audio(listener);
            configureAudio(url, audioCollection.weapon, false, 0.3, false);
            break;
        case "headshot_announcer":
            audioCollection.headshotAnnouncer = new THREE.Audio(listener);
            configureAudio(url, audioCollection.headshotAnnouncer, false, 0.3, false);
            break;
        case "headshot":
            audioCollection.headshot = new THREE.Audio(listener);
            configureAudio(url, audioCollection.headshot, false, 0.2, false);
            break;
        case "hitmarker":
            audioCollection.hitmarker = new THREE.Audio(listener);
            configureAudio(url, audioCollection.hitmarker, false, 0.5, false);
            break;
        case "poison_bullet_ready":
            audioCollection.weaponUpgradeReady = new THREE.Audio(listener);
            configureAudio(url, audioCollection.weaponUpgradeReady, false, 0.9, false);
            break;
        case "poison_bullet_shot":
            audioCollection.weaponUpgradeShot = new THREE.Audio(listener);
            configureAudio(url, audioCollection.weaponUpgradeShot, false, 0.5, false);
            break;
        case "jump_boost":
            audioCollection.jumpBoost = new THREE.Audio(listener);
            configureAudio(url, audioCollection.jumpBoost, false, 0.3, false);
            break;
        case "paper":
            audioCollection.paper = new THREE.Audio(listener);
            configureAudio(url, audioCollection.paper, false, 0.3, false);
            break;
        case "totem_select":
            audioCollection.totemSelect = new THREE.Audio(listener);
            configureAudio(url, audioCollection.totemSelect, false, 0.35, false);
            break;
        case "wrong_move":
            audioCollection.wrongMove = new THREE.Audio(listener);
            configureAudio(url, audioCollection.wrongMove, false, 0.5, false);
            break;
        case "correct_totem_order":
            audioCollection.correctTotemOrder = new THREE.Audio(listener);
            configureAudio(url, audioCollection.correctTotemOrder, false, 0.4, false);
            break;
        case "rock_sink":
            audioCollection.rockSink = new THREE.Audio(listener);
            configureAudio(url, audioCollection.rockSink, false, 0.75, false);
            break;
        case "rock_slide":
            audioCollection.rockSlide = new THREE.Audio(listener);
            configureAudio(url, audioCollection.rockSlide, false, 0.5, false);
            break;
        case "tooltip_completed":
            audioCollection.tooltipCompleted = new THREE.Audio(listener);
            configureAudio(url, audioCollection.tooltipCompleted, false, 0.8, false);
            break;
        case "alien_weapon_shot":
            audioCollection.alienWeapon = new THREE.Audio(listener);
            configureAudio(url, audioCollection.alienWeapon, false, 0.3, false);
            break;
        case "player_injured":
            audioCollection.playerInjured = new THREE.Audio(listener);
            configureAudio(url, audioCollection.playerInjured, false, 0.3, false);
            break;
        case "player_death":
            audioCollection.playerDeath = new THREE.Audio(listener);
            configureAudio(url, audioCollection.playerDeath, false, 0.3, false);
            break;
        case "death_audio":
            audioCollection.deathAudio = new THREE.Audio(listener);
            configureAudio(url, audioCollection.deathAudio, false, 0.5, false);
            break;
         case "chicken_dance":
            audioCollection.chickenDance = new THREE.Audio(listener);
            configureAudio(url, audioCollection.chickenDance, false, 0.25, false);
            break;
        case "gangnam_style":
            audioCollection.gangnamStyle = new THREE.Audio(listener);
            configureAudio(url, audioCollection.gangnamStyle, false, 0.25, false);
            break;
        case "macarena_dance":
            audioCollection.macarenaDance = new THREE.Audio(listener);
            configureAudio(url, audioCollection.macarenaDance, false, 0.25, false);
            break;
        case "ymca_dance":
            audioCollection.ymcaDance = new THREE.Audio(listener);
            configureAudio(url, audioCollection.ymcaDance, false, 0.25, false);
            break;
        case "lose_puzzle":
            audioCollection.losePuzzle = new THREE.Audio(listener);
            configureAudio(url, audioCollection.losePuzzle, false, 0.5, false);
            break;
        case "correct":
            audioCollection.correct = new THREE.Audio(listener);
            configureAudio(url, audioCollection.correct, false, 0.75, false);
            break;
        case "win_puzzle":
            audioCollection.winPuzzle = new THREE.Audio(listener);
            configureAudio(url, audioCollection.winPuzzle, false, 0.75, false);
            break;
        case "record_scratch":
            audioCollection.recordScratch = new THREE.Audio(listener);
            configureAudio(url, audioCollection.recordScratch, false, 0.5, false);
            break;
        case "health_refill":
            audioCollection.healthRefill = new THREE.Audio(listener);
            configureAudio(url, audioCollection.healthRefill, false, 0.5, false);
            break;
        case "gun_cock":
            audioCollection.gunCock = new THREE.Audio(listener);
            configureAudio(url, audioCollection.gunCock, false, 0.5, false);
            break;
        case "boss_roar":
            audioCollection.bossRoar = new THREE.Audio(listener);
            configureAudio(url, audioCollection.bossRoar, false, 0.6, false);
            break;
        case "boss_fight_music":
            audioCollection.bossFightMusic = new THREE.Audio(listener);
            configureAudio(url, audioCollection.bossFightMusic, true, 0.25, false);
            break;
        case "boss_attack":
            audioCollection.bossAttack = new THREE.Audio(listener);
            configureAudio(url, audioCollection.bossAttack, false, 0.5, false);
            break;
        case "boss_footstep":
            audioCollection.bossFootstep = new THREE.PositionalAudio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.bossFootstep.setBuffer(buffer);
                audioCollection.bossFootstep.setLoop(false);
                audioCollection.bossFootstep.setRefDistance(40);
                audioCollection.bossFootstep.gain.gain.value = 5;
                audioCollection.bossFootstep.playBackRate = 1.75;
            });
            break;
        case "boss_teleport":
            audioCollection.bossTeleport = new THREE.Audio(listener);
            configureAudio(url, audioCollection.bossTeleport, false, 0.6, false);
            break;
        case "boss_death":
            audioCollection.bossDeath = new THREE.Audio(listener);
            configureAudio(url, audioCollection.bossDeath, false, 0.6, false);
            break;
        case "tree_fall":
            audioCollection.treeFall = new THREE.Audio(listener);
            configureAudio(url, audioCollection.treeFall, false, 0.3, false);
            break;
        case "shield_active":
            audioCollection.shieldActive = new THREE.Audio(listener);
            configureAudio(url, audioCollection.shieldActive, false, 0.4, false);
            break;
        case "shield_hit":
            audioCollection.shieldHit = new THREE.Audio(listener);
            configureAudio(url, audioCollection.shieldHit, false, 0.4, false);
            break;
        case "shield_break":
            audioCollection.shieldBreak = new THREE.Audio(listener);
            configureAudio(url, audioCollection.shieldBreak, false, 0.4, false);
            break;
        case "shield_ready":
            audioCollection.shieldReady = new THREE.Audio(listener);
            configureAudio(url, audioCollection.shieldReady, false, 0.4, false);
            break;
        case "alien_transmission_one":
            audioCollection.transmissionOne = new THREE.Audio(listener);
            configureAudio(url, audioCollection.transmissionOne, false, 0.75, false);
            break;
        case "alien_transmission_two":
            audioCollection.transmissionTwo = new THREE.Audio(listener);
            configureAudio(url, audioCollection.transmissionTwo, false, 0.75, false);
            break;
        case "tripwire_activated":
            audioCollection.tripwireActivated = new THREE.Audio(listener);
            configureAudio(url, audioCollection.tripwireActivated, false, 0.5, false);
            break;
        case "tripwire_buzz":
            audioCollection.tripwireBuzz = new THREE.Audio(listener);
            configureAudio(url, audioCollection.tripwireBuzz, false, 0.75, false);
            break;
        case "heart":
            audioCollection.heartAudio = new THREE.PositionalAudio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.heartAudio.setBuffer(buffer);
                audioCollection.heartAudio.setLoop(true);
                audioCollection.heartAudio.setRefDistance(25);
            });
            break;
        case "hole":
            audioCollection.hole = new THREE.PositionalAudio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.hole.setBuffer(buffer);
                audioCollection.hole.setLoop(true);
                audioCollection.hole.setRefDistance(25);
            });
            break;
        case "hole2":
            audioCollection.hole2 = new THREE.PositionalAudio(listener);
            audioLoader.load(url, function(buffer) {
                audioCollection.hole2.setBuffer(buffer);
                audioCollection.hole2.setLoop(true);
                audioCollection.hole2.setRefDistance(25);
            });
            break;
        case "scream":
            audioCollection.scream = new THREE.Audio(listener);
            configureAudio(url, audioCollection.scream, false, 0.4, false);
            break;
        case "burp":
            audioCollection.burp = new THREE.Audio(listener);
            configureAudio(url, audioCollection.burp, false, 0.4, false);
            break;
        case "orb_explosion":
            audioCollection.orbExplosion = new THREE.Audio(listener);
            configureAudio(url, audioCollection.orbExplosion, false, 0.4, false);
            break;
    }
}

/**
 * Called when a player has died in level 2 or level 3 and clicked restart.
 * Loops through all aliens and resets their health and hitboxes.
 */
function respawnAliens() {
    alienArray.forEach(alien => {
        if(alien.currentHealth < 100) {
            alien.currentHealth = 100;
            alien.model.add(alien.hitbox.mesh);
            bulletCollidableMeshList.push(alien.hitbox.mesh);
        }
    });
}

function setCheckPoint() {
    if(!checkpointDisplayed) {
        if(player.currentHealth < 100) {
            player.currentHealth = 100;
            updatePlayerHealth();
            audioCollection.healthRefill.play();
        }

        if(player.shield.hasShield) {
            if(player.shield.shieldValue < 100) {
                player.shield.shieldValue = 100;
                player.shield.shieldRecharging = false;
                audioCollection.shieldReady.play();

                shieldNumber.innerHTML = player.shield.shieldValue;
                shieldbar.setAttribute("style", "width: 10.25%");
            }
        }

        if(player.weaponUpgrade.hasWeaponUpgrade) {
            weaponUpgradeBar.style.width = "8.25%";
            player.weaponUpgrade.onCooldown = false;
        }

        checkpoint.style.visibility = "visible";
        setTimeout(() => {
            checkpoint.style.visibility = "hidden";
        }, 2000);
        checkpointDisplayed = true;
    }
}

function restartCheckpoint() {
    if(audioCollection.deathAudio.isPlaying) {
        audioCollection.deathAudio.stop();
    }

    pickedUpHealthPacks.forEach(healthPack => {
        scene.add(healthPack);
        healthPackCollidableMeshList.push(healthPack);
    });

    pickedUpHealthPacks.length = 0;

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

    clearTimeout(poisonTimerId);

    if(player.shield.hasShield) {
        player.shield.shieldValue = 100;
        player.shield.shieldEnabled = false;
        player.shield.shieldRecharging = false;
        shieldbar.setAttribute("style", "width: 10.25%");
        shieldNumber.innerHTML = player.shield.shieldValue;
    }

    if(player.weaponUpgrade.hasWeaponUpgrade && player.weaponUpgrade.onCooldown) {
        weaponUpgradeBar.style.width = "8.25%";
        player.weaponUpgrade.onCooldown = false;
    }

    inHole = false;
    onPlatform = false;
    screamPlayed = false;

    resetBossTowers = false;

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
            break;
        case 3:
            controls.getObject().position.set(460, 8, -935);
            camera.lookAt(460, 8, 1);
            respawnAliens();
            if(tripwireTwo.parent == null) { // Tripwire was activated
                tripwireTwoActivated = false;
                scene.add(tripwireTwo);
            }
            break;
        case 3.5:
            controls.getObject().position.set(280, 8, -410);
            camera.lookAt(281, 8, -410);
            currentLevel = 3;
            blockingTrees.position.set(415, -90, -400);
            movedBlockingTreesLevelThree = false;
            break;
        case 4:
            controls.getObject().position.set(480, 8, -335);
            camera.lookAt(480, 8, 1);
            if(boss.currentHealth > 0) {
                bossHealth.style.visibility = "visible";
                boss.model.position.set(480, 0, -90);
                boss.currentHealth = 1000;
                bossHealthBar.setAttribute("style", "width: 30%");
                audioCollection.bossFightMusic.play();
            }
            spawnedLevelFourAliens = false;
            break;
    }
}

function spawnLevelThreeAliens() {
    bulletCollidableMeshList.length = 0;

    for(let i = 0; i < alienArray.length; i++) {
        alienArray[i].model.remove(alienArray[i].hitbox.mesh);
    }

    for(let i = 0; i < alienArray.length; i++) {
        if(alienArray[i].currentHealth < 100) {
            alienArray[i].currentHealth = 100;
        }

        alienArray[i].model.add(alienArray[i].hitbox.mesh);
        bulletCollidableMeshList.push(alienArray[i].hitbox.mesh);

        switch(i) {
            case 0: 
                alienArray[i].model.position.set(230, 0, -620);
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 2;
                break;
            case 1: 
                alienArray[i].model.position.set(270, 0, -635);
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 2;
                break;
            case 2:
                alienArray[i].model.position.set(240, 0, -650); 
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 2;
                break;
            case 3: 
                alienArray[i].model.position.set(365, 0, -412);
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 4;
                break;
            case 4:
                alienArray[i].model.position.set(380, 0, -425); 
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 4;
                break;
            case 5:
                alienArray[i].model.position.set(370, 0, -400); 
                alienArray[i].canShoot.level = 3;
                alienArray[i].canShoot.box = 4;
                break;
        }
    }
}

function spawnLevelFourAliens() {
    if(!startWaves) return;

    if(waveDefeated) {
        waveDefeated = false;
        inWaveTimeout = true;
        setTimeout(() => { // Wait 8 seconds until the next wave is spawned
            spawnedLevelFourAliens = false;
            inWaveTimeout = false;
        }, 8000);
    }
    else {
        if(!spawnedLevelFourAliens) {
            bulletCollidableMeshList.length = 0;

            for(let i = 0; i < alienArray.length; i++) {
                alienArray[i].model.remove(alienArray[i].hitbox.mesh);
            }

            for(let i = 0; i < 4; i++) {
                if(alienArray[i].currentHealth < 100) {
                    alienArray[i].currentHealth = 100;
                }

                alienArray[i].model.add(alienArray[i].hitbox.mesh);
                bulletCollidableMeshList.push(alienArray[i].hitbox.mesh);

                switch(i) {
                    case 0: 
                        alienArray[i].model.position.set(380, 0, -150);
                        alienArray[i].canShoot.level = 4;
                        alienArray[i].canShoot.box = 1;
                        break;
                    case 1: 
                        alienArray[i].model.position.set(580, 0, -150);
                        alienArray[i].canShoot.level = 4;
                        alienArray[i].canShoot.box = 1;
                        break;
                    case 2:
                        alienArray[i].model.position.set(400, 0, -90); 
                        alienArray[i].canShoot.level = 4;
                        alienArray[i].canShoot.box = 1;
                        break;
                    case 3: 
                        alienArray[i].model.position.set(560, 0, -90);
                        alienArray[i].canShoot.level = 4;
                        alienArray[i].canShoot.box = 1;
                        break;
                }
            }
            bulletCollidableMeshList.push(boss.hitbox.mesh);
            spawnedLevelFourAliens = true;
        } 
        else {
            if(inWaveTimeout) return;
            if(bulletCollidableMeshList.length == 1) waveDefeated = true; // All 4 aliens have died (and only the boss is alive)
        }   
    }
}

/**
 * Called every game loop after the boss fight intro is finished and the boss is alive.
 * Moves the boss towards the player if the boss is out of range, else handles the boss's attack.
 */
function updateBossPosition() {
    boss.model.lookAt(player.playerModel.position.x, 0, player.playerModel.position.z);

    let direction = new THREE.Vector3();
    direction = player.playerModel.position.clone().sub(boss.model.position);
    direction.y = 0;

    if(boss.currentHealth > 0) {
        for(let i = 0; i < towerArray.length; i++) {
            if(boss.model.position.clone().distanceTo(towerArray[i].clone()) < 150 && boss.currentHealth < 1000) {
                if(orbArray[i].active) {
                    orbArray[i].mesh.material.color.setHex(0x1ac3fd);
                    boss.currentHealth = Math.round(boss.currentHealth + 1);
                    bossHealthBar.setAttribute("style", "width: " + boss.currentHealth / 33.33 + "%");

                    healingRayArray[i].geometry.vertices[1] = boss.model.position.clone();
                    healingRayArray[i].geometry.vertices[1].y = 24;
                    healingRayArray[i].geometry.verticesNeedUpdate = true;
                    healingRayArray[i].visible = true;

                    if(boss.currentHealth > 1000) {
                        boss.currentHealth = 1000;
                    }
                }
            }
            else {
                if(orbArray[i].active) {
                    healingRayArray[i].visible = false;
                    orbArray[i].mesh.material.color.setHex(0xffffff);
                }
            }
        }
    }

    if(!bossInRangeOfPlayer()) {
        if(!bossAttacked && !bossWalking && !bossRoaring) {
            updateBossAnimation(boss.walkAnim);
            bossWalking = true;
        }
        if(!audioCollection.bossRoar.isPlaying) { // Stop the boss from moving while he roars
            boss.model.position.add(direction.normalize().multiplyScalar(0.3)); // Move the boss towards the player 0.3
            boss.teleportCooldown -= 0.5;
        }

        if(Math.round(boss.teleportCooldown) <= 0) {

            if(!audioCollection.bossRoar.isPlaying) {
                bossRoaring = true;
                bossWalking = false;
                audioCollection.bossRoar.play();
                updateBossAnimation(boss.flexAnim);
            }
            else {
                audioCollection.bossRoar.source.onended = function() { // Teleport the boss after the roar has finished      
                    boss.teleportCooldown = 200;

                    let bossTeleport = Math.floor(Math.random() * 3);
                    if(bossTeleport != 2) { // Randomize whether the boss will teleport or not (teleport 2/3 times)
                        boss.model.position.set(player.playerModel.position.x, 0, player.playerModel.position.z - 15);
                        if(!audioCollection.bossTeleport.isPlaying) {
                            audioCollection.bossTeleport.play();
                        }
                    }

                    bossRoaring = false;
                    audioCollection.bossRoar.isPlaying = false;         
                };
            }
        }
    }
    else if(!bossAttacked) {
        bossWalking = false;
        updateBossAnimation(boss.attackAnim);
        bossAttacked = true;
        setTimeout(() => {
            bossAttacked = false;
        }, 1216.67);
        setTimeout(() => { // Give player time to dodge
            audioCollection.bossAttack.play();
            if(bossInRangeOfPlayer()) {

                if(player.shield.shieldEnabled) { // Shield is active
                    player.shield.shieldValue -= 50;

                    if(audioCollection.shieldHit.isPlaying) {
                        audioCollection.shieldHit.stop();
                    }
                    audioCollection.shieldHit.play();

                    if(player.shield.shieldValue <= 0) {
                        player.shield.shieldValue = 0;

                        if(audioCollection.shieldBreak.isPlaying) {
                            audioCollection.shieldBreak.stop();
                        }
                        audioCollection.shieldBreak.play();
                        
                        shieldDisplay.style.visibility = "hidden";
                        player.shield.shieldEnabled = false;

                        setTimeout(() => {
                            player.shield.shieldRecharging = true;
                        }, 4000)
                    }

                    shieldNumber.innerHTML = player.shield.shieldValue;
                    shieldbar.setAttribute("style", "width: " + player.shield.shieldValue / 10.25 + "%");
                }
                else {
                    player.currentHealth -= 50;
                }

                if(player.currentHealth <= 0) {
                    audioCollection.bossFightMusic.stop();
                    player.currentHealth = 0;
                    audioCollection.playerDeath.play();
                    playerDeath.classList.add("fadein");
                    playerDeath.style.visibility = "visible";
                    setTimeout(() => audioCollection.deathAudio.play(), 500);
                    controls.unlock();
                }
                updatePlayerHealth();
            }
        }, 200);
    }
}

/**
 * Called when the player first enters level 4 subsequently every game loop if the player has not defeated the boss.
 * Handles the boss fight intro and thereafter calls updateBossPosition.
 */
function bossFight() {
    if(inBossFightStartedTimeout) return;

    if(!playedRoarAudio) {
        scene.add(boss.model);
        audioCollection.bossRoar.play();
        playedRoarAudio = true;
    }

    if(!bossFightStarted) {
        inBossFightStartedTimeout = true;
        setTimeout(() => {
            inBossFightStartedTimeout = false;
            bossFightStarted = true;
            updateBossAnimation(boss.walkAnim);
            bossWalking = true;
            audioCollection.bossFightMusic.play();
        }, 5000)
        return;
    }
    else {
        if(boss.movement.distanceMoved <= 100 && intro) {
            boss.model.position.z -= 0.3;
            boss.movement.distanceMoved += 0.3;
        }
        else {
            bossHealth.style.visibility = "visible";
            intro = false;
            boss.movement.distanceMoved = 0;
            startWaves = true;
            updateBossPosition();
        }
    }

    if(bossWalking && !audioCollection.bossFootstep.isPlaying) {
        audioCollection.bossFootstep.play();
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
function alienInRangeOfPlayer(alien) {
    return alien.model.position.clone().distanceTo(player.playerModel.position.clone()) < alien.range;
}
/**
 * Called by UpdateBossPosition when checking if the boss should attack the player.
 * Returns true if the player is in range of the boss and false otherwise. 
 */
function bossInRangeOfPlayer() {
    return boss.model.position.clone().distanceTo(player.playerModel.position.clone()) < boss.range;
}

function openFullscreen() {
    if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } 
    else if(document.documentElement.mozRequestFullScreen) { /* Firefox */
        document.documentElement.mozRequestFullScreen();
    } 
    else if(document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        document.documentElement.webkitRequestFullscreen();
    } 
    else if(document.documentElement.msRequestFullscreen) { /* IE / Edge */
        document.documentElement.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } 
    else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } 
    else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } 
    else if(document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Called whenever the window is resized.
 * Handles updating the aspect ratio and projection matrix of all cameras in the scene and resizes the output canvas.
 */
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
    thirdPersonCamera.aspect = canvas.width / canvas.height;
    thirdPersonCamera.updateProjectionMatrix();
    puzzleTwoCamera.aspect = canvas.width / canvas.height;
    puzzleTwoCamera.updateProjectionMatrix();

    renderer.setSize(canvas.width, canvas.height);
}

function initRenderer() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer( {
        canvas: canvas,
        antialias: true,
        powerPreference: "high-performance",
        precision: "lowp"
    } );
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
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

    cameraType = "fp";

    thirdPersonCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
    thirdPersonCamera.position.set(camera.position.x, camera.position.y - 2, camera.position.z + 26);
    camera.add(thirdPersonCamera);

    birdsEyeViewCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);
    birdsEyeViewCamera.position.set(0, 100, 80);
    birdsEyeViewCamera.lookAt(0, 0, 0);
    scene.add(birdsEyeViewCamera);

    puzzleTwoCamera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 4000);

    minimapCamera = new THREE.OrthographicCamera(canvas.width / -2, canvas.width / 2, canvas.height / 2, canvas.height / -2, -100, 500); // Left, right, top, bottom, near, far 
    minimapCamera.up = new THREE.Vector3(0, 0, -1);
    minimapCamera.lookAt(new THREE.Vector3(0, -1, 0));
    minimapCamera.zoom = 10;
    minimapCamera.updateProjectionMatrix();
    scene.add(minimapCamera);
}

function initLights() {
    ambientLight = new THREE.AmbientLight("white", 0.15);
    scene.add(ambientLight);

    /** Light attached to player */
    pointLight = new THREE.PointLight("white", 2);
    pointLight.distance = 40;
    camera.add(pointLight);
    camera.children[1].position.y = 5; // Lower the point light from 8 to 5

    puzzleSpotLight = new THREE.SpotLight("green", 0, 0, Math.PI/5, 0, 2);
    scene.add(puzzleSpotLight);

    /** Lights on the aliens */
    alienLight = new THREE.PointLight("white", 1);
    alienLight.distance = 30;

    /** Lights on the speakers */
    speakerLight = new THREE.PointLight("white", 1);
    let speakerLight2 = speakerLight.clone();

    speakerLight.distance = 30;
    speakerLight.position.set(445, 5, -1060);

    speakerLight2.distance = 30;
    speakerLight2.position.set(475, 5, -1060);

    scene.add(speakerLight);
    scene.add(speakerLight2);
}

/**
 * Called by the onLoad property of the loading manager when it has finished loading all models in the scene.
 * Adds event listeners for pointer lock controls and keyboard controls and handles all locking / unlocking logic.
 */
function initControls() {
    /** Initialise the pointer lock controls and add the controls object to the scene */
    controls = new THREE.PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    document.addEventListener("click", initialPointerLock);

    function initialPointerLock() {
        controls.lock();
        wakeUp.classList.add("fadeout");
        setTimeout( () => wakeUp.style.visibility = "hidden", 1000); // Hide the initial screen after 1 second (the length of the fade-out animation)
        document.body.appendChild(stats.dom);
        document.removeEventListener("click", initialPointerLock);
        resume.addEventListener("click", () => {
            controls.lock();
            if(displayedControls) {
                keyControls.style.visibility = "hidden";
                displayedControls = false;
            }
        });
        restart.addEventListener("click", restartCheckpoint);
        controlsButtonPauseMenu.addEventListener("click", () => {
            displayedControls = !displayedControls;
            if(displayedControls) {
                keyControls.style.top = "75%";
                keyControls.style.transform = "translate(-50%, -75%)";
                keyControls.style.visibility = "visible";
            }
            else {
                keyControls.style.visibility = "hidden";
            }
        });
        /** Button to toggle shadows on and off */
        shadowsButton.addEventListener("click", () => {
            pointLight.castShadow = !pointLight.castShadow;
            ground.receiveShadow = !ground.receiveShadow;
            shadowObjects.forEach(object => object.castShadow = !object.castShadow);

            if(pointLight.castShadow) { // Shadows are on
                shadowsButton.innerHTML = "SHADOWS: ON";
            }
            else {
                shadowsButton.innerHTML = "SHADOWS: OFF";
            }
        });
        lockingClick = false;
    }

    controls.addEventListener("lock", lock);
    controls.addEventListener("unlock", unlock);

    document.addEventListener("keyup", onKeyUp);

    function lock() {
        player.velocityX = 0;
        player.velocityY = 0;
        player.velocityZ = 0;

        if(!firstUnlock) {
            document.addEventListener("keydown", onKeyDown);            
        }
        else {
            setTimeout(() => {
                gameLoop();
                document.addEventListener("keydown", onKeyDown);
            }, 1);
        }

        controls.isLocked = true;
        lockingClick = false;

        if(!audioCollection.wildlife.isPlaying) {
            audioCollection.wildlife.play();
        }
        health.style.visibility = "visible";
        crosshair.style.visibility = "visible";

        if(player.shield.hasShield) {
            shield.style.visibility = "visible";
        }
        if(player.shield.shieldEnabled) {
            shieldDisplay.style.visibility = "visible";
        }

        if(player.weaponUpgrade.hasWeaponUpgrade) {
            weaponUpgrade.style.visibility = "visible";
        }

        if(tooltipVisible) {
            tooltip.style.visibility = "visible";
        }

        pauseBlock.style.display = "none";
        deathBlock.style.display = "none";

        if(pausedRockSinkAudio) {
            pausedRockSinkAudio = false;
            audioCollection.rockSink.play();
        }

        if(pausedTransmissionAudio) {
            pausedTransmissionAudio = false;

            if(pausedTransmissionOne) {
                audioCollection.transmissionOne.play();
                pausedTransmissionOne = false;
            }
            else if(pausedTransmissionTwo) {
                audioCollection.transmissionTwo.play();
                pausedTransmissionTwo = false;
            }
        }

        if(currentLevel == 4 && !defeatedBoss) {
            audioCollection.bossFightMusic.play();
        }

        if(pausedRoarAudio) {
            pausedRoarAudio = false;
            audioCollection.bossRoar.play();
        }

        if(pausedHeartAudio) {
            pausedHeartAudio = false;
            audioCollection.heartAudio.play();
        }

        if(pausedTreeAudio) {
            pausedTreeAudio = false;
            audioCollection.treeFall.play();
        }

        if(pausedHoleAudio) {
            pausedHoleAudio = false;

            if(pausedHoleOne) {
                audioCollection.hole.play();
                pausedHoleOne = false;
            }
            else if(pausedHoleTwo) {
                audioCollection.hole2.play();
                pausedHoleTwo = false;
            }
        }
    }

    function unlock() {
        if(!firstUnlock) {
            firstUnlock = true;
        }

        /** Initiate keyup events for all movement keys to stop movement occurring while paused */
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 87})); // W
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 65})); // A
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 83})); // S
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 68})); // D
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 32})); // Space
        document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 16})); // Shift

        cancelAnimationFrame(requestId);
        document.removeEventListener("keydown", onKeyDown);

        controls.isLocked = false;
        lockingClick = true;
        audioCollection.wildlife.pause();
        health.style.visibility = "hidden";
        crosshair.style.visibility = "hidden";

        if(player.shield.hasShield) {
            shield.style.visibility = "hidden";
        }
        if(player.shield.shieldEnabled) {
            shieldDisplay.style.visibility = "hidden";
        }

        if(player.weaponUpgrade.hasWeaponUpgrade) {
            weaponUpgrade.style.visibility = "hidden";
        }

        if(tooltipVisible) {
            tooltip.style.visibility = "hidden";
        }

        pauseSongs();

        if(player.currentHealth > 0 && danceIncorrect < 2 && !defeatedBoss && !inHole) {
            pauseBlock.style.display = "block";
        }
        else if(danceIncorrect == 2) {
            puzzleBlock.style.display = "block";
        }
        else if(player.currentHealth <= 0) { // Player is dead
            setTimeout(() => deathBlock.style.display = "block", 3000);
        }
        else { // Player interacted with heart
            if(interactedWithHeart) {
                endGameDecision.style.display = "block";
            }
            else if(!inHole) {
                pauseBlock.style.display = "block";
            }
        }

        if(currentLevel == 4 && !defeatedBoss) {
            audioCollection.bossFightMusic.pause();
        }

        if(audioCollection.rockSink.isPlaying) {
            pausedRockSinkAudio = true;
            audioCollection.rockSink.pause();
        }

        if(audioCollection.transmissionOne.isPlaying || audioCollection.transmissionTwo.isPlaying) {
            pausedTransmissionAudio = true;

            if(audioCollection.transmissionOne.isPlaying) {
                audioCollection.transmissionOne.pause();
                pausedTransmissionOne = true;
            }
            else {
                audioCollection.transmissionTwo.pause();
                pausedTransmissionTwo = true;
            }
        }

        if(audioCollection.bossRoar.isPlaying) {
            pausedRoarAudio = true;
            audioCollection.bossRoar.pause();
        }

        if(audioCollection.heartAudio.isPlaying) {
            pausedHeartAudio = true;
            audioCollection.heartAudio.pause();
        }

        if(audioCollection.treeFall.isPlaying) {
            if(player.currentHealth <= 0) {
                audioCollection.treeFall.stop();
            }
            else {
                pausedTreeAudio = true;
                audioCollection.treeFall.pause();
            }
        }

        if(audioCollection.hole.isPlaying || audioCollection.hole2.isPlaying) {
            pausedHoleAudio = true;

            if(audioCollection.hole.isPlaying) {
                audioCollection.hole.pause();
                pausedHoleOne = true;
            }
            else {
                audioCollection.hole2.pause();
                pausedHoleTwo = true;
            }
        }
    }

    function onKeyDown(event) {

        event.preventDefault();

        switch(event.keyCode) {
            case 87:    // W (move forwards)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;
                
                player.movingForward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.animations.walkAnim);
                break;
            case 65:    // A (move left)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                player.movingLeft = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.animations.strafeLAnim);
                break;
            case 83:    // S (move backwards)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;
            
                player.movingBackward = true;
                if(!player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.animations.backwardsAnim);
                break;
            case 68:    // D (move right)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                player.movingRight = true;
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                }
                updatePlayerAnimation(player.animations.strafeRAnim);
                break;
            case 32:    // Space (jump)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                if(!player.jumping) {
                    player.jumping = true;
                    player.velocityY += 150;
                    handleJumpAnimation();
                }
                break;
            case 16:    // Shift (sprint)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                if(!player.running) {
                    player.running = true;
                    if(player.movingForward && !player.movingLeft && !player.movingRight) {
                        player.runFactor = 1.5;
                        updatePlayerAnimation(player.animations.runAnim);
                    }
                }
                break;
            case 82:  // R
                controls.getObject().position.set(0, 8, -720);
                currentLevel = 2;
                break;
            case 84:  // T
                controls.getObject().position.set(400, 8, -410);
                camera.lookAt(475, 8, -790);
                currentLevel = 3;
                break;
            case 89:    // Y
                currentLevel = 3;
                controls.getObject().position.set(460, 8, -930);
                camera.lookAt(460, 8, 1);
                break;
            case 112:   // F1 (first-person camera)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                cameraType = "fp";
                crosshair.style.top = "50.625%";
                crosshair.style.transform = "translate(-50%, -50.625%)";
                break;
            case 113:   // F2 (third-person camera)
                if(inPuzzleTwo && !finishedPuzzleTwo) return;

                cameraType = "tp";
                if(player.movingForward) {
                    if(player.running) {
                        updatePlayerAnimation(player.animations.runAnim);
                    }
                    else {
                        updatePlayerAnimation(player.animations.walkAnim);
                    }
                }
                if(player.movingBackward) {
                    updatePlayerAnimation(player.animations.walkAnim);
                }            
                break;
            case 69:    // E (interact)
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
                        case "noteOne":
                            audioCollection.paper.play();
                            showNote("noteOne");
                            break;
                        case "noteTwo":
                            audioCollection.paper.play();
                            showNote("noteTwo");
                            break; 
                        case "noteThree":
                            audioCollection.paper.play();
                            showNote("noteThree");
                            break;   
                        case "noteFour":
                            audioCollection.paper.play();
                            showNote("noteFour");
                            break;
                        case "donut":
                            eatDonut();
                            break;
                        case "healthpack":
                            healthPackPickup();
                            break;    
                        case "heart":
                            endGame();
                            break;   
                    }
                }
                break;
            case 70:    // F (shield)
                if(player.shield.hasShield && !player.shield.shieldEnabled && player.shield.shieldValue == 100) {
                    if(!activatedShield) { // Hide the shield tooltip after the player uses the shield for the first time
                        activatedShield = true;
                        hideTooltip();
                    }

                    player.shield.shieldEnabled = true;
                    audioCollection.shieldActive.play();
                    shieldDisplay.style.visibility = "visible";

                    setTimeout(() => { // Timer is started for the shield to break after 5 seconds

                        if(player.shield.shieldEnabled) { // If the shield hasn't already been broken by a bullet
                            player.shield.shieldValue = 0;

                            if(controls.isLocked && !inPuzzleTwo) { // Only play shield break audio if player is not in the second puzzle and the game is not paused
                                if(audioCollection.shieldBreak.isPlaying) {
                                    audioCollection.shieldBreak.stop();
                                }
                                audioCollection.shieldBreak.play();
                            }
                            shieldDisplay.style.visibility = "hidden";
                            player.shield.shieldEnabled = false;

                            shieldNumber.innerHTML = player.shield.shieldValue;
                            shieldbar.setAttribute("style", "width: " + player.shield.shieldValue / 10.25 + "%");

                            setTimeout(() => {
                                player.shield.shieldRecharging = true;
                            }, 4000)
                        }
                    }, 5000);
                }
                else { // Cannot use shield
                    if(audioCollection.wrongMove.isPlaying) {
                        audioCollection.wrongMove.stop();
                    }
                    audioCollection.wrongMove.play();
                }
                break;
            case 49:    // 1
                if(!inPuzzleTwo || finishedPuzzleTwo || dancePlaying) return;
                updatePlayerAnimation(player.animations.chickenDance);
                checkDance();
                break;
            case 50:    // 2
                if(!inPuzzleTwo || finishedPuzzleTwo || dancePlaying) return;
                updatePlayerAnimation(player.animations.breakdance);
                checkDance();
                break;
            case 51:    // 3
                if(!inPuzzleTwo || finishedPuzzleTwo || dancePlaying) return;
                updatePlayerAnimation(player.animations.macarenaDance);
                checkDance();
                break;
            case 52:    // 4
                if(!inPuzzleTwo || finishedPuzzleTwo || dancePlaying) return;
                updatePlayerAnimation(player.animations.ymcaDance);
                checkDance();
                break;
            case 53:    // 5
                if(!inPuzzleTwo || finishedPuzzleTwo || dancePlaying) return;
                updatePlayerAnimation(player.animations.gangnamStyle);
                checkDance();
                break;
            case 77:    // M (minimap)
                minimapToggle = true;
                break;
        }
    }

    function onKeyUp(event) {
        switch(event.keyCode) {
            case 87:    // W
                player.movingForward = false;
                if(!player.movingBackward && !player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.animations.idleAnim);
                break;
            case 65:    // A
                player.movingLeft  = false;
                if(!player.movingRight && !player.movingForward && !player.movingBackward)
                    updatePlayerAnimation(player.animations.idleAnim);
                else if(player.movingForward)
                    updatePlayerAnimation(player.animations.walkAnim);
                else if(player.movingBackward)
                    updatePlayerAnimation(player.animations.walkBackwardsAnim);
                break;
            case 83:    // S
                player.movingBackward = false;
                if(!player.movingForward && !player.movingLeft && !player.movingRight)
                    updatePlayerAnimation(player.animations.idleAnim);
                break;
            case 68:    // D
                player.movingRight = false;
                if(!player.movingLeft && !player.movingForward && !player.movingBackward)
                    updatePlayerAnimation(player.animations.idleAnim);
                else if(player.movingForward)
                    updatePlayerAnimation(player.animations.walkAnim);
                else if(player.movingBackward)
                    updatePlayerAnimation(player.animations.walkBackwardsAnim);
                break;
            case 16:    // Shift
                if(player.running) {
                    player.running = false;
                    player.runFactor = 1;
                    if(player.movingForward && !player.movingLeft && !player.movingRight)
                        updatePlayerAnimation(player.animations.walkAnim);
                }
                break;
            case 77:    // M
                minimapToggle = false;
                break;
        }
    }
}

/**
 * Called by init.
 * Initialises a new clock object to keep track of game loop time.
 */
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
            side: THREE.BackSide,
            map: texture
        } ));
    }
    skybox = new THREE.Mesh(new THREE.BoxBufferGeometry(3000, 1000, 4000), material);
    skybox.position.y += 200;
    scene.add(skybox);
}

/**
 * Called by init.
 * Initialises a new loading manager that tracks and facilitates the progress of all loaders.
 * The loading manager also performs the necessary actions in its onLoad property when all assets are finished loading.
 */
function initLoadingManager() {
    loadingManager = new THREE.LoadingManager(onLoad, onProgress);

    loadingInfo.style.visibility = "visible";

    function onLoad() {
        closeFullscreen();
        loadingInfo.style.display = "none";
        loadingSymbol.style.display = "none";
        wakeUp.style.visibility = "visible";
        renderer.compile(scene, camera);
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
    gltfLoader2 = new GLTFLoader(); // Used for changing between models when the player gets a gun
    audioLoader = new THREE.AudioLoader(loadingManager);
    cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
}

/** 
 * Called by init.
 * Initialises a new player object and hitbox and loads the appropriate model.
 */
function initPlayer() {
    player = new Player();
    player.hitbox = new Hitbox("player");
    
    loadModel("models/characters/player/playermodel.glb", "player");
}

/** 
 * Called by init.
 * Initialises 6 new alien objects and loads the appropriate model.
 */
function initAliens() {
    alien1 = new Alien();
    alien2 = new Alien();
    alien3 = new Alien();
    alien4 = new Alien();
    alien5 = new Alien();
    alien6 = new Alien();

    loadModel("models/characters/enemy/alien.min.mintexture.glb", "alien");
}

/** 
 * Called by init.
 * Initialises a new boss object and hitbox and loads the appropriate model.
 */
function initBoss() {
    boss = new Boss();
    boss.hitbox = new Hitbox("boss");

    loadModel("models/characters/enemy/boss.glb", "boss");
}

function initShip() {
    loadModel("models/ship/ship.glb", "ship");
}

function initShipModel(gltf) {
    ship = gltf.scene;
    ship.scale.set(7, 7, 7);
    ship.position.set(485, 2, 100);
    ship.rotation.set(0, Math.PI/4, 0);
    ship.children[0].children[2].material = new THREE.MeshBasicMaterial( {envMap: loadReflectiveTexture(skyboxURLs)} ); // Set the texture of the ship's visor to a map of the environment
    scene.add(ship);
}

function initHeart() {
    loadModel("models/heart/heart.glb", "heart");
}

function initHeartModel(gltf) {
    heart = gltf.scene;
    heart.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    heart.scale.set(3, 3, 3);
    heart.position.set(485, Math.random() * 1 + 6, 50); // Random height between 6 and 7
    heart.add(audioCollection.heartAudio);
    scene.add(heart);
}

/** Loads reflective texture for use in environment mapping  */
function loadReflectiveTexture(url) {
    function callback(material) {
        if(material) {
            material.envMap = texture;
            material.needsUpdate = true;
        }
    }
    let texture = cubeTextureLoader.load(url, callback);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max reduction in texture blur at glancing angles
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;
    return texture;
}

/** 
 * Called by init.
 * Initialises 4 new bounty hunter objects and loads the appropriate model.
 */
function initBountyHunter() {
    bountyHunter1 = new BountyHunter();
    bountyHunter2 = new BountyHunter();
    bountyHunter3 = new BountyHunter();
    bountyHunter4 = new BountyHunter();
    loadModel("models/characters/bountyhunter/bounty_hunter.glb", "bounty_hunter");
}

function initWeapon() {
    loadModel("models/gun/pistol.glb", "weapon");
}

function initWeaponModel(gltf) {
    player.weapon.model = gltf.scene;

    player.weapon.model.scale.set(0.75, 0.75, -0.75);
    player.weapon.model.rotation.y = Math.random() * 2*Math.PI;
    player.weapon.model.position.set(0, Math.random() + 1, -745); // Random height between 1 and 2 (used when gun is on the ground)
    player.weapon.model.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";

    scene.add(player.weapon.model);    

    player.weapon.bulletStart = new THREE.Object3D();
    player.weapon.bulletStart.position.set(0, -0.5, -1);
    camera.add(player.weapon.bulletStart);

    player.weapon.bullets = [];

    document.addEventListener("mousedown", function(event) {
        switch(event.button) {
            case 0: // Left click
                /** Normal bullet */
                createPlayerBullet("normal");
                break;
            case 2: // Right click
                /** Enhanced poison bullet */
                if(player.weaponUpgrade.hasWeaponUpgrade && !player.weaponUpgrade.onCooldown) {
                    if(player.weapon.cooldown != 0) {
                        return;
                    }

                    if(!shotPoisonBullet) {
                        shotPoisonBullet = true;
                        hideTooltip();
                    }
                    createPlayerBullet("poison");

                    weaponUpgradeBar.style.width = "0%";
                    player.weaponUpgrade.onCooldown = true;

                    poisonTimerId = setTimeout(() => { // Allow player to use poisoned bullet every 15 seconds
                        if(controls.isLocked && player.weaponUpgrade.onCooldown) { // Only play audio if the game is not paused and the upgrade is on cooldown
                            audioCollection.weaponUpgradeReady.play();
                        }
                        weaponUpgradeBar.style.width = "8.25%";
                        player.weaponUpgrade.onCooldown = false;
                    }, 15000);
                }
                else if(player.weaponUpgrade.hasWeaponUpgrade) { // If the player has the weapon upgrade but it's on cooldown
                    if(audioCollection.wrongMove.isPlaying) {
                        audioCollection.wrongMove.stop();
                    }
                    audioCollection.wrongMove.play();
                }
                else { // If the player doesn't have the weapon upgrade at all
                    return;
                }
                break;
        }
    });
}

function initShield() {
    loadModel("models/shield/shield.glb", "shield");
}

function initShieldModel(gltf) {
    player.shield.model = gltf.scene;

    player.shield.model.scale.set(3, 3, 3);
    player.shield.model.rotation.y = Math.random() * 2*Math.PI;
    player.shield.model.position.set(50, Math.random() + 2, -1140); // Random height between 2 and 3
    player.shield.model.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";

    scene.add(player.shield.model);
}

function initWeaponUpgrade() {
    loadModel("models/gun/weapon_upgrade.glb", "weapon_upgrade");
}

function initWeaponUpgradeModel(gltf) {
    player.weaponUpgrade.model = gltf.scene;
    player.weaponUpgrade.model.scale.set(5, 5, 5);
    player.weaponUpgrade.model.position.set(575, Math.random() + 2, -790); // Random height between 2 and 3
    player.weaponUpgrade.model.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";

    scene.add(player.weaponUpgrade.model);
}

function initHealthPacks(gltf) {
    let healthPackOne = gltf.scene.children[0];
    healthPackOne.scale.set(0.75, 0.75, 0.75);
    let healthPackTwo = healthPackOne.clone();
    let healthPackThree = healthPackOne.clone();
    let healthPackFour = healthPackOne.clone();
    let healthPackFive = healthPackOne.clone();
    let healthPackSix = healthPackOne.clone();
    let healthPackSeven = healthPackOne.clone();
    let healthPackEight = healthPackOne.clone();

    let superHealthPack = healthPackOne.clone();
    superHealthPack.geometry = healthPackOne.geometry.clone();
    superHealthPack.material = healthPackOne.material.clone();

    healthPackOne.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackOne.position.set(-245, Math.random() * 1.5 + 6.25, -1050); // Random height between 6.25 and 7.75
    healthPackOne.rotation.y = Math.random() * 2*Math.PI;

    healthPackTwo.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackTwo.position.set(-240, Math.random() * 1.5 + 6.25, -1050);
    healthPackTwo.rotation.y = Math.random() * 2*Math.PI;

    healthPackThree.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackThree.position.set(-235, Math.random() * 1.5 + 6.25, -1050);
    healthPackThree.rotation.y = Math.random() * 2*Math.PI;

    healthPackFour.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackFour.position.set(240, Math.random() * 1.5 + 6.25, -525);
    healthPackFour.rotation.y = Math.random() * 2*Math.PI;
    
    healthPackFive.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackFive.position.set(360, Math.random() * 1.5 + 6.25, -265);
    healthPackFive.rotation.y = Math.random() * 2*Math.PI;

    healthPackSix.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackSix.position.set(360, Math.random() * 1.5 + 6.25, -115);
    healthPackSix.rotation.y = Math.random() * 2*Math.PI;

    healthPackSeven.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackSeven.position.set(600, Math.random() * 1.5 + 6.25, -265);
    healthPackSeven.rotation.y = Math.random() * 2*Math.PI;

    healthPackEight.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    healthPackEight.position.set(600, Math.random() * 1.5 + 6.25, -115);
    healthPackEight.rotation.y = Math.random() * 2*Math.PI;

    superHealthPack.direction = Math.floor(Math.random() * 2) == 0 ? "down" : "up";
    superHealthPack.scale.set(1, 1, 1);
    superHealthPack.position.set(480, Math.random() * 1.5 + 6.5, -70); // Random height between 6.5 and 8
    superHealthPack.rotation.y = Math.random() * 2*Math.PI;
    superHealthPack.material.color.setHex(0x21ad0a);

    healthPackCollidableMeshList.push(healthPackOne);
    healthPackCollidableMeshList.push(healthPackTwo);
    healthPackCollidableMeshList.push(healthPackThree);
    healthPackCollidableMeshList.push(healthPackFour);
    healthPackCollidableMeshList.push(healthPackFive);
    healthPackCollidableMeshList.push(healthPackSix);
    healthPackCollidableMeshList.push(healthPackSeven);
    healthPackCollidableMeshList.push(healthPackEight);
    healthPackCollidableMeshList.push(superHealthPack);

    for(let i = 0; i < healthPackCollidableMeshList.length; i++) {
        healthPackCollidableMeshList[i].traverse(child => {
            if(child.isMesh) {
                shadowObjects.push(child);
            }
        });
    }
    
    scene.add(healthPackOne);
    scene.add(healthPackTwo);
    scene.add(healthPackThree);
    scene.add(healthPackFour);
    scene.add(healthPackFive);
    scene.add(healthPackSix);
    scene.add(healthPackSeven);
    scene.add(healthPackEight);
    scene.add(superHealthPack);
}

function createPlayerBullet(type) {
    if(lockingClick || player.weapon.cooldown != 0 || !player.hasGun || (inPuzzleTwo && !finishedPuzzleTwo)) return;

    player.weapon.recoil.reachedBottom = false;
    player.weapon.recoil.reachedTop = false;

    if(cameraType == "fp"){
        player.weapon.bulletStart.position.set(0, -0.5, -1);  
    }
    else {
        player.weapon.bulletStart.position.set(0, 4.5, -2.5);  
    }

    let cylinderGeometry = new THREE.CylinderBufferGeometry(0.05, 0.05, 5);
    cylinderGeometry.rotateX(-Math.PI/2);
    let bulletColour;
    if(type == "normal") { // Normal bullet
        bulletColour = "#03c3fb";
    }
    else { // Enhanced DoT bullet
        bulletColour = "#04870d";
    }
    let singleBullet = new THREE.Mesh(cylinderGeometry, new THREE.MeshBasicMaterial( {color: bulletColour} ));
    player.weapon.bulletStart.getWorldPosition(singleBullet.position);
    singleBullet.rotation.copy(camera.rotation);

    let lastPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);
    let originalPosition = new THREE.Vector3(singleBullet.position.x, singleBullet.position.y, singleBullet.position.z);

    let direction = new THREE.Vector3();
    controls.getDirection(direction);

    let origin = new THREE.Vector3();
    singleBullet.getWorldPosition(origin);

    let raycaster = new THREE.Raycaster(origin, direction.normalize());

    player.weapon.bullets.push({bullet: singleBullet, raycaster: raycaster, lastPosition: lastPosition, originalPosition: originalPosition, box: currentBox, type: type});
    scene.add(singleBullet);
    if(type == "normal") {
        audioCollection.weapon.play();
    }
    else {
        audioCollection.weaponUpgradeShot.play();
    }
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
    loadAudio("audio/weapon/poison_bullet_ready.wav", "poison_bullet_ready");
    loadAudio("audio/weapon/poison_bullet_shot.wav", "poison_bullet_shot");
    loadAudio("audio/items/paper.wav", "paper");
    loadAudio("audio/character/jump_boost.wav", "jump_boost");
    loadAudio("audio/environment/level_one/totem_select.wav", "totem_select");
    loadAudio("audio/character/wrong_move.wav", "wrong_move");
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
    loadAudio("audio/songs/lose.wav", "lose_puzzle");
    loadAudio("audio/songs/correct.mp3", "correct");
    loadAudio("audio/songs/success.wav", "win_puzzle");
    loadAudio("audio/songs/record_scratch.wav", "record_scratch");
    loadAudio("audio/character/health_refill.wav", "health_refill");
    loadAudio("audio/weapon/gun_cock.wav", "gun_cock");
    loadAudio("audio/boss/boss_roar.wav", "boss_roar");
    loadAudio("audio/boss/boss_fight_music.wav", "boss_fight_music");
    loadAudio("audio/boss/boss_attack.mp3", "boss_attack");
    loadAudio("audio/boss/boss_footstep.wav", "boss_footstep");
    loadAudio("audio/boss/boss_teleport.mp3", "boss_teleport");
    loadAudio("audio/boss/boss_death.wav", "boss_death");
    loadAudio("audio/environment/tree_fall.wav", "tree_fall");
    loadAudio("audio/environment/black_hole.wav", "hole");
    loadAudio("audio/environment/black_hole.wav", "hole2");
    loadAudio("audio/character/scream.ogg", "scream");
    loadAudio("audio/character/burp.wav", "burp");

    /** HEART */
    loadAudio("audio/environment/heart/heart.wav", "heart");

    /** FOOTSTEPS */
    loadAudio("audio/character/footsteps_leaves.wav", "footsteps_leaves");
    loadAudio("audio/character/footsteps_wood.wav", "footsteps_wood");

    /** SHIELD */
    loadAudio("audio/character/shield_active.ogg", "shield_active");
    loadAudio("audio/character/shield_hit.wav", "shield_hit");
    loadAudio("audio/character/shield_break.wav", "shield_break");
    loadAudio("audio/character/shield_ready.wav", "shield_ready");

    /** TRANSMISSIONS */
    loadAudio("audio/transmissions/alien_transmission_one.mp3", "alien_transmission_one");
    loadAudio("audio/transmissions/alien_transmission_two.wav", "alien_transmission_two");

    /** TRIPWIRE */
    loadAudio("audio/environment/tripwire/tripwire_activated.wav", "tripwire_activated");
    loadAudio("audio/environment/tripwire/tripwire_buzz.wav", "tripwire_buzz");

    /** ORB */
    loadAudio("audio/boss/orb_explosion.wav", "orb_explosion");
}

function initWorld() {
    drawTrees();
    drawBushes();
    drawGround();
    drawRocks();
    drawStars();
    drawTotems();
    drawTowers();
    drawPaper();
    drawNotePoles();
    drawHealthPacks();
    drawHoles();
    drawCrateAndBook();
    drawCrateAndDonuts();
    drawBarrelsAndScroll();
    drawCratesAndScroll();
    drawSpeakers();
    drawTripwires();

    // boundingBoxVis();
}

function render() {
    stats.update();
    // rendererStats.update(renderer);

    renderer.setViewport(0, 0, canvas.width, canvas.height);
    renderer.setScissor(0, 0, canvas.width, canvas.height);
    renderer.setScissorTest(true);

    // renderer.render(scene, camera);

    // let cameraToRender = cameraType == "fp" ? camera : thirdPersonCamera;
    switch(cameraType) {
        case "fp": renderer.render(scene, camera); break;
        case "tp": renderer.render(scene, thirdPersonCamera); break;
        case "bev": renderer.render(scene, birdsEyeViewCamera); break;
        case "puzzleTwo": renderer.render(scene, puzzleTwoCamera); break;
    }
    // renderer.render(scene, cameraToRender);

    if(minimapToggle) {
        renderer.setViewport(canvas.width - canvas.width * 0.2 - 10, 10, canvas.width * 0.2, canvas.height * 0.3);
        renderer.setScissor(canvas.width - canvas.width * 0.2 - 10, 10, canvas.width * 0.2, canvas.height * 0.3);
        renderer.setScissorTest(true);
        renderer.render(scene, minimapCamera);
    }
}

function init() {
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
    initShip();
    initHeart();
    initBountyHunter();
    initWeapon();
    initShield();
    initWeaponUpgrade();
    initAudio();
    initBoss();
    initWorld();
}

/**
 * Called by menu on window load.
 * Sends an XML HttpRequest to allow the menu audio to play without user interaction.
 */
function initMenuAudio() {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let xmlhr = new XMLHttpRequest();
    xmlhr.open("GET", "audio/menu/Lyssna.mp3");
    xmlhr.responseType = "arraybuffer";
    xmlhr.addEventListener("load", () => {
        let playsound = (audioBuffer) => {
            menuAudioSource = audioContext.createBufferSource();
            if(menuAudioSource) {
                menuAudioSource.buffer = audioBuffer;
                menuAudioSource.connect(audioContext.destination);
                menuAudioSource.loop = true;
                menuAudioSource.start();
            }
        };
        audioContext.decodeAudioData(xmlhr.response).then(playsound);
    });
    xmlhr.send();
}

/**
 * Called by menu on window load.
 * Handles playing and looping the menu cinematic.
 */
function playMenuCinematic() {
    menuCinematic.play();
    menuCinematic.loop = true;
    menuCinematic.controls = false;
    menuCinematic.muted = true;
    menuCinematic.style.visibility = "visible";
    menuCinematic.style.display = "block";
}

function menu() {      
    initMenuAudio();
    playMenuCinematic();

    /** Texture quality controls */
    textures.addEventListener("click", () => {
        if(textureQuality == "high") {
            textureQuality = "medium";
            textures.innerHTML = "TEXTURES: MEDIUM";
        }
        else if(textureQuality == "medium") {
            textureQuality = "low";
            textures.innerHTML = "TEXTURES: LOW";
        }
        else {
            textureQuality = "high";
            textures.innerHTML = "TEXTURES: HIGH";
        }
    });

    /** Keyboard controls */
    controlsButtonMainMenu.addEventListener("click", () => {
        displayedControls = !displayedControls;
        if(displayedControls) {
            keyControls.style.visibility = "visible";
        }
        else {
            keyControls.style.visibility = "hidden";
        }
    });

    /** Skip button functionality */
    skipButton.addEventListener("click", (event) => {
        skipButton.style.visibility = "hidden";

        switch(event.currentTarget.param) {
            case "play":
                introCutScene.remove();
                loadingSymbol.style.display = "block";
        
                setTimeout(() => {
                    init();
                }, 1000);
                break;
            case "takeHeart":
                takeHeartCutScene.remove();
                creditsCutScene.play();
                creditsCutScene.style.visibility = "visible";
                creditsCutScene.style.display = "block";
                skipButton.style.visibility = "visible";
                skipButton.param = "credits";
                break;
            case "leaveHeart":
                leaveHeartCutScene.remove();
                creditsCutScene.play();
                creditsCutScene.style.visibility = "visible";
                creditsCutScene.style.display = "block";
                skipButton.style.visibility = "visible";
                skipButton.param = "credits";
                break;
            case "credits":
                creditsCutScene.remove();
                location.reload();
                break;
        }        
    });
 
    playButton.addEventListener("click", () => {
        menuAudioSource.stop();
        title.style.display = "none";
        menuBlock.style.display = "none";
        if(displayedControls) {
            keyControls.style.visibility = "hidden";
            displayedControls = false;
        }

        skipButton.style.visibility = "visible";
        skipButton.param = "play";

        menuCinematic.remove();

        openFullscreen();
        
        introCutScene.play();
        introCutScene.style.visibility = "visible";
        introCutScene.style.display = "block";
    });

    introCutScene.onended = function() {
        skipButton.style.visibility = "hidden";
        introCutScene.remove();
        loadingSymbol.style.display = "block";
        
        setTimeout(() => {
            init();
        }, 1000);
    }
}