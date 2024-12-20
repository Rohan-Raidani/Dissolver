# React Three Fiber Dissolve Effect

A customizable dissolve effect component for React Three Fiber applications, featuring noise-based transitions with glowing edges.

## Installation

```bash
npm install dissolver
```

## Features

- Smooth dissolve transitions with customizable parameters
- Support for both fade-in and fade-out animations
- Compatible with any Three.js geometry
- Customizable colors and animation duration

## Requirements

This package requires the following peer dependencies:

```json
{
  "@react-three/fiber": ">=8.0.0",
  "@react-three/drei": ">=9.0.0",
  "three": ">=0.150.0",
  "react": ">=18.0.0",
  "gl-noise": ">=1.6.0",
  "maath": ">=0.5.0"
}
```

## Basic Usage

```jsx
import { Canvas } from "@react-three/fiber";
import { DissolveEffect } from "dissolver";

function App() {
  const [isFading, setIsFading] = useState(true);

  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <DissolveEffect
          fadeIn={isFading}
          fadeOut={!isFading}
          color="#FFD700"
          thickness={0.1}
          intensity={10}
        />
      </mesh>
    </Canvas>
  );
}
```

## Props

| Prop           | Type                   | Default                | Description                                         |
| -------------- | ---------------------- | ---------------------- | --------------------------------------------------- |
| `geometry`     | `THREE.BufferGeometry` | `undefined`            | Optional geometry to use with the effect            |
| `baseMaterial` | `THREE.Material`       | `MeshStandardMaterial` | Base material to apply the effect to                |
| `fadeIn`       | `boolean`              | `false`                | Controls fade-in animation                          |
| `fadeOut`      | `boolean`              | `false`                | Controls fade-out animation                         |
| `color`        | `string`               | Required               | Color of the dissolve edge effect                   |
| `thickness`    | `number`               | `0.1`                  | Thickness of the dissolve edge                      |
| `intensity`    | `number`               | `50`                   | Intensity of the edge glow                          |
| `duration`     | `number`               | `1.2`                  | Duration of the fade animation in seconds           |
| `onFadeOut`    | `() => void`           | `undefined`            | Callback function triggered when fade-out completes |

## Advanced Usage

### With Post-Processing

```jsx
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { DissolveEffect } from "r3f-dissolve-effect";

function App() {
  return (
    <Canvas>
      <EffectComposer>
        <Bloom luminanceThreshold={2} intensity={1.25} mipmapBlur />
      </EffectComposer>
      <mesh>
        <boxGeometry />
        <DissolveEffect fadeIn={true} color="#FFD700" />
      </mesh>
    </Canvas>
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Credits

Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [Three.js](https://threejs.org/).

## Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/Rohan-Raidani/Dissolver.git/issues).
