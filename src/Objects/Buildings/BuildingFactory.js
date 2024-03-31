import * as THREE from 'three';
import { BuildingTypes } from './BuildingTypes.js';
import { Building } from './Building.js';

/**
 * Фабрика зданий
 * @param {BuildingTypes} buildingType 
 */
export function CreateBuilding(buildingType) {
    switch(buildingType) {
        case BuildingTypes.Home:
            return new Building(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({color: 0x00ff00}));
        default:
            console.error(`${buildingType} - является неизвестным типом здания`);
    }
}