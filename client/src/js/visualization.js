import * as THREE from 'three'

import { WebVR } from 'three-full'

var polyfill = new WebVRPolyfill();

export let initSpace = () => {

      var container;
      var camera, scene, raycaster, renderer;
      var texture
      var room;
      
      init();
      animate();
      function init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x505050 );
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 100 );
        scene.add( camera );

        scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        scene.add( light );

        let canvas = document.querySelector('.xterm-text-layer')

        texture = new THREE.Texture(canvas)
        var material = new THREE.MeshBasicMaterial({ map: texture })
        // material.alphaTest = 0.5

        var geometry = new THREE.PlaneGeometry(4, 3);
        var object = new THREE.Mesh( geometry, material );

        // object.material.side = THREE.DoubleSide;

        object.position.z = -3

        scene.add(object)
        
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.vr.enabled = true;
        container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        document.body.appendChild( WebVR.createButton( renderer ) );
      }
      
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      //
      function animate() {
        renderer.animate( render );
      }
      function render() {
        texture.needsUpdate = true;
        renderer.render( scene, camera );
      }

}