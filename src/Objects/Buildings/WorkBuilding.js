import { TaskTypes } from "../../TaskManager.js";
import { Building } from "./Building.js";

export class WorkBuilding extends Building {
    get Info() { return `Working in ${this.constructor.name} \n ${this.userData.currentWorkScore}/${this.userData.workScoreMax}`};

    constructor(resourceType/*, geometry, material*/) {
        super(/*geometry, material*/);
        this.userData.workScoreMax = 100;
        this.userData.currentWorkScore = 0;
        this.userData.resourceType = resourceType;
        this.userData.taskCreated = false;
    }

    endBuild() {
        window.game.taskManager.createTask(this, TaskTypes.Work);
        this.userData.taskCreated = true;
    }

    simulate() {
        if(window.game.storageManager.resourceIsMax(this.userData.resourceType) && this.userData.taskCreated) {
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;
        }
        else if(!this.userData.taskCreated && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }

    work() {
        if(++this.userData.currentWorkScore == this.userData.workScoreMax) {
            window.game.storageManager.addResource(this.userData.resourceType, 1);
            this.userData.currentWorkScore = 0;
        }
   }
}