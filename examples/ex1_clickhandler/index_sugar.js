/*
*
* Instructions:
*   - Copy the contents of this file to the Macro editor for your device
*   - Create the user interface by hand or using the included 'interface.xml' file
*
*/

const xapi = require('xapi');

// 1) Simple click handler
$('button1').on('click', (event) => {
    $().alert('My big important alert...'); // Show an alert

    // $().call('contact_to_call@webex.cisco.com'); // Trigger a call
});


// 2) Button click with complex behavior
$('button2').on('click', (event) => {

    // Async operations that query device itself
    const volume = xapi.status.get('Audio Volume');
    const standByStatus = xapi.status.get('Standby');

    Promise.all([volume, standByStatus]).then(results => {
        const volume = results[0];
        const standByStatus = results[1];
        const displayString = `The Stand-By status is '${standByStatus.State}' and the volume is set to ${volume}`;
        
        $().alert(displayString);
    });
});

  
// 3) Handle text input (click button to launch input)

// a) [Optional] Override default text for text input
const promptConfig = { 
    Placeholder: 'Type some text below', 
    SubmitText: 'Go', 
    Title: 'Type something', 
    Text: 'Look, just type something & we\'ll be done with this example' 
}

// b) Tap button > open input box > show input back
$('button3').on('input', (event) => {
    const userData = event.Text;
    $().alert(`You entered '${userData}'`);
}, promptConfig);

// 4) Widgets action
$('widget_id').on('widget_action', (event) => {
    // event: { id: '1', WidgetId: 'widget_id', Value: '2', Type: 'released' }
    console.log(`Value from widget: ${event.Value}`);
});
 



//$ugar v0.8.1 (2019)
function $(a,b){const c=b?b:xapi;if(!c)throw new Error("XAPI Library is missing, exiting...");const d={getOnce(a){return c.status.get(a)},call(a,b){return c.command("Dial",{Number:a,...b})},loud(...a){console.log("***********"),console.log(" "),console.log.apply(console,a),console.log(" "),console.log("***********")},launchURL(a){return c.command("UserInterface WebView Display",{URL:a})},showTextLine(a,b={}){return c.command("UserInterface Message TextLine Display",{Text:a,Duration:6,...b})},alert(a,b={}){$().showTextLine(a,b)},clearTextLine(a={}){return c.command("UserInterface Message TextLine Clear",{...a})},clearAlert(a={}){return $().clearTextLine(a)},setWidget(a,b){c.command("UserInterface Extensions Widget SetValue",{WidgetId:a,Value:b})},prompt(a,b="placeholderTitle",d,e){const f=`__id${b}__${d}`,g=a.map((a,b)=>{if(4<b)return;const c={};return c[`Option.${b+1}`]=a,c}),h={Title:b,Text:d,FeedbackId:f};g.forEach(a=>{const b=Object.keys(a)[0];h[b]=a[b]}),c.command("UserInterface Message Prompt Display",h);const i=c.event.on("UserInterface Message Prompt Response",a=>{if(a.FeedbackId===f){const b=g[+a.OptionId-1],c=b?Object.values(b)[0]:void 0;a.Value=c,e&&(e(a),"function"==typeof i?i():null)}})},delay(a=2e3){return new Promise(b=>setTimeout(b,a))}},e=a=>`__${a}`;return{...d,trigger(b){const d=b.toLowerCase();"click"===d&&c.command("UserInterface Extensions Panel Clicked",{PanelId:a})},on:function(b,d,f={}){const g=b.toLowerCase();if("click"===g||"tap"===g)return c.event.on("UserInterface Extensions Panel Clicked",(b,c)=>{b.PanelId===a&&d(b,c)});if("input"===g||"receive_data"===g){const{Placeholder:b,SubmitText:g,Title:h,Text:i}=f,j=e(a),k={FeedbackId:j,Placeholder:b?b:"Enter here...",SubmitText:g?g:"Submit",Title:h?h:"",Text:i?i:"Please enter below"};return $(a,c).on("click",()=>{c.command("UserInterface Message TextInput Display",k);const a=c.event.on("UserInterface Message TextInput Response",b=>{b.FeedbackId===j&&(d(b),"function"==typeof a?a():null)})})}return"widget_action"===g?c.event.on("UserInterface Extensions Widget Action",b=>{const c=b.WidgetId;c===a&&d(b)}):void 0}}}
