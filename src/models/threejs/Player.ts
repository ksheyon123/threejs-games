import { makePlane } from "@/utils/threejs";
import * as THREE from "three";

export class Player {
  constructor(props: any) {}

  obj: THREE.Mesh | null = null;
  life = 10;
  point = 0;
  isCreated = false;
  isJumping = false;
  isFalling = false;

  create(init?: THREE.Vector3) {
    const mesh = makePlane(1, 1, 0xffff00, false);
    mesh.name = "player";
    this.isCreated = true;
    this.obj = mesh;

    const { x, y, z } = init || new THREE.Vector3();

    mesh.position.set(x, y, z);
    return mesh;
  }

  space() {
    if (!this.isJumping) {
      this.isJumping = true;
    }
  }

  jump() {
    if (this.isCreated) {
      const { x, y, z } = this.obj!.position.clone();
      if (this.isJumping) {
        if (!this.isFalling) {
          if (y <= 2) {
            this.obj!.position.set(x, y + 0.2, z);
          } else {
            this.isFalling = true;
          }
        } else {
          if (y > 0) {
            this.obj!.position.set(x, y - 0.2, z);
          } else {
            this.obj!.position.set(x, 0, z);
            this.isJumping = false;
            this.isFalling = false;
          }
        }
      }
    }
  }

  collisionChk(list: THREE.Mesh[]) {
    if (this.isCreated) {
      const box1 = new THREE.Box3().setFromObject(this.obj!);
      list.map((mesh: THREE.Mesh) => {
        const box2 = new THREE.Box3().setFromObject(mesh);
        const isCollided = box1.intersectsBox(box2);
        if (isCollided) {
          mesh.removeFromParent();
          this.life--;
        }
      });
    }
  }

  getLife() {
    return this.life;
  }
}
