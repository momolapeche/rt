const rtVS = `#version 300 es
precision highp float;

out vec2 vPosition;

void main() {
    vPosition = vec2((gl_VertexID % 2) * 2 - 1, (gl_VertexID / 2) * 2 - 1);
    gl_Position = vec4(vPosition, 0, 1);
}
`

const maxFacesNum = 512

const rtFS = `#version 300 es
precision highp float;

uniform float uAspect;
uniform float uFovy;

struct Sector {
    int start;
    int count;
};

layout(std140) uniform Faces {
    vec3[${ maxFacesNum }] uPoints;
    vec3[${ maxFacesNum }] uNormals;
    vec3[${ maxFacesNum }] uColors;
    int[${ maxFacesNum }] uNeighbors;
};

layout(std140) uniform SectorIndices {
    int[128] uSectorIndices;
};

layout(std140) uniform Sectors {
    Sector[2] uSectors;
};

in vec2 vPosition;

out vec4 oColor;

struct Ray {
    vec3 o;
    vec3 d;
};

void main() {
    float tanFovy = tan(uFovy / 2.);
    Ray view = Ray(vec3(0), vec3(
        vPosition.x * tanFovy * uAspect,
        vPosition.y * tanFovy,
        -1
    ));

    int sectorIdx = 0;

    float minDist;
    int faceId;

    for (int depth = 0; depth < 16; depth++) {
        Sector sector = uSectors[sectorIdx];

        minDist = 100000.;
        faceId = -1;

        for (int i = 0; i < 16; i++) {
            if (i >= sector.count)
                break;

            int index = uSectorIndices[sector.start + i];
            vec3 normal = uNormals[index];
            float NdV = dot(normal, view.d);
            if (NdV > 0.0)
                continue;
            vec3 point = uPoints[index];
            float dist = dot(view.o - point, normal) / -NdV;
            if (dist > 0.0 && dist < minDist) {
                minDist = dist;
                faceId = index;
            }
        }
        sectorIdx = uNeighbors[faceId];
        if (sectorIdx == -1) {
            break;
        }
    }

    oColor = vec4(faceId == -1 ? vec3(1, 0, 1) : uColors[faceId], 1);
}
`

/**
    * @param {WebGL2RenderingContext} gl
    * @param {string} src
    * @param {number} type
    * @returns {WebGLShader}
*/
function compileShader(gl, src, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(src.split('\n').map((s, i) => `${i}: ${s}`).join('\n'))
        throw new Error('Could not compile shader: ' + gl.getShaderInfoLog(shader));
    }
    return shader
}

/**
    * @param {WebGL2RenderingContext} gl 
    * @param {WebGLShader} vShader
    * @param {WebGLShader} fShader
    * @returns {WebGLProgram}
*/
function createProgram(gl, vShader, fShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)
    /*
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program))
    }
    */

    return program
}

