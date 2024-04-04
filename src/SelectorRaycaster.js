import { ResourceTypes } from "./Objects/Resources/ResourceTypes.js";
import { TerrainResource } from "./Objects/Resources/TerrainResources/TerrainResource.js";
import * as THREE from 'three';

export class SelectorRaycaster {
    mousePosition = {
        start: new THREE.Vector2(),
        end: new THREE.Vector2()
    };
    raycaster;
    intersects;

    selectorType;
    selectedObjects;

    camera;
    plane;

    constructor(camera, plane) {
        this.camera = camera;
        this.plane = plane;

        this.raycaster = new THREE.Raycaster();

        this.selectorType = SelectorTypes.WoodSelector;
        
        this.selectedObjects = undefined;

        document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove.bind(this), false);
    }

    /**
     * Событие щелчка мыши
     */
    onMouseDown(event) {
        if (event.button === 0) {
            // Стартовая позиция курсора
            this.mousePosition.start.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.start.y = -(event.clientY / window.innerHeight) * 2 + 1;

            if (this.selectorType == SelectorTypes.Default) {
                this.#oneObjectSelect();
            }
        }
        else if(event.button === 2) {
            this.#selectorToDefault();
        }
    }

    // TODO: Динамическое подсвечивание выделенных ресурсов
    onMouseMove(event) {}

    onMouseUp(event) {
        if (event.button == 0) {
            this.mousePosition.end.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.end.y = -(event.clientY / window.innerHeight) * 2 + 1;

            switch(this.selectorType) {
                case SelectorTypes.WoodSelector:
                    this.#woodSelect();
                    break;
                case SelectorTypes.IronSelector:
                    this.#ironSelect();
                    break;
                case SelectorTypes.StoneSelector:
                    this.#stoneSelect();
                    break;
                case SelectorTypes.AllResourceSelector:
                    this.#woodSelect();
                    this.#ironSelect();
                    this.#stoneSelect();
                    break;
                case SelectorTypes.CancelCollect:
                    this.#cancelCollect();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Метод выделения одиночного объекта
     */
    #oneObjectSelect() {
        this.raycaster.setFromCamera(this.mousePosition.start, this.camera);
        this.intersects = this.raycaster.intersectObjects(window.game.city.Structures);
        if (this.intersects.length > 0) {
            console.log(this.intersects[0].object);
        }
    }

    #woodSelect() {
        let positions = this.getSelectorSquare();
        const startPos = positions[0];
        const endPos = positions[1];

        let filteredObjects = window.game.terrainResources.filter(resource => resource.userData.type === ResourceTypes.Wood && !resource.userData.collect &&
                                            (resource.position.x >= startPos.x && resource.position.x <= endPos.x) &&
                                            (resource.position.z >= startPos.z && resource.position.z <= endPos.z))
            
        filteredObjects.forEach(obj => {
            obj.collect();
        });
    }

    #ironSelect() {
        let positions = this.getSelectorSquare();
        const startPos = positions[0];
        const endPos = positions[1];

        let filteredObjects = window.game.terrainResources.filter(resource => resource.userData.type === ResourceTypes.Iron && !resource.userData.collect &&
                                            (resource.position.x >= startPos.x && resource.position.x <= endPos.x) &&
                                            (resource.position.z >= startPos.z && resource.position.z <= endPos.z))
            
        filteredObjects.forEach(obj => {
            obj.collect();
        });
    }

    #stoneSelect() {
        let positions = this.getSelectorSquare();
        const startPos = positions[0];
        const endPos = positions[1];

        let filteredObjects = window.game.terrainResources.filter(resource => resource.userData.type === ResourceTypes.Stone && !resource.userData.collect &&
                                            (resource.position.x >= startPos.x && resource.position.x <= endPos.x) &&
                                            (resource.position.z >= startPos.z && resource.position.z <= endPos.z))
            
        filteredObjects.forEach(obj => {
            obj.collect();
        });
    }

    #cancelCollect() {
        let positions = this.getSelectorSquare();
        const startPos = positions[0];
        const endPos = positions[1];

        let filteredObjects = window.game.terrainResources.filter(resource => resource.userData.collect &&
                                            (resource.position.x >= startPos.x && resource.position.x <= endPos.x) &&
                                            (resource.position.z >= startPos.z && resource.position.z <= endPos.z))
            
        filteredObjects.forEach(obj => {
            obj.collect();
        });
    }

    /**
     * Метод обнуления селектора
     */
    #selectorToDefault() {
        this.selectorType = SelectorTypes.Default;
    }

    /**
     * @returns Возвращает левую верхнюю и правую нижнюю точки выделения
     */
    getSelectorSquare() {
        let startPos, endPos;
        // Стартовая позиция выделения
        this.raycaster.setFromCamera(this.mousePosition.start, this.camera);
        this.intersects = this.raycaster.intersectObject(this.plane);
        if(this.intersects.length > 0) {
            const intersect = this.intersects[0];
            startPos = new THREE.Vector3().copy(intersect.point);//.addScalar(0.5);
        }

        // Конечная позиция выделения
        this.raycaster.setFromCamera(this.mousePosition.end, this.camera);
        this.intersects = this.raycaster.intersectObject(this.plane);
        if(this.intersects.length > 0) {
            const intersect = this.intersects[0];
            endPos = new THREE.Vector3().copy(intersect.point);//.addScalar(0.5);
        }

        if(startPos.x > endPos.x) {
            let temp = startPos.x;
            startPos.x = endPos.x;
            endPos.x = temp;
        }

        if(startPos.z > endPos.z) {
            let temp = startPos.z;
            startPos.z = endPos.z;
            endPos.z = temp;
        }

        return [startPos, endPos];
    }

    /**
     * Проверяет пересечения макета со зданиями
     * @param {buildings} obj - Здание
     * @returns 
     */
    hasIntersect(obj) {
        // Ограничивающие объемы для BoxGeometry и PlaneGeometry
        const boxBounds = new THREE.Box3().setFromObject(obj);
        const planeBounds = new THREE.Box3().setFromObject();

        // Проверяем пересечение между ограничивающими объемами
        return planeBounds.intersectsBox(boxBounds);
    }
}

export const SelectorTypes = {
    Default: 'Default',
    WoodSelector: 'WoodSelector',
    StoneSelector: 'StoneSelector',
    IronSelector: 'IronSelector',
    AllResourceSelector: 'AllResourceSelector',
    CancelCollect: 'CancelCollect'
}