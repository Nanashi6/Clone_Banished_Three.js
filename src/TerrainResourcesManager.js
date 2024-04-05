import { ResourceTypes } from "./Objects/Resources/ResourceTypes.js";
import { CreateTerrainResource } from "./Objects/Resources/TerrainResources/TerrainResourcesFactory.js";
import * as THREE from 'three';

export class TerrainResourcesManager {
    #terrainResources = [];
    get TerrainResources() { return this.#terrainResources }

    constructor() {}

    addTerrainResource(resource) {
        this.#terrainResources.push(resource);
    }

    getRandomTree() {
        const list = this.#terrainResources.filter(obj => obj.userData.type == ResourceTypes.Wood);
        const randomIndex = Math.floor(Math.random() * list.length);
        console.log(list);
        console.log(randomIndex);
        return list[randomIndex];
    }
    
    generateRandomTree() {
        let point = this.getRandomPointInsideSquare();
        while(true) {
            let tree = CreateTerrainResource(ResourceTypes.Wood, point.x, point.y);
            if(!this.hasIntersectWithStructures(tree)) {
                window.game.scene.add(tree);
                this.addTerrainResource(tree);
                break;
            }
            else {
                point = this.getRandomPointInsideSquare();
            }
        }
    }

    generateRandomStone() {
        let point = this.getRandomPointInsideSquare();
        while(true) {
            let stone = CreateTerrainResource(ResourceTypes.Stone, point.x, point.y);
            if(!this.hasIntersectWithStructures(stone)) {
                window.game.scene.add(stone);
                this.addTerrainResource(stone);
                break;
            }
            else {
                point = this.getRandomPointInsideSquare();
            }
        }
    }

    generateRandomIron() {
        let point = this.getRandomPointInsideSquare();
        while(true) {
            let iron = CreateTerrainResource(ResourceTypes.Iron, point.x, point.y);
            if(!this.hasIntersectWithStructures(iron)) {
                window.game.scene.add(iron);
                this.addTerrainResource(iron);
                break;
            }
            else {
                point = this.getRandomPointInsideSquare();
            }
        }
    }

    resourceExist(resource) {
        let index = this.#terrainResources.findIndex(obj => resource.userData.type == obj.userData.type && resource.position.x === obj.position.x && obj.position.z === resource.position.z); // Находим индекс объекта
        if(index != -1) {
            return true;
        }
        return false;
    }

    removeResource(resource) {
        let index = this.#terrainResources.findIndex(obj => resource.userData.type == obj.userData.type && resource.position === obj.position); // Находим индекс объекта
        if (index !== -1) {
            if(resource.userData.type == ResourceTypes.Wood) {
                this.generateRandomTree();
            }
            this.#terrainResources.splice(index, 1); // Удаляем объект и получаем его
        }
    }

    /**
     * Функция для получения случайной точки внутри окружности
     */ 
    getRandomPointInsideCircle(centerX = 0, centerY = 0, radius = 10) {
        const randomRadius = Math.random() * radius;
        const angle = Math.random() * 2 * Math.PI;

        const x = centerX + Math.cos(angle) * randomRadius;
        const y = centerY + Math.sin(angle) * randomRadius;

        return { x, y };
    }

    /** 
     * Функция для получения случайной точки внутри квадрата
     */ 
    getRandomPointInsideSquare(topLeftX = -50, topLeftY = -50, sideLength = 100) {
        const randomX = Math.random() * sideLength;
        const randomY = Math.random() * sideLength;

        const x = topLeftX + randomX;
        const y = topLeftY + randomY;

        return { x, y };
    }

    hasIntersectWithStructures(obj) {
        // Ограничивающие объемы для BoxGeometry и PlaneGeometry
        const boxBounds = new THREE.Box3().setFromObject(obj);
        window.game.city.Structures.forEach(object => {
            const planeBounds = new THREE.Box3().setFromObject(object);
            let check = planeBounds.intersectsBox(boxBounds);
            if(check) return true;
        });

        // Проверяем пересечение между ограничивающими объемами
        return false;
    }
}