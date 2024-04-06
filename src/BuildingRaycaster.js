import * as THREE from 'three';
import { CreateBuilding } from './Objects/Buildings/BuildingFactory.js';

export class BuildingRaycaster {
    highlighter;

    mousePosition;
    raycaster;
    intersects;

    selectedBuilding;

    camera;
    plane;

    scene;

    constructor(camera, plane, scene) {
        this.scene = scene;
        this.camera = camera;
        this.plane = plane;

        // Выделение площади здания
        this.highlighter = undefined;

        this.mousePosition = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        // проверка доступности места для строительства и окрашивание выделителя в соответствующий цвет
        document.addEventListener('mousemove', (e) => this.setBuildHighlighterPosition(e));

        this.selectedBuilding = undefined;

        //строительство здание с проверкой на доступность места (пересечение с другими зданиями)
        document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    }

    /**
     * Создает макет здания, которое игрок хочет построить
     */
    updateBuildHighlighter(buildingType) {
        this.scene.remove(this.highlighter);

        const building = CreateBuilding(buildingType);

        if(building != undefined) {
            this.highlighter = new THREE.Mesh(
                new THREE.PlaneGeometry(building.geometry.parameters.width, building.geometry.parameters.depth),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );

            this.highlighter.rotateX(-Math.PI / 2);
            this.highlighter.position.set(0, this.plane.position.y + 0.001, 0);

            this.scene.add(this.highlighter);

            this.selectedBuilding = building;//.mesh
        }
    }

    /**
     * Устанавливает позицию макета
     * @param {event} e - Событие перемещения мыши
     */
    setBuildHighlighterPosition(e) {
        if (this.highlighter != undefined) {
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mousePosition, this.camera);
            this.intersects = this.raycaster.intersectObject(this.plane);
            if(this.intersects.length > 0) {
                const intersect = this.intersects[0];
                const highlightPos = new THREE.Vector3().copy(intersect.point).floor();//.addScalar(0.5);

                this.highlighter.position.set(highlightPos.x, this.plane.position.y + 0.001, highlightPos.z);
        
                const objectExist = window.game.city.Structures.find(obj => this.hasIntersect(obj));
                
                if (!objectExist && this.selectedBuilding.checkRequirement())
                    this.highlighter.material.color.setHex(0xFFFFFF);
                else
                    this.highlighter.material.color.setHex(0xFF0000);
            }
        }
    }

    /**
     * Событие щелчка мыши
     */
    onMouseDown(event) {
        if (event.button === 0 && this.highlighter != undefined) {
            this.#build();
        }
        else if(event.button === 2 && this.highlighter != undefined) {
            this.#destroyHighlighter();
        }
    }

    /**
     * Метод строительства здания
     */
    #build() {
        const objectExist = window.game.city.Structures.find(obj => this.hasIntersect(obj));

        if (!objectExist && this.selectedBuilding.checkRequirement()) {
            if (this.intersects.length > 0) {
                const buildingClone = this.selectedBuilding.clone();

                buildingClone.position.set(this.highlighter.position.x, this.plane.position.y + this.selectedBuilding.geometry.parameters.height / 2, this.highlighter.position.z);

                let buildAccepted = buildingClone.build(window.game.terrainResourcesManager.TerrainResources.filter(obj => this.hasIntersect(obj)));
                
                /*
                if (!buildAccepted) {
                    // this.scene.add(buildingClone);
                    window.game.city.addConstructionSite(buildingClone);
                } 
                */
                this.highlighter.material.color.setHex(0xFF0000); ////////////////////////////
            }
        }

        console.log(this.scene.children);
    }

    /**
     * Метод обнуления хайлайтера
     */
    #destroyHighlighter() {
        this.scene.remove(this.highlighter);
        this.highlighter = undefined;
        this.selectedBuilding = undefined;
    }

    /**
     * Проверяет пересечения макета со зданиями
     * @param {buildings} obj - Здание
     * @returns 
     */
    hasIntersect(obj) {
        // Ограничивающие объемы для BoxGeometry и PlaneGeometry
        const boxBounds = new THREE.Box3().setFromObject(obj);
        const planeBounds = new THREE.Box3().setFromObject(this.highlighter);

        // Проверяем пересечение между ограничивающими объемами
        return planeBounds.intersectsBox(boxBounds);
    }
}