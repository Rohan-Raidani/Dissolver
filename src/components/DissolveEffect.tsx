import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise";
import { easing } from "maath";
import * as React from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

// Vertex shader
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition; // Use world position instead of UV
  void main() {
    vUv = uv;
    vPosition = position;
  }
`;

// Fragment shader with noise and dissolve logic
const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uThickness;
  uniform vec3 uColor;
  uniform float uProgress;
  
  void main() {
    gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
    // Using world position for better dissolve effect
    float noise = gln_sfbm(vPosition, opts);
    noise = gln_normalize(noise);

    float progress = uProgress;

    // The dissolve effect logic: alpha decreases as progress goes from 0 to 1
    float alpha = step(1.0 - progress, noise);
    float border = step((1.0 - progress) - uThickness, noise) - alpha;

    csm_DiffuseColor.a = alpha + border;
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
  }
`);

// DissolveEffect component
interface DissolveEffectProps {
  geometry?: THREE.BufferGeometry;
  baseMaterial?: THREE.Material;
  fadeIn: boolean;
  fadeOut: boolean;
  color: string;
  thickness?: number;
  intensity?: number;
  duration?: number;
  onFadeOut?: () => void;
  children?: React.ReactNode;
}

export const DissolveEffect: React.FC<DissolveEffectProps> = ({
  geometry,
  baseMaterial = new THREE.MeshStandardMaterial({ color: "#808080" }),
  fadeIn,
  fadeOut,
  color,
  thickness = 0.1,
  intensity = 50,
  duration = 1.2,
  onFadeOut,
  children,
}) => {
  const meshRef = React.useRef<THREE.Mesh>(null); // Reference to the mesh
  const uniforms = React.useRef({
    uThickness: { value: thickness },
    uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
    uProgress: { value: 0 },
  });

  // Update uniforms when props change
  React.useEffect(() => {
    uniforms.current.uThickness.value = thickness;
    uniforms.current.uColor.value.set(color).multiplyScalar(intensity);
  }, [thickness, color, intensity]);

  // Update dissolve effect based on fadeIn and fadeOut
  useFrame((_state, delta) => {
    if (fadeIn) {
      easing.damp(uniforms.current.uProgress, "value", 1, duration, delta);
    } else if (fadeOut) {
      easing.damp(uniforms.current.uProgress, "value", 0, duration, delta);
    }

    // Disable shadow if fully transparent
    if (uniforms.current.uProgress.value === 0 && meshRef.current) {
      // Disable shadows when fully dissolved
      meshRef.current.castShadow = false;
      meshRef.current.receiveShadow = false;
    } else if (uniforms.current.uProgress.value > 0 && meshRef.current) {
      // Re-enable shadows if not fully dissolved
      meshRef.current.castShadow = false;
      meshRef.current.receiveShadow = false;
    }

    // Trigger onFadeOut when dissolve reaches a certain progress
    if (fadeOut && uniforms.current.uProgress.value < 0.1 && onFadeOut) {
      onFadeOut();
    }
  });

  const materialProps = {
    baseMaterial: baseMaterial,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms.current,
    toneMapped: false,
    transparent: true,
  };

  // If geometry is provided, render as a mesh
  if (geometry) {
    return (
      <mesh
        ref={meshRef} // Reference to the mesh
        geometry={geometry}
        castShadow={false}
        receiveShadow={false}
      >
        <CSM {...materialProps} />
      </mesh>
    );
  }

  // If no geometry, return just the material to be used with children
  return <CSM {...materialProps}>{children}</CSM>;
};
