import { WorkBuilding } from './Objects/Buildings/WorkBuilding.js';
import { Citizen } from './Objects/Citizens/Citizen.js';

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

    #citizensMaxCount = 3;
    get CitizensMaxCount() { return this.#citizensMaxCount; }

    #citizenPerDay = 0;
    get CitizenPerDay() { return this.#citizenPerDay; }
    set CitizenPerDay(value) { this.#citizenPerDay = value; }

    updateCitizensMaxCount(value) {
        if(this.#citizens.length > this.#citizensMaxCount + value) {
            for(let i = 0; i < this.#citizens.length - (this.#citizensMaxCount + value); i++) {
                window.game.scene.remove(this.#citizens.pop());
            }
        }
        this.#citizensMaxCount += value;
    }

    constructor() {}

    simulate() {
        this.#structures.buildings.filter(building => building instanceof WorkBuilding).forEach(building => {
            building.simulate();
        });

        this.#structures.constructionSites.forEach(obj => {
            obj.simulate();
        });

        this.#citizens.forEach(citizen => {
            citizen.simulate();
        });
    }

    updateGeneralState() {
        const resources = window.game.storageManager.ResourcesCount;
        let walkSpeed = 0;
        let generalState = undefined;
        if(resources.PreparedFood > this.#citizens.length * 2) {
            walkSpeed = GeneralStates.Excellent * 0.1;
            generalState = 'Excellent';
        }
        else if(resources.PreparedFood > this.#citizens.length) {
            walkSpeed = GeneralStates.Good * 0.1;
            generalState = 'Good';
        }
        else if(resources.PreparedFood == this.#citizens.length) {
            walkSpeed = GeneralStates.Normal * 0.1;  
            generalState = 'Normal'; 
        }
        else if(resources.PreparedFood < this.#citizens.length / 2) {
            walkSpeed = GeneralStates.Awful * 0.1;
            generalState = 'Awful';
        }
        else if(resources.PreparedFood < this.#citizens.length) {
            walkSpeed = GeneralStates.Bad * 0.1;
            generalState = 'Bad';
        }

        this.#citizens.forEach(obj => {
            obj.WalkSpeed = walkSpeed;
            obj.eat();
        });
        // console.log(this.#citizenPerDay)
        this.addCitizens(this.#citizenPerDay);
        window.ui.updateGeneralState(generalState);
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
        if(this.#citizens.length >= this.#citizensMaxCount) {
            console.error("Число жителей уже достило максимума");
            return;
        }
        if(citizen.position.y != -1) {
            citizen.setPosition(0, window.game.plane.position.y, 0);
        }
        this.#citizens.push(citizen);
        window.game.scene.add(citizen);
    }

    addCitizens(newCitizensCount) {
        for(let i = 0; i < newCitizensCount; i++) {
            this.addCitizen(new Citizen(/*new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshPhongMaterial({color: 0xffffff})*/));
        }
    }

    removeCitizen(citizen) {
        let index = this.#citizens.findIndex(obj => obj === citizen); // Находим индекс объекта
        if (index !== -1) {
            if(this.#citizens[index].userData.task != undefined) {
                this.#citizens[index].userData.task.cancel();
            }
            window.game.scene.remove(this.#citizens[index]);
            this.#citizens.splice(index, 1)
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

const GeneralStates = {
    Bad: 0.75, 
    Normal: 1,
    Awful: 0.5, 
    Good: 1.25, 
    Excellent: 1.5
}
