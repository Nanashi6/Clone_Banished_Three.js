import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { Building } from "../Building.js";
import * as THREE from 'three';

export class TownHall extends Building{
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    constructor() {
        super(new THREE.BoxGeometry(5.98, 2, 5.98), new THREE.MeshBasicMaterial({color: 0x057f10}));
    }

    endBuild() {
        window.game.city.updateCitizensMaxCount(5);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.PreparedFood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.RawFood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Iron, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Wood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Stone, 20);
        // TODO: Сделать добавление жителя раз в день, если есть свободное место для жителя
    }
}