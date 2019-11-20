const chai = require("chai");
const expect = chai.expect;
const fs = require("fs");
const path = require("path");
const { MockEmitter } = require("./util/phony_jsxapi.js");
const emitHelper = new MockEmitter();
const $ = require('../library'); // Hot require, $ugar doesn't even have an export...

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

function wildBootstrap() {

// Really silly way to deal with fact that $ugar isn't a proper library, super light-weight drop-in "helper"
    return new Promise((resolve, reject) => {
        const libraryPath = path.resolve(__dirname, "../", "library.js");
        let source = sourceCode(libraryPath).then((source) => {
            const { data } = source;
            eval(data); // Yeeeep.... :/
            resolve(data);
        });
    });
}


describe("MAIN LAYER", function () {

    beforeEach(function (done) {
        wildBootstrap.then(done)
    });
    
    describe("Basic functionality", function () {
        it("test1", function () {
                 var testPromise = new Promise(function(resolve, reject) {
                   setTimeout(function() {
                     resolve("Hello World!");
                   }, 200);
                 });

                 return testPromise.then(function(result) {
                   expect(result).to.equal("Hello World!");
                 });
        });

        it("test2", function() {
            var testPromise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve("Hello World!");
                }, 200);
            });

            return testPromise.then(function(result) {
                expect(result).to.equal("Hello World!");
            });
        });
    });
});
