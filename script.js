
// BOOT SCREEN

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
