"use strict";

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
        btnOpenModal = document.querySelectorAll('[data-modal]');

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
            if (e.target.getAttribute('data-close') == '' || e.target == modal) {
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

    //MenuCard

    class MenuCard {
        constructor(img, alt, subtitle, descr, price, parentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.transfer = 56;
            this.changeToRub();
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
        }

        changeToRub() {
            this.price = this.transfer * this.price;
        }

        render() {
            const elem = document.createElement('div');

            this.classes.forEach(className => elem.classList.add(className));

            elem.innerHTML = `
                 <img src=${this.img} alt=${this.alt}>
                     <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                     <div class="menu__item-descr">${this.descr}</div>
                     <div class="menu__item-divider"></div>
                     <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                     </div>
            `;
            this.parent.append(elem);
        }
    }
    new MenuCard("img/tabs/vegy.jpg", "vegy", 'Меню "Фитнес"',
        "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новыйпродукт с оптимальной ценой и высоким качеством!",
        10, ".menu .container", "menu__item").render();

    new MenuCard("img/tabs/elite.jpg", "elite", 'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        19, ".menu .container", "menu__item").render();

    new MenuCard("img/tabs/post.jpg", "post", 'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12, ".menu .container", "menu__item").render();


    //Forms  

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так!'
    };

    forms.forEach((item) => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const messageStatus = document.createElement('img');
            messageStatus.src = message.loading;
            messageStatus.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', messageStatus);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            const formData = new FormData(form);
            request.setRequestHeader('Content-type', 'application/json');

            const obj = {};

            formData.forEach((key, value) => {
                obj[key] = value;
            });

            const json = JSON.stringify(obj);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    messageStatus.remove();

                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog', 'fade');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('active', 'fade');
            hideModal();
        }, 4000);
    }
});