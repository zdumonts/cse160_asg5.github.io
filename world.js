/*
Zander Dumont-Strom
zdumonts@ucsc.edu

Extras:
  - Fog
  - Shadows
  - Transparent Meshes
*/

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {MTLLoader} from "three/addons/loaders/MTLLoader.js";

const scene = new THREE.Scene();

// fog
const n = 1;
const f = 5;
const color = 'white';
scene.fog = new THREE.Fog(color, n, f);
scene.background = new THREE.Color(color);

// camera
const fov = 75;
const aspect = 2; 
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(800, 400);
document.body.appendChild(renderer.domElement);

// camera controls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 2;
controls.update();

// texture
const loader = new THREE.TextureLoader();
const texture = loader.load( 'resources/dirt.jpg' );
const texture2= loader.load( 'resources/grass.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;
texture2.colorSpace = THREE.SRGBColorSpace;

// skybox
const texture1 = loader.load(
    'resources/skybox.jpg',
    () => {
      texture1.mapping = THREE.EquirectangularReflectionMapping;
      texture1.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture1;
});

// box
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshPhongMaterial({ 
    map: texture,
});
const cube = new THREE.Mesh(geometry, material);
cube.position.z = -1;
cube.receiveShadow = true;
cube.castShadow = true;
scene.add(cube);

// transparent box
const transparent_material = new THREE.MeshPhongMaterial({
    color:0x592693,
    opacity: 0.5,
    transparent: true,
});
const transparent_cube = new THREE.Mesh(geometry, transparent_material);
transparent_cube.position.x = -2;
transparent_cube.position.y = -1;
scene.add(transparent_cube);

function maketCube(x,y,z) {
    const transparent_material = new THREE.MeshPhongMaterial({
        color:0xd8863b,
        opacity: 0.5,
        transparent: true,
    });
   
    const cube = new THREE.Mesh(geometry, transparent_material);
    cube.receiveShadow = true;
    scene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
   
    return cube;
}

maketCube(2,-1,-1);
maketCube(-2,-1,-2);

function makeCube(x,y,z) {
    const material = new THREE.MeshPhongMaterial({map: texture2,});
   
    const cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    scene.add(cube);
   
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
   
    return cube;
}

// floor
for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
        makeCube(i-4,-2,j-4);
    }
}

// sphere
const sphereRadius = 0.5;
const sphereWidthDivisions = 32;
const sphereHeightDivisions = 16;
const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere.position.set(-2, 0, -2);
scene.add(sphere);

// cone
const coneGeo = new THREE.ConeGeometry(0.5, 1, 32); 
const coneMat = new THREE.MeshPhongMaterial({color: 0xDBF3C9});
const cone = new THREE.Mesh(coneGeo, coneMat); 
cone.position.set(2, 0, -1);
cone.castShadow = true;
cone.receiveShadow = true;
scene.add(cone);

// light 
const directional_light = new THREE.DirectionalLight(0xFFFFFF, 2);
directional_light.position.set(4, 8, 4);
directional_light.castShadow = true
scene.add(directional_light);

// light 2
const point_light = new THREE.PointLight(0xFF0000, 0.3);
point_light.position.set(0,-1,0);
scene.add(point_light);

// light 3
const ambient_light = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambient_light);

// cat
let catModel = null;
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.load('resources/cat.mtl', (mtl) => {
    mtl.preload();
    for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
    }
    objLoader.setMaterials(mtl);
    objLoader.load('resources/cat.obj', (root) => {
        root.scale.set(0.03,0.03,0.03);
        root.rotation.set(-1.57,0,0);
        root.position.set(-2,-0.5,0);
        scene.add(root);
        catModel = root;
    });
});
 
function render(time) {
    time *= 0.001;  
   
    cube.rotation.x = time;
    cube.rotation.y = time;
    if (catModel) {
        catModel.rotation.z += 0.01;
    }
   
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update(); 
}

requestAnimationFrame(render);
