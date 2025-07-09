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
import { Leva, useControls } from "leva";
import OptimusPrime from "./components/OptimusPrime";
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
  const { autoRotate, enablePostProcessing } = useControls({
    autoRotate: { value: true },
    enablePostProcessing: { value: true },
  });

  return (
    <div className="App">
      <Leva />
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

          {/* Main Component */}
          <OptimusPrime />

          {/* Controls */}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enableZoom={true}
            enablePan={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={20}
          />

          {/* Post Processing Effects */}
          {enablePostProcessing && (
            <EffectComposer>
              <Bloom intensity={0.3} luminanceThreshold={0.9} />
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>

      <div className="ui-overlay">
        <h1>Optimus Prime Transformer</h1>
        <p>
          Click and drag to rotate • Scroll to zoom • Use controls to customize
        </p>
      </div>
    </div>
  );
}

export default App;
