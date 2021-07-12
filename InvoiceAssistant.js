class InvoiceAssistant {
    invoiceState = []
    prevInvoiceTotal = ''
    newInvoiceTotal = ''

    constructor() {}

    getData = () => {
        this.invoiceState = []

        const invoiceRows = document.querySelectorAll(INVOICE_ROW)
        invoiceRows.forEach((row) => {
            const { id } = row

            const unitTitle = row.querySelector(`${UNIT_FIELD} ${UNIT_TITLE}`)
            const unitValue = unitTitle.textContent.trim().toLowerCase()

            const qtyInput = row.querySelector(`${QTY_FIELD} input`)
            const qtyValue = qtyInput.value

            const rateInput = row.querySelector(`${RATE_FIELD} input`)
            const rateValue = parseInt(rateInput.value)

            this.invoiceState.push({ id, unitValue, qtyValue, rateValue })
        })

        const invoiceTotal = document.querySelector(`${INVOICE_TOTAL} > label`)
        this.prevInvoiceTotal = invoiceTotal.textContent.trim()
    }

    updatePage = () => {
        this.invoiceState.forEach((item, idx) => {
            setTimeout(() => {
                if (/hour/i.test(item.unitValue.trim())) {
                    const row = document.getElementById(item.id)

                    // update units
                    const unitButton = row.querySelector(
                        `${UNIT_FIELD} > ${UNIT_BUTTON}`
                    )
                    unitButton.click()

                    const popover = document.querySelector(POPOVER)
                    const unitOptions =
                        popover.querySelectorAll(POPOVER_OPTIONS)
                    unitOptions.forEach((option) => {
                        if (/day/i.test(option.textContent.trim())) {
                            option.click()
                        }
                    })

                    // update quantity
                    const qtyInput = row.querySelector(`${QTY_FIELD} input`)
                    qtyInput.value = +item.qtyValue / 8.0
                    qtyInput.dispatchEvent(
                        new Event('input', {
                            bubbles: false,
                            cancelable: false,
                        })
                    )

                    // update rate
                    const rateInput = row.querySelector(`${RATE_FIELD} input`)
                    rateInput.value = (+item.rateValue * 8.0).toFixed(2)
                    rateInput.dispatchEvent(
                        new Event('input', {
                            bubbles: false,
                            cancelable: false,
                        })
                    )
                }
            }, idx * 75)
        })

        setTimeout(() => {
            const invoiceTotal = document.querySelector(
                `${INVOICE_TOTAL} > label`
            )
            this.newInvoiceTotal = invoiceTotal.textContent.trim()

            console.log(this.invoiceState.length)
            console.log(this.prevInvoiceTotal, this.newInvoiceTotal)
        }, this.invoiceState.length * 75)
    }
}
