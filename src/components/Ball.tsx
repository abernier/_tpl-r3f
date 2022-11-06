import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import type { RigidBodyApi } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";

function Ball({}) {
  const bodyRef = useRef<RigidBodyApi>(null);
  const [getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const strength = 50;
    const impulseStrength = strength * delta;
    const torqueStrength = strength * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    const { current: body } = bodyRef;
    body?.applyImpulse(impulse);
    body?.applyTorqueImpulse(torque);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh position={[0, 2, 5]} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="red" flatShading />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
