// BOOT SCREEN

setTimeout(() => {

document.getElementById("boot-screen").style.display="none"
document.getElementById("desktop").classList.remove("hidden")

},3000)


// CLOCK

function updateClock(){

const clock = document.getElementById("clock")

const now = new Date()

const time = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
const day = now.toLocaleDateString([], {weekday:'long'})

clock.innerHTML = time + " • " + day

}

setInterval(updateClock,1000)

updateClock()


// BOOT

setTimeout(()=>{

document.getElementById("boot-screen").style.display="none"
document.getElementById("desktop").classList.remove("hidden")

},2500)


// OPEN WINDOW

function openWindow(id){

document.getElementById(id).classList.remove("hidden")

}


// CLOSE WINDOW

function closeWindow(id){

document.getElementById(id).classList.add("hidden")

}



// CLOCK

function updateClock(){

const clock=document.getElementById("clock")

const now=new Date()

const time=now.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})

const day=now.toLocaleDateString([],{
weekday:'long'
})

clock.innerHTML=time+" • "+day

}

setInterval(updateClock,1000)

updateClock()
