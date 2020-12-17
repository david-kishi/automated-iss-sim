/**
 * dragontelemetry.js
 * --
 * This javascript file serves the purpose of declaring the Dragon Telemetry
 * class. This class will hold all current telemetry and update functions.
 */

// Dragon Telemetry Class
class DragonTelemetry {

  // Initialize telemetry (this may initialize to 0 if called within the first ~5 seconds)
  constructor() {
    this.xDistance = 999.999;
    this.yDistance = 999.999;
    this.zDistance = 999.999;
    this.pitchError = 999.999;
    this.yawError = 999.999;
    this.rollError = 999.999;
    this.pitchRate = 999.999;
    this.yawRate = 999.999;
    this.rollRate = 999.999;
    this.range = 999.999;
    this.rangeRate = 999.999;
    this.xRate = 0;
    this.yRate = 0;
    this.zRate = 0;
  }

  // Updates telemetry
  update() {
    this.xDistance = (camera.position.z - issObject.position.z);
    this.yDistance = (camera.position.x - issObject.position.x);
    this.zDistance = (camera.position.y - issObject.position.y);
    this.pitchError = parseFloat(fixedRotationX);
    this.yawError = parseFloat(fixedRotationY);
    this.rollError = parseFloat(fixedRotationZ);
    this.pitchRate = rateRotationX;
    this.yawRate = rateRotationY;
    this.rollRate = rateRotationZ;
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
};