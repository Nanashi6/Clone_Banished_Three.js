import { TaskTypes } from "../../../TaskManager.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';

export class CookHouse extends WorkBuilding {
    constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(5.98, 0.1, 3.98), new THREE.MeshPhongMaterial({color: 0x164972}));
        this.userData.workScoreMax = 50;
    }

    endBuild() {
        if(window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }

    work() {
        // Готовка пока не кончится сырая пища или не заполнится склад
        if(window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            if(++this.userData.currentWorkScore == this.userData.workScoreMax) {
                this.userData.currentWorkScore = 0;
                window.game.storageManager.reduceResource(ResourceTypes.RawFood, 1);
                window.game.storageManager.addResource(this.userData.resourceType, 1);
            }
        } else {
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;           
        }
    }   

    simulate() {
        if(!this.userData.taskCreated && window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }
}