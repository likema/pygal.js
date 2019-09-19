"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  // vim: set ts=2 sw=2 sts=2 et:
  var $, get_translation, init, init_svg, matches, padding, r_translation, sibl, svg_ns, tooltip_timeout, xlink_ns;
  svg_ns = 'http://www.w3.org/2000/svg';
  xlink_ns = 'http://www.w3.org/1999/xlink';

  $ = function $(sel) {
    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    ctx = ctx || document;
    return Array.prototype.slice.call(ctx.querySelectorAll(sel), 0).filter(function (e) {
      return e !== ctx;
    });
  };

  matches = function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  };

  sibl = function sibl(el) {
    var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return Array.prototype.filter.call(el.parentElement.children, function (child) {
      return child !== el && (!match || matches(child, match));
    });
  };

  Array.prototype.one = function () {
    return this.length > 0 && this[0] || {};
  };

  padding = 5;
  tooltip_timeout = null;
  r_translation = /translate\((\d+)[ ,]+(\d+)\)/;

  get_translation = function get_translation(el) {
    return (r_translation.exec(el.getAttribute('transform')) || []).slice(1).map(function (x) {
      return +x;
    });
  };

  init = function init(ctx) {
    var bbox, box, config, el, graph, inner_svg, j, k, l, len, len1, len2, num, parent, ref, ref1, ref2, ref3, tooltip, tooltip_el, tt, uid, untooltip, xconvert, yconvert;

    if ($('svg', ctx).length) {
      inner_svg = $('svg', ctx).one();
      parent = inner_svg.parentElement;
      box = inner_svg.viewBox.baseVal;
      bbox = parent.getBBox();

      xconvert = function xconvert(x) {
        return (x - box.x) / box.width * bbox.width;
      };

      yconvert = function yconvert(y) {
        return (y - box.y) / box.height * bbox.height;
      };
    } else {
      xconvert = yconvert = function yconvert(x) {
        return x;
      };
    }

    if (((ref = window.pygal) != null ? ref.config : void 0) != null) {
      // Check if config is in config
      if (window.pygal.config.no_prefix != null) {
        // no_prefix
        config = window.pygal.config;
      } else {
        uid = ctx.id.replace('chart-', '');
        config = window.pygal.config[uid];
      }
    } else {
      // Compat
      config = window.config;
    }

    tooltip_el = null;
    graph = $('.graph').one();
    tt = $('.tooltip', ctx).one();
    ref1 = $('.reactive', ctx);

    for (j = 0, len = ref1.length; j < len; j++) {
      el = ref1[j];
      el.addEventListener('mouseenter', function (el) {
        return function () {
          return el.classList.add('active');
        };
      }(el));
      el.addEventListener('mouseleave', function (el) {
        return function () {
          return el.classList.remove('active');
        };
      }(el));
    }

    ref2 = $('.activate-serie', ctx);

    for (k = 0, len1 = ref2.length; k < len1; k++) {
      el = ref2[k];
      num = el.id.replace('activate-serie-', '');
      el.addEventListener('mouseenter', function (num) {
        return function () {
          var l, len2, len3, m, re, ref3, ref4, results;
          ref3 = $('.serie-' + num + ' .reactive', ctx);

          for (l = 0, len2 = ref3.length; l < len2; l++) {
            re = ref3[l];
            re.classList.add('active');
          }

          ref4 = $('.serie-' + num + ' .showable', ctx);
          results = [];

          for (m = 0, len3 = ref4.length; m < len3; m++) {
            re = ref4[m];
            results.push(re.classList.add('shown'));
          }

          return results;
        };
      }(num));
      el.addEventListener('mouseleave', function (num) {
        return function () {
          var l, len2, len3, m, re, ref3, ref4, results;
          ref3 = $('.serie-' + num + ' .reactive', ctx);

          for (l = 0, len2 = ref3.length; l < len2; l++) {
            re = ref3[l];
            re.classList.remove('active');
          }

          ref4 = $('.serie-' + num + ' .showable', ctx);
          results = [];

          for (m = 0, len3 = ref4.length; m < len3; m++) {
            re = ref4[m];
            results.push(re.classList.remove('shown'));
          }

          return results;
        };
      }(num));
      el.addEventListener('click', function (el, num) {
        return function () {
          var l, len2, len3, m, ov, re, rect, ref3, ref4, results, show;
          rect = $('rect', el)[0] || $('circle', el)[0];
          show = rect.style.fill !== '';
          rect.style.fill = show ? '' : 'transparent';
          ref3 = $('.serie-' + num + ' .reactive', ctx);

          for (l = 0, len2 = ref3.length; l < len2; l++) {
            re = ref3[l];
            re.style.display = show ? '' : 'none';
          }

          ref4 = $('.text-overlay .serie-' + num, ctx);
          results = [];

          for (m = 0, len3 = ref4.length; m < len3; m++) {
            ov = ref4[m];
            results.push(ov.style.display = show ? '' : 'none');
          }

          return results;
        };
      }(el, num));
    }

    ref3 = $('.tooltip-trigger', ctx);

    for (l = 0, len2 = ref3.length; l < len2; l++) {
      el = ref3[l];
      el.addEventListener('mouseenter', function (el) {
        return function () {
          return tooltip_el = tooltip(el);
        };
      }(el));
    }

    tt.addEventListener('mouseenter', function () {
      return tooltip_el != null ? tooltip_el.classList.add('active') : void 0;
    });
    tt.addEventListener('mouseleave', function () {
      return tooltip_el != null ? tooltip_el.classList.remove('active') : void 0;
    });
    ctx.addEventListener('mouseleave', function () {
      if (tooltip_timeout) {
        clearTimeout(tooltip_timeout);
      }

      return untooltip(0);
    });
    graph.addEventListener('mousemove', function (el) {
      if (tooltip_timeout) {
        return;
      }

      if (!matches(el.target, '.background')) {
        return;
      }

      return untooltip(1000);
    });

    tooltip = function tooltip(el) {
      var a, baseline, cls, current_x, current_y, dy, h, i, key, keys, label, legend, len3, len4, len5, m, n, name, o, plot_x, plot_y, rect, ref4, ref5, serie_index, subval, text, text_group, texts, traversal, value, w, x, x_elt, x_label, xlink, y, y_elt;
      clearTimeout(tooltip_timeout);
      tooltip_timeout = null;
      tt.style.opacity = 1;
      tt.style.display = '';
      text_group = $('g.text', tt).one();
      rect = $('rect', tt).one();
      text_group.innerHTML = '';
      label = sibl(el, '.label').one().textContent;
      x_label = sibl(el, '.x_label').one().textContent;
      value = sibl(el, '.value').one().textContent;
      xlink = sibl(el, '.xlink').one().textContent;
      serie_index = null;
      parent = el;
      traversal = [];

      while (parent) {
        traversal.push(parent);

        if (parent.classList.contains('series')) {
          break;
        }

        parent = parent.parentElement;
      }

      if (parent) {
        ref4 = parent.classList;

        for (m = 0, len3 = ref4.length; m < len3; m++) {
          cls = ref4[m];

          if (cls.indexOf('serie-') === 0) {
            serie_index = +cls.replace('serie-', '');
            break;
          }
        }
      }

      legend = null;

      if (serie_index !== null) {
        legend = config.legends[serie_index];
      } // text creation and vertical positionning


      dy = 0;
      keys = [[label, 'label']];
      ref5 = value.split('\n');

      for (i = n = 0, len4 = ref5.length; n < len4; i = ++n) {
        subval = ref5[i];
        keys.push([subval, 'value-' + i]);
      }

      if (config.tooltip_fancy_mode) {
        keys.push([xlink, 'xlink']);
        keys.unshift([x_label, 'x_label']);
        keys.unshift([legend, 'legend']);
      }

      texts = {};

      for (o = 0, len5 = keys.length; o < len5; o++) {
        var _keys$o = _slicedToArray(keys[o], 2);

        key = _keys$o[0];
        name = _keys$o[1];

        if (key) {
          text = document.createElementNS(svg_ns, 'text');
          text.textContent = key;
          text.setAttribute('x', padding);
          text.setAttribute('dy', dy);
          text.classList.add(name.indexOf('value') === 0 ? 'value' : name);

          if (name.indexOf('value') === 0 && config.tooltip_fancy_mode) {
            text.classList.add('color-' + serie_index);
          }

          if (name === 'xlink') {
            a = document.createElementNS(svg_ns, 'a');
            a.setAttributeNS(xlink_ns, 'href', key);
            a.textContent = void 0;
            a.appendChild(text);
            text.textContent = 'Link >';
            text_group.appendChild(a);
          } else {
            text_group.appendChild(text);
          }

          dy += text.getBBox().height + padding / 2;
          baseline = padding;

          if (text.style.dominantBaseline !== void 0) {
            text.style.dominantBaseline = 'text-before-edge';
          } else {
            baseline += text.getBBox().height * .8;
          }

          text.setAttribute('y', baseline);
          texts[name] = text;
        }
      } // Tooltip sizing


      w = text_group.getBBox().width + 2 * padding;
      h = text_group.getBBox().height + 2 * padding;
      rect.setAttribute('width', w);
      rect.setAttribute('height', h); // Tspan horizontal processing

      if (texts.value) {
        texts.value.setAttribute('dx', (w - texts.value.getBBox().width) / 2 - padding);
      }

      if (texts.x_label) {
        texts.x_label.setAttribute('dx', w - texts.x_label.getBBox().width - 2 * padding);
      }

      if (texts.xlink) {
        texts.xlink.setAttribute('dx', w - texts.xlink.getBBox().width - 2 * padding);
      }

      x_elt = sibl(el, '.x').one();
      y_elt = sibl(el, '.y').one();
      x = parseInt(x_elt.textContent);

      if (x_elt.classList.contains('centered')) {
        x -= w / 2;
      } else if (x_elt.classList.contains('left')) {
        x -= w;
      } else if (x_elt.classList.contains('auto')) {
        x = xconvert(el.getBBox().x + el.getBBox().width / 2) - w / 2;
      }

      y = parseInt(y_elt.textContent);

      if (y_elt.classList.contains('centered')) {
        y -= h / 2;
      } else if (y_elt.classList.contains('top')) {
        y -= h;
      } else if (y_elt.classList.contains('auto')) {
        y = yconvert(el.getBBox().y + el.getBBox().height / 2) - h / 2;
      }

      var _get_translation = get_translation(tt.parentElement);

      var _get_translation2 = _slicedToArray(_get_translation, 2);

      plot_x = _get_translation2[0];
      plot_y = _get_translation2[1];

      // Constraint tooltip in chart
      if (x + w + plot_x > config.width) {
        x = config.width - w - plot_x;
      }

      if (y + h + plot_y > config.height) {
        y = config.height - h - plot_y;
      }

      if (x + plot_x < 0) {
        x = -plot_x;
      }

      if (y + plot_y < 0) {
        y = -plot_y;
      }

      var _get_translation3 = get_translation(tt);

      var _get_translation4 = _slicedToArray(_get_translation3, 2);

      current_x = _get_translation4[0];
      current_y = _get_translation4[1];

      if (current_x === x && current_y === y) {
        return el;
      }

      tt.setAttribute('transform', "translate(".concat(x, " ").concat(y, ")"));
      return el;
    };

    return untooltip = function untooltip(ms) {
      return tooltip_timeout = setTimeout(function () {
        tt.style.display = 'none';
        tt.style.opacity = 0;

        if (tooltip_el != null) {
          tooltip_el.classList.remove('active');
        }

        return tooltip_timeout = null;
      }, ms);
    };
  };

  init_svg = function init_svg() {
    var chart, charts, j, len, results;
    charts = $('.pygal-chart');

    if (charts.length) {
      results = [];

      for (j = 0, len = charts.length; j < len; j++) {
        chart = charts[j];
        results.push(init(chart));
      }

      return results;
    }
  };

  if (document.readyState !== 'loading') {
    init_svg();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      return init_svg();
    });
  }

  window.pygal = window.pygal || {};
  window.pygal.init = init;
  window.pygal.init_svg = init_svg;
}).call(void 0);
