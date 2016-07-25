var animationJs, widthCanvas, heightCanvas, actualSection = 0,
actualSectionName = 'section0',
controlScroll = true;

var rtime,
    timeout = false,
    delta = 300;

var distance = 0,
    floorRotation = 1,
    cameraPosition = 6,
    easingAmount = 0.0007,
    manyCubes = window.innerWidth - 90; //pantalla mas pequeña, menos potencia normalmente a ver si se nota el cambio en movil

if (manyCubes > 1000 ){
  manyCubes = 600;
}

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.13);

var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 15);

var renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
$('#section0').append(renderer.domElement);

function goesTo(where) {
  controlScroll = false;
  smoothScroll.animateScroll( '#' + where );
  console.log(controlScroll + ' AA');
}

function onWindowResize() {
  widthCanvas = window.innerWidth;
  heightCanvas = window.innerHeight;
  camera.aspect = widthCanvas / heightCanvas;
  camera.updateProjectionMatrix();
  renderer.setSize( widthCanvas, heightCanvas);
  $('#section0').css({'width': widthCanvas + 'px', 'height': heightCanvas + 'px'});
  $('.section').css({'height': heightCanvas + 'px'});

  //controlScroll = false;
  goesTo(actualSectionName);
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
      var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        emissive: 0x131313,
        roughness: 0.02,
        wireframeLinewidth: 1.4,
        opacity: 0.6,
        transparent: true
    } );
  if( i % 11 === 0) {
    var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    material.opacity = 1;
  } else {
    var material = new THREE.MeshLambertMaterial({color: 0x7a7e83});
    material.opacity = 0.9;
    material.transparent = true;
  }

  //material.opacity = 0.9;
  cube[i] = new THREE.Mesh(geometry, material);
  //floor.add( cube[i] );
  scene.add(cube[i]);

  var x = (Math.random() * (10.00 - (-10)) + -10).toFixed(2),
      y = 0,
      z = (Math.random() * (10.00 - (-10)) + -10).toFixed(2);
  cube[i].position.set(x,y,z);
}

//camera
camera.position.set(0,3,10);

//lights
var light1 = new THREE.DirectionalLight(0xffffff, 1),
luzAmbiente = new THREE.AmbientLight(0x1b5a6a, 0.5);

light1.position.set(1.5, 2, 1);

scene.add(light1);
scene.add(luzAmbiente);

light1 = new THREE.DirectionalLight(0xbfc0c0, 0.5);
scene.add(light1);
light1.position.set(-1.5,2,1);

function render() {
  // onWindowResize();
	animationJs = requestAnimationFrame(render);
	renderer.render(scene, camera);

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
  controlScroll = true;
  closeMenu();
  console.log(controlScroll + '-');
}

function onScroll() {

  var $scrollTop = $(this).scrollTop();

  camera.position.y = 3 - ($scrollTop / 300);

  if (controlScroll) {
    controlScroll = false;
    actualScroll = $(window).scrollTop();

    var cuantoScroll = actualScroll - (actualSection * heightCanvas),
      destination = '';
      if (Math.abs(cuantoScroll) < 1) {
        goesTo(actualSectionName);

      } else { //suficiente scroll como para cambiar
        if (cuantoScroll < 0) {
          actualSection = actualSection - 1;
          actualSectionName = 'section' + actualSection;

          goesTo(actualSectionName);

        } else {
          actualSection = actualSection + 1;
          actualSectionName = 'section' + actualSection;

          goesTo(actualSectionName);

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

function resizeend() {
    if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
    } else {
        timeout = false;
        onWindowResize();
    }
}

$(document).ready(function() {
  render();
  smoothScroll.init({
    selector: '[data-scroll]', // Selector for links (must be a valid CSS selector)
    //selectorHeader: '[data-scroll-header]', // Selector for fixed headers (must be a valid CSS selector)
    speed: 500, // Integer. How fast to complete the scroll in milliseconds
    easing: 'easeInOutCubic', // Easing pattern to use
    offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
    updateURL: false, // Boolean. If true, update the URL hash on scroll
    callback: function ( anchor, toggle ) {
      console.log(anchor);
      afterScroll();
    } // Function to run after scrolling

  });
  $('.enlaceMenu').on('click', function(){
    var whereToGo = $(this).attr('data-scroll');
    if(whereToGo === 'actualSection') {
      closeMenu();
    }
    else {
      actualSection = whereToGo;
      goesTo(whereToGo);
    }
  });

  onWindowResize();

  window.onscroll = onScroll;

  $('#burguer').on( 'click', function() { //show hide menu
    toggleMenu();
  });

  $(window).on('resize', function () {
    controlScroll = false;
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
  });


  // document.onkeypress = function myFunction() {
  //   switch (event.keyCode) {
  //   case 13:
  //       console.log("Up key is pressed");
  //       break;
  //   case 38:
  //       console.log("Down key is pressed");
  //       break;
  //   }
  // };

});
