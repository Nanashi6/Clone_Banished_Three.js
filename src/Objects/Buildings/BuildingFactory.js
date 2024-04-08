import * as THREE from 'three';
import { BuildingTypes } from './BuildingTypes.js';
import { Building } from './Building.js';
import { ConstructionSite } from './ConstructionSite.js';
import { Home } from './AdministrativeBuildings/Home.js';
import { TownHall } from './AdministrativeBuildings/TownHall.js';
import { RawFoodStorage } from './StorageBuildings/RawFoodStorage.js';
import { PreparedFoodStorage } from './StorageBuildings/PreparedFoodStorage.js';
import { IronStorage } from './StorageBuildings/IronStorage.js';
import { WoodStorage } from './StorageBuildings/WoodStorage.js';
import { StoneStorage } from './StorageBuildings/StoneStorage.js';
import { ResourceTypes } from '../Resources/ResourceTypes.js';
import { Mine } from './WorkBuildings/Mine.js';
import { Quarry } from './WorkBuildings/Quarry.js';
import { ForesterLodge } from './WorkBuildings/ForesterLodge.js';
import { Field } from './WorkBuildings/Field.js';
import { CookHouse } from './WorkBuildings/CookHouse.js';

/**
 * Фабрика зданий
 * @param {BuildingTypes} buildingType 
 */
export function CreateBuilding(buildingType) {
    switch(buildingType) {
        case BuildingTypes.Home:
            let home = new Home();
            return new ConstructionSite(home, 100);
        case BuildingTypes.TownHall:
            let townHall = new TownHall();
            return new ConstructionSite(townHall, 500);
        case BuildingTypes.RawFoodStorage:
            let rawFoodStorage = new RawFoodStorage();
            return new ConstructionSite(rawFoodStorage, 75);
        case BuildingTypes.PreparedFoodStorage:
            let preparedFoodStorage = new PreparedFoodStorage();
            return new ConstructionSite(preparedFoodStorage, 75);
        case BuildingTypes.IronStorage:
            let ironStorage = new IronStorage();
            return new ConstructionSite(ironStorage, 75);
        case BuildingTypes.WoodStorage:
            let woodStorage = new WoodStorage();
            return new ConstructionSite(woodStorage, 75);
        case BuildingTypes.StoneStorage:
            let stoneStorage = new StoneStorage();
            return new ConstructionSite(stoneStorage, 75);
        case BuildingTypes.Mine:
            let mine = new Mine(ResourceTypes.Iron);
            return new ConstructionSite(mine, 700);
        case BuildingTypes.Quarry:
            let quarry = new Quarry();
            return new ConstructionSite(quarry, 700);
        case BuildingTypes.ForesterLodge:
            let foresterLodge = new ForesterLodge();
            return new ConstructionSite(foresterLodge, 473);
        case BuildingTypes.Field:
            let field = new Field();
            return new ConstructionSite(field, 400);
        case BuildingTypes.CookHouse:
            let cookHouse = new CookHouse(ResourceTypes.PreparedFood);
            return new ConstructionSite(cookHouse, 300);
        default:
            console.error(`${buildingType} - является неизвестным типом здания`);
    }
}