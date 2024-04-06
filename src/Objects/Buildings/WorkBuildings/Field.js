import { TaskTypes } from "../../../TaskManager.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';

export class Field extends WorkBuilding {
    constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(5.98, 0.1, 5.98), new THREE.MeshPhongMaterial({color: 0x164972}));
        this.userData.harvest = false;

        this.userData.workScoreMax = 100;
        this.userData.harvestScore = 100;

        this.userData.plantingDay = undefined;
    }

    // таска на засеивание создана в endBuild методе

    work() {
        if(this.userData.harvest && ++this.userData.currentWorkScore == this.userData.harvestScore){
            this.userData.currentWorkScore = 0;

            window.game.storageManager.addResource(this.userData.resourceType, 15);

            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
            this.userData.harvest = false;           
        }
        else if(!this.userData.harvest && ++this.userData.currentWorkScore == this.userData.workScoreMax) {
            this.userData.currentWorkScore = 0;
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;
            this.userData.plantingDay = window.game.day;
            this.userData.harvest = true;
        }
    }   

    simulate() {
        if(!this.userData.taskCreated && this.userData.harvest && window.game.day >= this.userData.plantingDay + 3 && 
            !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            console.log('Создание таска')
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }
}