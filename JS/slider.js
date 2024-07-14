class SliderWrapper extends HTMLDivElement {
    constructor() {
        super();
        this._scroll_btn;
        this._custom_slider;
        this.insertAdjacentHTML('afterbegin', this.template());
    }

    connectedCallback() {
        this.scroll_btn = this.querySelectorAll('.scroll_btn');
        customElements.whenDefined('custom-slider').then(() => this.eventFunctions());
    }
    
    eventFunctions() {
        this.custom_slider  = this.querySelector('div[is="custom-slider"]');
    
        this.addEventListener('mouseover', () => {
            this.custom_slider.wrapper_hover = true;
            this.custom_slider.autoPlay();    
        });
        
        this.addEventListener('mouseleave', () => {
            this.custom_slider.wrapper_hover = false;
            this.custom_slider.autoPlay();
        });

        this.scroll_btn.forEach(_btn => {
            _btn.addEventListener('click', () => {
                this.custom_slider.scrollLeft   += _btn.id === "right" ? this.custom_slider.card_width : -this.custom_slider.card_width;
            });
        })
    }

    template() {
        return `
        <button id="left" class="scroll_btn"><b>&#60;</b></button>
        <button id="right" class="scroll_btn"><b>&#62;</b></button>
        `;

;
    }

    // getter e setter 
    get scroll_btn() {
        return this._scroll_btn;
    }

    set scroll_btn(new_value) {
        this._scroll_btn    = new_value;
    }

    get custom_slider() {
        return this._custom_slider;
    }

    set custom_slider(new_value) {
        this._custom_slider = new_value;
    }
}

class CustomSlider extends HTMLDivElement {
    constructor() {
        super();
        this._card_list;
        this._card_width;
        this._card_per_view;
        this._play_timeout;
        this._wrapper_hover = false;
    }

    connectedCallback() {
        this.card_list   = [...this.querySelectorAll('.slide_box:not(.is_a_clone)')];
        this.addEventListener('scroll', this.infinitySlider);
        window.onresize = () => this.updateValues();
        this.updateValues();
    }
    
    updateValues() {
        this.clearClones();
        this.card_width  = this.card_list[0].offsetWidth;
        this.card_per_view   = Math.round(this.offsetWidth / this.card_width);
        this.createCardClones();
    }

    createCardClones() {

        this.card_list.slice(-this.card_per_view).reverse().forEach(_card => {
            let new_clone   = _card.cloneNode(false);
            new_clone.classList.add('is_a_clone');
            this.insertAdjacentHTML('afterbegin', new_clone.outerHTML);
        })
        
        this.card_list.slice(0, this.card_per_view).forEach(_card => {
            let new_clone   = _card.cloneNode(false);
            new_clone.classList.add('is_a_clone');
            this.insertAdjacentHTML('beforeend', new_clone.outerHTML);
        })

        this.querySelectorAll('.is_a_clone').forEach(_clone => {
            _clone.classList.remove('loading');
        });
    }

    clearClones() {
        if(this.querySelector('.is_a_clone')) {
            this.querySelectorAll('.is_a_clone').forEach(_clone => {
                _clone.remove();
            });
        }
    }

    autoPlay() {
        clearTimeout(this.play_timeout);

        if(this.wrapper_hover   == false) {
            this.play_timeout   = setTimeout(() => {
                if(this.dataset.direction == 'right') {
                    this.scrollLeft   -= this.card_width  
                } else {
                    this.scrollLeft   += this.card_width  
                }
            }, 2500);
        }
    }

    infinitySlider() {
        if(this.scrollLeft    === 0) {
            this.classList.add('no-transition');
            this.scrollLeft   = this.scrollWidth - (2 * this.offsetWidth);
            this.classList.remove('no-transition');
        }
        if(Math.ceil(this.scrollLeft) >= (this.scrollWidth - this.offsetWidth)) {
            this.classList.add('no-transition');
            this.scrollLeft   = this.offsetWidth;
            this.classList.remove('no-transition');
        }
    
        this.autoPlay();
    }

    // getters e setters
    get card_list() {
        return this._card_list;
    }

    set card_list(new_value) {
        this._card_list = new_value;
    }

    get card_width() {
        return this._card_width;
    }

    set card_width(new_value) {
        this._card_width    = new_value;
    }

    get card_per_view() {
        return this._card_per_view;
    }

    set card_per_view(new_value) {
        this._card_per_view = new_value;
    }

    get play_timeout() {
        return this._play_timeout;
    }

    set play_timeout(new_value) {
        this._play_timeout  = new_value;
    }

    get wrapper_hover() {
        return this._wrapper_hover;
    }

    set wrapper_hover(new_value) {
        this._wrapper_hover = new_value;
    }
}

class SliderBox extends HTMLDivElement {
    constructor() {
        super();
        this.classList.add('loading');
        this.insertAdjacentElement('afterbegin', this.template());
    }

    connectedCallback() {
        const figure    = this.querySelector('figure');
        figure.onclick  = () => window.open(this.dataset.insta, '_blank');
    }

    disconnectedCallback() {
        this.innerHTML  = '';
    }

    template() {
        const figure    = document.createElement('figure');
        figure.classList.add('img_card');

        const img   = document.createElement('img');
        img.src = this.dataset.imgh;
        img.style.backgroundImage   = `url(${this.dataset.imgh})`;
        img.onload = () => {
            this.classList.remove('loading');
        }
        
        figure.insertAdjacentElement('afterbegin', img);

        return figure;
    }
}

window.customElements.define('slider-wrapper', SliderWrapper, {extends: 'div'});
window.customElements.define('custom-slider', CustomSlider, {extends: 'div'});
window.customElements.define('slider-box', SliderBox, {extends: 'div'});