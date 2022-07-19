function showModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('active', 'fade');
    document.body.style.overflow = 'hidden';
    if(modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    
    modal.classList.remove('active', 'fade');
    document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    
    const modal = document.querySelector(modalSelector),
          btnOpenModal = document.querySelectorAll(triggerSelector);

    btnOpenModal.forEach(btn => {
        btn.addEventListener('click', () => showModal(modalSelector, modalTimerId));
        clearInterval(modalTimerId);
    });

    function hideModal() {
        modal.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-close') == '' || e.target == modal) {
                closeModal(modalSelector);
                window.removeEventListener('scroll', showModalByScroll);
            }

        });
        
        document.addEventListener('keydown', (e) => {
            if (e.code == 'Escape' && modal.classList.contains('active')) {
                closeModal(modalSelector);
            }
        });
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            showModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    hideModal();
}
export default modal;
export {showModal, closeModal};