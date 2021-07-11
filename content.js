// Selectors
const INVOICE_ROW = 'div.invoice-line-items-table__row'
const UNIT_FIELD = '.invoice-line-items-table-form-row__unit-field'
const UNIT_BUTTON = 'button.form-select-field-2__trigger'
const UNIT_TITLE = '.select-field-standard-item__title'
const QTY_FIELD = '.invoice-line-items-table-form-row__quantity-field'
const RATE_FIELD = '.invoice-line-items-table-form-row__unit-price-field'
const POPOVER = '.popover-content__body'
const POPOVER_OPTIONS = '.select-field-standard-item__title'

browser.runtime.onMessage.addListener(async () => {
    const invoiceItems = []

    // get table state
    const invoiceRows = document.querySelectorAll(INVOICE_ROW)
    invoiceRows.forEach((row) => {
        const { id } = row

        const unitTitle = row.querySelector(`${UNIT_FIELD} ${UNIT_TITLE}`)
        const unitValue = unitTitle.textContent.trim().toLowerCase()

        const qtyInput = row.querySelector(`${QTY_FIELD} input`)
        const qtyValue = qtyInput.value

        const rateInput = row.querySelector(`${RATE_FIELD} input`)
        const rateValue = parseInt(rateInput.value)

        // get quantity
        invoiceItems.push({ id, unitValue, qtyValue, rateValue })
    })

    // console.log(invoiceItems)

    // transform page
    invoiceItems.forEach((item, idx) => {
        setTimeout(() => {
            if (/hour/i.test(item.unitValue.trim())) {
                const row = document.getElementById(item.id)
                const unitButton = row.querySelector(
                    `${UNIT_FIELD} > ${UNIT_BUTTON}`
                )
                unitButton.click()

                const popover = document.querySelector(POPOVER)
                const unitOptions = popover.querySelectorAll(POPOVER_OPTIONS)
                unitOptions.forEach((option) => {
                    if (/day/i.test(option.textContent.trim())) {
                        option.click()
                    }
                })

                const qtyInput = row.querySelector(`${QTY_FIELD} input`)
                qtyInput.value = +item.qtyValue / 8.0

                const rateInput = row.querySelector(`${RATE_FIELD} input`)
                console.log(item, +item.rateValue)
                rateInput.value = +item.rateValue * 8.0
            }
        }, idx * 75)
    })

    // convert all hours to day
    // invoiceRows.forEach((row, idx) => {
    //     setTimeout(() => {
    //         const unitButton = row.querySelector(
    //             `${UNIT_FIELD} > ${UNIT_BUTTON}`
    //         )
    //         const unitTitle = unitButton.querySelector(UNIT_TITLE)

    //         if (/hour/i.test(unitTitle.textContent.trim())) {
    //             unitButton.click()

    //             const popover = document.querySelector(POPOVER)
    //             const unitOptions = popover.querySelectorAll(POPOVER_OPTIONS)
    //             unitOptions.forEach((option) => {
    //                 if (/day/i.test(option.textContent.trim())) {
    //                     option.click()
    //                 }
    //             })

    //             const qtyInput = row.querySelector(`${QTY_FIELD} input`)
    //             qtyInput.value = 20

    //             const rateInput = row.querySelector(`${RATE_FIELD} input`)
    //             rateInput.value = 20
    //         }
    //     }, idx * 75)
    // })
})
