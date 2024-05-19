console.log("hello world", new Date().getSeconds())

const PLAYLIST_VIDEO_ELEMENT_TAG = "ytd-playlist-video-renderer"
const MENU_CLASS_NAME = "metadata-wrapper style-scope ytd-playlist-header-renderer"
const DURATION_CLASS_NAME = "badge-shape-wiz__text"
const ASC_ORDER = 1
const DESC_ORDER = -1

let globalSortingOrder = ASC_ORDER

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

function sortVideos(order){
    console.log("sort videos", order)
    let videos = getVideoElements()
    const videosParent = videos[0].parentNode

    let videosWithDuration = videos.map(video => {
        return {
            video: video, 
            duration: getVideoDurationInSeconds(video)
        }
    })
    videosWithDuration.sort((a,b) => (a.duration - b.duration) * order)

    while(videosParent.firstChild){
        videosParent.removeChild(videosParent.firstChild)
    }

    for(let videoWithDuration of videosWithDuration){
        videosParent.appendChild(videoWithDuration.video)
    }

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
    btn.onclick = () => { 
        sortVideos(globalSortingOrder)
        globalSortingOrder *= -1
    } 
    menu.appendChild(btn)

    const h = document.createElement("h1")
    h.innerHTML = `Total: ${secondsToHumanReadable(getTotalDuration())}`
    menu.appendChild(h)

}

function main(){
    addMenuElements()
    // sortVideos()
}

// TODO: this should be an event
setTimeout(main, 1000)