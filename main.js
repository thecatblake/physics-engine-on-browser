import * as THREE from 'three';
import {Particle} from "./src/Particle.js"
import {Vector3} from "three";
import {OrbitControls} from "three/addons";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update()

const particles = []
const particle_num = 3
const G = 10

for(let i=0; i < particle_num; i++) {
    const particle = new Particle()
    particles.push(particle)
    scene.add(particle.mesh)
}

particles[0].setMass(30)
particles[0].setColorHex(0xff0000)
particles[0].setPosition(20, 0, 0)
particles[1].setMass(1)
particles[1].setPosition(0, 0, 0)
particles[1].velocity.set(0, 0, -3)
particles[1].setColorHex(0x0000ff)
particles[2].setMass(1/2)
particles[2].setPosition(-20, 0, 0)
particles[2].velocity.set(0, 0, -3)

const light = new THREE.PointLight(0xffffff, 2000)
light.position.set(-10, 10, -10)
scene.add(light)

const light2 = new THREE.PointLight(0xffffff, 1000)
light2.position.set(20, 20, 20)
scene.add(light2)

const fps = 30
const lastUpdated = Date.now()

function animate() {
    requestAnimationFrame( animate );

    const now = Date.now()
    const elapsed = now - lastUpdated

    if(elapsed < 1000/fps) return

    for(let i=0; i < particle_num-1; i++) {
        const p1 = particles[i]
        for(let j=i+1; j < particle_num; j++) {
            const p2 = particles[j]
            const r = p1.position.distanceTo(p2.position)
            const rv = new Vector3(
                (p2.position.x - p1.position.x),
                (p2.position.y - p1.position.y),
                (p2.position.z - p1.position.z),
            ).normalize()

            if(r < p1.radius || r < p2.radius) continue

            const gravity = rv.multiplyScalar(G * p1.mass * p2.mass / (r * r))
            p1.force.add(gravity)
            p2.force.add(gravity.negate())
        }
    }

    for(let i=0; i < particle_num; i++) {
        particles[i].integrate(1/fps)
        particles[i].force.set(0, 0, 0)
    }

    controls.update()

    renderer.render(scene, camera)
}

animate()
