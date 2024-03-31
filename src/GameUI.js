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
}

window.ui = new GameUI();