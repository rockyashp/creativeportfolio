/* =====================================================
   STORE GALLERY DATA
===================================================== */
let imagesData = {}


/* =====================================================
   FETCH IMAGE DATA FROM BACKEND
===================================================== */

fetch("/api/gallery")
.then(res => res.json())
.then(data => {

imagesData = data

// Remove hero folder so hero image does not appear in gallery
delete imagesData.hero

// Load all images by default
loadGallery("all")

})



/* =====================================================
   LOAD GALLERY ITEMS
===================================================== */

function loadGallery(category){

const gallery = document.getElementById("gallery")

// Clear previous images
gallery.innerHTML = ""

Object.keys(imagesData).forEach(cat => {

if(category === "all" || category === cat){

imagesData[cat].forEach(file => {

let card = document.createElement("div")
card.className = "card"



/* ================= VIDEO SECTION ================= */

if(cat === "videos"){

let video = document.createElement("video")

video.src = "/images/" + cat + "/" + file

video.controls = true
video.loop = true
video.muted = true
video.playsInline = true

card.appendChild(video)

}



/* ================= IMAGE SECTION ================= */

else{

let img = document.createElement("img")

img.src = "/images/" + cat + "/" + file

// Lazy loading improves performance
img.loading = "lazy"

// Open fullscreen viewer when clicked
img.onclick = () => openViewer(img.src)

card.appendChild(img)

}



// Add card to gallery
gallery.appendChild(card)

// Add tilt animation
addTiltEffect(card)

})

}

})

}



/* =====================================================
   FILTER BUTTON HANDLER
===================================================== */

function filterGallery(category){

loadGallery(category)

}



/* =====================================================
   FULLSCREEN IMAGE VIEWER
===================================================== */

function openViewer(src){

const viewer = document.getElementById("viewer")

viewer.style.display = "flex"

document.getElementById("viewerImg").src = src

// Hide navbar
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "none"

// Disable scrolling
document.body.style.overflow = "hidden"

}



function closeViewer(){

const viewer = document.getElementById("viewer")

viewer.style.display = "none"

// Show navbar again
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "flex"

// Enable scrolling
document.body.style.overflow = "auto"

}



/* =====================================================
   ESC KEY CLOSE VIEWER
===================================================== */

document.addEventListener("keydown", function(e){

if(e.key === "Escape"){

closeViewer()

}

})



/* =====================================================
   HERO BUTTON SCROLL
===================================================== */

function scrollToGallery(){

window.scrollTo({

top: window.innerHeight,
behavior: "smooth"

})

}



/* =====================================================
   3D HOVER TILT EFFECT
===================================================== */

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



/* =====================================================
   SCROLL REVEAL ANIMATION
===================================================== */

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

// Run reveal on scroll
window.addEventListener("scroll", reveal)