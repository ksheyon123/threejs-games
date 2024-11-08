import { makeMesh } from "@/utils/threejs";
import * as THREE from "three";

export const usePoint = () => {
  const create = () => {
    const emeraldGeometry = new THREE.BufferGeometry();
    // prettier-ignore
    const vertices = new Float32Array([
        0, 1.118, 0,       // 0: Top vertex
        -0.5, 0.5, 0.5,    // 1: Top half base vertices
        0.5, 0.5, 0.5,     // 2
        0.5, 0.5, -0.5,    // 3
        -0.5, 0.5, -0.5,   // 4
        -0.5, -0.5, 0.5,   // 5: Bottom half base vertices
        0.5, -0.5, 0.5,    // 6
        0.5, -0.5, -0.5,   // 7
        -0.5, -0.5, -0.5,  // 8
        0, -1.118, 0       // 9: Bottom vertex
    ]);
    // prettier-ignore
    const indices = new Uint16Array([
      // Top faces
      0, 1, 2, 
      0, 2, 3, 
      0, 3, 4, 
      0, 4, 1,
      // Middle side faces
      1, 5, 6, 
      1, 6, 2, 
      2, 6, 7, 
      2, 7, 3,
      3, 7, 8, 
      3, 8, 4, 
      4, 8, 5,
      4, 5, 1,
      // Bottom faces
      9, 5, 6, 
      9, 6, 7, 
      9, 7, 8, 
      9, 8, 5,

      5, 8, 7,
      5, 7, 6 // fill
    ]);

    emeraldGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    emeraldGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    emeraldGeometry.computeVertexNormals();
    const emeraldMaterial = new THREE.MeshPhongMaterial({
      color: 0x50c877,
      shininess: 100,
      specular: 0x444444,
      transparent: true,
    });

    // // Create mesh
    const emerald = new THREE.Mesh(emeraldGeometry, emeraldMaterial);
    emerald.scale.set(0.3, 0.3, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-2, 2, 2);

    const ambientLight = new THREE.AmbientLight(0x404040);

    return { emerald, directionalLight, ambientLight };
  };

  return { create };
};
