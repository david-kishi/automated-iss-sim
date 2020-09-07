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
});

// Initiate Dragon's Object
// TODO Convert to class
var dragon = {
  x: 999.9,
  y: 999.9,
  z: 999.9,
  rate: 0.0,
  rollError: 0.0,
  rollRate: 0.0,
  pitchError: 0.0,
  pitchRate: 0.0,
  yawError: 0.0,
  yawRate: 0.0
};

function telemetryUpdate() {
  // TODO DOM actions to update dragon object
  dragon.x = parseFloat(document.getElementById("x-range").innerText);
  dragon.y = parseFloat(document.getElementById("y-range").innerText);
  dragon.z = parseFloat(document.getElementById("z-range").innerText);
  dragon.rate = parseFloat(document.getElementById("rate").children[1].innerText);
  dragon.rollError = parseFloat(document.getElementById("roll").children[0].innerText);
  dragon.rollRate = parseFloat(document.getElementById("roll").children[1].innerText)
  dragon.pitchError = parseFloat(document.getElementById("pitch").children[0].innerText)
  dragon.pitchRate = parseFloat(document.getElementById("pitch").children[1].innerText)
  dragon.yawError = parseFloat(document.getElementById("yaw").children[0].innerText)
  dragon.yawRate = parseFloat(document.getElementById("yaw").children[1].innerText)
}

function correctRoll(dragon) {
  // TODO correct dragon's roll
};

function correctPitch(dragon) {
  // TODO correct dragon's pitch
};

function correctYaw(dragon) {
  // TOD;O correct dragon's yaw
}

function correctAxis(dragon) {
  // TODO correct dragon's planes
  // x = longitudinal axis (distance from ISS port)
  // y = lateral axis (horizontal)
  // z = vertical axis
};