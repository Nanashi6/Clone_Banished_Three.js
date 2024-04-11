import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { Building } from "../Building.js";
// import * as THREE from 'three';

// import { MTLLoader } from 'mtl';
// import { OBJLoader } from 'obj';

export class TownHall extends Building{
    requirementResource = {
        Iron: 50,
        Stone: 100,
        Wood: 125,
        RawFood: 0,
        PreparedFood: 0
    };

    static meshPromise = null;
  
    static width = 5.98;
    static height = 6;
    static depth = 5.98;
    get Width() { return TownHall.width; }
    get Height() { return TownHall.height; }    
    get Depth() { return TownHall.depth; }

    constructor() {
      super(); // Вызываем конструктор родительского класса

      // if (TownHall.meshPromise === null) {
      //   console.log('kmkm')
      //   TownHall.meshPromise = new Promise((resolve, reject) => {
      //     var mtlLoader = new MTLLoader();
      //     mtlLoader.load('./src/3D_Objects/TownHall.mtl', function (materials) {
      //       materials.preload();
      //       var objLoader = new OBJLoader();
      //       objLoader.setMaterials(materials);
      //       objLoader.load('./src/3D_Objects/TownHall.obj', function (object) {
      //         const boundingBox = new THREE.Box3().setFromObject(object);
      //         const size = new THREE.Vector3();
      //         boundingBox.getSize(size);
      //         const scaleX = this.width / size.x;
      //         const scaleY = this.height / size.y;
      //         const scaleZ = this.depth / size.z;
      //         object.scale.set(scaleX,scaleY,scaleZ);
      //         console.log(object)
      //         object.traverse(function (object) {
      //           if (object instanceof THREE.Mesh) {
      //             object.scale.set(scaleX, scaleY, scaleZ);
      //           }
      //         });
      //         const mesh = object;
      //         resolve(mesh);
      //       }.bind(this), undefined, reject);
      //     }.bind(this));
      //   });
      // }
  
      const self = this;
  
      TownHall.meshPromise
        .then((mesh) => {
          mesh.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
            self.add(child.clone());
          });
        })
        .catch((error) => {
          console.error('Ошибка загрузки модели:', error);
        });
    }

    // constructor() {
    //     super(new THREE.BoxGeometry(5.98, 2, 5.98), new THREE.MeshPhongMaterial({color: 0x057f10}));
    // }

    endBuild() {
        window.game.city.updateCitizensMaxCount(5);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.PreparedFood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.RawFood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Iron, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Wood, 20);
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Stone, 20);
        window.game.city.CitizenPerDay += 1;
    }

    destroy() {
        if (window.game.storageManager.canUpdateResourcesMaxCount({Iron: -20, Stone: -20, Wood: -20, RawFood: -20, PreparedFood: -20})) {
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.PreparedFood, -20);
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.RawFood, -20);
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Iron, -20);
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Wood, -20);
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Stone, -20);
            window.game.city.updateCitizensMaxCount(-5);
            window.game.city.CitizenPerDay += -1;
            super.destroy();
        }
        else {
            console.error('Здание не может быть снесено');
        }
    }
}