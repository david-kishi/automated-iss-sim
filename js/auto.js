/**
 * auto.js
 * --
 * This javascript file serves the purpose of automating the docking sequences
 * of SpaceX Dragon 2 capsule to the ISS.
 * 
 * ----------------------------------------------------------------------------
 * Dragon Functions (from threed.min.js)
 * ----------------------------------------------------------------------------
 * rollLeft(), rollRight()
 * pitchDown(), pitchUp()
 * yawLeft(), yawRight()
 * translateForward(), translateBackward()
 * translateDown(), translateUp(), translateRight(), translateLeft()
 * toggleTranslation(), toggleRotation()
 * 
 * ----------------------------------------------------------------------------
 * Dragon Telemetry (from threed.min.js)
 * ----------------------------------------------------------------------------
 * pitchError: fixedRotationX
 * yawError: fixedRotationY
 * rollError: fixedRotationZ
 * 
 * pitchRate: t.toFixed(1)
 * yawRate: e.toFixed(1)
 * rollRate: o.toFixed(1)
 * 
 * x-distance: a.toFixed(1)
 * y-distance: r.toFixed(1)
 * z-distance: i.toFixed(1)
 * 
 * range: n.toFixed(1)
 * range-rate: smoothRangeRate.toFixed(3)
 */

// Dragon Telemetry Class
class DragonTelemetry {

  // Initialize telemetry (this may initialize to 0 if called within the first ~5 seconds)
  constructor() {
    this.xDistance = 999.99;
    this.yDistance = 999.99;
    this.zDistance = 999.99;
    this.pitchError = 999.99;
    this.yawError = 999.99;
    this.rollError = 999.99;
    this.pitchRate = 999.99;
    this.yawRate = 999.99;
    this.rollRate = 999.99;
    this.range = 999.99;
    this.rangeRate = 999.99;
  }

  // Updates telemetry
  update() {
    this.xDistance = (camera.position.z - issObject.position.z);
    this.yDistance = (camera.position.x - issObject.position.x);
    this.zDistance = (camera.position.y - issObject.position.y);
    this.pitchError = parseFloat(fixedRotationX);
    this.yawError = parseFloat(fixedRotationY);
    this.rollError = parseFloat(fixedRotationZ);
    this.pitchRate = .1 * rateRotationX;
    this.yawRate = .1 * rateRotationY;
    this.rollRate = .1 * rateRotationZ;
    this.range = Math.sqrt(this.xDistance * this.xDistance +
      this.yDistance * this.yDistance +
      this.zDistance * this.zDistance);
    this.rangeRate = smoothRangeRate;
  }

  // Console logs all telemetry
  status() {
    console.log("=============== TELEMETRY ===============");
    console.log("Range: ", this.range);
    console.log("Rate: ", this.rangeRate);
    console.log("x: ", this.xDistance);
    console.log("y: ", this.yDistance);
    console.log("z: ", this.zDistance);
    console.log("Pitch Error: ", this.pitchError);
    console.log("Pitch Rate: ", this.pitchRate);
    console.log("Yaw Error: ", this.yawError);
    console.log("Yaw Rate: ", this.yawRate);
    console.log("Roll Error: ", this.rollError);
    console.log("Roll Rate: ", this.rollRate);
  }
}

// Create Dragon Telemetry object
var dragTel = new DragonTelemetry();

/**
 * Corrects Pitch with automated burns
 * @param {float} pitchError - Angle of error
 * @param {float} pitchRate - Current rate of translation of pitch
 */
function correctPitch(pitchError, pitchRate) {
  // Check if pitch is already zero'd
  if (pitchError == 0 && pitchRate == 0) {
    console.log("Pitch is zeroed.")
    return true;
  }

  /* If pitchError angle is POSITIVE and there currently is no correction burn
   * for a POSITIVE angle, initiate a single correction burn for POSITIVE
   * angle, pitchDown().
   */
  if (pitchError > 0.1 && pitchRate * 10 != 1) {
    pitchDown();
    console.log("Burn to correct positive pitch angle. (pitchDown)");
  }
  /* If pitchError angle is NEGATIVE and there currently is no correction burn
   * for a NEGATIVE angle, initiate a single correction burn for NEGATIVE
   * angle, pitchUp().
   */
  else if (pitchError < -0.1 && pitchRate * 10 != -1) {
    pitchUp();
    console.log("Burn to correct negative pitch angle. (pitchUp)");
  }
  /* Counter burn the moment right before the angle is about to zero out.
   * In this case, counter burn when angle is +-0.1 deg.
   */
  else if (pitchError == 0.1 || pitchError == -0.1) {
    switch (pitchRate * 10) {
      case -1:
        pitchDown();
        console.log("Counter burning a negative pitchRate (pitchDown)");
        break;
      case 1:
        pitchUp();
        console.log("Counter burning a positive pitchRate (pitchUp)");
        break;
      default:
        break;
    }
  }
}

