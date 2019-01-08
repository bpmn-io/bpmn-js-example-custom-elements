import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

var TASK_BORDER_RADIUS = 10;


export default function EmojiRenderer(eventBus) {
  BaseRenderer.call(this, eventBus, 2000);
}

inherits(EmojiRenderer, BaseRenderer);

EmojiRenderer.$inject = [ 'eventBus', 'styles' ];


EmojiRenderer.prototype.canRender = function(element) {
  if (!is(element, 'bpmn:Task')) {
    return;
  }

  var businessObject = getBusinessObject(element);

  return businessObject.emoji;
};

EmojiRenderer.prototype.drawShape = function(parentNode, element) {
  var businessObject = element.businessObject,
      emoji = businessObject.emoji;

  var width = element.width,
      height = element.height;

  var rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS);

  svgAppend(parentNode, rect);

  var text = svgCreate('text');

  svgAttr(text, {
    x: 10,
    y: 25
  });

  svgClasses(text).add('djs-label');

  svgAppend(text, document.createTextNode(emoji));

  svgAppend(parentNode, text);

  return rect;
};

EmojiRenderer.prototype.getShapePath = function(shape) {
  return getRoundRectPath(shape, TASK_BORDER_RADIUS);
};

function drawRect(parentNode, width, height, borderRadius) {
  var rect = svgCreate('rect');

  svgAttr(rect, {
    x: 0,
    y: 0,
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: 'black',
    strokeWidth: 2,
    fill: '#FFC83D'
  });

  svgAppend(parentNode, rect);

  return rect;
}