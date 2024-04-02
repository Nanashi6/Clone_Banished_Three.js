import * as THREE from 'three';

export class Building extends THREE.Mesh {
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        Food: 0
    };
    
    /**
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(geometry, material) {
        super(geometry, material);
    }

    /**
     * Проверяет наличие ресурсов, необходимых для постройки
     * @returns {Boolean} 
     */
    checkRequirement() {
        // TODO: Сделать отдельный класс с методом сравнения ресурсов, чтобы не сравнивать каждый ресурс поотдельности
        if(window.game.storageManager.Iron >= this.requirementResource.Iron &&
            window.game.storageManager.Stone >= this.requirementResource.Stone &&
            window.game.storageManager.Wood >= this.requirementResource.Wood &&
            window.game.storageManager.Food >= this.requirementResource.Food) {
                return true;
            }
        return false;    
    }
}
// TODO: Сделать дом, 4 вида хранилищ и ратушу
// TODO: Методы взаимодействия для жителей 

