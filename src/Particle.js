import {Mesh, MeshPhongMaterial, SphereGeometry, Vector3} from "three";

export class Particle {
    constructor() {
        this.position = new Vector3(0, 0, 0)
        this.velocity = new Vector3(0, 0, 0)
        this.acceleration = new Vector3(0, 0, 0)
        this.force = new Vector3(0, 0, 0)
        this.geometry = new SphereGeometry(2)
        this.material = new MeshPhongMaterial({color: 0xffffff})
        this.mesh = new Mesh(this.geometry, this.material)
        this.mass = 1
        this.inverseMass = 1
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }

    setMass(m) {
        this.mass = m
        this.inverseMass = 1/m
    }

    setColorHex(h) {
        this.material.color.setHex(h)
    }

    setColor(c) {
        this.material.color.setRGB(c,0, 0)
    }

    setRadius(r) {
        this.geometry.scale(r, r, r)
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z)
        this.position.set(x, y, z)
    }

    translate_v(v) {
        this.position.add(v)
        this.mesh.position.add(v)
    }

    integrate(t) {
        this.position.addScaledVector(this.velocity, t)
        this.position.addScaledVector(this.acceleration, t * t * 0.5)
        this.velocity.addScaledVector(this.force, this.inverseMass * t)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }
}