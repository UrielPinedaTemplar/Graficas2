// Variables for the game UX
let time = null,
    play_game = true,
    start_game = true,
    record_alto = 0,
    record_actual = 0,
    time_of_game = 65;

let arrCollider = [];
let sphereObj = null;
let sphereB = null;
let elem = null;
let minX = -0.0025499999999999997;
let maxX = 0.0025499999999999993;

let cubeArray = [];
let minY = -0.0023;
let maxY = 0.0023499999999999992


let cubeObject = [];
let geometryCube = null;
// Get window dimension
let SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 2048;
var ww = window.innerWidth,
    wh = window.innerHeight;
// Save half window dimension
var ww2 = ww * 0.5,
    wh2 = wh * 0.5;

// Constructor function
function Tunnel() {

  
  // Init the scene and the 
  this.init();
  // Create the shape of the tunnel
  this.createMesh();

  // Mouse events & window resize
  this.handleEvents();

  // Start loop animation
  window.requestAnimationFrame(this.render.bind(this));
}

let timearrRand = [];

for (let index = 0; index < 20000; index++) {
  var newNumX = Math.random() * (0.00015 - 0) + 0;
  timearrRand.push(newNumX)
  
}




// Try edit message
let arrRand = [];
let arrRand2 = [];
for (let index = 0; index < 20000; index++) {
  var newNumX = Math.random() * (maxX - minX) + minX;
  var newNum2 = Math.random() * (maxY - minY) + minY;
  arrRand.push(newNumX)
  arrRand2.push(newNum2)
  
}

  

Tunnel.prototype.init = function() {
  // Define the speed of the tunnel
  this.speed = 0.03;



  // Store the position of the mouse
  // Default is center of the screen
  this.mouse = {
    position: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(0, 0, 0)
  };


  // Create a WebGL renderer
  
  this.renderer = new THREE.WebGLRenderer({
    
    antialias:true,
    canvas: document.querySelector("#scene")
  });
  // Set size of the renderer and its background color
  
  this.renderer.setSize(ww, wh);
  this.renderer.shadowMap.enabled = true;

  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  this.renderer.shadowMap.type = THREE.BasicShadowMap;
  //this.renderer.setClearColor(0xe8e1bc);

 

  // Create a camera and move it along Z axis
  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 1000);
  this.camera.position.z = 0.1;

  // Create an empty scene and define a fog for it
  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog(0xe8e1bc, 0.8, 2.5);

  geometryCube = new THREE.BoxGeometry( 0.0010, 0.0010, 0.0010 );

  for (let index = 0; index < 200; index++) {
    var materialCube = new THREE.MeshBasicMaterial( {color: 0x843D2B} );
    
    var cube = new THREE.Mesh(new THREE.BoxGeometry( 0.0010, 0.0010, 0.0010 ),
    materialCube)
    
    
    cubeArray.push(cube)

    

    
  }
  var i = 0;

  cubeArray.forEach(element => {
    
    element.position.set(arrRand[i], arrRand2[i], 2); 
    //console.log(element.position.x)
    this.scene.add(element);
    let collider = new THREE.Box3().setFromObject(element)
    arrCollider.push(collider)
    cubeObject.push(element);
    i++
  });
  


  var geometry = new THREE.SphereBufferGeometry( 0.00035, 32,   32 );
  var material = new THREE.MeshPhongMaterial();
  material.map = THREE.ImageUtils.loadTexture('earthmap.jpg')
  material.bumpMap = THREE.ImageUtils.loadTexture('earthbump.jpg')
  material.specularMap = THREE.ImageUtils.loadTexture('earthspec.jpg')
  material.specular  = new THREE.Color('grey')
  material.bumpScale = 0.05
  var sphere = new THREE.Mesh( geometry, material );
  //Create the light and shadows
  let spotLight = new THREE.SpotLight(0x646464, 0.4, 1120);//, Math.PI / 2);
  spotLight.position.set(0, 1120, 0);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 0.0001;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 45;
  spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  this.scene.add(spotLight);
  this.scene.add(ambientLight);
  sphere.geometry.dynamic = true;
  sphere.geometry.computeBoundingSphere();
  sphere.geometry.verticesNeedUpdate = true;
  sphere.position.set(0, -0.0020, 0.120);

  this.scene.add( sphere );
  console.log('se cargo esfera', sphere);
  // movement - please calibrate these values
  var xSpeed = 0.00015;
  var ySpeed = 0.00015;
  document.addEventListener("keydown", onDocumentKeyDown, false);
  function onDocumentKeyDown(event) {
      var keyCode = event.which;
      if (keyCode == 87 && sphere.position.y < 0.0023499999999999992) {
          sphere.position.y += ySpeed;
      } else if (keyCode == 83 && sphere.position.y > -0.0023) {
          sphere.position.y -= ySpeed;
      } else if (keyCode == 65 && sphere.position.x < 0.0025499999999999993) {
          sphere.position.x += xSpeed;
      } else if (keyCode == 68  && sphere.position.x > -0.0025499999999999997) {
          sphere.position.x -= xSpeed;
      } 
  };

  sphereObj = sphere;
  console.log(sphereObj)
  console.log(arrCollider)


};


