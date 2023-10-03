document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sortByDurationButton').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: sortByDuration
            });
        });
    });
});



function sortByDuration(){
    const className = "ytd-thumbnail-overlay-time-status-renderer" 
    const id = "text"
    const query = `.${className}#${id}`
    let nodes = document.querySelectorAll(query);

    var textToSeconds = (text) => {
        const timeParts = text.split(":").reverse();
        let unitToSeconds = 1;
        let totalSeconds = 0;
        
        //the format is hours:minutes:seconds even for videos longer than 24 hours
        for(let idx = 0; idx < timeParts.length; idx++){
            totalSeconds += parseInt(timeParts[idx]) * unitToSeconds;
            unitToSeconds *= 60;
        }

        return totalSeconds
    };

    var nodesHaveTheSameParent = (nodes) => {
        let commonParent = nodes[0].parentNode;
        for (let node of nodes){
            if (node.parentNode !== commonParent){
                return false;
            }
        }
        return true;
    }

    // this could be achieved by hardcoding the xpath
    var findChildrenOfTheLowestCommonAncestor = (nodes) => {
        while (!nodesHaveTheSameParent(nodes.map(n => n["node"]))){
            for(let node of nodes){
                node["node"] = node["node"].parentNode
            }
        }
        return nodes;
    }

    nodes = Array.prototype.map.call(
        nodes, 
        node => {
            return {
                "duration": textToSeconds(node.innerHTML),
                "node": node,
            }
        }
    );

    nodes = findChildrenOfTheLowestCommonAncestor(nodes)
    nodes.sort((a, b) => b.duration - a.duration);


    let parent = nodes[0]["node"].parentNode;
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    for (let node of nodes) {
        parent.appendChild(node["node"]);
    }
}



