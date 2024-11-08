import { makePlane } from "@/utils/threejs";
import { useRef } from "react";
import * as THREE from "three";

export const usePlayer = () => {
  let obj: THREE.Mesh | null = null;
  let life = 10;
  let point = 0;
  let isCreated = false;
  let isJumping = false;
  let isFalling = false;

  const keyActivated = useRef<any>();

  const create = (init?: THREE.Vector3) => {
    const mesh = makePlane(1, 1, 0xffff00, false);
    mesh.name = "player";
    isCreated = true;
    obj = mesh;

    const { x, y, z } = init || new THREE.Vector3();

    mesh.position.set(x, y, z);
    return mesh;
  };

  const keyDownEvent = (e: KeyboardEvent) => {
    const code = e.code;
    if (code === "Space") {
      if (!isJumping) {
        isJumping = true;
      }
    }
    if (obj) {
      const activeKey = keyActivated.current;
      keyActivated.current = {
        ...activeKey,
        [code]: true,
      };
      obj.userData = {
        ...keyActivated.current,
      };
    }
  };

  const keyUpEvent = (e: KeyboardEvent) => {
    const code = e.code;
    if (obj) {
      const activeKey = keyActivated.current;
      keyActivated.current = {
        ...activeKey,
        [code]: false,
      };
      obj.userData = {
        ...keyActivated.current,
      };
    }
  };

  const jump = () => {
    if (isCreated) {
      const { x, y, z } = obj!.position.clone();
      if (isJumping) {
        if (!isFalling) {
          if (y <= 2) {
            obj!.position.set(x, y + 0.25, z);
          } else {
            isFalling = true;
          }
        } else {
          if (y > 0) {
            obj!.position.set(x, y - 0.25, z);
          } else {
            obj!.position.set(x, 0, z);
            isJumping = false;
            isFalling = false;
          }
        }
      }
    }
  };

  const collisionChk = (list: THREE.Mesh[]) => {
    if (isCreated) {
      const box1 = new THREE.Box3().setFromObject(obj!);
      list.map((mesh: THREE.Mesh) => {
        const box2 = new THREE.Box3().setFromObject(mesh);
        const isCollided = box1.intersectsBox(box2);
        if (isCollided) {
          mesh.removeFromParent();
          life--;
        }
      });
    }
  };

  const getLife = () => {
    return life;
  };
  return {
    create,
    keyDownEvent,
    keyUpEvent,
    jump,
    collisionChk,
    getLife,
  };
};
