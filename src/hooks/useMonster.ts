import * as THREE from "three";
import { makePlane } from "@/utils/threejs";

export const useMonster = () => {
  const create = (timer = 2000) => {
    const monster = makePlane(1, 1, 0x000000);
    monster.name = "monster";
    monster.position.set(10, 0, 0);
    monster.userData = {
      isJumping: false,
      isFalling: false,
      timer,
      jump,
    };

    setTimeout(() => {
      monster.userData.isJumping = true;
    }, timer);

    return monster;
  };

  const jump = (monster: THREE.Mesh) => {
    const { x, y, z } = monster.position.clone();
    const isJumping = monster.userData.isJumping;
    const isFalling = monster.userData.isFalling;
    if (isJumping) {
      if (!isFalling) {
        if (y <= 2) {
          monster.position.set(x, y + 0.1, z);
        } else {
          monster.userData.isFalling = true;
        }
      } else {
        if (y > 0) {
          monster.position.set(x, y - 0.1, z);
        } else {
          monster.position.set(x, 0, z);
          monster.userData.isJumping = false;
          monster.userData.isFalling = false;
        }
      }
    }
  };

  return { create };
};
