/*
*
* Instructions:
*   - Copy the contents of this file to the Macro editor for your device
*   - Create the user interface by hand or using the included 'interface.xml' file
*
*/

const xapi = require('xapi');


xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  // 1) Simple click handler
  if (event.PanelId === 'button1') {
    xapi.command("UserInterface Message TextLine Display", {
      Text: 'My big important alert...',
      Duration: 6,
    });
  }

  // 2) Button click with complex behavior
  if (event.PanelId === 'button2') {
       // Async operations that query device itself
       const volume = xapi.status.get('Audio Volume');
       const standByStatus = xapi.status.get('Standby');
   
       Promise.all([volume, standByStatus]).then(results => {
           const volume = results[0];
           const standByStatus = results[1];
           const displayString = `The Stand-By status is '${standByStatus.State}' and the volume is set to ${volume}`;
           xapi.command("UserInterface Message TextLine Display", {
            Text: displayString,
            Duration: 6,
          });
       });
  }
});

// 3) Handle text input (click button to launch input)
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  if (event.PanelId === 'button3') {
    // Launch input
    xapi.command("UserInterface Message TextInput Display", { 
        Placeholder: 'Type some text below', 
        SubmitText: 'Go', 
        Title: 'Type something', 
        Text: 'Look, just type something & we\'ll be done with this example', 
        FeedbackId: 'button3_feedback'
    });

    xapi.event.on('UserInterface Message TextInput Response', (event) => {
      if (event.FeedbackId === 'button3_feedback') {
          const userData = event.Text;
          xapi.command("UserInterface Message TextLine Display", {
            Text: `You entered '${userData}'`,
            Duration: 6,
          });
      }
    });
  }
});

// 4) Launch Prompt
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
  if (event.PanelId === 'button4') {
      const feedbackId = "prompt123";
      const config = {
        Title: "Prompt Title",
        Text: "Prompt Text",
        FeedbackId: feedbackId,
        "Option.1": "choice a",
        "Option.2": "choice b",
        "Option.3": "choice c",
        "Option.4": "choice d",
        "Option.5": "choice e"
      };
      xapi.command("UserInterface Message Prompt Display", config);

      xapi.event.on("UserInterface Message Prompt Response", event => {
        if (event.FeedbackId === feedbackId) {          
          const payload = JSON.stringify(event);
          const alertMsg = `You picked ${payload}`;
          xapi.command("UserInterface Message TextLine Display", {
            Text: alertMsg,
            Duration: 6
          });
        }
      });
  }
});

// 5) Widgets action
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
  const widget = event.WidgetId;
  if (widget === 'widget_id') {
    console.log(`Value from widget: ${event.Value}`);
  }
});