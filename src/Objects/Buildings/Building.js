import * as THREE from 'three';
import { ResourceTypes } from 'resourceTypes';

export class Building extends THREE.Mesh {
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    #returnRate = 0.4;
    
    /**
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(geometry, material) {
        super(geometry, material);
    }

    /**
     * Проверяет наличие ресурсов, необходимых для постройки
     * @returns {boolean} 
     */
    checkRequirement() {
        // TODO: Сделать отдельный класс с методом сравнения ресурсов, чтобы не сравнивать каждый ресурс поотдельности
        if(window.game.storageManager.Iron < this.requirementResource.Iron &&
            window.game.storageManager.Stone < this.requirementResource.Stone &&
            window.game.storageManager.Wood < this.requirementResource.Wood &&
            window.game.storageManager.RawFood < this.requirementResource.RawFood &&
            window.game.storageManager.PreparedFood < this.requirementResource.PreparedFood) {
                return false;
            }
        return true;    
    }

    /**
     * Начало строительство здания
     * @returns {boolean} - Сообщение о успешности
     */
    startBuild() {
        let check = window.game.storageManager.reduceResources(this.requirementResource);
        return check;
    }
    
    endBuild() {
        // TODO: Добавляются бонусы от здания
        throw new Error('Метод endBuild должен быть переопреден в наследниках');
    }

    /**
     * Метод для уничтожения здания
     */
    destroy() {
        window.game.city.removeBuilding(this);
        this.returnResources();
    }

    returnResources() {
        let resources = {};
        for (let key in this.requirementResource) {
            resources[key] = this.requirementResource[key] * this.#returnRate;
        }
        window.game.storageManager.addResources(resources);
    }
}
