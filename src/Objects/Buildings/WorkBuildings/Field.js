import { TaskTypes } from "../../../TaskManager.js";
import { ResourceTypes } from "../../Resources/ResourceTypes.js";
import { WorkBuilding } from "../WorkBuilding.js";
import * as THREE from 'three';
// import { MTLLoader } from 'mtl';
// import { OBJLoader } from 'obj';

export class Field extends WorkBuilding {
  get Info() { return `Работает на поле`};

  requirementResource = {
    Iron: 0,
    Stone: 0,
    Wood: 10,
    RawFood: 0,
    PreparedFood: 0
  };
    static startField = null;
  
    static width = 5.98;
    static height = 0.1;
    static depth = 5.98;
    get Width() { return Field.width; }
    get Height() { return Field.height; }    
    get Depth() { return Field.depth; }

    static sizeY;

    constructor() {
      super(ResourceTypes.RawFood); // Вызываем конструктор родительского класса

      this.userData.harvest = false;

      this.userData.workScoreMax = 400;
      this.userData.harvestScore = 500;
      this.isHalf = false;
      this.isFull = false;

      this.userData.plantingDay = undefined;

      // if (Field.startField === null) {
      //   console.log('Field load')
      //   Field.startField = new Promise((resolve, reject) => {
      //     var mtlLoader = new MTLLoader();
      //     mtlLoader.load('./src/3D_Objects/FullField.mtl', function (materials) {
      //       materials.preload();
      //       var objLoader = new OBJLoader();
      //       objLoader.setMaterials(materials);
      //       objLoader.load('./src/3D_Objects/FullField.obj', function (object) {
      //         const boundingBox = new THREE.Box3().setFromObject(object);
      //         const size = new THREE.Vector3();
      //         boundingBox.getSize(size);
      //         Field.sizeY = size.y;
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
  
      Field.startField
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
    /*constructor(resourceType) {
        super(resourceType, new THREE.BoxGeometry(5.98, 0.1, 5.98), new THREE.MeshPhongMaterial({color: 0x164972}));
        this.userData.harvest = false;

        this.userData.workScoreMax = 100;
        this.userData.harvestScore = 100;

        this.userData.plantingDay = undefined;
    }*/

    // таска на засеивание создана в endBuild методе

    work() {
        if(this.userData.harvest && ++this.userData.currentWorkScore == this.userData.harvestScore){
            this.userData.currentWorkScore = 0;

            window.game.storageManager.addResource(this.userData.resourceType, 15);

            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
            this.userData.harvest = false;  
            
            const scaleY = this.Height / Field.sizeY;
            this.scale.y = scaleY;
            this.traverse(function (object) {
              if (object instanceof THREE.Mesh) {
                object.scale.y = scaleY;
              }
            });
        }
        else if(!this.userData.harvest && ++this.userData.currentWorkScore == this.userData.workScoreMax) {
            this.userData.currentWorkScore = 0;
            window.game.taskManager.deleteTask(this, TaskTypes.Work);
            this.userData.taskCreated = false;
            this.userData.plantingDay = window.game.day;
            this.userData.harvest = true;
            this.isHalf = false;
            this.isFull = false;
        }
    }   

    simulate() {
        if(!this.userData.taskCreated && this.userData.harvest && window.game.day >= this.userData.plantingDay + 3 && 
            !window.game.storageManager.resourceIsMax(this.userData.resourceType)) {
            // console.log('Создание таска');
            window.game.taskManager.createTask(this, TaskTypes.Work);
            this.userData.taskCreated = true;
        }
        else if(!this.isHalf && !this.userData.taskCreated && this.userData.harvest && window.game.day >= this.userData.plantingDay + 1) {
            this.isHalf = true;
            this.isFull = false;
            const scaleY = this.Height + 0.45 / Field.sizeY;
            this.scale.y = scaleY;
            this.traverse(function (object) {
              if (object instanceof THREE.Mesh) {
                object.scale.y = scaleY;
              }
            });
        }
        else if(!this.isFull && !this.userData.taskCreated && this.userData.harvest && window.game.day >= this.userData.plantingDay + 2) {
            this.isHalf = true;
            this.isFull = true;
            const scaleY = this.Height + 0.9 / Field.sizeY;
            this.scale.y = scaleY;
            this.traverse(function (object) {
              if (object instanceof THREE.Mesh) {
                object.scale.y = scaleY;
              }
            });
        }
    }
}