# Custom Elements in bpmn-js

An example of how to support custom elements in [bpmn-js](https://github.com/bpmn-io/bpmn-js) while ensuring BPMN 2.0 compatibility.

![Screencast](./resources/screencast.gif)

:notebook: We refer to _custom elements_ as elements with their own representation and data.


## About

This example covers the following topics:

* [Creating a BPMN model extension](#extending-the-bpmn-model)
* [Rendering a custom element](#rendering-the-element)
* [Extending the BPMN editor](#creating-editor-controls)


## Extending the BPMN Model

The custom element is actually a BPMN task with a custom attribute. The custom attribute is defined as a [moddle extension](https://github.com/bpmn-io/moddle) in [`resources/emoji.json`](./resources/emoji.json):

```javascript
{
  "name": "EmojiTask",
  "extends": [ "bpmn:Task" ],
  "properties": [
    {
      "name": "emoji",
      "isAttr": true,
      "type": "String"
    }
  ]
}
```

The XML of the custom element looks like this:

```xml
<bpmn:task id="Task_1" emojis:emoji="🤗" />
```

Still valid BPMN 2.0.

We could store more complex data inside the `<bpmn:extensionElements />` tag. To do this, we would define the emoji as an extension element:

```javascript
{
  "name": "Emoji",
  "superClass": [ "Element" ],
  "properties": [
    {
      "name": "emoji",
      "isBody": true,
      "type": "String"
    }
  ]
}
```

The XML would look like this:

```xml
<bpmn:task id="Task_1">
  <bpmn:extensionElements>
    <emojis:emoji>🤗</emojis:emoji>
  </bpmn:extensionElements>
</bpmn:task>
```


## Rendering the Element

In order to render the custom element an [additional renderer](./app/emoji/EmojiRenderer.js) is used. It knows which elements to render:

```javascript
EmojiRenderer.prototype.canRender = function(element) {
  if (!is(element, 'bpmn:Task')) {
    return;
  }

  var businessObject = getBusinessObject(element);

  return businessObject.emoji;
};
```

It also knows how to render them:

```javascript
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
```


## Creating Editor Controls

The custom element can be created like any other element, either via the palette or via the context pad. We override both to add a custom create control.

#### Palette

The [palette](./app/emoji/EmojiPaletteProvider.js) contains an additional entry for creating the custom element:

```javascript
  ...,

  'create.emojiTask': {
    group: 'activity',
    className: 'icon-emoji',
    title: translate('Create Emoji Task'),
    action: {
      dragstart: createEmojiTask,
      click: createEmojiTask
    }
  },

  ...
```

#### Context Pad

The [context pad](./app/emoji/EmojiContextPadProvider.js) contains an additional entry, too:

```javascript
{
  ...

  'append.append-emoji-task': {
    group: 'model',
    className: 'icon-emoji',
    title: translate('Append Emoji Task'),
    action: {
      dragstart: appendEmojiTaskStart,
      click: appendEmojiTask
    }
  },

  ...
```


## Run the Example

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

To install all project dependencies execute

```sh
npm install
```

To start the example execute

```sh
npm start
```

To build the example into the `public` folder execute

```sh
npm run all
```


## License

MIT
