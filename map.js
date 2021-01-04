//
var randomSpawner;

function createMap(gl) {
    floor = new Cube(gl, 60);
    ringPole1 = new Cube(gl, 5);
    ringPole2 = new Cube(gl, 5);
    ringPole3 = new Cube(gl, 5);
    ringPole4 = new Cube(gl, 5);
    ringString341 = new Cylinder(gl, 20, 1, 2);
    ringString342 = new Cylinder(gl, 20, 1, 2);
    ringString141 = new Cylinder(gl, 20, 1, 2);
    ringString142 = new Cylinder(gl, 20, 1, 2);
    ringString121 = new Cylinder(gl, 20, 1, 2);
    ringString122 = new Cylinder(gl, 20, 1, 2);
    wallBehind = new Cube(gl, 2);

    grass = new Cube(gl, 1);

    mountain = new Triangle(gl, 100);
    mountain.translation.z = 2000;
    mountain.translation.y = 400;
    mountain.translation = {x: 600, y:468, z: 2000};
    mountain.scale.x = 10;
    mountain.scale.y = 10;
    mountain.setColor(90, 61, 32);

    mountainPeek = new Triangle(gl, 20);
    mountainPeek.translation = {x: 600, y:468, z: 1998};
    mountainPeek.scale.x = 10;
    mountainPeek.scale.y = 10;
    mountainPeek.setColor(230, 230, 230);

    praise = new Cylinder(gl, 25, 400, 1);
    praise.rotation.y = degToRad(-30);
    praise.rotation.x = degToRad(80);
    praise.rotation.z = degToRad(-20);
    praise.setAllColors(249,215,28);
    
    praise.translation = {x: -1100, y:2500, z: 2200};
    cloud11= new Cube(gl, 150);
    cloud11.translation = {x: 300, y: 940, z: 1800}
    cloud11.setColor(230, 230, 230);
    cloud11.scale.x = 2
    cloud12= new Cube(gl, 100);
    cloud12.translation = {x: 150, y: 905, z: 1800}
    cloud12.setColor(230, 230, 230);
    cloud13= new Cube(gl, 100);
    cloud13.translation = {x: 450, y: 905, z: 1800}
    cloud13.setColor(230, 230, 230);

    cloud21= new Cube(gl, 130);
    cloud21.translation = {x: 800, y: 800, z: 1800}
    cloud21.setColor(230, 230, 230);
    cloud22= new Cube(gl, 90);
    cloud22.translation = {x: 700, y: 810, z: 1800}
    cloud22.setColor(230, 230, 230);
    cloud23= new Cube(gl, 90);
    cloud23.translation = {x: 900, y: 810, z: 1800}
    cloud23.setColor(230, 230, 230);

    tree1body = new Cylinder(gl, 12, 6, 180); //brown
    tree1body.setAllColors(81,69,48);
    tree1branch1 = new Cylinder(gl, 12, 3, 50); //brown (lighter maybe?)
    tree1branch1.setAllColors(81,69,48);
    tree1leaf1 = new Cube(gl, 70) //green
    tree1leaf1.setColor(19, 78, 49);
    tree1leaf2 = new Cube(gl, 20) //green
    tree1leaf2.setColor(19, 78, 49);

    tree2body = new Cylinder(gl, 8, 8, 300); //brown
    tree2body.setAllColors(160,82,45);
    tree2branch1 = new Cylinder(gl, 8, 5, 90)
    tree2branch1.setAllColors(160,82,45);
    tree2branch2 = new Cylinder(gl, 6, 4, 50)
    tree2branch2.setAllColors(160,82,45);
    tree2leaf1 = new Cube(gl, 150)
    tree2leaf1.setColor(19, 78, 19);
    tree2leaf2 = new Cube(gl, 50)
    tree2leaf2.setColor(19, 78, 19);
    tree2leaf3 = new Cube(gl, 30);
    tree2leaf3.setColor(19, 78, 19);

    tree3body = new Cylinder(gl, 8, 8, 250);
    tree3body.setAllColors(139,90,43);
    tree3leaf1 = new Cube(gl, 120)
    tree3leaf1.setColor(78, 19, 48);
    tree3leaf2 = new Cube(gl, 70)
    tree3leaf2.setColor(78, 19, 48);

    randomSpawner = new RandomSpawner(1, 5);
    duck = new Duck(gl);

    duck.translation = {x: 20, y: 10, z: 200};

    floor.translation = {x: 10, y: -50, z: 20}
    floor.scale.x = 3;
    floor.scale.z = 2;
    
    ringPole1.translation = {x: 95, y: -10, z: 75};
    ringPole1.scale.y = 5;
    ringPole1.setColor(127, 106, 94);

    ringPole2.translation = {x: -75, y: -10, z: 75};
    ringPole2.scale.y = 5;
    ringPole2.setColor(127, 106, 94);

    ringPole3.translation = {x: 95, y: -10, z: -35};
    ringPole3.scale.y = 5;
    ringPole3.setColor(127, 106, 94);

    ringPole4.translation = {x: -75, y: -10, z: -35};
    ringPole4.scale.y = 5;
    ringPole4.setColor(127, 106, 94);

    ringString341.translation = {x: -75, y: -13, z: -40};
    ringString341.scale.y = 60;
    ringString341.rotation.x = degToRad(90);

    ringString342.translation = {x: -75, y: -2, z: -40};
    ringString342.scale.y = 60;
    ringString342.rotation.x = degToRad(90);

    ringString141.translation = {x: 100, y: -13, z: 75};
    ringString141.scale.y = 90;
    ringString141.rotation.z = degToRad(90);

    ringString142.translation = {x: 100, y: -7, z: 75};
    ringString142.scale.y = 90;
    ringString142.rotation.z = degToRad(90);

    ringString121.translation = {x: 95, y: -13, z: -40};
    ringString121.scale.y = 60;
    ringString121.rotation.x = degToRad(90);

    ringString122.translation = {x: 95, y: -2, z: -40};
    ringString122.scale.y = 60;
    ringString122.rotation.x = degToRad(90);

    wallBehind.translation = {x: 10, y: 0, z: -40};
    wallBehind.scale.y = 20;
    wallBehind.scale.x = 90;
    wallBehind.setColor(106, 78, 56);

    tree1body.translation = { x: 250, y: -70, z: 250};
    tree1branch1.translation = {x: 250, y: 20, z: 250};
    tree1branch1.rotation.z = degToRad(45);
    tree1leaf1.translation = {x: 250, y: 110, z: 250};
    tree1leaf1.scale.y = 0.75;
    tree1leaf2.translation = {x: 210, y: 60, z: 250}
    tree1leaf2.rotation.z = degToRad(45);

    tree2body.translation = { x: -400, y: -70, z: 800};
    tree2branch1.translation = {x: -400, y: 50, z: 800};
    tree2branch1.rotation.z = degToRad(-30); 

    tree2branch2.translation = {x: -400, y: 30, z: 800}
    tree2branch2.rotation.z = degToRad(45);

    tree2leaf1.translation = {x: -400, y: 240, z: 800};
    tree2leaf1.scale.y = 0.70;

    tree2leaf2.translation = {x: -330, y: 140, z: 800};
    tree2leaf2.scale.y = 1.5;
    tree2leaf2.rotation.z = degToRad(60);

    tree2leaf3.translation = {x: -440, y: 70, z: 800}
    tree2leaf3.rotation.z = degToRad(45);

    tree3body.translation = {x: -250, y: -70, z:200}
    tree3leaf1.translation = {x: -250, y: 110, z:200}
    tree3leaf1.scale.y = 0.5;
    tree3leaf2.translation = {x: -250, y: 150, z:200}

    grass.translation.y = -70;
    grass.scale.x = 10000;
    grass.scale.z = 10000;
    grass.setColor(38, 139, 7);

    //floor.setColor(150, 50, 50);  
    floor.setColor(110, 22, 29);
}   

