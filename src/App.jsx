import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
// import '@ar-js-org/ar.js';
// import 'aframe-extras';
// import 'aframe-look-at-component';

function App() {
  const [h, setH] = useState();
  const [distance, setDistance] = useState();

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success() {
    setDistance(modelRef.current.getAttribute('distance'));
  }
  function init(pos) {
    const crd = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    setH(crd);
  }
  useEffect(() => {
    if (h && h >= 0) {
      // alert(h);
    }
  }, [h]);
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  useLayoutEffect(() => {
    modelRef.current.addEventListener('click', evt => {
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
    navigator.geolocation.getCurrentPosition(init, error, options);
  }, []);
  navigator.geolocation.watchPosition(success, error, options);
  return (
    <>
      <div style={{ backgroundColor: 'blue' }}>{distance}</div>
      <a-scene
        inspector='https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js'
        loading-screen='enabled: false;'
        arjs='sourceType: webcam; debugUIEnabled: false;'
        renderer='antialias: true; alpha: true'>
        <a-entity id="'ambientlight" light='type: ambient; intensity: 0.4;'></a-entity>
        <a-light type='directional' position='0 0 0' rotation='0 0 0' target='#directionaltarget' />
        <a-entity id='directionaltarget' position='0 0 -1'></a-entity>
        <a-entity
          ref={modelRef}
          look-at='[gps-projected-camera]'
          animation-mixer=''
          class='collidable'
          cursor-listener=''
          gltf-model='https://raw.githubusercontent.com/FutureEyes/FutureEyes.github.io/main/arlocation/assets/asset.gltf'
          light='type: ambient; intensity: 0.4;'
          scale='0.8703297129127067 0.8703297129127067 0.8703297129127067'
          gps-projected-entity-place={`latitude:${h?.latitude}; longitude:${h?.longitude};`}></a-entity>
        <a-entity id='blockHand' laser-controls='right' raycaster='objects: .collidable' intersection-spawn='event: click; mixin: voxel'></a-entity>
        <a-camera
          gps-projected-camera
          rotation-reader
          // camera='far: 25; fov: 20'
          // position='-0.09004 0.43306 8.61567'
          // rotation=''
          look-controls='reverseMouseDrag:  true'
          wasd-controls=''
          // data-aframe-inspector-original-camera=''
        >
          <a-entity raycaster='objects: .collidable' cursor='rayOrigin: mouse' intersection-spawn='event: click; mixin: voxel'></a-entity>
        </a-camera>
      </a-scene>
    </>
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
