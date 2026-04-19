import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { roadCurve } from './Road';

// Exact direction from the last two control points of the road
// From Road.js: second-to-last = (36, 0, -38), last = (24, 0, -46)
const LAST_DIR = new THREE.Vector3(24 - 36, 0, -46 - (-38)).normalize();
// Add PI/2 to rotate 90° so banner stands ACROSS the road
const BANNER_ANGLE = Math.atan2(LAST_DIR.z, -LAST_DIR.x) + Math.PI / 2;

function FlagPole({ x, z, color }) {
    const flagRef = useRef();
    useFrame((s) => {
        if (flagRef.current) {
            flagRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 2.5) * 0.3;
        }
    });
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.07, 0.07, 5, 6]} />
                <meshLambertMaterial color="#ddd" />
            </mesh>
            <mesh ref={flagRef} position={[0.55, 4.5, 0]} castShadow>
                <boxGeometry args={[1.0, 0.55, 0.05]} />
                <meshLambertMaterial color={color} />
            </mesh>
        </group>
    );
}

function FinishBanner({ pos }) {
    const { x, z } = pos;

    return (
        <group position={[x, 0, z]} rotation={[0, BANNER_ANGLE, 0]}>
            {/* Left pole */}
            <mesh position={[-3.0, 2.2, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 4.4, 8]} />
                <meshLambertMaterial color="#ffca28" />
            </mesh>
            {/* Right pole */}
            <mesh position={[3.0, 2.2, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.12, 4.4, 8]} />
                <meshLambertMaterial color="#ffca28" />
            </mesh>
            {/* Banner cloth */}
            <mesh position={[0, 3.6, 0]} castShadow>
                <boxGeometry args={[6.2, 0.65, 0.1]} />
                <meshLambertMaterial color="#e53935" />
            </mesh>
            {/* Checkered blocks */}
            {[-2.4, -1.72, -1.04, -0.36, 0.32, 1.0, 1.68, 2.36].map((bx, i) => (
                <mesh key={i} position={[bx, 3.6, 0]}>
                    <boxGeometry args={[0.34, 0.65, 0.14]} />
                    <meshLambertMaterial color={i % 2 === 0 ? '#fff' : '#111'} />
                </mesh>
            ))}
            {/* Stars on poles */}
            {[-3.0, 3.0].map((bx, i) => (
                <mesh key={`star${i}`} position={[bx, 4.7, 0]}>
                    <sphereGeometry args={[0.28, 8, 8]} />
                    <meshLambertMaterial color="#ffd740" emissive="#ffb300" emissiveIntensity={0.9} />
                </mesh>
            ))}
            {/* Confetti */}
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r = 2.5 + Math.sin(i) * 1.2;
                return (
                    <mesh key={`conf${i}`} position={[
                        Math.cos(a) * r,
                        0.4 + Math.random() * 1.5,
                        Math.sin(a) * r * 0.3
                    ]}>
                        <boxGeometry args={[0.18, 0.18, 0.06]} />
                        <meshLambertMaterial color={['#ff4081', '#ffd740', '#00e5ff', '#69f0ae'][i % 4]} />
                    </mesh>
                );
            })}
        </group>
    );
}

export function StartFinish() {
    const endPos = roadCurve.getPoint(0.97);
    const tan = roadCurve.getTangent(0.97);

    const nx = -tan.z;
    const nz = tan.x;
    const len = Math.sqrt(nx * nx + nz * nz) || 1;
    const rightOffset = { x: (nx / len) * -8, z: (nz / len) * -8 };

    return (
        <group>
            <FinishBanner pos={endPos} />
            <FlagPole x={endPos.x - 5} z={endPos.z + 3} color="#e53935" />
            <FlagPole x={endPos.x + 5} z={endPos.z - 3} color="#ffd740" />

            {/* Tree beside finish */}
            <group position={[endPos.x + rightOffset.x, 0, endPos.z + rightOffset.z]} scale={[1.2, 1.2, 1.2]}>
                <mesh position={[0, 0.6, 0]} castShadow>
                    <cylinderGeometry args={[0.14, 0.20, 1.2, 6]} />
                    <meshLambertMaterial color="#7a4f30" />
                </mesh>
                <mesh position={[0, 2.2, 0]} castShadow>
                    <coneGeometry args={[1.0, 2.6, 6]} />
                    <meshLambertMaterial color="#3dab38" />
                </mesh>
                <mesh position={[0, 3.6, 0]} castShadow>
                    <coneGeometry args={[0.7, 1.8, 6]} />
                    <meshLambertMaterial color="#3dab38" />
                </mesh>
                <mesh position={[0, 4.5, 0]} castShadow>
                    <coneGeometry args={[0.4, 1.1, 6]} />
                    <meshLambertMaterial color="#3dab38" />
                </mesh>
            </group>
        </group>
    );
}