import * as THREE from 'three';

export class PickableResource extends THREE.Mesh {
    constructor(geometry, material) {
        super(geometry, material);
    }
}