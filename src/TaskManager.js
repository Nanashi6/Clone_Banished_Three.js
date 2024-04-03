import { CitizenTypes } from "./Objects/Citizens/CitizenTypes";

export class TaskManager {
    tasks = {
        Worker: [],
        Builder: []
    };

    constructor() {}

    /**
     * Возвращает задание для жителя
     * @param {CitizenTypes} citizenRole - Роль жителя
     * @returns {Task} - Итоговое задание (Может вернуть undefined)
     */
    getTask(citizenRole) {
        let task = undefined;
        switch(citizenRole) {
            case CitizenTypes.Worker:
                task = this.getCollectTask();
                break;
            case CitizenTypes.Builder:
                for (let i = 0; i < this.tasks.Builder.length; i++) {
                    if (this.tasks.Builder[i].isFree) {
                        task = this.tasks.Builder[i];
                        this.tasks.Builder[i].accept();
                    }
                }
                break;
            default:
                console.error(`Роль ${citizenRole} не определена`);
        }
        return task;
    }

    getCollectTask() {
        // TODO: Найти таски на добычу и выдать свободный -> доставка добытого ресурса на склад
        // TODO: После добычи сразу идёт доставка на склад, подумать как это сделать
        let task = undefined;
        


        return task;
    }

    getDeliveryTask() {

    }
}

export const WorkerTaskTypes = {
    Collect: 'Collect',
    Delivery: 'Delivery'
}

export class Task {
    target;
    isFree;

    constructor(target) {
        this.target = target;
        this.isFree = true;
    }

    accept(citizen) {
        this.isFree = false;
    }
}

export class DeliveryTask extends Task {
    item;
    storage;

    // TODO: Storage по-хорошему нужно динамически прикидывать т.к. возможен случай что его удалят до доставки ресурса и житель ёбнется
    constructor(item, storage) {
        super(item);
        this.storage = storage;
    }

    // TODO: метод для смены target на storage

}