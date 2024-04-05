import * as THREE from 'three';
import { CameraManager } from './CameraManager.js';
import { BuildingRaycaster } from './BuildingRaycaster.js';
import { City } from './City.js';
import { StorageManager } from './StorageManager.js';
import { TaskManager } from './TaskManager.js';
import { Citizen } from './Objects/Citizens/Citizen.js';
import { CreateTerrainResource } from './Objects/Resources/TerrainResources/TerrainResourcesFactory.js';
import { SelectorRaycaster } from './SelectorRaycaster.js';
import { TerrainResourcesManager } from './TerrainResourcesManager.js';

export class Game {
    gameWindow;
    scene;
  
    cameraManager;
    camera;
  
    renderer;
  
    gridSize;
  
    plane;

    city;
    storageManager;
    taskManager;
    terrainResourcesManager;

    buildingRaycaster;
    selectorRaycaster;
  
    grid;
  
    clock; // Учёт времени
    dayDurationInSeconds  = 30;
    elapsedTime = 0;
    day = 0;

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
  
      this.clock = new THREE.Clock();

      this.city = new City();
      this.storageManager = new StorageManager();
      this.taskManager = new TaskManager();
      this.terrainResourcesManager = new TerrainResourcesManager();

      this.buildingRaycaster = new BuildingRaycaster(this.cameraManager.camera, this.plane, this.scene);
      this.selectorRaycaster = new SelectorRaycaster(this.cameraManager.camera, this.plane);

      this.renderer.setAnimationLoop(this.animate);
    }
  
    animate = () => {
      const delta = this.clock.getDelta(); // Получаем прошедшее время с момента последнего вызова getDelta()
      this.elapsedTime += delta; // Увеличиваем общее прошедшее время

      // Проверяем, прошел ли достаточный интервал для считывания нового дня
      if (this.elapsedTime >= this.dayDurationInSeconds) {
        this.day++; // Определяем количество пройденных дней
        this.elapsedTime -= this.dayDurationInSeconds;

        console.log(`Наступил день ${this.day}`)
      }

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
    window.game.terrainResourcesManager.addTerrainResource(wood);
    window.game.scene.add(wood);

    
    for(let i = 0; i < 1000; i++) {
      window.game.terrainResourcesManager.generateRandomTree();
      window.game.terrainResourcesManager.generateRandomStone();
      window.game.terrainResourcesManager.generateRandomIron();
    }
}

// TODO: класс-инициализатор

// TODO: Если здание строится на ресурсах, то сначала убираются все пересекаемые ресурсы, а потом строится
// TODO: перед генерацией дерева нужно проверять его на пересечение со зданиями

// TODO: реализовать состояния жителей (влияет на скорость работы и хотьбы) (одно общее состояние для всего поселения)

// TODO: Объекты окружения
// TODO: класс Игрового поля с объектами (содержит метод генерации деревьев и т.д)

// TODO: Освещение и тени.

// TODO: Звуки постройки/сноса, фоновая музыка, звуки селекторов ресурсов

// TODO: импортировать obj объекты для зданий, ресурсов и жителей

// TODO: Сделать UI



// TODO: Снос здания также через объект-обёртку над зданием (work - уничтожает здание по итогу)*****
// TODO: Сделать отрисовку селектора ресурсов***