import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { roadCurve, STATION_TS } from './Road';

// ─────────────────────────────────────────────────────────────────────────────
// STATION 0 — ABOUT ME
// Theme: Deep indigo / violet — identity, introspection, self
//   buildingColor : #3730a3  (deep indigo — main cube)
//   roofColor     : #1e1b4b  (dark navy — flat roof)
//   station.color : #818cf8  (soft violet — billboard & glow ring)
// ─────────────────────────────────────────────────────────────────────────────
function AboutBuilding({ color, roofColor }) {
    // color      = buildingColor = #3730a3
    // roofColor  = roofColor     = #1e1b4b
    const glowCore = '#818cf8';   // inner sphere emissive — brightest violet
    const panelTint = '#c7d2fe';   // floating side panels — pale indigo
    const doorGlow = '#818cf8';   // neon door

    return (
        <group>
            {/* Ground halo */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <circleGeometry args={[3, 32]} />
                <meshStandardMaterial color={color} transparent opacity={0.2} />
            </mesh>

            {/* Main solid cube */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[2.5, 2.2, 2.5]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.15}
                    metalness={0.45}
                    transparent={false}
                />
            </mesh>

            {/* Glowing core sphere */}
            <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color={glowCore} emissive={glowCore} emissiveIntensity={2.5} />
            </mesh>

            {/* Floating side panels */}
            {[-1.8, 1.8].map((x, i) => (
                <mesh key={i} position={[x, 1.3, 0]}>
                    <boxGeometry args={[0.6, 0.4, 0.05]} />
                    <meshStandardMaterial color={panelTint} emissive={glowCore} emissiveIntensity={0.8} />
                </mesh>
            ))}

            {/* Flat roof */}
            <mesh position={[0, 2.4, 0]}>
                <boxGeometry args={[2.7, 0.2, 2.7]} />
                <meshStandardMaterial color={roofColor} />
            </mesh>

            {/* Neon door */}
            <mesh position={[0, 0.7, 1.3]}>
                <boxGeometry args={[0.5, 1, 0.05]} />
                <meshStandardMaterial color={doorGlow} emissive={doorGlow} emissiveIntensity={2.0} />
            </mesh>
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATION 1 — TECH STACKS
// Theme: Amber / orange flame — craft, fire, expertise
//   buildingColor : #b45309  (deep amber — base tower)
//   roofColor     : #78350f  (dark brown — antenna & base)
//   station.color : #fbbf24  (bright gold — billboard & glow ring)
// ─────────────────────────────────────────────────────────────────────────────
function SkillsBuilding({ color, roofColor }) {
    // color      = buildingColor = #b45309
    // roofColor  = roofColor     = #78350f
    const midTone = '#d97706';   // mid orange — second tier
    const topTone = '#f59e0b';   // bright amber — top block
    const windowGlow = '#fbbf24';  // gold — window emissive

    return (
        <group>
            {/* Base tower */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.4, 3, 2.4]} />
                <meshLambertMaterial color={color} />
            </mesh>

            {/* Mid section */}
            <mesh position={[0, 3.5, 0]} castShadow>
                <boxGeometry args={[1.8, 1.2, 1.8]} />
                <meshLambertMaterial color={midTone} />
            </mesh>

            {/* Top block */}
            <mesh position={[0, 4.8, 0]} castShadow>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshLambertMaterial color={topTone} />
            </mesh>

            {/* Antenna */}
            <mesh position={[0, 5.9, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 1.0, 6]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Glowing window slits */}
            {[[0.3, 1.2], [0.3, 2.2], [-0.3, 1.7], [-0.3, 0.7]].map(([z, y], i) => (
                <mesh key={i} position={[1.21, y, z]}>
                    <boxGeometry args={[0.04, 0.4, 0.3]} />
                    <meshLambertMaterial color={windowGlow} emissive={topTone} emissiveIntensity={1.2} />
                </mesh>
            ))}

            {/* Side glow panel */}
            <mesh position={[1.22, 2.5, 0]}>
                <boxGeometry args={[0.04, 1.5, 1.8]} />
                <meshLambertMaterial color="#fef3c7" emissive={windowGlow} emissiveIntensity={0.4} />
            </mesh>
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATION 2 — CERTIFICATES & SKILLS
// Theme: Royal purple — wisdom, academia, classical learning
//   buildingColor : #6d28d9  (rich purple — main body)
//   roofColor     : #4c1d95  (deep grape — dome & pediment)
//   station.color : #a78bfa  (soft violet — billboard & glow ring)
// ─────────────────────────────────────────────────────────────────────────────
function EducationBuilding({ color, roofColor }) {
    // color      = buildingColor = #6d28d9
    // roofColor  = roofColor     = #4c1d95
    const stepColor = '#7c3aed';   // medium purple — portico step
    const columnColor = '#ddd6fe';   // pale lavender — columns
    const windowColor = '#c4b5fd';   // light violet — window panes

    return (
        <group>
            {/* Main body */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[4, 3, 3]} />
                <meshLambertMaterial color={color} />
            </mesh>

            {/* Dome */}
            <mesh position={[0, 3.3, 0]} castShadow>
                <sphereGeometry args={[0.9, 10, 10]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Columns */}
            {[-1.4, -0.5, 0.5, 1.4].map((x, i) => (
                <mesh key={i} position={[x, 0.8, 1.6]} castShadow>
                    <cylinderGeometry args={[0.15, 0.18, 1.6, 8]} />
                    <meshLambertMaterial color={columnColor} />
                </mesh>
            ))}

            {/* Portico step */}
            <mesh position={[0, 0.08, 1.9]} receiveShadow>
                <boxGeometry args={[4.5, 0.15, 0.5]} />
                <meshLambertMaterial color={stepColor} />
            </mesh>

            {/* Pediment */}
            <mesh position={[0, 2.6, 1.52]}>
                <boxGeometry args={[2, 0.5, 0.05]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Glowing windows */}
            {[-1.2, 0, 1.2].map((x, i) => (
                <mesh key={i} position={[x, 1.8, 1.52]}>
                    <boxGeometry args={[0.6, 0.8, 0.04]} />
                    <meshLambertMaterial color={windowColor} emissive="#a78bfa" emissiveIntensity={0.7} />
                </mesh>
            ))}
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATION 3 — PROJECTS
// Theme: Teal / cyan — innovation, technology, creation
//   buildingColor : #0f766e  (deep teal — base platform & spire)
//   roofColor     : #0d9488  (medium teal — cone top)
//   station.color : #14b8a6  (bright teal — billboard & glow ring)
// ─────────────────────────────────────────────────────────────────────────────
function ProjectsBuilding({ color, roofColor }) {
    // color      = buildingColor = #0f766e
    // roofColor  = roofColor     = #0d9488
    const ringGlow = '#14b8a6';   // bright teal — orbital ring emissive
    const spireColor = '#f0fdfa';   // near-white — main spire body
    const armColor = '#134e4a';   // darkest teal — radial arms
    const accentGlow = '#6ee7b7';   // mint — circle accent emissive
    const goldBase = '#f59e0b';   // gold — base highlight cylinder

    return (
        <group>
            {/* Base platform */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[2.2, 2.5, 0.4, 12]} />
                <meshLambertMaterial color={color} />
            </mesh>

            {/* Orbital ring */}
            <mesh position={[0, 0.5, 0]}>
                <torusGeometry args={[2, 0.15, 6, 20]} />
                <meshLambertMaterial color={ringGlow} emissive={ringGlow} emissiveIntensity={0.5} />
            </mesh>

            {/* Main spire */}
            <mesh position={[0, 2.2, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.65, 2.8, 8]} />
                <meshLambertMaterial color={spireColor} />
            </mesh>

            {/* Cone top */}
            <mesh position={[0, 3.9, 0]} castShadow>
                <coneGeometry args={[0.5, 1.2, 8]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Radial arms */}
            {[0, 1, 2, 3].map((i) => (
                <mesh
                    key={i}
                    position={[Math.cos((i * Math.PI) / 2) * 0.7, 1.0, Math.sin((i * Math.PI) / 2) * 0.7]}
                    rotation={[0, (i * Math.PI) / 2, 0]}
                    castShadow
                >
                    <boxGeometry args={[0.08, 0.8, 0.55]} />
                    <meshLambertMaterial color={armColor} />
                </mesh>
            ))}

            {/* Accent circle */}
            <mesh position={[0.52, 2.4, 0]}>
                <circleGeometry args={[0.22, 12]} />
                <meshLambertMaterial color="#a7f3d0" emissive={accentGlow} emissiveIntensity={0.6} />
            </mesh>

            {/* Gold base highlight */}
            <mesh position={[0, 0.52, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 0.3, 8]} />
                <meshLambertMaterial color={goldBase} emissive={goldBase} emissiveIntensity={0.9} />
            </mesh>
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATION 4 — CONTACT
// Theme: Warm coral / gold — warmth, openness, approachability
//   buildingColor : #c2410c  (deep coral — main body)
//   roofColor     : #7c2d12  (dark sienna — roof & chimney)
//   station.color : #fb923c  (warm orange — billboard & glow ring)
// ─────────────────────────────────────────────────────────────────────────────
function ContactBuilding({ color, roofColor }) {
    // color      = buildingColor = #c2410c
    // roofColor  = roofColor     = #7c2d12
    const chimney = '#431407';   // near-black brown — chimney post
    const doorColor = '#78350f';   // warm brown — door panel
    const windowGlow = '#fef3c7';   // cream — window panes
    const windowEmis = '#fbbf24';   // gold — window emissive

    return (
        <group>
            {/* Main body */}
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.2, 2.4, 2.8]} />
                <meshLambertMaterial color={color} />
            </mesh>

            {/* Flat roof overhang */}
            <mesh position={[0, 2.55, 0]} castShadow>
                <boxGeometry args={[3.6, 0.3, 3.2]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Chimney post */}
            <mesh position={[1.8, 1.8, 0.5]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 2, 6]} />
                <meshLambertMaterial color={chimney} />
            </mesh>

            {/* Chimney cap */}
            <mesh position={[1.8, 1.8, 0.5]} castShadow>
                <boxGeometry args={[0.5, 0.4, 0.35]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>

            {/* Door */}
            <mesh position={[0, 0.6, 1.42]} castShadow>
                <boxGeometry args={[0.7, 1.2, 0.06]} />
                <meshLambertMaterial color={doorColor} />
            </mesh>

            {/* Glowing windows */}
            {[-1, 1].map((x, i) => (
                <mesh key={i} position={[x, 1.4, 1.42]}>
                    <boxGeometry args={[0.65, 0.7, 0.05]} />
                    <meshLambertMaterial color={windowGlow} emissive={windowEmis} emissiveIntensity={0.7} />
                </mesh>
            ))}

            {/* Door handle */}
            <mesh position={[0, 0.6, 1.46]}>
                <boxGeometry args={[0.25, 0.06, 0.02]} />
                <meshLambertMaterial color={chimney} />
            </mesh>
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component order MUST match STATIONS array order:
//   [0] About  [1] TechStacks  [2] Certificates  [3] Projects  [4] Contact
// ─────────────────────────────────────────────────────────────────────────────
const BUILDING_COMPONENTS = [
    AboutBuilding,       // index 0 — About Me
    SkillsBuilding,      // index 1 — Tech Stacks
    EducationBuilding,   // index 2 — Certificates & Skills
    ProjectsBuilding,    // index 3 — Projects
    ContactBuilding,     // index 4 — Contact
];

export function StationBuilding({ station, index }) {
    const floatRef = useRef();
    const ringRef = useRef();

    const phase = useGameStore((s) => s.phase);
    const currentStation = useGameStore((s) => s.currentStation);
    const visitedStations = useGameStore((s) => s.visitedStations);
    const openSection = useGameStore((s) => s.openSection);
    const revisitStation = useGameStore((s) => s.revisitStation);

    const isActive = currentStation === index;
    const isVisited = visitedStations.has(index);

    const t = STATION_TS[index];
    const pos = roadCurve.getPoint(t);

    const Building = BUILDING_COMPONENTS[index];

    useFrame((state) => {
        if (floatRef.current && isActive) {
            floatRef.current.position.y = 0.15 * Math.sin(state.clock.elapsedTime * 2.5);
        }
        if (ringRef.current) {
            ringRef.current.rotation.y += 0.01;
        }
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (phase === 'arrived' && isActive) {
            openSection();
        } else if (isVisited) {
            revisitStation(index);
        }
    };

    return (
        <group position={[pos.x + 4, 0, pos.z + 2]} onClick={handleClick}>

            {/* Ground platform — lit up in station color once visited */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
                <cylinderGeometry args={[3.5, 3.5, 0.12, 20]} />
                <meshLambertMaterial
                    color={isVisited ? station.color : '#2a3a2a'}
                    opacity={isVisited ? 1 : 0.7}
                    transparent
                />
            </mesh>

            {/* Spinning glow ring — only when this is the active station */}
            {isActive && (
                <mesh ref={ringRef} position={[0, 0.12, 0]}>
                    <torusGeometry args={[3.2, 0.12, 6, 32]} />
                    <meshLambertMaterial
                        color={station.color}
                        emissive={station.color}
                        emissiveIntensity={0.8}
                    />
                </mesh>
            )}

            {/* Building — passes buildingColor & roofColor from station data */}
            <group ref={floatRef}>
                <Building
                    color={station.buildingColor}
                    roofColor={station.roofColor}
                />

                {/* Sign post below the building label */}
                <group position={[0.2, 0, -2.5]}>
                    <mesh position={[0, 0.5, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 1, 6]} />
                        <meshLambertMaterial color="#555" />
                    </mesh>
                    <mesh position={[0, 1.0, 0]}>
                        <boxGeometry args={[1.4, 0.7, 0.08]} />
                        <meshLambertMaterial color={station.buildingColor} />
                    </mesh>
                </group>
            </group>

            {/* ── Floating Billboard Label ── */}
            {(() => {
                const billboardWidth = Math.max(3.2, station.name.length * 0.18 + 1.3);
                const borderOffset = 0.15;

                return (
                    <Billboard position={[0, 5.2, 3.5]}>

                        {/* Dark background panel */}
                        <mesh position={[0, 0, -0.05]}>
                            <boxGeometry args={[billboardWidth, 1.2, 0.06]} />
                            <meshLambertMaterial color="#0a0e1a" opacity={0.88} transparent />
                        </mesh>

                        {/* Colored border frame — uses station.color */}
                        <mesh position={[0, 0, -0.04]}>
                            <boxGeometry args={[billboardWidth + borderOffset, 1.35, 0.03]} />
                            <meshLambertMaterial color={station.color} opacity={0.9} transparent />
                        </mesh>

                        {/* Station icon image */}
                        {station.isImg && (
                            <mesh position={[-(billboardWidth / 2) + 0.6, 0.1, 0]}>
                                <planeGeometry args={[0.5, 0.5]} />
                                <shaderMaterial
                                    transparent
                                    uniforms={{ uTexture: { value: new THREE.TextureLoader().load(station.icon) } }}
                                    vertexShader={`
                                varying vec2 vUv;
                                void main() {
                                    vUv = uv;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `}
                                    fragmentShader={`
                                uniform sampler2D uTexture;
                                varying vec2 vUv;
                                void main() {
                                    vec4 tex = texture2D(uTexture, vUv);
                                    if (tex.a < 0.1) discard;
                                    gl_FragColor = vec4(1.0, 1.0, 1.0, tex.a);
                                }
                            `}
                                />
                            </mesh>
                        )}

                        {/* Station name — colored with station.color */}
                        <Text
                            position={[-(billboardWidth / 2) + 1.1, 0.1, 0]}
                            fontSize={0.28}
                            color={station.color}
                            anchorX="left"
                            anchorY="middle"
                            fontWeight="bold"
                            letterSpacing={0.03}
                        >
                            {station.name.toUpperCase()}
                        </Text>

                        {/* Stop counter */}
                        <Text
                            position={[-(billboardWidth / 2) + 1.1, -0.28, 0]}
                            fontSize={0.18}
                            color="#ffffff"
                            anchorX="left"
                            anchorY="middle"
                            opacity={0.65}
                        >
                            {`STOP ${index + 1} OF 5`}
                        </Text>

                    </Billboard>
                );
            })()}

            {/* Visited beacon sphere — glows in station.color */}
            {
                isVisited && (
                    <mesh position={[0, 6.5, 0]}>
                        <sphereGeometry args={[0.25, 8, 8]} />
                        <meshLambertMaterial
                            color={station.color}
                            emissive={station.color}
                            emissiveIntensity={1.0}
                        />
                    </mesh>
                )
            }

        </group>
    );
}