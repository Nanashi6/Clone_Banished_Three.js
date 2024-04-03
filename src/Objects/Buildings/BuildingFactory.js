import * as THREE from 'three';
import { BuildingTypes } from './BuildingTypes.js';
import { Building } from './Building.js';
import { ConstructionSite } from './ConstructionSite.js';

/**
 * Фабрика зданий
 * @param {BuildingTypes} buildingType 
 */
export function CreateBuilding(buildingType) {
    switch(buildingType) {
        case BuildingTypes.Home:
            let home = new Building(new THREE.BoxGeometry(1.98, 2, 1.98), new THREE.MeshBasicMaterial({color: 0x00ff00}));
            console.log(home);
            return new ConstructionSite(home, 100);
        default:
            console.error(`${buildingType} - является неизвестным типом здания`);
    }
}