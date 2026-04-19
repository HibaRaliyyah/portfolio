import { useMemo } from 'react';
import * as THREE from 'three';

// Extended winding road — 12 control points across a large area
const POINTS = [
    new THREE.Vector3(-55, 0, 45),
    new THREE.Vector3(-44, 0, 34),
    new THREE.Vector3(-32, 0, 22),
    new THREE.Vector3(-20, 0, 13),
    new THREE.Vector3(-9, 0, 5),
    new THREE.Vector3(2, 0, -5),
    new THREE.Vector3(14, 0, -12),
    new THREE.Vector3(24, 0, -8),
    new THREE.Vector3(34, 0, -16),
    new THREE.Vector3(40, 0, -26),
    new THREE.Vector3(36, 0, -38),
    new THREE.Vector3(24, 0, -46),
];

export const roadCurve = new THREE.CatmullRomCurve3(POINTS, false, 'catmullrom', 0.5);
export const STATION_TS = [0.10, 0.26, 0.44, 0.62, 0.80];

const SEGMENTS = 220;
const ROAD_WIDTH = 3.6;
const ROAD_Y = 0.05;         // flat surface sits just above ground

function buildRibbonGeometry() {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= SEGMENTS; i++) {
        const t = (i / SEGMENTS) * 0.999;
        const pos = roadCurve.getPoint(t);
        const tan = roadCurve.getTangent(t);

        // Perpendicular in XZ plane
        const nx = -tan.z;
        const nz = tan.x;
        const len = Math.sqrt(nx * nx + nz * nz) || 1;

        // Left and right edge vertices
        positions.push(
            pos.x + (nx / len) * ROAD_WIDTH, ROAD_Y, pos.z + (nz / len) * ROAD_WIDTH,
            pos.x - (nx / len) * ROAD_WIDTH, ROAD_Y, pos.z - (nz / len) * ROAD_WIDTH,
        );
        normals.push(0, 1, 0, 0, 1, 0);
        uvs.push(0, i / SEGMENTS, 1, i / SEGMENTS);

        if (i < SEGMENTS) {
            const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
            indices.push(a, b, c, b, d, c);
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
}

function buildBorderGeometry(side, extraWidth) {
    // side: 1 = left, -1 = right
    const positions = [], normals = [], uvs = [], indices = [];
    const bw = 0.3;

    for (let i = 0; i <= SEGMENTS; i++) {
        const t = (i / SEGMENTS) * 0.999;
        const pos = roadCurve.getPoint(t);
        const tan = roadCurve.getTangent(t);
        const nx = -tan.z, nz = tan.x;
        const len = Math.sqrt(nx * nx + nz * nz) || 1;
        const inner = extraWidth;
        const outer = extraWidth + bw;

        positions.push(
            pos.x + (nx / len) * side * inner, ROAD_Y + 0.01, pos.z + (nz / len) * side * inner,
            pos.x + (nx / len) * side * outer, ROAD_Y + 0.01, pos.z + (nz / len) * side * outer,
        );
        normals.push(0, 1, 0, 0, 1, 0);
        uvs.push(0, i / SEGMENTS, 1, i / SEGMENTS);

        if (i < SEGMENTS) {
            const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
            if (side === 1) indices.push(a, b, c, b, d, c);
            else indices.push(c, b, a, c, d, b);
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    return geo;
}

export function Road() {
    const roadGeo = useMemo(() => buildRibbonGeometry(), []);
    const borderL = useMemo(() => buildBorderGeometry(1, ROAD_WIDTH), []);
    const borderR = useMemo(() => buildBorderGeometry(-1, ROAD_WIDTH), []);

    return (
        <group>
            {/* Main flat road surface */}
            <mesh geometry={roadGeo} receiveShadow>
                <meshLambertMaterial color="#2a2a3e" side={THREE.DoubleSide} />
            </mesh>

            {/* Yellow borders */}
            <mesh geometry={borderL} receiveShadow>
                <meshLambertMaterial color="#fbbf24" opacity={0.85} transparent />
            </mesh>
            <mesh geometry={borderR} receiveShadow>
                <meshLambertMaterial color="#fbbf24" opacity={0.85} transparent />
            </mesh>


        </group>
    );
}
