console.log("hello world", new Date().getSeconds())

const PLAYLIST_VIDEO_ELEMENT_TAG = "ytd-playlist-video-renderer"
const MENU_CLASS_NAME = "metadata-wrapper style-scope ytd-playlist-header-renderer"
const DURATION_CLASS_NAME = "badge-shape-wiz__text"


function getVideoDurationInSeconds(playlistVideo){
    const durationTextElement = playlistVideo.querySelector("." + DURATION_CLASS_NAME)
    const durationText = durationTextElement.innerHTML
    const timeParts = durationText.split(":").reverse();
    let unitToSeconds = 1;
    let totalSeconds = 0;
    
    //the format is hours:minutes:seconds even for videos longer than 24 hours
    for(let idx = 0; idx < timeParts.length; idx++){
        totalSeconds += parseInt(timeParts[idx]) * unitToSeconds;
        unitToSeconds *= 60;
    }
    return totalSeconds
}

function getVideoElements(){
    return Array.from(document.getElementsByTagName(PLAYLIST_VIDEO_ELEMENT_TAG))
}

function sortVideos(){
    let videos = getVideoElements()
    //TODO
}

function getTotalDuration(){
    return getVideoElements().map(getVideoDurationInSeconds).reduce((a,b)=>a+b, 0)
}

function secondsToHumanReadable(seconds){
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor(seconds % 3600 / 60)
    
    return `${hours}h ${minutes}m ${seconds % 60}s`
}

function addMenuElements(){
    const menu = document.getElementsByClassName(MENU_CLASS_NAME)[0]
    
    const btn = document.createElement("button")
    btn.innerHTML = "Sort videos"
    btn.onclick = sortVideos 
    menu.appendChild(btn)

    const h = document.createElement("h1")
    h.innerHTML = `Total: ${secondsToHumanReadable(getTotalDuration())}`
    menu.appendChild(h)

}

function main(){
    sortVideos()
    addMenuElements()
}

// TODO: this should be an event
setTimeout(main, 1000)