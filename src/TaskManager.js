export class TaskManager {
    tasks = [];

    constructor() {}

    /**
     * Возвращает задание для жителя
     * @returns {Task} - Итоговое задание (Может вернуть undefined)
     */
    getTask() {
        let task = undefined;
        let i = 0;
        while(task == undefined && i < this.tasks.length) {
            task = this.tasks[i];
            if ((task.type == TaskTypes.Collect && window.game.storageManager.resourceIsMax(task.target.userData.type)) || !task.isFree) {
                task = undefined;
                i++;
                continue;
            }
            break;
        }
        if(task != undefined) {
            task.accept();
        }
        return task;
    }

    taskExist(task) {
        let index = this.tasks.findIndex(obj => obj.target === task.target); // Находим индекс объекта
        if (task.type == TaskTypes.Collect && window.game.storageManager.resourceIsMax(task.target.userData.type) && index !== -1) {
            task.cancel();
            return false;
        }
        else if (index !== -1) {
            return true;
        }

        task.cancel();
        return false;
    }

    createTask(target, type) {
        this.tasks.push(new Task(target, type));
    }

    deleteTask(target, type) {
        let index = this.tasks.findIndex(obj => obj.target === target); // Находим индекс объекта
        if (index !== -1) {
            this.tasks.splice(index, 1); // Удаляем объект и получаем его
        }
    }
}

export const TaskTypes = {
    Collect: 'Collect',
    Work: 'Work'
}

export class Task {
    type;
    target;
    isFree;

    constructor(target, type) {
        this.target = target;
        this.type = type;
        this.isFree = true;
    }

    getInfo() {
        return this.target.Info;
    }

    accept() {
        this.isFree = false;
    }

    cancel() {
        this.isFree = true;
    }
}