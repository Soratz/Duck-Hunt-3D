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

    checkCollision() {
        let collision = false;
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
                    console.log(distance + ":" + (target.hitRadius + this.hitRadius));
                    collision = true;
                }
            } 
        });
        return collision;
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