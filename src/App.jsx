import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useProgress,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import OptimusPrime from "./components/OptimusPrime";
import { useGameState, AnimState } from "./utils/gameState";
import "./App.css";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loader">
        <div className="loader-bar">
          <div className="loader-progress" style={{ width: `${progress}%` }} />
        </div>
        <p>Loading Optimus Prime... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function App() {
  const { autoTransform, robotColor, truckColor, animationSpeed } =
    useGameState();

  return (
    <div className="App">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true }}>
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="city" background />

          {/* Main Component - Optimus Prime with tank-style animation */}
          <OptimusPrime
            animationMode={AnimState.ASSEMBLING_LOOP}
            onAnimationComplete={(finalState) => {
              console.log("Animation completed:", finalState);
            }}
          />

          {/* Controls */}
          <OrbitControls
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={20}
          />

          {/* Post Processing Effects */}
          <EffectComposer>
            <Bloom intensity={0.3} luminanceThreshold={0.9} />
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className="ui-overlay">
        <h1>Optimus Prime Transformer</h1>
        <p>
          Watch as the legendary Autobot assembles piece by piece, then
          transforms between robot and truck modes!
        </p>
        <div className="transformation-info">
          <p>• Assembly → Rotation → Transform → Repeat</p>
          <p>• Each cycle shows a different mode</p>
          <p>• Click and drag to explore the 3D model</p>
        </div>
      </div>
    </div>
  );
}

export default App;
