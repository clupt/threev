import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update(); //call update method every time camera position changes


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);

//textures
const textureLoader = new THREE.TextureLoader();
const plantTexture = textureLoader.load(
  'plants.jpg'
);
const woodTexture = textureLoader.load(
  'wood.jpg'
)

//objects
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial(
  {
    color: 0x00ff00,
    wireframe: false,
    map: plantTexture
  }
);

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);//radius, w, h
const sphereMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0xffffff,
    wireframe: false,
    map: woodTexture
  }
);

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);


//lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0x404040);//soft white light
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial(
  {
    color: 0xaaaaff,
    side: THREE.DoubleSide
  }
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //make plane match grid

const gridHelper = new THREE.GridHelper(50,50);
scene.add(gridHelper);



function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;
  sphere.rotation.x = time / 1000;
  sphere.rotation.y = time / 1000;
  // pointLight.position.set(Math.random(), 5, 5); //attempt at light flickering

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);