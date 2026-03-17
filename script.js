
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


function openFolder(name, folderEl){

const map = {
work: "window-work",
archive: "window-archive",
about: "window-about",
contact: "window-contact"
}

const targetId = map[name]
if(!targetId) return

openWindow(targetId, folderEl)

}


function openWindow(id, sourceEl){

let win = document.getElementById(id)

if(!win) return

zIndexCounter++
win.style.zIndex = zIndexCounter

// Clear inline drag overrides so open animation can run every time.
win.classList.remove("dragging", "active")
win.style.left = ""
win.style.top = ""
win.style.transform = ""

win.style.display="block"

if(sourceEl){
const rect = sourceEl.getBoundingClientRect()
const sourceX = rect.left + rect.width / 2
const sourceY = rect.top + rect.height / 2
const winRect = win.getBoundingClientRect()
const targetX = winRect.left + winRect.width / 2
const targetY = winRect.top + winRect.height / 2

const seed = document.createElement("div")
seed.className = "window-seed"
seed.style.left = sourceX + "px"
seed.style.top = sourceY + "px"
document.body.appendChild(seed)

requestAnimationFrame(()=>{
requestAnimationFrame(()=>{
seed.style.left = targetX + "px"
seed.style.top = targetY + "px"
seed.style.width = winRect.width + "px"
seed.style.height = winRect.height + "px"
seed.classList.add("expand")
})
})

setTimeout(()=>{
if(seed.isConnected) seed.remove()
},560)

setTimeout(()=>{
win.classList.add("active")
},150)
}else{
setTimeout(()=>{
win.classList.add("active")
},10)
}

}

function closeWindow(id){

let win = document.getElementById(id)

if(!win) return

win.classList.remove("active")

setTimeout(()=>{
win.style.display="none"
},430)

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


const spotlight = document.querySelector(".spotlight")
const cursor = document.querySelector(".cursor")
const logo = document.querySelector(".logo-container")
const interactiveTargets = document.querySelectorAll(".folder, .dock a, .window-bar button")

let mouseX = 0
let mouseY = 0

let cursorX = 0
let cursorY = 0


document.addEventListener("mousemove",(e)=>{

mouseX = e.clientX
mouseY = e.clientY

if(spotlight){
spotlight.style.setProperty("--spot-x", mouseX + "px")
spotlight.style.setProperty("--spot-y", mouseY + "px")
}

if(logo){
const x = (e.clientX - window.innerWidth / 2) * 0.002
const y = (e.clientY - window.innerHeight / 2) * 0.002
logo.style.transform = `translate(${x}px, ${y}px)`
}

})


function animateCursor(){

cursorX += (mouseX - cursorX) * 0.18
cursorY += (mouseY - cursorY) * 0.18

if(cursor){
cursor.style.left = cursorX + "px"
cursor.style.top = cursorY + "px"
}

requestAnimationFrame(animateCursor)

}

animateCursor()


if(cursor){
interactiveTargets.forEach((target) => {
target.addEventListener("mouseenter", () => {
cursor.style.setProperty("--cursor-scale", "1.15")
cursor.style.setProperty("--cursor-rot", "-6deg")
})

target.addEventListener("mouseleave", () => {
cursor.style.setProperty("--cursor-scale", "1")
cursor.style.setProperty("--cursor-rot", "0deg")
})
})
}
