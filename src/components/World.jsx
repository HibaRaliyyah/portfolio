import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { Road } from './Road';
import { Bicycle } from './Bicycle';
import { StationBuilding } from './StationBuilding';
import { Trees } from './Trees';
import { StartFinish } from './StartFinish';
import { STATIONS } from '../data/stations';

// Hold-to-drive: press & hold anywhere to move, release to stop.
// onUp is ignored when auto-driving to a target station (rideToStation).
function DriveInputHandler() {
    const phaseRef = useRef(useGameStore.getState().phase);

    useEffect(() => {
        return useGameStore.subscribe((s) => {
            phaseRef.current = s.phase;
        });
    }, []);

    useEffect(() => {
        // canMove: only requires 'game' phase — visited-count restriction removed
        // so revisiting stations after completing all 5 still works.
        const canMove = () => phaseRef.current === 'game';

        const onDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            if (canMove()) useGameStore.getState().setMoving(true);
        };

        const onUp = () => {
            // Don't cancel movement when the car is auto-driving to a waypoint
            // (rideToStation sets targetStation >= 0 and moving:true — a pointerup
            //  from clicking the FinalMap button must not immediately undo that)
            const { targetStation } = useGameStore.getState();
            if (targetStation >= 0) return;
            useGameStore.getState().setMoving(false);
        };

        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);

        return () => {
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }, []);

    return null;
}

function Scene() {
    return (
        <>
            <fog attach="fog" args={['#6fcf6f', 60, 150]} />
            <ambientLight intensity={0.95} color="#c8f0a0" />
            <directionalLight
                position={[20, 40, 20]}
                intensity={1.6}
                color="#fff8e0"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-90}
                shadow-camera-right={90}
                shadow-camera-top={90}
                shadow-camera-bottom={-90}
                shadow-camera-near={0.1}
                shadow-camera-far={220}
                shadow-bias={-0.001}
            />
            <directionalLight position={[-15, 20, -15]} intensity={0.5} color="#90ee90" />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[120, 80]} />
                <meshLambertMaterial color="#52c234" />
            </mesh>
            {/* Depth rings */}
            {[90, 70, 55, 40].map((r, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                    <ringGeometry args={[r - 1.2, r, 80]} />
                    <meshLambertMaterial color="#45a829" opacity={0.4} transparent />
                </mesh>
            ))}


            <Road />
            <Bicycle />
            <Trees />
            <StartFinish />
            {STATIONS.map((station, i) => (
                <StationBuilding key={station.id} station={station} index={i} />
            ))}
        </>
    );
}

export function World() {
    return (
        <>
            {/* Window-level hold-to-drive handler (works over HUD + canvas) */}
            <DriveInputHandler />
            <Canvas
                camera={{ position: [0, 12, 18], fov: 55 }}
                shadows
                gl={{ antialias: true, alpha: false }}
                style={{ background: '#52c234ff' }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </>
    );
}
