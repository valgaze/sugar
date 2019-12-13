/*


Instructions: Paste this file at the bottom of your macro and use its utility functions to quickly & easily access common elments of the JSXAPI library
    8 8                                                                 
 ad88888ba   88        88    ,ad8888ba,         db         88888888ba   
d8" 8 8 "8b  88        88   d8"'    `"8b       d88b        88      "8b  
Y8, 8 8      88        88  d8'                d8'`8b       88      ,8P  
`Y8a8a8a,    88        88  88                d8'  `8b      88aaaaaa8P'  
  `"8"8"8b,  88        88  88      88888    d8YaaaaY8b     88""""88'    
    8 8 `8b  88        88  Y8,        88   d8""""""""8b    88    `8b    
Y8a 8 8 a8P  Y8a.    .a8P   Y8a.    .a88  d8'        `8b   88     `8b   
 "Y88888P"    `"Y8888Y"'     `"Y88888P"  d8'          `8b  88      `8b  
    8 8                                                                                                                                     
Syntactic "$ugar" experiment for JSXAPI

Ex. Button click
  $('panel_id').on('click', (event) => {
    console.log('#', event);
    $().call('contact@webex.cisco.com');
  });

Ex. Widget Click
  $('widget_id').on('widget_action', (event) => {
    console.log('#', event);
  });

Ex. Input box from button click (tap button to launch input box, then do something w/ data in callback)
  $('panel_id').on('input', (event) => {
    console.log('#', event.Text);
  });

Ex. Prompts (note, no need to put parameter in $ugar function)

$().prompt(['choice a','choice b','choice c','choice d', 'choice e'], 'How was it?', 'Pick one below', (event) => {
    console.log("## Prompt payload!", event);
  });

Ex. Take input from user after a button press then make search query (pass on to external service)

$('Button2').on('input', (event) => {
    const query = event.Text;
    
    // Check if query is empty
     if (query.length < 1) {
        return;
     }

    const url = `http://www.google.com/search?q=${query}`;
    console.log('Selected URL', url); 

    // Launch the URL
    $().launchURL(url);
    
}); // Can customize popup too w/ optional config last parameter


Ex. Click counter to impress your friends

let clicks = 0;
$('Button3').on('click', (event) => {
    clicks++;
    $().alert(`Clicked ${clicks} times`);
});

Ex. Helper functions (each can return a promise)

$().call('name@cisco.com'); // Initiates a call to an address

$().launchURL('https://www.npmjs.com/package/jsxapi'); // Launch URL

$().alert('Hello world!'); // Defaults to 6 seconds then disappears, Accepts config object for positioning, see full API docs

$().clearTextLine(); // Clears any textlines ()

$().setWidget('widget_id', 'newValue'); // Guess what this does

$().delay(2000).then((event) => console.log('2 Seconds passed')); // Delay an action for a number of miliseconds

*/
function $(panelID, customxapi) {
  const XAPI_REF = customxapi ? customxapi : xapi;
  if (!XAPI_REF) throw new Error("XAPI Library is missing, exiting...");

  // Helpers: $().loud, $().launchURL, $().showTextLine, $().setWidget, $().prompt, $().delay
  const helpers = {
    getOnce(path) {
      return XAPI_REF.status.get(path);
    },
    call(address, config) {
      return XAPI_REF.command("Dial", { Number: address, ...config });
    },
    loud(...data) {
      console.log("***********");
      console.log(" ");
      console.log.apply(console, data);
      console.log(" ");
      console.log("***********");
    },
    launchURL(url) {
      return XAPI_REF.command("UserInterface WebView Display", { URL: url });
    },
    showTextLine(text, config = {}) {
      return XAPI_REF.command("UserInterface Message TextLine Display", {
        Text: text,
        Duration: 6,
        ...config
      });
      //Can also add X & Y integer coords in config object
    },
    alert(text, config = {}) {
      $().showTextLine(text, config);
    },
    clearTextLine(config = {}) {
      return XAPI_REF.command("UserInterface Message TextLine Clear", {
        ...config
      });
    },
    clearAlert(config = {}) {
      return $().clearTextLine(config);
    },
    setWidget(WidgetId, Value) {
      XAPI_REF.command("UserInterface Extensions Widget SetValue", {
        WidgetId,
        Value
      });
    },
    prompt(options, title='placeholderTitle', text, cb) {
      const id = `__id${title}__${text}`;
      const choices = options.map((item, index) => {
        // Limit to 5 choices
        if (index > 4) {
          return;
        }
        const keyName = `Option.${index + 1}`; // Special syntax:
        const payload = {};
        payload[keyName] = item;
        return payload;
      });
      const config = {
        Title: title,
        Text: text,
        FeedbackId: id
      };

      choices.forEach(item => {
        const key = Object.keys(item)[0];
        config[key] = item[key];
      });

      // Dispatch prompt window
      XAPI_REF.command("UserInterface Message Prompt Display", config);

      // Catch response
      const off = XAPI_REF.event.on(
        "UserInterface Message Prompt Response",
        event => {
          if (event.FeedbackId === id) {
            const valueObj = choices[Number(event.OptionId) - 1]; // Sneaky way to add in a Value parameter,  'Option.5': 'choice e'            
            const value = valueObj ? Object.values(valueObj)[0] : undefined;
            event.Value = value;
            if (cb) {
              cb(event);
              typeof off === 'function' ? off() : null; // Discard listener
            }
          }
        }
      );
    },
    delay(duration = 2000) {
      return new Promise(res => setTimeout(res, duration));
    }
  };
  const _buildID = id => `__${id}`;
  return {
    ...helpers,
    trigger(eventType) {
      // Warning: Library will throw if extra parameters
      const normalized = eventType.toLowerCase();
      const config = {
        PanelId: panelID
      };
      if (normalized === "click") {
        XAPI_REF.command("UserInterface Extensions Panel Clicked", config);
      }
    },
    on: function(eventType, cb, config = {}) {
      const normalized = eventType.toLowerCase();
      // Note: Where relevant, the event OFF listener is returned

      // 1) Click handler, event name is 'click' || 'tap', function takes a case-sensitive PanelId
      if (normalized === "click" || normalized === "tap") {
        return XAPI_REF.event.on(
          "UserInterface Extensions Panel Clicked",
          (event, fullRequest) => {
            if (event.PanelId === panelID) {
              cb(event, fullRequest);
            }
          }
        );
      }

      // 2) Input box handler, event name is 'input', function takes a case-sensitive PanelId
      if (normalized === "input" || normalized === "receive_data") {
        // Setup for input box
        const { Placeholder, SubmitText, Title, Text } = config;
        const id = _buildID(panelID);
        const finalConfig = {
          FeedbackId: id,
          Placeholder: Placeholder ? Placeholder : "Enter here...",
          SubmitText: SubmitText ? SubmitText : "Submit",
          Title: Title ? Title : "",
          Text: Text ? Text : "Please enter below"
        };

        return $(panelID, XAPI_REF).on("click", event => {
          // Show input box
          XAPI_REF.command(
            "UserInterface Message TextInput Display",
            finalConfig
          );

          // Catch input
          const off = XAPI_REF.event.on(
            "UserInterface Message TextInput Response",
            event => {
              if (event.FeedbackId === id) {
                cb(event);
                typeof off === 'function' ? off() : null; // Discard this listener
              }
            }
          );
        });
      }

      // 3) Widget action, eventName: 'widget_action', function takes a case-sensitve WidgetId
      if (normalized === "widget_action") {
        return XAPI_REF.event.on(
          "UserInterface Extensions Widget Action",
          event => {
            const widget = event.WidgetId;
            if (widget === panelID) {
              cb(event);
            }
          }
        );
      }
    }
  };
}
