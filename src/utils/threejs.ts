import * as THREE from "three";

/**
 * @description Renderer 객체를 생성합니다.
 * @param width 렌더링 영역의 폭
 * @param height 렌더링 영역의 높이
 * @param color (optional) default 0xFFFFFF 렌더링 영역의 색상을 지정합니다.
 * @returns ThreeJs Renderer 객체
 */
export const createRenderer = (
  width?: number,
  height?: number,
  color?: number
) => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width || window.innerWidth, height || window.innerHeight);
  renderer.setClearColor(color || 0xffffff);
  return renderer;
};

/**
 * @description Perspective Camera 객체를 생성합니다.
 * @returns Perspective Camera Object
 */
export const createCamera = (width?: number, height?: number) => {
  const camera = new THREE.PerspectiveCamera(
    75, // 카메라 시야각
    (width || window.innerWidth) / (height || window.innerHeight), // 카메라 비율
    0.1, // Near
    1000 // Far
  );
  return camera;
};

/**
 * @description Scene 객체를 생성합니다.
 * @returns ThreeJs Scene 객체
 */
export const createScene = () => {
  const scene = new THREE.Scene();
  return scene;
};

export const makeCone = () => {
  const geometry = new THREE.ConeGeometry(0.2, 1, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cone = new THREE.Mesh(geometry, material);
  return cone;
};

export const makePlane = (
  w: number,
  h: number,
  color?: number,
  wire = true
) => {
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshBasicMaterial({
    color: color || 0x000000,
    wireframe: wire,
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};

export const makeMesh = (
  width?: number,
  height?: number,
  depth?: number,
  color?: number,
  wire = true
) => {
  const geometry = new THREE.BoxGeometry(width || 5, height || 5, depth || 5);
  const material = new THREE.MeshBasicMaterial({
    color: color || 0x000000,
    wireframe: wire,
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};

export const makeCylinder = (
  radius?: number,
  height?: number,
  seg?: number,
  color?: number
) => {
  const geometry = new THREE.CylinderGeometry(
    radius || 5,
    radius || 5,
    height || 20,
    seg || 32
  );

  const material = new THREE.MeshBasicMaterial({ color: color || 0xffff00 });
  const cylinder = new THREE.Mesh(geometry, material);

  return cylinder;
};

export const makeSphere = (
  radius?: number,
  seg?: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number
) => {
  const geometry = new THREE.SphereGeometry(
    radius || 5,
    seg || 32,
    seg || 32,
    phiStart || 0,
    phiLength || 2 * Math.PI,
    thetaStart || 0,
    thetaLength || Math.PI
  );
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
};
