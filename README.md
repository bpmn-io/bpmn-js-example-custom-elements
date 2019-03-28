# Custom Elements in bpmn-js

An example of how to support custom elements in [bpmn-js](https://github.com/bpmn-io/bpmn-js) while ensuring BPMN 2.0 compatibility.

:notebook: This example combines the following examples:

1. [bpmn-js-example-model-extension](https://github.com/bpmn-io/bpmn-js-example-model-extension)
2. [bpmn-js-example-custom-rendering](https://github.com/bpmn-io/bpmn-js-example-custom-rendering)
3. [bpmn-js-example-custom-editor-controls](https://github.com/bpmn-io/bpmn-js-example-custom-editor-controls)

![Screenshot](docs/screenshot.png)

:notebook: We refer to _custom elements_ as elements with  extension attributes and elements that are rendered differently.


## About

This example covers the following topics:

* [Creating a model extension](#creating-a-model-extension)
* [Creating custom rendering](#creating-custom-rendering)
* [Creating custom controls](#creating-custom-editor-controls)


## Creating a Model Extension

This example allows you to read, modify and write BPMN 2.0 diagrams that contain `qa:suitable` extension attributes and `qa:analysisDetails` extension elements. You can set the suitability score of each element.

The XML of such an element looks something like this:

```xml
<bpmn2:task id="Task_1" name="Examine Situation" qa:suitable="0.7">
  <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
  <bpmn2:extensionElements>
    <qa:analysisDetails lastChecked="2015-01-20" nextCheck="2015-07-15">
      <qa:comment author="Klaus">
        Our operators always have a hard time to figure out, what they need to do here.
      </qa:comment>
      <qa:comment author="Walter">
        I believe this can be split up in a number of activities and partly automated.
      </qa:comment>
    </qa:analysisDetails>
  </bpmn2:extensionElements>
</bpmn2:task>
```

For more information on creating model extensions head over to this example: https://github.com/bpmn-io/bpmn-js-example-model-extension

## Creating Custom Rendering

In this example we'll create a custom renderer that renders flow elements and their suitability score:

```javascript
drawShape(parentNode, element) {
  const shape = this.bpmnRenderer.drawShape(parentNode, element);

  const suitabilityScore = this.getSuitabilityScore(element);

  if (!isNil(suitabilityScore)) {
    const color = this.getColor(suitabilityScore);

    const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

    svgAttr(rect, {
      transform: 'translate(-20, -10)'
    });

    var text = svgCreate('text'); 

    svgAttr(text, {
      fill: '#fff',
      transform: 'translate(-15, 5)'
    });

    svgClasses(text).add('djs-label'); 
  
    svgAppend(text, document.createTextNode(suitabilityScore)); 
  
    svgAppend(parentNode, text);
  }

  return shape;
}
```

For more information on creating custom rendering head over to this example: https://github.com/bpmn-io/bpmn-js-example-custom-rendering

## Creating Custom Editor Controls

In this example we'll adds controls that allow you to create `bpmn:ServiceTask` elements through the palette and the context pad.

#### Palette

First, let's add the ability to create elements with different suitability scores through the palette:

```javascript
'create.low-task': {
  group: 'activity',
  className: 'bpmn-icon-task red',
  title: translate('Create Task with low suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_LOW),
    click: createTask(SUITABILITY_SCORE_LOW)
  }
},
'create.average-task': {
  group: 'activity',
  className: 'bpmn-icon-task yellow',
  title: translate('Create Task with average suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_AVERGE),
    click: createTask(SUITABILITY_SCORE_AVERGE)
  }
},
'create.high-task': {
  group: 'activity',
  className: 'bpmn-icon-task green',
  title: translate('Create Task with high suitability score'),
  action: {
    dragstart: createTask(SUITABILITY_SCORE_HIGH),
    click: createTask(SUITABILITY_SCORE_HIGH)
  }
}
```

See the entire palette [here](app/custom/CustomPalette.js).

#### Context Pad

The [context pad](./app/emoji/EmojiContextPadProvider.js) contains an additional entry, too:

```javascript
'append.append-emoji-task': {
  group: 'model',
  className: 'icon-emoji',
  title: translate('Append Emoji Task'),
  action: {
    dragstart: appendEmojiTaskStart,
    click: appendEmojiTask
  }
},
```

See the entire context pad [here](app/custom/CustomContextPad.js).

For more information on creating custom editor controls head over to this example: https://github.com/bpmn-io/bpmn-js-example-custom-editor-controls

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
