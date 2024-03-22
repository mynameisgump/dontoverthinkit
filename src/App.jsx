import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useFBX, MeshReflectorMaterial, BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'
import { Instances, Computers } from './Computers'

function Background() {
  const texture = useLoader(THREE.TextureLoader, '/background.jpg')
  return (
    <mesh position={[0, 0, -10]} scale={[10, 10, 1]}>
      <planeBufferGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [-1.5, 1, 3.5], fov: 45, near: 1, far: 20 }} eventSource={document.getElementById('root')} eventPrefix="client">
      {/* Lights */}
      <Background />
      <color attach="background" args={['gray']} />
      <hemisphereLight intensity={1.0} groundColor="black" />
      <spotLight position={[10, 20, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      {/* Main scene */}
      <group position={[-0, -1, 0]}>
        {/* Auto-instanced sketchfab model */}
        <Instances>
          <Computers scale={0.5} />
        </Instances>
        {/* Plane reflections + distance blur */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 30]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#202020"
            metalness={0.8}
          />
        </mesh>
        <Whiteboard scale={0.008} position={[0, 0, 0.2]} />
        <pointLight distance={1.5} intensity={1} position={[-0.15, 0.7, 0]} color="orange" />
      </group>
      {/* Postprocessing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
        <DepthOfField target={[0, 0, 0]} focalLength={1} bokehScale={15} height={700} />
      </EffectComposer>
      {/* Camera movements */}
      <CameraRig />
      {/* Small helper that freezes the shadows for better performance */}
      <BakeShadows />
    </Canvas>
  )
}

function Whiteboard(props) {
  const gltf = useFBX('./whiteboard.fbx')
  return <primitive object={gltf} {...props} />
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 10, (1 + state.pointer.y) / 2, 3.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
}
