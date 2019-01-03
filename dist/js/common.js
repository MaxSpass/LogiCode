var app = {};
var winWidth = $(window).width();
var particleInited = false;

function initBudgetSlider() {
    var slider = document.getElementById('slider-huge');
    var $bigValueSpan = $('#huge-value');

    window.slider = slider;

    var budget = [
        "",
        "$ 5,000",
        "$ 10,000",
        "$ 15,000",
        "$ 20,000",
        "$ 25,000",
        "$ 30,000",
        "$ 35,000",
        "$ 40,000",
        "$ 45,000",
        "$ 50,000 or more"
    ];

    noUiSlider.create(slider, {
        start: [0],
        step: 1,
        animate: true,
        animationDuration: 200,
        range: {
            'min': 0,
            'max': 10
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        var value = budget[parseInt(values)];
        if($bigValueSpan.hasClass('hidden')) {
            $bigValueSpan.removeClass('hidden')
        }
        $bigValueSpan.val(value)
    });
}


function formControl() {
    var $form = $('#feedbackForm');
    var $input = $form.find('.feedback__input:not(.without-focus)');

    $input.on('focus', function(e){
        var $parent = $(e.target).closest('.feedback__input_item');
        $parent.addClass('not-empty')
    });

    $input.on('blur', function(e){
        var $parent = $(e.target).closest('.feedback__input_item');

        if(!e.target.value.length) {
            $parent.removeClass('not-empty')
        }
    })

}

function particleInit() {
    if(particleInited) return false;
    var $slider = $('#particle-slider');
    if($slider.length && winWidth > 980) {
        var ps = new ParticleSlider({
            ptlGap: 2,
            mouseForce: 500,
            monochrome: true,
            color: '#fff',
            ptlSize: 1,
            showArrowControls: false

        });
        var ptl = new ps.Particle(ps);
        ptl.ttl = 20;
        particleInited = true;
    }
}

function menuToggler() {
    $('#toggle').find('.burger').toggleClass('active');
    $('#overlay').toggleClass('open');
    $('body').toggleClass('overflow');

}

function menuTogglerClickInit() {
    $('#toggle').click(function() {
        menuToggler();
    });
}

function scrollTo(anchor) {
    if(anchor) {
        $('html, body').animate({
            scrollTop: $(anchor).offset().top
        }, 500);
    }
};

function menuItemClickInit() {
    $('a[href^="#"]').on('click', function(e){
        e.preventDefault();
        var link = this;
        var $link = $(link);
        var anchor = $link.attr('href');

        if($('#overlay').hasClass('open')) {
            menuToggler();
            setTimeout(function(){
                scrollTo(anchor)
            },300);
        } else {
            scrollTo(anchor)
        }
    })
}

function convertFormData(obj) {
    var data = {data: {}};

    for(var key in obj) {
        if(obj[key] && obj[key].name && obj[key].value) {
            data.data[obj[key].name] = obj[key].value;
        }
    }

    return data;
}

function sendFormData(data) {
    return $.ajax({
        data: data,
        url: '../handler.php',
        method: 'post',
        dataType: 'json'
    })
}

function formHandler() {
    var $form = $('#feedbackForm')
    var $tnxBlock = $('.feedback__thnx');

    $form.validate({
        rules: {
            firstname: {
                required: true
            },
            email: {
                required: true
            },
        },
        submitHandler: function(form) {
            $(form).on('submit', function(e){e.preventDefault()});
            var data = $form.serializeArray();
            var coverted = convertFormData(data);
            sendFormData(coverted)
                .done(function(res){
                    if(res.status) {
                        $tnxBlock.addClass('show');
                        $form.trigger('reset');
/*                        setTimeout(function(){
                            $tnxBlock.removeClass('show')
                        },2500);*/
                    }
                });
        }
    });
};

app.home = function() {
    this.$page = null;
    this.cubesAnimation = null;
    this.lightPosition = {
        x: 0,
        y: 0,
        z: 400
    };
    this.cubes = [];
    this.playTimeout = null;

    this.setup = function() {
        var self = this;
        this.$page = $('.services');

        this.$page.find('#cubes').addClass('show');
        this.$page.find('.cube').each(function(i,el) {
            $(el).removeClass('hide');
            var rotate = this.children[0].style.transform.replace(/rotate3d\(/, '').split(',');

            self.cubes.push({
                el: this,
                inner: this.children[0],
                sides: this.children[0].children,
                x: parseFloat(rotate[0]) * 90,
                y: parseFloat(rotate[1]) * 90,
                z: parseFloat(rotate[2]) * 90,
                rotateX: Math.floor(Math.random() * 100) / 1000,
                rotateY: Math.floor(Math.random() * 100) / 1000,
                rotateZ: Math.floor(Math.random() * 100) / 1000,
            })
        });

        this.animateCubes = this.animateCubes.bind(this);

        window.requestAnimationFrame(this.animateCubes);

    };

    this.animateCubes = function() {
        requestAnimationFrame(this.animateCubes);

        var i, cube, j, side;

        // console.log('this.cubes.length',this.cubes.length);

        for (i = 0; i < this.cubes.length; i++) {
            cube = this.cubes[i];
            cube.x += cube.rotateX;
            cube.y += cube.rotateY;
            cube.z += cube.rotateZ;

            if (Math.abs(cube.x) > 360) {
                cube.x += cube.x > 0 ? -360 : 360;
            }

            if (Math.abs(cube.y) > 360) {
                cube.y += cube.y > 0 ? -360 : 360;
            }

            if (Math.abs(cube.z) > 360) {
                cube.z += cube.z > 0 ? -360 : 360;
            }

            cube.inner.style.transform = 'rotateX(' + cube.x + 'deg) rotateY(' + cube.y + 'deg) rotateZ(' + cube.z + 'deg)';

            for (j = 0; j < cube.sides.length; j++) {
                side = cube.sides[j];

                var vertices = Vect3.computeVertexData(side);
                var faceCenter = Vect3.divs(Vect3.sub(vertices.c, vertices.a), 2);
                var faceNormal = Vect3.normalize(Vect3.cross(Vect3.sub(vertices.b, vertices.a), Vect3.sub(vertices.c, vertices.a)));
                var direction = Vect3.normalize(Vect3.sub(this.lightPosition, faceCenter));
                var amount = 0.75 - (Math.max(0, Vect3.dot(faceNormal, direction)).toFixed(3) / 4 * 3);

                side.style.backgroundImage = "linear-gradient(rgba(0,0,0," + amount + "), rgba(0,0,0," + amount + "))";
            }
        }
    };

    this.destroy = function() {
        this.$page = null;

        cancelAnimationFrame(this.cubesAnimation);
        this.cubesAnimation = null;
        this.cubes = [];

        this.slider.destroy();
        this.slider = null;
    }
    ;

    this.setup();
};


// Create a new Particle

$(function() {
    if(winWidth > 980) {
        new app.home();
    }
    // $(window).resize(function () {
    //     particleInit();
    // })
});

$(function(){
    particleInit();
    initBudgetSlider();
    formControl();
    menuTogglerClickInit();
    menuItemClickInit();
    formHandler();
});

