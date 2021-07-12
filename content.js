const injectAssistant = async (container) => {
    // add template
    const res = await fetch(chrome.runtime.getURL('/template.html'))
    const html = await res.text()
    container.insertAdjacentHTML('afterbegin', html)

    // add button listener
    const invoiceAssistant = new InvoiceAssistant()
    const goButton = document.getElementById('roam-convert-go')
    goButton.addEventListener('click', () => {
        invoiceAssistant.getData()
        invoiceAssistant.updatePage()
    })
}

let isInit = false

browser.runtime.onMessage.addListener(async () => {
    const tableWrapper = document.querySelector('.data-table__wrapper')

    if (tableWrapper && !isInit) {
        injectAssistant(tableWrapper)
        isInit = true
    }
})
