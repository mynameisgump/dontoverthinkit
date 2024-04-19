import { useMemo, useEffect, useState } from "react";
import { Text, Billboard, useFBX, MeshReflectorMaterial, BakeShadows } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useSpring, animated, config } from "@react-spring/three";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { easing } from "maath";
import * as THREE from "three";
import { Perf } from "r3f-perf";

import { Instances, Computers } from "./Computers";

function Background() {
  const texture = useLoader(THREE.TextureLoader, "./background.jpg");
  return (
    <mesh position={[0, 0, -10]} scale={[10, 10, 1]}>
      <planeGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}

function Button({ children, onClick, ...props }) {
  const [hovering, setHover] = useState(false);
  const fbx = useFBX("./tape.fbx");
  const scene = useMemo(() => fbx.clone(), [fbx]);
  const { scale } = useSpring({ scale: hovering ? 1.1 : 0.9, config: config.stiff });
  const { rotation } = useSpring({ rotation: hovering ? [0, 0, 0] : [0, Math.PI / 8, 0], config: config.stiff });
  useEffect(() => {
    if (hovering) document.body.style.cursor = "pointer";
    return () => (document.body.style.cursor = "auto");
  }, [hovering]);
  return (
    <Billboard
      follow
      {...props}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <animated.mesh scale={scale} rotation={rotation}>
        <primitive scale={0.0035} object={scene} />
        <Text font="./Marker.ttf" position={[0, 0.075, 0.31]} fontSize={0.1} color={"black"} letterSpacing={0.1}>
          {children}
        </Text>
      </animated.mesh>
    </Billboard>
  );
}

export default function Homepage() {
  const [showImg, setShowImg] = useState(false);

  const handleInfoClick = () => {
    setShowImg("./poster.png");
  };

  const handleRegisterClick = () => {
    window.open("https://share.hsforms.com/1Xt665hUURr6e9EFAq1H0hAqf935", "_blank");
  };

  const handleSponsorClick = () => {
    window.open("./JoinTheRebellion.pdf", "_blank");
  };

  return (
    <>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [-1.5, 1, 3.5], fov: 45, near: 1, far: 20 }} eventSource={document.getElementById("root")} eventPrefix="client">
        <Background />
        <color attach="background" args={["gray"]} />
        <hemisphereLight intensity={1.0} groundColor="black" />
        <spotLight position={[0, 2, 5]} intensity={10} angle={0.3} penumbra={1} castShadow />
        <Perf></Perf>
        {/* spotlight indicator */}
        {/* <mesh position={[0, 2, 5]}>
        <coneGeometry args={[0.1, 0.3, 4]} />
        <meshBasicMaterial color="red" />
      </mesh> */}

        <Button onClick={() => handleInfoClick()} position={[-0.0, -0.3, 1]}>
          INFO
        </Button>
        <Button
          onClick={() => {
            handleRegisterClick();
          }}
          position={[-0.6, -0.45, 1]}
        >
          REGISTER
        </Button>
        <Button
          position={[-0.0, -0.6, 1]}
          onClick={() => {
            handleSponsorClick();
          }}
        >
          SPONSOR
        </Button>
        <group position={[-0, -1, 0]}>
          <Instances>
            <Computers scale={0.5} />
          </Instances>
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
        </group>
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
          <DepthOfField target={[0, 0, 0]} focalLength={1} bokehScale={15} height={700} />
        </EffectComposer>
        <CameraRig />
        <BakeShadows />
      </Canvas>
      {showImg && (
        <div style={{}}>
          <img
            src={showImg}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              height: "70vh",
            }}
          />
          <button
            onClick={() => setShowImg(false)}
            style={{
              position: "absolute",
              left: "50%",
              bottom: "5vh",
              transform: "translate(0,-50%)",
              border: "4px green solid",
              fontSize: "20px",
              padding: "10px",
              background: "black",
              color: "white",
              cursor: "pointer",
            }}
          >
            Back to the homepage
          </button>
        </div>
      )}
    </>
  );
}

function Whiteboard(props) {
  const gltf = useFBX("./whiteboard.fbx");
  return <primitive object={gltf} {...props} />;
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 10, (1 + state.pointer.y) / 2, 9 - Math.min(window.innerWidth * 0.45, 5)], 0.5, delta);
    state.camera.lookAt(0, 0, 0);
  });
}
