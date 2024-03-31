export class City {
    #buildings = [];
    get Buildings() { return this.#buildings; }

    constructor() {

    }

    addBuilding(building) {
        this.#buildings.push(building);
    }

    removeBuilding(building) {
        let index = this.#buildings.findIndex(obj => obj === building); // Находим индекс объекта
        if (index !== -1) {
            this.#buildings.splice(index, 1); // Удаляем объект и получаем его
        }
    }
}