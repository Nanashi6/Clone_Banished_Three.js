import * as THREE from 'three';
import { CameraManager } from './CameraManager.js';
import { BuildingRaycaster } from './BuildingRaycaster.js';
import { City } from './City.js';
import { StorageManager } from './StorageManager.js';
import { TaskManager } from './TaskManager.js';
import { Citizen } from './Objects/Citizens/Citizen.js';
import { SelectorRaycaster } from './SelectorRaycaster.js';
import { TerrainResourcesManager } from './TerrainResourcesManager.js';
import { AudioManager } from './AudioManager.js';
import { Loader } from './Loader.js';

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
    day = 1;

    constructor(gridSize) {
      this.gameWindow = document.getElementById('render-target');
  
      // Создаем сцену, камеру и рендерер
      this.scene = new THREE.Scene();
      // const loader = new THREE.CubeTextureLoader();
      // const texture = loader.load([
      //   './src/Images/select.png'
      // ]);
      // this.scene.background = texture;
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
      // this.inicializeSounds();
    }
  
    prerender = () => {
      this.renderer.render(this.scene, this.camera);
    }

    animate = () => {
      this.cameraManager.simulate();

      const delta = this.clock.getDelta(); // Получаем прошедшее время с момента последнего вызова getDelta()
      this.elapsedTime += delta; // Увеличиваем общее прошедшее время

      // Проверяем, прошел ли достаточный интервал для считывания нового дня
      if (this.elapsedTime >= this.dayDurationInSeconds) {
        this.day++; // Определяем количество пройденных дней
        this.elapsedTime -= this.dayDurationInSeconds;

        this.city.updateGeneralState(); // Обновление состояния жителей
        document.getElementById('day').innerHTML = `Day ${this.day}`;
        // console.log(`Наступил день ${this.day}`)
      }
      
      this.city.simulate();
      window.ui.updateTaskPanel();

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
      sun.shadow.mapSize.width = 2049;
      sun.shadow.mapSize.height = 1024;
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

function keydownHandler(event) {
  document.getElementById('root-window').style.display = 'flex';
  document.getElementById('Loading-window').style.display = 'none';
  window.game.resizeWindow();
  window.game.renderer.setAnimationLoop(window.game.animate);
  AudioManager.playBackgroundSound();
  document.removeEventListener('keydown', keydownHandler);

  let taskDiv = document.getElementById('task-panel');
        
  // Добавляем обработчик события наведения мыши
  taskDiv.addEventListener('mouseover', function() {
    document.removeEventListener('wheel', window.game.cameraManager.onMouseScrollHandler);
  });
  taskDiv.addEventListener('mouseout', function() {
    document.addEventListener('wheel', window.game.cameraManager.onMouseScrollHandler);
  });
}

window.onload = async () => {
  document.getElementById('day').innerHTML = `Day 1`;

  await Loader.loadBuildings();
  window.game = new Game(100);
  window.game.renderer.setAnimationLoop(window.game.prerender);

  await Loader.inizializeStartBuildings();

  await new Promise(r => setTimeout(r, 3500));

  console.log('Закончена загрузка текстур домов');

  window.game.storageManager.addResources({Wood: 10, Stone: 10, Iron: 10, RawFood: 10, PreparedFood: 20});

  let citizen = new Citizen();
  citizen.setPosition(0, -1, 0)
  window.game.city.addCitizen(citizen);

  citizen = new Citizen();
  citizen.setPosition(1, -1, 0)
  window.game.city.addCitizen(citizen);

  citizen = new Citizen();
  citizen.setPosition(-1, -1, 0)
  window.game.city.addCitizen(citizen);

  for(let i = 0; i < 400; i++) {
    window.game.terrainResourcesManager.generateRandomTree();
    if(i < 250) {
      window.game.terrainResourcesManager.generateRandomStone();
      window.game.terrainResourcesManager.generateRandomIron();
    }
  }

  await AudioManager.initializeSounds();
  // Добавление обработчика нажатия клавиши
  document.addEventListener('keydown', keydownHandler);
  document.getElementById('load-info').innerHTML = 'Press any button';
};  

// TODO: Сделать экран загрузки + предзагружать объекты ресурсов

// TODO: Сделать UI *******************************************************
// поправить вывод инфы о тасках (для поля сделать) перевести на английский
// Переделать выбор здания для постройки и селекторы 

// TODO: Преобразовать все менеджеры в статики (Менеджеры принимаемые ссылку на объект внутри него самого не могут быть статиками, пока так останутся)



// TODO: информирование над зданиями о невозможности работать
// TODO: звуки селекторов ресурсов
// TODO: Ограничить Полёт камеры
// TODO: Жители не должны проходить сквозь здания
// TODO: Снос здания также через объект-обёртку над зданием (work - уничтожает здание по итогу)*****