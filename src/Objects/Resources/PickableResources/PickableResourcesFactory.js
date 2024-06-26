import { ResourceTypes } from "../ResourceTypes.js";
import { PickableResource } from './PickableResource.js';
import * as THREE from 'three';

/**
 * Фабрика поднимаемых/переносимых ресурсов
 * @param {ResourceTypes} resourceType - тип ресурса
 * @param {number} x - координата по Х
 * @param {number} z - координата по Z
 * @returns 
 */
export function CreatePickableResource(resourceType, x, z) {
    let obj = undefined;
    switch(resourceType) {
        case ResourceTypes.Wood:
            obj = new PickableResource(new THREE.BoxGeometry(0.15, 0.15, 0.5), new THREE.MeshBasicMaterial({color: 0x553300}));
            obj.position.set(x, window.game.plane.position.y + obj.geometry.parameters.height / 2, z);
            return obj;
        case ResourceTypes.Iron:
            obj = new PickableResource(new THREE.BoxGeometry(0.25, 0.25, 0.25), new THREE.MeshBasicMaterial({color: 0x333333}));
            obj.position.set(x, window.game.plane.position.y + obj.geometry.parameters.height / 2, z);
            return obj;
        case ResourceTypes.Stone:
            obj = new PickableResource(new THREE.BoxGeometry(0.25, 0.25, 0.25), new THREE.MeshBasicMaterial({color: 0x777777}));
            obj.position.set(x, window.game.plane.position.y + obj.geometry.parameters.height / 2, z);
            return obj;
        default:
            console.error(`${resourceType} - не является объектом окружения или не имеет его`);
    }
    return obj;
}