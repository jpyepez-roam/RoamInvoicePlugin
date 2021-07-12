const injectAssistant = async (container) => {
    // add template
    const res = await fetch(chrome.runtime.getURL('/template.html'))
    const html = await res.text()
    container.insertAdjacentHTML('afterbegin', html)

    // add button listener
    const invoiceAssistant = new InvoiceAssistant(container)
    const goButton = document.getElementById('roam-convert-go')
    goButton.addEventListener('click', () => {
        invoiceAssistant.getData()
        invoiceAssistant.updatePage()
    })
}

const displayResult = async (container, status) => {
    // add template
    const statusTemplate = status
        ? '/status_success.html'
        : '/status_warning.html'
    const res = await fetch(chrome.runtime.getURL(statusTemplate))
    const html = await res.text()
    container.insertAdjacentHTML('beforeend', html)
}

let isInit = false

browser.runtime.onMessage.addListener(async () => {
    const tableWrapper = document.querySelector(TABLE_WRAPPER)

    if (tableWrapper && !isInit) {
        injectAssistant(tableWrapper)
        isInit = true
        tableWrapper.addEventListener('invoice-updated', (event) => {
            displayResult(tableWrapper, event.detail)
        })
    }
})
