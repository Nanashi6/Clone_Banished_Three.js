import { ResourceTypes } from "../ResourceTypes.js";
import { Iron } from "./Iron.js";
import { Stone } from "./Stone.js";
import { TerrainResource } from './TerrainResource.js';
import * as THREE from 'three';
import { Tree } from "./Tree.js";
/**
 * Фабрика ресурсов
 * @param {ResourceTypes} resourceType - тип ресурса
 * @param {number} x - координата по Х
 * @param {number} z - координата по Z
 * @returns 
 */
export function CreateTerrainResource(resourceType, x, z) {
    let obj = undefined;
    switch(resourceType) {
        case ResourceTypes.Wood:
            obj = new Tree();//(ResourceTypes.Wood, new THREE.BoxGeometry(0.1, 3, 0.1), new THREE.MeshLambertMaterial({color: 0x553300}));
            obj.setPosition(x, window.game.plane.position.y/*obj.geometry.parameters.height / 2*/, z);
            return obj;
        case ResourceTypes.Iron:
            obj = new Iron();//(ResourceTypes.Iron, new THREE.BoxGeometry(0.3, 0.5, 0.3), new THREE.MeshLambertMaterial({color: 0x333333}));
            obj.setPosition(x, window.game.plane.position.y + 0.1, z);
            return obj;
        case ResourceTypes.Stone:
            obj = new Stone();//(ResourceTypes.Stone, new THREE.BoxGeometry(0.4, 0.5, 0.25), new THREE.MeshLambertMaterial({color: 0x777777}));
            obj.setPosition(x, window.game.plane.position.y + 0.23/* + obj.geometry.parameters.height / 2*/, z);
            return obj;
        case ResourceTypes.RawFood:
            obj = new TerrainResource(ResourceTypes.RawFood, new THREE.BoxGeometry(0.25, 0.4, 0.25), new THREE.MeshLambertMaterial({color: 0x560000}));
            obj.setPosition(x, window.game.plane.position.y + obj.geometry.parameters.height / 2, z);
            return obj;
        default:
            console.error(`${resourceType} - не является объектом окружения или не имеет его`);
    }
}