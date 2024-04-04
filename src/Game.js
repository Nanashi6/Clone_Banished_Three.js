import * as THREE from 'three';
import { CameraManager } from './CameraManager.js';
import { BuildingRaycaster } from './BuildingRaycaster.js';
import { City } from './City.js';
import { StorageManager } from './StorageManager.js';
import { TaskManager } from './TaskManager.js';
import { Citizen } from './Objects/Citizens/Citizen.js';
import { CreateTerrainResource } from './Objects/Resources/TerrainResources/TerrainResourcesFactory.js';
import { SelectorRaycaster } from './SelectorRaycaster.js';

export class Game {
    gameWindow;
    scene;
  
    cameraManager;
    camera;
  
    renderer;
  
    gridSize;
  
    plane;
    terrainResources = [];

    city;
    storageManager;
    taskManager;

    buildingRaycaster;
    selectorRaycaster;
  
    grid;
  
    constructor(gridSize) {
      this.gameWindow = document.getElementById('render-target');
  
      // Создаем сцену, камеру и рендерер
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x777777);
  
      this.cameraManager = new CameraManager(this.gameWindow);
      this.camera = this.cameraManager.camera;
  
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
      this.gameWindow.appendChild(this.renderer.domElement);
  
      window.addEventListener('resize', this.resizeWindow, false);
  
      document.addEventListener('contextmenu', (event) => event.preventDefault(), false);
      
      this.gridSize = gridSize; // Размер карты
  
      this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.gridSize, this.gridSize, 1), new THREE.MeshBasicMaterial({color: 0x005500}));
      this.plane.position.set(0, -1, 0);
      this.plane.rotateX(-Math.PI / 2);
      // Добавляем объект в сцену
      this.scene.add(this.plane);
      this.plane.visible = true;
  
      this.grid = new THREE.GridHelper(this.gridSize, this.gridSize);
      this.grid.position.set(this.plane.position.x, this.plane.position.y + 0.01, this.plane.position.z);
      this.scene.add(this.grid);
      // Скрываем отображение ячеек грида
      this.grid.visible = true;
  
      this.city = new City();
      this.storageManager = new StorageManager();
      this.taskManager = new TaskManager();

      this.buildingRaycaster = new BuildingRaycaster(this.cameraManager.camera, this.plane, this.scene);
      this.selectorRaycaster = new SelectorRaycaster(this.cameraManager.camera, this.plane);

      this.renderer.setAnimationLoop(this.animate);
    }
  
    animate = () => {
      window.ui.updateResourceInfoPanel(this.storageManager.ResourcesCount);
      this.city.simulate();
      this.renderer.render(this.scene, this.camera);
    }
  
    resizeWindow = () => {
      this.camera.aspect = this.gameWindow.offsetWidth / this.gameWindow.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
    }
}

window.onload = () => {
    window.game = new Game(200);

    let citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    window.game.city.addCitizen(citizen);
    window.game.scene.add(citizen);

    citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    citizen.position.x = 1;
    window.game.city.addCitizen(citizen);
    window.game.scene.add(citizen);

    citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    citizen.position.x = -1;
    window.game.city.addCitizen(citizen);
    window.game.scene.add(citizen);

    let wood = CreateTerrainResource('Wood', 0, -5);
    window.game.terrainResources.push(wood);
    window.game.scene.add(wood);
}

// TODO: Простой снос зданий

// TODO: 4 вида рабочих зданий ( + 1 должен производить пятый ресурс)

// TODO: реализовать состояния жителей (влияет на скорость работы и хотьбы)

// TODO: Объекты окружения
// TODO: класс Игрового поля с объектами (содержит метод генерации деревьев и т.д)



// TODO: Снос здания также через объект-обёртку над зданием (work - уничтожает здание по итогу)************************
// TODO: Сделать отрисовку селектора ресурсов