function main() {
    const canvas = document.querySelector('canvas')
    canvas.width = 600
    canvas.height = 600
    const gl = canvas.getContext('webgl2')

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const vShader = compileShader(gl, rtVS, gl.VERTEX_SHADER)
    const fShader = compileShader(gl, rtFS, gl.FRAGMENT_SHADER)

    const program = createProgram(gl, vShader, fShader)

    gl.useProgram(program)
    gl.uniform1f(gl.getUniformLocation(program, 'uAspect'), gl.canvas.width / gl.canvas.height)
    gl.uniform1f(gl.getUniformLocation(program, 'uFovy'), 80 / 180 * Math.PI)


    const faces = [
        { point: [-1, 0, 0], normal: [ 1,  0,  0], color: [1, 0, 0], neighbor: -1 },
        { point: [ 3, 0, 0], normal: [-1,  0,  0], color: [1, 0, 0], neighbor: -1 },
        { point: [0, -1, 0], normal: [ 0,  1,  0], color: [0, 1, 0], neighbor: -1 },
        { point: [0,  1, 0], normal: [ 0, -1,  0], color: [0, 1, 0], neighbor: -1 },
        { point: [0, 0, -3], normal: [ 0,  0,  1], color: [0, 0, 1], neighbor:  1 },
        { point: [0, 0,  1], normal: [ 0,  0, -1], color: [0, 0, 1], neighbor: -1 },

        { point: [-1, 0, -4], normal: [ 1,  0,  0], color: [0, 1, 1], neighbor: -1 },
        { point: [ 3, 0, -4], normal: [-1,  0,  0], color: [0, 1, 1], neighbor: -1 },
        { point: [0, -1, -4], normal: [ 0,  1,  0], color: [1, 0, 1], neighbor: -1 },
        { point: [0,  1, -4], normal: [ 0, -1,  0], color: [1, 0, 1], neighbor: -1 },
        { point: [0, 0,  -7], normal: [ 0,  0,  1], color: [1, 1, 0], neighbor: -1 },
        { point: [0, 0,  -3], normal: [ 0,  0, -1], color: [1, 1, 0], neighbor:  0 },
    ]
    const facesData = new ArrayBuffer(maxFacesNum * 64)
    const pointsData  = new Float32Array(facesData,                 0, 128 * 4)
    const normalsData = new Float32Array(facesData,  maxFacesNum * 16, 128 * 4)
    const colorsData  = new Float32Array(facesData,  maxFacesNum * 32, 128 * 4)
    const neighborsData  = new Int32Array(facesData, maxFacesNum * 48, 128 * 4)
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i]
        
        pointsData.set(face.point,  i * 4)
        normalsData.set(face.normal, i * 4)
        colorsData.set(face.color,  i * 4)
        neighborsData[i * 4] = face.neighbor
    }

    console.log(pointsData)
    console.log(normalsData)
    console.log(colorsData)

    const facesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, facesBuffer)
    gl.bufferData(gl.UNIFORM_BUFFER, facesData, gl.STATIC_DRAW)

    const indices = new Int32Array(128 * 4)
    ;[
        0, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11,
    ].forEach((x, i) => indices[i * 4] = x)
    const indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, indicesBuffer)
    gl.bufferData(gl.UNIFORM_BUFFER, indices, gl.STATIC_DRAW)

    const sectors = new Int32Array(4 * 2)
    ;[
        [0, 6],
        [6, 12],
    ].forEach((x, i) => {
        sectors[i * 4 + 0] = x[0]
        sectors[i * 4 + 1] = x[1]
    })
    const sectorsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.UNIFORM_BUFFER, sectorsBuffer)
    gl.bufferData(gl.UNIFORM_BUFFER, sectors, gl.STATIC_DRAW)

    {
        const uboIndex = gl.getUniformBlockIndex(program, 'Faces')
        console.log(gl.getActiveUniformBlockParameter(program, uboIndex, gl.UNIFORM_BLOCK_DATA_SIZE), facesData.byteLength)
        gl.uniformBlockBinding(program, uboIndex, 0)
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, facesBuffer)
    }
    {
        const uboIndex = gl.getUniformBlockIndex(program, 'SectorIndices')
        console.log(gl.getActiveUniformBlockParameter(program, uboIndex, gl.UNIFORM_BLOCK_DATA_SIZE), indices.length * 4)
        gl.uniformBlockBinding(program, uboIndex, 1)
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, indicesBuffer)
    }
    {
        const uboIndex = gl.getUniformBlockIndex(program, 'Sectors')
        console.log(gl.getActiveUniformBlockParameter(program, uboIndex, gl.UNIFORM_BLOCK_DATA_SIZE), sectors.length * 4)
        gl.uniformBlockBinding(program, uboIndex, 2)
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, sectorsBuffer)
    }

    /** @param {number} now */
    function frame(now) {
        gl.clear(gl.COLOR_BUFFER_BIT)
        
        gl.useProgram(program)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
}

main()