Tunnel.prototype.createMesh = function() {
  // Empty array to store the points along the path
  var points = [];
  
  // Define points along Z axis to create a curve
  for (var i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  // Set custom Y position for the last point
  points[4].y = -0.06;

  // Create a curve based on the points
  this.curve = new THREE.CatmullRomCurve3(points);
  // Define the curve type

  // Empty geometry
  var geometry = new THREE.Geometry();
  // Create vertices based on the curve
  geometry.vertices = this.curve.getPoints(70);
  // Create a line from the points with a basic line material
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  // Create a material for the tunnel with a custom texture
  // Set side to BackSide since the camera is inside the tunnel
  this.tubeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: tunnelTexture
  });
  // Repeat the pattern
  this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.map.repeat.set(15, 3);

  // Create a tube geometry based on the curve
  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false);
  // Create a mesh based on the tube geometry and its material
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  // Push the tube into the scene
  this.scene.add(this.tubeMesh);
  

  // Clone the original tube geometry
  // Because we will modify the visible one but we need to keep track of the original position of the vertices
  this.tubeGeometry_o = this.tubeGeometry.clone();

};

Tunnel.prototype.handleEvents = function() {
  // When user resize window
  window.addEventListener('resize', this.onResize.bind(this), false);
  // When user move the mouse
  document.body.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  
  
    

};


Tunnel.prototype.onResize = function() {
  // On resize, get new width & height of window
  ww = window.innerWidth;
  wh = window.innerHeight;
  ww2 = ww * 0.5;
  wh2 = wh * 0.5;

  // Update camera aspect
  this.camera.aspect = ww / wh;
  // Reset aspect of the camera
  this.camera.updateProjectionMatrix();
  // Update size of the canvas
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function(e) {
  // Save mouse X & Y position 
  this.mouse.target.x = (e.clientX - ww2) / ww2;
  this.mouse.target.y = (wh2 - e.clientY) / wh2;
};



Tunnel.prototype.updateCameraPosition = function() {
  // Update the mouse position with some lerp

  // Rotate Z & Y axis
  this.camera.rotation.z = this.mouse.position.x * 0.2;
  this.camera.rotation.y = Math.PI - (this.mouse.position.x * 0.06);
  // Move a bit the camera horizontally & vertically

  
};

Tunnel.prototype.updateMaterialOffset = function() {
  // Update the offset of the material
  this.tubeMaterial.map.offset.x += this.speed;
};

Tunnel.prototype.updateCurve = function() {
  var index = 0,
      vertice_o = null,
      vertice = null;
  // For each vertice of the tube, move it a bit based on the spline
  for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
    // Get the original tube vertice
    vertice_o = this.tubeGeometry_o.vertices[i];
    // Get the visible tube vertice
    vertice = this.tubeGeometry.vertices[i];
    // Calculate index of the vertice based on the Z axis
    // The tube is made of 30 circles of vertices
    index = Math.floor(i / 30);
    // Update tube vertice
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 10;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 5;
  }
  // Warn ThreeJs that the points have changed
  this.tubeGeometry.verticesNeedUpdate = true;

  // Update the points along the curve base on mouse position

  
  
};

Tunnel.prototype.render = function() {

  // Update material offset
  this.updateMaterialOffset();

  // Update camera position & rotation



  this.updateCameraPosition();

  // Update the tunnel 
  this.updateCurve();
  let i = 0;
  cubeObject.forEach(element => {
    element.position.z -= 20*timearrRand[i]
    i++
  });

  
 

  // render the scene
  this.renderer.render(this.scene, this.camera);
  
  //console.log(sphereObj.position)
  
  arrCollider.find(element =>{
    
    if(element.containsPoint(sphereObj.position)){
      console.log('colision')
    }
    if(element.position == sphereObj.position){
      console.log('collision')
    }
  })

 
  
    /*
  sphereObj.material =
        sphereB.intersectsBox(cubeBbox)
        ? this.materials.colliding
        : console.log('collide')
  */

  // Animation loop
  window.requestAnimationFrame(this.render.bind(this));
};


// Create a new loader
var loader = new THREE.TextureLoader();
// Prevent crossorigin issue
loader.crossOrigin = "Anonymous";
// Load the texture
loader.load("pattern.jpg",
            function(texture){
  // When texture is loaded, init the scene
  document.body.classList.remove("loading");
  window.tunnelTexture = texture;
  window.tunnel = new Tunnel();
});

