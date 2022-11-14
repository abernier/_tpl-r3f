import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";

import { useKeyboardControls } from "@react-three/drei";

import type { RigidBodyApi } from "@react-three/rapier";
import { Mesh, Vector3 } from "three";
import { folder, useControls } from "leva";

function Ball() {
  const { camera } = useThree();

  const [pos] = useState<Vector3>(new THREE.Vector3());
  const bodyRef = useRef<RigidBodyApi>(null);
  const meshRef = useRef<Mesh>(null);

  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const gui = useControls({
    Ball: folder(
      {
        radius: { value: 1, render: () => false },
        body: folder({
          restitution: 0.2,
          friction: 1,
          linearDamping: 0.5,
          angularDamping: 0.5,
        }),
        impulseStrength: 50,
        torqueStrength: 30,
        jumpStrength: 90,
      },
      { collapsed: true }
    ),
  });

  //
  // 🎮 arrows
  //

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = new THREE.Vector3(0, 0, 0);
    const torque = new THREE.Vector3(0, 0, 0);

    const impulseStrength = gui.impulseStrength * delta;
    const torqueStrength = gui.torqueStrength * delta;

    if (forward) {
      impulse.z = -1;
      torque.x = -1;
    }
    if (backward) {
      impulse.z = 1;
      torque.x = 1;
    }
    if (rightward) {
      impulse.x = 1;
      torque.z = -1;
    }
    if (leftward) {
      impulse.x = -1;
      torque.z = 1;
    }

    if (impulse.length() > 0) {
      impulse.applyMatrix4(camera.matrixWorld).sub(camera.position);
      impulse.normalize().setLength(impulseStrength);
      impulse.setY(0);
      // console.log("impulse", impulse);

      const { current: body } = bodyRef;
      body?.applyImpulse(impulse);
    }

    if (torque.length() > 0) {
      torque.applyMatrix4(camera.matrixWorld).sub(camera.position);
      torque.normalize().setLength(torqueStrength);
      torque.setY(0);
      // console.log("torque", torque);

      const { current: body } = bodyRef;
      body?.applyTorqueImpulse(torque);
    }
  });

  //
  // 🦘 jump
  //

  const jump = useCallback(() => {
    // console.log("jump");

    const { current: mesh } = meshRef;
    const { current: body } = bodyRef;
    if (mesh) {
      mesh.getWorldPosition(pos); // https://discourse.threejs.org/t/how-to-make-camera-follow-a-react-three-rapier-object/44405/5
      const origin = pos.clone();
      // console.log("origin", origin);

      origin.y -= gui.radius + 0.05;
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);
      const hit = world.raw().castRay(ray, 10, true);
      // console.log("hit", hit);

      if (body && hit && hit.toi < 0.15) {
        body.applyImpulse({ x: 0, y: gui.jumpStrength, z: 0 });
      }
    }
  }, [gui.jumpStrength, gui.radius, pos, rapier.Ray, world]);

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state: any) => state.jump,
      (value: boolean) => {
        if (value) jump();
      }
    );

    return () => {
      unsubscribeJump();
    };
  }, [subscribeKeys, jump]);

  return (
    <RigidBody
      ref={bodyRef}
      colliders="ball"
      restitution={gui.restitution}
      friction={gui.friction}
      linearDamping={gui.linearDamping}
      angularDamping={gui.angularDamping}
    >
      <mesh ref={meshRef} position={[0, gui.radius, 5]} castShadow>
        <icosahedronGeometry args={[gui.radius, 1]} />
        <meshStandardMaterial color="red" flatShading />
      </mesh>
    </RigidBody>
  );
}

export default Ball;
