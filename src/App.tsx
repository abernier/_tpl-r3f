import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import styled from "@emotion/styled";

import Layout from "./Layout";

import { Physics, Debug, RigidBody } from "@react-three/rapier";
import Ball from "./components/Ball";

function App() {
  return (
    <App.Styled>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows>
          <Physics>
            <Debug />

            <Layout />

            <RigidBody>
              <mesh castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="blue" />
              </mesh>
            </RigidBody>

            <Ball />

            {/* Ground */}
            <RigidBody type="fixed">
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position-y="-1"
                receiveShadow
              >
                <boxGeometry args={[100, 100, 0.01]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            </RigidBody>
          </Physics>
        </Canvas>
      </KeyboardControls>
    </App.Styled>
  );
}
App.Styled = styled.div`
  position: fixed;
  inset: 0;
`;

export default App;
