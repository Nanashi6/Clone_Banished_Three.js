import * as THREE from 'three';

export class TerrainResource extends THREE.Mesh {
    constructor(geometry, material) {
        super(geometry, material);
    }
}