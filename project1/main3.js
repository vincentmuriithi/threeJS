import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var headings  = document.querySelector("#headings");
headings.style.display = "none";
var holder = document.querySelector("#holder");
holder.style.display = "none";
const container = document.querySelector("#container");
container.style.display = "none";
let loader = $("#loader");
loader.css({"display" : "flex", 
"text-align" : "center", 
"width" : `${window.innerWidth}px`, 
"height" : "100vh",
"align-items" : "center",
"justify-content": "center",
"background-color": "red",
"border-width" : "0",
border: "none",
"flex-direction" : "column"
});


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({alpha : true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 0.25;
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({color : 0xff5645});
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

//adding floor texture 
const floortexture = new THREE.TextureLoader().load("floor1.jpg");
floortexture.wrapS = THREE.RepeatWrapping;
floortexture.wrapT = THREE.RepeatWrapping;
floortexture.repeat = new THREE.Vector2(15, 15);

//floor geometry
const floorgeometry = new THREE.PlaneGeometry(40, 40);
const floormaterial = new THREE.MeshBasicMaterial({map : floortexture});
const floorplane = new THREE.Mesh(floorgeometry, floormaterial);
floorplane.rotation.x = -Math.PI/2;
//scene.add(floorplane);
//lights
const hemispherelight = new THREE.HemisphereLight(0xff0000, 0x0000fc, 1)
scene.add(hemispherelight);
const directionLight = new THREE.DirectionalLight(0xffffff, 1);
directionLight.position.set(0, 120, 0);
directionLight.castShadow = true;
//scene.add(directionLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let environ_promise = new Promise((resolve, reject) =>{
//ADDING environment/surroundigs
const environment = new RGBELoader();
environment.load(
"christmas_photo_studio_05_2k.hdr",
(environmentMap) => {
resolve(environmentMap)
},
(environload) => console.log((environload.loaded/environload.total) * 100 + "% loaded"),
(error) => reject(error)

);
})

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

//using promise to wait for the model to be loaded
let gltfpromise = new Promise((resolve, reject) =>{
let gltfloader = new GLTFLoader();
gltfloader.load(
"/nike_air_zoom_pegasus_36/scene.gltf",
(gltf) => {
const model = gltf.scene;
resolve(model);
},
(xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
(error) => {
console.log("An error occurred when trying to load the model" + error)
reject(error);
}
);
});

Promise.all([environ_promise, gltfpromise])
.then(
([environmentMap, model]) =>{
environmentMap.mapping = THREE.EquirectangularReflectionMapping;
scene.background = environmentMap;
scene.environment = environmentMap;
scene.add(model);
loader.css("display", "none");
holder.style.display = "block";
headings.style.display = "block";
container.style.display = "block";
}
)
.catch(
(error1, error2) =>{
if (error1) console.log(error1)
if (error2) console.log(error2)
}
)


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




