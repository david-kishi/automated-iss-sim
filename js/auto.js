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
 * Corrects Yaw with automated burns
 * @param {float} yawError - Angle of error
 * @param {float} yawRate - Current rate of translation of yaw
 */
function correctYaw(yawError, yawRate) {
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
}

// Initiate dragon corrections after 10 seconds (waiting for load)
function correct(dragon) {
  setTimeout(function () {
    setInterval(function () { // Loop functions every 100 ms
      dragon.update();
      //dragon.status();
      correctYaw(dragon.yawError, dragon.yawRate);
    }, 100)
  }, 10000)
}

// Initiate auto sequence
document.getElementById("auto-button").addEventListener("click", function () {
  hideIntro();
  correct(dragTel);
});