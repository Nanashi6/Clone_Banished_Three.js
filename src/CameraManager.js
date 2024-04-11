import * as THREE from 'three';

export class CameraManager {

    #DEG2RAD = Math.PI / 180;

    #LEFT_MOUSE_BUTTON = 0;
    #MIDDLE_MOUSE_BUTTON = 1;
    #RIGHT_MOUSE_BUTTON = 2;

    // Радиус орбиты камеры
    #MIN_CAMERA_RADIUS = 2;
    #MAX_CAMERA_RADIUS = 30; ///////////////////////////////////////////////////////////////////////////////////////

    // Угол наклона
    #MIN_CAMERA_ELEVATION = 30;
    #MAX_CAMERA_ELEVATION = 89.99;

    // Чувствительность к повороту, зуму и панарамированию
    #ROTATION_SENSITIVITY = 0.5;
    #ZOOM_SENSIVITY = -0.002;
    #PAN_SENSIVITY = -0.01;

    #Y_AXIS = new THREE.Vector3(0,1,0);

    camera;
    static audioListener;
    
    #cameraOrigin = new THREE.Vector3();
    #cameraRadius = 4;
    #cameraAzimuth = 0;
    #cameraElevation = this.#MIN_CAMERA_ELEVATION;
    #isLeftMouseDown = false;
    #isRightMouseDown = false;
    #isMiddleMouseDown = false;
    #prevMouseX = 0;
    #prevMouseY = 0;

    #cameraSpeed = 25;

    constructor(gameWindow) {
        this.camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
        this.updateCameraPosition();

        // Регистрация событий мыши
        document.addEventListener('wheel', this.onMouseScroll.bind(this), false);

        document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        document.addEventListener('keydown', this.OnKeyDown.bind(this), false);
        document.addEventListener('keyup', this.OnKeyUp.bind(this), false);
    }

    codes = [
        'KeyS',
        'KeyW',
        'KeyA',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
    ];

    pressed = new Set();

