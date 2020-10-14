/**
 * auto.js
 * --
 * This javascript file serves the purpose of automating the docking sequences
 * of SpaceX Dragon 2 capsule to the ISS.
 * 
 * Dragon Functions
 * --
 * rollLeft(), rollRight()
 * pitchDown(), pitchUp()
 * yawLeft(), yawRight()
 * translateForward(), translateBackward()
 * translateDown(), translateUp(), translateRight(), translateLeft()
 * toggleTranslation(), toggleRotation()
 * 
 */

document.getElementById("auto-button").addEventListener("click", function () {
  hideIntro();
  setTimeout(correctionInterval, 10000);
});

// Initiate Dragon's Object
// TODO Convert to class
var dragon = {
  x: 0.0,
  y: 0.0,
  z: 0.0,
  xRate: 0,
  yRate: 0,
  zRate: 0,
  rate: 0.0,
  rollError: 0.0,
  rollRate: 0.0,
  pitchError: 0.0,
  pitchRate: 0.0,
  yawError: 0.0,
  yawRate: 0.0,
};

function telemetryUpdate() {
  dragon.x = parseFloat(document.getElementById("x-range").innerText);
  dragon.y = parseFloat(document.getElementById("y-range").innerText);
  dragon.z = parseFloat(document.getElementById("z-range").innerText);
  dragon.rate = Math.abs(parseFloat(document.getElementById("rate").children[1].innerText));
  dragon.rollError = parseFloat(document.getElementById("roll").children[0].innerText);
  dragon.rollRate = parseFloat(document.getElementById("roll").children[1].innerText);
  dragon.pitchError = parseFloat(document.getElementById("pitch").children[0].innerText);
  dragon.pitchRate = parseFloat(document.getElementById("pitch").children[1].innerText);
  dragon.yawError = parseFloat(document.getElementById("yaw").children[0].innerText);
  dragon.yawRate = parseFloat(document.getElementById("yaw").children[1].innerText);
}

/***
 * Correct roll under these conditions.
 * 
 * rollRight:
 *  - rollError (0,inf) & rollRate > 0
 *  - rollError [0,2] & rollRate < 0
 *  - 
 * rollLeft:
 *  - rollError (-inf, 0) & rollRate < 0
 *  - rollError [0,2] & rollRate > 0
 */
function correctRoll() {
  // TODO correct dragon's roll

};

function correctPitch() {
  // TODO correct dragon's pitch
};

function correctYaw() {
  // TODO correct dragon's yaw
}

/***
 * Correcting Axis
 * 
 * x burn scale
 * [200 - - - - - - 100 - - - 50 - 25 - 0]
 * [2               m2        1    m1  m1]
 * 
 * y burn scale
 * [-15 - - -10 - - -5 - - 0 - - 5 - - 10 - - 15]
 * [+2       m2     +1          -1     m-2    -2]
 * 
 * z burn scale
 * [-15 - - -10 - - -5 - - 0 - - 5 - - 10 - - 15]
 * [+2       m2     +1          -1     m-2    -2]
 */
function correctAxis() {

};

function corrections() {
  telemetryUpdate();
  correctAxis();
};

function correctionInterval() {
  setInterval(corrections, 500);
};