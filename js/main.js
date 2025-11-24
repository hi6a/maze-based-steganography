const scene = new THREE.Scene();
scene.background = new THREE.Color(0x37A8F0); 

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 300, 300);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; 
document.body.appendChild(renderer.domElement);


const controls = new THREE.OrbitControls(camera, renderer.domElement);


controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.4;
controls.zoomSpeed = 1.0;


controls.minDistance = 10;
controls.maxDistance = 300;


controls.maxPolarAngle = Math.PI / 2; 

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
sun.castShadow = true;
scene.add(sun);


scene.add(new THREE.AmbientLight(0xffffff, 0.6));

let wallModel, bushModel, trunkModel, treeModel;

const loader = new THREE.GLTFLoader();

function getModelHeight(model) {
  const box = new THREE.Box3().setFromObject(model);
  return box.max.y - box.min.y;
}

loader.load("../assets/Plane.glb", (gltf) => {
    obj = gltf.scene;
    obj.scale.set(30, 30, 30);
    obj.position.set(0,0,0);
    scene.add(obj);
  });

function loadModels(callback) {
  let loaded = 0;
  let total = 4;

  loader.load("../assets/GreenPlatform.glb", (gltf) => {
    wallModel = gltf.scene;
    wallModel.scale.set(5, 10, 5);

    if (++loaded === total) callback();
  });

  loader.load("../assets/Trunk.glb", (gltf) => {
    trunkModel = gltf.scene;
    trunkModel.scale.set(5,5, 5);
     const h = getModelHeight(wallModel);
  wallModel.userData.height = h;
    if (++loaded === total) callback();
  });

    loader.load("../assets/Bush.glb", (gltf) => {
    bushModel = gltf.scene;
    bushModel.scale.set(5,5, 5);
    if (++loaded === total) callback();
  });
  loader.load("../assets/SmallTree.glb", (gltf) => {
    treeModel = gltf.scene;
    treeModel.scale.set(5,5, 5);
    if (++loaded === total) callback();
  });
}



function placePropsForCell(r, c, bits) {
  const offsetX = -(COLS * CELL_SIZE) / 2;
  const offsetZ = -(ROWS * CELL_SIZE) / 2;

  const cellX = c * CELL_SIZE + offsetX;
  const cellZ = r * CELL_SIZE + offsetZ;


  let scale;
  if (bits[0] === "1") {
    scale = 10 + Math.random() * 5;
  } else {
    scale = 2 + Math.random() * 3;
  }

  const block = wallObjects[r][c];
  block.scale.set(5, scale, 5);
 //const h = getModelHeight(wallObjects[r][c]);
  block.position.set(cellX, 10, cellZ);

  if (bits[1] === "1") {
    const pick = Math.random() < 0.5 ? bushModel : trunkModel;
    const p = pick.clone();
    p.position.set(
      cellX - CELL_SIZE * 0.3,
      10,
      cellZ - CELL_SIZE * 0.3
    );
    p.scale.set(10, 10, 10);
    scene.add(p);
  }


  if (bits[2] === "1") {
    const p = bushModel.clone();
    p.position.set(
      cellX + CELL_SIZE * 0.3,
      10,
      cellZ - CELL_SIZE * 0.3
    );
    p.scale.set(8, 8, 8);
    scene.add(p);
  }


  if (bits[3] === "1") {
    const p = treeModel.clone();
    p.position.set(cellX, 10, cellZ);
    p.scale.set(8, 8, 8);
    scene.add(p);
  }
}

function buildMaze3D() {
  const offsetX = -(COLS * CELL_SIZE) / 2;
  const offsetZ = -(ROWS * CELL_SIZE) / 2;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {

      let block;
      if (maze[r][c] === 1) {
        block = wallModel.clone();
        wallObjects[r][c] = block;
      } else {
        block = trunkModel.clone();
      }
      getModelHeight(wallModel)
  const h = block.userData.height;
      block.position.set(
        c * CELL_SIZE + offsetX,
        h,
        r * CELL_SIZE + offsetZ
      );

      block.rotation.y = 0; 

      scene.add(block);
    }
  }
  for(let i=0; i<chunkedBits.length; i++){
    placePropsForCell(hiddenCells[i][0],hiddenCells[i][1], chunkedBits[i]);
  }
}


function animate() {
  requestAnimationFrame(animate);
  controls.update(); 
  renderer.render(scene, camera);


}
animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
