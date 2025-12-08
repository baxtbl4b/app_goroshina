// Fix viewport height for PWA on mobile devices
function setViewportHeight() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

// Set initial viewport height
setViewportHeight()

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight)
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100)
})

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Re-calculate viewport after page load
    setTimeout(setViewportHeight, 300)

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
