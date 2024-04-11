import { StorageBuilding } from "../StorageBuilding.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import * as THREE from 'three';

import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';

export class StoneStorage extends StorageBuilding{
    requirementResource = {
        Iron: 3,
        Stone: 8,
        Wood: 5,
        RawFood: 0,
        PreparedFood: 0
    };

    static meshPromise = null;
  
    static width = 0.98;
    static height = 1;
    static depth = 0.98;
    get Width() { return StoneStorage.width; }
    get Height() { return StoneStorage.height; }    
    get Depth() { return StoneStorage.depth; }

    constructor() {
      super(ResourceTypes.Stone); // Вызываем конструктор родительского класса

      if (StoneStorage.meshPromise === null) {
        console.log('kmkm')
        StoneStorage.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/StoneStorage.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/StoneStorage.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = this.width / size.x;
              const scaleY = this.height / size.y;
              const scaleZ = this.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              // console.log(object)
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }.bind(this), undefined, reject);
          }.bind(this));
        });
      }
  
      const self = this;
  
      StoneStorage.meshPromise
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

    // constructor(resourceType) {
    //     super(resourceType, new THREE.BoxGeometry(1.98, 0.1, 1.98), new THREE.MeshPhongMaterial({color: 0x141895}));
    // }

    endBuild() {
        window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Stone, 20);
    }

    destroy() {
        if (window.game.storageManager.canUpdateResourcesMaxCount({'Stone': -20})) {
            window.game.storageManager.updateResourcesMaxCount(ResourceTypes.Stone, -20);
            super.destroy();
        }
        else {
            console.log('Здание не может быть снесено');
        }
    }
}