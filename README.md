# 🤖 Optimus Prime Transformer - Three.js Animation

A stunning 3D transformer animation featuring Optimus Prime built with React Three Fiber and Three.js. Watch as the iconic Autobot leader seamlessly transforms between robot and truck modes with realistic physics and beautiful visual effects.

![Optimus Prime Transformer](https://img.shields.io/badge/Three.js-Transformer-blue?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite)

## ✨ Features

- **🔄 Smooth Transformation Animation**: Seamless transition between robot and truck modes
- **🎮 Interactive Controls**: Manual transformation controls and animation settings
- **🌟 Visual Effects**: Post-processing effects including bloom and depth of field
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Sleek, futuristic interface with glassmorphism design
- **⚡ Real-time Physics**: Realistic movement and rotation animations
- **🔧 Debug Controls**: Leva-powered control panel for real-time adjustments

## 🚀 Live Demo

The application automatically starts the transformation sequence, or you can control it manually using the debug panel.

## 🛠️ Technologies Used

- **React 19** - Latest React with modern hooks
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **React Three Drei** - Useful helpers for R3F
- **React Spring** - Smooth spring animations
- **Leva** - Debug control panel
- **Vite** - Lightning-fast build tool
- **Post-processing** - Visual effects pipeline

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd threejs-transformer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see Optimus Prime in action!

## 🎮 Controls

### Mouse/Touch Controls

- **Left Click + Drag**: Rotate camera around Optimus Prime
- **Scroll/Pinch**: Zoom in and out
- **Right Click + Drag**: Pan camera position

### Debug Panel (Top Right)

- **Transform**: Manually trigger transformation
- **Robot Color**: Customize robot mode color
- **Truck Color**: Customize truck mode color
- **Animation Speed**: Control transformation speed
- **Auto Transform**: Enable/disable automatic transformation
- **Auto Rotate**: Enable/disable camera auto-rotation
- **Post Processing**: Toggle visual effects

## 🏗️ Project Structure

```
src/
├── components/
│   └── OptimusPrime.jsx    # Main transformer component
├── App.jsx                 # Main application component
├── App.css                 # Styling and visual effects
├── index.css               # Base styles
└── main.jsx               # Application entry point
```

## 🎯 Key Components

### OptimusPrime Component

- **Geometric Construction**: Built using Three.js primitives (Box, Cylinder, Sphere)
- **Animation System**: React Spring for smooth transformations
- **Part Management**: Separate animations for head, arms, legs, wheels, etc.
- **Material System**: Metallic materials with customizable colors

### Animation Features

- **Head Movement**: Rotates and repositions during transformation
- **Limb Articulation**: Arms and legs move realistically
- **Wheel Integration**: Wheels fold into robot or extend for truck mode
- **Exhaust Systems**: Appear/disappear based on mode
- **Idle Animations**: Subtle breathing and floating effects

## 🎨 Visual Effects

- **HDR Environment**: City environment with realistic lighting
- **Bloom Effect**: Glowing highlights on metallic surfaces
- **Depth of Field**: Cinematic focus effects
- **Shadow Mapping**: Realistic shadows with soft edges
- **Metallic Materials**: PBR materials with configurable metalness and roughness

## 🔧 Customization

### Adding New Parts

```jsx
// Add new geometry to the OptimusPrime component
<animated.group position={newPartPosition} rotation={newPartRotation}>
  <Box args={[width, height, depth]} castShadow>
    <meshStandardMaterial
      color={currentColor}
      metalness={0.7}
      roughness={0.3}
    />
  </Box>
</animated.group>
```

### Modifying Animation Springs

```jsx
const { partPosition, partRotation } = useSpring({
  partPosition: isTransformed ? robotPos : truckPos,
  partRotation: isTransformed ? robotRot : truckRot,
  config: { ...config.wobbly, duration: 2000 / animationSpeed },
});
```

## 🚀 Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` folder.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Transformers Franchise** - For the iconic Optimus Prime character
- **Three.js Community** - For the amazing 3D library
- **React Three Fiber Team** - For making 3D React development a joy
- **Leva** - For the excellent debug controls

## 🐛 Troubleshooting

### Common Issues

1. **Black screen**: Check browser console for errors, ensure WebGL is supported
2. **Performance issues**: Reduce post-processing effects or use a simpler environment
3. **Control panel not working**: Ensure Leva is properly imported and initialized

### Browser Support

- Chrome 80+
- Firefox 79+
- Safari 14+
- Edge 80+

---

**🤖 Transform and roll out!** Enjoy watching Optimus Prime come to life in your browser!
