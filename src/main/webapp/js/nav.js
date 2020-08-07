function redirectToUrl(url) {
    if (barba.transitions.isRunning)
        return;
    barba.go(url)
}

const loadingScreen = document.querySelector('.loading-screen')
const mainNavigation = document.querySelector('.main-navigation')

function pageTransitionIn() {
    return gsap
        .to(loadingScreen, { duration: .5, scaleY: 1, transformOrigin: 'bottom left' })
}

function pageTransitionOut(container) {
    return gsap
        .timeline({ delay: 0.25 })
        .add('start')
        .to(loadingScreen, {
            duration: 0.5,
            scaleY: 0,
            skewX: 0,
            transformOrigin: 'top left',
            ease: 'power1.out'
        }, 'start')
        .call(contentAnimation, [container], 'start')
}

function contentAnimation(container) {
    $(container.querySelector('.green-heading-bg')).addClass('show')
    return gsap
        .timeline()
        .from(container.querySelector('.is-animated'), {
            duration: 0.5,
            translateY: 10,
            opacity: 0,
            stagger: 0.4
        })
        .from(mainNavigation, { duration: .5, translateY: -10, opacity: 0 })
}

$(() => {
    barba.init({
        preventRunning: true,
<<<<<<< HEAD
        transitions: [{
                from: { namespace: ['search'] },
=======
        transitions: [
            // To Restaurant Roulette
            {
                to: { namespace: ['Restaurant Roulette'] },
                async enter(data) { await defaultTransition(data.current.container, data.next.container); },

                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/index/index.css">');
                    $('head').append('<link rel="stylesheet" href="css/index/form.css">');
                    $('head').append('<link rel="stylesheet" href="css/index/banner.css">');
                    $.getScript("js/index/index.js");
                    $.getScript("js/index/form.js");
                }
            },
            // To results
            {
>>>>>>> a7e4907... address PR #43 comments
                to: { namespace: ['results'] },
                async leave(data) {
                    await pageTransitionIn()
                    data.current.container.remove()
                },

<<<<<<< HEAD
=======
                async beforeEnter(data) {
                    $('head').append('<link rel="stylesheet" href="css/results/results.css">');
                    $.getScript("js/results/results.js");
                    $.getScript("js/results/resultsNav.js");
                }
            },
            // To account info
            {
                to: { namespace: ['Account Info'] },
>>>>>>> a7e4907... address PR #43 comments
                async enter(data) {
                    await pageTransitionOut(data.next.container)
                    addMapScript()
                    roll()
                },

                async once(data) { await contentAnimation(data.next.container); }
            },
            {
                from: { namespace: ['results'] },
                to: { namespace: ['search'] },
                async leave(data) {
                    await pageTransitionIn()
                    data.current.container.remove()
                },

                async enter(data) { await pageTransitionOut(data.next.container) },

                async once(data) { await contentAnimation(data.next.container); },

                async beforeEnter(data) {
                    $.getScript("third-party/select2/select2.min.js");
                    $.getScript("third-party/datepicker/moment.min.js");
                    $.getScript("third-party/datepicker/daterangepicker.js");
                    $.getScript("js/form.js");
                }
            }
        ]
    });
});
