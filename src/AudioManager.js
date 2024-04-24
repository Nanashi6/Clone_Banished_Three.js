import * as THREE from 'three';
import { CameraManager } from './CameraManager.js';

export class AudioManager {
    static #audioLoader = new THREE.AudioLoader();
    static backgrounSound;
    static buildSounds;
    static woodCollect;
    static ironCollect;
    static stoneCollect;
    audioListener;

    static async initializeSounds() {
        // Добавление прослушки для звуков
        this.audioListener = new THREE.AudioListener();
        THREE.AudioContext.listener = this.audioListener;

        window.game.cameraManager.camera.add(this.audioListener);

        this.backgrounSound = new THREE.Audio(this.audioListener);
        this.buildSounds = [new THREE.Audio(this.audioListener), new THREE.Audio(this.audioListener)];
        this.woodCollect = new THREE.Audio(this.audioListener);
        this.ironCollect = new THREE.Audio(this.audioListener);
        this.stoneCollect = new THREE.Audio(this.audioListener);

        let buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/Background1.mp3', resolve, undefined, reject);
        });
        this.backgrounSound.setBuffer(buffer);
        this.backgrounSound.setLoop(true);
        this.backgrounSound.setVolume(1);

        buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/build1.mp3', resolve, undefined, reject);
        });
        this.buildSounds[0].setBuffer(buffer);
        this.buildSounds[0].setVolume(1);

        buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/build2.mp3', resolve, undefined, reject);
        });
        this.buildSounds[1].setBuffer(buffer);
        this.buildSounds[1].setVolume(1);

        buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/woodCollect.mp3', resolve, undefined, reject);
        });
        this.woodCollect.setBuffer(buffer);
        this.woodCollect.setVolume(1);

        buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/ironCollect.mp3', resolve, undefined, reject);
        });
        this.ironCollect.setBuffer(buffer);
        this.ironCollect.setVolume(1);

        buffer = await new Promise((resolve, reject) => {
            this.#audioLoader.load('./src/Sounds/stoneCollect.mp3', resolve, undefined, reject);
        });
        this.stoneCollect.setBuffer(buffer);
        this.stoneCollect.setVolume(1);
    }

    static playBackgroundSound() {
        this.backgrounSound.stop();
        this.backgrounSound.play();
    }
    
    static playBuildSound() {
        this.buildSounds.forEach(sound => sound.stop());
        const randomIndex = Math.floor(Math.random() * this.buildSounds.length);
        this.buildSounds[randomIndex].play();
    }
    
    static playWoodCollectSound() {
        this.woodCollect.stop();
        this.woodCollect.play();
    }
    
    static playIronCollectSound() {
        this.ironCollect.stop();
        this.ironCollect.play();
    }
    
    static playStoneCollectSound() {
        this.stoneCollect.stop();  
        this.stoneCollect.play();
    }
}