'use client';

import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';

function TableModel({ gloss }: { gloss: number }) {
  const group = useRef<Group>(null);
  const roughness = Math.max(.08, 1 - gloss / 112);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * .07;
  });

  return (
    <group ref={group} rotation={[0.08, -0.55, 0]} position={[0, -.2, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.15, 2.15, .28, 96]} />
        <meshPhysicalMaterial color="#7a4b29" roughness={roughness} clearcoat={gloss / 125} clearcoatRoughness={roughness * .7} />
      </mesh>
      <mesh position={[0, 1.255, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.02, 96]} />
        <meshPhysicalMaterial color="#171310" roughness={roughness} clearcoat={gloss / 115} clearcoatRoughness={roughness * .55} />
      </mesh>
      {[1.18, 1.55, 1.91].map((radius) => (
        <mesh key={radius} position={[0, 1.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, .014, 12, 96]} />
          <meshStandardMaterial color="#b28a53" metalness={.55} roughness={roughness} />
        </mesh>
      ))}
      {[-1.45, 1.45].map((x) => (
        <group key={x} position={[x, .05, 0]}>
          <mesh castShadow><boxGeometry args={[.13, 1.9, .13]} /><meshStandardMaterial color="#101010" roughness={.4} metalness={.65} /></mesh>
          <mesh position={[-x, -.88, 0]} castShadow><boxGeometry args={[2.92, .13, .13]} /><meshStandardMaterial color="#101010" roughness={.4} metalness={.65} /></mesh>
        </group>
      ))}
    </group>
  );
}

function finishName(value: number) {
  if (value < 18) return 'Fosco absoluto';
  if (value < 46) return 'Acetinado profundo';
  if (value < 75) return 'Semibrilho';
  return 'Brilho espelhado';
}

export function FinishLab() {
  const [gloss, setGloss] = useState(32);

  return (
    <div className="finish-lab">
      <div className="finish-canvas" role="img" aria-label="Modelo tridimensional interativo de uma mesa com acabamento ajustável">
        <Canvas shadows camera={{ position: [5.5, 4.2, 6.5], fov: 38 }} dpr={[1, 1.6]}>
          <color attach="background" args={['#d6c9b6']} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[4, 7, 5]} intensity={5.5} castShadow color="#fff1d8" />
          <directionalLight position={[-5, 3, -4]} intensity={2.2} color="#9ab3cf" />
          <TableModel gloss={gloss} />
          <ContactShadows position={[0, -1.05, 0]} opacity={.48} scale={10} blur={2.2} far={5} />
          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.25} />
        </Canvas>
      </div>
      <div className="finish-controls">
        <div>
          <p className="micro-label">Simulador de superfície</p>
          <h3>{finishName(gloss)}</h3>
          <p>Arraste para perceber como a luz passa de difusa para especular. A meta inicial da DÉCIMA está marcada em 32%.</p>
        </div>
        <label htmlFor="gloss">Brilho percebido <output>{gloss}%</output></label>
        <input id="gloss" type="range" min="0" max="100" value={gloss} onChange={(event) => setGloss(Number(event.target.value))} />
        <div className="range-legend"><span>Fosco</span><b>Meta 32%</b><span>Espelhado</span></div>
        <p className="lab-note">Simulação visual para decisão de conceito — o resultado real deve ser validado em corpos de prova com os materiais do fornecedor.</p>
      </div>
    </div>
  );
}
