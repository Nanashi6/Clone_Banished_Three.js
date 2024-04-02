import * as THREE from 'three';
import { ResourceType } from 'resourceType';

// TODO: Данный класс находится под угрозой удаления, т.к. поднимаемые ресурсфы это лишняя работа))))
export class PickableResource extends THREE.Mesh {
    /**
     * @param {ResourceType} type - Тип ресурса
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(type, geometry, material) {
        super(geometry, material);
        this.userData.type = type;
        this.userData.value = 1;
    }

    take() {
        // TODO: Удаление со сцены
        return this;
    }

    put() {
        // TODO: Добавление на сцену
    }
}