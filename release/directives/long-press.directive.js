"use strict";
var core_1 = require('@angular/core');
var Observable_1 = require('rxjs/Observable');
require("rxjs/add/operator/takeUntil");
var LongPressDirective = (function () {
    function LongPressDirective() {
        this.duration = 500;
        this.longPress = new core_1.EventEmitter();
        this.longPressing = new core_1.EventEmitter();
        this.longPressEnd = new core_1.EventEmitter();
        this.mouseX = 0;
        this.mouseY = 0;
    }
    Object.defineProperty(LongPressDirective.prototype, "press", {
        get: function () { return this.pressing; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LongPressDirective.prototype, "isLongPress", {
        get: function () {
            return this.isLongPressing;
        },
        enumerable: true,
        configurable: true
    });
    LongPressDirective.prototype.onMouseDown = function (event) {
        var _this = this;
        // don't do right/middle clicks
        if (event.which !== 1)
            return;
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.pressing = true;
        this.isLongPressing = false;
        var mouseup = Observable_1.Observable.fromEvent(document, 'mouseup');
        this.subscription = mouseup.subscribe(function (ev) { return _this.onMouseup(); });
        this.timeout = setTimeout(function () {
            _this.isLongPressing = true;
            _this.longPress.emit(event);
            _this.subscription.add(Observable_1.Observable.fromEvent(document, 'mousemove')
                .takeUntil(mouseup)
                .subscribe(function (mouseEvent) { return _this.onMouseMove(mouseEvent); }));
            _this.loop(event);
        }, this.duration);
        this.loop(event);
    };
    LongPressDirective.prototype.onMouseMove = function (event) {
        if (this.pressing && !this.isLongPressing) {
            var xThres = Math.abs(event.clientX - this.mouseX) > 10;
            var yThres = Math.abs(event.clientY - this.mouseY) > 10;
            if (xThres || yThres) {
                this.endPress();
            }
        }
    };
    LongPressDirective.prototype.loop = function (event) {
        var _this = this;
        if (this.isLongPressing) {
            this.timeout = setTimeout(function () {
                _this.longPressing.emit(event);
                _this.loop(event);
            }, 50);
        }
    };
    LongPressDirective.prototype.endPress = function () {
        clearTimeout(this.timeout);
        this.isLongPressing = false;
        this.pressing = false;
        this._destroySubscription();
        this.longPressEnd.emit(true);
    };
    LongPressDirective.prototype.onMouseup = function () {
        this.endPress();
    };
    LongPressDirective.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this._destroySubscription();
        }
    };
    LongPressDirective.prototype._destroySubscription = function () {
        this.subscription.unsubscribe();
        this.subscription = undefined;
    };
    LongPressDirective.decorators = [
        { type: core_1.Directive, args: [{ selector: '[long-press]' },] },
    ];
    /** @nocollapse */
    LongPressDirective.ctorParameters = function () { return []; };
    LongPressDirective.propDecorators = {
        'duration': [{ type: core_1.Input },],
        'longPress': [{ type: core_1.Output },],
        'longPressing': [{ type: core_1.Output },],
        'longPressEnd': [{ type: core_1.Output },],
        'press': [{ type: core_1.HostBinding, args: ['class.press',] },],
        'isLongPress': [{ type: core_1.HostBinding, args: ['class.longpress',] },],
        'onMouseDown': [{ type: core_1.HostListener, args: ['mousedown', ['$event'],] },],
    };
    return LongPressDirective;
}());
exports.LongPressDirective = LongPressDirective;
//# sourceMappingURL=long-press.directive.js.map