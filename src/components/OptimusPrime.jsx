import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import { Box, Cylinder, Sphere } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

const OptimuspPrime = () => {
  const groupRef = useRef();
  const [isTransformed, setIsTransformed] = useState(false);

  const { transform, robotColor, truckColor, animationSpeed, autoTransform } =
    useControls("Optimus Prime", {
      transform: { value: false },
      robotColor: { value: "#1e3a8a" },
      truckColor: { value: "#dc2626" },
      animationSpeed: { value: 1, min: 0.1, max: 3 },
      autoTransform: { value: true },
    });

  // Auto-transform every 4 seconds
  useEffect(() => {
    if (autoTransform) {
      const interval = setInterval(() => {
        setIsTransformed((prev) => !prev);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoTransform]);

  // Manual transform control
  useEffect(() => {
    setIsTransformed(transform);
  }, [transform]);

  // Animation springs for transformation
  const { headPosition, headRotation } = useSpring({
    headPosition: isTransformed ? [0, 2.5, 0] : [0, 0.8, 2],
    headRotation: isTransformed ? [0, 0, 0] : [-Math.PI / 4, 0, 0],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  const { chestPosition, chestScale } = useSpring({
    chestPosition: isTransformed ? [0, 1.5, 0] : [0, 0, 1],
    chestScale: isTransformed ? [1.5, 2, 0.8] : [2, 1, 3],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  const { leftArmPosition, leftArmRotation } = useSpring({
    leftArmPosition: isTransformed ? [-2, 1, 0] : [-1.5, 0, 0.5],
    leftArmRotation: isTransformed ? [0, 0, -Math.PI / 6] : [0, 0, Math.PI / 2],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  const { rightArmPosition, rightArmRotation } = useSpring({
    rightArmPosition: isTransformed ? [2, 1, 0] : [1.5, 0, 0.5],
    rightArmRotation: isTransformed
      ? [0, 0, Math.PI / 6]
      : [0, 0, -Math.PI / 2],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  const { leftLegPosition, leftLegRotation } = useSpring({
    leftLegPosition: isTransformed ? [-0.5, -1, 0] : [-0.8, -0.5, -1.5],
    leftLegRotation: isTransformed ? [0, 0, 0] : [Math.PI / 3, 0, 0],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  const { rightLegPosition, rightLegRotation } = useSpring({
    rightLegPosition: isTransformed ? [0.5, -1, 0] : [0.8, -0.5, -1.5],
    rightLegRotation: isTransformed ? [0, 0, 0] : [Math.PI / 3, 0, 0],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  // Wheel animations
  const { frontWheelsPosition, rearWheelsPosition } = useSpring({
    frontWheelsPosition: isTransformed ? [0, -2.5, 2] : [0, -0.8, 2.5],
    rearWheelsPosition: isTransformed ? [0, -2.5, -2] : [0, -0.8, -1.5],
    config: { ...config.wobbly, duration: 2000 / animationSpeed },
  });

  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const currentColor = isTransformed ? robotColor : truckColor;
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: currentColor,
    metalness: 0.7,
    roughness: 0.3,
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.8,
    roughness: 0.2,
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Head */}
      <animated.group position={headPosition} rotation={headRotation}>
        <Box args={[0.8, 0.8, 0.8]} material={metalMaterial} castShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
        {/* Eyes */}
        <Sphere
          args={[0.1]}
          position={[-0.2, 0.1, 0.4]}
          material={darkMaterial}
        />
        <Sphere
          args={[0.1]}
          position={[0.2, 0.1, 0.4]}
          material={darkMaterial}
        />
        {/* Antennae */}
        <Cylinder
          args={[0.02, 0.02, 0.3]}
          position={[-0.3, 0.5, 0]}
          material={darkMaterial}
        />
        <Cylinder
          args={[0.02, 0.02, 0.3]}
          position={[0.3, 0.5, 0]}
          material={darkMaterial}
        />
      </animated.group>

      {/* Chest/Cabin */}
      <animated.group position={chestPosition} scale={chestScale}>
        <Box args={[1, 1, 1]} castShadow receiveShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
        {/* Autobot Logo Area */}
        <Box args={[0.3, 0.3, 0.1]} position={[0, 0.3, 0.51]}>
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </animated.group>

      {/* Left Arm */}
      <animated.group position={leftArmPosition} rotation={leftArmRotation}>
        <Cylinder args={[0.2, 0.2, 1.5]} castShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        {/* Shoulder Joint */}
        <Sphere args={[0.3]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </Sphere>
        {/* Hand */}
        <Box args={[0.3, 0.3, 0.3]} position={[0, -0.9, 0]}>
          <meshStandardMaterial
            color={darkMaterial.color}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </animated.group>

      {/* Right Arm */}
      <animated.group position={rightArmPosition} rotation={rightArmRotation}>
        <Cylinder args={[0.2, 0.2, 1.5]} castShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        {/* Shoulder Joint */}
        <Sphere args={[0.3]} position={[0, 0.8, 0]}>
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </Sphere>
        {/* Hand */}
        <Box args={[0.3, 0.3, 0.3]} position={[0, -0.9, 0]}>
          <meshStandardMaterial
            color={darkMaterial.color}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </animated.group>

      {/* Left Leg */}
      <animated.group position={leftLegPosition} rotation={leftLegRotation}>
        <Cylinder args={[0.25, 0.25, 2]} castShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        {/* Knee Joint */}
        <Sphere args={[0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </Sphere>
        {/* Foot */}
        <Box args={[0.4, 0.2, 0.8]} position={[0, -1.2, 0.2]}>
          <meshStandardMaterial
            color={darkMaterial.color}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </animated.group>

      {/* Right Leg */}
      <animated.group position={rightLegPosition} rotation={rightLegRotation}>
        <Cylinder args={[0.25, 0.25, 2]} castShadow>
          <meshStandardMaterial
            color={currentColor}
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
        {/* Knee Joint */}
        <Sphere args={[0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </Sphere>
        {/* Foot */}
        <Box args={[0.4, 0.2, 0.8]} position={[0, -1.2, 0.2]}>
          <meshStandardMaterial
            color={darkMaterial.color}
            metalness={0.8}
            roughness={0.2}
          />
        </Box>
      </animated.group>

      {/* Wheels - Front */}
      <animated.group position={frontWheelsPosition}>
        <Cylinder
          args={[0.4, 0.4, 0.2]}
          rotation={[0, 0, Math.PI / 2]}
          position={[-1, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.3}
            roughness={0.7}
          />
        </Cylinder>
        <Cylinder
          args={[0.4, 0.4, 0.2]}
          rotation={[0, 0, Math.PI / 2]}
          position={[1, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.3}
            roughness={0.7}
          />
        </Cylinder>
      </animated.group>

      {/* Wheels - Rear */}
      <animated.group position={rearWheelsPosition}>
        <Cylinder
          args={[0.4, 0.4, 0.2]}
          rotation={[0, 0, Math.PI / 2]}
          position={[-1, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.3}
            roughness={0.7}
          />
        </Cylinder>
        <Cylinder
          args={[0.4, 0.4, 0.2]}
          rotation={[0, 0, Math.PI / 2]}
          position={[1, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.3}
            roughness={0.7}
          />
        </Cylinder>
      </animated.group>

      {/* Exhaust Pipes (visible in truck mode) */}
      {!isTransformed && (
        <group>
          <Cylinder
            args={[0.1, 0.1, 2]}
            position={[-0.8, 1, -2]}
            rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#333"
              metalness={0.8}
              roughness={0.3}
            />
          </Cylinder>
          <Cylinder
            args={[0.1, 0.1, 2]}
            position={[0.8, 1, -2]}
            rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#333"
              metalness={0.8}
              roughness={0.3}
            />
          </Cylinder>
        </group>
      )}
    </group>
  );
};

export default OptimuspPrime;
