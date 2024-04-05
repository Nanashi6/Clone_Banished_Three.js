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
  
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
      this.gameWindow.appendChild(this.renderer.domElement);
  
      window.addEventListener('resize', this.resizeWindow, false);
  
      document.addEventListener('contextmenu', (event) => event.preventDefault(), false);
      
      this.gridSize = gridSize; // Размер карты
  
      this.plane = new THREE.Mesh(new THREE.PlaneGeometry(this.gridSize, this.gridSize, 1), new THREE.MeshLambertMaterial({color: 0x005500}));
      this.plane.position.set(0, -1, 0);
      this.plane.rotateX(-Math.PI / 2);
      // Добавляем объект в сцену
      this.scene.add(this.plane);
      this.plane.visible = true;
      this.plane.receiveShadow = true;
  
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

      this.#setupLights();

      this.renderer.setAnimationLoop(this.animate);
    }
  
    animate = () => {
      const delta = this.clock.getDelta(); // Получаем прошедшее время с момента последнего вызова getDelta()
      this.elapsedTime += delta; // Увеличиваем общее прошедшее время

      // Проверяем, прошел ли достаточный интервал для считывания нового дня
      if (this.elapsedTime >= this.dayDurationInSeconds) {
        this.day++; // Определяем количество пройденных дней
        this.elapsedTime -= this.dayDurationInSeconds;

        this.city.updateGeneralState(); // Обновление состояния жителей

        console.log(`Наступил день ${this.day}`)
      }

      window.ui.updateResourceInfoPanel(this.storageManager.ResourcesCount);
      this.city.simulate();
      this.renderer.render(this.scene, this.camera);
    }
  
    /**
     * Setup the lights for the scene
     */
    #setupLights() {
      const sun = new THREE.DirectionalLight(0xffffff, 2)
      sun.position.set(-150, 250, 150);
      sun.castShadow = true;
      sun.shadow.camera.left = -150;
      sun.shadow.camera.right = 150;
      sun.shadow.camera.top = 120;
      sun.shadow.camera.bottom = -150;
      sun.shadow.mapSize.width = 2048 * 0.75;
      sun.shadow.mapSize.height = 1024 * 0.75;
      sun.shadow.camera.near = 100;
      sun.shadow.camera.far = 2000; // 4000 для 200
      sun.shadow.normalBias = 0.01;
      this.scene.add(sun);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      // const helper = new THREE.CameraHelper( sun.shadow.camera );
      // this.scene.add( helper );
    }

    resizeWindow = () => {
      this.camera.aspect = this.gameWindow.offsetWidth / this.gameWindow.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.gameWindow.offsetWidth, this.gameWindow.offsetHeight);
    }
}

window.onload = () => {
    window.game = new Game(100);

    let citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    window.game.city.addCitizen(citizen);

    citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    citizen.position.x = 1;
    window.game.city.addCitizen(citizen);

    citizen = new Citizen(new THREE.BoxGeometry(0.1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
    citizen.position.y = -0.5;
    citizen.position.x = -1;
    window.game.city.addCitizen(citizen);
    
    for(let i = 0; i < 500; i++) {
      window.game.terrainResourcesManager.generateRandomTree();
      window.game.terrainResourcesManager.generateRandomStone();
      window.game.terrainResourcesManager.generateRandomIron();
    }
}

// TODO: требования ресурсов

// TODO: класс-инициализатор

// TODO: Объекты окружения
// TODO: класс Игрового поля с объектами (содержит метод генерации деревьев и т.д)

// TODO: Звуки постройки/сноса, фоновая музыка, звуки селекторов ресурсов

// TODO: импортировать obj объекты для зданий, ресурсов и жителей

// TODO: Сделать UI


// TODO: Жители не должны проходить сквозь здания
// TODO: Снос здания также через объект-обёртку над зданием (work - уничтожает здание по итогу)*****
// TODO: Сделать отрисовку селектора ресурсов*** (Отрисовывать на сцене каждое срабатывание onMouseMove)