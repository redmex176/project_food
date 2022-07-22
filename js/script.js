require('es6-promise').polyfill();
import tabs from './modules/tabs';
import timer from './modules/timer';
import modal from './modules/modal';
import menuCards from './modules/menuCards';
import forms from './modules/forms';
import calc from './modules/calc';
import slider from './modules/slider';
import {showModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => showModal('.modal', modalTimerId), 50000);

    tabs('.tabheader__items', '.tabheader__item', '.tabcontent', 'tabheader__item_active');
    timer('.timer', '2022-09-22');
    modal('[data-modal]', '.modal');
    menuCards();
    forms('form', modalTimerId);
    calc();
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });

});