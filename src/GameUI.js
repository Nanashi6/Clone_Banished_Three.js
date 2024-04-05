export class GameUI {
    isObjectPanel = false;

    onToolSelected(event) {    
        this.activeToolId = event.target.getAttribute('data-type');

        window.game.buildingRaycaster.updateBuildHighlighter(this.activeToolId);
    }

    onSelectorChanged(event) {
        this.activeSelectorId = event.target.getAttribute('data-type');

        window.game.selectorRaycaster.changeSelector(this.activeSelectorId);
    }

    updateResourceInfoPanel(resourcesCount) {
        document.getElementById('resourcesInfo').innerHTML = `Iron: ${resourcesCount.Iron} Stone: ${resourcesCount.Stone} Wood: ${resourcesCount.Wood} RawFood: ${resourcesCount.RawFood} PFood: ${resourcesCount.PreparedFood}`;
    }

    updateGeneralState(generalState) {
        document.getElementById('generalState').innerHTML = generalState;
    }
}

window.ui = new GameUI();