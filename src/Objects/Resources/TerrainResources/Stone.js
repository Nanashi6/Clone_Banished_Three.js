import { TerrainResource } from "./TerrainResource.js";
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';
import { ResourceTypes } from "../ResourceTypes.js";
import * as THREE from 'three';

export class Stone extends TerrainResource {
    static meshPromise = null;
  
    constructor() {
      super(ResourceTypes.Stone); // Вызываем конструктор родительского класса
  
      if (Stone.meshPromise === null) {
        console.log('kmkm')
        Stone.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Rocks/Stone.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Rocks/Stone.obj', function (object) {
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });
      }
  
      const self = this;
  
      Stone.meshPromise
        .then((mesh) => {
          mesh.children.forEach((child) => {
            child.castShadow = true;
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
    
      this.userData.collectTag.position.set(x, y + 0.24 + 0.15, z);
    }
  }