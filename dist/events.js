"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionEvent = "completed";
exports.NodeSelectionEvent = "selectNode";
exports.EdgeSelectionEvent = "selectEdge";
exports.ClickEvent = "click";
exports.ClearEvent = "clearNetwork";
var EventController = /** @class */ (function () {
    function EventController() {
        var _a;
        this._handlers = (_a = {},
            _a[exports.CompletionEvent] = [],
            _a[exports.NodeSelectionEvent] = [],
            _a[exports.EdgeSelectionEvent] = [],
            _a[exports.ClickEvent] = [],
            _a);
    }
    /**
     *
     * @param {string} eventType Type of the event to be handled
     * @param {callback} handler Handler to manage the event
     */
    EventController.prototype.register = function (eventType, handler) {
        if (this._handlers[eventType] === undefined) {
            throw new Error("Unknown event: " + eventType);
        }
        this._handlers[eventType].push(handler);
    };
    /**
     *
     * @param {string} eventType Type of the event generated
     * @param {dictionary} value Values associated to the event
     */
    EventController.prototype.generateEvent = function (eventType, values) {
        if (this._handlers[eventType] === undefined) {
            throw new Error("Unknown event: " + eventType);
        }
        for (var _i = 0, _a = this._handlers[eventType]; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(values);
        }
    };
    return EventController;
}());
exports.EventController = EventController;
