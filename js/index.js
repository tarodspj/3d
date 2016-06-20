var animationJs, widthCanvas, heightCanvas, actualSection = 0,
actualSectionName = 'section0',
controlScroll = true;

var distance = 0,
    floorRotation = 1,
    cameraPosition = 6,
    easingAmount = 0.0007,
    manyCubes = window.innerWidth - 90; //pantalla mas pequeña, menos potencia normalmente a ver si se nota el cambio en movil

  if (manyCubes > 1000 ){
    manyCubes = 1000;
  }
// This function can easily be an onClick handler in React components

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.13);

var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 15);

var renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
$('#section0').append(renderer.domElement);

//$(window).resize(onWindowResize);

function onWindowResize() {
  widthCanvas = window.innerWidth;
  heightCanvas = window.innerHeight;
  camera.aspect = widthCanvas / heightCanvas;
  camera.updateProjectionMatrix();
  renderer.setSize( widthCanvas, heightCanvas);
  $('#section0').css({'width': widthCanvas + 'px', 'height': heightCanvas + 'px'});
  $('.section').css({'height': heightCanvas + 'px'});

  // controlScroll =false;
  // destination = document.querySelector('#' + actualSectionName);
  // smoothScroll(destination, 600, afterScroll);
}

//Floor
var floorG = new THREE.BoxGeometry(80,0.60,80),
    floorM = new THREE.MeshLambertMaterial({color: 0xffffff}),
    floor = new THREE.Mesh(floorG,floorM);
//scene.add(floor);

//Buildings
var cube = [];
for(var i = 0; i < manyCubes; ++i){
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

light1 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(light1);
light1.position.set(-1.5,2,1);

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

$('canvas').on('mousemove',function(e){
      var rotateDamper = 960,
          cameraDamper = 750;

      floorRotation = -((e.clientX - $('canvas').width()) / rotateDamper);
      cameraPosition = ((e.clientY) / cameraDamper);
});

function toggleMenu() {
  $('#menu').toggleClass('menuActive');
  $('#burguer').toggleClass('menuActive');
}

function closeMenu() {
  $('#menu').removeClass('menuActive');
  $('#burguer').removeClass('menuActive');
}

function afterScroll() {
  closeMenu();
  controlScroll = true;
}

function onScroll() {

  var $scrollTop = $(this).scrollTop();

  camera.position.y = 3-($scrollTop / 300);

  if (controlScroll) {
    controlScroll = false;
    actualScroll = $(window).scrollTop();

    var cuantoScroll = actualScroll - (actualSection * heightCanvas),
      destination = '';
      if (Math.abs(cuantoScroll) < 3 ) {

        destination = document.querySelector('#' + actualSectionName);
        smoothScroll(destination, 500, afterScroll);

      }  else { //suficiente scroll como para cambiar
        if (cuantoScroll < 0) {
          actualSection = actualSection - 1;
          actualSectionName = 'section' + actualSection;
          destination = document.querySelector('#' + actualSectionName);

          smoothScroll(destination, 600, afterScroll);
        } else {
          actualSection = actualSection + 1;
          actualSectionName = 'section' + actualSection;

          destination = document.querySelector('#' + actualSectionName);

          smoothScroll(destination, 600, afterScroll);
        }
      } //suficiente como para cambiar

      if (actualSection === 0) {
        animationJs = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationJs);
        animationJs = 0;
      }
  } //if controlScroll

}

function animaScroll($element) {
  controlScroll = false;
  actualSectionName = $element.attr('data-index');
  actualSection = $element.index() + 1;

  var destination = document.querySelector('#' + actualSectionName);

  smoothScroll(destination, 500, afterScroll);

}

window.onresize = onWindowResize;

$(document).ready(function() {
  render();
  window.onscroll = onScroll;

  $('#burguer').on( 'click', function() { //show hide menu
    toggleMenu();
  });

  $('#menu .menuItem').on('click', function(){
    var $this = $(this);
    animaScroll($this);
  });

});
