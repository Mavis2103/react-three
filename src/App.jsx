import { useEffect, useRef, useState } from 'react';
import './App.css';
import Model from './Model';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
function App() {
  const [h, setH] = useState();
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    const crd = pos.coords;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    console.log(setH(distance(crd.latitude, 16.0575, crd.longitude, 108.1889)));
  }
  useEffect(() => {
    if (h && h >= 0) {
      alert(h);
    }
  }, [h]);
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
  return (
    <div className='App'>
      <a-scene
        renderer='logarithmicDepthBuffer: true;'
        loading-screen='enabled: false;'
        arjs='sourceType: webcam; debugUIEnabled: false;'
        raycaster='objects: [gps-entity-place];'
        vr-mode-ui='enabled: false'>
        <a-assets>
          <a-asset-item
            id='animated-asset'
            src='https://raw.githubusercontent.com/FutureEyes/FutureEyes.github.io/main/arlocation/assets/asset.gltf'></a-asset-item>
        </a-assets>
        <a-entity id='ambientlight' light='type: ambient; intensity: 0.4;' target='#directionaltarget'></a-entity>
        <a-light type='directional' position='0 0 0' rotation='0 0 0' target='#directionaltarget' />
        <a-entity id='directionaltarget' position='0 0 -1'>
          <a-entity
            id='entity-model'
            look-at='[gps-camera]'
            animation-mixer='loop: repeat'
            gltf-model='https://raw.githubusercontent.com/FutureEyes/FutureEyes.github.io/main/arlocation/assets/asset.gltf'
            light='type: ambient; intensity: 0.4;'
            scale='0.5 0.5 0.5'></a-entity>
        </a-entity>
        <a-camera gps-camera rotation-reader></a-camera>
      </a-scene>
    </div>
  );
}
function Thing() {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.0));
  return (
    <mesh ref={ref} onClick={e => console.log('click')} onPointerOver={e => console.log('hover')} onPointerOut={e => console.log('unhover')}>
      <meshPhysicalMaterial roughness={0} transmission={1} thickness={2} />
      <icosahedronGeometry attach='geometry' args={[2, 0]} />
    </mesh>
  );
}
function distance(lat1, lat2, lon1, lon2) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
}

export default App;
