import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/index.tsx", // Path to your entry file
      name: "DissolveEffect", // Global name for UMD build
      fileName: (format) => `dissolveit.${format}.js`, // Output file name
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "three",
        "@react-three/fiber",
        "gl-noise",
        "three-custom-shader-material",
        "maath",
      ], // External dependencies
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          three: "THREE",
          "@react-three/fiber": "ReactThreeFiber",
          "gl-noise": "glNoise",
          "three-custom-shader-material": "CSM",
          maath: "maath",
        },
      },
    },
  },
});
