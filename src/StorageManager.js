import { ResourceTypes } from "resourceTypes";

export class StorageManager {
    #resourcesCount = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };
    get ResourcesCount() { return this.#resourcesCount; }
    
    get Iron() { return this.#resourcesCount.Iron; }
    get Stone() { return this.#resourcesCount.Stone; }
    get Wood() { return this.#resourcesCount.Wood; }
    get RawFood() { return this.#resourcesCount.RawFood; }
    get PreparedFood() { return this.#resourcesCount.PreparedFood; }

    #reservedResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    #resourcesMaxCount = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
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
            case ResourceTypes.RawFood:
                if(this.#resourcesMaxCount.RawFood == this.#resourcesCount.RawFood + this.#reservedResource.RawFood) {
                    return true;
                }
                break;
            case ResourceTypes.PreparedFood:
                if(this.#resourcesMaxCount.PreparedFood == this.#resourcesCount.PreparedFood + this.#reservedResource.PreparedFood) {
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
            case ResourceTypes.RawFood:
                newMaxCount = this.#resourcesMaxCount.RawFood + value;
                if(newMaxCount < this.#resourcesMaxCount.RawFood && this.#resourcesCount.RawFood > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.RawFood = newMaxCount;
                break;
            case ResourceTypes.PreparedFood:
                newMaxCount = this.#resourcesMaxCount.PreparedFood + value;
                if(newMaxCount < this.#resourcesMaxCount.PreparedFood && this.#resourcesCount.PreparedFood > newMaxCount) {
                    return false;
                }
                this.#resourcesMaxCount.PreparedFood = newMaxCount;
                break;
            default:
                console.error("Указан неизвестный ресурс");
                return false;
        }
        return true;
    }

    canUpdateResourcesMaxCount(resources) {
        let newMaxCount = 0;
        for (let resourceType in resources) {
            switch(resourceType) {
                case ResourceTypes.Iron:
                    newMaxCount = this.#resourcesMaxCount.Iron + resources['Iron'];
                    if(this.#resourcesCount.Iron > newMaxCount) {
                        return false;
                    }
                    break;
                case ResourceTypes.Stone:
                    newMaxCount = this.#resourcesMaxCount.Stone + resources['Stone'];
                    if(this.#resourcesCount.Stone > newMaxCount) {
                        return false;
                    }
                    break;
                case ResourceTypes.Wood:
                    newMaxCount = this.#resourcesMaxCount.Wood + resources['Wood'];
                    if(this.#resourcesCount.Wood > newMaxCount) {
                        return false;
                    }
                    break;
                case ResourceTypes.RawFood:
                    newMaxCount = this.#resourcesMaxCount.RawFood + resources['RawFood'];
                    if(this.#resourcesCount.RawFood > newMaxCount) {
                        return false;
                    }
                    break;
                case ResourceTypes.PreparedFood:
                    newMaxCount = this.#resourcesMaxCount.PreparedFood + resources['PreparedFood'];
                    if(this.#resourcesCount.PreparedFood > newMaxCount) {
                        return false;
                    }
                    break;
                default:
                    console.error("Указан неизвестный ресурс");
                    return false;
            }
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
            case ResourceTypes.RawFood:
                if(this.#resourcesCount.RawFood + value > this.#resourcesMaxCount.RawFood) {
                    resid += value - (this.#resourcesMaxCount.RawFood - this.#resourcesCount.RawFood)
                    this.#resourcesCount.RawFood += this.#resourcesMaxCount.RawFood - this.#resourcesCount.RawFood;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.RawFood += value;
                }
                break;
            case ResourceTypes.PreparedFood:
                if(this.#resourcesCount.PreparedFood + value > this.#resourcesMaxCount.PreparedFood) {
                    resid += value - (this.#resourcesMaxCount.PreparedFood - this.#resourcesCount.PreparedFood)
                    this.#resourcesCount.PreparedFood += this.#resourcesMaxCount.PreparedFood - this.#resourcesCount.PreparedFood;
                }
                else {
                    resid = 0;
                    this.#resourcesCount.PreparedFood += value;
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
        this.addResource(ResourceTypes.RawFood, resources.RawFood);
        this.addResource(ResourceTypes.PreparedFood, resources.PreparedFood);
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
            case ResourceTypes.RawFood:
                if(this.#resourcesCount.RawFood - value < 0) {
                    return false;
                }
                this.#resourcesCount.RawFood -= value;
                break;
            case ResourceTypes.PreparedFood:
                if(this.#resourcesCount.PreparedFood - value < 0) {
                    return false;
                }
                this.#resourcesCount.PreparedFood -= value;
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
        check = window.game.storageManager.reduceResource(ResourceTypes.RawFood, resources.RawFood);
        if(!check) return false;
        check = window.game.storageManager.reduceResource(ResourceTypes.PreparedFood, resources.PreparedFood);
        if(!check) return false;
        return true;
    }
}