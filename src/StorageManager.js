import { ResourceTypes } from "resourceTypes";

export class StorageManager {
    #resourcesCount = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        Food: 0
    };
    get ResourcesCount() { return this.#resourcesCount; }
    
    #reservedResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        Food: 0
    };

    #resourcesMaxCount = {
        Iron: 0,
        Stone: 0,
        Wood: 10,
        Food: 0
    };
    get ResourcesMaxCount() {return this.#resourcesMaxCount; }

    constructor() {}

    resourceIsMax(resourceType) {
        switch(resourceType) {
            case ResourceTypes.Iron:
                if(this.#resourcesMaxCount.Iron == this.#resourcesCount.Iron + this.#reservedResource.Iron) {
                    return true;
                }
                break;
            case ResourceTypes.Stone:
                if(this.#resourcesMaxCount.Stone == this.#resourcesCount.Stone + this.#reservedResource.Stone) {
                    return true;
                }
                break;
            case ResourceTypes.Wood:
                if(this.#resourcesMaxCount.Wood == this.#resourcesCount.Wood + this.#reservedResource.Wood) {
                    return true;
                }
                break;
            case ResourceTypes.Food:
                if(this.#resourcesMaxCount.Food == this.#resourcesCount.Food + this.#reservedResource.Food) {
                    return true;
                }
                break;
            default:
                console.error("Указан неизвестный ресурс");
                return true;
        }
        return false;
    }

    /**
     * Изменяет максимальное кол-во ресурса
     * @param {ResourceTypes} resourceType - Тип ресурса
     * @param {number} value - Кол-во изменения (положительное или отрицательное)
     * @returns {boolean} - Сообщение о успешности изменения максимального кол-ва
     */
    updateResourcesMaxCount(resourceType, value) {
        let newMaxCount = 0;
        switch(resourceType) {
            case ResourceTypes.Iron:
                newMaxCount = this.#resourcesMaxCount.Iron + value;
                if(newMaxCount < this.#resourcesMaxCount.Iron && this.#resourcesCount.Iron > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.Iron = newMaxCount;
                break;
            case ResourceTypes.Stone:
                newMaxCount = this.#resourcesMaxCount.Stone + value;
                if(newMaxCount < this.#resourcesMaxCount.Stone && this.#resourcesCount.Stone > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.Stone = newMaxCount;
                break;
            case ResourceTypes.Wood:
                newMaxCount = this.#resourcesMaxCount.Wood + value;
                if(newMaxCount < this.#resourcesMaxCount.Wood && this.#resourcesCount.Wood > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.Wood = newMaxCount;
                break;
            case ResourceTypes.Food:
                newMaxCount = this.#resourcesMaxCount.Food + value;
                if(newMaxCount < this.#resourcesMaxCount.Food && this.#resourcesCount.Food > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.Food = newMaxCount;
                break;
            default:
                console.error("Указан неизвестный ресурс");
                return false;
        }
        return true;
    }

    /**
     * Увеличивает кол-во указанного ресурса на значение value 
     * @param {ResourceTypes} resourceType 
     * @param {number} value 
     * @returns {number} - Остаточное кол-во ресурса, котороене поместилось на склад
     */
    addResource(resourceType, value) {
        let resid = 0;
        switch(resourceType) {
            case ResourceTypes.Iron:
                if(this.#resourcesCount.Iron + value > this.#resourcesMaxCount.Iron) {
                    resid += value - (this.#resourcesMaxCount.Iron - this.#resourcesCount.Iron)
                    this.#resourcesCount.Iron += this.#resourcesMaxCount.Iron - this.#resourcesCount.Iron;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.Iron += value;
                }
                break;
            case ResourceTypes.Stone:
                if(this.#resourcesCount.Stone + value > this.#resourcesMaxCount.Stone) {
                    resid += value - (this.#resourcesMaxCount.Stone - this.#resourcesCount.Stone)
                    this.#resourcesCount.Stone += this.#resourcesMaxCount.Stone - this.#resourcesCount.Stone;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.Stone += value;
                }
                break;
            case ResourceTypes.Wood:
                if(this.#resourcesCount.Wood + value > this.#resourcesMaxCount.Wood) {
                    resid += value - (this.#resourcesMaxCount.Wood - this.#resourcesCount.Wood)
                    this.#resourcesCount.Wood += this.#resourcesMaxCount.Wood - this.#resourcesCount.Wood;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.Wood += value;
                }
                break;
            case ResourceTypes.Food:
                if(this.#resourcesCount.Food + value > this.#resourcesMaxCount.Food) {
                    resid += value - (this.#resourcesMaxCount.Food - this.#resourcesCount.Food)
                    this.#resourcesCount.Food += this.#resourcesMaxCount.Food - this.#resourcesCount.Food;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.Food += value;
                }
                break;
            default:
                console.error("Указан неизвестный ресурс");
                return value;
        }
        return resid;
    }

    addResources(resources) {
        this.addResource(ResourceTypes.Iron, resources.Iron);
        this.addResource(ResourceTypes.Wood, resources.Wood);
        this.addResource(ResourceTypes.Stone, resources.Stone);
        this.addResource(ResourceTypes.Food, resources.Food);
    }

    /**
     * Уменьшает кол-во указанного ресурса на значение value 
     * @param {ResourceTypes} resourceType 
     * @param {number} value 
     * @returns {boolean} - Сообщение о успешности уменьшения ресурсов
     */
    reduceResource(resourceType, value) {
        switch(resourceType) {
            case ResourceTypes.Iron:
                if(this.#resourcesCount.Iron - value < 0) {
                    return false;
                }
                this.#resourcesCount.Iron -= value;
                break;
            case ResourceTypes.Stone:
                if(this.#resourcesCount.Stone - value < 0) {
                    return false;
                }
                this.#resourcesCount.Stone -= value;
                break;
            case ResourceTypes.Wood:
                if(this.#resourcesCount.Wood - value < 0) {
                    return false;
                }
                this.#resourcesCount.Wood -= value;
                break;
            case ResourceTypes.Food:
                if(this.#resourcesCount.Food - value < 0) {
                    return false;
                }
                this.#resourcesCount.Food -= value;
                break;
            default:
                console.error("Указан неизвестный ресурс");
                return false;
        }
        return true;
    }

    reduceResources(resources) {
        let check = window.game.storageManager.reduceResource(ResourceTypes.Iron, resources.Iron);
        if(!check) return false;
        check = window.game.storageManager.reduceResource(ResourceTypes.Wood, resources.Wood);
        if(!check) return false;
        check = window.game.storageManager.reduceResource(ResourceTypes.Stone, resources.Stone);
        if(!check) return false;
        check = window.game.storageManager.reduceResource(ResourceTypes.Food, resources.Food);
        if(!check) return false;
        return true;
    }
}