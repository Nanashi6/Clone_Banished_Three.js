import { StorageBuilding } from "../StorageBuilding.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import * as THREE from 'three';

export class PreparedFoodStorage extends StorageBuilding{
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(1.98, 0.1, 1.98), new THREE.MeshBasicMaterial({color: 0x761585}));
    }

    endBuild() {
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.PreparedFood, 20);
    }

    destroy() {
        if (window.game.storageManager.canUpdateResourcesMaxCount({'PreparedFood': -20})) {
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.PreparedFood, -20);
            super.destroy();
        }
        else {
            console.log('Здание не может быть снесено');
        }
    }
}