/**
 * 
 * @param {number} delta 
 */
function updateObjects(delta) {
    randomSpawner.spawnTime -= delta;
    if(randomSpawner.spawnTime <= 0) {
        if(Duck.objects.length <= randomSpawner.spawnLimit) {
            let duck = new Duck(gl);
            duck.translation = {x: randomSpawner.x, y: randomSpawner.y, z: randomSpawner.z};
            randomSpawner.updateSpawnVariables();
        }
    }

    Duck.objects.forEach(element => {
       element.moveRandom(delta);
    });
}

class RandomSpawner {
    constructor(minTime, maxTime) {
        this.min_time = minTime;
        this.max_time = maxTime;
        this.maxZ = 370;
        this.minZ = 200;
        this.maxY = 100;
        this.minY = 0;
        this.maxX = 200;
        this.minX = -200;
        this.spawnLimit = 20;
        this.updateSpawnVariables();
    }

    updateSpawnVariables() {
        this.spawnTime = this.randomValue(this.min_time, this.max_time);
        this.x = this.randomValue(this.minX, this.maxX);
        this.y = this.randomValue(this.minY, this.maxY);
        this.z = this.randomValue(this.minZ, this.maxZ);
    }

    randomValue(min, max) {
        return Math.random() * (max - min) + min;
    }
}