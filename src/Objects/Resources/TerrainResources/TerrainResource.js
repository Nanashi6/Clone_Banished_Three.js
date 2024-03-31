import * as THREE from 'three';

/**
 * Представляет собой объект окружения из которого можно добыть ресурс
 */
export class TerrainResource extends THREE.Mesh {
    /**
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(geometry, material) {
        super(geometry, material);
    }
}