import { TaskTypes } from "../../../TaskManager.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';

export class ForesterLodge extends WorkBuilding {
    constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(3.98, 4, 1.98), new THREE.MeshBasicMaterial({color: 0x789456}));
        this.userData.targetResource = undefined;
    }

    endBuild() {
        console.log('создал')
        this.userData.targetResource = window.game.terrainResourcesManager.getRandomTree();
        this.userData.targetResource.collect();
    }

    simulate() {
        if(this.userData.targetResource != undefined && !window.game.terrainResourcesManager.resourceExist(this.userData.targetResource)) {
            this.userData.targetResource = undefined;
        }
        else if(this.userData.targetResource == undefined) {
            console.log('создал 2')
            this.userData.targetResource = window.game.terrainResourcesManager.getRandomTree();
            this.userData.targetResource.collect();
        }
    }

    work() {}
}