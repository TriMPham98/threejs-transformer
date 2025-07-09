import React, { useRef, useState, useEffect } from "react";
import { Box, Cylinder, Sphere } from "@react-three/drei";
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

  // Define the starting positions for each Optimus Prime piece (scattered)
  const startingPositions = {
    // Head parts
    head: new Vector3(0, 25, 0),
    helmet: new Vector3(0, 30, 0),
    faceplate: new Vector3(0, 20, 5),
    eyes: new Vector3(-15, 0.1, 10),

    // Torso parts
    chest: new Vector3(0, 20, 0),
    chestMatrix: new Vector3(0, 25, 2),
    abdomen: new Vector3(0, 15, 0),
    waist: new Vector3(0, 10, 0),

    // Arms
    leftShoulder: new Vector3(-30, 1, 0),
    rightShoulder: new Vector3(30, 1, 0),
    leftUpperArm: new Vector3(-25, 1, 0),
    rightUpperArm: new Vector3(25, 1, 0),
    leftForearm: new Vector3(-20, 1, 0),
    rightForearm: new Vector3(20, 1, 0),
    leftHand: new Vector3(-15, 1, 0),
    rightHand: new Vector3(15, 1, 0),

    // Legs
    leftThigh: new Vector3(-20, -10, 0),
    rightThigh: new Vector3(20, -10, 0),
    leftShin: new Vector3(-25, -15, 0),
    rightShin: new Vector3(25, -15, 0),
    leftFoot: new Vector3(-30, -20, 0),
    rightFoot: new Vector3(30, -20, 0),

    // Vehicle parts (for truck mode)
    frontGrill: new Vector3(0, 0, 25),
    frontBumper: new Vector3(0, -5, 20),
    windshield: new Vector3(0, 15, 15),
    cabin: new Vector3(0, 10, 10),
    trailer: new Vector3(0, 5, -20),
    leftWheel1: new Vector3(-20, -5, 15),
    rightWheel1: new Vector3(20, -5, 15),
    leftWheel2: new Vector3(-20, -5, -15),
    rightWheel2: new Vector3(20, -5, -15),
    smokeStack1: new Vector3(-15, 20, 5),
    smokeStack2: new Vector3(15, 20, 5),
  };

  // Define the target positions for robot mode
  const robotPositions = {
    // Head parts
    head: new Vector3(0, 2.3, 0),
    helmet: new Vector3(0, 2.6, 0),
    faceplate: new Vector3(0, 2.3, 0.4),
    eyes: new Vector3(0, 2.35, 0.45),

    // Torso parts
    chest: new Vector3(0, 1.5, 0),
    chestMatrix: new Vector3(0, 1.7, 0.3),
    abdomen: new Vector3(0, 1.0, 0),
    waist: new Vector3(0, 0.5, 0),

    // Arms
    leftShoulder: new Vector3(-1.8, 1.8, 0),
    rightShoulder: new Vector3(1.8, 1.8, 0),
    leftUpperArm: new Vector3(-2.2, 1.2, 0),
    rightUpperArm: new Vector3(2.2, 1.2, 0),
    leftForearm: new Vector3(-2.2, 0.6, 0),
    rightForearm: new Vector3(2.2, 0.6, 0),
    leftHand: new Vector3(-2.2, 0.1, 0),
    rightHand: new Vector3(2.2, 0.1, 0),

    // Legs
    leftThigh: new Vector3(-0.6, -0.3, 0),
    rightThigh: new Vector3(0.6, -0.3, 0),
    leftShin: new Vector3(-0.6, -1.2, 0),
    rightShin: new Vector3(0.6, -1.2, 0),
    leftFoot: new Vector3(-0.6, -2.0, 0.2),
    rightFoot: new Vector3(0.6, -2.0, 0.2),

    // Vehicle parts (hidden/integrated in robot mode)
    frontGrill: new Vector3(0, 1.5, 0.2),
    frontBumper: new Vector3(0, 1.3, 0.25),
    windshield: new Vector3(0, 2.0, -0.2),
    cabin: new Vector3(0, 1.8, -0.1),
    trailer: new Vector3(0, 0.5, -0.8),
    leftWheel1: new Vector3(-0.8, 0.3, -0.5),
    rightWheel1: new Vector3(0.8, 0.3, -0.5),
    leftWheel2: new Vector3(-0.8, -1.0, -0.5),
    rightWheel2: new Vector3(0.8, -1.0, -0.5),
    smokeStack1: new Vector3(-0.3, 2.8, -0.3),
    smokeStack2: new Vector3(0.3, 2.8, -0.3),
  };

  // Define truck mode positions
  const truckPositions = {
    // Head parts (integrated into cabin)
    head: new Vector3(0, 0.8, 1.8),
    helmet: new Vector3(0, 0.9, 1.7),
    faceplate: new Vector3(0, 0.8, 2.0),
    eyes: new Vector3(0, 0.8, 2.1),

    // Torso parts (become truck body)
    chest: new Vector3(0, 0, 1),
    chestMatrix: new Vector3(0, 0.1, 1.3),
    abdomen: new Vector3(0, 0, 0.5),
    waist: new Vector3(0, 0, 0),

    // Arms (fold into sides)
    leftShoulder: new Vector3(-1.2, 0.2, 1),
    rightShoulder: new Vector3(1.2, 0.2, 1),
    leftUpperArm: new Vector3(-1.5, 0, 0.5),
    rightUpperArm: new Vector3(1.5, 0, 0.5),
    leftForearm: new Vector3(-1.5, 0, 0),
    rightForearm: new Vector3(1.5, 0, 0),
    leftHand: new Vector3(-1.5, 0, -0.5),
    rightHand: new Vector3(1.5, 0, -0.5),

    // Legs (become rear truck)
    leftThigh: new Vector3(-0.8, 0, -1),
    rightThigh: new Vector3(0.8, 0, -1),
    leftShin: new Vector3(-0.8, 0, -1.8),
    rightShin: new Vector3(0.8, 0, -1.8),
    leftFoot: new Vector3(-0.8, 0, -2.5),
    rightFoot: new Vector3(0.8, 0, -2.5),

    // Vehicle parts (prominent in truck mode)
    frontGrill: new Vector3(0, 0.3, 2.8),
    frontBumper: new Vector3(0, 0.1, 2.9),
    windshield: new Vector3(0, 0.8, 2.2),
    cabin: new Vector3(0, 0.5, 2),
    trailer: new Vector3(0, 0.2, -2.5),
    leftWheel1: new Vector3(-1.2, -0.5, 2.2),
    rightWheel1: new Vector3(1.2, -0.5, 2.2),
    leftWheel2: new Vector3(-1.2, -0.5, -2.2),
    rightWheel2: new Vector3(1.2, -0.5, -2.2),
    smokeStack1: new Vector3(-0.6, 1.5, 1.5),
    smokeStack2: new Vector3(0.6, 1.5, 1.5),
  };

  // Animation timing for each part
  const animationStarts = {
    head: 0,
    helmet: 0.02,
    faceplate: 0.04,
    eyes: 0.06,
    chest: 0.08,
    chestMatrix: 0.1,
    abdomen: 0.12,
    waist: 0.14,
    leftShoulder: 0.16,
    rightShoulder: 0.16,
    leftUpperArm: 0.18,
    rightUpperArm: 0.18,
    leftForearm: 0.2,
    rightForearm: 0.2,
    leftHand: 0.22,
    rightHand: 0.22,
    leftThigh: 0.24,
    rightThigh: 0.24,
    leftShin: 0.26,
    rightShin: 0.26,
    leftFoot: 0.28,
    rightFoot: 0.28,
    frontGrill: 0.3,
    frontBumper: 0.32,
    windshield: 0.34,
    cabin: 0.36,
    trailer: 0.38,
    leftWheel1: 0.4,
    rightWheel1: 0.4,
    leftWheel2: 0.42,
    rightWheel2: 0.42,
    smokeStack1: 0.44,
    smokeStack2: 0.44,
  };

  // Calculate position based on animation progress and current mode
  const getPosition = (partName, progress) => {
    if (animState === AnimState.IDLE) {
      const targetPositions = isTransformed ? truckPositions : robotPositions;
      return targetPositions[partName];
    }

    const start = startingPositions[partName];
    const end = isTransformed
      ? truckPositions[partName]
      : robotPositions[partName];
    const partStartTime = animationStarts[partName];

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
                // Toggle between robot and truck mode
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
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      <Box
        args={[0.7, 0.3, 0.4]}
        position={getPosition("helmet", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[0.5, 0.4, 0.1]}
        position={getPosition("faceplate", currentProgress).toArray()}>
        <meshStandardMaterial color="#87ceeb" metalness={0.6} roughness={0.4} />
      </Box>

      <Sphere
        args={[0.05]}
        position={getPosition("eyes", currentProgress).toArray()}>
        <meshStandardMaterial color="#00ffff" emissive="#004455" />
      </Sphere>

      {/* TORSO ASSEMBLY */}
      <Box
        args={[1.4, 1.8, 0.8]}
        position={getPosition("chest", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      <Box
        args={[0.6, 0.6, 0.2]}
        position={getPosition("chestMatrix", currentProgress).toArray()}>
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[1.2, 0.8, 0.6]}
        position={getPosition("abdomen", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      <Box
        args={[1.0, 0.4, 0.5]}
        position={getPosition("waist", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

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

      <Cylinder
        args={[0.15, 0.18, 0.8]}
        position={getPosition("leftUpperArm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.15, 0.18, 0.8]}
        position={getPosition("rightUpperArm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.12, 0.15, 0.7]}
        position={getPosition("leftForearm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.12, 0.15, 0.7]}
        position={getPosition("rightForearm", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Box
        args={[0.25, 0.25, 0.25]}
        position={getPosition("leftHand", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[0.25, 0.25, 0.25]}
        position={getPosition("rightHand", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* LEG ASSEMBLY */}
      <Cylinder
        args={[0.2, 0.25, 1.0]}
        position={getPosition("leftThigh", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.2, 0.25, 1.0]}
        position={getPosition("rightThigh", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.18, 0.2, 1.0]}
        position={getPosition("leftShin", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Cylinder
        args={[0.18, 0.2, 1.0]}
        position={getPosition("rightShin", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      <Box
        args={[0.4, 0.2, 0.8]}
        position={getPosition("leftFoot", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[0.4, 0.2, 0.8]}
        position={getPosition("rightFoot", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* VEHICLE PARTS */}
      <Box
        args={[1.8, 0.8, 0.3]}
        position={getPosition("frontGrill", currentProgress).toArray()}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[2.0, 0.3, 0.2]}
        position={getPosition("frontBumper", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      <Box
        args={[1.6, 0.8, 0.1]}
        position={getPosition("windshield", currentProgress).toArray()}
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
        args={[1.8, 1.0, 1.5]}
        position={getPosition("cabin", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      <Box
        args={[2.0, 1.0, 3.0]}
        position={getPosition("trailer", currentProgress).toArray()}>
        <meshStandardMaterial
          color={currentColor}
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      {/* WHEELS */}
      <Cylinder
        args={[0.4, 0.4, 0.3]}
        position={getPosition("leftWheel1", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.4, 0.4, 0.3]}
        position={getPosition("rightWheel1", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.4, 0.4, 0.3]}
        position={getPosition("leftWheel2", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      <Cylinder
        args={[0.4, 0.4, 0.3]}
        position={getPosition("rightWheel2", currentProgress).toArray()}
        rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </Cylinder>

      {/* SMOKE STACKS */}
      <Cylinder
        args={[0.1, 0.12, 1.2]}
        position={getPosition("smokeStack1", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </Cylinder>

      <Cylinder
        args={[0.1, 0.12, 1.2]}
        position={getPosition("smokeStack2", currentProgress).toArray()}>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
};

export default OptimusPrime;
