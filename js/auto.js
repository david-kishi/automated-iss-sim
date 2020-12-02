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
 */

// Create Dragon Telemetry object
var dragTel = new DragonTelemetry();

/**
 * Corrects Pitch with automated burns
 * @param {float} pitchError - Angle of error
 * @param {float} pitchRate - Current rate of translation of pitch
 */
function correctPitch(pitchError, pitchRate) {
  // Check if pitch is already zero'd
  if (pitchError > -0.100 && pitchError < 0.100 && pitchRate == 0) {
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
  else if (pitchError <= 0.100 && pitchError >= -0.100) {
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
  if (yawError > -0.100 && yawError < 0.100 && yawRate == 0) {
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
  else if (yawError <= 0.100 && yawError >= -0.100) {
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
  if (rollError > -0.100 && rollError < 0.100 && rollRate == 0) {
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
  else if (rollError <= 0.100 && rollError >= -0.100) {
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

function correctY(dragon) {
  if (dragon.yDistance >= -0.010 && dragon.yDistance <= 0.010 && dragon.yRate == 0) {
    console.log("y corrected");
    return true;
  }

  if (dragon.yDistance > 0.010 && dragon.yRate != -1) {
    translateLeft();
    dragon.yRate--;
    console.log("translating left ", dragon.yRate);
  } else if (dragon.yDistance < -0.010 && dragon.yRate != 1) {
    translateRight();
    dragon.yRate++;
    console.log("translating right ", dragon.yRate);
  } else if (dragon.yDistance >= -0.010 && dragon.yDistance <= 0.010) {
    switch (dragon.yRate) {
      case -1:
        translateRight();
        dragon.yRate++;
        console.log("counter right ", dragon.yRate);
        break;
      case 1:
        translateLeft();
        dragon.yRate--;
        console.log("counter left ", dragon.yRate);
        break;
      default:
        break;
    }
  }
}

function correctZ(dragon) {
  if (dragon.zDistance >= -0.010 && dragon.zDistance <= 0.010 && dragon.zRate == 0) {
    console.log("z corrected");
    return true;
  }

  if (dragon.zDistance > 0.010 && dragon.zRate != -1) {
    translateDown();
    dragon.zRate--;
    console.log("translating down ", dragon.zRate);
  } else if (dragon.zDistance < -0.010 && dragon.zRate != 1) {
    translateUp();
    dragon.zRate++;
    console.log("translating up ", dragon.zRate);
  } else if (dragon.zDistance >= -0.010 && dragon.zDistance <= 0.010) {
    switch (dragon.zRate) {
      case -1:
        translateUp();
        dragon.zRate++;
        console.log("counter up ", dragon.zRate);
        break;
      case 1:
        translateDown();
        dragon.zRate--;
        console.log("counter down ", dragon.zRate);
        break;
      default:
        break;
    }
  }
}


function correctXYZ(dragon) {
  console.log("Beginning XYZ corrections.");
  translateForward(); // note this changes the elliptical trajectory
  let correctXYZ = setInterval(function () {
    dragon.update();
    if (!correctY(dragon)) {} else if (!correctZ(dragon)) {}
  }, 10)
}

// helper dev function to get gravity pull rate
function gravityCheck() {
  dragTel.update();
  let gravityc = dragTel.zDistance;
  setInterval(function () {
    dragTel.update();
    console.log(gravityc - dragTel.zDistance);
    gravityc = dragTel.zDistance;
  }, 1000)
}

// Initiate dragon corrections after 10 seconds (waiting for load)
function correct(dragon) {
  console.log("Beginning automating sequence.");
  let correctPYR = setInterval(function () { // Loop functions every 10 ms
    dragon.update();
    //dragon.status();
    if (!correctYaw(dragon.yawError, dragon.yawRate)) {} else if (!correctRoll(dragon.rollError, dragon.rollRate)) {} else if (!correctPitch(dragon.pitchError, dragon.pitchRate)) {} else {
      console.log("Pitch, Yaw, and Roll corrected.");
      clearInterval(correctPYR);
      correctXYZ(dragon);
    }
  }, 10)
}

// Initiate auto sequence
document.getElementById("auto-button").addEventListener("click", function () {
  hideIntro();

  // Countdown
  let seconds = 10;
  let countdown = setInterval(function () {
    console.log(seconds);
    seconds--;
    if (seconds == 0) {
      clearInterval(countdown);
      correct(dragTel); // Start PYR correction
    }
  }, 1000)
});