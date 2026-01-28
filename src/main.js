import "./style.css";
import * as THREE from "three";
import { GUI } from "lil-gui";
import chroma from "chroma-js";

const app = document.getElementById("app");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101014);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 10, 14);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
app.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const params = {
  floors: 30,
  floorHeight: 0.3,
  baseSize: 3,
  topSize: 1.2,
  twistMin: 0,
  twistMax: Math.PI * 2,
  scaleMin: 1,
  scaleMax: 0.6,
  colorBottom: "#3b82f6",
  colorTop: "#f97316"
};

let towerGroup = new THREE.Group();
scene.add(towerGroup);

function buildTower() {
  scene.remove(towerGroup);
  towerGroup.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });
  towerGroup = new THREE.Group();

  const height = params.floors * params.floorHeight;
  const colorScale = chroma.scale([params.colorBottom, params.colorTop]).mode("lab");

  for (let i = 0; i < params.floors; i++) {
    const t = params.floors <= 1 ? 0 : i / (params.floors - 1);
    const twist = THREE.MathUtils.lerp(params.twistMin, params.twistMax, t);
    const scale = THREE.MathUtils.lerp(params.scaleMin, params.scaleMax, t);
    const size = THREE.MathUtils.lerp(params.baseSize, params.topSize, t) * scale;

    const geom = new THREE.BoxGeometry(size, params.floorHeight, size);
    const mat = new THREE.MeshStandardMaterial({ color: colorScale(t).hex() });
    const slab = new THREE.Mesh(geom, mat);
    slab.position.y = i * params.floorHeight - height / 2 + params.floorHeight / 2;
    slab.rotation.y = twist;
    towerGroup.add(slab);
  }

  scene.add(towerGroup);
}

const gui = new GUI();
const f1 = gui.addFolder("Structure");
f1.add(params, "floors", 1, 200, 1).onChange(buildTower);
f1.add(params, "floorHeight", 0.05, 1, 0.01).onChange(buildTower);
f1.add(params, "baseSize", 0.5, 10, 0.1).onChange(buildTower);
f1.add(params, "topSize", 0.2, 10, 0.1).onChange(buildTower);
const f2 = gui.addFolder("Twist/Scale");
f2.add(params, "twistMin", -Math.PI * 4, Math.PI * 4, 0.01).onChange(buildTower);
f2.add(params, "twistMax", -Math.PI * 4, Math.PI * 4, 0.01).onChange(buildTower);
f2.add(params, "scaleMin", 0.1, 2, 0.01).onChange(buildTower);
f2.add(params, "scaleMax", 0.1, 2, 0.01).onChange(buildTower);
const f3 = gui.addFolder("Color");
f3.addColor(params, "colorBottom").onChange(buildTower);
f3.addColor(params, "colorTop").onChange(buildTower);

buildTower();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
