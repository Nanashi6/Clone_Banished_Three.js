import { ResourceTypes } from "resourceTypes";

export class StorageManager {
    #resourcesCount = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        Food: 0
    };
    get ResourcesCount() { return this.#resourcesCount; }
    
    #resourcesMaxCount = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        Food: 0
    };
    get ResourcesMaxCount() {return this.#resourcesMaxCount; }

    constructor() {}

    /**
     * Увеличивает кол-во указанного ресурса на значение value 
     * @param {ResourceTypes} resourceType 
     * @param {number} value 
     * @returns {number} - Остаточное кол-во ресурса, котороене поместилось на склад
     */
    addResources(resourceType, value) {
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

    /**
     * Уменьшает кол-во указанного ресурса на значение value 
     * @param {ResourceTypes} resourceType 
     * @param {number} value 
     * @returns {boolean} - Сообщение о успешности уменьшения ресурсов
     */
    reduceResources(resourceType, value) {
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
}