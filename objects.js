//

class GameObject {
    static objects = [];
    constructor(gl) {
        this.translation = {
            x: 0,
            y: 0,
            z: 0
        }
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        }
        this.scale = {
            x: 1,
            y: 1,
            z: 1
        }
        this.points = [];
        this.colors = [];
        this.centerTranslation = {
            x: 0, y: 0, z: 0
        }
        this.hitRadius = 1
        
        this.posBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        GameObject.objects.push(this);
    }

    die() {
        let index = GameObject.objects.indexOf(this);
        GameObject.objects.splice(index, 1);
        delete this;
    }

    checkCollision() {
        let collidedTarget = null;
        GameObject.objects.forEach((target) => {
            if(target != this) {
                let distance = 0;
                let diff = this.translation.x - target.translation.x;
                distance += diff * diff;
                diff = this.translation.y - target.translation.y;
                distance += diff * diff;
                diff = this.translation.z - target.translation.z;
                distance += diff * diff;
                distance = Math.sqrt(distance);
                
                if(distance <= target.hitRadius + this.hitRadius) {
                    //console.log(distance + ":" + (target.hitRadius + this.hitRadius));
                    collidedTarget = target;
                    return;
                }
            } 
        });
        return collidedTarget;
    }

    createBuffers(positionALocation, colorALocation) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 3;          // 3 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionALocation, size, type, normalize, stride, offset);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(colorALocation, size, gl.UNSIGNED_BYTE, true, stride, offset);

        gl.enableVertexAttribArray(positionALocation);
        gl.enableVertexAttribArray(colorALocation);
    }

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    bufferObjectDataAndColors(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this.colors), gl.STATIC_DRAW);
    }
}

class Cube extends GameObject {
    constructor(gl, edge) {
        super(gl);

        let half = edge / 2;
        this.hitRadius = 1.18 * half;
        this.centerTranslation = {
            x: -half,
            y: -half,
            z: -half
        };

        this.points = [
            // front
            0,    0,    0,
            0,    edge, 0,
            edge, 0,    0,

            0,    edge, 0,
            edge, 0,    0,
            edge, edge, 0,
            
            // back
            0,    0,    edge,
            0,    edge, edge,
            edge, 0,    edge,

            0,    edge, edge,
            edge, 0,    edge,
            edge, edge, edge,

            //right
            edge, 0,    0,
            edge, edge, 0, 
            edge, 0,    edge,

            edge, edge, 0, 
            edge, 0,    edge,
            edge, edge, edge,

            //left
            0,    0,    0,
            0,    edge, 0, 
            0,    0,    edge,

            0,    edge, 0, 
            0,    0,    edge,
            0,    edge, edge,

            //bottom
            edge, 0,    0,
            0,    0,    0,
            edge, 0,    edge,
            0,    0,    0,
            edge, 0,    edge,
            0,    0,    edge,

            //top
            edge, edge, 0,
            0,    edge, 0,
            edge, edge, edge,
            0,    edge, 0,
            edge, edge, edge,
            0,    edge, edge,
        ];

        this.colors = [
            190, 30, 30,
            190, 30, 30,
            190, 30, 30,
            190, 30, 30,
            190, 30, 30,
            190, 30, 30,

            20, 190, 20,
            20, 190, 20,
            20, 190, 20,
            20, 190, 20,
            20, 190, 20,
            20, 190, 20,

            0, 50, 190,
            0, 50, 190,
            0, 50, 190,
            0, 50, 190,
            0, 50, 190,
            0, 50, 190,

            180, 20, 180,
            180, 20, 180,
            180, 20, 180,
            180, 20, 180,
            180, 20, 180,
            180, 20, 180,

            200, 200, 0,
            200, 200, 0,
            200, 200, 0,
            200, 200, 0,
            200, 200, 0,
            200, 200, 0,

            0, 180, 180,
            0, 180, 180,
            0, 180, 180,
            0, 180, 180,
            0, 180, 180,
            0, 180, 180
        ];
    }
}

