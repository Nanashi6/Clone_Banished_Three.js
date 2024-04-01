export class GameUI {
    onToolSelected(event) {    
        this.activeToolId = event.target.getAttribute('data-type');

        if(this.activeToolId == "ResourceSelector") {
            window.game.selectRaycaster.changeSelectTool(this.activeToolId);
        }
        else {
            window.game.buildingRaycaster.updateBuildHighlighter(this.activeToolId);            
        }
    }

    updateResourceInfoPanel(resourcesCount) {
        document.getElementById('resourcesInfo').innerHTML = `Iron: ${resourcesCount.Iron} Stone: ${resourcesCount.Stone} Wood: ${resourcesCount.Wood} Food: ${resourcesCount.Food}`;
    }
}

window.ui = new GameUI();