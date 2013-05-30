/** Notify.js - v0.0.1 - 2013/05/30
 * http://notifyjs.com/
 * Copyright (c) 2013 Jaime Pillora - MIT
 */
(function(window,document,undefined) {
'use strict';

var Notification, className, cornerElem, createElem, getAnchorElement, incr, inherit, insertCSS, opposites, parsePosition, pluginName, pluginOptions, positions, styles;

pluginName = 'notify';

className = '__' + pluginName;

positions = {
  t: 'top',
  m: 'middle',
  b: 'bottom',
  l: 'left',
  c: 'center',
  r: 'right'
};

opposites = {
  t: 'b',
  m: null,
  b: 't',
  l: 'r',
  c: null,
  r: 'l'
};

parsePosition = function(str) {
  var pos;
  pos = [];
  $.each(str.split(/\W+/), function(i, word) {
    var w;
    w = word.toLowerCase().charAt(0);
    if (positions[w]) {
      return pos.push(w);
    }
  });
  return pos;
};

styles = {
  core: {
    html: "<div class=\"" + className + "Wrapper\">\n  <div class=\"" + className + "Arrow\"></div>\n  <div class=\"" + className + "Container\"></div>\n</div>",
    css: "." + className + "Corner {\n  position: fixed;\n  top: 0;\n  right: 0;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + className + "Corner ." + className + "Wrapper,\n." + className + "Corner ." + className + "Container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n}\n\n." + className + "Wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n  border: thin solid red;\n}\n\n." + className + "Container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n  cursor: pointer;\n}\n\n." + className + "Text {\n  position: relative;\n}\n\n." + className + "Arrow {\n  margin-top: 2px;\n  position: absolute;\n  z-index: 2;\n  margin-left: 10px;\n  width: 0;\n  height: 0;\n}\n"
  },
  user: {
    "default": {
      html: "<div class=\"" + className + "Default\" \n     data-notify-style=\"\n      color: {{color}}; \n      border-color: {{color}};\n     \">\n   <span data-notify-text></span>\n </div>",
      css: "." + className + "Default {\n  background: #fff;\n  font-size: 11px;\n  box-shadow: 0 0 6px #000;\n  -moz-box-shadow: 0 0 6px #000;\n  -webkit-box-shadow: 0 0 6px #000;\n  padding: 4px 10px 4px 8px;\n  border-radius: 6px;\n  border-style: solid;\n  border-width: 2px;\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  white-space: nowrap;\n}"
    },
    bootstrap: {
      html: "<div class=\"alert alert-error " + className + "Bootstrap\">\n  <strong data-notify-text></strong>\n</div>",
      css: "." + className + "Bootstrap {\n  white-space: nowrap;\n  margin: 5px !important;\n  padding-left: 25px !important;\n  background-repeat: no-repeat;\n  background-position: 3px 7px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=);\n}",
      colors: {
        red: '#eed3d7'
      }
    }
  }
};

pluginOptions = {
  autoHide: false,
  autoHideDelay: 2000,
  arrowShow: false,
  arrowSize: 5,
  position: 'bottom',
  style: 'default',
  color: 'red',
  colors: {
    red: '#b94a48',
    green: '#33be40',
    black: '#393939',
    blue: '#00f'
  },
  showAnimation: 'slideDown',
  showDuration: 400,
  hideAnimation: 'slideUp',
  hideDuration: 200,
  offsetY: 2,
  offsetX: 0
};

createElem = function(tag) {
  return $("<" + tag + "></" + tag + ">");
};

inherit = function(a, b) {
  var F;
  F = function() {};
  F.prototype = a;
  return $.extend(true, new F(), b);
};

cornerElem = createElem("div").addClass("" + className + "Corner");

getAnchorElement = function(element) {
  var radios;
  if (element.is('[type=radio]')) {
    radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
      return $(e).attr('name') === element.attr('name');
    });
    element = radios.first();
  }
  return element;
};

