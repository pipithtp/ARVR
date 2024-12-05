import * as THREE from './modules/three.module.js';

main();

function main() {
    // Membuat context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    // Membuat kamera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // Membuat scene
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();

    // Memuat tekstur untuk background atas
    const backgroundTexture = textureLoader.load('textures/galaxy_red.jpg');

    // Membuat plane atas
    const upperPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const upperPlaneMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        side: THREE.DoubleSide
    });
    const upperPlane = new THREE.Mesh(upperPlaneGeometry, upperPlaneMaterial);
    upperPlane.rotation.x = -Math.PI / 2; // Memutar plane
    upperPlane.position.y = 20; // Menempatkan plane di atas
    scene.add(upperPlane);

    // GEOMETRY
    // Membuat kubus
    const cubeSize = 5.5;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);  

    // Membuat bola (Planet Jupiter)
    const sphereRadius = 4;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);

    // MATERIALS
    const waterTexture = textureLoader.load('textures/texture_water.jpeg'); // Memuat tekstur air
    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: waterTexture // Menggunakan tekstur air
    });

    // Memuat tekstur Jupiter
    const jupiterTexture = textureLoader.load('textures/planet_jupiter.png');
    const sphereMaterial = new THREE.MeshStandardMaterial({
        map: jupiterTexture // Menggunakan tekstur Jupiter
    });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

    // LIGHTS
    const color = 0xffffff;
    const intensity = 0.7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 30, 30);
    scene.add(light);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // PARTIKEL HUJAN API
    const particleCount = 1000;
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16); // Geometri bulat untuk partikel
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5500, // Warna api
        transparent: true,
        opacity: 0.8
    });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 50, // x
            Math.random() * 30 + 10,    // y
            (Math.random() - 0.5) * 50   // z
        );
        scene.add(particle);
    }

    // DRAW
    function draw(time) {
        time *= 0.001;

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube.rotation.z += 0.01;

        sphere.rotation.y += 0.01; // Putar planet Jupiter

        // Gerakkan partikel hujan api ke bawah
        scene.children.forEach(child => {
            if (child.geometry instanceof THREE.SphereGeometry && child.material.color.getHex() === 0xff5500) {
                child.position.y -= 0.1; // Kecepatan jatuh
                if (child.position.y < 0) {
                    child.position.y = Math.random() * 30 + 10; // Reset posisi y
                }
            }
        });

        light.position.x = 20 * Math.cos(time);
        light.position.y = 20 * Math.sin(time);

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}