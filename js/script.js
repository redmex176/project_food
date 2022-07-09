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
        constructor(img, altimg, subtitle, descr, price, parentSelector, ...classes) {
            this.img = img;
            this.altimg = altimg;
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

    const getResource = async (url) => {
        const result = await fetch(url);

        if(!result.ok){
           throw new Error(`Could not fetch ${url}, status: ${result.status}`);
        }

        return await result.json();
    };

    getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr,price, '.menu .container', 'menu__item').render();
        });
    });



    //Forms  

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так!'
    };

    forms.forEach((item) => {
        BindPostData(item);
    });
    const postData = async (url,data) => {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await result.json();
    };

    function BindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const messageStatus = document.createElement('img');
            messageStatus.src = message.loading;
            messageStatus.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', messageStatus);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests',json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                messageStatus.remove();
            })
            .catch(()=> {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
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
            closeModal();
        }, 4000);
    }

   
    //Slider

    const slides = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');

    let slideIndex = 1;

    showSlides(slideIndex);

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    function showSlides(n){

        if(n > slides.length) {
            slideIndex = 1;
        }

        if(n < 1){
            slideIndex = slides.length;
        }

        slides.forEach((item) => {
            item.style.display = 'none';
        });

        slides[slideIndex - 1].style.display = 'block'; 
        if(slides.length < 10){
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });

    next.addEventListener('click', () => {
        plusSlides(1);
    });
    
});