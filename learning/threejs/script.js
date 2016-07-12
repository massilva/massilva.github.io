(function () {
    'use strict';

    function init() {

        var width = window.innerWidth,
            height = window.innerHeight,
            scene = new THREE.Scene(),
            renderer = new THREE.WebGLRenderer(),
            squareGeometry = new THREE.Geometry(),
            barGeometry = new THREE.Geometry(),
            squareMaterial = new THREE.MeshBasicMaterial({
                color: '#FFFFFF',
                side: THREE.DoubleSide
            }),
            midHeight = height / 2,
            midWidth = width / 2,
            sizeBar = midWidth / 4,
            squaresCount = 15,
            squareMesh,
            circleMesh,
            geometry,
            camera,
            size;

        renderer.setClearColor(new THREE.Color(0.0, 0.5, 0.0));
        renderer.setSize(width, height);

        camera = new THREE.OrthographicCamera(-midWidth, midWidth, midHeight, -midHeight);
        camera.position.set(0, 0, 10);
        camera.lookAt(scene.position);
        scene.add(camera);

        size = 20;
        squareGeometry.vertices.push(new THREE.Vector3(-size,  size, 0.0));
        squareGeometry.vertices.push(new THREE.Vector3(size,  size, 0.0));
        squareGeometry.vertices.push(new THREE.Vector3(size, -size, 0.0));
        squareGeometry.vertices.push(new THREE.Vector3(-size, -size, 0.0));
        squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
        squareGeometry.faces.push(new THREE.Face3(0, 2, 3));

        while (squaresCount--) {
            squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
            squareMesh.position.set(-width / 4 + squaresCount * 50, height / 2 - 50, 0);
            scene.add(squareMesh);
        }

        geometry = new THREE.CircleGeometry(15, 64);
        circleMesh = new THREE.Mesh(geometry, squareMaterial);
        circleMesh.position.set(0, -height / 2 + 100, 0);
        scene.add(circleMesh);

        barGeometry.vertices.push(new THREE.Vector3(-sizeBar, size / 2, 0.0));
        barGeometry.vertices.push(new THREE.Vector3(sizeBar, size / 2, 0.0));
        barGeometry.vertices.push(new THREE.Vector3(sizeBar, -size / 2, 0.0));
        barGeometry.vertices.push(new THREE.Vector3(-sizeBar, -size / 2, 0.0));
        barGeometry.faces.push(new THREE.Face3(0, 1, 2));
        barGeometry.faces.push(new THREE.Face3(0, 2, 3));

        squareMesh = new THREE.Mesh(barGeometry, squareMaterial);
        squareMesh.position.set(0, -height / 2 + 50, 0);
        scene.add(squareMesh);

        document.getElementById("WebGL-output").appendChild(renderer.domElement);

        renderer.clear();
        renderer.render(scene, camera);

    }

    window.init = init;

}());
