/* Vector functions
-------------------------------------------------- */
var Vect3 = {
    create: function(x, y, z) {
        return {
            x: x || 0,
            y: y || 0,
            z: z || 0
        };
    },
    add: function(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            z: v1.z + v2.z
        };
    },
    sub: function(v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
        };
    },
    mul: function(v1, v2) {
        return {
            x: v1.x * v2.x,
            y: v1.y * v2.y,
            z: v1.z * v2.z
        };
    },
    div: function(v1, v2) {
        return {
            x: v1.x / v2.x,
            y: v1.y / v2.y,
            z: v1.z / v2.z
        };
    },
    muls: function(v, s) {
        return {
            x: v.x * s,
            y: v.y * s,
            z: v.z * s
        };
    },
    divs: function(v, s) {
        return {
            x: v.x / s,
            y: v.y / s,
            z: v.z / s
        };
    },
    len: function(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },
    dot: function(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
    },
    cross: function(v1, v2) {
        return {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
        };
    },
    normalize: function(v) {
        return Vect3.divs(v, Vect3.len(v));
    },
    ang: function(v1, v2) {
        return Math.acos(Vect3.dot(v1, v2) / (Vect3.len(v1) * Vect3.len(v2)));
    },
    copy: function(v) {
        return {
            x: v.x,
            y: v.y,
            z: v.z
        };
    },
    equal: function(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    },
    rotate: function(v1, v2) {
        var x1 = v1.x,
            y1 = v1.y,
            z1 = v1.z,
            angleX = v2.x / 2,
            angleY = v2.y / 2,
            angleZ = v2.z / 2,

            cr = Math.cos(angleX),
            cp = Math.cos(angleY),
            cy = Math.cos(angleZ),
            sr = Math.sin(angleX),
            sp = Math.sin(angleY),
            sy = Math.sin(angleZ),

            w = cr * cp * cy + -sr * sp * sy,
            x = sr * cp * cy - -cr * sp * sy,
            y = cr * sp * cy + sr * cp * -sy,
            z = cr * cp * sy - -sr * sp * cy,

            m0 = 1 - 2 * (y * y + z * z),
            m1 = 2 * (x * y + z * w),
            m2 = 2 * (x * z - y * w),

            m4 = 2 * (x * y - z * w),
            m5 = 1 - 2 * (x * x + z * z),
            m6 = 2 * (z * y + x * w),

            m8 = 2 * (x * z + y * w),
            m9 = 2 * (y * z - x * w),
            m10 = 1 - 2 * (x * x + y * y);

        return {
            x: x1 * m0 + y1 * m4 + z1 * m8,
            y: x1 * m1 + y1 * m5 + z1 * m9,
            z: x1 * m2 + y1 * m6 + z1 * m10
        };
    },
    /* Returns A, B, C and D vertices of an element
---------------------------------------------------------------- */

    computeVertexData: function(elem) {
        var w = elem.offsetWidth,
            h = elem.offsetHeight,
            v = {
                a: {
                    x: -w / 2,
                    y: -h / 2,
                    z: 0
                },
                b: {
                    x: w / 2,
                    y: -h / 2,
                    z: 0
                },
                c: {
                    x: w / 2,
                    y: h / 2,
                    z: 0
                },
                d: {
                    x: -w / 2,
                    y: h / 2,
                    z: 0
                }
            },
            transform;

        while (elem.nodeType === 1) {
            transform = this.getTransform(elem);
            v.a = this.addVectors(this.rotateVector(v.a, transform.rotate), transform.translate);
            v.b = this.addVectors(this.rotateVector(v.b, transform.rotate), transform.translate);
            v.c = this.addVectors(this.rotateVector(v.c, transform.rotate), transform.translate);
            v.d = this.addVectors(this.rotateVector(v.d, transform.rotate), transform.translate);
            elem = elem.parentNode;
        }
        return v;
    },


    /* Returns the rotation and translation components of an element
    ---------------------------------------------------------------- */

    getTransform: function(elem) {
        var computedStyle = getComputedStyle(elem, null),
            val = computedStyle.transform ||
                computedStyle.webkitTransform ||
                computedStyle.MozTransform ||
                computedStyle.msTransform,
            matrix = this.parseMatrix(val),
            rotateY = Math.asin(-matrix.m13),
            rotateX,
            rotateZ;

        rotateX = Math.atan2(matrix.m23, matrix.m33);
        rotateZ = Math.atan2(matrix.m12, matrix.m11);

        /*if (Math.cos(rotateY) !== 0) {
            rotateX = Math.atan2(matrix.m23, matrix.m33);
            rotateZ = Math.atan2(matrix.m12, matrix.m11);
        } else {
            rotateX = Math.atan2(-matrix.m31, matrix.m22);
            rotateZ = 0;
        }*/

        return {
            transformStyle: val,
            matrix: matrix,
            rotate: {
                x: rotateX,
                y: rotateY,
                z: rotateZ
            },
            translate: {
                x: matrix.m41,
                y: matrix.m42,
                z: matrix.m43
            }
        };
    },


    /* Parses a matrix string and returns a 4x4 matrix
    ---------------------------------------------------------------- */

    parseMatrix: function(matrixString) {
        var c = matrixString.split(/\s*[(),]\s*/).slice(1, -1),
            matrix;

        if (c.length === 6) {
            // 'matrix()' (3x2)
            matrix = {
                m11: +c[0],
                m21: +c[2],
                m31: 0,
                m41: +c[4],
                m12: +c[1],
                m22: +c[3],
                m32: 0,
                m42: +c[5],
                m13: 0,
                m23: 0,
                m33: 1,
                m43: 0,
                m14: 0,
                m24: 0,
                m34: 0,
                m44: 1
            };
        } else if (c.length === 16) {
            // matrix3d() (4x4)
            matrix = {
                m11: +c[0],
                m21: +c[4],
                m31: +c[8],
                m41: +c[12],
                m12: +c[1],
                m22: +c[5],
                m32: +c[9],
                m42: +c[13],
                m13: +c[2],
                m23: +c[6],
                m33: +c[10],
                m43: +c[14],
                m14: +c[3],
                m24: +c[7],
                m34: +c[11],
                m44: +c[15]
            };

        } else {
            // handle 'none' or invalid values.
            matrix = {
                m11: 1,
                m21: 0,
                m31: 0,
                m41: 0,
                m12: 0,
                m22: 1,
                m32: 0,
                m42: 0,
                m13: 0,
                m23: 0,
                m33: 1,
                m43: 0,
                m14: 0,
                m24: 0,
                m34: 0,
                m44: 1
            };
        }
        return matrix;
    },

    /* Adds vector v2 to vector v1
    ---------------------------------------------------------------- */

    addVectors: function(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            z: v1.z + v2.z
        };
    },


    /* Rotates vector v1 around vector v2
    ---------------------------------------------------------------- */

    rotateVector: function(v1, v2) {
        var x1 = v1.x,
            y1 = v1.y,
            z1 = v1.z,
            angleX = v2.x / 2,
            angleY = v2.y / 2,
            angleZ = v2.z / 2,

            cr = Math.cos(angleX),
            cp = Math.cos(angleY),
            cy = Math.cos(angleZ),
            sr = Math.sin(angleX),
            sp = Math.sin(angleY),
            sy = Math.sin(angleZ),

            w = cr * cp * cy + -sr * sp * -sy,
            x = sr * cp * cy - -cr * sp * -sy,
            y = cr * sp * cy + sr * cp * sy,
            z = cr * cp * sy - -sr * sp * -cy,

            m0 = 1 - 2 * (y * y + z * z),
            m1 = 2 * (x * y + z * w),
            m2 = 2 * (x * z - y * w),

            m4 = 2 * (x * y - z * w),
            m5 = 1 - 2 * (x * x + z * z),
            m6 = 2 * (z * y + x * w),

            m8 = 2 * (x * z + y * w),
            m9 = 2 * (y * z - x * w),
            m10 = 1 - 2 * (x * x + y * y);

        return {
            x: x1 * m0 + y1 * m4 + z1 * m8,
            y: x1 * m1 + y1 * m5 + z1 * m9,
            z: x1 * m2 + y1 * m6 + z1 * m10
        };
    }
};


var app = {};

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