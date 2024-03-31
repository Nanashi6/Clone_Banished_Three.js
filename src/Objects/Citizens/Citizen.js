import * as THREE from 'three';

export class Citizen extends THREE.Mesh {
    /**
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(geometry, material) {
        super(geometry, material);
    }
}