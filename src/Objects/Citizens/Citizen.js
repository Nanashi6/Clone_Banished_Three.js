import * as THREE from 'three';
import { CitizenTypes } from './CitizenTypes.js';
import { CitizenStates } from './CitizenStates.js';
import { ResourceTypes } from '../Resources/ResourceTypes.js';

export class Citizen extends THREE.Mesh {
    set WalkSpeed(value) { this.userData.walkSpeed = value; }
    /**
     * @param {CitizenTypes} type - Роль жителя
     * @param {THREE.BufferGeometry} geometry 
     * @param {THREE.Material} material 
     */
    constructor(geometry, material) {
        super(geometry, material);
        this.userData.currentState = CitizenStates.Idle;
        this.userData.task = undefined;
        this.userData.walkSpeed = 0.1;
        this.userData.hungryDays = 0;
        this.userData.criticalHungryDays = 3;
        this.castShadow = true;
    }

    eat() {
        let check = window.game.storageManager.reduceResource(ResourceTypes.PreparedFood, 1);
        if(!check) {
            if(++this.userData.hungryDays >= this.userData.criticalHungryDays) {
                window.game.city.removeCitizen(this);
            }
        }
        else {
            this.userData.hungryDays = 0;
        }
    }

    cancelTask() {
        this.userData.currentState = CitizenStates.Idle;
        this.userData.task = undefined;
    }

    /**
     * Симуляция текущего состояния
     */
    simulate() {
        switch(this.userData.currentState) {
            case CitizenStates.Idle:
                this.idle();
                break;
            case CitizenStates.Work:
                this.work();
                break;
            default:
                console.error(`${this.userData.currentState} это неизвестное состояние`);
        }
    }    

    idle() {
        this.userData.task = window.game.taskManager.getTask(this);
        if (this.userData.task != undefined) {
            this.userData.currentState = CitizenStates.Work;
        }
    }

    walk() { // TODO: следует также учитывать препятствия в виде зданий и объектов terrain 
        let targetX = this.userData.task.target.position.x;
        let targetZ = this.userData.task.target.position.z;

        let citizenX = this.position.x;
        let citizenZ = this.position.z;

        if (targetZ - citizenZ > 0.1) {
            this.position.z += this.userData.walkSpeed;
        }
        else if (0.1 < citizenZ - targetZ) {
            this.position.z -= this.userData.walkSpeed;
        }
        
        if (targetX - citizenX > 0.1) {
            this.position.x += this.userData.walkSpeed;
        }
        else if (0.1 < citizenX - targetX){
            this.position.x -= this.userData.walkSpeed;
        }
    }

    work() {
        if(window.game.taskManager.taskExist(this.userData.task)) {
            if (this.hasIntersect()) {
                console.warn('работает');
                this.userData.task.target.work();
            }
            else {
                this.walk();
            }
        }
        else {
            this.userData.currentState = CitizenStates.Idle;
            this.userData.task = undefined;
        }
    }

    /**
     * Проверяет наличие пересечиния с целевым объектом
     * @param {THREE.Mesh} obj - Целевой объект
     * @returns {boolean}
     */
    hasIntersect(obj) {
        const boxBounds = new THREE.Box3().setFromObject(this.userData.task.target);
        const citizenBounds = new THREE.Box3().setFromObject(this);

        // Проверяем пересечение между ограничивающими объемами
        return citizenBounds.intersectsBox(boxBounds);
    }
}