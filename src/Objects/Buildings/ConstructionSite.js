import * as THREE from 'three';

export class ConstructionSite extends THREE.Mesh {
    constructor(building, workScore) {
        super(new THREE.BoxGeometry(building.geometry.parameters.width, 0.1, building.geometry.parameters.depth), new THREE.MeshBasicMaterial({color: 0x132530}));
        this.userData.building = building;
        this.userData.building.position.set(this.position.x, window.game.plane.position.y + this.userData.building.geometry.parameters.height / 2, this.position.z);
        this.userData.workScore = workScore;
    }

    build() {
        let check = this.userData.building.startBuild();
        if(check) {
            window.game.city.addConstructionSite(this);
        }
        return check;
    }

    work() {
        if(--this.userData.workScore == 0) {
            // TODO: Исправить позиционирование здания после постройки
            window.game.city.addBuilding(this.userData.building);
            window.game.city.removeConstructionSite(this);
        }
    }

    destroy() {
        window.game.city.removeConstructionSite(this);
        this.userData.building.returnResources();
    }

    clone() {
        return new ConstructionSite(this.userData.building.clone(), this.userData.workScore);
    }
}