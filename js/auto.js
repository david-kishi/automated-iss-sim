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

// Initiate auto sequence
document.getElementById("auto-button").addEventListener("click", function () {
  hideIntro();
});

// Dragon Telemetry Class
class DragonTelemetry {

  // Initialize telemetry (this may initialize to 0 if called within the first ~5 seconds)
  constructor() {
    this.xDistance = camera.position.z - issObject.position.z;
    this.yDistance = camera.position.x - issObject.position.x;
    this.zDistance = camera.position.y - issObject.position.y;
    this.pitchError = fixedRotationX;
    this.yawError = fixedRotationY;
    this.rollError = fixedRotationZ;
    this.pitchRate = .1 * rateRotationX;
    this.yawRate = .1 * rateRotationY;
    this.rollRate = .1 * rateRotationZ;
    this.range = Math.sqrt(this.xDistance * this.xDistance +
      this.yDistance * this.yDistance +
      this.zDistance * this.zDistance);
    this.rangeRate = smoothRangeRate.toFixed(3);
  }

  // Updates telemetry
  update() {
    this.xDistance = (camera.position.z - issObject.position.z).toFixed(1);
    this.yDistance = (camera.position.x - issObject.position.x).toFixed(1);
    this.zDistance = (camera.position.y - issObject.position.y).toFixed(1);
    this.pitchError = fixedRotationX;
    this.yawError = fixedRotationY;
    this.rollError = fixedRotationZ;
    this.pitchRate = .1 * rateRotationX;
    this.yawRate = .1 * rateRotationY;
    this.rollRate = .1 * rateRotationZ;
    this.range = Math.sqrt(this.xDistance * this.xDistance +
      this.yDistance * this.yDistance +
      this.zDistance * this.zDistance);
    this.rangeRate = smoothRangeRate.toFixed(3);
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

let dragTel = new DragonTelemetry();

setInterval(function () {
  dragTel.update();
  dragTel.status();
}, 100)