//
function createMap() {
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
}

/**
 * 
 * @param {number} delta 
 */
function updateObjects(delta) {
    let rotationSpeed = degToRad(17); // radian per second

    cube2.rotation.y += rotationSpeed * delta;
    cube2.rotation.z += rotationSpeed * delta;
}