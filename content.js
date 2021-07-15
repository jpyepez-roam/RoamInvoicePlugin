let tableWrapper

const injectAssistant = async () => {
    // add template
    const res = await fetch(browser.runtime.getURL('/template.html'))
    const html = await res.text()
    tableWrapper.insertAdjacentHTML('afterbegin', html)

    // add button listener
    const invoiceAssistant = new InvoiceAssistant(tableWrapper)
    const goButton = tableWrapper.querySelector(ROAM_CONVERT_GO)
    goButton.addEventListener('click', () => {
        invoiceAssistant.getData()
        invoiceAssistant.updatePage()
    })
}

const displayResult = async (status) => {
    // add template
    const statusTemplate = status
        ? '/status_success.html'
        : '/status_warning.html'
    const res = await fetch(browser.runtime.getURL(statusTemplate))
    const html = await res.text()
    tableWrapper.insertAdjacentHTML('beforeend', html)

    const bannerType = status ? 'success' : 'warning'
    const banner = tableWrapper.querySelector(
        `.roam-assistant__status--${bannerType}`
    )
    const button = banner.querySelector('.roam-assistant__status--close')
    button.addEventListener('click', () => banner.remove())
}

const clearBanners = () => {
    const successBanner = tableWrapper.querySelector(
        `.roam-assistant__status--success`
    )
    if (successBanner) successBanner.remove()

    const warningBanner = tableWrapper.querySelector(
        `.roam-assistant__status--warning`
    )
    if (warningBanner) warningBanner.remove()
}

const updateCallback = (event) => {
    clearBanners()
    displayResult(event.detail)
}

const resetWrapper = () => {
    const assistant = tableWrapper.querySelector(ROAM_ASSISTANT_WRAPPER)
    if (assistant) {
        tableWrapper.removeEventListener('invoice-updated', updateCallback)
        assistant.remove()
    }
    clearBanners()
}

browser.runtime.onMessage.addListener(async () => {
    tableWrapper = document.querySelector(TABLE_WRAPPER)

    if (tableWrapper) {
        resetWrapper()
        injectAssistant()
        isInit = true
        tableWrapper.addEventListener('invoice-updated', updateCallback)
    }
})
