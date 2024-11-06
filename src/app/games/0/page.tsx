"use client";
import * as THREE from "three";

import { RefObject, useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  createCamera,
  createRenderer,
  createScene,
  makeMesh,
} from "@/utils/threejs";
import { Monster } from "@/models/threejs/Monster";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const monster = new Monster({
        velocity: 1,
        w: 1,
        h: 1,
        position: new THREE.Vector3(10, 0, 0),
      });

      const m = monster.create();
      scene.add(m);

      let id: any;
      const animate = () => {
        controls.update();

        monster.move();
        monster.jump();

        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
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
