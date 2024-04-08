import { TerrainResource } from "./TerrainResource.js";
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';
import { ResourceTypes } from "../ResourceTypes.js";
import * as THREE from 'three';

export class Tree extends TerrainResource {
    static meshPromise = null;
    width = 0.5;
    height = 3;
    depth = 0.5;

    constructor() {
      super(ResourceTypes.Wood); // Вызываем конструктор родительского класса
  
      if (Tree.meshPromise === null) {
        console.log('kmkm')
        Tree.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Tree.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Tree.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
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
  
      Tree.meshPromise
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
  
    setPosition(x, y, z) {
      const newPosition = new THREE.Vector3(x, y, z);
      const deltaPosition = newPosition.clone().sub(this.position);
      this.position.copy(newPosition);
    
      this.traverse(function(child) {
        if (child !== this && child instanceof THREE.Object3D) {
          child.position.add(deltaPosition);
          child.updateMatrixWorld();  // Обновляем матрицу мира дочернего объекта
        }
      }.bind(this));
    
      this.userData.collectTag.position.set(x, y + 0 + 3.1, z);
    }
  }