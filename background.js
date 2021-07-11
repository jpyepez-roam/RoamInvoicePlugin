browser.browserAction.onClicked.addListener(async () => {
    const tabs = await browser.tabs.query({
        currentWindow: true,
        active: true,
    })

    const currentTab = tabs[0]
    await browser.tabs.sendMessage(currentTab.id, {})
})
