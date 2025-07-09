import { create } from "zustand";

// Game state store for managing transformer states
export const useGameState = create((set, get) => ({
  // Transformer state
  isWireframeAssembled: false,
  isTransformed: false,
  animationMode: "ASSEMBLING_LOOP", // Current animation mode

  // Animation controls
  autoTransform: true,
  animationSpeed: 1,
  robotColor: "#1e3a8a",
  truckColor: "#dc2626",

  // Actions
  setWireframeAssembled: (assembled) =>
    set({ isWireframeAssembled: assembled }),
  setTransformed: (transformed) => set({ isTransformed: transformed }),
  setAnimationMode: (mode) => set({ animationMode: mode }),
  setAutoTransform: (auto) => set({ autoTransform: auto }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setRobotColor: (color) => set({ robotColor: color }),
  setTruckColor: (color) => set({ truckColor: color }),

  // Reset state
  reset: () =>
    set({
      isWireframeAssembled: false,
      isTransformed: false,
      animationMode: "ASSEMBLING_LOOP",
      autoTransform: true,
      animationSpeed: 1,
    }),
}));

// Animation states enum as constants
export const AnimState = {
  IDLE: "IDLE", // Fully assembled, not moving
  ASSEMBLING_LOOP: "ASSEMBLING_LOOP", // Original assembling -> rotating loop
  ROTATING: "ROTATING", // Looping rotation
  PAUSED: "PAUSED", // Looping pause
  ASSEMBLING_ONCE: "ASSEMBLING_ONCE", // DEPRECATED (Assemble once and then stop)
  ASSEMBLING_TRANSITION: "ASSEMBLING_TRANSITION",
  ROTATING_TRANSITION: "ROTATING_TRANSITION",
  PAUSED_TRANSITION: "PAUSED_TRANSITION",
  TRANSFORMING: "TRANSFORMING", // New state for robot-truck transformation
  ROBOT_MODE: "ROBOT_MODE",
  TRUCK_MODE: "TRUCK_MODE",
};
