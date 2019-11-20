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
$().buildPrompt(['choice a','choice b','choice c','choice d', 'choice e'], 'How was it?', 'Pick one below', (event) => {
    console.log("## Prompt payload!", event);
    // { id: '1', FeedbackId: '__id0.4388508881271227', OptionId: '3' }
});
```
