const headerTriggers = document.querySelector('.header-external-links')
const menuTrigger = document.querySelector('.menu-trigger')
const menu = document.querySelector('.menu')
const menuPanel = '.menu-panel'
const menuItem = '.menu-pages-item'

document.onkeydown = function(evt) {
    evt = evt || window.event;
    let isEscape = false;
    if ("key" in evt)
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    else
        isEscape = (evt.keyCode === 27);
    if (isEscape) {
        menuClose()
    }
};

function menuToggle() {
    if (isMenuOpen())
        menuClose();
    else
        menuOpen();
}

function menuOpen() {
    headerTriggers.classList.add('is-open');
    menuTrigger.classList.add('is-open');
    document.body.classList.add('prevent-scroll');
    menu.classList.add('is-open'); // Add page blur
    return gsap
        .timeline({
            onStart: () => { menu.classList.add('in-progress'); },
            onComplete: () => { menu.classList.remove('in-progress'); }
        })
        .set(menuItem, {
            y: 50,
            opacity: 0
        })
        .to(menuPanel, {
            duration: 0.5,
            x: 0,
            ease: 'power4.inOut'
        }, 0)
        .to(menuItem, {
            duration: 0.5,
            y: 0,
            opacity: 1,
            ease: 'power4',
            stagger: 0.05
        }, 0.25)
        .then();
}

function menuClose() {
    headerTriggers.classList.remove('is-open');
    menuTrigger.classList.remove('is-open');
    document.body.classList.remove('prevent-scroll');
    menu.classList.remove('is-open'); // Remove page blur
    return gsap
        .timeline({
            onStart: () => { menu.classList.add('in-progress'); },
            onComplete: () => { menu.classList.remove('in-progress'); }
        })
        .to(menuPanel, {
            duration: 0.5,
            x: '110%',
            ease: 'power4.inOut'
        }, 0)
        .then();
}

function isMenuOpen() { return menu.classList.contains('is-open') }
