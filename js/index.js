var animationJs, widthCanvas, heightCanvas;

// This function can easily be an onClick handler in React components

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.13);

var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 15);

var renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
$('#wrapper').append(renderer.domElement);

//$(window).resize(onWindowResize);

function onWindowResize() {
  widthCanvas = window.innerWidth;
  heightCanvas = window.innerHeight;
  camera.aspect = widthCanvas / heightCanvas;
  camera.updateProjectionMatrix();
  renderer.setSize( widthCanvas, heightCanvas);
  $('#wrapper').css({'width': widthCanvas + 'px', 'height': heightCanvas + 'px'});
  $('.section').css({'height': heightCanvas + 'px'});
}

//Floor
var floorG = new THREE.BoxGeometry(80,0.60,80),
    floorM = new THREE.MeshLambertMaterial({color: 0xffffff}),
    floor = new THREE.Mesh(floorG,floorM);
//scene.add(floor);

//Buildings
var cube = [];
for(var i = 0; i < 1000; ++i){
  var rHeight = (Math.random()*6) + 0.25,
      geometry = new THREE.BoxGeometry(0.25, rHeight, 0.25);
      //material = new THREE.MeshLambertMaterial({color: 0xb2d7e5});

  if( i % 11 === 0) {
    var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    material.opacity = 1;
  } else {
    var material = new THREE.MeshLambertMaterial({color: 0xb2d7e5});
    material.opacity = 0.9;
    material.transparent = true;
  }

  //material.opacity = 0.9;
  cube[i] = new THREE.Mesh( geometry, material );
  //floor.add( cube[i] );
  scene.add(cube[i]);

  var x = (Math.random() * (10.00 - (-10)) + -10).toFixed(2),
      y = 0,
      z = (Math.random() * (10.00 - (-10)) + -10).toFixed(2);
  cube[i].position.set(x,y,z);
}

//camera
camera.position.set(0,3,1);

//lights
var light1 = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light1);
light1.position.set(1.5,2,1);

var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(light1);
light1.position.set(-1.5,2,1);


var distance = 0,
    floorRotation = 1,
    cameraPosition = 6,
    easingAmount = 0.0007;

function render() {
  onWindowResize();
	animationJs = requestAnimationFrame( render );
	renderer.render( scene, camera );

  //move camera and city to mouse movement slowly
   var xDistance = floorRotation - floor.rotation.y,
       yDistance = cameraPosition - camera.position.z;
   distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
   if (distance > 0) {
       floor.rotation.y += xDistance * easingAmount;
       camera.position.z += yDistance * easingAmount;
   }
}
function onScroll() {
  var $scrollTop = $(this).scrollTop();
  camera.position.y = 3-($scrollTop / 300);
  if($scrollTop > (heightCanvas - 130) && animationJs != 0) { //para controlar que no este haciendo la locura si no la veo
    cancelAnimationFrame(animationJs);
    animationJs = 0;
    console.log('cancel animation');
  } else if ($scrollTop < (heightCanvas - 130)) { //volvemos a lanzar la locura si la estamos viendo
    animationJs = requestAnimationFrame( render );
  }
}

//mouse movement

$('canvas').on('mousemove',function(e){
      var rotateDamper = 960;
      var cameraDamper = 750;

      floorRotation = -((e.clientX - $('canvas').width()) / rotateDamper);
      cameraPosition = ((e.clientY) / cameraDamper);
});

function toggleMenu() {
  $('#menu').toggleClass('menuActive');
  $('#burguer').toggleClass('menuActive');
}

function animaScroll(where) {
  var exampleDestination = document.querySelector('#' + where);
  smoothScroll(exampleDestination,500,toggleMenu);
  //window.smoothScroll(target, duration, callback, context)

}

window.onresize = onWindowResize;

$(document).ready(function() {
  render();
  window.onscroll = onScroll;

  $('#burguer').on( 'click', function() { //show hide menu
    toggleMenu();
  });

  $('#menu .enlaceMenu').on('click', function(){
    var $this = $(this);
    animaScroll($this.attr('data-index'));
  });

});
