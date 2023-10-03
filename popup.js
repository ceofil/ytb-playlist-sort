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
        while (!nodesHaveTheSameParent(nodes)){
            nodes = nodes.map(node => node.parentNode)
        }
        return nodes;
    }

    const query = `.ytd-thumbnail-overlay-time-status-renderer#text`
    let nodes = Array.from(document.querySelectorAll(query));
    if (nodes.length == 0){
        return;
    }
    nodes = findChildrenOfTheLowestCommonAncestor(nodes)
    videos = nodes.map(node => {
        return {
            node: node,
            duration: textToSeconds(node.querySelector(query).innerHTML)
        }
    }).sort((a, b) => b.duration - a.duration)

    const parent = videos[0].node.parentNode;
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    for (let video of videos) {
        parent.appendChild(video.node);
    }
}



