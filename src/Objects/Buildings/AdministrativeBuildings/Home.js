import { Building } from "../Building.js";
import * as THREE from 'three';

export class Home extends Building{
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    constructor() {
        super(new THREE.BoxGeometry(1.98, 2, 1.98), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    }

    endBuild() {
        window.game.city.updateCitizensMaxCount(5);
    }
}