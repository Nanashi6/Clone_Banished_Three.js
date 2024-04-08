import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';

export class Mine extends WorkBuilding {
    static meshSample = null;
  
    width = 5.98;
    height = 3;
    depth = 3.98;

    static sizeY;

    constructor() {
      super(ResourceTypes.Iron);

      if (Mine.meshSample === null) {
        console.log('Mine load')
        Mine.meshSample = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Mine.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Mine.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              Mine.sizeY = size.y;
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
  
      Mine.meshSample
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
    //     super(resourceType, new THREE.BoxGeometry(5.98, 4, 3.98), new THREE.MeshPhongMaterial({color: 0x789456}));
    // }
}