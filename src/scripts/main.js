ScrollReveal({
  delay: 250,
  reset: true,
  easing: 'cubic-bezier(0, 0, 0, 1)',
  distance: '48px',
  origin: 'bottom',
  duration: 600
}).reveal('.markdown-body > *');

(() => {
  var el = document.getElementById('dynamic-background')

  const update = () => {
    // el.style.setProperty('--radius', getSpotsCount() + 'px')
    for (let i = 0; i < (getSpotsCount() - el.children.length) / 2; i++) {
      new Spot()
    }
  }

  const getWindowWidth = () => {
    return window.innerWidth
  }

  const getWindowHeight = () => {
    return window.innerHeight
  }

  const getWindowSize = () => {
    return getWindowWidth() * getWindowHeight()
  }

  const getSpotsCount = () => {
    return Math.floor(getWindowSize() / 10000)
  }

  class Spot {
    constructor() {
      this.color = getRandomColor()
      this.from = {
        x: Math.floor(Math.random() * (window.innerWidth + 1)),
        y: Math.floor(Math.random() * (window.innerHeight + 1)),
      }
      this.to = {
        x: Math.floor(Math.random() * (window.innerWidth + 1)),
        y: Math.floor(Math.random() * (window.innerHeight + 1)),
      }
      this.distance = Math.sqrt(
        Math.pow(this.from.x - this.to.x, 2) + Math.pow(this.from.y - this.to.y, 2)
      )
      this.duration = Math.floor(this.distance * 10)

      this.el = document.createElement('div')
      this.el.classList.add('spot')
      this.el.style.setProperty('--color', this.color)
      this.el.style.setProperty('--from-x', this.from.x + 'px')
      this.el.style.setProperty('--from-y', this.from.y + 'px')
      this.el.style.setProperty('--to-x', this.to.x + 'px')
      this.el.style.setProperty('--to-y', this.to.y + 'px')
      this.el.style.setProperty('--duration', this.duration + 'ms')
      el.appendChild(this.el)

      this.el.addEventListener('animationend', (ev) => {
        if (ev.animationName == 'spot-animation') {
          this.el.parentNode.removeChild(this.el)
        }
      })
    }
  }

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 256 * 256 * 256).toString(16)
  }

  var intervalID = setInterval(update, 1000)
})()