/**
 * Corrects Yaw with automated burns
 * @param {float} yawError - Angle of error
 * @param {float} yawRate - Current rate of translation of yaw
 */
function correctYaw(yawError, yawRate) {
  // Check if yaw is already zero'd
  if (yawError == 0 && yawRate == 0) {
    console.log("Yaw is zeroed.")
    return true;
  }

  /* If yawError angle is POSITIVE and there currently is no correction burn
   * for a POSITIVE angle, initiate a single correction burn for POSITIVE
   * angle, yawRight().
   */
  if (yawError > 0.1 && yawRate * 10 != 1) {
    yawRight();
    console.log("Burn to correct positive yaw angle. (yawRight)");
  }
  /* If yawError angle is NEGATIVE and there currently is no correction burn
   * for a NEGATIVE angle, initiate a single correction burn for NEGATIVE
   * angle, yawLeft().
   */
  else if (yawError < -0.1 && yawRate * 10 != -1) {
    yawLeft();
    console.log("Burn to correct negative yaw angle. (yawLeft)");
  }
  /* Counter burn the moment right before the angle is about to zero out.
   * In this case, counter burn when angle is +-0.1 deg.
   */
  else if (yawError == 0.1 || yawError == -0.1) {
    switch (yawRate * 10) {
      case -1:
        yawRight();
        console.log("Counter burning a negative yawRate (yawRight)");
        break;
      case 1:
        yawLeft();
        console.log("Counter burning a positive yawRate (yawLeft)");
        break;
      default:
        break;
    }
  }

  return false;
}

/**
 * Corrects Roll with automated burns
 * @param {float} rollError - Angle of error
 * @param {float} rollRate - Current rate of translation of roll
 */
function correctRoll(rollError, rollRate) {
  // Check if roll is already zeroed
  if (rollError == 0 && rollRate == 0) {
    console.log("Roll is zeroed.")
    return true;
  }

  /* If rollError angle is POSITIVE and there currently is no correction burn
   * for a POSITIVE angle, initiate a single correction burn for POSITIVE
   * angle, rollRight().
   */
  if (rollError > 0.1 && rollRate * 10 != 1) {
    rollRight();
    console.log("Burn to correct positive roll angle. (rollRight)");
  }
  /* If rollError angle is NEGATIVE and there currently is no correction burn
   * for a NEGATIVE angle, initiate a single correction burn for NEGATIVE
   * angle, rollLeft().
   */
  else if (rollError < -0.1 && rollRate * 10 != -1) {
    rollLeft();
    console.log("Burn to correct negative roll angle. (rollLeft)");
  }
  /* Counter burn the moment right before the angle is about to zero out.
   * In this case, counter burn when angle is +-0.1 deg.
   */
  else if (rollError == 0.1 || rollError == -0.1) {
    switch (rollRate * 10) {
      case -1:
        rollRight();
        console.log("Counter burning a negative rollRate (rollRight)");
        break;
      case 1:
        rollLeft();
        console.log("Counter burning a positive rollRate (rollLeft)");
        break;
      default:
        break;
    }
  }

  return false;
}

// Initiate dragon corrections after 10 seconds (waiting for load)
function correct(dragon) {
  console.log("Beginning automating sequence.");
  setInterval(function () { // Loop functions every 100 ms
    dragon.update();
    //dragon.status();
    if (!correctYaw(dragon.yawError, dragon.yawRate)) {} else if (!correctRoll(dragon.rollError, dragon.rollRate)) {} else if (!correctPitch(dragon.pitchError, dragon.pitchRate)) {}
  }, 100)
}

// Initiate auto sequence
document.getElementById("auto-button").addEventListener("click", function () {
  hideIntro();

  // Countdown
  let seconds = 10;
  var countdown = setInterval(function () {
    console.log(seconds);
    seconds--;
    if (seconds == 0) {
      clearInterval(countdown);
      correct(dragTel);
    }
  }, 1000)
});