console.log(
    "%cMade with ❤︎️ by ProbeX",
    "background:#000;color:#fff;padding:0.5em 1em;line-height:2;"
);

// Global Parameters
var body = document.querySelector("body");
let screen = {
    get small() {
        return window.innerWidth < 640;
    },
    get medium() {
        return window.innerWidth >= 640 && window.innerWidth < 1024;
    },
    get large() {
        return window.innerWidth >= 1024;
    },
    get touch() {
        return (
            "ontouchstart" in document.documentElement || navigator.MaxTouchPoints > 0
        );
    },
    get rotate() {
        return "orientation" in window;
    },
    get blend() {
        return window.CSS && CSS.supports("mix-blend-mode", "difference");
    },
};
mouse_layer = body.querySelector(".dot");
const animation_symbol_conf = {
    base: "#000",
    vibrant: "#f98c88",
    contrast: "#fff",
    bright: "#5f5f5f",
    warning: "#f6cc00",
    cloud: "#dadce0",
};
// Initialize global Variables
let bodyScrollBar;
let emergenceObject;

// Initialize smoth-scroll
let t,
    e = 0,
    r = !1;

// Initialize the animation Template
var AnimationSingleton = {};
const AnimationTemplate = {
    "Tween": function (elem) {
        if (AnimationSingleton.Tween) return AnimationSingleton.Tween;
        const arc = body.querySelector(elem);
        arc_length = arc.getTotalLength();
        AnimationSingleton.Tween = new mojs.Html({
            playstate: 1,
            el: elem,
            duration: 1400,
            strokeDasharray: arc_length,
            strokeDashoffset: {
                [arc_length]: 2 * arc_length
            },
            strokeWidth: screen.large ? 28 : 40,
            easing: 'quint.inout'
        });

        return AnimationSingleton.Tween;
    },
};

// Windows hooks
window.addEventListener("load", function () {
    //body.classList.add("no-scroll");
});

// Initialize Barba
barba.hooks.enter((data) => {
    console.log("Global Hook" + data.next.namespace);
});

barba.hooks.after(() => {
    initSmoothScrollbar();
    bodyScrollBar.update();
    bodyScrollBar.scrollTo(0, 0);
    window.scrollTo(window.scrollX, window.scrollY - 1);
    window.scrollTo(window.scrollX, window.scrollY + 1);
});

barba.init({
    timeout: 5000,
    debug: true,
    transitions: [{
        name: "General",
        to: {
            namespace: ["studio", "contact"],
        },
        once: ({
            next
        }) => {
            initheaderView();
            // initMouseCircle();
            initViewHeaderAndFooter();
            initSmoothScrollbar();
            initEnergenceObject();

        },
        leave() {
            console.log("Barba leave");
        },
        enter() {},
    }, {
        name: "contact arc",
        to: {
            namespace: ["contact"]
        },
        enter() {


            // const bouncyCircle = new mojs.Shape({
            //     parent:       '.letter-arc',
            //     shape:        'circle',
            //     fill:         {'#F64040': '#FC46AD'},
            //     radius:       {20: 80},
            //     duration:     2000,
            //     isYoyo:       true,
            //     isShowStart:  false,
            //     easing:       'elastic.inout',
            //     repeat:       1,
            //   });              
            //   bouncyCircle.play();
        }
    }],
    views: [{
        namespace: "studio",
        beforeLeave(data) {
            // do something before leaving the current `index` namespace
        },
        beforeEnter(data) {
            // do something before entering the `contact` namespace
        },
    }, ],
    requestError: (trigger, action, url, response) => {
        // go to a custom 404 page if the user click on a link that return a 404 response status
        if (action === "click" && response.status && response.status === 404) {
            barba.go("/");
        }

        // prevent Barba from redirecting the user to the requested URL
        // this is equivalent to e.preventDefault() in this context
        return false;
    },
});

function initViewHeaderAndFooter() {
    window.addEventListener("scroll", function () {
        e = window.scrollY;
        window.cancelAnimationFrame(t);
        window.requestAnimationFrame(function () {
            if (
                Math.floor(
                    (e /
                        (document.documentElement.scrollHeight -
                            document.documentElement.clientHeight)) *
                    100
                ) >= (screen.large ? 98 : 95)
            ) {
                body.querySelector("footer").classList.add("show");
                r = !0;
            } else {
                body.querySelector("footer").classList.remove("show");
                r = !1;
            }
        });
    });
}

function initSmoothScrollbar() {
    var Scrollbar = window.Scrollbar;
    bodyScrollBar = Scrollbar.init(document.querySelector(".smooth-scroll"), {
        damping: 0.07,
    });
    // remove horizontal scrollbar
    bodyScrollBar.track.xAxis.element.remove();
}

