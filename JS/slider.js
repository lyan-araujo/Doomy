const wrapper   = document.querySelector('#wrapper');
const slider    = document.querySelector('#slider');
const card_list = [...slider.querySelectorAll('.delimiter')];
const scroll_btn    = document.querySelectorAll('.scroll_btn');
let card_width, card_per_view, timeout;
let slider_hover    = false;

function createCardClones() {
    if(slider.querySelector('.is_a_clone')) {
        slider.querySelectorAll('.is_a_clone').forEach(_clone => {
            _clone.parentNode.removeChild(_clone);
        });
    }

    card_list.slice(-card_per_view).reverse().forEach(_card => {
        let new_clone   = _card.cloneNode(true);
        new_clone.classList.add('is_a_clone');
        slider.insertAdjacentHTML('afterbegin', new_clone.outerHTML);
    })
    
    card_list.slice(0, card_per_view).forEach(_card => {
        let _clone  = _card.cloneNode(true);
        _clone.classList.add('is_a_clone');
        slider.insertAdjacentHTML('beforeend', _clone.outerHTML);
    })
}

function updateValues() {
    card_width  = card_list[0].offsetWidth;
    card_per_view   = Math.round(slider.offsetWidth / card_width);
    createCardClones();
}

function autoPlay() {
    clearTimeout(timeout);
    timeout = setTimeout(() => slider.scrollLeft += card_width, 2500);
}

function infinitySlider() {
    if(slider.scrollLeft    === 0) {
        console.log('left');
        slider.classList.add('no-transition');
        slider.scrollLeft   = slider.scrollWidth - (2 * slider.offsetWidth);
        slider.classList.remove('no-transition');
    }
    
    if(Math.ceil(slider.scrollLeft) === (slider.scrollWidth - slider.offsetWidth)) {
        console.log('right');
        slider.classList.add('no-transition');
        slider.scrollLeft   = slider.offsetWidth;
        slider.classList.remove('no-transition');
    }

    if(slider_hover == false) {
        autoPlay();
    }
}

scroll_btn.forEach(_btn => {
    _btn.addEventListener('click', () => {
        slider.scrollLeft   += _btn.id === "right" ? card_width : -card_width;
    });
});

slider.addEventListener('scroll',   infinitySlider);
wrapper.addEventListener('mouseover', () => {
    console.log('enter');
    slider_hover    = true;
    clearTimeout(timeout);    
});

wrapper.addEventListener('mouseleave', () => {
    console.log('leave')
    slider_hover    = false;
    autoPlay();
});
window.onresize = () => updateValues();
updateValues();