class Cylinder extends GameObject {
    constructor(gl, num_of_vertices, radius, height) {
        super(gl); // calling super constructor
        let radian = degToRad(360 / num_of_vertices);

        this.hitRadius = radius;

        if (num_of_vertices < 3) {
            num_of_vertices = 3;
        }
        
        let old_point = {
            x: radius,
            z: 0
        }

        for(let i = 1; i <= num_of_vertices; i++) {
            //console.log(old_point);
            let point = {
                x: Math.cos(radian * i) * radius,
                z: Math.sin(radian * i) * radius
            }

            // front
            this.points.push([0, 0, 0]);
            this.points.push([old_point.x, 0, old_point.z]);
            this.points.push([point.x, 0, point.z]);
            this.colors.push([200, 200, 200, 200, 200, 200, 200, 200, 200]);

            // back
            this.points.push([0, height, 0]); 
            this.points.push([old_point.x, height, old_point.z]);
            this.points.push([point.x, height, point.z]);
            this.colors.push([100, 100, 100, 100, 100, 100, 100, 100, 100]);

            //vertical panels
            this.points.push([old_point.x, 0, old_point.z]);
            this.points.push([old_point.x, height, old_point.z]);
            this.points.push([point.x, 0, point.z]);
            this.points.push([old_point.x, height, old_point.z]);
            this.points.push([point.x, 0, point.z]);
            this.points.push([point.x, height, point.z]);
            this.colors.push([70, 70, 70, 70, 70, 70, 70, 70, 70]);
            this.colors.push([70, 70, 70, 70, 70, 70, 70, 70, 70]);

            old_point = point;
        }

        this.points = this.points.flat();
        this.colors = this.colors.flat();
    }
}

class Camera {
    constructor() {
        this.translation = {
            x: 0,
            y: 0,
            z: 0
        }
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        }

        this.movSpeed = 80;
        this.runSpeed = 500;
        this.walkSpeed = 80;
        this.rotateSpeed = 0.007;
        this.crouchAmount = 8;
        this.crouchSpeed = 60;
        this.isRunning = false;
        this.isCrouched = false;
        this.fieldOfView = 67;
    }
}

