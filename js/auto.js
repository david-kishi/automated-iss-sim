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
 * Corrects the given axis for Dragon through a series of checks.
 * 
 * @param {float} lowerBound - lower bound of where dragon should aim to be within
 * @param {float} upperBound - upper bound of where dragon should aim to be within
 * @param {float} error - current error of axis
 * @param {integer} rate - # of burns in positive or negative direction
 * @param {string} axis - string identifying which axis is being checked
 * @param {function} negativeBurn - function to move axis in negative direction
 * @param {function} positiveBurn - function to move axis in positive direction
 */
function correctDragonPYR(lowerBound, upperBound, error, rate, axis, negativeBurn, positiveBurn) {
  // Check if axis is within bounds
  if (error >= lowerBound && error <= upperBound && rate == 0) {
    console.log(`${axis} is zeroed.`);
    return true;
  }

  // If error is greater than upperbound, and dragon is not translating in the
  // correct direction.
  if (error > upperBound && rate != 1) {
    positiveBurn();
    console.log(`Burn to correct positive ${axis}.`);
  }
  // If error is lesser than lowerbound, and dragon is not translating in the
  // correct direction.
  else if (error < lowerBound && rate != -1) {
    negativeBurn();
    console.log(`Burn to correct negative ${axis}.`);
  }
  // If error is within bounds but is still translating, counter burn to stop
  // correction.
  else if (error <= upperBound && error >= lowerBound) {
    switch (rate) {
      case -1:
        positiveBurn();
        console.log(`Counter burning a negative ${axis}`);
        break;
      case 1:
        negativeBurn();
        console.log(`Counter burning a positive ${axis}`);
        break;
    }
  }
}

/**
 * Corrects Y axis with automated burns
 * 
 * @param {dragTel} dragon 
 */
function correctY(dragon) {
  // Check if Y is zeroed
  if (dragon.yDistance >= -0.010 && dragon.yDistance <= 0.010 && dragon.yRate == 0) {
    console.log("y corrected");
    return true;
  }

  // If y is greater than 0.010 and is not translating left, then translate
  // left.
  if (dragon.yDistance > 0.010 && dragon.yRate != -1) {
    translateLeft();
    dragon.yRate--;
    console.log("translating left ", dragon.yRate);
  }
  // If y is less than -0.010 and is not translating right, then translate
  // right
  else if (dragon.yDistance < -0.010 && dragon.yRate != 1) {
    translateRight();
    dragon.yRate++;
    console.log("translating right ", dragon.yRate);
  }
  // Counter burn if y is within -0.010 and 0.010.
  else if (dragon.yDistance >= -0.010 && dragon.yDistance <= 0.010) {
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

/**
 * Corrects Z axis with automated burns
 * 
 * @param {dragTel} dragon 
 */
function correctZ(dragon) {
  // Check if z is already zeroed
  if (dragon.zDistance >= -0.010 && dragon.zDistance <= 0.010 && dragon.zRate == 0) {
    console.log("z corrected");
    return true;
  }

  // If z is greater than 0.010 and dragon is not translating down, then
  // translate down.
  if (dragon.zDistance > 0.010 && dragon.zRate != -1) {
    translateDown();
    dragon.zRate--;
    console.log("translating down ", dragon.zRate);
  }
  // if z is less than -0.010 and dragon is not translating up, then translate
  // up.
  else if (dragon.zDistance < -0.010 && dragon.zRate != 1) {
    translateUp();
    dragon.zRate++;
    console.log("translating up ", dragon.zRate);
  }
  // Counter burn if z is within -0.010 and 0.010.
  else if (dragon.zDistance >= -0.010 && dragon.zDistance <= 0.010) {
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

/**
 * Initiates correction sequences for x, y, and z axis.
 * 
 * Every 10 ms, checks y, then z, exclusively. When y is corrected, translate
 * forward to increase speed towards ISS. When z is corrected, translate forward
 * again towards ISS, to gain an average speed of ~0.200 m/s.
 * 
 * @param {dragTel} dragon 
 */
function correctXYZ(dragon) {
  console.log("Beginning XYZ corrections.");
  translateForward(); // note this changes the elliptical trajectory
  let correctXYZ = setInterval(function () {
    dragon.update();
    if (!correctY(dragon)) {} else if (!correctZ(dragon)) {
      if (dragTel.xRate < 1) {
        dragTel.xRate++;
        translateForward();
        console.log("translating forward. ", dragTel.xRate)
      }
    } else if (dragTel.xRate < 2) {
      dragTel.xRate++;
      translateForward();
      console.log("translating forward. ", dragTel.xRate)
    }
  }, 10)
}

// helper dev function to calculate gravity pull rate
function gravityCheck() {
  dragTel.update();
  let gravityc = dragTel.zDistance;
  setInterval(function () {
    dragTel.update();
    console.log(gravityc - dragTel.zDistance);
    gravityc = dragTel.zDistance;
  }, 1000)
}

/**
 * Initiates correction sequences, starting with pitch, yaw, and roll.
 * 
 * Every 10ms, checks yaw, then roll, then pitch, exclusively. When all have
 * been corrected, stop PYR correction and call XYZ correction function
 * (correctXYZ).
 * 
 * @param {dragTel} dragon
 */
function correct(dragon) {
  console.log("Beginning automating sequence.");
  let correctPYR = setInterval(function () {
    dragon.update();

    if (!correctDragonPYR(-0.100, 0.100, dragon.yawError, dragon.yawRate, "Yaw", yawLeft, yawRight)) {} else if (!correctDragonPYR(-0.100, 0.100, dragon.rollError, dragon.rollRate, "Roll", rollLeft, rollRight)) {} else if (!correctDragonPYR(-0.100, 0.100, dragon.pitchError, dragon.pitchRate, "Pitch", pitchUp, pitchDown)) {} else {
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