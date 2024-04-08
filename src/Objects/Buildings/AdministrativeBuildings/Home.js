import { Building } from "../Building.js";
import * as THREE from 'three';
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';

export class Home extends Building{
    requirementResource = {
        Iron: 0,
        Stone: 0,
        Wood: 0,
        RawFood: 0,
        PreparedFood: 0
    };

    static meshPromise = null;
  
    width = 1.98;
    height = 2;
    depth = 1.98;

    constructor() {
      super(); // Вызываем конструктор родительского класса

      if (Home.meshPromise === null) {
        console.log('kmkm')
        Home.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Home3.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Home3.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = this.width / size.x;
              const scaleY = this.height / size.y;
              const scaleZ = this.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              console.log(object)
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
  
      Home.meshPromise
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
    //     super(/*new THREE.BoxGeometry(1.98, 2, 1.98), new THREE.MeshPhongMaterial({color: 0x00ff00})*/);
    // }

    endBuild() {
        window.game.city.updateCitizensMaxCount(5);
    }

    destroy() {
        window.game.city.updateCitizensMaxCount(-5);
        super.destroy();
    }
}