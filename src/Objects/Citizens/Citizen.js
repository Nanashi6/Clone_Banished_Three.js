import * as THREE from 'three';
import { CitizenTypes } from './CitizenTypes.js';

export class Citizen extends THREE.Mesh {
    /**
     * @param {CitizenTypes} type - Роль жителя
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(type, geometry, material) {
        super(geometry, material);
        this.userData.type = type;
    }

    simulate() {}

    idle() {}

    work() {}
}