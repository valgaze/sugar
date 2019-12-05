const chai = require("chai");
const expect = chai.expect;
const fs = require("fs");
const path = require("path");
const { PhonyJSXAPI } = require("./util/phony_jsxapi.js");
const fakeJSXAPI = new PhonyJSXAPI();

/* 
The environment $ugar targets does not support modules-- just a drop-in
Below we read in $ugar, later make it available under $$ in order bind it to a JSXAPI emulator for basic interactivity

*/

const sourceCode = (libraryPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(libraryPath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve({ data: data.toString() });
    });
  });
};

// Very silly way to handle fact that $ugar isn't a properly exported library (ie commonjs/AMD/RequireJS)
function wildBootstrap() {
    return new Promise((resolve, reject) => {
        const libraryPath = path.resolve(__dirname, "../", "library.js");
        let source = sourceCode(libraryPath).then((source) => {
            const { data } = source;
            eval.call(null, data);
            resolve(data);
        });
    });
}
let $$ = null; // binding reference

describe("$ugar Tests...", function () {

  // https://github.com/mochajs/mocha/issues/1187
  beforeEach(function (done) {
    if (!$$) {
      wildBootstrap().then(function() { 
        $$ = (param=null) => $(param, fakeJSXAPI); // Bind to mock jsxapi instance
        done();
      })
    } else {
      done();
    }
  });

  // Click handler
  describe('## Action button click handler', function() {
    it("Handles a click event", function (done) {
      const panelID = 'button1';
      
      // Handler
      $$(panelID).on('click', (event) => {
          expect(event.panelId).to.equal(panelID);
          done();
      });

      // Send a click to 'button1'
      fakeJSXAPI.sendClick({panelId: panelID});
    });
  });

  // Widget handler
  describe('## Widget action handler', function() {
    it("Handles a widget event", function (done) {
      const widgetID = 'widget1';

      // Widget action handler
      $$(widgetID).on('widget_action', (event) => {
          expect(event.WidgetId).to.equal(widgetID);
          done();
      });

      // Send a widget event
      const payload = { id: '1', WidgetId: widgetID, Value: '2', Type: 'pressed' }
      fakeJSXAPI.sendWidget(payload);
    });
  });

  describe('## Text input handler', function() {
    it("Handles a text input event", function (done) {
      const panelId = 'input_buttom';
      const FeedbackId = `__${panelId}`;

      // Widget action handler
      $$(panelId).on('input', (event) => {
          expect(event.FeedbackId).to.equal(FeedbackId);
          done();
      });

      // Send a widget event
      // const payload = { id: '1', panelId: panelId, Value: '2', Type: 'pressed' }
      fakeJSXAPI.sendInput(panelId);
    });
  });

  describe('## Utility Functions (prompt)', function() {

    it("Handles prompt selection", function (done) {
      const choices = ['choice a','choice b','choice c','choice d', 'choice e'];
      const title = 'How was it?';
      const text = 'Pick one below';
      const FeedbackId =  `__id${title}__${text}`; // todo: abstract to function

      // Prompt
      $$().prompt(choices, title, text, (event) => {
        expect(event.FeedbackId).to.equal(FeedbackId);
        done();
      });

      // Simulate selecting choice 3
      const promptPayload = { id: '1', FeedbackId: FeedbackId, OptionId: '3' };
      fakeJSXAPI.sendPrompt(promptPayload);
    });

    it("(Experimental) prompt selection value is passed through", function (done) {
      const choices = ['choice a','choice b','choice c','choice d', 'choice e'];
      const title = 'Pick one!';
      const text = 'Pick one below';
      const choiceNum = 4; // Option 4
      const arrayIndex = choiceNum - 1; // Responses are indexed at 1, arr's 0-indexed
      const expectedValue = choices[arrayIndex]; // 'choice d'
      const FeedbackId =  `__id${title}__${text}`; // todo: abstract to function

      // Prompt
      $$().prompt(choices, title, text, (event) => {
        expect(event.Value).to.equal(expectedValue);
        done();
      });

      // Simulate selecting choice 4
      const promptPayload = { id: '1', FeedbackId: FeedbackId, OptionId: String(choiceNum) };
      fakeJSXAPI.sendPrompt(promptPayload);
    });

    it("(Experimental) invalid prompt selection returns undefined", function (done) {
      const choices = ['choice a','choice b','choice c','choice d', 'choice e'];
      const title = 'Pick another one!';
      const text = 'Pick one below';
      const choiceNum = 6; // 'Option.6', out of bounds, limit to 5
      const arrayIndex = choiceNum - 1; // Responses are indexed at 1, arr's 0-indexed
      const expectedValue = choices[arrayIndex]; // undefined
      const FeedbackId =  `__id${title}__${text}`; // todo: abstract to function


      // Prompt
      $$().prompt(choices, title, text, (event) => {
        expect(expectedValue).to.equal(expectedValue);
        done();
      });

      // Simulate selecting choice 6
      const promptPayload = { id: '1', FeedbackId: FeedbackId, OptionId: String(choiceNum) };
      fakeJSXAPI.sendPrompt(promptPayload);
    });

  });


});