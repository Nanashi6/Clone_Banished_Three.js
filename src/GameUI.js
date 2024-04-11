import { CSS2DRenderer, CSS2DObject } from '../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js';

export class GameUI {
    isObjectPanel = false;

    onToolSelected(event) {    
        window.game.selectorRaycaster.selectorToDefault();

        this.activeToolId = event.target.getAttribute('data-type');

        window.game.buildingRaycaster.updateBuildHighlighter(this.activeToolId);
    }

    onSelectorChanged(event) {
        window.game.buildingRaycaster.destroyHighlighter();

        this.activeSelectorId = event.target.getAttribute('data-type');

        window.game.selectorRaycaster.changeSelector(this.activeSelectorId);
    }

    updateResourceInfoPanel(resourcesCount, resourcesMaxCount) {
        // document.getElementById('resourcesInfo').innerHTML = `Iron: ${resourcesCount.Iron} Stone: ${resourcesCount.Stone} Wood: ${resourcesCount.Wood} RawFood: ${resourcesCount.RawFood} PFood: ${resourcesCount.PreparedFood}`;
        document.getElementById('wood').innerHTML = `${resourcesCount.Wood}/${resourcesMaxCount.Wood}`;
        document.getElementById('stone').innerHTML = `${resourcesCount.Stone}/${resourcesMaxCount.Stone}`;
        document.getElementById('iron').innerHTML = `${resourcesCount.Iron}/${resourcesMaxCount.Iron}`;
        document.getElementById('raw-food').innerHTML = `${resourcesCount.RawFood}/${resourcesMaxCount.RawFood}`;
        document.getElementById('prepared-food').innerHTML = `${resourcesCount.PreparedFood}/${resourcesMaxCount.PreparedFood}`;
    }

    updateCitizenInfoPanel(citizensCount, citizensMaxCount) {
        document.getElementById('citizens').innerHTML = `${citizensCount}/${citizensMaxCount}`;
    }

    updateGeneralState(generalState) {
        // document.getElementById('generalState').innerHTML = generalState;
    }
}

window.ui = new GameUI();
