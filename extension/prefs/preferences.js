function restoreOptions() {
    function setCurrentChoice(result) {
        if (typeof result.theme !== 'undefined') {
            Array.from(document.querySelectorAll('input')).forEach(i => {
                if (i.value === result.theme)
                    i.checked = true;
            });
        } else {
            document.querySelector('input[value=light]').checked = true;
            browser.storage.local.set({
                theme: "light"
            });
        }
    }

    var getting = browser.storage.local.get("theme");
    getting.then(setCurrentChoice, null);
}

document.addEventListener('DOMContentLoaded', restoreOptions);

Array.from(document.querySelectorAll('input')).forEach(radio => {
    radio.addEventListener('click', () => {
        browser.storage.local.set({
            theme: radio.value
        });
    });
});
