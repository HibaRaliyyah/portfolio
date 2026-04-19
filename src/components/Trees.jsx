import { useMemo } from 'react';

function seededRandom(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

const TREE_COUNT = 60;

export function Trees() {
    const trees = useMemo(() => {
        return Array.from({ length: TREE_COUNT }).map((_, i) => {
            const theta = seededRandom(i * 7) * Math.PI * 2;
            const radius = 18 + seededRandom(i * 11) * 65; // bigger radius for larger world
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            if (Math.abs(x) < 6 && Math.abs(z) < 6) return null;
            // Exclusion zone around finish banner (approx x=24, z=-46)
            if (x > 14 && x < 35 && z > -55 && z < -35) return null;

            const scale = 0.7 + seededRandom(i * 5) * 1.1;
            const variant = Math.floor(seededRandom(i * 13) * 3);

            const trunkColor = ['#8B5E3C', '#7a4f30', '#9d6b42'][variant];
            // Brighter foliage to match light green world
            const foliageColor = [
                '#2d8a2a', '#3dab38', '#259c20',
                '#1e8a1a', '#48b840', '#34a030',
            ][Math.floor(seededRandom(i * 17) * 6)];

            return { x, z, scale, trunkColor, foliageColor };
        }).filter(Boolean);
    }, []);

    return (
        <group>
            {trees.map((tree, i) => (
                <group key={i} position={[tree.x, 0, tree.z]} scale={[tree.scale, tree.scale, tree.scale]}>
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <cylinderGeometry args={[0.14, 0.20, 1.2, 6]} />
                        <meshLambertMaterial color={tree.trunkColor} />
                    </mesh>
                    <mesh position={[0, 2.2, 0]} castShadow>
                        <coneGeometry args={[1.0, 2.6, 6]} />
                        <meshLambertMaterial color={tree.foliageColor} />
                    </mesh>
                    <mesh position={[0, 3.6, 0]} castShadow>
                        <coneGeometry args={[0.7, 1.8, 6]} />
                        <meshLambertMaterial color={tree.foliageColor} />
                    </mesh>
                    <mesh position={[0, 4.5, 0]} castShadow>
                        <coneGeometry args={[0.4, 1.1, 6]} />
                        <meshLambertMaterial color={tree.foliageColor} />
                    </mesh>
                </group>
            ))}

            {/* Rocks */}
            {Array.from({ length: 18 }).map((_, i) => {
                const theta = seededRandom(i * 23) * Math.PI * 2;
                const radius = 10 + seededRandom(i * 31) * 60;
                const x = Math.cos(theta) * radius;
                const z = Math.sin(theta) * radius;
                const scale = 0.25 + seededRandom(i * 37) * 0.6;
                return (
                    <mesh key={`rock${i}`} position={[x, scale * 0.3, z]}
                        scale={[scale, scale * 0.7, scale]} castShadow>
                        <dodecahedronGeometry args={[0.9, 0]} />
                        <meshLambertMaterial color="#9a9aaa" />
                    </mesh>
                );
            })}

            {/* Decorative bushes */}
            {Array.from({ length: 20 }).map((_, i) => {
                const theta = seededRandom(i * 41) * Math.PI * 2;
                const radius = 6 + seededRandom(i * 43) * 55;
                const x = Math.cos(theta) * radius;
                const z = Math.sin(theta) * radius;
                const scale = 0.4 + seededRandom(i * 47) * 0.5;
                return (
                    <mesh key={`bush${i}`} position={[x, scale * 0.5, z]} scale={[scale, scale, scale]} castShadow>
                        <sphereGeometry args={[0.7, 7, 7]} />
                        <meshLambertMaterial color="#3dab38" />
                    </mesh>
                );
            })}
        </group>
    );
}
