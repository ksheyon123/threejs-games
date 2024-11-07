import * as THREE from "three";
import { makeMesh } from "@/utils/threejs";

export const createPlayer = (initial: THREE.Vector3) => {
  let currentPosition = initial;
  const player = makeMesh(1, 1, 1, 0xffff00, false);
  player.position.copy(currentPosition);

  const eventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    const tempP = currentPosition.clone();
    if (code === "KeyW") {
      tempP.add(new THREE.Vector3(0, 1, 0));
    }
    if (code === "KeyS") {
      tempP.add(new THREE.Vector3(0, -1, 0));
    }
    if (code === "KeyA") {
      tempP.add(new THREE.Vector3(-1, 0, 0));
    }
    if (code === "KeyD") {
      tempP.add(new THREE.Vector3(1, 0, 0));
    }

    if (!(tempP.x < -6.5 || tempP.x > 6.5)) {
      currentPosition.copy(tempP);
      player.position.copy(currentPosition);
    }
  };

  player.userData = {
    eventHandler,
  };

  return player;
};
