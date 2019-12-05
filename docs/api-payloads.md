## Click events payload

```js
$('button1').on('click', (event) => {
    console.log('#', event);
    // event: { id: '1', PanelId: 'button2' }
});

```

## Text input payload

```js
$('button2).on('input', (event) => {
    console.log('#', event);
    // event: { id: '1', FeedbackId: '__button2', Text: 'bongo' }
});

```

## Widget

```js
$('widget_id').on('widget_action', (event) => {
    console.log("#", event);
    // { id: '1', WidgetId: 'widget_id', Value: '2', Type: 'pressed' }
    // { id: '1', WidgetId: 'widget_id', Value: '2', Type: 'released' }
});

```

## Prompt

```js
$().prompt(['choice a','choice b','choice c','choice d', 'choice e'], 'How was it?', 'Pick one below', (event) => {
    console.log("## Prompt payload!", event);
    // { id: '1', FeedbackId: ''__idHow was it?__Pick one below'', OptionId: '3', Value: 'Choice C'}
});
```

Note: Prompt choices are indexed starting at 1, [see ```xCommand UserInterface Message Prompt Response``` on page 230 for more info](https://www.cisco.com/c/dam/en/us/td/docs/telepresence/endpoint/ce93/collaboration-endpoint-software-api-reference-guide-ce93.pdf) and ordinarily do not return a value