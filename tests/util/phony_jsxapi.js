// Quick'n'dirty jsxapi emulator for click, input, and prompt payloads
const events = require("events");
class PhonyJSXAPI {
  _emitter() {
    return this.fakeEmitter;
  }

  constructor() {
    this.fakeEmitter = new events.EventEmitter();
    this.event = this.fakeEmitter;
    this.command = () => {};
    this.eventStrings = {
      click: 'UserInterface Extensions Panel Clicked',
      widget: 'UserInterface Extensions Widget Action',
      input: 'UserInterface Message TextInput Response',
      prompt: 'UserInterface Message Prompt Response',
    }
    this.payloads = {}
  }

  _buildId(panelId) {
    const id = `__${panelId}`;
    return id;
  }

  sendWidget(payload) {
    this.fakeEmitter.emit(this.eventStrings.widget, payload);
  }

  sendClick(payload) {
    let { panelId } = payload;
    if (payload.panelId || payload.PanelID || payload.Panelid) {
      //Mercy check for key name
      panelId = payload.panelId || payload.PanelID || payload.Panelid;
      payload.PanelId = panelId; // API
    }

    const clickPayload = { id: '1', ...payload}
    return Promise.resolve(this.fakeEmitter.emit(this.eventStrings.click, clickPayload));
  }

  sendInput(buttonName) {
    const id = this._buildId(buttonName)
    const output = { id: '1', FeedbackId: id, Text: 'bongo' };
    // sendClick
    this.sendClick({panelId: buttonName}).then(() => {
      // Send Text
      this.fakeEmitter.emit(this.eventStrings.input, output);
    })
  }

  sendPrompt(payload) {
    this.fakeEmitter.emit(this.eventStrings.prompt, payload);
  }
}

module.exports.PhonyJSXAPI = PhonyJSXAPI;
