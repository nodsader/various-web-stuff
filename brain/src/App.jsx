import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {data} from "./data.js";
const PATHS = data.economics[0].paths;
import * as THREE from 'three';
import {extend} from '@react-three/fiber';
import {useRef} from "react";
import {shaderMaterial} from '@react-three/drei'

const randomRange = (min, max) => Math.random() * (max - min) + min;

let curves = []
for (let i = 0; i < 100; i++){
    let points = [];
    let length = randomRange(0.1, 1);
    for (let j = 0; j < 100; j++) {
        points.push(new THREE.Vector3().setFromSphericalCoords(
            1,
            Math.PI - (j / 100) * Math.PI*length,
            (i / 100) * Math.PI * 2
        )
        );
    }
    let tempcurve = new THREE.CatmullRomCurve3(points);
    curves.push(tempcurve);
}
// eslint-disable-next-line react/prop-types
function Tube({curve}) {

    const brainMat = useRef()

    const BrainMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.2, 0.4, 0.1) },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(color,1.);
    }
  `
)

// declaratively
extend({ BrainMaterial })

    return(
        <>
    <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <tubeGeometry args={[curve, 64, 0.01, 8, false]}/>
        <brainMaterial ref={brainMat}/>
    </mesh>
    </>
    );
}

function Tubes(){

    return(
        <>
            {curves.map((curve, index)=>(
                <Tube curve={curve} key={index}/>
    ))}
        </>
    )
}

export default function App() {
    return <Canvas camera={{position:[0,0,2]}}>
        <color attach={"background"} args={["black"]}/>
        <ambientLight></ambientLight>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <pointLight position={[10, 10, 10]}/>
        <Tubes></Tubes>
        <OrbitControls/>
    </Canvas>
}

