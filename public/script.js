/* =====================================================
   CINEMATIC HERO — REVEAL ANIMATIONS
===================================================== */

window.addEventListener("DOMContentLoaded", () => {

  // staggered reveal of hero elements
  setTimeout(() => {
    document.querySelectorAll("[data-reveal]").forEach(el => {
      el.classList.add("revealed")
    })
  }, 300)

})



/* =====================================================
   CINEMATIC HERO — MOUSE SPOTLIGHT + PARALLAX
===================================================== */

const heroSection = document.getElementById("heroSection")
const heroSpotlight = document.getElementById("heroSpotlight")
const heroPortrait = document.getElementById("heroPortrait")

if(heroSection && heroSpotlight){

  heroSection.addEventListener("mousemove", e => {

    const rect = heroSection.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // move spotlight
    heroSpotlight.style.left = x + "px"
    heroSpotlight.style.top = y + "px"

    // subtle parallax on portrait
    if(heroPortrait){
      const moveX = (x - rect.width / 2) / 60
      const moveY = (y - rect.height / 2) / 60
      heroPortrait.style.transform = `translate(${moveX}px, ${moveY}px)`
      heroPortrait.style.transition = "transform 0.6s ease-out"
    }

  })

}



/* =====================================================
   STORE GALLERY DATA
===================================================== */

let imagesData = {}
let currentImages = []
let currentIndex = 0



/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */

const navbar = document.getElementById("navbar")

window.addEventListener("scroll", () => {

  if(window.scrollY > 40){
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

})



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

  if(!gallery) return

  // fade out existing cards
  gallery.style.opacity = "0"
  gallery.style.transform = "translateY(12px)"

  setTimeout(() => {

    gallery.innerHTML = ""
    currentImages = []

    Object.keys(imagesData).forEach(cat => {

      if(category === "all" || category === cat){

        imagesData[cat].forEach((file, i) => {

          let card = document.createElement("div")
          card.className = "card"
          card.style.animationDelay = (i * 0.05) + "s"



          /* ================= VIDEO ================= */

          if(cat === "videos"){

            let video = document.createElement("video")

            video.src = "/images/" + cat + "/" + file

            video.controls = true
            video.loop = true
            video.muted = true
            video.playsInline = true
            video.preload = "metadata"

            card.appendChild(video)

          }



          /* ================= IMAGE ================= */

          else{

            let img = document.createElement("img")

            let src = "/images/" + cat + "/" + file

            img.src = src
            img.loading = "lazy"
            img.alt = cat + " photography"

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

        })

      }

    })

    // fade in gallery
    gallery.style.transition = "opacity 0.4s ease, transform 0.4s ease"
    gallery.style.opacity = "1"
    gallery.style.transform = "translateY(0)"

  }, 200)

}



/* =====================================================
   FILTER GALLERY
===================================================== */

function filterGallery(category, btn){

  // update active state on buttons
  if(btn){
    document.querySelectorAll(".filters button").forEach(b => {
      b.classList.remove("active")
    })
    btn.classList.add("active")
  }

  loadGallery(category)

}



/* =====================================================
   OPEN FULLSCREEN IMAGE
===================================================== */

function openViewer(src){

  const viewer = document.getElementById("viewer")
  const viewerImg = document.getElementById("viewerImg")

  viewer.style.display = "flex"

  // small delay for animation
  requestAnimationFrame(() => {
    viewerImg.src = src
  })

  currentIndex = currentImages.indexOf(src)

  // hide navbar
  const nav = document.querySelector(".glass-nav")
  if(nav) nav.style.display = "none"

  // disable scrolling
  document.body.style.overflow = "hidden"

  // update arrow visibility
  updateViewerArrows()

}



/* =====================================================
   VIEWER ARROW VISIBILITY
===================================================== */

function updateViewerArrows(){

  const prevBtn = document.getElementById("viewer-prev")
  const nextBtn = document.getElementById("viewer-next")

  if(!prevBtn || !nextBtn) return

  prevBtn.style.opacity = currentIndex > 0 ? "1" : "0.2"
  prevBtn.style.pointerEvents = currentIndex > 0 ? "auto" : "none"

  nextBtn.style.opacity = currentIndex < currentImages.length - 1 ? "1" : "0.2"
  nextBtn.style.pointerEvents = currentIndex < currentImages.length - 1 ? "auto" : "none"

}



/* =====================================================
   NEXT IMAGE
===================================================== */

function nextImage(){

  if(currentIndex < currentImages.length - 1){

    currentIndex++

    const img = document.getElementById("viewerImg")
    img.style.opacity = "0"
    img.style.transform = "scale(0.97)"

    setTimeout(() => {
      img.src = currentImages[currentIndex]
      img.onload = () => {
        img.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        img.style.opacity = "1"
        img.style.transform = "scale(1)"
      }
    }, 150)

    updateViewerArrows()

  }

}



/* =====================================================
   PREVIOUS IMAGE
===================================================== */

function prevImage(){

  if(currentIndex > 0){

    currentIndex--

    const img = document.getElementById("viewerImg")
    img.style.opacity = "0"
    img.style.transform = "scale(0.97)"

    setTimeout(() => {
      img.src = currentImages[currentIndex]
      img.onload = () => {
        img.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        img.style.opacity = "1"
        img.style.transform = "scale(1)"
      }
    }, 150)

    updateViewerArrows()

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
   KEYBOARD NAVIGATION
===================================================== */

document.addEventListener("keydown", function(e){

  const viewer = document.getElementById("viewer")
  if(!viewer || viewer.style.display !== "flex") return

  if(e.key === "Escape") closeViewer()
  if(e.key === "ArrowRight") nextImage()
  if(e.key === "ArrowLeft") prevImage()

})



/* =====================================================
   HERO BUTTON SCROLL
===================================================== */

function scrollToGallery(){

  const gallery = document.getElementById("gallery")
  const filters = document.getElementById("filterBar")

  const target = filters || gallery

  if(target){
    target.scrollIntoView({ behavior:"smooth", block:"start" })
  }

}



/* =====================================================
   SCROLL REVEAL
===================================================== */

function reveal(){

  const reveals = document.querySelectorAll(".reveal")

  for(let i = 0; i < reveals.length; i++){

    const windowHeight = window.innerHeight
    const elementTop = reveals[i].getBoundingClientRect().top

    if(elementTop < windowHeight - 80){

      reveals[i].classList.add("active")

    }

  }

}

window.addEventListener("scroll", reveal)

// trigger on load for elements already visible
document.addEventListener("DOMContentLoaded", reveal)



/* =====================================================
   MOBILE HAMBURGER MENU
===================================================== */

function toggleMenu(){

  const nav = document.getElementById("navLinks")

  nav.classList.toggle("show")

}

// close menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("navLinks")
    nav.classList.remove("show")
  })
})



/* =====================================================
   SWIPE NAVIGATION FOR FULLSCREEN
===================================================== */

let startX = 0
let endX = 0

const viewer = document.getElementById("viewer")

if(viewer){

  viewer.addEventListener("touchstart", e => {

    startX = e.changedTouches[0].screenX

  }, { passive: true })

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