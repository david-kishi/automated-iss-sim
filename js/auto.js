/**
 * auto.js
 * --
 * This javascript file serves the purpose of automating the docking sequences.
 * 
 * Dragon Functions
 * --
 * rollLeft(), rollRight()
 * pitchDown(), pitchUp()
 * yawLeft(), yawRight()
 * translateForward(), translateBackward()
 * translateDown(), translateUp(), translateRight(), translateLeft()
 * toggleTranslation(), toggleRotation()
 */

console.log("AUTO DOCKING SCRIPT (ADS) LOADED & INITIATED.\nWAITING FOR SIM START");



document.getElementById("auto-button").addEventListener("click", function () {
  console.log("auto button pressed.")
});

// Initiate Dragon's Object
// TODO Convert to class
var dragon = {
  x: 999.9,
  y: 999.9,
  z: 999.9,
  rate: 0.0,
  roll: {
    error: 0.0,
    rate: 0.0
  },
  pitch: {
    error: 0.0,
    rate: 0.0
  },
  yaw: {
    error: 0.0,
    rate: 0.0
  }
}

function dragonUpdate(dragon) {
  // TODO DOM actions to update dragon object
}

function correctRoll(dragon) {
  // TODO correct dragon's roll
}

function correctPitch(dragon) {
  // TODO correct dragon's pitch
}

function correctYaw(dragon) {
  // TODO correct dragon's yaw
}

function correctAxis(dragon) {
  // TODO correct dragon's planes
  // x = longitudinal axis (distance from ISS port)
  // y = lateral axis (horizontal)
  // z = vertical axis
}