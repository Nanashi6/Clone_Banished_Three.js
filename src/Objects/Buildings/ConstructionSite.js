import * as THREE from 'three';
import { TaskTypes } from '../../TaskManager.js';
import { AudioManager } from '../../AudioManager.js';

export class ConstructionSite extends THREE.Mesh {
    constructor(building, workScore) {
        super(new THREE.BoxGeometry(building.geometry.parameters.width, 0.1, building.geometry.parameters.depth), new THREE.MeshBasicMaterial({color: 0x132530}));
        this.userData.building = building;
        this.userData.workScore = workScore;
        this.userData.resourcesForCollect = [];
        this.userData.taskCreated = false;
    }

    setResourcesForCollect(resources) {
        this.userData.resourcesForCollect = resources;
    }

    checkRequirement() {
        return this.userData.building.checkRequirement();
    }

    build(resourcesForCollect) {
        this.userData.resourcesForCollect = resourcesForCollect;

        let check = false;

        if(resourcesForCollect.length == 0) {
            check = this.userData.building.startBuild();
            if(check) {
                window.game.city.addConstructionSite(this);
                window.game.taskManager.createTask(this, TaskTypes.Work);
                this.userData.taskCreated = true;
            }
        }
        else {
            check = this.userData.building.startBuild();
            if(check) {
                window.game.city.addConstructionSite(this);
                resourcesForCollect.forEach(obj => {
                    obj.collect();
                });
            }
        }
        // console.warn(this.userData.resourcesForCollect)
        // this.userData.resourcesForCollect.forEach(obj => {
        //     console.log(window.game.terrainResourcesManager.resourceExist(obj))
        // })
        return check;
    }

    simulate() {
        let check = (this.userData.resourcesForCollect.filter(obj => window.game.terrainResourcesManager.resourceExist(obj)).length == 0);
        if (!this.userData.taskCreated && check) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }

    work() {
        if(--this.userData.workScore == 0) {
            // TODO: Исправить позиционирование здания после постройки
            this.userData.building.position.set(this.position.x, window.game.plane.position.y + this.userData.building.geometry.parameters.height / 2, this.position.z);
            this.userData.building.endBuild();
            window.game.city.addBuilding(this.userData.building);
            window.game.city.removeConstructionSite(this);
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
        }
    }

    destroy() {
        window.game.city.removeConstructionSite(this);
        window.game.taskManager.deleteTask(this, TaskTypes.Work);
        this.userData.building.destroy();
    }

    clone() {
        return new ConstructionSite(this.userData.building.clone(), this.userData.workScore);
    }
}