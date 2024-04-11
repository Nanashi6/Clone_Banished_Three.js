import { TaskTypes } from "../../../TaskManager.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { WorkBuilding } from "../WorkBuilding.js";
// import * as THREE from 'three';
// import { MTLLoader } from 'mtl';
// import { OBJLoader } from 'obj';


export class CookHouse extends WorkBuilding {
    requirementResource = {
        Iron: 0,
        Stone: 10,
        Wood: 10,
        RawFood: 0,
        PreparedFood: 0
    };
    static meshSample = null;
  
    static width = 3.98;
    static height = 4.5;
    static depth = 3.98;
    get Width() { return CookHouse.width; }
    get Height() { return CookHouse.height; }    
    get Depth() { return CookHouse.depth; }

    constructor() {
      super(ResourceTypes.PreparedFood);
      this.userData.workScoreMax = 50;
      // if (CookHouse.meshSample === null) {
      //   console.log('CookHouse load')
      //   CookHouse.meshSample = new Promise((resolve, reject) => {
      //     var mtlLoader = new MTLLoader();
      //     mtlLoader.load('./src/3D_Objects/CookHouse.mtl', function (materials) {
      //       materials.preload();
      //       var objLoader = new OBJLoader();
      //       objLoader.setMaterials(materials);
      //       objLoader.load('./src/3D_Objects/CookHouse.obj', function (object) {
      //         const boundingBox = new THREE.Box3().setFromObject(object);
      //         const size = new THREE.Vector3();
      //         boundingBox.getSize(size);
      //         const scaleX = this.width / size.x;
      //         const scaleY = this.height / size.y;
      //         const scaleZ = this.depth / size.z;
      //         object.scale.set(scaleX,scaleY,scaleZ);
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
  
      CookHouse.meshSample
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
    //     super(resourceType, new THREE.BoxGeometry(5.98, 0.1, 3.98), new THREE.MeshPhongMaterial({color: 0x164972}));
    //     this.userData.workScoreMax = 50;
    // }

    endBuild() {
        if(window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }

    work() {
        // Готовка пока не кончится сырая пища или не заполнится склад
        if(window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            if(++this.userData.currentWorkScore == this.userData.workScoreMax) {
                this.userData.currentWorkScore = 0;
                window.game.storageManager.reduceResource(ResourceTypes.RawFood, 1);
                window.game.storageManager.addResource(this.userData.resourceType, 1);
            }
        } else {
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;           
        }
    }   

    simulate() {
        if(!this.userData.taskCreated && window.game.storageManager.RawFood > 0 && !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
    }
}