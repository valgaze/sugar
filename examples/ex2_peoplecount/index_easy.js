/*
*
* Instructions:
*   - Copy the contents of this file to the Macro editor for your device
*   - Create the user interface by hand or using the included 'interface.xml' file
*
*/

const xapi = require('xapi');


// 1) Handle button click event
// $('PeopleCount').on('click', (event) => {
    $().alert(`Counting people in room....`);    
    
    // 2) Wait 3 seconds then count and display the number of people detected
    $().delay(2000).then(() => {
        // a) Retrieve people count
        $().getOnce('RoomAnalytics PeopleCount').then((count) => {
            let numPeople = Number(count.Current); // convert count.Current to Number type
            let displayString = '';

            // b) run some logic on it
            if (numPeople === 1) {
                displayString = `There is ${count.Current} person recognized`;
            } else if (numPeople < 1) {
                displayString = `There are no people detected`;             
            } else {
                displayString = `There are ${count.Current} people recognized`; 
            }

            // c) Display the result;
            $().alert(displayString, {Duration: 4});
        });

    });
// });


// $ugar Library
function $(e, t) { const n = t || xapi; if (!n) throw new Error("XAPI Library is missing, exiting..."); return { ...{ getOnce: e => xapi.status.get(e), call: (e, t) => n.command("Dial", { Number: e, ...t }), loud(...e) { console.log("***********"), console.log(" "), console.log.apply(console, e), console.log(" "), console.log("***********") }, launchURL: e => n.command("UserInterface WebView Display", { URL: e }), showTextLine: (e, t = {}) => n.command("UserInterface Message TextLine Display", { Text: e, Duration: 6, ...t }), alert(e, t = {}) { $().showTextLine(e, t) }, clearTextLine: (e = {}) => n.command("UserInterface Message TextLine Clear", { ...e }), clearAlert: (e = {}) => $().clearTextLine(e), setWidget(e, t) { n.command("UserInterface Extensions Widget SetValue", { WidgetId: e, Value: t }) }, buildPrompt(e, t, o, a) { const r = `__id${Math.random()}`, s = e.map((e, t) => { if (t > 4) return; const n = {}; return n[`Option.${t + 1}`] = e, n }), l = { Title: t, Text: o, FeedbackId: r }; s.forEach(e => { const t = Object.keys(e)[0]; l[t] = e[t] }), n.command("UserInterface Message Prompt Display", l); const c = n.event.on("UserInterface Message Prompt Response", e => { e.FeedbackId === r && a && (a(e), c()) }) }, startTimer(e, t = {}) { const { reverse: n, startFrom: o, done: a, endAt: r } = t; let s = n && o && o > 0, l = 0; s && (l = o); const c = e => { const t = e => String(e).length < 2 ? `0${e}` : e; return `${t(Math.floor(e / 3600))}:${t(Math.floor(e % 3600 / 60))}:${t(Math.floor(e % 60))}` }, i = (e, t) => { e && "function" == typeof e && e.call(null, t) }, d = setInterval(() => { let t; if (s) { if (t = c(--l), console.log("#", t), 0 === l) { const e = { elapsedTime: t, totalTicks: l }; clearInterval(d), i(a, e) } } else if (t = c(++l), r === l) { const e = { elapsedTime: t, totalTicks: l }; clearInterval(d), i(a, e) } e({ totalTicks: l, elapsedTime: t, intervalId: d }) }, 1e3); return d }, stopTimer(e) { clearInterval(e) }, delay: (e = 2e3) => new Promise(t => setTimeout(t, e)) }, trigger(t) { const o = t.toLowerCase(), a = { PanelId: e }; "click" === o && n.command("UserInterface Extensions Panel Clicked", a) }, on: function (t, o, a = {}) { const r = t.toLowerCase(); if ("click" === r || "tap" === r) return n.event.on("UserInterface Extensions Panel Clicked", (t, n) => { t.PanelId === e && o(t, n) }); if ("input" === r || "receive_data" === r) { const { Placeholder: t, SubmitText: r, Title: s, Text: l } = a, c = (e => `__${e}`)(e), i = { FeedbackId: c, Placeholder: t || "Enter here...", SubmitText: r || "Submit", Title: s || "", Text: l || "Please enter below" }; return $(e).on("click", e => { n.command("UserInterface Message TextInput Display", i); const t = n.event.on("UserInterface Message TextInput Response", e => { e.FeedbackId === c && (o(e), t()) }) }) } return "widget_action" === r ? n.event.on("UserInterface Extensions Widget Action", t => { t.WidgetId === e && o(t) }) : void 0 } } }