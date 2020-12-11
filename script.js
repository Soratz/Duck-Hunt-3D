var camera = new Camera();

var keys = {};

var objects = [];

function main() {
    const canvas = document.createElement('canvas');
    document.querySelector('body').appendChild(canvas);

    gl = canvas.getContext("webgl"); // Initialize the GL context
    // Only continue if WebGL is available and working.
    if (gl == null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    canvas.onclick = function() {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
        
        canvas.requestPointerLock();
    }

    let vertexShaderSource = document.querySelector("#vertex-shader-3d").text;
    let fragmentShaderSource = document.querySelector("#fragment-shader-3d").text;
    let program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    positionALocation = gl.getAttribLocation(program, "a_position");
    colorALocation = gl.getAttribLocation(program, "a_color");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1.0);
    gl.useProgram(program);

    cube = new Cube(gl, 20);
    cube2 = new Cube(gl, 35);
    cube3 = new Cube(gl, 100);
    cube4 = new Cube(gl, 50);
    cylinder = new Cylinder(gl, 8, 30, 90);
    cylinder.rotation.x = degToRad(30);

    cylinder.translation = {x: -20, y: 20, z: 60};
    cube4.translation = {x: 0, y: -60, z: 10}

    cube.translation = {x: 20, y: -40, z: -70}
    cube2.translation = {x:-40, y:-30, z:-150}
    cube3.translation.y = 1000;
    cube2.scale.y = 2;

    old = 0;

    drawScene(0);
}


function drawScene(now) {
    let rotationSpeed = degToRad(17); // radian per second
    now *= 0.001; // converting to seconds
    let delta = now - old;
    checkKeys(delta); // checks the pressed keys

    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // Tell WebGL how to convert from clip space to pixels
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas and the depth buffer.

    // creating projection matrix.
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1;
    let zFar = 2000;
    let fieldOfView = 65;
    projectionMatrix = m4.perspective(fieldOfView, aspect, zNear, zFar);

    // camera operations and matrices
    var cameraMatrix = m4.identity();
    cameraMatrix = m4.xRotate(cameraMatrix, camera.rotation.x);
    cameraMatrix = m4.yRotate(cameraMatrix, camera.rotation.y);
    cameraMatrix = m4.zRotate(cameraMatrix, camera.rotation.z);
    cameraMatrix = m4.translate(cameraMatrix, camera.translation);
    var viewMatrix = m4.inverse(cameraMatrix);
    projectionMatrix = m4.multiply(viewMatrix, projectionMatrix);

    cube2.rotation.y += rotationSpeed * delta;
    cube2.rotation.z += rotationSpeed * delta;
    //cube2.rotation.x += rotationSpeed * (now - old);
    old = now;

    GameObject.objects.forEach(drawObject);

    requestAnimationFrame(drawScene);
}

function drawObject(object) {
    object.createBuffers(positionALocation, colorALocation);
    object.bufferObjectDataAndColors(gl);

    let matrix = m4.translation(object.centerTranslation);
    matrix = m4.scale(matrix, object.scale);
    matrix = m4.xRotate(matrix, object.rotation.x);
    matrix = m4.yRotate(matrix, object.rotation.y);
    matrix = m4.zRotate(matrix, object.rotation.z);
    matrix = m4.translate(matrix, object.translation);
    matrix = m4.multiply(matrix, projectionMatrix);
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, object.points.length);
}

function checkKeys(delta) {
    if(keys['87']  || keys['83']) {
        let direction = keys['87'] ? 1 : -1; // forward -> 1, backward -> -1
        camera.translation.x -= delta * camera.movSpeed * direction * Math.sin(camera.rotation.y);
        camera.translation.z -= delta * camera.movSpeed * direction * Math.cos(camera.rotation.y);
        //console.log(camera.translation);
    }

    if(keys['65']  || keys['68']) {
        let direction = keys['65'] ? 1 : -1; // left -> 1, right -> -1
        camera.translation.x -= delta * camera.movSpeed * direction * Math.sin(camera.rotation.y + Math.PI / 2);
        camera.translation.z -= delta * camera.movSpeed * direction * Math.cos(camera.rotation.y + Math.PI / 2);
        //console.log(camera.translation);
    }
}

window.onkeydown = function(e) {
    keys[e.keyCode] = true;
    e.preventDefault();
};

window.onkeyup = function(e) {
    keys[e.keyCode] = false;
    e.preventDefault();
};

window.onmousemove = function(e) {
    let limit = Math.PI / 2;
    camera.rotation.y -= camera.rotateSpeed * (e.movementX);
    
    camera.rotation.x -= camera.rotateSpeed * (e.movementY);
    
    if(camera.rotation.x > limit) {
        camera.rotation.x = limit;
    }
    else if(camera.rotation.x < -limit) {
        camera.rotation.x = -limit;
    }
}

window.onload = main;