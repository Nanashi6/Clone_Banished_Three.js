import { TaskTypes } from "../../../TaskManager.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';

export class ForesterLodge extends WorkBuilding {
    static meshSample = null;
  
    width = 1.98;
    height = 3;
    depth = 2.98;

    static sizeY;

    constructor() {
      super(ResourceTypes.Wood);

      if (ForesterLodge.meshSample === null) {
        console.log('ForesterLodge load')
        ForesterLodge.meshSample = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/ForesterLodge.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/ForesterLodge.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              ForesterLodge.sizeY = size.y;
              const scaleX = this.width / size.x;
              const scaleY = this.height / size.y;
              const scaleZ = this.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
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
  
      ForesterLodge.meshSample
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
    //     super(resourceType, new THREE.BoxGeometry(3.98, 4, 1.98), new THREE.MeshPhongMaterial({color: 0x789456}));
    //     this.userData.targetResource = undefined;
    // }

    endBuild() {
        console.log('создал')
        this.userData.targetResource = window.game.terrainResourcesManager.getRandomTree();
        this.userData.targetResource.collect();
    }

    simulate() {
        if(this.userData.targetResource != undefined && !window.game.terrainResourcesManager.resourceExist(this.userData.targetResource)) {
            this.userData.targetResource = undefined;
        }
        else if(this.userData.targetResource == undefined) {
            console.log('создал 2')
            this.userData.targetResource = window.game.terrainResourcesManager.getRandomTree();
            this.userData.targetResource.collect();
        }
    }

    work() {}
}