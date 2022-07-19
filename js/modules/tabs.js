function tabs(tabsParentSelector, tabsSelector, tabsContentSelector, activeSelector) {
    
    const tabsParent = document.querySelector(tabsParentSelector),
        tabs = tabsParent.querySelectorAll(tabsSelector),
        tabContent = document.querySelectorAll(tabsContentSelector);


    function hideTabsContent() {
        tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('active', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove(activeSelector);
        });
    }

    function showTabsContent(i = 0) {
        tabContent[i].classList.add('active', 'fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add(activeSelector);
    }

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabsContent();
                    showTabsContent(i);
                }
            });

        }
    });

    hideTabsContent();
    showTabsContent();
}

export default tabs;