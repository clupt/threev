import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


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

//gui
const gui = new dat.GUI();

const options = {
  sphereColor: '#ffea00',
  sphereWireframe: false,
  torusWireframe: false
}

gui.addColor(options, 'sphereColor').onChange((evt)=>{
  sphere.material.color.set(evt)
});

gui.add(options, 'sphereWireframe').onChange((evt)=>{
  sphere.material.wireframe = evt
});

gui.add(options, 'torusWireframe').onChange((evt)=>{
  torus.material.wireframe = evt
});

//textures
const textureLoader = new THREE.TextureLoader();

const plantTexture = textureLoader.load('plants.jpg');
const woodTexture = textureLoader.load('wood.jpg');
const waterTexture = textureLoader.load('water.jpg');
const brickTexture = textureLoader.load('brick.jpg');

//objects
const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
const boxMaterial = new THREE.MeshBasicMaterial(
  {
    color: 0x00ff00,
    wireframe: false,
    map: plantTexture
  }
);

const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);
// box.position.set(-25, 20, 0)

const sphereGeometry = new THREE.SphereGeometry(10, 60, 60);//radius, w, h
const sphereMaterial = new THREE.MeshStandardMaterial(
  {
    color: 'tomato',
    wireframe: false,
    normalMap: waterTexture
  }
);

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-5, 10, 0);

const torusGeometry = new THREE.TorusGeometry(14, 4, 10, 75) ;
const torusMaterial = new THREE.MeshStandardMaterial(
  {
    color: 'bisque',
    wireframe: false,
    normalMap: plantTexture
  }
);

const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);
torus.position.set(-5, 10, 0);


//lights
const pointLight = new THREE.PointLight(0xF1EB9C);
pointLight.position.set(-40, 0, 5);

const ambientLight = new THREE.AmbientLight(0x404040);//soft white light
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial(
  {
    color: 'chartreuse',
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  }
);
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //make plane match grid

const gridHelper = new THREE.GridHelper(100, 50);
scene.add(gridHelper);



function animate(time) {
  // box.rotation.x = time / 1000;
  // box.rotation.y = time / 1000;
  sphere.rotation.x = time / 5000;
  sphere.rotation.y = time / 5000;
  sphere.rotation.z = time / 5000;
  torus.rotation.x = time / 500;
  torus.rotation.y = time / 500;
  torus.rotation.z = time / 2500;
  // pointLight.position.set(Math.random(), 5, 5); //attempt at light flickering
  pointLight.position.set(-20, 40, 5);
  orbit.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);