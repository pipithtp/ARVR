// Get the WebGL context
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported or failed to initialize");
}

// Vertex Shader Source
const vertexShaderSource = `
    attribute vec4 aPosition;
    uniform mat4 uModelViewMatrix;
    void main() {
        gl_Position = uModelViewMatrix * aPosition;
    }
`;

// Fragment Shader Source
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.5, 0.7, 1.0, 1.0); // Light blue color
    }
`;

// Compile shader function
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create shader program
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program:", gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Define the cube's vertices
const vertices = new Float32Array([
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Back face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5,  0.5, -0.5,
]);

// Create buffer and bind data
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Get the attribute location and enable it
const aPosition = gl.getAttribLocation(program, "aPosition");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

// Set up scaling
const uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");
let scaleFactor = 1.0;
let growing = true;

// Draw the scaling object
function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create scaling matrix
    const modelViewMatrix = mat4.create();
    mat4.scale(modelViewMatrix, modelViewMatrix, [scaleFactor, scaleFactor, scaleFactor]);

    // Update scale factor
    if (growing) {
        scaleFactor += 0.01;
        if (scaleFactor >= 2.0) growing = false; // Stop growing at scale 2
    } else {
        scaleFactor -= 0.01;
        if (scaleFactor <= 1.0) growing = true; // Start growing again
    }

    // Send matrix to shader
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    // Draw the object
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // Front face
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4); // Back face

    // Animate
    requestAnimationFrame(drawScene);
}

// Initialize the canvas
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
drawScene();