import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

const wWidth = window.innerWidth;
const wHeight = window.innerHeight;
const fov = 100;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, wWidth / wHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(wWidth, wHeight);
renderer.setClearColor(0xffffff, 0.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

camera.position.set(6, 6, 8);
camera.updateProjectionMatrix();
camera.lookAt(0, 0, 0);

//Set up lights
const ambientLight = new THREE.AmbientLight(0x81a3f0, 2);
const spotLight = new THREE.SpotLight(0xfce303, 200);
spotLight.position.y = 10;
spotLight.distance = 100;
spotLight.angle = 0.3;
spotLight.penumbra = 1;
spotLight.castShadow = true;

const directionalLight1 = new THREE.DirectionalLight(0xf5e642, 1);
directionalLight1.position.set(4, 10, 2);
const directionalLight2 = new THREE.DirectionalLight(0xcffdff, 0.6);
directionalLight2.position.set(0, 4, -8);
const directionalLight3 = new THREE.DirectionalLight(0xfce303, 0.8);
directionalLight3.position.set(-4, 8, 4);
scene.add(directionalLight1, directionalLight2, directionalLight3);

scene.add(ambientLight, spotLight);

//Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 3; // Allows rotation from 0 to 180 degrees
// controls.minPolarAngle = Math.PI / 4


//Set up models
let floor = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.1, 10),
  new THREE.MeshPhongMaterial({ color: "#ddddff", reflectivity: 1 })
);
floor.position.y = 0.5;
floor.receiveShadow = true;
scene.add(floor);

//load the model
let model;
const loader = new GLTFLoader();
loader.load("../model/character.gltf", (gltf) => {
  model = gltf.scene;
  model.position.set(0.1, -2, -0.4);
  model.scale.set(2, 2, 2);
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(model);
});

//animate
let bounceSpeed = 0.02; // Speed of the bounce
let bounceHeight = 0.01; // Height of the bounce
let bounceTime = 0;

function animate() {
  bounceTime += bounceSpeed;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  let newY = Math.sin(bounceTime) * bounceHeight;
  model.position.y += newY;
  controls.update();
}

animate();

//Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
