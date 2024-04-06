import * as THREE from 'three';
import { TaskTypes } from '../../../TaskManager.js';

/**
 * Представляет собой объект окружения из которого можно добыть ресурс
 */
export class TerrainResource extends THREE.Group {
    /**
     * @param {ResourceType} type - Тип ресурса
     */
    constructor(type) {
        super();
        this.userData.collect = false;
        this.userData.type = type;
        this.userData.workScore = 40;
        this.castShadow = true;
        this.receiveShadow = true;
        this.userData.collectTag = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), new THREE.MeshBasicMaterial({ color: 0xffff00}));
    }

    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.children.forEach(obj => {
            obj.position.set(obj.position.x+x, obj.position.y, obj.position.z+z);
        })
        this.userData.collectTag.position.set(x, y + this.geometry.parameters.height / 2 + 0.15, z);
    }
    /**
     * Метод используется для смены состояние на доступное/недоступное для сбора
     */
    collect() {
        this.userData.collect = !this.userData.collect;
        if (this.userData.collect) {
            window.game.taskManager.createTask(this, TaskTypes.Collect);
            window.game.scene.add(this.userData.collectTag);
        }
        else {
            window.game.taskManager.deleteTask(this, TaskTypes.Collect);
            window.game.scene.remove(this.userData.collectTag);
        }
    }

    /**
     * Метод добычи ресурса
     * @returns {boolean} - Сообщение о добыче ресурса
     */
    work() {
        if(this.userData.collect && --this.userData.workScore == 0) { 
            console.log(`Добыт ресурс ${this.userData.type}`);

            // Добавление добытого ресурса на склад
            window.game.storageManager.addResource(this.userData.type, 1);

            window.game.terrainResourcesManager.removeResource(this);
            window.game.scene.remove(this.userData.collectTag);
            window.game.scene.remove(this);
            window.game.taskManager.deleteTask(this, TaskTypes.Collect);
            return true;
        }
        return false;
    }
}