const updateScrollProgress = () => {
    document.body.style.setProperty('--body-scroll-top-px', document.body.scrollTop + 'px')
    document.body.style.setProperty('--body-scroll-top-1', (document.body.scrollTop / (document.body.scrollHeight - document.body.clientHeight)))
    document.body.style.setProperty('--body-scroll-top-percent', (document.body.scrollTop / (document.body.scrollHeight - document.body.clientHeight) * 100) + '%')
}

updateScrollProgress()
window.addEventListener('scroll', updateScrollProgress)
