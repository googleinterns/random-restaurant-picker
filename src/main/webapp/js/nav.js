const loadingScreen = document.querySelector('.loading-screen')
const mainNavigation = document.querySelector('.main-navigation')

// Function to add and remove the page transition screen
function pageTransitionIn() {
    // GSAP methods can be chained and return directly a promise
    // but here, a simple tween is enough
    return gsap
        .to(loadingScreen, { duration: .5, scaleY: 1, transformOrigin: 'bottom left' })
}
// Function to add and remove the page transition screen
function pageTransitionOut(container) {
    // GSAP methods can be chained and return directly a promise
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

// Function to animate the content of each page
function contentAnimation(container) {
    // Query from container
    $(container.querySelector('.green-heading-bg')).addClass('show')
    // GSAP methods can be chained and return directly a promise
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

$(function() {
    barba.init({
        preventRunning: true,
        transitions: [{
                from: { namespace: ['search'] },
                to: { namespace: ['results'] },
                async leave(data) {
                    console.log("search -> results")
                    await pageTransitionIn()
                    data.current.container.remove()
                },

                async enter(data) {
                    await pageTransitionOut(data.next.container)
                    addMapScript()
                    roll()
                },

                async once(data) { await contentAnimation(data.next.container); }
            },
            {
                from: { namespace: ['results'] },
                async leave(data) {
                    console.log("results -> search");
                    await pageTransitionIn()
                    data.current.container.remove()
                },

                async enter(data) { await pageTransitionOut(data.next.container) },

                async once(data) { await contentAnimation(data.next.container); },

                async beforeEnter(data) {
                    // Load scripts
                    $.getScript("third-party/select2/select2.min.js");
                    $.getScript("third-party/datepicker/moment.min.js");
                    $.getScript("third-party/datepicker/daterangepicker.js");
                    $.getScript("js/form.js");
                }
            }
        ]
    });
});

function redirectToURL(URL) {
    if (barba.transitions.isRunning)
        return;
    barba.go(URL)
}