    simulate() {
        let deltaY = 0;
        let deltaX = 0;

        const forward = new THREE.Vector3(0,0,1).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);
        const left = new THREE.Vector3(1,0,0).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);

        // Почему-то тут направления немного поменялись местами
        if (this.pressed.has('ArrowUp') || this.pressed.has('KeyW')) {
            deltaY += this.#cameraSpeed
        }
        if (this.pressed.has('ArrowDown') || this.pressed.has('KeyS')) {
            deltaY -= this.#cameraSpeed
        }
        if (this.pressed.has('ArrowLeft') || this.pressed.has('KeyA')) {
            deltaX += this.#cameraSpeed;
        }
        if (this.pressed.has('ArrowRight') || this.pressed.has('KeyD')) {
            deltaX -= this.#cameraSpeed;
        }
        
        this.#cameraOrigin.add(forward.multiplyScalar(this.#PAN_SENSIVITY * deltaY));
        this.#cameraOrigin.add(left.multiplyScalar(this.#PAN_SENSIVITY * deltaX));

        this.updateCameraPosition();
    }

    onMouseScroll(event) {
        this.#cameraRadius *= 1 - (event.deltaY * this.#ZOOM_SENSIVITY);
        this.#cameraRadius = Math.min(this.#MAX_CAMERA_RADIUS, Math.max(this.#MIN_CAMERA_RADIUS, this.#cameraRadius));
    
        this.updateCameraPosition();
    }

    onMouseDown(event) {
        //console.log('Down');
        
        if (event.button === this.#LEFT_MOUSE_BUTTON) {
            this.#isLeftMouseDown = true;
        }
        if (event.button === this.#MIDDLE_MOUSE_BUTTON) {
            this.#isMiddleMouseDown = true;
        }
        if (event.button === this.#RIGHT_MOUSE_BUTTON) {
            this.#isRightMouseDown = true;
        }
    }

    onMouseUp(event) {
        //console.log('Up');

        if (event.button === this.#LEFT_MOUSE_BUTTON) {
            this.#isLeftMouseDown = false;
        }
        if (event.button === this.#MIDDLE_MOUSE_BUTTON) {
            this.#isMiddleMouseDown = false;
        }
        if (event.button === this.#RIGHT_MOUSE_BUTTON) {
            this.#isRightMouseDown = false;
        }
    }

    onMouseMove(event) {
        //console.log('Move');

        const deltaX = (event.clientX - this.#prevMouseX);
        const deltaY = (event.clientY - this.#prevMouseY);
        // Поворот при Средней левой кнопки мыши
        if (this.#isMiddleMouseDown) {
            this.#cameraAzimuth -= (deltaX * this.#ROTATION_SENSITIVITY);
            this.#cameraElevation += (deltaY * this.#ROTATION_SENSITIVITY); //////////////////////////////////////////////////////////////////////////////
            this.#cameraElevation = Math.min(this.#MAX_CAMERA_ELEVATION, Math.max(this.#MIN_CAMERA_ELEVATION, this.#cameraElevation));
            this.updateCameraPosition();
        }

        // Панарамирование
        if (this.#isRightMouseDown) {
            const forward = new THREE.Vector3(0,0,1).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);
            const left = new THREE.Vector3(1,0,0).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);
            this.#cameraOrigin.add(forward.multiplyScalar(this.#PAN_SENSIVITY * deltaY));
            this.#cameraOrigin.add(left.multiplyScalar(this.#PAN_SENSIVITY * deltaX));
            this.updateCameraPosition()
        }

        // Масштабирование
        /*if (this.#isRightMouseDown) {
            this.#cameraRadius += deltaY * this.#ZOOM_SENSIVITY;
            this.#cameraRadius = Math.min(this.#MAX_CAMERA_RADIUS, Math.max(this.#MIN_CAMERA_RADIUS, this.#cameraRadius));
            this.updateCameraPosition();
        }*/
        this.#prevMouseX = event.clientX;
        this.#prevMouseY = event.clientY;
    }

    OnKeyDown(event) {
        /*let deltaY = 0;
        let deltaX = 0;

        const forward = new THREE.Vector3(0,0,1).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);
        const left = new THREE.Vector3(1,0,0).applyAxisAngle(this.#Y_AXIS, this.#cameraAzimuth * this.#DEG2RAD);

        // Почему-то тут направления немного поменялись местами
        if (event.key === 'ArrowUp') {
            deltaY += this.#cameraSpeed
        } else if (event.key === 'ArrowDown') {
            deltaY -= this.#cameraSpeed
        } else if (event.key === 'ArrowLeft') {
            deltaX += this.#cameraSpeed;
        } else if (event.key === 'ArrowRight') {
            deltaX -= this.#cameraSpeed;
        }
        
        this.#cameraOrigin.add(forward.multiplyScalar(this.#PAN_SENSIVITY * deltaY));
        this.#cameraOrigin.add(left.multiplyScalar(this.#PAN_SENSIVITY * deltaX));

        this.updateCameraPosition();*/
    
        if(this.codes.includes(event.code)) this.pressed.add(event.code);
    }

    OnKeyUp(event) {
        if(this.pressed.has(event.code)) this.pressed.delete(event.code);
    }

    updateCameraPosition() {
        this.camera.position.x = this.#cameraRadius * Math.sin(this.#cameraAzimuth * this.#DEG2RAD) * Math.cos(this.#cameraElevation * this.#DEG2RAD);
        this.camera.position.y = this.#cameraRadius * Math.sin(this.#cameraElevation * this.#DEG2RAD);
        this.camera.position.z = this.#cameraRadius * Math.cos(this.#cameraAzimuth * this.#DEG2RAD) * Math.cos(this.#cameraElevation * this.#DEG2RAD);
        this.camera.position.add(this.#cameraOrigin);
        this.camera.lookAt(this.#cameraOrigin);
        this.camera.updateMatrix();
    }
}