import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 800);

const globalAmbientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(globalAmbientLight);


// Function to load a planet
function loadPlanet(path, mtlFile, objFile, scale, position, rotationSpeed) {
  const loader = new MTLLoader();
  loader.setPath(path);
  loader.load(mtlFile, (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath(path);
    objLoader.load(
      objFile,
      (object) => {
        object.scale.set(scale, scale, scale);
        object.position.set(position.x, position.y, position.z);

        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: child.material.color,
              map: child.material.map,
              emissive: 0x000000,
            });
          }
        });

        scene.add(object);

        function animate() {
          requestAnimationFrame(animate);
          object.rotation.y += rotationSpeed;
          renderer.render(scene, camera);
        }

        animate();
      },
      undefined,
      (error) => {
        console.error(`Error loading ${objFile}`, error);
      }
    );
  });
}

// Load planets
loadPlanet('mercury/', 'mercury.mtl', 'mercury.obj', 0.3, { x: 50, y: 20, z:  95}, 0.003);
loadPlanet('venus/', 'venus.mtl', 'venus.obj', 0.38, { x: 155, y: 83, z: 205 }, -0.003);
loadPlanet('earth/', 'earth.mtl', 'earth.obj', 0.35, { x: 195, y: 170, z: 395 }, 0.03);
loadPlanet('mars/', 'mars.mtl', 'mars.obj', 0.3, { x: 325, y: 265, z: 555 }, 0.025);
loadPlanet('jupiter/', 'jupiter.mtl', 'jupiter.obj', 0.3, { x: 362, y: 333, z: 715 }, 0.05);
loadPlanet('saturn/', 'saturn.mtl', 'saturn.obj', 0.3, { x: 475, y: 410, z: 847 }, 0.04);
loadPlanet('uranus/', 'uranus.mtl', 'uranus.obj', 0.3, { x: 520, y: 490, z: 1030 }, -0.03);
loadPlanet('neptune/', 'neptune.mtl', 'neptune.obj', 0.3, { x: 642, y: 573, z: 1178 }, 0.04);




// HELPERS
// // const light_helper = new THREE.PointLightHelper(pointLight)
// const grid_helper = new THREE.GridHelper(200, 50);
// scene.add(grid_helper)

// --- INSTANTIATE ORBIT CONTROLS --- passing cam and renderer as arguments
// listens to dom events on the mouse then adjusts the cam based on it
const controls = new OrbitControls(camera, renderer.domElement );
controls.rotateSpeed = 1;


// --- MAP HELPERS --- random generation
function addStar(){
  // 1. instantiate a sphere geometry/shape (radius)
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  // 2. material
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  // 3. geometry + material
  const star = new THREE.Mesh(geometry, material);

  // RANDOMLY POSITION STARS THROUGHOUT SCENE
  // randomly generate x, y, z value for each star | filling array w 3 values and map each value to 3js random float spread function (randomly -1 - 100)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)
}

// 200 values. then for each value, call add star function
Array(200).fill().forEach(addStar)

const space_texture = new THREE.TextureLoader().load('space.avif');
scene.background = space_texture;

// --- MOON ---
const moon_texture = new THREE.TextureLoader().load('moon.jpeg');
const crater_texture = new THREE.TextureLoader().load('crater.jpeg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshBasicMaterial({map: moon_texture, normalMap: crater_texture})
  
);
scene.add(moon);
moon.position.z = 30;
moon.position.x = -10;
// or moon.position.setX(-10);

// --- URANUS ---
const uranus_texture = new THREE.TextureLoader().load('uranus.webp');
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshBasicMaterial({map: uranus_texture})
);
scene.add(uranus);
uranus.position.z = -40;
uranus.position.x = -20;

// --- GRIZZ ---
const grizz_texture = new THREE.TextureLoader().load('grizz.JPG');
const grizz = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({map: grizz_texture})
);
scene.add(grizz);
grizz.position.z = 10;
grizz.position.x = 40;
grizz.position.y = 50;


// event handler for document.body.onscroll event
function moveCamera(){
  // calculate where the user is currently scrolled to
  // -- gives us dimensions of the viewport
  // top property will show us how far we are from the top of the webpage
  const top = document.body.getBoundingClientRect().top;
  // start changing properties when this is called ^
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  uranus.rotation.x += 0.05;
  uranus.rotation.y += 0.075;
  uranus.rotation.z += 0.05;
  // !!! change position of camera SCROLL
  // --- top value = always negative
  // --- change around for scroll animation
    camera.position.x = 30 + top * -0.1;    
    // js = right
    // top (-) * (-) = +, farther from screen
    camera.position.z = top * -0.2;
    camera.position.y = top * -0.1;
    camera.rotation.y = top * -0.05;
    console.log(camera.position);


}

// --- calls function everytime the user scrolls ---
document.body.onscroll = moveCamera
moveCamera();

// instead of calling renderer.render multiple times
// -- LOOP --
function animate(){
  requestAnimationFrame(animate);

  grizz.rotation.x += 0.01;
  grizz.rotation.y += 0.01;
  grizz.rotation.z += 0.01;



  
  controls.update();
  renderer.render(scene, camera);
}

animate()