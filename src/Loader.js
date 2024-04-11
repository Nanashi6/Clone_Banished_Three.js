import { MTLLoader } from 'mtl';
import { OBJLoader } from 'obj';
import * as THREE from 'three';
import { Home } from './Objects/Buildings/AdministrativeBuildings/Home.js';
import { TownHall } from './Objects/Buildings/AdministrativeBuildings/TownHall.js';
import { IronStorage } from './Objects/Buildings/StorageBuildings/IronStorage.js';
import { PreparedFoodStorage } from './Objects/Buildings/StorageBuildings/PreparedFoodStorage.js';
import { RawFoodStorage } from './Objects/Buildings/StorageBuildings/RawFoodStorage.js';
import { WoodStorage } from './Objects/Buildings/StorageBuildings/WoodStorage.js';
import { StoneStorage } from './Objects/Buildings/StorageBuildings/StoneStorage.js';
import { CookHouse } from './Objects/Buildings/WorkBuildings/CookHouse.js';
import { Field } from './Objects/Buildings/WorkBuildings/Field.js';
import { ForesterLodge } from './Objects/Buildings/WorkBuildings/ForesterLodge.js';
import { Mine } from './Objects/Buildings/WorkBuildings/Mine.js';
import { Quarry } from './Objects/Buildings/WorkBuildings/Quarry.js';

export class Loader {
    static async loadBuildings() {
      console.log('Home load')
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
            const scaleX = Home.width / size.x;
            const scaleY = Home.height / size.y;
            const scaleZ = Home.depth / size.z;
            object.scale.set(scaleX,scaleY,scaleZ);
            object.traverse(function (object) {
              if (object instanceof THREE.Mesh) {
                object.scale.set(scaleX, scaleY, scaleZ);
              }
            });
            const mesh = object;
            resolve(mesh);
          }, undefined, reject);
        });
      });

        console.log('Town Hall load');
        TownHall.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/TownHall.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/TownHall.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = TownHall.width / size.x;
              const scaleY = TownHall.height / size.y;
              const scaleZ = TownHall.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Iron Storage load');
        IronStorage.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/IronStorage.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/IronStorage.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = IronStorage.width / size.x;
              const scaleY = IronStorage.height / size.y;
              const scaleZ = IronStorage.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Prepared Food Storage load');
        PreparedFoodStorage.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/StoneStorage.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/StoneStorage.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = PreparedFoodStorage.width / size.x;
              const scaleY = PreparedFoodStorage.height / size.y;
              const scaleZ = PreparedFoodStorage.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Raw Food Storage load');
        RawFoodStorage.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/RawFoodStorage.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/RawFoodStorage.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = RawFoodStorage.width / size.x;
              const scaleY = RawFoodStorage.height / size.y;
              const scaleZ = RawFoodStorage.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Wood Storage load');
        WoodStorage.meshPromise = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/WoodStorage.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/WoodStorage.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = WoodStorage.width / size.x;
              const scaleY = WoodStorage.height / size.y;
              const scaleZ = WoodStorage.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Stone Storage load');
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
              const scaleX = StoneStorage.width / size.x;
              const scaleY = StoneStorage.height / size.y;
              const scaleZ = StoneStorage.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Cook House load')
        CookHouse.meshSample = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/CookHouse.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/CookHouse.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = CookHouse.width / size.x;
              const scaleY = CookHouse.height / size.y;
              const scaleZ = CookHouse.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Field load');
        Field.startField = new Promise((resolve, reject) => {
          const mtlLoader = new MTLLoader();
          const textureLoader = new THREE.TextureLoader(); // Создаем экземпляр TextureLoader

          mtlLoader.load('./src/3D_Objects/FullField.mtl', function (materials) {
            materials.preload();
            // console.log(materials.materials)
            // for (let material in materials.materials) {
            //     let mat = materials.materials[material]
            //     if(mat.map != null) {
            //       mat.map = textureLoader.load(mat.map);
            //       // Загрузка текстур и отправка их на граф конвейер
            //       window.game.renderer.initTexture(mat.map);
            //     }
            // };

            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/FullField.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              Field.sizeY = size.y;
              const scaleX = Field.width / size.x;
              const scaleY = Field.height / size.y;
              const scaleZ = Field.depth / size.z;
              object.scale.set(scaleX, scaleY, scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Forester Lodge load')
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
              const scaleX = ForesterLodge.width / size.x;
              const scaleY = ForesterLodge.height / size.y;
              const scaleZ = ForesterLodge.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

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
              const scaleX = Mine.width / size.x;
              const scaleY = Mine.height / size.y;
              const scaleZ = Mine.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });

        console.log('Quarry load')
        Quarry.meshSample = new Promise((resolve, reject) => {
          var mtlLoader = new MTLLoader();
          mtlLoader.load('./src/3D_Objects/Quarry.mtl', function (materials) {
            materials.preload();
            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('./src/3D_Objects/Quarry.obj', function (object) {
              const boundingBox = new THREE.Box3().setFromObject(object);
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const scaleX = Quarry.width / size.x;
              const scaleY = Quarry.height / size.y;
              const scaleZ = Quarry.depth / size.z;
              object.scale.set(scaleX,scaleY,scaleZ);
              object.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                  object.scale.set(scaleX, scaleY, scaleZ);
                }
              });
              const mesh = object;
              resolve(mesh);
            }, undefined, reject);
          });
        });
    }

    static async loadTerrainResources() {

    }

    static async inizializeStartBuildings() {
      const townHall = new TownHall();
      townHall.position.set(0, -1, -10);
      const field = new Field();
      field.position.set(-8, -1, -10);
      const cookHouse = new CookHouse();
      cookHouse.position.set(8, -1, -10);

      townHall.endBuild();
      field.endBuild();
      cookHouse.endBuild();

      window.game.city.addBuilding(townHall);
      window.game.city.addBuilding(field);
      window.game.city.addBuilding(cookHouse);
    }
}