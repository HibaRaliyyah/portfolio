import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { roadCurve, STATION_TS } from './Road';

const MOVE_SPEED = 0.0025;
const ARRIVE_THRESHOLD = 0.014;
const CAR_Y = 0.15;
const FINISH_LINE = 0.99;
const FINISH_TRIGGER = 0.97;   // matches banner position

function getBuildingDoor(idx) {
    const t = STATION_TS[idx];
    const p = roadCurve.getPoint(t);
    return new THREE.Vector3(p.x + 4, 0, p.z + 2);
}

function CarModel({ color = '#e53935' }) {
    return (
        <group>
            <mesh position={[0, 0.38, 0]} castShadow>
                <boxGeometry args={[1.8, 0.46, 3.8]} />
                <meshLambertMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.88, 0.1]} castShadow>
                <boxGeometry args={[1.5, 0.5, 2.0]} />
                <meshLambertMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.82, -0.93]} rotation={[0.38, 0, 0]} castShadow>
                <boxGeometry args={[1.36, 0.46, 0.06]} />
                <meshLambertMaterial color="#93d5f5" opacity={0.85} transparent />
            </mesh>
            <mesh position={[0, 0.82, 1.09]} rotation={[-0.38, 0, 0]} castShadow>
                <boxGeometry args={[1.36, 0.44, 0.06]} />
                <meshLambertMaterial color="#93d5f5" opacity={0.85} transparent />
            </mesh>
            <mesh position={[-0.76, 0.85, 0.1]} castShadow>
                <boxGeometry args={[0.06, 0.38, 1.55]} />
                <meshLambertMaterial color="#93d5f5" opacity={0.80} transparent />
            </mesh>
            <mesh position={[0.76, 0.85, 0.1]} castShadow>
                <boxGeometry args={[0.06, 0.38, 1.55]} />
                <meshLambertMaterial color="#93d5f5" opacity={0.80} transparent />
            </mesh>
            <mesh position={[0, 1.14, 0.1]} castShadow>
                <boxGeometry args={[1.52, 0.08, 1.98]} />
                <meshLambertMaterial color="#b71c1c" />
            </mesh>
            <mesh position={[0, 0.22, -1.96]} castShadow>
                <boxGeometry args={[1.82, 0.2, 0.12]} />
                <meshLambertMaterial color="#555" />
            </mesh>
            <mesh position={[0, 0.22, 1.96]} castShadow>
                <boxGeometry args={[1.82, 0.2, 0.12]} />
                <meshLambertMaterial color="#555" />
            </mesh>
            {[-0.52, 0.52].map((x, i) => (
                <mesh key={`hl${i}`} position={[x, 0.38, -1.93]} castShadow>
                    <boxGeometry args={[0.36, 0.18, 0.06]} />
                    <meshLambertMaterial color="#fff8dc" emissive="#ffe066" emissiveIntensity={1.2} />
                </mesh>
            ))}
            {[-0.52, 0.52].map((x, i) => (
                <mesh key={`tl${i}`} position={[x, 0.38, 1.93]} castShadow>
                    <boxGeometry args={[0.36, 0.18, 0.06]} />
                    <meshLambertMaterial color="#ff1a1a" emissive="#cc0000" emissiveIntensity={1.0} />
                </mesh>
            ))}
            <mesh position={[0, 0.62, -0.75]}>
                <boxGeometry args={[0.18, 0.01, 1.1]} />
                <meshLambertMaterial color="#b71c1c" />
            </mesh>
            {[[-0.8, -1.1], [0.8, -1.1], [-0.8, 1.1], [0.8, 1.1]].map(([x, z], i) => (
                <group key={`w${i}`} position={[x, 0.22, z]}>
                    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
                        <meshLambertMaterial color="#1a1a1a" />
                    </mesh>
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.16, 0.16, 0.24, 8]} />
                        <meshLambertMaterial color="#aaa" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export function Bicycle() {
    const groupRef = useRef();
    const enterTimerRef = useRef(null);
    const wheelGroupsRef = useRef([]);

    const phase = useGameStore((s) => s.phase);
    const moving = useGameStore((s) => s.moving);
    const bicycleProgress = useGameStore((s) => s.bicycleProgress);
    const currentStation = useGameStore((s) => s.currentStation);
    const targetStation = useGameStore((s) => s.targetStation);
    const visitedStations = useGameStore((s) => s.visitedStations);
    const setMoving = useGameStore((s) => s.setMoving);
    const setBikeProgress = useGameStore((s) => s.setBikeProgress);
    const arriveAtStation = useGameStore((s) => s.arriveAtStation);
    const openSection = useGameStore((s) => s.openSection);
    const goToFinal = useGameStore((s) => s.goToFinal);

    const progressRef = useRef(bicycleProgress);
    const targetRef = useRef(targetStation);
    const enteringRef = useRef(false);
    const enterPosRef = useRef(null);
    const visitedRef = useRef(visitedStations);
    const arrivedRef = useRef(false);
    const finishingFiredRef = useRef(false);
    const finishTriggeredRef = useRef(false);  // guards arrivedFinish

    useEffect(() => { progressRef.current = bicycleProgress; }, [bicycleProgress]);
    useEffect(() => { targetRef.current = targetStation; }, [targetStation]);
    useEffect(() => { visitedRef.current = visitedStations; }, [visitedStations]);

    useEffect(() => {
        if (phase === 'game') {
            arrivedRef.current = false;
            finishingFiredRef.current = false;
            // Only reset finish trigger when restarting from beginning
            if (bicycleProgress < 0.1) finishTriggeredRef.current = false;
        }
        if (phase === 'finishing') finishingFiredRef.current = false;
    }, [phase]);

    useEffect(() => {
        if (phase === 'entering' && currentStation >= 0) {
            enteringRef.current = true;
            enterPosRef.current = getBuildingDoor(currentStation);
            enterTimerRef.current = setTimeout(() => {
                enteringRef.current = false;
                openSection();
            }, 1600);
        } else {
            enteringRef.current = false;
        }
        return () => { if (enterTimerRef.current) clearTimeout(enterTimerRef.current); };
    }, [phase, currentStation]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const { phase: curPhase, moving: curMoving } = useGameStore.getState();
        const isGame = curPhase === 'game';
        const isMoving = curMoving;
        const isEntering = enteringRef.current;

        // ── ENTERING BUILDING ──────────────────────────────────────
        if (isEntering && enterPosRef.current) {
            const door = enterPosRef.current;
            groupRef.current.position.lerp(new THREE.Vector3(door.x, 0, door.z), 0.07);
            groupRef.current.scale.lerp(new THREE.Vector3(0.2, 0.2, 0.2), 0.06);
            const camTarget = new THREE.Vector3(door.x - 4, 8, door.z + 8);
            state.camera.position.lerp(camTarget, 0.05);
            state.camera.lookAt(door.x, 1, door.z);
            return;
        }

        if (['reading', 'arrived', 'game', 'finishing', 'final'].includes(curPhase)) {
            groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }

        // ── AUTO-DRIVE TO FINISH (finishing phase) ─────────────────
        if (curPhase === 'finishing') {
            if (progressRef.current < FINISH_LINE) {
                const newP = Math.min(progressRef.current + MOVE_SPEED * 2, FINISH_LINE);
                progressRef.current = newP;
                setBikeProgress(newP);
            } else if (!finishingFiredRef.current) {
                finishingFiredRef.current = true;
                goToFinal();
            }
        }

        // ── RIDING MOVEMENT ────────────────────────────────────────
        if (isGame && isMoving && !arrivedRef.current) {
            const newP = Math.min(progressRef.current + MOVE_SPEED, 0.98);
            progressRef.current = newP;

            const tgt = targetRef.current;
            if (tgt >= 0) {
                const tStation = STATION_TS[tgt];
                if (Math.abs(newP - tStation) < ARRIVE_THRESHOLD || newP >= tStation) {
                    arrivedRef.current = true;
                    progressRef.current = tStation;
                    setBikeProgress(tStation);
                    arriveAtStation(tgt);
                    return;
                }
            } else {
                // Check station arrivals
                for (let i = 0; i < STATION_TS.length; i++) {
                    if (!visitedRef.current.has(i) &&
                        newP >= STATION_TS[i] - ARRIVE_THRESHOLD &&
                        newP <= STATION_TS[i] + ARRIVE_THRESHOLD) {
                        arrivedRef.current = true;
                        setMoving(false);
                        setBikeProgress(STATION_TS[i]);
                        arriveAtStation(i);
                        return;
                    }
                }

                // Check finish line — only after all 5 stations visited
                if (
                    !finishTriggeredRef.current &&
                    visitedRef.current.size >= 5 &&
                    newP >= FINISH_TRIGGER
                ) {
                    finishTriggeredRef.current = true;
                    setBikeProgress(FINISH_TRIGGER);
                    progressRef.current = FINISH_TRIGGER;
                    goToFinal();
                    return;
                }
            }

            setBikeProgress(newP);
        }

        const p = Math.min(Math.max(progressRef.current, 0), 0.99);
        const pos = roadCurve.getPoint(p);
        const tan = roadCurve.getTangent(p);

        groupRef.current.position.lerp(new THREE.Vector3(pos.x, CAR_Y, pos.z), 0.14);

        const targetAngle = Math.atan2(tan.x, tan.z);
        let diff = targetAngle - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * 0.12;

        const rollSpeed = (isMoving || curPhase === 'finishing') ? delta * 7 : 0;
        wheelGroupsRef.current.forEach((wg) => {
            if (wg) wg.rotation.x += rollSpeed;
        });

        // ── FOLLOW CAM ─────────────────────────────────────────────
        if (!isEntering) {
            const carPos = groupRef.current.position;
            const ahead = roadCurve.getTangent(p);
            const behindOffset = ahead.clone().multiplyScalar(-10);
            const desiredCamPos = new THREE.Vector3(
                carPos.x + behindOffset.x,
                carPos.y + 9,
                carPos.z + behindOffset.z
            );
            state.camera.position.lerp(desiredCamPos, 0.05);
            const lookAhead = new THREE.Vector3(
                carPos.x + ahead.x * 6,
                carPos.y + 0.5,
                carPos.z + ahead.z * 6
            );
            state.camera.lookAt(lookAhead);
        }
    });

    return (
        <group ref={groupRef} position={[-55, CAR_Y, 45]}>
            <CarModel color="#e53935" />
        </group>
    );
}