import * as THREE from 'three';
import { CitizenTypes } from './CitizenTypes.js';
import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';
import { CitizenStates } from './CitizenStates.js';
import { ResourceTypes } from '../Resources/ResourceTypes.js';

import { GeneralStates, GeneralStateMultiplier } from '../../City.js';

export class Citizen extends THREE.Group {
    set WalkSpeed(value) { this.userData.walkSpeed = value; }
    static meshPromise = null;
  
    width = 0.2;
    height = 1;
    depth = 0.1;

    state = GeneralStates.Normal;

    get State() { return this.state};
    set State(value) { 
      this.userData.walkSpeed * GeneralStateMultiplier[value];
      this.state = value 
    };

    get TaskInfo() {
      if(this.userData.task != undefined) {
        return this.userData.task.getInfo() 
      }
      else {
        return 'Отдыхает';
      }
    };

    constructor() {
      super(); // Вызываем конструктор родительского класса
  
      this.userData.currentState = CitizenStates.Idle;
      this.userData.task = undefined;
      this.userData.walkSpeed = 0.1;
      this.userData.hungryDays = 0;
      this.userData.criticalHungryDays = 3;
      this.castShadow = true;

      if (Citizen.meshPromise === null) {
        console.log('kmkm')
        Citizen.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Human.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Human.obj', function (object) {
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
  
      Citizen.meshPromise
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
    }

    eat() {
        let check = window.game.storageManager.reduceResource(ResourceTypes.PreparedFood, 1);
        if(!check) {
            if(++this.userData.hungryDays >= this.userData.criticalHungryDays) {
                window.game.city.removeCitizen(this);
            }
        }
        else {
            this.userData.hungryDays = 0;
        }
    }

    cancelTask() {
        this.userData.currentState = CitizenStates.Idle;
        this.userData.task = undefined;
    }

    /**
     * Симуляция текущего состояния
     */
    simulate() {
        switch(this.userData.currentState) {
            case CitizenStates.Idle:
                this.idle();
                break;
            case CitizenStates.Work:
                this.work();
                break;
            default:
                console.error(`${this.userData.currentState} это неизвестное состояние`);
        }
    }    

    idle() {
        this.userData.task = window.game.taskManager.getTask(this);
        if (this.userData.task != undefined) {
            this.userData.currentState = CitizenStates.Work;
        }
    }

     // TODO: следует также учитывать препятствия в виде зданий и объектов terrain 
    walk() {
        let targetX = this.userData.task.target.position.x;
        let targetZ = this.userData.task.target.position.z;
        let citizenX = this.position.x;
        let citizenZ = this.position.z;
      
        let deltaX = 0, deltaZ = 0;

        if (targetZ - citizenZ > 0.1) {
          deltaZ += this.userData.walkSpeed;
          // this.rotation.y = 0;
        } else if (0.1 < citizenZ - targetZ) {
          deltaZ -= this.userData.walkSpeed;
          // this.rotation.y = -Math.PI;
        }
      
        if (targetX - citizenX > 0.1) {
          deltaX += this.userData.walkSpeed;
          // this.rotation.y = Math.PI / 2;
        } else if (0.1 < citizenX - targetX) {
          deltaX -= this.userData.walkSpeed;
          // this.rotation.y = - Math.PI / 2;
        }

        this.position.x += deltaX;
        this.position.z += deltaZ;

        //#region Rotation
        if(deltaZ > 0 && deltaX > 0) {
          this.rotation.y = -Math.PI * 2 * 7 / 8;
          // this.rotation.y = -Math.PI * 2 * 5 / 8;
        }
        else if(deltaZ > 0 && deltaX < 0) {
          this.rotation.y = -Math.PI * 2 * 1 / 8;
          // this.rotation.y = -Math.PI * 2 * 3 / 8;
        }
        else if(deltaZ > 0) {
          this.rotation.y = Math.PI * 2 * 0 / 8;
        }
        else if(deltaZ < 0 && deltaX > 0) {
          // this.rotation.y = -Math.PI * 2 * 7 / 8;
          this.rotation.y = -Math.PI * 2 * 5 / 8;
        }
        else if(deltaZ < 0 && deltaX < 0) {
          // this.rotation.y = -Math.PI * 2 * 1 / 8;
          this.rotation.y = -Math.PI * 2 * 3 / 8;
        }
        else if(deltaZ < 0) {
          this.rotation.y = Math.PI * 2 * 4 / 8;
        }
        else if(deltaX > 0) {
          this.rotation.y = Math.PI * 2 * 2 / 8;
        }
        else if(deltaX < 0) {
          this.rotation.y = Math.PI * 2 * 6 / 8;
        }
        //#endregion
    }

    work() {
        if(window.game.taskManager.taskExist(this.userData.task)) {
            if (this.hasIntersect()) {
                console.warn('работает');
                this.userData.task.target.work();
            }
            else {
                this.walk();
            }
        }
        else {
            this.userData.currentState = CitizenStates.Idle;
            this.userData.task = undefined;
        }
    }

    /**
     * Проверяет наличие пересечиния с целевым объектом
     * @param {THREE.Mesh} obj - Целевой объект
     * @returns {boolean}
     */
    hasIntersect(obj) {
        const boxBounds = new THREE.Box3().setFromObject(this.userData.task.target);
        const citizenBounds = new THREE.Box3().setFromObject(this);
        // console.log(citizenBounds)
        // console.log(boxBounds)
        // Проверяем пересечение между ограничивающими объемами
        return citizenBounds.intersectsBox(boxBounds);
    }
}