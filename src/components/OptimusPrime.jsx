import React, { useRef, useState, useEffect } from "react";
import { Box, Cylinder, Sphere, Cone } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameState, AnimState } from "../utils/gameState";

// Easing function (ease-out cubic)
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const OptimusPrime = ({
  animationMode = AnimState.ASSEMBLING_LOOP,
  onAnimationComplete,
}) => {
  const transformerRef = useRef();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animState, setAnimState] = useState(animationMode);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isTransformed, setIsTransformed] = useState(false);
  const restartLoopTimeoutRef = useRef(null);

  const { robotColor, truckColor, animationSpeed, autoTransform } =
    useGameState();

  // Reset state when animationMode prop changes
  useEffect(() => {
    setAnimState(animationMode);
    setAnimationProgress(0);
    setRotationAngle(0);
    if (
      animationMode === AnimState.IDLE ||
      animationMode === AnimState.PAUSED
    ) {
      setAnimationProgress(1);
    }
  }, [animationMode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (restartLoopTimeoutRef.current) {
        clearTimeout(restartLoopTimeoutRef.current);
      }
    };
  }, []);

  // Define the starting positions for each piece (scattered)
  const startingPositions = {
    // Head parts
    head: new Vector3(0, 25, 0),
    helmet: new Vector3(0, 30, 0),
    faceplate: new Vector3(0, 20, 5),
    leftEye: new Vector3(-15, 0.1, 10),
    rightEye: new Vector3(15, 0.1, 10),
    leftAntenna: new Vector3(-10, 35, 0),
    rightAntenna: new Vector3(10, 35, 0),
    crest: new Vector3(0, 35, 0),
    leftCheekGuard: new Vector3(-12, 25, 5),
    rightCheekGuard: new Vector3(12, 25, 5),
    chinStrap: new Vector3(0, 20, 5),
    headVentLeft: new Vector3(-8, 28, 0),
    headVentRight: new Vector3(8, 28, 0),

    // Torso parts
    chest: new Vector3(0, 20, 0),
    chestMatrix: new Vector3(0, 25, 2),
    abdomen: new Vector3(0, 15, 0),
    waist: new Vector3(0, 10, 0),
    pelvicPlate: new Vector3(0, 5, 0),
    backPanel: new Vector3(0, 20, -5),
    leftSideVent: new Vector3(-15, 18, 0),
    rightSideVent: new Vector3(15, 18, 0),
    spineConnector: new Vector3(0, 15, -3),

    // Arms
    leftShoulder: new Vector3(-30, 1, 0),
    rightShoulder: new Vector3(30, 1, 0),
    leftShoulderPad: new Vector3(-35, 1, 0),
    rightShoulderPad: new Vector3(35, 1, 0),
    leftUpperArm: new Vector3(-25, 1, 0),
    rightUpperArm: new Vector3(25, 1, 0),
    leftElbow: new Vector3(-22.5, 1, 0),
    rightElbow: new Vector3(22.5, 1, 0),
    leftForearm: new Vector3(-20, 1, 0),
    rightForearm: new Vector3(20, 1, 0),
    leftWrist: new Vector3(-17.5, 1, 0),
    rightWrist: new Vector3(17.5, 1, 0),
    leftHand: new Vector3(-15, 1, 0),
    rightHand: new Vector3(15, 1, 0),
    leftArmPiston: new Vector3(-27, 1, -2),
    rightArmPiston: new Vector3(27, 1, -2),
    leftForearmPlate: new Vector3(-20, 1, 2),
    rightForearmPlate: new Vector3(20, 1, 2),
    leftThumb: new Vector3(-16, 1, 0),
    rightThumb: new Vector3(16, 1, 0),

    // Legs
    leftThigh: new Vector3(-20, -10, 0),
    rightThigh: new Vector3(20, -10, 0),
    leftKnee: new Vector3(-22.5, -10, 0),
    rightKnee: new Vector3(22.5, -10, 0),
    leftShin: new Vector3(-25, -15, 0),
    rightShin: new Vector3(25, -15, 0),
    leftAnkle: new Vector3(-27.5, -15, 0),
    rightAnkle: new Vector3(27.5, -15, 0),
    leftFoot: new Vector3(-30, -20, 0),
    rightFoot: new Vector3(30, -20, 0),
    leftThighPlate: new Vector3(-20, -8, 2),
    rightThighPlate: new Vector3(20, -8, 2),
    leftCalfPiston: new Vector3(-25, -12, -2),
    rightCalfPiston: new Vector3(25, -12, -2),
    leftKneePad: new Vector3(-22.5, -10, 2),
    rightKneePad: new Vector3(22.5, -10, 2),

    // Vehicle parts (for tank mode)
    frontArmor: new Vector3(0, 0, 25),
    glacisPlate: new Vector3(0, -5, 20),
    commanderHatch: new Vector3(0, 15, 15),
    hull: new Vector3(0, 10, 10),
    rearArmor: new Vector3(0, 5, -20),
    leftRoadWheel1: new Vector3(-20, -5, 15),
    rightRoadWheel1: new Vector3(20, -5, 15),
    leftRoadWheel2: new Vector3(-20, -5, -15),
    rightRoadWheel2: new Vector3(20, -5, -15),
    leftRoadWheel3: new Vector3(-20, -5, 0),
    rightRoadWheel3: new Vector3(20, -5, 0),
    leftExhaust: new Vector3(-15, 20, 5),
    rightExhaust: new Vector3(15, 20, 5),
    turret: new Vector3(0, 0, -25),
    cannonBarrel: new Vector3(0, 0, 30),
    machineGun: new Vector3(0, 20, 10),
    leftTread: new Vector3(-25, -5, 0),
    rightTread: new Vector3(25, -5, 0),
    turretAntenna: new Vector3(0, 5, -20),
    sideSkirtLeft: new Vector3(-25, 0, 0),
    sideSkirtRight: new Vector3(25, 0, 0),
    reactiveArmorLeft: new Vector3(-22, 5, 10),
    reactiveArmorRight: new Vector3(22, 5, 10),
  };

  // Define the target positions for robot mode (more detailed, alien-like complexity)
  const robotPositions = {
    // Head parts
    head: new Vector3(0, 2.3, 0),
    helmet: new Vector3(0, 2.6, 0),
    faceplate: new Vector3(0, 2.3, 0.4),
    leftEye: new Vector3(-0.15, 2.35, 0.45),
    rightEye: new Vector3(0.15, 2.35, 0.45),
    leftAntenna: new Vector3(-0.2, 2.8, 0),
    rightAntenna: new Vector3(0.2, 2.8, 0),
    crest: new Vector3(0, 2.7, 0.2),
    leftCheekGuard: new Vector3(-0.3, 2.3, 0.3),
    rightCheekGuard: new Vector3(0.3, 2.3, 0.3),
    chinStrap: new Vector3(0, 2.1, 0.3),
    headVentLeft: new Vector3(-0.25, 2.5, -0.1),
    headVentRight: new Vector3(0.25, 2.5, -0.1),

    // Torso parts
    chest: new Vector3(0, 1.5, 0),
    chestMatrix: new Vector3(0, 1.7, 0.3),
    abdomen: new Vector3(0, 1.0, 0),
    waist: new Vector3(0, 0.5, 0),
    pelvicPlate: new Vector3(0, 0.3, 0.1),
    backPanel: new Vector3(0, 1.5, -0.4),
    leftSideVent: new Vector3(-0.7, 1.5, 0),
    rightSideVent: new Vector3(0.7, 1.5, 0),
    spineConnector: new Vector3(0, 1.0, -0.3),

    // Arms
    leftShoulder: new Vector3(-1.8, 1.8, 0),
    rightShoulder: new Vector3(1.8, 1.8, 0),
    leftShoulderPad: new Vector3(-2.4, 1.8, 0),
    rightShoulderPad: new Vector3(2.4, 1.8, 0),
    leftUpperArm: new Vector3(-2.2, 1.2, 0),
    rightUpperArm: new Vector3(2.2, 1.2, 0),
    leftElbow: new Vector3(-2.2, 0.9, 0),
    rightElbow: new Vector3(2.2, 0.9, 0),
    leftForearm: new Vector3(-2.2, 0.6, 0),
    rightForearm: new Vector3(2.2, 0.6, 0),
    leftWrist: new Vector3(-2.2, 0.35, 0),
    rightWrist: new Vector3(2.2, 0.35, 0),
    leftHand: new Vector3(-2.2, 0.1, 0),
    rightHand: new Vector3(2.2, 0.1, 0),
    leftArmPiston: new Vector3(-2.0, 1.0, -0.2),
    rightArmPiston: new Vector3(2.0, 1.0, -0.2),
    leftForearmPlate: new Vector3(-2.2, 0.6, 0.2),
    rightForearmPlate: new Vector3(2.2, 0.6, 0.2),
    leftThumb: new Vector3(-2.3, 0.1, 0.1),
    rightThumb: new Vector3(2.3, 0.1, 0.1),

    // Legs
    leftThigh: new Vector3(-0.6, -0.3, 0),
    rightThigh: new Vector3(0.6, -0.3, 0),
    leftKnee: new Vector3(-0.6, -0.75, 0),
    rightKnee: new Vector3(0.6, -0.75, 0),
    leftShin: new Vector3(-0.6, -1.2, 0),
    rightShin: new Vector3(0.6, -1.2, 0),
    leftAnkle: new Vector3(-0.6, -1.6, 0),
    rightAnkle: new Vector3(0.6, -1.6, 0),
    leftFoot: new Vector3(-0.6, -2.0, 0.2),
    rightFoot: new Vector3(0.6, -2.0, 0.2),
    leftThighPlate: new Vector3(-0.6, -0.3, 0.3),
    rightThighPlate: new Vector3(0.6, -0.3, 0.3),
    leftCalfPiston: new Vector3(-0.6, -1.0, -0.2),
    rightCalfPiston: new Vector3(0.6, -1.0, -0.2),
    leftKneePad: new Vector3(-0.6, -0.75, 0.2),
    rightKneePad: new Vector3(0.6, -0.75, 0.2),

    // Vehicle parts (integrated in robot mode)
    frontArmor: new Vector3(0, 1.5, 0.2),
    glacisPlate: new Vector3(0, 1.3, 0.25),
    commanderHatch: new Vector3(0, 2.0, -0.2),
    hull: new Vector3(0, 1.8, -0.1),
    rearArmor: new Vector3(0, 0.5, -0.8),
    leftRoadWheel1: new Vector3(-0.8, 0.3, -0.5),
    rightRoadWheel1: new Vector3(0.8, 0.3, -0.5),
    leftRoadWheel2: new Vector3(-0.8, -1.0, -0.5),
    rightRoadWheel2: new Vector3(0.8, -1.0, -0.5),
    leftRoadWheel3: new Vector3(-0.8, -1.5, -0.5),
    rightRoadWheel3: new Vector3(0.8, -1.5, -0.5),
    leftExhaust: new Vector3(-0.3, 2.8, -0.3),
    rightExhaust: new Vector3(0.3, 2.8, -0.3),
    turret: new Vector3(0, 1.5, -0.5),
    cannonBarrel: new Vector3(2.5, 1.0, 0),
    machineGun: new Vector3(0, 2.5, 0),
    leftTread: new Vector3(-1.0, -1.0, 0),
    rightTread: new Vector3(1.0, -1.0, 0),
    turretAntenna: new Vector3(0, 2.8, -0.4),
    sideSkirtLeft: new Vector3(-1.2, -0.5, 0),
    sideSkirtRight: new Vector3(1.2, -0.5, 0),
    reactiveArmorLeft: new Vector3(-1.0, 1.0, 0.2),
    reactiveArmorRight: new Vector3(1.0, 1.0, 0.2),
  };

  // Define tank mode positions (more complex arrangement)
  const tankPositions = {
    // Head parts (integrated into hull)
    head: new Vector3(0, 0.8, 1.8),
    helmet: new Vector3(0, 0.9, 1.7),
    faceplate: new Vector3(0, 0.8, 2.0),
    leftEye: new Vector3(-0.1, 0.8, 2.1),
    rightEye: new Vector3(0.1, 0.8, 2.1),
    leftAntenna: new Vector3(-0.2, 1.0, 1.5),
    rightAntenna: new Vector3(0.2, 1.0, 1.5),
    crest: new Vector3(0, 1.0, 1.8),
    leftCheekGuard: new Vector3(-0.15, 0.8, 1.9),
    rightCheekGuard: new Vector3(0.15, 0.8, 1.9),
    chinStrap: new Vector3(0, 0.7, 1.9),
    headVentLeft: new Vector3(-0.12, 0.9, 1.6),
    headVentRight: new Vector3(0.12, 0.9, 1.6),

    // Torso parts (become tank body)
    chest: new Vector3(0, 0, 1),
    chestMatrix: new Vector3(0, 0.1, 1.3),
    abdomen: new Vector3(0, 0, 0.5),
    waist: new Vector3(0, 0, 0),
    pelvicPlate: new Vector3(0, 0, -0.5),
    backPanel: new Vector3(0, 0, -1),
    leftSideVent: new Vector3(-0.8, 0.2, 0.5),
    rightSideVent: new Vector3(0.8, 0.2, 0.5),
    spineConnector: new Vector3(0, 0, -0.8),

    // Arms (fold into sides)
    leftShoulder: new Vector3(-1.2, 0.2, 1),
    rightShoulder: new Vector3(1.2, 0.2, 1),
    leftShoulderPad: new Vector3(-1.7, 0.2, 1),
    rightShoulderPad: new Vector3(1.7, 0.2, 1),
    leftUpperArm: new Vector3(-1.5, 0, 0.5),
    rightUpperArm: new Vector3(1.5, 0, 0.5),
    leftElbow: new Vector3(-1.5, 0, 0.25),
    rightElbow: new Vector3(1.5, 0, 0.25),
    leftForearm: new Vector3(-1.5, 0, 0),
    rightForearm: new Vector3(1.5, 0, 0),
    leftWrist: new Vector3(-1.5, 0, -0.25),
    rightWrist: new Vector3(1.5, 0, -0.25),
    leftHand: new Vector3(-1.5, 0, -0.5),
    rightHand: new Vector3(1.5, 0, -0.5),
    leftArmPiston: new Vector3(-1.4, 0.1, 0.3),
    rightArmPiston: new Vector3(1.4, 0.1, 0.3),
    leftForearmPlate: new Vector3(-1.5, 0.1, 0),
    rightForearmPlate: new Vector3(1.5, 0.1, 0),
    leftThumb: new Vector3(-1.6, 0, -0.5),
    rightThumb: new Vector3(1.6, 0, -0.5),

    // Legs (become rear)
    leftThigh: new Vector3(-0.8, 0, -1),
    rightThigh: new Vector3(0.8, 0, -1),
    leftKnee: new Vector3(-0.8, 0, -1.4),
    rightKnee: new Vector3(0.8, 0, -1.4),
    leftShin: new Vector3(-0.8, 0, -1.8),
    rightShin: new Vector3(0.8, 0, -1.8),
    leftAnkle: new Vector3(-0.8, 0, -2.1),
    rightAnkle: new Vector3(0.8, 0, -2.1),
    leftFoot: new Vector3(-0.8, 0, -2.5),
    rightFoot: new Vector3(0.8, 0, -2.5),
    leftThighPlate: new Vector3(-0.8, 0.1, -1),
    rightThighPlate: new Vector3(0.8, 0.1, -1),
    leftCalfPiston: new Vector3(-0.8, 0, -1.6),
    rightCalfPiston: new Vector3(0.8, 0, -1.6),
    leftKneePad: new Vector3(-0.8, 0, -1.4),
    rightKneePad: new Vector3(0.8, 0, -1.4),

    // Vehicle parts (prominent in tank mode)
    frontArmor: new Vector3(0, 0.5, 2.2),
    glacisPlate: new Vector3(0, 0.3, 2.3),
    commanderHatch: new Vector3(0, 1.5, 0.5),
    hull: new Vector3(0, 0.5, 0),
    rearArmor: new Vector3(0, 0.5, -2),
    leftRoadWheel1: new Vector3(-1.5, -0.2, 1.5),
    rightRoadWheel1: new Vector3(1.5, -0.2, 1.5),
    leftRoadWheel2: new Vector3(-1.5, -0.2, -1.5),
    rightRoadWheel2: new Vector3(1.5, -0.2, -1.5),
    leftRoadWheel3: new Vector3(-1.5, -0.2, 0),
    rightRoadWheel3: new Vector3(1.5, -0.2, 0),
    leftExhaust: new Vector3(-1.0, 1.0, -1.8),
    rightExhaust: new Vector3(1.0, 1.0, -1.8),
    turret: new Vector3(0, 1.0, 0.5),
    cannonBarrel: new Vector3(0, 1.0, 2),
    machineGun: new Vector3(0, 1.2, 1.5),
    leftTread: new Vector3(-1.5, 0.2, 0),
    rightTread: new Vector3(1.5, 0.2, 0),
    turretAntenna: new Vector3(0, 1.8, 0.5),
    sideSkirtLeft: new Vector3(-1.8, 0.3, 0),
    sideSkirtRight: new Vector3(1.8, 0.3, 0),
    reactiveArmorLeft: new Vector3(-1.6, 0.5, 1.0),
    reactiveArmorRight: new Vector3(1.6, 0.5, 1.0),
  };

  // Animation timing for each part (extended for new parts)
  const animationStarts = {
    head: 0,
    helmet: 0.02,
    faceplate: 0.04,
    leftEye: 0.06,
    rightEye: 0.07,
    leftAntenna: 0.075,
    rightAntenna: 0.08,
    crest: 0.085,
    leftCheekGuard: 0.09,
    rightCheekGuard: 0.09,
    chinStrap: 0.095,
    headVentLeft: 0.1,
    headVentRight: 0.1,
    chest: 0.105,
    chestMatrix: 0.11,
    abdomen: 0.12,
    waist: 0.14,
    pelvicPlate: 0.15,
    backPanel: 0.155,
    leftSideVent: 0.16,
    rightSideVent: 0.16,
    spineConnector: 0.165,
    leftShoulder: 0.17,
    rightShoulder: 0.17,
    leftShoulderPad: 0.175,
    rightShoulderPad: 0.175,
    leftUpperArm: 0.18,
    rightUpperArm: 0.18,
    leftElbow: 0.185,
    rightElbow: 0.185,
    leftForearm: 0.2,
    rightForearm: 0.2,
    leftWrist: 0.205,
    rightWrist: 0.205,
    leftHand: 0.22,
    rightHand: 0.22,
    leftArmPiston: 0.225,
    rightArmPiston: 0.225,
    leftForearmPlate: 0.23,
    rightForearmPlate: 0.23,
    leftThumb: 0.235,
    rightThumb: 0.235,
    leftThigh: 0.24,
    rightThigh: 0.24,
    leftKnee: 0.245,
    rightKnee: 0.245,
    leftShin: 0.26,
    rightShin: 0.26,
    leftAnkle: 0.265,
    rightAnkle: 0.265,
    leftFoot: 0.28,
    rightFoot: 0.28,
    leftThighPlate: 0.285,
    rightThighPlate: 0.285,
    leftCalfPiston: 0.29,
    rightCalfPiston: 0.29,
    leftKneePad: 0.295,
    rightKneePad: 0.295,
    frontArmor: 0.3,
    glacisPlate: 0.32,
    commanderHatch: 0.34,
    hull: 0.36,
    rearArmor: 0.38,
    leftRoadWheel1: 0.4,
    rightRoadWheel1: 0.4,
    leftRoadWheel2: 0.42,
    rightRoadWheel2: 0.42,
    leftRoadWheel3: 0.43,
    rightRoadWheel3: 0.43,
    leftExhaust: 0.44,
    rightExhaust: 0.44,
    turret: 0.46,
    cannonBarrel: 0.48,
    machineGun: 0.5,
    leftTread: 0.52,
    rightTread: 0.52,
    turretAntenna: 0.53,
    sideSkirtLeft: 0.54,
    sideSkirtRight: 0.54,
    reactiveArmorLeft: 0.55,
    reactiveArmorRight: 0.55,
  };

  // Calculate position based on animation progress and current mode
  const getPosition = (partName, progress) => {
    if (animState === AnimState.IDLE) {
      const targetPositions = isTransformed ? tankPositions : robotPositions;
      return targetPositions[partName];
    }

    const start = startingPositions[partName];
    const end = isTransformed
      ? tankPositions[partName]
      : robotPositions[partName];
    const partStartTime = animationStarts[partName] || 0;

    if (progress < partStartTime) return start;
    if (progress > partStartTime + 0.2) return end;

    const partProgress = (progress - partStartTime) / 0.2;
    const easedProgress = easeOutCubic(partProgress);
    return new Vector3(
      start.x + (end.x - start.x) * easedProgress,
      start.y + (end.y - start.y) * easedProgress,
      start.z + (end.z - start.z) * easedProgress
    );
  };

  // Animation loop using useFrame
  useFrame((_, delta) => {
    const assemblySpeed = 0.25 * animationSpeed;
    const rotationSpeed = 0.25 * animationSpeed;

    if (animState === AnimState.ASSEMBLING_LOOP) {
      setAnimationProgress((prev) => {
        const newProgress = prev + delta * assemblySpeed;
        if (newProgress >= 1) {
          setAnimState(AnimState.ROTATING);
          return 1;
        }
        return newProgress;
      });
    } else if (animState === AnimState.ROTATING) {
      setRotationAngle((prev) => {
        const newAngle = prev + delta * rotationSpeed;
        const targetRotation = Math.PI * 2;
        if (newAngle >= targetRotation) {
          setAnimState(AnimState.PAUSED);
          if (restartLoopTimeoutRef.current) {
            clearTimeout(restartLoopTimeoutRef.current);
          }
          restartLoopTimeoutRef.current = setTimeout(() => {
            setAnimState((currentState) => {
              if (currentState === AnimState.PAUSED) {
                // Toggle between robot and tank mode
                setIsTransformed((prev) => !prev);
                setAnimationProgress(0);
                return AnimState.ASSEMBLING_LOOP;
              }
              return currentState;
            });
          }, 1000);
          return targetRotation % (Math.PI * 2);
        }
        return newAngle;
      });
    } else if (animState === AnimState.ASSEMBLING_TRANSITION) {
      setAnimationProgress((prev) => {
        const newProgress = prev + delta * assemblySpeed;
        if (newProgress >= 1) {
          onAnimationComplete?.(AnimState.IDLE);
          useGameState.setState({ isWireframeAssembled: true });
          setAnimState(AnimState.IDLE);
          return 1;
        }
        return newProgress;
      });
    }
  });

  // Determine current positions and properties
  const currentProgress = animState === AnimState.IDLE ? 1 : animationProgress;
  const currentRotation = animState === AnimState.IDLE ? 0 : rotationAngle;
  const transformerScale = animState === AnimState.IDLE ? 0.8 : 1.2;
  const currentColor = isTransformed ? truckColor : robotColor;
  const metalColor = "#808080"; // Silver-gray for mechanical parts

  return (
    <group
      ref={transformerRef}
      position={[0, 0, 0]}
      scale={transformerScale}
      rotation={[0, currentRotation, 0]}>
      {/* HEAD ASSEMBLY */}
      <Box
        args={[0.6, 0.6, 0.6]}
        position={getPosition("head", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      <Box
        args={[0.7, 0.3, 0.4]}
        position={getPosition("helmet", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.5, 0.4, 0.1]}
        position={getPosition("faceplate", currentProgress).toArray()}>
        <meshStandardMaterial color="#87ceeb" metalness={0.6} roughness={0.4} />
      </Box>

      <Sphere
        args={[0.05]}
        position={getPosition("leftEye", currentProgress).toArray()}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </Sphere>

      <Sphere
        args={[0.05]}
        position={getPosition("rightEye", currentProgress).toArray()}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </Sphere>

      <Cylinder
        args={[0.03, 0.03, 0.3]}
        position={getPosition("leftAntenna", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>

      <Cylinder
        args={[0.03, 0.03, 0.3]}
        position={getPosition("rightAntenna", currentProgress).toArray()}
        rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>

      <Cone
        args={[0.1, 0.2, 8]}
        position={getPosition("crest", currentProgress).toArray()}
        rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </Cone>

      <Box
        args={[0.2, 0.3, 0.2]}
        position={getPosition("leftCheekGuard", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.2, 0.3, 0.2]}
        position={getPosition("rightCheekGuard", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.1, 0.1, 0.2]}
        position={getPosition("chinStrap", currentProgress).toArray()}
        rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Box
        args={[0.15, 0.1, 0.1]}
        position={getPosition("headVentLeft", currentProgress).toArray()}>
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </Box>

      <Box
        args={[0.15, 0.1, 0.1]}
        position={getPosition("headVentRight", currentProgress).toArray()}>
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </Box>

      {/* TORSO ASSEMBLY */}
      <Box
        args={[1.4, 1.8, 0.8]}
        position={getPosition("chest", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      <Box
        args={[0.6, 0.6, 0.2]}
        position={getPosition("chestMatrix", currentProgress).toArray()}>
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffaa00"
          emissiveIntensity={0.5}
        />
      </Box>

      <Box
        args={[1.2, 0.8, 0.6]}
        position={getPosition("abdomen", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      <Box
        args={[1.0, 0.4, 0.5]}
        position={getPosition("waist", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[1.0, 0.3, 0.4]}
        position={getPosition("pelvicPlate", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[1.2, 1.6, 0.3]}
        position={getPosition("backPanel", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.2, 0.2, 0.3]}
        position={getPosition("leftSideVent", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </Cylinder>

      <Cylinder
        args={[0.2, 0.2, 0.3]}
        position={getPosition("rightSideVent", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </Cylinder>

      <Cylinder
        args={[0.15, 0.15, 0.8]}
        position={getPosition("spineConnector", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* ARM ASSEMBLY */}
      <Sphere
        args={[0.25]}
        position={getPosition("leftShoulder", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Sphere
        args={[0.25]}
        position={getPosition("rightShoulder", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Box
        args={[0.5, 0.5, 0.3]}
        position={getPosition("leftShoulderPad", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 12]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.5, 0.5, 0.3]}
        position={getPosition("rightShoulderPad", currentProgress).toArray()}
        rotation={[0, 0, -Math.PI / 12]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.15, 0.18, 0.8]}
        position={getPosition("leftUpperArm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        args={[0.15, 0.18, 0.8]}
        position={getPosition("rightUpperArm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Sphere
        args={[0.15]}
        position={getPosition("leftElbow", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Sphere
        args={[0.15]}
        position={getPosition("rightElbow", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Cylinder
        args={[0.12, 0.15, 0.7]}
        position={getPosition("leftForearm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        args={[0.12, 0.15, 0.7]}
        position={getPosition("rightForearm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        args={[0.14, 0.14, 0.2]}
        position={getPosition("leftWrist", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Cylinder
        args={[0.14, 0.14, 0.2]}
        position={getPosition("rightWrist", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Box
        args={[0.25, 0.25, 0.25]}
        position={getPosition("leftHand", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.25, 0.25, 0.25]}
        position={getPosition("rightHand", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.08, 0.08, 0.4]}
        position={getPosition("leftArmPiston", currentProgress).toArray()}
        rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Cylinder>

      <Cylinder
        args={[0.08, 0.08, 0.4]}
        position={getPosition("rightArmPiston", currentProgress).toArray()}
        rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Cylinder>

      <Box
        args={[0.2, 0.3, 0.1]}
        position={getPosition("leftForearmPlate", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.2, 0.3, 0.1]}
        position={getPosition("rightForearmPlate", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.05, 0.05, 0.15]}
        position={getPosition("leftThumb", currentProgress).toArray()}
        rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Cylinder
        args={[0.05, 0.05, 0.15]}
        position={getPosition("rightThumb", currentProgress).toArray()}
        rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* LEG ASSEMBLY */}
      <Cylinder
        args={[0.2, 0.25, 1.0]}
        position={getPosition("leftThigh", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        args={[0.2, 0.25, 1.0]}
        position={getPosition("rightThigh", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Sphere
        args={[0.2]}
        position={getPosition("leftKnee", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Sphere
        args={[0.2]}
        position={getPosition("rightKnee", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Sphere>

      <Cylinder
        args={[0.18, 0.2, 1.0]}
        position={getPosition("leftShin", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Cylinder
        args={[0.18, 0.2, 1.0]}
        position={getPosition("rightShin", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Cylinder>

      <Box
        args={[0.3, 0.2, 0.3]}
        position={getPosition("leftAnkle", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[0.3, 0.2, 0.3]}
        position={getPosition("rightAnkle", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[0.4, 0.2, 0.8]}
        position={getPosition("leftFoot", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.4, 0.2, 0.8]}
        position={getPosition("rightFoot", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.3, 0.5, 0.2]}
        position={getPosition("leftThighPlate", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.3, 0.5, 0.2]}
        position={getPosition("rightThighPlate", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Cylinder
        args={[0.1, 0.1, 0.5]}
        position={getPosition("leftCalfPiston", currentProgress).toArray()}
        rotation={[Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Cylinder>

      <Cylinder
        args={[0.1, 0.1, 0.5]}
        position={getPosition("rightCalfPiston", currentProgress).toArray()}
        rotation={[Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Cylinder>

      <Box
        args={[0.25, 0.2, 0.15]}
        position={getPosition("leftKneePad", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.25, 0.2, 0.15]}
        position={getPosition("rightKneePad", currentProgress).toArray()}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      {/* VEHICLE PARTS */}
      <Box
        args={[1.8, 0.8, 0.3]}
        position={getPosition("frontArmor", currentProgress).toArray()}
        rotation={[Math.PI / 12, 0, 0]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[2.0, 0.3, 0.2]}
        position={getPosition("glacisPlate", currentProgress).toArray()}
        rotation={[Math.PI / 6, 0, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[1.6, 0.8, 0.1]}
        position={getPosition("commanderHatch", currentProgress).toArray()}
        rotation={[Math.PI / 8, 0, 0]}>
        <meshStandardMaterial
          color="#87ceeb"
          metalness={0.1}
          roughness={0.1}
          transparent={true}
          opacity={0.7}
        />
      </Box>

      <Box
        args={[1.8, 0.8, 3.0]}
        position={getPosition("hull", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      <Box
        args={[2.0, 1.0, 1.5]}
        position={getPosition("rearArmor", currentProgress).toArray()}
        rotation={[-Math.PI / 12, 0, 0]}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      {/* ROAD WHEELS */}
      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("leftRoadWheel1", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("rightRoadWheel1", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("leftRoadWheel2", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("rightRoadWheel2", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("leftRoadWheel3", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.3, 0.3, 0.3]}
        position={getPosition("rightRoadWheel3", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      {/* EXHAUSTS */}
      <Cylinder
        args={[0.1, 0.12, 0.8]}
        position={getPosition("leftExhaust", currentProgress).toArray()}
        rotation={[0, Math.PI / 8, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </Cylinder>

      <Cylinder
        args={[0.1, 0.12, 0.8]}
        position={getPosition("rightExhaust", currentProgress).toArray()}
        rotation={[0, -Math.PI / 8, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </Cylinder>

      {/* ADDITIONAL TANK PARTS */}
      <Box
        args={[1.2, 0.6, 1.2]}
        position={getPosition("turret", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.9}
          roughness={0.2}
        />
      </Box>

      <Cylinder
        args={[0.15, 0.15, 2.0]}
        position={getPosition("cannonBarrel", currentProgress).toArray()}
        rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </Cylinder>

      <Cylinder
        args={[0.05, 0.05, 0.8]}
        position={getPosition("machineGun", currentProgress).toArray()}
        rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Box
        args={[0.6, 0.4, 4.0]}
        position={getPosition("leftTread", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Box>

      <Box
        args={[0.6, 0.4, 4.0]}
        position={getPosition("rightTread", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Box>

      <Cylinder
        args={[0.02, 0.02, 0.5]}
        position={getPosition("turretAntenna", currentProgress).toArray()}>
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </Cylinder>

      <Box
        args={[0.4, 0.6, 3.0]}
        position={getPosition("sideSkirtLeft", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 12]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.4, 0.6, 3.0]}
        position={getPosition("sideSkirtRight", currentProgress).toArray()}
        rotation={[0, 0, -Math.PI / 12]}>
        <meshStandardMaterial
          color={metalColor}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>

      <Box
        args={[0.3, 0.3, 0.3]}
        position={getPosition("reactiveArmorLeft", currentProgress).toArray()}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Box>

      <Box
        args={[0.3, 0.3, 0.3]}
        position={getPosition("reactiveArmorRight", currentProgress).toArray()}>
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </Box>
    </group>
  );
};

export default OptimusPrime;
