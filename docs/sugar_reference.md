# $ugar Methods

After you have imported $ugar (see [quickstart.md](./../quickstart.md) if any trouble), you can access $ugar convenience methods by invoking ```$()```


# Click Handler

Behavior: Tapping a action button will run the associated callback function

Parameters: Button ID {string}


```js
$('button1').on('click', (event) => {
    console.log('#', event);
    // event: { id: '1', PanelId: 'button2' }
});

```

# Input Box Handler

Behavior: Tapping a action button will launch an input box (and any data entered the input is available on ```event.Text```)

Parameters: Button ID {string}

```js
$('button2).on('input', (event) => {
    console.log('#', event);
    // event: { id: '1', FeedbackId: '__button2', Text: 'bongo' }
});
```

Note: There is an optional 3rd parameter to customize the prompt: 

# Widget Change Handler

Behavior: Tapping an associated widget will run the associated callback function 

Parameters: Widget ID {string}

```js
$('widget_id').on('widget_action', (event) => {
    console.log("#", event);
    // { id: '1', WidgetId: 'widget_id', Value: '2', Type: 'pressed' }
    // { id: '1', WidgetId: 'widget_id', Value: '2', Type: 'released' }
});

```

# Helper Utilities

$ugar also utility functions which are available after invoking ```$()``` without a parameter: 

### $().alert

Behavior: Launches an alert in center of screen

Parameters: text {string}, config {object}

Note: This aliases xapi.command("UserInterface Message TextLine Display"), you can pass in an optional config object, defaults to 6 second duration

```js
$().alert('Alert launched!');
```

### $().buildPrompt

Behavior: Launches a prompt interface and passes event

Parameters: options {array}, title {string}, text {string}, cb {function}

Note: This aliases xapi.command("UserInterface Message Prompt Display"), you can pass in an optional config object

```js
$().buildPrompt(['choice a','choice b','choice c','choice d', 'choice e'], 'How was it?', 'Pick one below', (event) => {
    console.log("## Prompt payload!", event); // { id: '1', FeedbackId: '__idHow was it?__Pick one below', OptionId: '3' }
});
```

### $().clearAlert

Behavior: Clears any existing alerts

Parameters: none

Note: This aliases xapi.command("UserInterface Message TextLine Clear"), you can pass in an optional config object

```js
$().clearAlert();
```

### $().call

Behavior: Initates a call to passed in receipient

Parameters: text {string}, config {object}

Note: This aliases xapi.command("Dial"), you can pass in an optional config object

```js
$().call('dave@cisco.webex.com');
```

### $().delay

Behavior: Runs a function after specified duration

Parameters: duration {number, miliseconds}


```js
console.log(new Date());
const delay = 3000;
$().delay(3000).then(() => {
    console.log('3 seconds later', new Date())
}); 
```

### $().getOnce

Behavior: Retrieves

Parameters: duration {number, miliseconds}

Note: This aliases xapi.status.get("xxx")


```js
$().getOnce('RoomAnalytics PeopleCount').then((count) => {
            let numPeople = Number(count.Current); // convert count.Cur
            console.log(`${numPeople} detected`);
});
```

### $().launchURL

Behavior: Launches device browser to a specified website

Parameters: url {string}

Note: This aliases xapi.command("UserInterface WebView Display"), you can pass in an optional config object

```js
$().launchURL('https://www.npmjs.com/package/jsxapi')
```

### $().loud

Behavior: Utility helper to log output to console with padding

Parameters: content {string}

Note: This will only display data to the macro console

```js
$().loud('You will definitely notice this log');
```

### $().setWidget

Behavior: Sets widget to specified value

Parameters: widgetid {string}, value {string | any}

Note: This aliases xapi.command("UserInterface Extensions Widget SetValue"), you can pass in an optional config object

```js
$().setWidget('widget_id', 'newValue'); 
```

### $().startTimer & $().stopTimer

Behavior: Starts a timer

Parameters: callback {function}

Note: This function on each "tick" (defaults to 1000ms) will provide the callback function with elapsedTime, totalTicks, and intervalId (the intervalId is used to clear the interval)

```js
$().startTimer((payload) => {
    const {elapsedTime, totalTicks, intervalId } = payload;

    // Display text
    $().alert(elapsedTime, {X:600, Y:500});

    // Turn off after 8 cycles
    if (totalTicks > 8) {
        $().stopTimer(intervalId);
    }
});
```