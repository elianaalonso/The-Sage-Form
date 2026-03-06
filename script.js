
// BOOT SCREEN

let zIndexCounter = 10

setTimeout(()=>{

document.getElementById("boot").style.display="none"

},2500)



// CLOCK

function updateClock(){

const clock=document.getElementById("clock")

const now=new Date()

const options={
hour:'2-digit',
minute:'2-digit'
}

const time=now.toLocaleTimeString([],options)

const day=now.toLocaleDateString('en-US',{weekday:'long'})

clock.innerHTML=time+" • "+day

}

setInterval(updateClock,1000)

updateClock()


let activeWindow = null
let offsetX = 0
let offsetY = 0


function openFolder(name){

const map = {
work: "window-work",
archive: "window-archive",
about: "window-about",
contact: "window-contact"
}

const targetId = map[name]
if(!targetId) return

openWindow(targetId)

}


function openWindow(id){

let win = document.getElementById(id)

if(!win) return

zIndexCounter++
win.style.zIndex = zIndexCounter

win.style.display="block"

setTimeout(()=>{
win.classList.add("active")
},10)

}

function closeWindow(id){

let win = document.getElementById(id)

if(!win) return

win.classList.remove("active")

setTimeout(()=>{
win.style.display="none"
},200)

}


function startMove(e){

const bar = e.currentTarget
activeWindow = bar.closest(".window")

if(!activeWindow) return

zIndexCounter++
activeWindow.style.zIndex = zIndexCounter

const rect = activeWindow.getBoundingClientRect()

// Convert centered window into absolute coordinates before dragging.
activeWindow.style.left = rect.left + "px"
activeWindow.style.top = rect.top + "px"
activeWindow.style.transform = "none"

offsetX = e.clientX - rect.left
offsetY = e.clientY - rect.top

activeWindow.classList.add("dragging")

document.addEventListener("mousemove", moveWindow)
document.addEventListener("mouseup", stopMove)

}


function moveWindow(e){

if(!activeWindow) return

activeWindow.style.left = (e.clientX - offsetX) + "px"
activeWindow.style.top = (e.clientY - offsetY) + "px"

}

function stopMove(){

document.removeEventListener("mousemove", moveWindow)
document.removeEventListener("mouseup", stopMove)

if(activeWindow){
activeWindow.classList.remove("dragging")
}

activeWindow = null

}


document.querySelectorAll(".window-bar").forEach((bar)=>{
bar.addEventListener("mousedown", startMove)
})


document.querySelectorAll(".window").forEach((win) => {

win.addEventListener("mousedown", () => {

zIndexCounter++
win.style.zIndex = zIndexCounter

})

})


function openProject(id){

openWindow(id)

}
