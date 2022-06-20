window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabsParent = document.querySelector('.tabheader__items'),
        tabs = tabsParent.querySelectorAll('.tabheader__item'),
        tabContent = document.querySelectorAll('.tabcontent');


    function hideTabsContent() {
        tabContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('active', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabsContent(i = 0) {
        tabContent[i].classList.add('active', 'fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
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

    //Timer 

    const deadline = "2022-08-15";

    function getTimeRemaining(endTime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endTime) - Date.parse(new Date());
        days = Math.floor(t / 86400000);
        hours = Math.floor((t / 3600000) % 24);
        minutes = Math.floor((t / 60000) % 60);
        seconds = Math.floor((t / 1000) % 60);

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }

        return {
            'total': t,
            days,
            hours,
            minutes,
            seconds
        };

    }

    function setTime(timer, endTime) {
        const timerId = document.querySelector(timer),
            days = timerId.querySelector('#days'),
            hours = timerId.querySelector('#hours'),
            minutes = timerId.querySelector('#minutes'),
            seconds = timerId.querySelector('#seconds'),
            timeInterval = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() {
            const t = getTimeRemaining(endTime);
            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }

    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    setTime('.timer', deadline);

    //Modal 

    const modal = document.querySelector('.modal'),
        btnOpenModal = document.querySelectorAll('[data-modal]'),
        btnCloseModal = document.querySelector('[data-close]');

    const modalTimerId = setTimeout(showModal, 35000);


    btnOpenModal.forEach(btn => {
        btn.addEventListener('click', showModal);
        clearInterval(modalTimerId);
    });

    function showModal() {
        modal.classList.add('active', 'fade');
        document.body.style.overflow = 'hidden';
        window.removeEventListener('scroll', showModalByScroll);
    }

    function closeModal() {
        modal.classList.remove('active', 'fade');
        document.body.style.overflow = '';
    }

    function hideModal() {
        modal.addEventListener('click', (e) => {
            if (e.target == btnCloseModal || e.target == modal) {
                closeModal();
            }

        });
        document.addEventListener('keydown', (e) => {
            if (e.code == 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    hideModal();

});