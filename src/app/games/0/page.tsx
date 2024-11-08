"use client";
import * as THREE from "three";

import { RefObject, useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  calMove,
  createCamera,
  createRenderer,
  createScene,
  makeMesh,
} from "@/utils/threejs";
import { Monster } from "@/models/threejs/Monster";
import { usePlayer } from "@/hooks/usePlayer";
import { Gauge } from "@/models/threejs/Gauge";
import { useMonster } from "@/hooks/useMonster";
import { usePoint } from "@/hooks/usePoint";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { create, jump, collisionChk, getLife, keyDownEvent, keyUpEvent } =
    usePlayer();
  const { create: createMonster } = useMonster();
  const { create: createPoint } = usePoint();

  useEffect(() => {
    console.log("IS LOADED");
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS MOUNTED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const gauge = new Gauge({ initHP: 10, maxHP: 10 });
      const g = gauge.create();
      g.position.set(-10, 5, 0);
      scene.add(g);

      const p = create(new THREE.Vector3(-10, 0, 0));
      scene.add(p);

      let intervalId = setInterval(() => {
        const rndTimer = Math.random() * 5000;
        const monster = createMonster(rndTimer);
        scene.add(monster);
      }, 1200);

      const { emerald, ambientLight, directionalLight } = createPoint();
      const group = new THREE.Group();

      group.add(emerald);
      group.add(ambientLight);
      group.add(directionalLight);

      scene.add(group);

      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);
        const list = scene.children.filter(
          (el: THREE.Mesh) => el.name === "monster"
        );
        controls.update();

        list.map((monster: THREE.Mesh, idx: number) => {
          const newPosition = calMove(
            monster,
            new THREE.Vector3(-1, 0, 0),
            0.2
          );
          if (newPosition.x < -10) {
            monster.removeFromParent();
          }
          monster.position.copy(newPosition);
          monster.userData.jump(monster);
        });

        // Player Control
        if (p.userData["KeyD"]) {
          const newPosition = calMove(p, new THREE.Vector3(1, 0, 0), 0.2);
          p.position.copy(newPosition);
        }
        if (p.userData["KeyA"]) {
          const newPosition = calMove(p, new THREE.Vector3(-1, 0, 0), 0.2);
          p.position.copy(newPosition);
        }
        jump();
        collisionChk(list);

        const life = getLife();
        gauge.update(life);
        renderer.render(scene, camera);
        emerald.rotation.y += 0.03;
      };

      animate();

      window.addEventListener("keydown", keyDownEvent);
      window.addEventListener("keyup", keyUpEvent);
      return () => {
        cancelAnimationFrame(id);
        clearInterval(intervalId);
        window.removeEventListener("keydown", keyDownEvent);
        window.removeEventListener("keyup", keyUpEvent);
      };
    }
  }, [isMounted]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div ref={canvasRef as RefObject<HTMLDivElement>} />
    </div>
  );
};

export default Page;
