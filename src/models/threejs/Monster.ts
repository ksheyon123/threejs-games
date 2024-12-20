import * as THREE from "three";
import { MonsterType } from "@/types/model.type";
import { makeMesh, makePlane } from "@/utils/threejs";

export class Monster {
  constructor(props: MonsterType) {
    this.velocity = props.velocity;
    this.w = props.w;
    this.h = props.h;
    this.position = props.position;
  }

  velocity: number = 1;
  w: number = 1;
  h: number = 1;
  obj: THREE.Mesh | null = null;
  position: THREE.Vector3 = new THREE.Vector3();
  isCreated: boolean = false;
  isJumping: boolean = false;
  isFalling: boolean = false;

  create(timer = 600) {
    const mesh = makePlane(this.w, this.h, 0x000000, false);
    mesh.name = "monster";
    this.obj = mesh;
    const { x, y, z } = this.position;
    this.obj.position.set(x, y, z);
    this.isCreated = true;

    mesh.userData = {
      move: this.move,
      jump: this.jump,
    };
    return mesh;
  }

  move(mesh: THREE.Vector3) {
    if (this.isCreated) {
      const { x, y, z } = this.obj!.position.clone();
      this.obj!.position.set(x - this.velocity, y, z);
    }
  }

  jump() {
    if (this.isCreated) {
      const { x, y, z } = this.obj!.position.clone();
      if (this.isJumping) {
        if (!this.isFalling) {
          if (y <= 2) {
            this.obj!.position.set(x, y + 0.1, z);
          } else {
            this.isFalling = true;
          }
        } else {
          if (y > 0) {
            this.obj!.position.set(x, y - 0.1, z);
          } else {
            this.obj!.position.set(x, 0, z);
            this.isJumping = false;
            this.isFalling = false;
          }
        }
      }
    }
  }

  delete() {
    if (this.isCreated) {
      this.obj!.removeFromParent();
      return this.obj!.uuid;
    }
  }
}
