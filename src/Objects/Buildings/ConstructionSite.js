import * as THREE from 'three';
import { TaskTypes } from '../../TaskManager.js';

export class ConstructionSite extends THREE.Mesh {
    constructor(building, workScore) {
        super(new THREE.BoxGeometry(building.geometry.parameters.width, 0.1, building.geometry.parameters.depth), new THREE.MeshBasicMaterial({color: 0x132530}));
        this.userData.building = building;
        this.userData.workScore = workScore;
    }

    checkRequirement() {
        return this.userData.building.checkRequirement();
    }

    build() {
        let check = this.userData.building.startBuild();
        if(check) {
            window.game.city.addConstructionSite(this);
            window.game.taskManager.createTask(this, TaskTypes.Work);
        }
        return check;
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
        this.userData.building.returnResources();
    }

    clone() {
        return new ConstructionSite(this.userData.building.clone(), this.userData.workScore);
    }
}