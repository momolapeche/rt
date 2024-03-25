// basically copied from https://glmatrix.net/

/** @typedef { Float32Array | Int8Array | Int16Array | Int32Array } vec3 */

export const vec3 = {
    /** @returns { vec3 } */
    create() {
        return new Float32Array([0, 0, 0])
    },

    /**
    * @param { number } x
    * @param { number } y
    * @param { number } z
    * @returns { vec3 }
    */
    fromValues(x, y, z) {
        return new Float32Array([x, y, z])
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @returns { vec3 }
    */
    copy(o, v) {
        o[0] = v[0]
        o[1] = v[1]
        o[2] = v[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { number } x
    * @param { number } y
    * @param { number } z
    * @returns { vec3 }
    */
    set(o, x, y, z) {
        o[0] = x
        o[1] = y
        o[2] = z
        return o
    },

    /**
    * @param { vec3 } v
    * @returns { number }
    */
    length(v) {
        return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
    },

    /**
    * @param { vec3 } v
    * @returns { number }
    */
    lengthSquared(v) {
        return v[0]*v[0] + v[1]*v[1] + v[2]*v[2]
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @returns { vec3 }
    */
    normalize(o, v) {
        const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2])
        v[0] /= len
        v[1] /= len
        v[2] /= len
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { number } s
    * @returns { vec3 }
    */
    scale(o, v, s) {
        o[0] = v[0] * s
        o[1] = v[1] * s
        o[2] = v[2] * s
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    mul(o, a, b) {
        o[0] = a[0] * b[0]
        o[1] = a[1] * b[1]
        o[2] = a[2] * b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    div(o, a, b) {
        o[0] = a[0] / b[0]
        o[1] = a[1] / b[1]
        o[2] = a[2] / b[2]
        return o
    },

    /**
    * @param { vec3 } a 
    * @param { vec3 } b
    * @returns { number }
    */
    dot(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    cross(o, a, b) {
        const x = a[1] * b[2] - a[2] * b[1]
        const y = a[2] * b[0] - a[0] * b[2]
        const z = a[0] * b[1] - a[1] * b[0]

        o[0] = x
        o[1] = y
        o[2] = z

        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    add(o, a, b) {
        o[0] = a[0] + b[0]
        o[1] = a[1] + b[1]
        o[2] = a[2] + b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @returns { vec3 }
    */
    sub(o, a, b) {
        o[0] = a[0] - b[0]
        o[1] = a[1] - b[1]
        o[2] = a[2] - b[2]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } a
    * @param { vec3 } b
    * @param { number } t
    * @returns { vec3 } b
    */
    lerp(o, a, b, t) {
        const s = 1 - t
        o[0] = a[0] * s + b[0] * t
        o[1] = a[1] * s + b[1] * t
        o[2] = a[2] * s + b[2] * t
        return o
    },

    /** entierement copie de glMatrix
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { quat } q
    * @returns { vec3 }
    */
    transformQuat(out, a, q) {
        // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed

        let qx = q[0],
            qy = q[1],
            qz = q[2],
            qw = q[3];
        let x = a[0],
            y = a[1],
            z = a[2];

        // var qvec = [qx, qy, qz];
        // var uv = vec3.cross([], qvec, a);
        let uvx = qy * z - qz * y,
            uvy = qz * x - qx * z,
            uvz = qx * y - qy * x;
        // var uuv = vec3.cross([], qvec, uv);
        let uuvx = qy * uvz - qz * uvy,
            uuvy = qz * uvx - qx * uvz,
            uuvz = qx * uvy - qy * uvx;

        // vec3.scale(uv, uv, 2 * w);
        let w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;

        // vec3.scale(uuv, uuv, 2);
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;

        // return vec3.add(out, a, vec3.add(out, uv, uuv));
        out[0] = x + uvx + uuvx;
        out[1] = y + uvy + uuvy;
        out[2] = z + uvz + uuvz;
        return out;
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat3 } m
    * @returns { vec3 }
    */
    transformMat3(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]
        o[0] = x * m[0] + y * m[3] + z * m[6]
        o[1] = x * m[1] + y * m[4] + z * m[7]
        o[2] = x * m[2] + y * m[5] + z * m[8]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat4 } m
    * @returns { vec3 }
    */
    transformMat4(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]
        o[0] = x * m[ 0] + y * m[ 4] + z * m[ 8] + m[12]
        o[1] = x * m[ 1] + y * m[ 5] + z * m[ 9] + m[13]
        o[2] = x * m[ 2] + y * m[ 6] + z * m[10] + m[14]
        return o
    },

    /**
    * @param { vec3 } o
    * @param { vec3 } v
    * @param { mat4 } m
    * @returns { vec3 }
    */
    transformMat4ThenDivide(o, v, m) {
        const x = v[0]
        const y = v[1]
        const z = v[2]

        const w = x * m[3] + y * m[7] + z * m[11] + m[15]

        o[0] = (x * m[ 0] + y * m[ 4] + z * m[ 8] + m[12]) / w
        o[1] = (x * m[ 1] + y * m[ 5] + z * m[ 9] + m[13]) / w
        o[2] = (x * m[ 2] + y * m[ 6] + z * m[10] + m[14]) / w
        return o
    },
}

/*
ijk = i² = j² = k² = -1

ij = k
ik = -j
jk = i
ji = -k
ki = j
kj = -i

(a + bi + cj + dk) * (e + fi + gj + hk)
  ae +  afi +  agj +  ahk +
 bei -   bf +  bgk -  bhj +
 cej -  cfk -   cg +  chi +
 dek +  dfj -  dgi -   dh

w = ae - bf - cg - dh
x = be + af + ch - dg
y = ce + ag - bh + df
z = de + ah + bg - cf

a = a.w
b = a.x
c = a.y
d = a.z
e = b.w
f = b.x
g = b.y
h = b.z

w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y
y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z
z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x

w   = a.w * a.w - dot(a.xyz, b.xyz)
xyz = cross(a, b) + a.w * b.xyz + b.w * a.xyz
*/

/** @typedef { ArrayLike } quat */
export const quat = {
    /** @returns { quat } */
    create() {
        return new Float32Array([0, 0, 0, 1])
    },

    /**
    * @param {quat} o 
    * @param {quat} q 
    * @returns {quat}
    */
    conjugate(o, q) {
        o[0] = -q[0]
        o[1] = -q[1]
        o[2] = -q[2]
        return o
    },

    /**
    * @param { quat } o
    * @param { vec3 } v
    * @param { number } a
    * @returns { quat }
    */
    setAxisAngle(o, v, a) {
        const s = Math.sin(a / 2)

        o[0] = v[0] * s
        o[1] = v[1] * s
        o[2] = v[2] * s
        o[3] = Math.cos(a / 2)

        return o
    },

    /**
    * @param { quat } o
    * @param { quat } a
    * @param { quat } b
    * @returns { quat }
    */
    mul(o, a, b) {
        const ax = a[0]
        const ay = a[1]
        const az = a[2]
        const aw = a[3]
        const bx = b[0]
        const by = b[1]
        const bz = b[2]
        const bw = b[3]

        o[0] = aw * bx + ax * bw + ay * bz - az * by
        o[1] = aw * by + ay * bw + az * bx - ax * bz
        o[2] = aw * bz + az * bw + ax * by - ay * bx
        o[3] = aw * bw - ax * bx - ay * by - az * bz

        return o
    },
}


/** @typedef { ArrayLike } mat3 */
export const mat3 = {
    /** @returns { mat3 } */
    create() {
        return new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ])
    },
    
    /**
    * @param { number } a
    * @param { number } b
    * @param { number } c
    * @param { number } d
    * @param { number } e
    * @param { number } f
    * @param { number } g
    * @param { number } h
    * @param { number } i
    * @returns { mat3 }
    */
    fromValues(a, b, c, d, e, f, g, h, i) {
        return new Float32Array([
            a, b, c,
            d, e, f,
            g, h, i,
        ])
    },

    /**
    * @param { mat3 } o
    * @param { mat4 } m
    *
    * @returns { mat3 }
    */
    fromMat4(o, m) {
        o[0] = m[0]
        o[1] = m[1]
        o[2] = m[2]

        o[3] = m[4]
        o[4] = m[5]
        o[5] = m[6]

        o[6] = m[8]
        o[7] = m[9]
        o[8] = m[10]

        return o
    },

    /**
    * @param { mat3 } out
    * @param { quat } q
    * @returns { mat3 }
    */
    fromQuat(out, q) {
        const x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[3] = yx - wz;
        out[4] = 1 - xx - zz;
        out[5] = zy + wx;
        out[6] = zx + wy;
        out[7] = zy - wx;
        out[8] = 1 - xx - yy;

        return out;
    },

    /**
    * @param { mat3 } o
    * @param { mat3 } m
    * @returns { mat3 }
    */
    transpose(o, m) {
        const m0 = m[0]
        const m1 = m[1]
        const m2 = m[2]
        const m3 = m[3]
        const m4 = m[4]
        const m5 = m[5]
        const m6 = m[6]
        const m7 = m[7]
        const m8 = m[8]

        o[0] = m0
        o[1] = m3
        o[2] = m6
        o[3] = m1
        o[4] = m4
        o[5] = m7
        o[6] = m2
        o[7] = m5
        o[8] = m8

        return o
    },

    /**
    * @param { mat3 } o
    * @param { mat3 } a
    * @param { mat3 } b
    * @returns { mat3 }
    */
    mul(o, a, b) {
        const a00 = a[0]
        const a10 = a[1]
        const a20 = a[2]
        const a01 = a[3]
        const a11 = a[4]
        const a21 = a[5]
        const a02 = a[6]
        const a12 = a[7]
        const a22 = a[8]

        const b00 = b[0]
        const b10 = b[1]
        const b20 = b[2]
        const b01 = b[3]
        const b11 = b[4]
        const b21 = b[5]
        const b02 = b[6]
        const b12 = b[7]
        const b22 = b[8]
        
        o[0] = a00*b00 + a01*b10 + a02*b20
        o[1] = a10*b00 + a11*b10 + a12*b20
        o[2] = a20*b00 + a21*b10 + a22*b20
        
        o[3] = a00*b01 + a01*b11 + a02*b21
        o[4] = a10*b01 + a11*b11 + a12*b21
        o[5] = a20*b01 + a21*b11 + a22*b21
        
        o[6] = a00*b02 + a01*b12 + a02*b22
        o[7] = a10*b02 + a11*b12 + a12*b22
        o[8] = a20*b02 + a21*b12 + a22*b22

        return o
    },
}

/** @typedef { Float32Array | Int8Array | Int16Array | Int32Array } mat4 */

export const mat4 = {
    /** @returns { mat4 } */
    create() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } m
    * @returns { mat4 }
    */
    copy(o, m) {
        o[0] = m[0]
        o[1] = m[1]
        o[2] = m[2]
        o[3] = m[3]
        o[4] = m[4]
        o[5] = m[5]
        o[6] = m[6]
        o[7] = m[7]
        o[8] = m[8]
        o[9] = m[9]
        o[10] = m[10]
        o[11] = m[11]
        o[12] = m[12]
        o[13] = m[13]
        o[14] = m[14]
        o[15] = m[15]
        return o
    },

    /**
    * @param { mat4 } o
    * @returns { mat4 }
    */
    identity(o) {
        o[0] = 1
        o[1] = 0
        o[2] = 0
        o[3] = 0
        o[4] = 0
        o[5] = 1
        o[6] = 0
        o[7] = 0
        o[8] = 0
        o[9] = 0
        o[10] = 1
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } a
    * @param { mat4 } b
    * @returns { mat4 }
    */
    mul(o, a, b) {
        const a00 = a[0]
        const a10 = a[1]
        const a20 = a[2]
        const a30 = a[3]
        const a01 = a[4]
        const a11 = a[5]
        const a21 = a[6]
        const a31 = a[7]
        const a02 = a[8]
        const a12 = a[9]
        const a22 = a[10]
        const a32 = a[11]
        const a03 = a[12]
        const a13 = a[13]
        const a23 = a[14]
        const a33 = a[15]

        const b00 = b[0]
        const b10 = b[1]
        const b20 = b[2]
        const b30 = b[3]
        const b01 = b[4]
        const b11 = b[5]
        const b21 = b[6]
        const b31 = b[7]
        const b02 = b[8]
        const b12 = b[9]
        const b22 = b[10]
        const b32 = b[11]
        const b03 = b[12]
        const b13 = b[13]
        const b23 = b[14]
        const b33 = b[15]
        
        o[ 0] = a00*b00 + a01*b10 + a02*b20 + a03*b30
        o[ 1] = a10*b00 + a11*b10 + a12*b20 + a13*b30
        o[ 2] = a20*b00 + a21*b10 + a22*b20 + a23*b30
        o[ 3] = a30*b00 + a31*b10 + a32*b20 + a33*b30
        
        o[ 4] = a00*b01 + a01*b11 + a02*b21 + a03*b31
        o[ 5] = a10*b01 + a11*b11 + a12*b21 + a13*b31
        o[ 6] = a20*b01 + a21*b11 + a22*b21 + a23*b31
        o[ 7] = a30*b01 + a31*b11 + a32*b21 + a33*b31
        
        o[ 8] = a00*b02 + a01*b12 + a02*b22 + a03*b32
        o[ 9] = a10*b02 + a11*b12 + a12*b22 + a13*b32
        o[10] = a20*b02 + a21*b12 + a22*b22 + a23*b32
        o[11] = a30*b02 + a31*b12 + a32*b22 + a33*b32
        
        o[12] = a00*b03 + a01*b13 + a02*b23 + a03*b33
        o[13] = a10*b03 + a11*b13 + a12*b23 + a13*b33
        o[14] = a20*b03 + a21*b13 + a22*b23 + a23*b33
        o[15] = a30*b03 + a31*b13 + a32*b23 + a33*b33

        return o
    },


    /** Copie de glMatrix
    * @param { mat4 } out
    * @param { mat4 } a
    * @returns { mat4 }
    */
    invert(out, a) {
        const a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        const a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        const a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        const a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }

        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    },

    /**
    * @param { mat4 } out
    * @param { quat } q
    * @returns { mat4 }
    */
    fromQuat(out, q) {
        const x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[3] = 0;
        out[4] = yx - wz;
        out[5] = 1 - xx - zz;
        out[6] = zy + wx;
        out[7] = 0;
        out[8] = zx + wy;
        out[9] = zy - wx;
        out[10] = 1 - xx - yy;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        return out;
    },

    /**
    * @param { mat4 } o
    * @param { mat4 } m
    * @returns { mat4 }
    */
    fromMat3(o, m) {
        o[ 0] = m[0]
        o[ 1] = m[1]
        o[ 2] = m[2]
        o[ 3] = 0
        o[ 4] = m[3]
        o[ 5] = m[4]
        o[ 6] = m[5]
        o[ 7] = 0
        o[ 8] = m[6]
        o[ 9] = m[7]
        o[10] = m[8]
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { vec3 } s
    * @returns { mat4 }
    */
    fromTranslation(o, t) {
        o[ 0] = 1
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0
        o[ 4] = 0
        o[ 5] = 1
        o[ 6] = 0
        o[ 7] = 0
        o[ 8] = 0
        o[ 9] = 0
        o[10] = 1
        o[11] = 0
        o[12] = t[0]
        o[13] = t[1]
        o[14] = t[2]
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { vec3 } s
    * @returns { mat4 }
    */
    fromScale(o, s) {
        o[ 0] = s[0]
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0
        o[ 4] = 0
        o[ 5] = s[1]
        o[ 6] = 0
        o[ 7] = 0
        o[ 8] = 0
        o[ 9] = 0
        o[10] = s[2]
        o[11] = 0
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotX(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = 1
        o[ 1] = 0
        o[ 2] = 0
        o[ 3] = 0

        // Y
        o[ 4] = 0
        o[ 5] = c
        o[ 6] = s
        o[ 7] = 0

        // Z
        o[ 8] = 0
        o[ 9] = -s
        o[10] = c
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotY(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = c
        o[ 1] = 0
        o[ 2] = -s
        o[ 3] = 0

        // Y
        o[ 4] = 0
        o[ 5] = 1
        o[ 6] = 0
        o[ 7] = 0

        // Z
        o[ 8] = s
        o[ 9] = 0
        o[10] = c
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },


    /**
    * @param { mat4 } o
    * @param { number } t
    * @returns { mat4 }
    */
    fromRotZ(o, t) {
        const c = Math.cos(t)
        const s = Math.sin(t)

        // X
        o[ 0] = c
        o[ 1] = s
        o[ 2] = 0
        o[ 3] = 0

        // Y
        o[ 4] = -s
        o[ 5] = c
        o[ 6] = 0
        o[ 7] = 0

        // Z
        o[ 8] = 0
        o[ 9] = 0
        o[10] = 1
        o[11] = 0

        // T
        o[12] = 0
        o[13] = 0
        o[14] = 0
        o[15] = 1

        return o
    },

    /**
    * @param { mat4 } o
    * @param { quat } q
    * @param { vec3 } t
    * @param { vec3 } s
    * @returns { mat4 }
    */
    fromRotationTranslationScale(o, q, t, s) {
        const x = q[0],
            y = q[1],
            z = q[2],
            w = q[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        const sx = s[0]
        const sy = s[1]
        const sz = s[2]

        o[0] = (1 - yy - zz) * sx;
        o[1] = (yx + wz) * sx;
        o[2] = (zx - wy) * sx;
        o[3] = 0;
        o[4] = (yx - wz) * sy;
        o[5] = (1 - xx - zz) * sy;
        o[6] = (zy + wx) * sy;
        o[7] = 0;
        o[8] = (zx + wy) * sz;
        o[9] = (zy - wx) * sz;
        o[10] = (1 - xx - yy) * sz;
        o[11] = 0;
        o[12] = t[0];
        o[13] = t[1];
        o[14] = t[2];
        o[15] = 1;

        return o;
    },

    /** J'avoue celle la je l'ai copiee
    *
    * @param { mat4 } o
    * @param { number } fovy
    * @param { number } aspect
    * @param { number } near
    * @param { number } far
    *
    * @returns { mat4 }
    */
    perspective(o, fovy, aspect, near, far) {
        const f = 1 / Math.tan(fovy / 2)
        const nf = 1 / (near - far)

        o[0] = f / aspect
        o[1] = 0
        o[2] = 0
        o[3] = 0

        o[4] = 0
        o[5] = f
        o[6] = 0
        o[7] = 0

        o[8] = 0
        o[9] = 0
        o[10] = (far + near) * nf
        o[11] = -1

        o[12] = 0
        o[13] = 0
        o[14] = 2 * far * near * nf
        o[15] = 0

        return o
    },

    /**
    * @param { mat4 } o
    * @param { number } left
    * @param { number } right
    * @param { number } bottom
    * @param { number } top
    * @param { number } near
    * @param { number } far
    *
    * @returns { mat4 }
    */
    orthographic(o, left, right, bottom, top, near, far) {
        const rl = 1 / (right - left)
        const tb = 1 / (top - bottom)
        const fn = 1 / (far - near)
        o[0] = 2 * rl
        o[1] = 0
        o[2] = 0
        o[3] = 0

        o[4] = 0
        o[5] = 2 * tb
        o[6] = 0
        o[7] = 0

        o[8] = 0
        o[9] = 0
        o[10] = -2 * fn
        o[11] = 0

        o[12] = -(left + right) * rl
        o[13] = -(bottom + top) * tb
        o[14] = -(near + far) * fn
        o[15] = 1

        return o
    },
}
















