// Initialize WebGL context
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported or failed to initialize");
}

// Vertex Shader source
const vertexShaderSource = `
    attribute vec4 aPosition;
    uniform mat4 uModelViewMatrix;
    void main() {
        gl_Position = uModelViewMatrix * aPosition;
    }
`;

// Fragment Shader source
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color
    }
`;

// Compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create program
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program", gl.getProgramInfoLog(program));
}

// Define a square
const vertices = new Float32Array([
    -0.5, -0.5,  // Bottom-left
     0.5, -0.5,  // Bottom-right
     0.5,  0.5,  // Top-right
    -0.5,  0.5   // Top-left
]);

const indices = new Uint16Array([
    0, 1, 2,  // Triangle 1
    0, 2, 3   // Triangle 2
]);

// Create buffers for the square
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Set up the attribute locations
const aPosition = gl.getAttribLocation(program, "aPosition");
gl.enableVertexAttribArray(aPosition);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

// Set up the uniform location
const uModelViewMatrix = gl.getUniformLocation(program, "uModelViewMatrix");

// Clear the canvas
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Translation variables
let translationX = -1.0; // Start on the left
const translationSpeed = 0.01;

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up the model view matrix and apply translation
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [translationX, 0.0, 0.0]);

    gl.useProgram(program);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

    // Draw the square
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Update translation
    translationX += translationSpeed;
    if (translationX > 1.0) {
        translationX = -1.0; // Reset to start
    }
}

// Animation loop
function animate() {
    drawScene();
    requestAnimationFrame(animate);
}

animate();