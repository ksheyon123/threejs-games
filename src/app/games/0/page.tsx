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
import { Player } from "@/models/threejs/Player";
import { Gauge } from "@/models/threejs/Gauge";

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
    cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer();
    const player = new Player({});
    playerRef.current = player;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS MOUNTED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const player = playerRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const gauge = new Gauge({ initHP: 10, maxHP: 10 });
      const g = gauge.create();
      g.position.set(0, 5, 0);
      scene.add(g);

      const p = player.create(new THREE.Vector3(-10, 0, 0));
      scene.add(p);

      let monsters: Monster[] = [];
      let intervalId = setInterval(() => {
        const vel = Math.random() / 2;
        monster = new Monster({
          velocity: vel,
          w: 1,
          h: 1,
          position: new THREE.Vector3(10, 0, 0),
        });
        const m = monster.create();
        scene.add(m);
        monsters.push(monster);
      }, 600);

      let id: any;
      let monster: any;
      const animate = () => {
        const list = scene.children.filter(
          (el: THREE.Mesh) => el.name === "monster"
        );
        if (list.length === 0) {
        }
        controls.update();

        monsters.map((monster: Monster, idx: number) => {
          monster.move();
          monster.jump();
          if (monster.obj!.position.x < -10) {
            monster.delete();
          }
        });

        player.jump();
        player.collisionChk(list);

        const life = player.getLife();
        gauge.update(life);
        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      const player = playerRef.current;
      const keyboardEvent = (e: KeyboardEvent) => {
        const code = e.code;
        if (code === "Space") player!.space();
      };
      window.addEventListener("keypress", keyboardEvent);
      return () => {
        window.removeEventListener("keypress", keyboardEvent);
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
