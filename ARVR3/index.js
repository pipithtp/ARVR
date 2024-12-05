main();
function main() {
    //========== Create a WebGL Context ==========//
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('WebGL unavailable');
        return;
    } else {
        console.log('WebGL is good to go');
    }

    //========== Define and Store the Geometry ==========//
    const squares = [
        // front face
        -0.3, -0.3, -0.3,
        0.3, -0.3, -0.3,
        0.3, 0.3, -0.3,
        -0.3, -0.3, -0.3,
        -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,
        // back face
        -0.2, -0.2, 0.3,
        0.4, -0.2, 0.3,
        0.4, 0.4, 0.3,
        -0.2, -0.2, 0.3,
        -0.2, 0.4, 0.3,
        0.4, 0.4, 0.3,
        // top face
        -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,
        -0.2, 0.4, 0.3,
        0.4, 0.4, 0.3,
        0.3, 0.3, -0.3,
        -0.2, 0.4, 0.3
        //buttom face
        0.3, -0.3, 0.3,
        -0.3, -0.3, 0.3,
        0.2, -0.4, -0.3,
        -0.4, -0.4, -0.3,
        -0.3, -0.3, 0.3,
        0.2, -0.4, -0.3
    ];

    const colors = [
        // Warna biru untuk front face
        0.0, 0.0, 1.0, 1.0, // Vertex 1
        0.0, 0.0, 1.0, 1.0, // Vertex 2
        0.0, 0.0, 1.0, 1.0, // Vertex 3
        0.0, 0.0, 1.0, 1.0, // Vertex 4
        0.0, 0.0, 1.0, 1.0, // Vertex 5
        0.0, 0.0, 1.0, 1.0, // Vertex 6

        // Warna merah untuk back face
        1.0, 0.0, 0.0, 1.0, // Vertex 1
        1.0, 0.0, 0.0, 1.0, // Vertex 2
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 1.0, 0.0,
        1.0, 0.0, 1.0, 0.0,
    ];

    //====== Define front-face vertices ======//
    //====== Define front-face buffer ======//
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

    //====== Define color buffer ======//
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    //========== Shaders ==========//
    const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    void main() {
        gl_Position = aPosition;
        vColor = aVertexColor;
    }
    `;

    const fsSource = `
    varying lowp vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
    `;

    //====== Create shaders ======//
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Check for compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
    }

    // Create and link program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    //====== Connect the attribute with the vertex shader ======//
    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);

    //*========== Drawing ========== *//
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the squares//
    const mode = gl.TRIANGLES;
    const first = 0;
    const count = 18;
    gl.drawArrays(mode, first, count);
}