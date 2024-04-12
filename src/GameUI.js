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

    updateTaskPanel() {
        // document.getElementById('generalState').innerHTML = generalState;
        const tasksDiv = document.getElementById('tasks');
        // Удаление всех дочерних элементов
        while (tasksDiv.firstChild) {
            tasksDiv.removeChild(tasksDiv.firstChild);
        }

        for(let i = 0; i < window.game.city.Citizens.length; i++) {
            // Создание родительского элемента <div>
            var parentDiv = document.createElement('div');

            // Создание дочерних элементов <div> и установка текста
            var childDiv1 = document.createElement('div');
            childDiv1.textContent = 'Citizen ' + i;

            var childDiv2 = document.createElement('div');
            childDiv2.textContent = window.game.city.Citizens[i].State;

            var childDiv3 = document.createElement('div');
            childDiv3.textContent = window.game.city.Citizens[i].TaskInfo;

            // Добавление дочерних элементов в родительский элемент
            parentDiv.appendChild(childDiv1);
            parentDiv.appendChild(childDiv2);
            parentDiv.appendChild(childDiv3);

            tasksDiv.appendChild(parentDiv);
        }
    }
}

window.ui = new GameUI();
