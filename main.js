import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import plants from './imgs/plants.jpg';
import sky from './imgs/sky.jpg';
import water from './imgs/water.jpg';
import brick from './imgs/brick.jpg';
import wood from './imgs/wood.jpg';
import stars from './imgs/stars.jpg';

/****************************** RENDERER **************************************/
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//scene
const scene = new THREE.Scene();

/****************************** CAMERA ****************************************/
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update(); //call update method every time camera position changes

camera.position.set(-10, 30, 30);

/******************************** GUI *****************************************/
const gui = new dat.GUI();

const options = {
  sphereColor: '#f7e3c2',
  sphereWireframe: false,
  torusWireframe: false,
  brickCubeWireframe: false,
  sphereBounceSpeed: 0.05,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
  decay: 0,
  spotLightColor: '#f5f582',
  planeColor: '#ffeeaa',
}

gui.add(options, 'sphereBounceSpeed', 0, .2); // min/max (set in animate fn)
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
gui.add(options, 'decay', 0, 2);

gui.addColor(options, 'sphereColor').onChange((evt)=>{
  sphere.material.color.set(evt)
});

gui.addColor(options, 'spotLightColor').onChange((evt)=>{
  spotLight.color.set(evt)
});

gui.add(options, 'sphereWireframe').onChange((evt)=>{
  sphere.material.wireframe = evt
});

gui.add(options, 'torusWireframe').onChange((evt)=>{
  torus.material.wireframe = evt
});

gui.add(options, 'brickCubeWireframe').onChange((evt)=>{
  brickCube.material.wireframe = evt
});

gui.addColor(options, 'planeColor').onChange((evt)=>{
  plane.material.color.set(evt)
});

/****************************** TEXTURES **************************************/
const textureLoader = new THREE.TextureLoader();

const plantTexture = textureLoader.load(plants);
const skyTexture = textureLoader.load(sky);
const woodTexture = textureLoader.load(wood);
const waterTexture = textureLoader.load(water);
const brickTexture = textureLoader.load(brick);
const starsTexture = textureLoader.load(stars);

scene.background = skyTexture;

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  sky, sky, sky, sky, sky, sky
]);

/****************************** OBJECTS ***************************************/
const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
const boxMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0x00ff00,
    wireframe: false,
    // map: plantTexture
  }
);

const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(45, 20, 0);
box.castShadow = true;
// box.receiveShadow = true;
const boxId = box.id;
console.log("boxId=", boxId);
scene.add(box);

const brickCubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const brickCubeMaterial = new THREE.MeshStandardMaterial({
  map: brickTexture,
  normalMap: starsTexture
});
const brickCube = new THREE.Mesh(brickCubeGeometry, brickCubeMaterial);
brickCube.castShadow = true;
brickCube.receiveShadow = true;
brickCube.position.set(-10, 20, 0);
// scene.add(brickCube);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);//radius, w, h
const sphereMaterial = new THREE.MeshStandardMaterial(
  {
    color: 'green',
    wireframe: false,
    // normalMap: woodTexture
  }
);

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphereId = sphere.id;
console.log("sphereId=", sphereId);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

const torusGeometry = new THREE.TorusGeometry(20, 4, 10, 75) ;
const torusMaterial = new THREE.MeshStandardMaterial(
  {
    color: 'dodgerBlue',
    wireframe: false,
    // normalMap: plantTexture
  }
);

// torusMaterial.map = waterTexture;

const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(-10, 20, 0);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

/** GROUP */

const group = new THREE.Group();
scene.add(group);

group.add(sphere, box);



/****************************** LIGHTS ****************************************/
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const pointLight = new THREE.PointLight(0xF1EB9C);
// scene.add(pointLight);
// pointLight.position.set(-40, 0, 5);

const ambientLight = new THREE.AmbientLight(0x404040);//soft white light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xf5f582);
scene.add(spotLight);
spotLight.position.set(-200, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2 //spotLight shadow is pixelated when angle is too wide

/******************************* PLANE ****************************************/
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial(
  {
    color: 0xffeeaa,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  }
);

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; //make plane match grid
plane.receiveShadow = true;

/******************************* HELPERS **************************************/
//grid
const gridHelper = new THREE.GridHelper(100, 50);
// scene.add(gridHelper);

//light helpers
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
//camera helpers
// const dLShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLShadowHelper);

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

/****************************** RAYCASTING ************************************/

//create a 2d vector to put 2vals of cursor position
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(evt){
  mousePosition.x = (evt.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = (evt.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();


/****************************** ANIMATION *************************************/
let step = 0;
// let speed = 0.01; //move speed of bounce to property in gui options obj

function animate(time) {
  // box.rotation.x = time / 1000;
  // box.rotation.y = time / 1000;
  // brickCube.rotation.x += .01;
  // brickCube.rotation.y += .05;
  // brickCube.rotation.z += .01;
  // sphere.rotation.x = time / 5000;
  // sphere.rotation.y = time / 5000;
  // sphere.rotation.z = time / 5000;
  torus.rotation.x += 0.025;
  torus.rotation.y += 0.05;
  torus.rotation.z += 0.01;
  // pointLight.position.set(Math.random(), 5, 5); //attempt at light flickering
  // pointLight.position.set(-20, 40, 5);

  //bouncing whatever is in the group -- sphere & cube
  step += options.sphereBounceSpeed;
  group.position.y = 20 * Math.abs(Math.sin(step));

  //raycaster (set two ends of ray -- camera & normalized cursor)
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  //select elements using uuid, id, or element name
  // console.log(intersects);

  for(let i = 0; i < intersects.length; i++){
   if(intersects[i].object.id === sphereId){
    sphereMaterial.color.setHex('0x0000ff');
    console.log("sphere material color", sphereMaterial.color)
   }
   if(intersects[i].object.id === boxId){
    boxMaterial.color.setHex('0xff0000');
    console.log("box color is now:", boxMaterial.color)
   }
  }

  //spotLight props
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLight.decay = options.decay;
  spotLightHelper.update();


  orbit.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);