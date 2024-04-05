import { Building } from "./Building.js";
import { ResourceTypes } from 'resourceTypes';

export class StorageBuilding extends Building {
    constructor(resourceType, geometry, material) {
        super(geometry, material);
        this.resourceType = resourceType;
    }

    /**
     * Добавляет ресурс на склад
     * @param {number} value - Кол-во ресурса
     * @returns {number} - Остаток, который не поместился на склад
     */
    putResource(value) {
        let resid = window.game.storageManager.addResource(this.resourceType, value);
        return resid;
    }

    /**
     * Берёт ресурс со склада
     * @param {ResourceTypes} resourceType - Тип ресурса
     * @param {number} value - Кол-во ресурса
     * @returns {boolean} - Сообщение о успешности
     */
    takeResource(resourceType, value) {
        return window.game.storageManager.reduceResource(resourceType, value);
    }
}