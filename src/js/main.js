var animationJs, widthCanvas, heightCanvas, actualSection = 0,
actualSectionName = 'section0',
controlScroll = true,
onMovement = false;

var rtime = 0,
    timeout = false,
    delta = 500;

var distance = 0,
    floorRotation = 3,
    cameraPosition = 6,
    easingAmount = 0.0007,
    manyCubes = window.innerWidth - 90; //pantalla mas pequeña, menos potencia normalmente a ver si se nota el cambio en movil

var manyWorks = 8,
    actualWork = 0;

if (manyCubes > 1000 ){
  manyCubes = 600;
}

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.13);

var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 15);

var renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha: true
});

//renderer.setClearColor(0x2253a2);
renderer.setSize(window.innerWidth, window.innerHeight);
$('#section0').append(renderer.domElement);

function goesTo(where) {

  if(onMovement === false) {
    onMovement = true;
    $('body').animate({
         scrollTop: $('#' + where).offset().top
     }, 600, function(){
       actualSection = parseInt(where.slice(7), 10);
       afterScroll();
     });
  }

}

function changesTitles(){
  var nextElement = actualWork + 2,
      prevElement = actualWork;

  if (actualWork === 0) {
    prevElement = manyWorks;
  } else if (actualWork === (manyWorks - 1)) {
    nextElement = 1;
  }

  var tituloPrevio = $('#portfolioDetailContainer .portfolioDetailItem:nth-child(' + prevElement + ')').attr('data-title'),
      tituloSiguiente = $('#portfolioDetailContainer .portfolioDetailItem:nth-child(' + nextElement + ')').attr('data-title');

  $('#titlePrev').html(tituloPrevio);
  $('#titleNext').html(tituloSiguiente);
}

function goesToWork(whatWork) {
  actualWork = whatWork;

  changesTitles();

  var howMuchToMove = whatWork * (100 / manyWorks);
  $('#portfolioDetailContainer').css('transform', 'translateX(-' + howMuchToMove + '%)');
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
      //material = new THREE.MeshLambertMaterial({color: 0x91CEFF});
      var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        //emissive: 0x131313,
        roughness: 0.02,
        wireframeLinewidth: 1.4,
        //opacity: 0.6,
        //transparent: true
    } );
  if( i % 11 === 0) {
    var material = new THREE.MeshLambertMaterial({color: 0xe11218});
    material.opacity = 1;
  } else {
    //var material = new THREE.MeshLambertMaterial({color: 0x7a7e83});
    var material = new THREE.MeshLambertMaterial({color: 0xffffff});

    material.opacity = 1;
    material.transparent = true;
  }

  //material.opacity = 0.9;
  cube[i] = new THREE.Mesh(geometry, material);
  //floor.add( cube[i] );
  scene.add(cube[i]);

  var x = (Math.random() * (10.00 - (-4)) + -4).toFixed(2),
      y = Math.random() * 1.1,
      z = (Math.random() * (10.00 - (-10)) + -10).toFixed(2);
  cube[i].position.set(x,y,z);
}

//camera
camera.position.set(0,3,10);

//lights
var light1 = new THREE.DirectionalLight(0xffffff, 1),
luzAmbiente = new THREE.AmbientLight(0xd1e6f9, 0.3);

light1.position.set(1.5, 2, 1);

scene.add(light1);
scene.add(luzAmbiente);

light1 = new THREE.DirectionalLight(0x3881FF, 0.5);
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
  onMovement = false;
}
function togglePortfolioDetail() {
  $('#portfolioDetail').toggleClass('active');
}

function closePortfolioDetail() {
  $('#portfolioDetail').removeClass('active');
}

function afterScroll() {
  closeMenu();
  controlScroll = true;
}

function onScroll() {

  var $scrollTop = $(this).scrollTop(),
  actualScroll = $(window).scrollTop();

  camera.position.y = 3 - ($scrollTop / 300);
  var cuantoScroll = actualScroll - (actualSection * heightCanvas),
    destination = '';
  if (controlScroll === true && (Math.abs(cuantoScroll) > 6)) {
    controlScroll = false;

    onChange = true;

        if (cuantoScroll < 0) {
          actualSection = actualSection - 1;
          actualSectionName = 'section' + actualSection;

          goesTo(actualSectionName);

        } else {
          actualSection = parseInt(actualSection, 10) + 1;
          actualSectionName = 'section' + actualSection;

          goesTo(actualSectionName);

        }
      //} //suficiente como para cambiar

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

function unbindScroll() {
  $(window).unbind('scroll',function(){
    controlScroll = true;
    if(onMovement === false){
      onScroll();
    }
  });
}

$(document).ready(function() {
  render();
  $('.enlaceMenu').on('click', function(){
    var whereToGo = $(this).attr('data-scroll');
    if(whereToGo === actualSectionName) {
      closeMenu();
    }
    else {
      actualSectionName = whereToGo;
      goesTo(whereToGo);
    }
  });

  onWindowResize();

  $('#burguer').on('click', function() { //show hide menu
    toggleMenu();
  });

  $('#contentWork .portfolio-item').on('click', function() {
    var workToSee = $(this).index();
    goesToWork(workToSee);
    togglePortfolioDetail();
  });
  $('#buttonNext').on('click', function() {
    var workToSee = actualWork + 1;

    if(workToSee === manyWorks) {
      workToSee = 0;
    }
    goesToWork(workToSee);
  });
  $('#buttonPrev').on('click', function() {
    var workToSee = actualWork - 1;

    if(actualWork === 0) {
      workToSee = manyWorks - 1;
    }

    goesToWork(workToSee);
  });

  $(window).scroll($.debounce( 250, function(){
    controlScroll = true;
    if(onMovement === false) {
      onScroll();
    }
  }));

  $('#closeDetail').on('click', function() {
    togglePortfolioDetail();
  });

  $(window).on('resize', function () {
    controlScroll = false;
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
  });

});
