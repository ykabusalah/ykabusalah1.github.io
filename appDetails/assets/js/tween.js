import { Power2, TweenLite }  from 'gsap';

/**
 * Max width multiplier
 * @constant
 */
const MAX = 0.25;
/**
 * Width deviation
 * @constant
 */
const DVT = MAX / 2;
/**
 * Width padding, derived from border width
 * @constant
 */
const PAD = 15;
/**
 * Object colors
 * @constant
 */
const COLORS = [
    '#007bff',
    '#70C1B3',
    '#B2DBBF',
    '#F3FFBD',
    '#FF1654',
];

let WINDOW_WIDTH;
let WINDOW_HEIGHT;
let SVG_EL;
/**
 * Load required environment variables
 * @function
 */
const initLoadedVars = () => {
    WINDOW_WIDTH = window.innerWidth;
    WINDOW_HEIGHT = window.innerHeight;
    SVG_EL = document.querySelector('#tween-svg');
    SVG_EL.style.width = `${WINDOW_WIDTH}px`;
    SVG_EL.style.height = `${WINDOW_HEIGHT}px`;
};

/**
 * Describes an SVG Shape
 * @abstract @class @implements SVG
 */
class Shape {
    updateColor() {
        this.el.setAttribute('fill', COLORS[Math.floor(Math.random() * COLORS.length)]);
        return this;
    }

    static getDifferential() {
        return Math.random() * WINDOW_WIDTH * MAX + WINDOW_WIDTH * DVT;
    };
}
/**
 * Describes an SVG Blob
 * @class @extends Shape @implements SVG
 */
class Blob extends Shape {
    constructor(x, y) {
        super();

        this.x1 = Blob.getDifferential();
        this.x2 = this.x1 + Blob.getDifferential();
        this.x3 = this.x2 + Blob.getDifferential();
        this.x0 = x - this.x3 / 2;
        this.y0 = y;
        this.y1 = 0;
        this.el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.updateColor()
            .updateEl()
            .animate();

    }

    updateEl() {
        this.el.setAttribute('d', `M${this.x0},${this.y0} c${this.x1},${this.y1} ${this.x2},${this.y1} ${this.x3},0`);
        return this;
    }

    animate() {
        const time = 0.3 + Math.random() * 1.2;
        TweenLite.to(this.el, time, {
            x1: Blob.getDifferential(),
            x2: this.x1 + Blob.getDifferential(),
            x3: this.x2 + Blob.getDifferential(),
            x0: WINDOW_WIDTH * MAX * 2 - this.x3 / 2,
            y1: -WINDOW_HEIGHT * MAX * 1.5 * Math.random() - WINDOW_HEIGHT * MAX * 2,
            ease: Power2.easeInOut,
            onUpdate: () => { return this.updateEl(); },
            onComplete: () => {
                return TweenLite.to(this.el, time, {
                    x1: Blob.getDifferential(),
                    x2: this.x1 + Blob.getDifferential(),
                    x3: this.x2 + Blob.getDifferential(),
                    x0: WINDOW_WIDTH * MAX * 2 - this.x3 / 2,
                    y1: 0,
                    onUpdate: () => { return this.updateEl(); },
                    onComplete: () => {
                        this.animate();
                        this.updateColor();
                    },
                });
            },
        });
    }
}


/**
 * Describes an SVG Circle
 * @class @extends Shape @implements SVG
 */
class Circle extends Shape {
    constructor() {
        super();

        this.radius = (Math.random() * WINDOW_WIDTH * 0.1 + WINDOW_WIDTH * 0.05) / 6;
        this.x = Math.random() * (WINDOW_WIDTH - 2 * this.radius - PAD * 2) + this.radius + PAD;
        this.y = Math.random() * (WINDOW_HEIGHT - 2 * this.radius - PAD * 2) + this.radius + PAD;
        this.opacity = 1;
        this.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    }

    static allCircles = [];

    static get circles() {
        return Circle.allCircles;
    }

    static intersects({x, y, radius}) {
        for (let i = 0, a = Circle.allCircles; i < a.length; i++) {
            const existingCircle = a[i];
            const distance = Math.sqrt((existingCircle.x - x) ** 2 + (existingCircle.y - y) ** 2);
            if (distance <= existingCircle.radius + radius) {
                return true;
            }
        }
        return false;
    };

    static generate(amt) {
        for (let i = 0; i < amt; ++i) {
            const circle = new Circle();
            if (!Circle.intersects(circle)) {
                Circle.allCircles.push(circle);
                circle
                    .updateColor()
                    .updateEl()
                    .animate();
            }
            else {
                --i;
            }
        }
    };

    updateEl() {
        this.el.setAttribute('cx', `${this.x}`);
        this.el.setAttribute('cy', `${this.y}`);
        this.el.setAttribute('r', `${this.radius}`);
        this.el.style.opacity = `${this.opacity}`;
        return this;
    }

    animate() {
        const time = 0.3 + Math.random() * 2.4;
        TweenLite.to(this.el, time, {
            opacity: 1,
            ease: Power2.easeInOut,
            onUpdate: () => {
                return this.updateEl();
            },
            onComplete: () => {
                return TweenLite.to(this.el, time, {
                    opacity: 0,
                    onUpdate: () => {
                        return this.updateEl();
                    },
                    onComplete: () => {
                        let circle;
                        do {
                            circle = new Circle();
                        } while (Circle.intersects(circle));
                        this.radius = circle.radius;
                        this.x = circle.x;
                        this.y = circle.y;
                        this.opacity = circle.opacity;
                        this.updateColor()
                            .updateEl()
                            .animate();
                    },
                });
            },
        });
    }
}


/**
 * Creates a Tween, which consists of an SVG Blob and `num` SVG Circles
 * @function
 */
const tween = (num, makeCircles = true, makeBlob = true) => {
    // redefine environment variables for document.load
    initLoadedVars();
    if (makeCircles) {
        Circle.generate(num);
        Circle.circles.forEach(({el}) => SVG_EL.appendChild(el));
    }
    if (makeBlob) {
        const blob = new Blob(WINDOW_WIDTH * 0.5, WINDOW_HEIGHT);
        SVG_EL.appendChild(blob.el);
    }
};

// initialize animation
tween(5);