function initEnergenceObject() {
    emergence.init({
        container: window,
        elemCushion: 1,
        offsetTop: screen.small ? 90 : 110,
        offsetBottom: screen.small ? -700 : 0,
        throttle: 300,
        callback: function (element, state) {
            if (screen.small) return;
            const page = body.getAttribute("data-page");
            let _object;
            if (element.dataset && element.dataset.mojoAnimate) {
                _object = AnimationTemplate[element.dataset.mojoAnimate](element.dataset.mojoTarget);
            }
            if (_object) {
                if ((state === "visible") && (_object && (_object._props.playstate === 1))) {
                    _object._props.playstate = 0;
                    _object.play();
                    console.log("Element is visible.");
                } else if (state === "reset" && (_object && (_object._props.playstate === 0))) {
                    _object._props.playstate = 1;
                    _object.playBackward();
                    console.log("Element is hidden with reset.");
                } else if (state === "noreset") {
                    console.log("Element is hidden with NO reset.");
                }
            }
        },
    });
}

function initheaderView() {
    body.querySelector("header").classList.add("display");
    body.querySelector(".media").classList.add("display");
    body.removeChild(body.querySelector(".preload"));
    body.classList.remove("no-scroll");
}

// let Z = mouse_layer.offsetLeft,
//     J = mouse_layer.offsetTop,
//     Q = Z,
//     tt = J,
//     et = 0,
//     rt = 0,
//     it = !1,
//     nt = mouse_layer.clientWidth / 2;

// function initMouseCircle() {
//     document.addEventListener("mousemove", function (t) {
//         mouse_layer.classList.add("init");
//         mouse_layer.offsetLeft = t.clientX;
//         mouse_layer.offsetTop = t.clientY;
//     });
//     document.addEventListener("mousedown", function () {
//         mouse_layer.classList.add("down");
//     });
//     document.addEventListener("mouseup", function () {
//         mouse_layer.classList.remove("down");
//         new mojs.Shape({
//             className: "dot-pulse",
//             shape: "circle",
//             left: 0,
//             top: 0,
//             x: mouse_layer.offsetLeft,
//             y: mouse_layer.offsetTop,
//             radius: {
//                 6: 40
//             },
//             fill: screen.blend ?
//                 animation_symbol_conf.contrast : mouse_layer.classList.contains("blend") ?
//                 animation_symbol_conf.base : animation_symbol_conf.contrast,
//             opacity: {
//                 0.35: 0
//             },
//             duration: 500,
//             onStart: function () {
//                 this.el.style.position = "fixed";
//             },
//             onComplete: function () {
//                 this.el.parentNode.removeChild(this.el);
//             },
//         }).play();
//     });

//     var mouse_loop = function () {
//         et = Z - Q;
//         rt = J - tt;
//         Q += 0.27 * (et - nt);
//         tt += 0.27 * (rt - nt);
//         mouse_layer.style.left = Math.round(Q) + "px";
//         mouse_layer.style.top = Math.round(tt) + "px";
//     };

//     window.requestAnimationFrame(mouse_loop);
// }

// function initLink(initial_call) {
//     Array.from(
//             a.querySelectorAll(void 0 !== initial_call ? "main a, main .button" : "a, .button")
//         ).forEach(function (elem) {
//             elem.addEventListener("mouseenter", function () {
//                 mouse_layer.classList.add("link");
//             });
//             elem.addEventListener("mouseleave", function () {
//                 mouse_layer.classList.remove("link");
//             });
            
//             elem.addEventListener("focus", function () {
//                 if (!G.tabKeyEvent) return;
//                 if (t.parentNode.classList.contains("media")) return;
//                 t.classList.contains("need-highlight") &&
//                     t.classList.add("highlight");
//                 let e = 0;
//                 if (t.classList.contains("in-footer")) e = a.scrollHeight;
//                 else {
//                     let r = t;
//                     do {
//                         (e += r.offsetTop || 0), (r = r.offsetParent);
//                     } while (r);
//                     e -= 0.5 * window.innerHeight;
//                 }
//                 window.scroll({
//                     top: e,
//                     left: 0,
//                     behavior: "smooth"
//                 });
//             });
//             mouse_layer.addEventListener("blur", function () {
//                 elem.classList.contains("need-highlight");
//                 elem.classList.remove("highlight");
//             });
//         }),
//         s.blend ||
//         (Array.from(
//                 a.querySelectorAll("section.white, footer.white")
//             ).forEach(function (t) {
//                 t.addEventListener("mouseenter", function () {
//                         $.classList.add("blend");
//                     }),
//                     t.addEventListener("mouseleave", function () {
//                         $.classList.remove("blend");
//                     });
//             }),
//             Array.from(a.querySelectorAll("header, .media")).forEach(function (
//                 t
//             ) {
//                 t.addEventListener("mouseenter", function () {
//                         $.classList.add("blend-extended");
//                     }),
//                     t.addEventListener("mouseleave", function () {
//                         $.classList.remove("blend-extended");
//                     });
//             }));
// }
