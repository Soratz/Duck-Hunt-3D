//
function createMap(gl) {
    floor = new Cube(gl, 60);
    ringPole1 = new Cube(gl, 5);
    ringPole2 = new Cube(gl, 5);
    ringPole3 = new Cube(gl, 5);
    ringPole4 = new Cube(gl, 5);
    ringString341 = new Cylinder(gl, 20, 2, 2);
    ringString342 = new Cylinder(gl, 20, 1, 2);
    ringString141 = new Cylinder(gl, 20, 2, 2);
    ringString142 = new Cylinder(gl, 20, 2, 2);
    ringString121 = new Cylinder(gl, 20, 2, 2);
    ringString122 = new Cylinder(gl, 20, 2, 2);
    wallBehind = new Cube(gl, 2);

    floor.translation = {x: 10, y: -50, z: 20}
    floor.scale.x = 3;
    floor.scale.z = 2;
    
    ringPole1.translation = {x: 95, y: -10, z: 75};
    ringPole1.scale.y = 5;

    ringPole2.translation = {x: -75, y: -10, z: 75};
    ringPole2.scale.y = 5;

    ringPole3.translation = {x: 95, y: -10, z: -35};
     ringPole3.scale.y = 5;

    ringPole4.translation = {x: -75, y: -10, z: -35};
    ringPole4.scale.y = 5;

    ringString341.translation = {x: -75, y: -13, z: 20};
    ringString341.scale.z = 60;

    ringString342.translation = {x: -75, y: -2, z: -40};
    ringString342.scale.y = 60;
    ringString342.rotation.x = degToRad(90);

    ringString141.translation = {x: 10, y: -13, z: 75};
    ringString141.scale.x = 90;

    ringString142.translation = {x: 10, y: -7, z: 75};
    ringString142.scale.x = 90;

    ringString121.translation = {x: 95, y: -13, z: 20};
    ringString121.scale.z = 60;

    ringString122.translation = {x: 95, y: -2, z: 20};
    ringString122.scale.z = 60;

    wallBehind.translation = {x: 10, y: 0, z: -40};
    wallBehind.scale.y = 20;
    wallBehind.scale.x = 90;

}

/**
 * 
 * @param {number} delta 
 */
function updateObjects(delta) {
    let rotationSpeed = degToRad(17); // radian per second
    ringString121.rotation= rotationSpeed;

}