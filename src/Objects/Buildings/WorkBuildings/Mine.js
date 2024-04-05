import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';

export class Mine extends WorkBuilding {
    constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(5.98, 4, 3.98), new THREE.MeshBasicMaterial({color: 0x789456}));
    }
}