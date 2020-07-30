// Vars are required as let/const cannot be overwritten
var imagesBox = document.querySelector('.box--images');
var directionsBox = document.querySelector('.box--directions');
var reviewsBox = document.querySelector('.box--reviews');
var boxOrder = [imagesBox, directionsBox, reviewsBox];
var boxNames = ["Images", "Directions", "Reviews"];
var len = boxOrder.length;
var idx = 0;

function forward() {
    var nextIdx = ((idx+1 % len) + len) % len;
    var currentBox = boxOrder[idx];
    var nextBox = boxOrder[nextIdx];
    idx = nextIdx;

    rightIdx = ((idx+1 % len) + len) % len;
    leftIdx = ((idx-1 % len) + len) % len;
    rightName = boxNames[rightIdx];
    leftName = boxNames[leftIdx];

    return gsap
        .timeline({
            onStart: () => {
                document.querySelector('html').classList.add('is-transitioning');
                document.body.classList.add('prevent-scroll');
                document.getElementById('right-arrow').style.opacity = 0;
                document.getElementById('left-arrow').style.opacity = 0;
            },
            onComplete: () => {
                document.querySelector('html').classList.remove('is-transitioning');
                document.body.classList.remove('prevent-scroll');
                document.getElementById('right-arrow').innerText = rightName;
                document.getElementById('left-arrow').innerText = leftName;
                document.getElementById('right-arrow').style.opacity = 1;
                document.getElementById('left-arrow').style.opacity = 1;
            }
        })
        .to(currentBox, {
            duration: 1,
            left: "-150%",
            ease: 'power4.inOut'
        }, 0)
        .fromTo(nextBox, { left: "250%" },
        {
            left: "50%",
            duration: 1,
            ease: 'power4.inOut'
        }, 0)
        .then();
}

function backward() {
    var nextIdx = ((idx-1 % len) + len) % len;
    var currentBox = boxOrder[idx];
    var nextBox = boxOrder[nextIdx];
    idx = nextIdx;

    rightIdx = ((idx+1 % len) + len) % len;
    leftIdx = ((idx-1 % len) + len) % len;
    rightName = boxNames[rightIdx];
    leftName = boxNames[leftIdx];

    return gsap
        .timeline({
            onStart: () => {
                document.querySelector('html').classList.add('is-transitioning');
                document.body.classList.add('prevent-scroll');
                document.getElementById('right-arrow').style.opacity = 0;
                document.getElementById('left-arrow').style.opacity = 0;
            },
            onComplete: () => {
                document.querySelector('html').classList.remove('is-transitioning');
                document.body.classList.remove('prevent-scroll');
                document.getElementById('right-arrow').innerText = rightName;
                document.getElementById('left-arrow').innerText = leftName;
                document.getElementById('right-arrow').style.opacity = 1;
                document.getElementById('left-arrow').style.opacity = 1;
            }
        })
        .to(currentBox, {
            duration: 0.7,
            left: "250%",
            ease: 'power4.inOut'
        }, 0)
        .fromTo(nextBox, { left: "-150%" },
        {
            left: "50%",
            duration: 0.7,
            ease: 'power4.inOut'
        }, 0)
        .then();
}
