var camera = new Camera();
var weapon;
var keys = {};

var bullets = [];

var gameScore = 0;

function main() {
    const canvas = document.createElement('canvas');
    textCanvas = document.createElement('canvas');
    canvas.id = "gl_canvas";
    textCanvas.id = "text";
    document.querySelector('body').appendChild(canvas);
    document.querySelector('body').appendChild(textCanvas);

    ctx = textCanvas.getContext("2d");

    gl = canvas.getContext("webgl"); // Initialize the GL context
    // Only continue if WebGL is available and working.
    if (gl == null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    weapon = new Weapon(gl);
    textCanvas.onclick = function() {
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
    gl.clearColor(0.4492, 0.839, 1, 1.0);
    gl.useProgram(program);

    createMap(gl);
    weapon.updateWeaponPos(camera.translation, camera.rotation);
    weapon.updateRotation(camera.rotation);

    old = 0;

    drawScene(0);
}


function drawScene(now) {
    now *= 0.001; // converting to seconds
    let delta = now - old;
    checkKeys(delta); // checks the pressed keys

    resize(gl.canvas, textCanvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // Tell WebGL how to convert from clip space to pixels
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas and the depth buffer.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clears text canvas.

    // creating projection matrix.
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let zNear = 1;
    let zFar = 5000;
    let fieldOfView = camera.fieldOfView;
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

    bullets.forEach((bullet) => {
        bullet.moveBullet(delta);
    });

    GameObject.objects.forEach(drawObject);
    
    ctx.textAlign = "left";
    ctx.font = "40px Arial";
    ctx.strokeStyle = 'white';
    ctx.strokeText("Score: " + gameScore, 10, 40);
    ctx.textAlign = "center";
    ctx.font = "35px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("+", textCanvas.width/2, textCanvas.height/2 + 15);
    ctx.strokeStyle = 'black';
    ctx.strokeText("+", textCanvas.width/2, textCanvas.height/2 + 15);
    ctx.textAlign = "start";
    ctx.fillStyle = 'white';
    ctx.font = "15px Arial";
    ctx.fillText("Run: Shift", 10, textCanvas.height - 50);
    ctx.fillText("Crouch: C", 10, textCanvas.height - 30);
    ctx.fillText("Zoom: Space", 10, textCanvas.height - 10);
    ctx.textAlign = "end";
    ctx.fillStyle = 'white';
    ctx.font = "15px Arial";
    ctx.fillText("By Forosulion & Zerard", textCanvas.width - 10, textCanvas.height - 10)

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
            var x = camera.translation.x - delta * camera.movSpeed * direction * Math.sin(camera.rotation.y);
            var z = camera.translation.z - delta * camera.movSpeed * direction * Math.cos(camera.rotation.y);
            if(x<90 &&  x > -72){
                camera.translation.x = x;
                weapon.updateWeaponPos(camera.translation, camera.rotation);
                }
            if (z <70 && z > -30){
                camera.translation.z = z;
                weapon.updateWeaponPos(camera.translation, camera.rotation);
            }
            
        }

        if(keys['65']  || keys['68']) {
            let direction = keys['65'] ? 1 : -1; // left -> 1, right -> -1
            var x = camera.translation.x -  delta * camera.movSpeed * direction * Math.sin(camera.rotation.y + Math.PI / 2);
            var z = camera.translation.z - delta * camera.movSpeed * direction * Math.cos(camera.rotation.y + Math.PI / 2);
            if(x<90 &&  x > -72){
            camera.translation.x = x;
            weapon.updateWeaponPos(camera.translation, camera.rotation);
            }
            if (z <70 && z > -30){
                camera.translation.z = z;
                weapon.updateWeaponPos(camera.translation, camera.rotation);
            }
        }

        if(keys['16'] && camera.isCrouched == false) {
        camera.movSpeed = camera.runSpeed;
        camera.isRunning = true;
        }

        if(camera.isRunning == true && keys['16'] != 1){
            camera.movSpeed = camera.walkSpeed;
            camera.isRunning = false;
        }

        if(keys['32'] && camera.isZoomed == false) {
            camera.fieldOfView = camera.zoomFOV;
            camera.rotateSpeed = camera.zoomRotateSpeed;
            camera.isZoomed = true;
        } 
        else if(camera.isZoomed == true && !keys['32']) {
            camera.fieldOfView = camera.normalFOV;
            camera.rotateSpeed = camera.normalRotateSpeed;
            camera.isZoomed = false;
        }
}

window.onkeydown = function(e) {
    keys[e.keyCode] = true;
    // 32
    
    if(e.keyCode == "67" && camera.isRunning == false){
        if(camera.isCrouched == false ){
        camera.translation.y -= camera.crouchAmount;
        camera.movSpeed -= camera.crouchSpeed;
        weapon.updateWeaponPos(camera.translation, camera.rotation);
        camera.isCrouched = true;
        }
        else{
        camera.translation.y += camera.crouchAmount;
        camera.movSpeed += camera.crouchSpeed;
        weapon.updateWeaponPos(camera.translation, camera.rotation);
        camera.isCrouched = false;
        }
    }
    
    e.preventDefault();
};

window.onkeyup = function(e) {
    keys[e.keyCode] = false;
    e.preventDefault();
};

window.onmousedown = function(e){

    var bullet = new Bullet(gl, 10, 0.3, 1);
    
    bullet.translation = {  x: camera.translation.x - 10 * Math.cos(camera.rotation.x ) * Math.sin(camera.rotation.y), 
                            y: camera.translation.y + 10 * Math.sin(camera.rotation.x), 
                            z: camera.translation.z - 10 * Math.cos(camera.rotation.x ) * Math.cos(camera.rotation.y) };
                        

    bullet.rotation = { x: camera.rotation.x + Math.PI / 2, 
                        y: camera.rotation.y,
                        z: camera.rotation.z};

    var horizontalV = Math.sin(bullet.rotation.x);

    bullet.bulletVector = {x: bullet.speed * Math.sin(bullet.rotation.y ) * horizontalV,
                           y: bullet.speed * Math.cos(bullet.rotation.x ), 
                           z: bullet.speed * Math.cos(bullet.rotation.y ) * horizontalV};
    bullets.push(bullet);
}

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

    weapon.updateWeaponPos(camera.translation, camera.rotation);
    weapon.updateRotation(camera.rotation);
    
}

window.onload = main;