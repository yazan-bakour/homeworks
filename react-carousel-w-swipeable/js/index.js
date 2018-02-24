'use strict';

var IMG_1 = "https://picsum.photos/g/342/300";
var IMG_2 = "https://picsum.photos/g/342/301";
var IMG_3 = "https://picsum.photos/g/342/302";
var IMG_4 = "https://picsum.photos/g/342/303";
var IMG_5 = "https://picsum.photos/g/342/304";
var IMAGES = [IMG_1, IMG_2, IMG_3, IMG_4, IMG_5];
var IMG_WIDTH = "342px";
var IMG_HEIGHT = "249px";

var RIGHT = '-1';
var LEFT = '+1';

var buttonStyles = {
  height: IMG_HEIGHT,
  color: "#eeeeee",
  fontSize: "2em"
};

var SimpleCarousel = function (_React$Component) {
  _inherits(SimpleCarousel, _React$Component);
// Creating an variable to return the correct properties inside two objects need to be use
  function SimpleCarousel(props, context) {
    _classCallCheck(this, SimpleCarousel);

    var _this = _possibleConstructorReturn(this, (SimpleCarousel.__proto__ || Object.getPrototypeOf(SimpleCarousel)).call(this, props, context));

    _this.state = { imageIdx: 0 };
    return _this;
  }

// Creating a value for swipe function by creating variables inside class to support the state of every element inside the carousel and to swipe continuously with one direction
  _createClass(SimpleCarousel, [{
    key: "onSwiped",
    value: function onSwiped(direction) {
      var change = direction === RIGHT ? RIGHT : LEFT;
      var adjustedIdx = this.state.imageIdx + Number(change);
      var newIdx = void 0;
      if (adjustedIdx >= IMAGES.length) {
        newIdx = 0;
      } else if (adjustedIdx < 0) {
        newIdx = IMAGES.length - 1;
      } else {
        newIdx = adjustedIdx;
      }
      this.setState({ imageIdx: newIdx });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
// Creating function to render the image index and to check whether undefined to return 0
      var _state$imageIdx = this.state.imageIdx,
          imageIdx = _state$imageIdx === undefined ? 0 : _state$imageIdx;

      var imageStyles = {
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        backgroundImage: "url(" + IMAGES[imageIdx] + ")"
      };
      // Creating the html elements for the carousel
      return React.createElement(
        "div",
        { className: "swipeContainer" },
        React.createElement(
          "div",
          null,
          "Image: ",
          imageIdx + 1
        ),
      // Swipe is class name for the carousel container and using react events true
        React.createElement(
          Swipeable,
          {
            className: "swipe",
            trackMouse: true,
            style: { touchAction: 'none' },
            preventDefaultTouchmoveEvent: true,
            onSwipedLeft: function onSwipedLeft() {
              return _this2.onSwiped(LEFT);
            },
            onSwipedRight: function onSwipedRight() {
              return _this2.onSwiped(RIGHT);
            }
          },
          React.createElement(
            "div",
            { style: imageStyles },
            React.createElement(
              "button",
              {
                onClick: function onClick() {
                  return _this2.onSwiped(RIGHT);
                },
                className: "hollow float-left",
                style: buttonStyles },
              "\u21E6"
            ),
            React.createElement(
              "button",
              {
                onClick: function onClick() {
                  return _this2.onSwiped(LEFT);
                },
                className: "hollow float-right",
                style: buttonStyles },
              "\u21E8"
            )
          )
        )
      );
    }
  }]);

  return SimpleCarousel;
}(React.Component);

// Embed the scrpt inside the div "nainApp"
ReactDOM.render(React.createElement(SimpleCarousel, null), document.getElementById("mainApp"));
