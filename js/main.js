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

const ambient = new THREE.AmbientLight(0xffffff, 0.6) 
scene.add(ambient);

let planeModel, wallModel, bushModel, trunkModel, treeModel, endModel, bgModel1,bgModel2,bgModel3;

const loader = new THREE.GLTFLoader();

function getModelHeight(model) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  return box.max.y - box.min.y;
}


function loadModels(callback) {
  let loaded = 0;
  let total = 9;

loader.load("../assets/Plane.glb", (gltf) => {
    planeModel = gltf.scene;
    planeModel.scale.set(30, 30, 30);
    planeModel.position.set(0,0,0);
    if (++loaded === total) callback();
  });


  loader.load("../assets/GreenPlatform.glb", (gltf) => {
    wallModel = gltf.scene;
    wallModel.scale.set(5, 10, 5);
    const h = getModelHeight(wallModel);
    //const h =10;
   wallModel.userData.height = h;
    if (++loaded === total) callback();
  });

  loader.load("../assets/Trunk.glb", (gltf) => {
    trunkModel = gltf.scene;
    trunkModel.scale.set(5,5, 5);

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

    loader.load("../assets/Castle.glb", (gltf) => {
    endModel = gltf.scene;
    endModel.scale.set(10,10, 10);
    if (++loaded === total) callback();
  });
      loader.load("../assets/bg1.glb", (gltf) => {
    bgModel1 = gltf.scene;
    bgModel1.scale.set(15,15,15);
    if (++loaded === total) callback();
  });
    loader.load("../assets/bg2.glb", (gltf) => {
    bgModel2 = gltf.scene;
    bgModel2.scale.set(10,10,10);
    if (++loaded === total) callback();
  });

      loader.load("../assets/bg3.glb", (gltf) => {
    bgModel3 = gltf.scene;
    bgModel3.scale.set(10,10,10);
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
    scale = 15+ Math.random() * 5;
  } else {
    scale = 7 + Math.random() * 7;
  }
  const block = wallObjects[r][c];
  if(!block){ return};
  block.scale.set(5, scale, 5);

let  h0 = getModelHeight(wallObjects[r][c]);

 //const h0=10;
//  console.log(h0)
  block.position.set(cellX, Math.floor(h0), cellZ);

  if (bits[1] === "1") {
    const pick = Math.random() < 0.5 ? bushModel : trunkModel;
    const p = pick.clone();
    p.position.set(
      cellX - CELL_SIZE * 0.3,
     Math.floor(h0),
      cellZ - CELL_SIZE * 0.3
    );
    p.scale.set(15, 15, 15);
    scene.add(p);
  }


  if (bits[2] === "1") {
    const p = treeModel.clone();
    p.position.set(
      cellX + CELL_SIZE * 0.3,
      Math.floor(h0),
      cellZ - CELL_SIZE * 0.3
    );
    p.scale.set(10, 10, 10);
    scene.add(p);
  }


  if (bits[3] === "1") {
    const p = bushModel.clone();
    p.position.set( cellX + CELL_SIZE * 0.2,Math.floor(h0),   cellZ + CELL_SIZE * 0.2);
    p.scale.set(12, 12, 12);
    scene.add(p);
  }
}

function buildMaze3D() {
  scene.add(planeModel);
  const offsetX = -(COLS * CELL_SIZE) / 2;
  const offsetZ = -(ROWS * CELL_SIZE) / 2;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {

      let block;
      if (maze[r][c] === 1) {
        block = wallModel.clone();
        wallObjects[r][c] = block;
        h = block.userData.height;
      block.position.set(
        c * CELL_SIZE + offsetX,
        h,
        r * CELL_SIZE + offsetZ
      );

      block.rotation.y = 0; 

      scene.add(block); 
      } else {
        wallObjects[r][c] = null;

      if(r===ROWS -2 && c === COLS -1){
end = endModel.clone();
end.position.set( (c +2)* CELL_SIZE + offsetX, 0,  r * CELL_SIZE + offsetZ);
end.scale.set(15,15,15);
scene.add(end);
      }
    }
  }
}
  for(let i=0; i<chunkedBits.length; i++){
    placePropsForCell(hiddenCells[i][0],hiddenCells[i][1], chunkedBits[i]);
  }
}

function addBgProps(){
bgModel1.position.set(-CELL_SIZE*COLS*0.7,-5,-ROWS*CELL_SIZE*0.7);
bgModel2.position.set(0,0,-CELL_SIZE * ROWS * 0.7);
bgModel3.position.set(CELL_SIZE * COLS * 0.8,0,-CELL_SIZE * ROWS * 0.7);
bgModel4 = bgModel2.clone();
bgModel4.scale.set(5,5,5);
bgModel4.position.set(-CELL_SIZE*COLS*0.5,0,-CELL_SIZE * ROWS * 0.2);
scene.add(bgModel2);
scene.add(bgModel1);
scene.add(bgModel3);
scene.add(bgModel4);
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

function clearScene(){
for(let i= scene.children.length; i>0; i--){
  if(scene.children[i] !== camera && scene.children[i] !== sun && scene.children[i] !== ambient){
scene.remove(scene.children[i]);
  }
}
}