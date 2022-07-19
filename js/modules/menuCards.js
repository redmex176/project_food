import {getResource} from '../services/services';

function menuCards() {

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

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container', 'menu__item').render();
            });
        });
}

export default menuCards;