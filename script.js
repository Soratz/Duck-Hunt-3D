var camera = new Camera();

var keys = {};

var objects = [];

var crouched = false;


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

    createMap(gl);

    old = 0;

    drawScene(0);
}


function drawScene(now) {
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

    updateObjects(delta);
    
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

    if(keys['16'] && camera.isCrouched == false) {
       camera.movSpeed = camera.runSpeed;
       camera.isRunning = true;
    }

    if(camera.isRunning == true && keys['16'] != 1){
        camera.movSpeed = camera.walkSpeed;
        camera.isRunning = false;
    }

    
}

window.onkeydown = function(e) {
    keys[e.keyCode] = true;
    
    if(e.keyCode == "67" && camera.isRunning == false){
        if(camera.isCrouched == false ){
        camera.translation.y -= camera.crouchAmount;
        camera.movSpeed -= camera.crouchSpeed;
        camera.isCrouched = true;
        }
        else{
        camera.translation.y += camera.crouchAmount;
        camera.movSpeed += camera.crouchSpeed;
        camera.isCrouched = false;
        }
    }
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