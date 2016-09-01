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
    manyCubes = window.innerWidth - 190; //pantalla mas pequeña, menos potencia normalmente a ver si se nota el cambio en movil

var manyWorks = 8,
    actualWork = 0;

var scene, camera, renderer, light1, floorG, floorM, floor, cube;

function startThree() {
  if (manyCubes > 1000 ){
    manyCubes = 600;
  }

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffffff, 0.13);

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 15);

  renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha: true
  });

  //renderer.setClearColor(0x2253a2);
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('#section0').append(renderer.domElement);

  //Floor
    floorG = new THREE.BoxGeometry(80,0.60,80);
    floorM = new THREE.MeshLambertMaterial({color: 0xffffff});
    floor = new THREE.Mesh(floorG,floorM);
  //scene.add(floor);

  //Buildings
  cube = [];
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
  light1 = new THREE.DirectionalLight(0xffffff, 1);
  luzAmbiente = new THREE.AmbientLight(0xd1e6f9, 0.3);

  light1.position.set(1.5, 2, 1);

  scene.add(light1);
  scene.add(luzAmbiente);

  light1 = new THREE.DirectionalLight(0x3881FF, 0.5);
  //scene.add(light1);
  light1.position.set(-1.5,2,2.2);
  render();
}

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

function goesTo(where) {

  if(onMovement === false) {
    onMovement = true;
    $('body,html').animate({
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
  //$('#section0').css({'width': widthCanvas + 'px', 'height': heightCanvas + 'px'});
  $('.section').css({'height': heightCanvas + 'px'});

    goesTo(actualSectionName);
}

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
  if (actualSection === 0) {
    animationJs = requestAnimationFrame(render);
  } else {
    cancelAnimationFrame(animationJs);
    animationJs = 0;
  }
}

function onScroll() {

  var $scrollTop = $(this).scrollTop(),
  actualScroll = $(window).scrollTop();

  camera.position.y = 3 - ($scrollTop / 300);
  var cuantoScroll = actualScroll - (actualSection * heightCanvas),
    destination = '';
    //console.log(Math.abs(cuantoScroll) + ' scroll' );
  if (controlScroll === true && (Math.abs(cuantoScroll) > 20)) {
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

function validateExpresion(tipo, valor) {
  var RegExPattern;

  if(tipo === 'email') {
    RegExPattern = /^[a-zA-Z0-9]{1}[a-zA-Z0-9._-]+@[a-zA-Z0-9]+[a-zA-Z0-9-_]+[a-zA-Z0-9]+.[a-zA-Z]{2,6}$/;
  } else {
    RegExPattern = /^[6-9]{1}[0-9]{8}$/; // telefono
  }
    if ((valor.match(RegExPattern)) && (valor !== '')) {
        return true;
    } else {
        return false;
    }
}
function validateElement($element) {
  var noError = true,
      inputToCheck = $element.find('input, textarea');

  if(inputToCheck.attr('required')) {
    if(inputToCheck.prop('type') === 'email') {
      noError = validateExpresion('email', inputToCheck.val());
    } else {
      if (inputToCheck.val().length < 10) {
        noError = false;
      }
      else {
        noError = true;
      }
    } //textarea
  } //required

  if(!noError) {
    $element.addClass('error');
  }
  else {
    $element.removeClass('error');
  }

}
function validateForm() {
  if($('#contactForm .error').length === 0) {
    var name = $("input#name").val(),
        email = $("input#email").val(),
         phone = $("input#phone").val(),
         message = $("textarea#message").val();

    $.ajax({
       url: "mail/contact_me.php",
       type: "POST",
       data: {
           name: name,
           phone: phone,
           email: email,
           message: message
       },
       cache: false,
       success: function() {
           // Enable button & show success message
           $("#btnSubmit").attr("disabled", false);
           $('#success').html("<div class='alert alert-success'>");
           $('#success > .alert-success')
               .append("😘 <strong>Your message has been sent. </strong>");
           $('#success > .alert-success')
               .append('</div>');

           //clear all fields
           $('#contactForm').trigger("reset");
       },
       error: function() {
           // Fail message
           $('#success').html("<div class='alert alert-danger'>");
           $('#success > .alert-danger').append("😓 <strong>Sorry " + name + ", it seems that my mail server is not responding. Please try again later!");
           $('#success > .alert-danger').append('</div>');
           //clear all fields
           $('#contactForm').trigger("reset");
       },
   });
  }
} //validateForm

function listeners() {
  $('#burguer').on('click', function() { //show hide menu
    toggleMenu();
  });
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
  $('.titleSectionContainer').on('click', function(){
    closeMenu();
  });

  $('#contentWork .portfolio-item').on('click', function() {
    var workToSee = $(this).index();
    goesToWork(workToSee);
    togglePortfolioDetail();
  });
  $('#closeDetail').on('click', function() {
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

  $('#contactForm').on('input propertychange', '.floating-label-form-group', function(e) {
      $(this).toggleClass('floating-label-form-group-with-value', !! $(e.target).val());
  }).on('focus', '.floating-label-form-group', function() {
      $(this).addClass('floating-label-form-group-with-focus');
  }).on('blur', '.floating-label-form-group', function() {
      $(this).removeClass('floating-label-form-group-with-focus');
      //console.log($(this).find('input, textarea').attr('id'));
      validateElement($(this));
  }).on('keypress','.floating-label-form-group', function() {
    var $elementForm = $(this);
    if($elementForm.hasClass('error')){
      validateElement($(this));
    }

  });

  $('#sendForm').on('click', function() {
    $('.floating-label-form-group').each(function(index) {
      validateElement($(this));
    });
    validateForm();
  });
  $('#success').on('click',function(){
    $(this).html('');
  });

}

function magnetSite() {
  $('canvas').on('mousemove',function(e){
      var rotateDamper = 960,
          cameraDamper = 750;

      floorRotation = -((e.clientX - $('canvas').width()) / rotateDamper);
      cameraPosition = ((e.clientY) / cameraDamper);
  });

  $(window).scroll($.debounce( 100, function(){
    controlScroll = true;
    if(onMovement === false) {
      onScroll();
    }
  }));

  $(window).on('resize', function () {
    controlScroll = false;
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
    }
  });
}
// function followInclination() {
//   var  alpha = Math.round(event.alpha),
//         beta = Math.round(event.beta),
//         gamma = Math.round(event.gamma);
//       console.log(beta);
//   $('#cubeContainer').css('transform','rotateX(' + alpha + 'deg) rotateY(' + beta + 'deg) rotateZ(' + gamma + 'deg)' );
//   //$('.title').html(beta);
//
// }
function loadHeavyImgs() {
  var arrayImgs = [
    'futbolMemoriesPoster',
    'bannerSeatPoster',
    'sprayeahPoster',
    'newsletterPoster',
    'missingPoster',
    'eurocupPoster',
    'mailgeneratorPoster',
    'cupraPoster'
  ];

  $('#portfolioDetailContainer .thumbnailWork img').each(function (index, value){
    $(this).attr('src', 'img/portfolio/' + arrayImgs[index] + '.jpg');
  });
}

function changeHeightWelcome() {
  heightCanvas = window.innerHeight;
  $('#section0').css('height', heightCanvas);
}

function changeCtaBanners() {
  $('#bannersCta').attr('href', 'bannersMov.html');
}

function detectmob() {
 if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){
    return true;
  } else {
    return false;
  }
}

$(document).ready(function() {
  isMob = detectmob();
  if(isMob) {
    if(window.DeviceMotionEvent){
      window.ondeviceorientation = function(event) {
        var  alpha = Math.round(event.alpha),
              beta = parseInt(Math.round(event.beta) * -1),
              gamma = parseInt(Math.round(event.gamma) * 1.2) * -1;
        if(beta > 10){
          beta = 10;
        } else if (beta < -10){
          beta = -10;
        }
        if(gamma > 12){
          gamma = 12;
        } else if (gamma < -12){
          gamma = -12;
        }

        $('.cube').css('transform','rotateY(' + gamma + 'deg) rotateX(' + beta + 'deg)');
      }
    }
    changeHeightWelcome();
    changeCtaBanners();
  } else {
    startThree();
    onWindowResize();
    magnetSite();
  }

  listeners();
  loadHeavyImgs();
});