class Bullet extends Cylinder{
    constructor(gl, num_of_vertices, radius, height) {
        super(gl, num_of_vertices, radius, height);

        this.translation = {
            x: 0,
            y: 0,
            z: 0
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

        this.bulletVector = {
            x: 0,
            y: 0,
            z: 0
        };

        this.speed = 500;
    }
    
    moveBullet(delta) {
        let target = this.checkCollision();
        if(target instanceof Duck) {
            target.die();
            this.die();
            gameScore += 1;
        } else {
            this.translation.x -= delta  * this.bulletVector.x;
            this.translation.y -= delta  * this.bulletVector.y; 
            this.translation.z -= delta  * this.bulletVector.z;
        }
    }
}


class Duck extends GameObject {
    constructor(gl) {
        super(gl);

        this.hitRadius = 5;
        this.scale.y = 1.3;
        this.centerTranslation = {
            x: -7.2,
            y: -0.75,
            z: 0
        }
        this.points = [
            // left eye
            2.5, 2.2, 0.05,
            2.75, 2.1, 0.05,
            3, 2.25, 0.05,

            2.5, 2.2, 0.05,
            2.79, 2.34, 0.05,
            3, 2.25, 0.05,

            // right eye
            2.5, 2.2, -0.05,
            2.75, 2.1, -0.05,
            3, 2.25, -0.05,

            2.5, 2.2, -0.05,
            2.79, 2.34, -0.05,
            3, 2.25, -0.05,

            //head
            0.9, 1.3, 0, 
            1,   1,   0,
            1.3, 1.5, 0,

            1,   1,   0,
            1.3, 1.5, 0,
            1.75, 1.05,  0,

            1.3, 1.5, 0,
            1.75, 1.05,  0,
            1.9, 1.85, 0,

            1.75, 1.05,  0,
            1.9, 1.85, 0,
            2.1, 2.1, 0,

            1.75, 1.05,  0,
            2.1, 2.1, 0,
            2.37, 1.16, 0,

            2.1, 2.1, 0,
            2.37, 1.16, 0,
            2.6, 2.6, 0,

            2.37, 1.16, 0,
            2.6, 2.6, 0,
            3, 1.05, 0,
            
            2.6, 2.6, 0,
            3, 1.05, 0,
            3, 2.7, 0,

            3, 1.05, 0,
            3, 2.7, 0,
            4.2, 1.05, 0,

            3, 2.7, 0,
            4.2, 1.05, 0,
            3.9, 2.4, 0,

            4.2, 1.05, 0,
            3.9, 2.4, 0,
            5.6, 1.1, 0,

            3.9, 2.4, 0,
            5.6, 1.1, 0,
            4.4, 2.15, 0,

            5.6, 1.1, 0,
            4.4, 2.15, 0,
            4.7, 2.05, 0,

            5.6, 1.1, 0,
            4.7, 2.05, 0,
            5.0, 2.1, 0,

            5.6, 1.1, 0,
            5.0, 2.1, 0,
            6.0, 2.25, 0,

            // body
            5.6, 1.1, 0,
            6.0, 2.25, 0,
            5.5, -1.15, 0,

            6.0, 2.25, 0,
            5.5, -1.15, 0,
            5.28, -3, 0,

            6.0, 2.25, 0,
            5.28, -3, 0,
            7, -3, 0,

            5.28, -3, 0,
            7, -3, 0,
            5.05, -4.27, 0,

            7, -3, 0,
            5.05, -4.27, 0,
            4.7, -5.25, 0,

            7, -3, 0,
            4.7, -5.25, 0,
            5, -5.27, 0,

            7, -3, 0,
            5, -5.27, 0,
            5.25, -5.22, 0,

            7, -3, 0,
            5.25, -5.22, 0,
            5.8, -5, 0,

            7, -3, 0,
            5.8, -5, 0,
            6.25, -4.85, 0,

            7, -3, 0,
            6.25, -4.85, 0,
            7, -4, 0,

            7, -3, 0,
            7, -4, 0,
            7.5, -3, 0,

            7, -3, 0,
            7.5, -3, 0,
            8, -2, 0,

            7, -3, 0,
            8, -2, 0,
            8.25, -1, 0, //////////////////// önemli

            7, -3, 0,
            6, 2.25, 0,
            7, 2.3, 0,

            7, -3, 0,
            7, 2.3, 0,
            8.25, -1, 0,

            7, 2.3, 0,
            8.25, -1, 0,
            8, 2.25, 0,

            8.25, -1, 0,
            8, 2.25, 0,
            8.53, -0.5, 0,

            8, 2.25, 0,
            8.53, -0.5, 0,
            9.2, 1.95, 0,

            8.53, -0.5, 0,
            9.2, 1.95, 0,
            9.1, -0.54, 0,

            9.2, 1.95, 0,
            9.1, -0.54, 0,
            9.9, -0.46, 0,

            9.2, 1.95, 0,
            9.9, -0.46, 0,
            10.5, 1.4, 0,

            9.9, -0.46, 0,
            10.5, 1.4, 0,
            10.8, 0, 0,

            10.5, 1.4, 0,
            10.8, 0, 0,
            11.3, 0.9, 0,

            10.8, 0, 0,
            11.3, 0.9, 0,
            11.37, 0.07, 0,

            11.3, 0.9, 0,
            11.37, 0.07, 0,
            11.6, 0.7, 0,

            11.37, 0.07, 0,
            11.6, 0.7, 0,
            12, 0.04, 0,

            11.6, 0.7, 0,
            12, 0.04, 0,
            12, 0.6, 0,

            12, 0.04, 0,
            12, 0.6, 0,
            12.6, 0.5, 0,

            12, 0.04, 0,
            12.6, 0.5, 0,
            12.46, 0.04, 0,

            12.6, 0.5, 0,
            12.46, 0.04, 0,
            12.75, 0.16, 0,

            12.6, 0.5, 0,
            12.75, 0.16, 0,
            13.0, 0.4, 0,

            12.75, 0.16, 0,
            13.0, 0.4, 0,
            13.3, 0.25, 0,

        ];

        this.colors = [
            // left eye
            20, 20, 20,
            20, 20, 20,
            20, 20, 20,

            20, 20, 20,
            20, 20, 20,
            20, 20, 20,

            // right eye
            20, 20, 20,
            20, 20, 20,
            20, 20, 20,

            20, 20, 20,
            20, 20, 20,
            20, 20, 20,

            // burun
            255, 127, 0,
            255, 127, 0,
            255, 127, 0,

            255, 127, 0,
            255, 127, 0,
            255, 127, 0,

            255, 127, 0,
            255, 127, 0,
            255, 127, 0,

            255, 127, 0,
            255, 127, 0,
            255, 127, 0,

            255, 127, 0,
            255, 127, 0,
            255, 127, 0,

            // head
            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            180, 180, 180,
            180, 180, 180,
            180, 180, 180,

            // body
            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            // 8

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            // 16

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            // 24

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            255, 255, 255,
            255, 255, 255,
            255, 255, 255,

            // 32

        ];
    }
}