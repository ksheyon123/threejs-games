"use client";
import * as THREE from "three";

import { RefObject, useEffect, useRef, useState } from "react";
import asphaltRoad from "@/assets/common/asphalt-road.png";
import sidewalkImg from "@/assets/common/sidewalk-pattern.png";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createCamera,
  createRenderer,
  createScene,
  makeMesh,
  makePlane,
} from "@/utils/threejs";
import { createCar } from "@/models/threejs/Car";
import { createPlayer } from "@/models/threejs/NewPlayer";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    console.log("IS LOADED");
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, -5, 10);
    cameraRef.current.lookAt(0, 0, 0);

    playerRef.current = makeMesh(1, 1, 1, 0xffff00, false);
    rendererRef.current = createRenderer();
    setIsMounted(true);
  }, []);

  const makeRoad = () => {
    const geometry = new THREE.PlaneGeometry(12, 2);
    const texture = new THREE.TextureLoader().load(asphaltRoad.src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.name = "road";
    return plane;
  };

  // prettier-ignore
  const makeSideWalk = () => {
    const z = 0.2
    const vertices = new Float32Array([
      -6, -2, z, // 0
      -6, -1, z, // 1
      6, -1, z,  // 2
      6, -2, z,  // 3
      -6, -1, 0,   // 4
      6, -1, 0,    // 5
    ]);
    
    const indices = new Uint16Array([
      // 첫 번째 사각형
      0, 1, 2, 0, 2, 3,
      // 두 번째 사각형 (주석 제거 시)
      1, 4, 5, 1, 2, 5,
    ]);
    
    // Define UV coordinates
    const uvs = new Float32Array([
      0, 1,  // 0
      0, 0,  // 1
      1, 0,  // 2
      1, 1,  // 3
      0, 0,  // 4
      1, 0   // 5
    ]);
    
    // BufferGeometry 생성 및 설정
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // xyz로 3개씩
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2)); // uv 좌표
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
    const texture = new THREE.TextureLoader().load(sidewalkImg.src, (e) => console.log("Event", e));
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0
    });
    const sidewalk = new THREE.Mesh(geometry, material);
    sidewalk.name = "sidewalk"
    return sidewalk
  };

  useEffect(() => {
    if (isMounted) {
      console.log("IS MOUNTED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const plane0 = makeRoad();
      const plane1 = makeRoad();
      const { x, y, z } = plane0.position.clone();
      plane1.position.set(x, y + 2, z);
      scene.add(plane0);
      scene.add(plane1);
      // Road Color : #6e6e6e

      const player = createPlayer(new THREE.Vector3(0, -1, 0));
      scene.add(player);

      const sidewalk = makeSideWalk();
      scene.add(sidewalk);

      const eventHandler = player.userData.eventHandler;

      const car = createCar(
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(0.1, 0, 0)
      );
      scene.add(car);
      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);

        car.userData.move();
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener("keypress", eventHandler);

      return () => {
        cancelAnimationFrame(id);
        window.removeEventListener("keypress", eventHandler);
      };
    }
  }, [isMounted]);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};

export default Page;
