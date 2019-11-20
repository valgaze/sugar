// Very janky jsxapi helper
const events = require("events");
class MockEmitter {
  _emitter() {
    return this.fakeEmitter;
  }

  constructor() {
    this.fakeEmitter = new events.EventEmitter();
    this.fakeEmitter.event = this.fakeEmitter;
    this.fakeEmitter.command = () => {};
  }

  _buildId(panelId) {
    const id = `__${panelId}`;
    return id;
  }

  sendClick(payload) {
    let { panelId } = payload;
    if (payload.panelId || payload.PanelID || payload.Panelid) {
      //Mercy check for key name
      panelId = payload.panelId || payload.PanelID || payload.Panelid;
      payload.PanelId = panelId; // API
    }

    this.fakeEmitter.emit("UserInterface Extensions Panel Clicked", payload);
  }

  sendData(payload) {
    let { panelId } = payload;
    if (payload.panelId || payload.PanelID || payload.Panelid) {
      //Mercy check for key name
      panelId = payload.panelId || payload.PanelID || payload.Panelid;
      payload.PanelId = panelId; // API
    }

    payload.FeedbackId = this._buildId(panelId);
    this.sendClick({ PanelId: payload.panelId });
    this.fakeEmitter.emit("UserInterface Message TextInput Response", payload);
    this.fakeEmitter.emit("BONGO", payload);
  }
}

module.exports.MockEmitter = MockEmitter;
