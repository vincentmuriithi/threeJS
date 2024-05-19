import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById("container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({alpha : true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({color : 0xff5645});
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(0, 120, 0);
directionLight.castShadow = true;
scene.add(directionLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.zoomSpeed = 0.5;
controls.enablePan = true;
const objloader = () => {
const loader = new OBJLoader();
loader.load(
"254wpsxi5728-2/shoe orange/shoe.obj",
function (object) {scene.add(object)},
(xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
(error) => console.log("An error occurred when trying to load the model" + error)
);
};

const gltfLoader = () => {
let gltfloader = new GLTFLoader();
gltfloader.load(
"adidas_ozweego/scene.gltf",
(gltf) => {
const model = gltf.scene;
scene.add(model);
},
(xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
(error) => console.log("An error occurred when trying to load the model" + error)
);

};

gltfLoader();


const animate = () => {
requestAnimationFrame(animate);
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
controls.update();
renderer.render(scene, camera);

};

animate();

window.addEventListener("resize", ()=>{
camera.aspect = window.inner / window.innerHeight;
camera.updateProjectionMatrix();
renderer.render(scene, camera);
});




