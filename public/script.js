/* =====================================================
   STORE GALLERY DATA
===================================================== */

let imagesData = {}
let currentImages = []
let currentIndex = 0



/* =====================================================
   FETCH IMAGE DATA FROM BACKEND
===================================================== */

fetch("/api/gallery")
.then(res => res.json())
.then(data => {

imagesData = data

// remove hero images from gallery
delete imagesData.hero

loadGallery("all")

})



/* =====================================================
   LOAD GALLERY
===================================================== */

function loadGallery(category){

const gallery = document.getElementById("gallery")

gallery.innerHTML = ""

currentImages = []

Object.keys(imagesData).forEach(cat => {

if(category === "all" || category === cat){

imagesData[cat].forEach(file => {

let card = document.createElement("div")
card.className = "card"



/* ================= VIDEO ================= */

if(cat === "videos"){

let video = document.createElement("video")

video.src = "/images/" + cat + "/" + file

video.controls = true
video.loop = true
video.muted = true
video.playsInline = true

card.appendChild(video)

}



/* ================= IMAGE ================= */

else{

let img = document.createElement("img")

let src = "/images/" + cat + "/" + file

img.src = src
img.loading = "lazy"

// fade-in animation
img.onload = () => {
img.classList.add("loaded")
}

// store images for swipe navigation
currentImages.push(src)

img.onclick = () => openViewer(src)

card.appendChild(img)

}



// add card to gallery
gallery.appendChild(card)

// tilt animation
addTiltEffect(card)

})

}

})

}



/* =====================================================
   FILTER BUTTON
===================================================== */

function filterGallery(category){

loadGallery(category)

}



/* =====================================================
   OPEN FULLSCREEN IMAGE
===================================================== */

function openViewer(src){

const viewer = document.getElementById("viewer")

viewer.style.display = "flex"

document.getElementById("viewerImg").src = src

currentIndex = currentImages.indexOf(src)

// hide navbar
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "none"

// disable scrolling
document.body.style.overflow = "hidden"

}



/* =====================================================
   NEXT IMAGE
===================================================== */

function nextImage(){

if(currentIndex < currentImages.length - 1){

currentIndex++

document.getElementById("viewerImg").src = currentImages[currentIndex]

}

}



/* =====================================================
   PREVIOUS IMAGE
===================================================== */

function prevImage(){

if(currentIndex > 0){

currentIndex--

document.getElementById("viewerImg").src = currentImages[currentIndex]

}

}



/* =====================================================
   CLOSE FULLSCREEN VIEWER
===================================================== */

function closeViewer(){

const viewer = document.getElementById("viewer")

viewer.style.display = "none"

// show navbar again
const nav = document.querySelector(".glass-nav")
if(nav) nav.style.display = "flex"

// enable scrolling
document.body.style.overflow = "auto"

}



/* =====================================================
   ESC CLOSE
===================================================== */

document.addEventListener("keydown", function(e){

if(e.key === "Escape") closeViewer()

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
   3D HOVER TILT
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
   SCROLL REVEAL
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

window.addEventListener("scroll", reveal)



/* =====================================================
   MOBILE HAMBURGER MENU
===================================================== */

function toggleMenu(){

const nav = document.getElementById("navLinks")

nav.classList.toggle("show")

}



/* =====================================================
   SWIPE NAVIGATION FOR FULLSCREEN
===================================================== */

let startX = 0
let endX = 0

const viewer = document.getElementById("viewer")

if(viewer){

viewer.addEventListener("touchstart", e => {

startX = e.changedTouches[0].screenX

})

viewer.addEventListener("touchend", e => {

endX = e.changedTouches[0].screenX

handleSwipe()

})

}

function handleSwipe(){

const diff = startX - endX

if(Math.abs(diff) > 60){

if(diff > 0){

nextImage()

}else{

prevImage()

}

}

}