incr = function(obj, pos, val, useOpposite) {
  var opp, temp;
  if (useOpposite == null) {
    useOpposite = true;
  }
  if (typeof val === 'string') {
    val = parseInt(val, 10);
  } else if (typeof val !== 'number') {
    return;
  }
  if (isNaN(val)) {
    return;
  }
  opp = positions[opposites[pos.charAt(0)]];
  temp = pos;
  if (obj[opp] !== undefined) {
    if (!useOpposite) {
      return;
    }
    pos = positions[opp.charAt(0)];
    val *= -1;
  }
  if (obj[pos] === undefined) {
    obj[pos] = val;
  } else {
    obj[pos] += val;
  }
  console.log("incr (" + opp + ">>" + temp + ") " + pos + " by " + val);
  return null;
};

insertCSS = function(style) {
  var elem;
  if (!(style && style.css)) {
    return;
  }
  elem = style.cssElem;
  if (elem) {
    return;
  }
  elem = createElem("style");
  $("head").append(elem);
  style.cssElem = elem;
  try {
    return elem.html(style.css);
  } catch (e) {
    return elem[0].styleSheet.cssText = style.css;
  }
};

Notification = (function() {

  function Notification(elem, data, options) {
    if (typeof options === 'string') {
      options = {
        color: options
      };
    }
    this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
    this.loadCSS();
    this.loadHTML();
    this.wrapper = $(styles.core.html);
    this.wrapper.data(className, this);
    this.arrow = this.wrapper.find("." + className + "Arrow");
    this.container = this.wrapper.find("." + className + "Container");
    this.container.append(this.userContainer);
    if (elem && elem.length) {
      this.elementType = elem.attr('type');
      this.originalElement = elem;
      this.elem = getAnchorElement(elem);
      this.elem.data(className, this);
      this.elem.before(this.wrapper);
    } else {
      this.options.arrowShow = false;
      cornerElem.prepend(this.wrapper);
    }
    this.container.hide();
    this.run(data);
  }

  Notification.prototype.loadCSS = function(style) {
    var name;
    if (!style) {
      name = this.options.style;
      style = this.getStyle(name);
    }
    return insertCSS(style);
  };

  Notification.prototype.loadHTML = function() {
    var style;
    style = this.getStyle();
    this.userContainer = $(style.html);
    this.text = this.userContainer.find('[data-notify-text]');
    if (this.text.length === 0) {
      throw "style: " + name + " HTML is missing the: 'data-notify-text' attribute";
    }
    return this.text.addClass("" + className + "Text");
  };

  Notification.prototype.show = function(show, callback) {
    var args, elems, fn, hidden;
    if (callback == null) {
      callback = $.noop;
    }
    hidden = this.container.parent().parents(':hidden').length > 0;
    elems = this.container.add(this.arrow);
    args = [];
    if (hidden && show) {
      fn = 'show';
    } else if (hidden && !show) {
      fn = 'hide';
    } else if (!hidden && show) {
      fn = this.options.showAnimation;
      args.push(this.options.showDuration);
    } else if (!hidden && !show) {
      fn = this.options.hideAnimation;
      args.push(this.options.hideDuration);
    }
    args.push(callback);
    return elems[fn].apply(elems, args);
  };

  Notification.prototype.updatePosition = function() {
    var elementPosition, p, position, wrapperPosition;
    if (!this.elem) {
      return;
    }
    elementPosition = this.elem.position();
    wrapperPosition = this.wrapper.position();
    position = this.getPosition();
    console.log(this.elem[0]);
    console.log("update position", position, " elem ", elementPosition, " main ", wrapperPosition);
    p = {};
    switch (position[0]) {
      case 'b':
        incr(p, 'top', this.elem.outerHeight());
        break;
      case 't':
        incr(p, 'bottom', 0);
        break;
      case 'l':
        incr(p, 'right', 0);
        break;
      case 'r':
        incr(p, 'left', this.elem.outerWidth());
        break;
      default:
        throw "Unknown position: " + position;
    }
    if (!navigator.userAgent.match(/MSIE/)) {
      incr(p, 'top', elementPosition.top - wrapperPosition.top);
    }
    incr(p, 'left', elementPosition.left - wrapperPosition.left);
    return this.container.css(p);
  };

  Notification.prototype.updateArrow = function(p, position) {
    var d, dir, size;
    if (!(this.options.arrowShow && this.elementType !== 'radio')) {
      this.arrow.hide();
      return;
    }
    dir = arrowDirs[position];
    size = this.options.arrowSize;
    this.arrow.css('border-' + position, size + 'px solid ' + this.getColor());
    this.arrow.css(p);
    for (d in arrowDirs) {
      if (d !== dir && d !== position) {
        this.arrow.css('border-' + d, size + 'px solid transparent');
      }
    }
    switch (position) {
      case 'bottom':
        p.top += size;
        break;
      case 'right':
        p.left += size;
    }
    return this.arrow.show();
  };

  Notification.prototype.getPosition = function() {
    var pos, text;
    text = this.options.position;
    pos = parsePosition(text);
    if (pos.length === 0) {
      pos.push('b');
    }
    if (pos.length === 1 && pos[0] === 'l' || pos[0] === 'r') {
      pos.push('m');
    }
    if (pos.length === 1) {
      pos.push('l');
    }
    if (!this.options.autoReposition) {
      return pos;
    }
    throw "Not implemented";
  };

  Notification.prototype.getColor = function() {
    var styleColors;
    styleColors = this.getStyle().colors;
    return (styleColors && styleColors[this.options.color]) || this.options.colors[this.options.color] || this.options.color;
  };

  Notification.prototype.getStyle = function(name) {
    var style;
    if (!name) {
      name = this.options.style;
    }
    if (!name) {
      name = 'default';
    }
    style = styles.user[name];
    if (!style) {
      throw "Missing style: " + name;
    }
    return style;
  };

  Notification.prototype.updateStyle = function() {
    var _this = this;
    return this.wrapper.find('[data-notify-style]').each(function(i, e) {
      return $(e).attr('style', $(e).attr('data-notify-style').replace(/\{\{\s*color\s*\}\}/ig, _this.getColor()));
    });
  };

  Notification.prototype.run = function(data, options) {
    var autohideTimer,
      _this = this;
    if ($.isPlainObject(options)) {
      $.extend(this.options, options);
    } else if ($.type(options) === 'string') {
      this.options.color = options;
    }
    if (this.container && !data) {
      this.show(false);
      return;
    } else if (!this.container && !data) {
      return;
    }
    if ($.type(data) === 'string') {
      this.text.html(data.replace('\n', '<br/>'));
    } else {
      this.text.empty().append(data);
    }
    this.updatePosition();
    this.show(true);
    if (this.options.autoHide) {
      clearTimeout(this.autohideTimer);
      return autohideTimer = setTimeout(function() {
        return _this.show(false);
      }, this.options.autoHideDelay);
    }
  };

  Notification.prototype.destroy = function() {
    var _this = this;
    return this.show(false, function() {
      return _this.wrapper.remove();
    });
  };

  return Notification;

})();

$(function() {
  $("body").append(cornerElem);
  $("link").each(function() {
    var bootstrapDetected, src;
    src = $(this).attr('href');
    if (src.match(/bootstrap/)) {
      bootstrapDetected = true;
      return false;
    }
  });
  insertCSS(styles.core);
  return $(document).on('click', "." + className + "Wrapper", function() {
    var inst;
    inst = $(this).data(className);
    if (!inst) {
      return;
    }
    if (inst.elem) {
      return inst.show(false);
    } else {
      return inst.destroy();
    }
  });
});

$[pluginName] = function(elem, data, options) {
  if ((elem && elem.nodeName) || elem.jquery) {
    $(elem)[pluginName](data, options);
  } else {
    options = data;
    data = elem;
    new Notification(null, data, options);
  }
  return elem;
};

$[pluginName].options = function(options) {
  return $.extend(pluginOptions, options);
};

$[pluginName].styles = function(s) {
  return $.extend(true, styles.user, s);
};

$[pluginName].insertCSS = insertCSS;

$.fn[pluginName] = function(data, options) {
  $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(className);
    if (inst) {
      return inst.run(data, options);
    } else {
      return new Notification($(this), data, options);
    }
  });
  return this;
};

}(window,document));