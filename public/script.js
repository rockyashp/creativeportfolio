let imagesData = {}

fetch("/api/gallery")
.then(res => res.json())
.then(data => {

imagesData = data

// remove hero folder so hero image never appears in gallery
delete imagesData.hero

loadGallery("all")

})



function loadGallery(category){

const gallery = document.getElementById("gallery")
gallery.innerHTML = ""

Object.keys(imagesData).forEach(cat => {

if(category === "all" || category === cat){

imagesData[cat].forEach(file => {

let card = document.createElement("div")
card.className = "card"


// VIDEO SECTION
if(cat === "videos"){

let video = document.createElement("video")

video.src = "/images/" + cat + "/" + file
video.controls = true
video.loop = true
video.muted = true

card.appendChild(video)

}


// IMAGE SECTION
else{

let img = document.createElement("img")

img.src = "/images/" + cat + "/" + file
img.loading = "lazy"

img.onclick = () => openViewer(img.src)

card.appendChild(img)

}

gallery.appendChild(card)

addTiltEffect(card)

})

}

})

}



function filterGallery(category){

loadGallery(category)

}



/* FULLSCREEN VIEWER */

function openViewer(src){

const viewer = document.getElementById("viewer")

viewer.style.display = "flex"

document.getElementById("viewerImg").src = src

// hide navbar
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "none"

// disable page scroll
document.body.style.overflow = "hidden"

}



function closeViewer(){

const viewer = document.getElementById("viewer")

viewer.style.display = "none"

// show navbar again
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "flex"

// enable scrolling again
document.body.style.overflow = "auto"

}



/* ESC KEY CLOSE */

document.addEventListener("keydown", function(e){

if(e.key === "Escape"){

closeViewer()

}

})



/* SCROLL BUTTON */

function scrollToGallery(){

window.scrollTo({

top: window.innerHeight,
behavior: "smooth"

})

}



/* 3D PHOTO HOVER EFFECT */

function addTiltEffect(card){

card.addEventListener("mousemove", e => {

const rect = card.getBoundingClientRect()

const x = e.clientX - rect.left
const y = e.clientY - rect.top

const centerX = rect.width / 2
const centerY = rect.height / 2

const rotateX = (y - centerY) / 15
const rotateY = (centerX - x) / 15

card.style.transform =
`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

})

card.addEventListener("mouseleave", () => {

card.style.transform = "rotateX(0) rotateY(0)"

})

}



/* CINEMATIC SCROLL REVEAL */

function reveal(){

const reveals = document.querySelectorAll(".reveal")

for(let i = 0; i < reveals.length; i++){

const windowHeight = window.innerHeight
const elementTop = reveals[i].getBoundingClientRect().top

if(elementTop < windowHeight - 100){

reveals[i].classList.add("active")

}

}

}

window.addEventListener("scroll", reveal)