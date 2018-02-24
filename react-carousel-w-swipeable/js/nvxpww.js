'use strict';

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/* global document */
// var React = require('react');
// var PropTypes = require('prop-types');

function getInitialState() {
  return {
    x: null,
    y: null,
    swiping: false,
    start: 0
  };
}

function getMovingPosition(e) {
  // If not a touch, determine point from mouse coordinates
  return 'changedTouches' in e ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY };
}
function getPosition(e) {
  // If not a touch, determine point from mouse coordinates
  return 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
}

function calculatePos(e, state) {
  var _getMovingPosition = getMovingPosition(e),
      x = _getMovingPosition.x,
      y = _getMovingPosition.y;

  var deltaX = state.x - x;
  var deltaY = state.y - y;

  var absX = Math.abs(deltaX);
  var absY = Math.abs(deltaY);

  var time = Date.now() - state.start;
  var velocity = Math.sqrt(absX * absX + absY * absY) / time;

  return { deltaX: deltaX, deltaY: deltaY, absX: absX, absY: absY, velocity: velocity };
}

var Swipeable = function (_React$Component) {
  _inherits(Swipeable, _React$Component);

  function Swipeable(props, context) {
    _classCallCheck(this, Swipeable);

    var _this = _possibleConstructorReturn(this, (Swipeable.__proto__ || Object.getPrototypeOf(Swipeable)).call(this, props, context));

    _this.eventStart = _this.eventStart.bind(_this);
    _this.eventMove = _this.eventMove.bind(_this);
    _this.eventEnd = _this.eventEnd.bind(_this);
    _this.mouseDown = _this.mouseDown.bind(_this);
    _this.mouseMove = _this.mouseMove.bind(_this);
    _this.mouseUp = _this.mouseUp.bind(_this);
    _this.cleanupMouseListeners = _this.cleanupMouseListeners.bind(_this);
    _this.setupMouseListeners = _this.setupMouseListeners.bind(_this);
    return _this;
  }

  _createClass(Swipeable, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // setup internal swipeable state
      this.swipeable = getInitialState();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // swipeable toggled either on/off, so stop tracking swipes and clean up
      if (prevProps.disabled !== this.props.disabled) {
        this.cleanupMouseListeners();
        // reset internal swipeable state
        this.swipeable = getInitialState();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.cleanupMouseListeners();
    }
  }, {
    key: 'setupMouseListeners',
    value: function setupMouseListeners() {
      document.addEventListener('mousemove', this.mouseMove);
      document.addEventListener('mouseup', this.mouseUp);
    }
  }, {
    key: 'cleanupMouseListeners',
    value: function cleanupMouseListeners() {
      // safe to call, if no match is found has no effect
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mouseup', this.mouseUp);
    }
  }, {
    key: 'mouseDown',
    value: function mouseDown(e) {
      if (!this.props.trackMouse || e.type !== 'mousedown') {
        return;
      }
      // allow 'orig' props.onMouseDown to fire also
      // eslint-disable-next-line react/prop-types
      if (typeof this.props.onMouseDown === 'function') this.props.onMouseDown(e);

      // setup document listeners to track mouse movement outside <Swipeable>'s area
      this.setupMouseListeners();

      this.eventStart(e);
    }
  }, {
    key: 'mouseMove',
    value: function mouseMove(e) {
      this.eventMove(e);
    }
  }, {
    key: 'mouseUp',
    value: function mouseUp(e) {
      this.cleanupMouseListeners();
      this.eventEnd(e);
    }
  }, {
    key: 'eventStart',
    value: function eventStart(e) {
      // if more than a single touch don't track, for now...
      if (e.touches && e.touches.length > 1) return;

      var _getPosition = getPosition(e),
          x = _getPosition.x,
          y = _getPosition.y;

      if (this.props.stopPropagation) e.stopPropagation();

      this.swipeable = { start: Date.now(), x: x, y: y, swiping: false };
    }
  }, {
    key: 'eventMove',
    value: function eventMove(e) {
      var _props = this.props,
          stopPropagation = _props.stopPropagation,
          delta = _props.delta,
          onSwiping = _props.onSwiping,
          onSwipingLeft = _props.onSwipingLeft,
          onSwipedLeft = _props.onSwipedLeft,
          onSwipingRight = _props.onSwipingRight,
          onSwipedRight = _props.onSwipedRight,
          onSwipingUp = _props.onSwipingUp,
          onSwipedUp = _props.onSwipedUp,
          onSwipingDown = _props.onSwipingDown,
          onSwipedDown = _props.onSwipedDown,
          preventDefaultTouchmoveEvent = _props.preventDefaultTouchmoveEvent;


      if (!this.swipeable.x || !this.swipeable.y || e.touches && e.touches.length > 1) {
        return;
      }

      var pos = calculatePos(e, this.swipeable);

      // if swipe is under delta and we have not already started to track a swipe: return
      if (pos.absX < delta && pos.absY < delta && !this.swipeable.swiping) return;

      if (stopPropagation) e.stopPropagation();

      if (onSwiping) {
        onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY, pos.velocity);
      }

      var cancelablePageSwipe = false;
      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          if (onSwipingLeft || onSwipedLeft) {
            onSwipingLeft && onSwipingLeft(e, pos.absX);
            cancelablePageSwipe = true;
          }
        } else if (onSwipingRight || onSwipedRight) {
          onSwipingRight && onSwipingRight(e, pos.absX);
          cancelablePageSwipe = true;
        }
      } else if (pos.deltaY > 0) {
        if (onSwipingUp || onSwipedUp) {
          onSwipingUp && onSwipingUp(e, pos.absY);
          cancelablePageSwipe = true;
        }
      } else if (onSwipingDown || onSwipedDown) {
        onSwipingDown && onSwipingDown(e, pos.absY);
        cancelablePageSwipe = true;
      }

      this.swipeable.swiping = true;

      if (cancelablePageSwipe && preventDefaultTouchmoveEvent) e.preventDefault();
    }
  }, {
    key: 'eventEnd',
    value: function eventEnd(e) {
      var _props2 = this.props,
          stopPropagation = _props2.stopPropagation,
          flickThreshold = _props2.flickThreshold,
          onSwiped = _props2.onSwiped,
          onSwipedLeft = _props2.onSwipedLeft,
          onSwipedRight = _props2.onSwipedRight,
          onSwipedUp = _props2.onSwipedUp,
          onSwipedDown = _props2.onSwipedDown,
          onTap = _props2.onTap;


      if (this.swipeable.swiping) {
        var pos = calculatePos(e, this.swipeable);

        if (stopPropagation) e.stopPropagation();

        var isFlick = pos.velocity > flickThreshold;

        onSwiped && onSwiped(e, pos.deltaX, pos.deltaY, isFlick, pos.velocity);

        if (pos.absX > pos.absY) {
          if (pos.deltaX > 0) {
            onSwipedLeft && onSwipedLeft(e, pos.deltaX, isFlick);
          } else {
            onSwipedRight && onSwipedRight(e, pos.deltaX, isFlick);
          }
        } else if (pos.deltaY > 0) {
          onSwipedUp && onSwipedUp(e, pos.deltaY, isFlick);
        } else {
          onSwipedDown && onSwipedDown(e, pos.deltaY, isFlick);
        }
      } else {
        onTap && onTap(e);
      }

      // finished swipe tracking, reset swipeable state
      this.swipeable = getInitialState();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          disabled = _props3.disabled,
          innerRef = _props3.innerRef;

      var newProps = _extends({}, this.props);
      if (!disabled) {
        newProps.onTouchStart = this.eventStart;
        newProps.onTouchMove = this.eventMove;
        newProps.onTouchEnd = this.eventEnd;
        newProps.onMouseDown = this.mouseDown;
      }
      if (innerRef) {
        newProps.ref = innerRef;
      }

      // clean up swipeable's props to avoid react warning
      delete newProps.onSwiped;
      delete newProps.onSwiping;
      delete newProps.onSwipingUp;
      delete newProps.onSwipingRight;
      delete newProps.onSwipingDown;
      delete newProps.onSwipingLeft;
      delete newProps.onSwipedUp;
      delete newProps.onSwipedRight;
      delete newProps.onSwipedDown;
      delete newProps.onSwipedLeft;
      delete newProps.onTap;
      delete newProps.flickThreshold;
      delete newProps.delta;
      delete newProps.preventDefaultTouchmoveEvent;
      delete newProps.stopPropagation;
      delete newProps.nodeName;
      delete newProps.children;
      delete newProps.trackMouse;
      delete newProps.disabled;
      delete newProps.innerRef;

      return React.createElement(this.props.nodeName, newProps, this.props.children);
    }
  }]);

  return Swipeable;
}(React.Component);

Swipeable.defaultProps = {
  flickThreshold: 0.6,
  delta: 10,
  preventDefaultTouchmoveEvent: false,
  stopPropagation: false,
  nodeName: 'div',
  disabled: false
};

window.Swipeable = Swipeable;
