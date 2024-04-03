import * as THREE from 'three';
import { ResourceType } from 'resourceType';

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

    // Создать метод вызываемый при первом появлении ресурса и добавляющий таск на перенос

    take() {
        // TODO: Удаление со сцены
        return this;
    }

    put() {
        // TODO: Добавление на сцену
    }
}