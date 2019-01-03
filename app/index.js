import Modeler from 'bpmn-js/lib/Modeler';

import sampleProcess from '../resources/sample.bpmn';

import emojiPackage from '../resources/emoji';

import {
  EmojiContextPadProvider,
  EmojiPaletteProvider,
  EmojiRenderer
} from './modules';

import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

var HIGH_PRIORITY = 100000;

var modeler = new Modeler({
  container: '#canvas',
  additionalModules: [
    {
      __init__: [ 'contextPadProvider', 'emojiRenderer', 'paletteProvider' ],
      contextPadProvider: [ 'type', EmojiContextPadProvider ],
      emojiRenderer: [ 'type', EmojiRenderer ],
      paletteProvider: [ 'type', EmojiPaletteProvider ]
    }
  ],
  moddleExtensions: {
    emoji: emojiPackage
  }
});

modeler.importXML(sampleProcess);

window.modeler = modeler;

var moddle = modeler.get('moddle'),
    modeling = modeler.get('modeling');

var emojis = document.getElementById('emojis');

var element;

modeler.on('element.contextmenu', HIGH_PRIORITY, function(event) {
  element = event.element;

  var businessObject = getBusinessObject(element);

  if (!businessObject.emoji) {
    return;
  }

  event.originalEvent.preventDefault();
  event.originalEvent.stopPropagation();

  emojis.classList.remove('hidden');

  return true;
});

window.addEventListener('click', function(event) {
  var target = event.target;

  if (target !== emojis && !emojis.contains(target)) {
    emojis.classList.add('hidden');
  }
});

var buttons = Array.prototype.slice.call(emojis.querySelectorAll('button'));

buttons.forEach(function(button) {
  var emoji = button.textContent;

  button.addEventListener('click', function() {
    if (!element) {
      return;
    }

    modeling.updateProperties(element, {
      emoji: emoji
    });

    emojis.classList.add('hidden');
  });
});