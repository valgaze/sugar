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
    // Set default on widget
    $().setWidget('searchengine_widget', GLOBAL_SEARCHENGINE);
});

// 2) Handle widget changes
$('searchengine_widget').on('widget_action', (event) => {
    GLOBAL_SEARCHENGINE = event.Value;
 });
  
// 3) Handle button tap
const promptConfig = { Placeholder: 'Type here (of course)', SubmitText: 'GO!', Title: 'Search Engine', Text: 'What do you need to know? (To change search engines, use the Search Engine Picker app)' }
$('search_button').on('input', (event) => {
    // Search Engine Hash (not the keys must match widget id's)
    const engines = {
         google: 'http://www.google.com/search?q=',
         duckduckgo: 'https://duckduckgo.com/?q=',
         bing: 'https://www.bing.com/search?q='
     }

     const query = event.Text;
     
     // Check if query is empty
     if (query.length < 1) {
        return;
     }
     
     // Build search engine query based on selected search engine
     const url = `${engines[GLOBAL_SEARCHENGINE]}${query}`;
     console.log('Selected URL', url);
     
     // Launch the URL
     $().launchURL(url);
     
}, promptConfig);


//$ugar v0.8.1 (c) 2019
function $(a,b){const c=b?b:xapi;if(!c)throw new Error("XAPI Library is missing, exiting...");const d={getOnce(a){return c.status.get(a)},call(a,b){return c.command("Dial",{Number:a,...b})},loud(...a){console.log("***********"),console.log(" "),console.log.apply(console,a),console.log(" "),console.log("***********")},launchURL(a){return c.command("UserInterface WebView Display",{URL:a})},showTextLine(a,b={}){return c.command("UserInterface Message TextLine Display",{Text:a,Duration:6,...b})},alert(a,b={}){$().showTextLine(a,b)},clearTextLine(a={}){return c.command("UserInterface Message TextLine Clear",{...a})},clearAlert(a={}){return $().clearTextLine(a)},setWidget(a,b){c.command("UserInterface Extensions Widget SetValue",{WidgetId:a,Value:b})},buildPrompt(a,b,d,e){const f=`__id${Math.random()}`,g=a.map((a,b)=>{if(4<b)return;const c={};return c[`Option.${b+1}`]=a,c}),h={Title:b,Text:d,FeedbackId:f};g.forEach(a=>{const b=Object.keys(a)[0];h[b]=a[b]}),c.command("UserInterface Message Prompt Display",h);const i=c.event.on("UserInterface Message Prompt Response",a=>{a.FeedbackId===f&&e&&(e(a),i())})},delay(a=2e3){return new Promise(b=>setTimeout(b,a))}},e=a=>`__${a}`;return{...d,trigger(b){const d=b.toLowerCase();"click"===d&&c.command("UserInterface Extensions Panel Clicked",{PanelId:a})},on:function(b,d,f={}){const g=b.toLowerCase();if("click"===g||"tap"===g)return c.event.on("UserInterface Extensions Panel Clicked",(b,c)=>{b.PanelId===a&&d(b,c)});if("input"===g||"receive_data"===g){const{Placeholder:b,SubmitText:g,Title:h,Text:i}=f,j=e(a),k={FeedbackId:j,Placeholder:b?b:"Enter here...",SubmitText:g?g:"Submit",Title:h?h:"",Text:i?i:"Please enter below"};return $(a).on("click",()=>{c.command("UserInterface Message TextInput Display",k);const a=c.event.on("UserInterface Message TextInput Response",b=>{b.FeedbackId===j&&(d(b),a())})})}return"widget_action"===g?c.event.on("UserInterface Extensions Widget Action",b=>{const c=b.WidgetId;c===a&&d(b)}):void 0}}}
