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
camera.position.set( 0, 100, 0 );
controls.update()

const particles = []
const particle_num = 1000
const G = 100

for(let i=0; i < particle_num; i++) {
    const particle = new Particle()
    particles.push(particle)
    particle.setMass(0.01)
    particle.setPosition(Math.random()*100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50)
    if(i !== 0)
        particle.velocity.set(Math.random(), Math.random(), Math.random())
    particle.setRadius(0.1)
    particle.setColorHex(0xff0000)
    scene.add(particle.mesh)
}

const light = new THREE.AmbientLight(0xffffff, 0.9)
light.position.set(1000, 1000, 1000)
scene.add(light)

const p_light = new THREE.PointLight(0xffffff, 10000, 0, 1)
p_light.position.set(0, 100, 0)
scene.add(p_light)

const fps = 30
const lastUpdated = Date.now()
const density = new Array(particle_num).fill(0)

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

            if(r < 5) {
                density[i] += 1
                density[j] += 1
            }

            if(r < p1.radius || r < p2.radius) continue

            const gravity = rv.multiplyScalar(G * p1.mass * p2.mass / (r * r))
            p1.force.add(gravity)
            p2.force.add(gravity.negate())
        }
    }

    for(let i=0; i < particle_num; i++) {
        particles[i].integrate(1/fps)
        particles[i].setColorHex(0xff0000 / particle_num * density[i])
        density[i] = 0
        particles[i].force.set(0, 0, 0)
    }

    controls.update()

    renderer.render(scene, camera)
}

animate()
