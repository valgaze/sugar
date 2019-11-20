/*
*
* Instructions:
*   - Copy the contents of this file to the Macro editor for your device
*   - Create the user interface by hand or using the included 'interface.xml' file
*
*/

const xapi = require('xapi');

let GLOBAL_SEARCHENGINE = 'google'; // Picks current search engine. In general we don't want to store much (if any state here)

// 1) Setup tasks
xapi.on('ready', () => {
    xapi.command('UserInterface Extensions Widget SetValue', {
        WidgetId: 'searchengine_widget',
        Value: GLOBAL_SEARCHENGINE
    });
});

// 2) Handle widget changes
xapi.event.on('UserInterface Extensions Widget Action', (event) => {
    const widget = event.WidgetId;
    if (widget === 'searchengine_widget') {
        GLOBAL_SEARCHENGINE = event.Value;
    }
});
 

// 3 Handle button tap & user input
xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if (event.PanelId === 'search_button') {
        // Launch input
        xapi.command("UserInterface Message TextInput Display", {
            Placeholder: 'Type here (of course)',
            SubmitText: 'GO!',
            Title: 'Search Engine',
            Text: 'What do you need to know? (To change search engines, use the Search Engine Picker app)',
            FeedbackId:'__searchengine'
        });

        xapi.event.on('UserInterface Message TextInput Response', (event) => {
            if (event.FeedbackId === '__searchengine') {
                const query = event.Text;
                const engines = {
                    google: 'http://www.google.com/search?q=',
                    duckduckgo: 'https://duckduckgo.com/?q=',
                    bing: 'https://www.bing.com/search?q='
                }

                // Check if query is empty
                if (query.length < 1) {
                    return;
                }
                
                // Build search engine query based on selected search engine
                const url = `${engines[GLOBAL_SEARCHENGINE]}${query}`;
                console.log('Selected URL', url);
                xapi.command("UserInterface WebView Display", { URL: url });
            }
        });
    }
});