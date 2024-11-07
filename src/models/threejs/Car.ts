import * as THREE from "three";
import { makeMesh } from "@/utils/threejs";

export const createCar = (initial: THREE.Vector3, vel: THREE.Vector3) => {
  let currentPosition = initial;
  const car = makeMesh(1, 1, 1, 0x000000, false);
  car.position.copy(initial);

  const move = () => {
    currentPosition = initial.add(vel);
    if (currentPosition.x > 6.5 || currentPosition.x < -6.5) {
      car.removeFromParent();
    }
    car.position.copy(currentPosition);
  };
  car.userData = {
    move,
  };
  return car;
};
