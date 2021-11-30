
     import * as HoloPlay from "../../dist/holoplay.module.js";
    //  import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

var scene, camera, renderer;
var geometry, material, mesh;

init();
animate();

function init() {
 

    scene = new THREE.Scene();

    // the holoplay camera should be used like a THREE.PerspectiveCamera

 
    const camera = new HoloPlay.Camera();
  
    const renderer = new HoloPlay.Renderer();
 
    

    // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 500 );
    // camera.position.z = 500;

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );


    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.name = "cube"
    scene.add( mesh );

    // renderer = new THREE.WebGLRenderer();
    // renderer.setSize( window.innerWidth, window.innerHeight );

    // document.body.appendChild( renderer.domElement );

    // the holoplay renderer should act as your THREE.WebGLRenderer
    // const renderer = new HoloPlay.Renderer();

    // add the renderer's canvas to your web page (it will size to fill the page)
    document.body.appendChild(renderer.domElement);


}
// the update function gets called every frame, thanks to requestAnimationFrame()
function update(time) {
    requestAnimationFrame(update);
    animation(time);
    renderer.render(scene, camera);
}
  requestAnimationFrame(update);

function animate() {

    requestAnimationFrame( animate );

    mesh.position.x += 0.01;
    mesh.position.y += 0.02;

    renderer.render( scene, camera );
}

function loadVideo(video) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: { width: 1280, height: 720, facingMode: "user" },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // apply the stream to the video element used in the texture
          video.srcObject = stream;
          video.play();
        })
        .catch(function (error) {
          console.error("Unable to access the camera/webcam.", error);
        });
    } else {
      console.error("MediaDevices interface not available.");
    }
  }