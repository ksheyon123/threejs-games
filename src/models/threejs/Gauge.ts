import * as THREE from "three";
import { makeGuage } from "@/utils/threejs";

export class Gauge {
  obj: THREE.Group | null = null;
  isCreated: boolean = false;
  maxHP: number = 0;
  currentHP: number = 0;
  constructor(props: any) {
    this.currentHP = props.initHP;
    this.maxHP = props.maxHP;
  }

  create() {
    const mesh = makeGuage(this.currentHP, this.maxHP);
    console.log(mesh);
    mesh.name = "hp-gauge";
    this.obj = mesh;
    this.isCreated = true;
    return mesh;
  }

  update(life: number) {
    if (this.isCreated) {
      const [_, hpBar] = this.obj!.children;
      hpBar.scale.x = Math.max(0, life / this.maxHP); // 0에서 maxHP 사이로 유지
      (hpBar as any).material.color.set(
        life > this.maxHP * 0.5 ? 0x00ff00 : 0xff0000
      ); // 체력에 따라 색상 변경
      this.currentHP = life;
    }
  }
}
