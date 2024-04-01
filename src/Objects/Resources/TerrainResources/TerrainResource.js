import * as THREE from 'three';

/**
 * Представляет собой объект окружения из которого можно добыть ресурс
 */
export class TerrainResource extends THREE.Mesh {
    /**
     * @param {ResourceType} type - Тип ресурса
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(type, geometry, material) {
        super(geometry, material);
        this.userData.collect = false;
        this.userData.type = type;
        this.userData.workScore = 2;
    }

    /**
     * Метод используется для смены состояние на доступное/недоступное для сбора
     */
    collect() {
        this.userData.collect = !this.userData.collect;
    }

    /**
     * Метод добычи ресурса
     * @returns {boolean} - Сообщение о добыче ресурса
     */
    work() {
        // TODO: Есть шанс, что ресурс перестанет быть отмечен как доступный для сбора и житель просто будет стоять рядом 
        // (Придумать как отменить задание при отмене сбора)
        if(collect && --this.userData.workScore == 0) { 
            console.log(`Добыт ресурс ${this.userData.type}`);
            return true;
        }
        return false;
    }
}