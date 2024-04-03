import { Citizen } from './Objects/Citizens/Citizen.js';
import * as THREE from 'three';

export class City {
    #structures = {
        buildings: [],
        constructionSites: []
    }
    get Buildings() { return this.#structures.buildings; }
    get ConstructionSites() { return this.#structures.constructionSites; }

    get Structures() { return this.#structures.buildings.concat(this.#structures.constructionSites); }

    #citizens = [];
    get Citizens() { return this.#citizens; }

    #citizensMaxCount = 1;
    get CitizensMaxCount() { return this.#citizensMaxCount; }
    set CitizensMaxCount(value) {
        if(this.#citizens.length > this.#citizensMaxCount + value) {
            for(let i = 0; i < this.#citizens.length - (this.#citizensMaxCount + value); i++) {
                this.#citizens.pop();
            }
        }
        this.#citizensMaxCount += value;
    }

    constructor() {}

    simulate() {
        this.#citizens.forEach(citizen => {
            citizen.simulate();
        });
    }

    //#region Structures
    addBuilding(building) {
        this.#structures.buildings.push(building);

        // Добавление на сцену
        window.game.scene.add(building);
    }

    removeBuilding(building) {
        let index = this.#structures.buildings.findIndex(obj => obj === building); // Находим индекс объекта
        if (index !== -1) {
            this.#structures.buildings.splice(index, 1); // Удаляем объект и получаем его
        }
        
        // Удаление со сцены
        window.game.scene.remove(building);
    }

    addConstructionSite(constructionSite) {
        this.#structures.constructionSites.push(constructionSite);

        // Добавление на сцену
        window.game.scene.add(constructionSite);
    }

    removeConstructionSite(constructionSite) {
        let index = this.#structures.constructionSites.findIndex(obj => obj === constructionSite); // Находим индекс объекта
        if (index !== -1) {
            this.#structures.constructionSites.splice(index, 1); // Удаляем объект и получаем его
        }
        
        // Удаление со сцены
        window.game.scene.remove(constructionSite);
    }
    //#endregion
    
    //#region Citizens
    addCitizen(citizen) {
        if(this.#citizens.length == this.#citizensMaxCount) {
            console.error("Число жителей уже достило максимума");
            return;
        }
        this.#citizens.push(citizen);
    }

    addCitizens(newCitizensCount) {
        for(let i = 0; i < newCitizensCount; i++) {
            this.addCitizen(new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff})));
            //TODO: Внутри жителя сделать конструктор обращающийся к obj объекту жителя (Внутри City не должно быть THREE объектов)
        }
    }

    removeCitizen(citizen) {
        let index = this.#citizens.findIndex(obj => obj === citizen); // Находим индекс объекта
        if (index !== -1) {
            this.#citizens.splice(index, 1); // Удаляем объект и получаем его
        }
    }
/*
    updateMaxCitizenCount(value) {
        if(this.#citizens.length > this.#citizensMaxCount + value) {
            for(let i = 0; i < this.#citizens.length - (this.#citizensMaxCount + value); i++) {
                this.#citizens.pop();
            }
        }
        this.#citizensMaxCount += value;
    }
*/
    //#endregion
}