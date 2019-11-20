/*
 *
 * Instructions:
 *   - Copy the contents of this file to the Macro editor for your device
 *   - Create the user interface by hand or using the included 'interface.xml' file
 *
 */

const xapi = require("xapi");

// 1) Handle button click event
xapi.event.on("UserInterface Extensions Panel Clicked", event => {
  // 1a) Intercept correct panel (case-sensitive)
  if (event.PanelId === "peoplecount") {
    // 2) Display initial message
    xapi.command("UserInterface Message TextLine Display", {
      Text: "Counting people in room....",
      Duration: 4
    });

    // 3) Detect + display
    setTimeout(() => {
      // 3a) Get detected count
      xapi.status.get("RoomAnalytics PeopleCount").then(count => {
        let numPeople = Number(count.Current); // converrt count.Current to Number type
        let displayString = "";

        // 3b) Build up displayString
        if (numPeople === 1) {
          displayString = `There is ${count.Current} person recognized`;
        } else if (numPeople < 1) {
          displayString = `There are no people detected`;
        } else {
          displayString = `There are ${count.Current} people recognized`;
        }

        // 3c) Display the result;
        xapi.command("UserInterface Message TextLine Display", {
          Text: displayString,
          Duration: 4
        });
      });
    }, 2000);
  }
});
