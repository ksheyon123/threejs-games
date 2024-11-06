import * as THREE from "three";
import { MonsterType } from "@/types/model.type";
import { makeMesh, makePlane } from "@/utils/threejs";

export class Monster {
  velocity: number = 1;
  w: number = 1;
  h: number = 1;
  obj: THREE.Mesh | null = null;
  position: THREE.Vector3 = new THREE.Vector3();
  isCreated: boolean = false;
  isJumping: boolean = false;

  constructor(props: MonsterType) {
    this.velocity = props.velocity;
    this.w = props.w;
    this.h = props.h;
    this.position = props.position;
  }

  create() {
    const mesh = makePlane(this.w, this.h, 0x000000, false);
    this.obj = mesh;
    const { x, y, z } = this.position;
    this.obj.position.set(x, y, z);
    this.isCreated = true;
    return mesh;
  }

  move() {
    if (this.isCreated) {
      const { x, y, z } = this.obj!.position.clone();
      this.obj!.position.set(x - 0.1, y, z);
    }
  }

  jump() {}

  delete() {
    if (this.isCreated) {
      this.obj!.removeFromParent();
    }
  }
}
