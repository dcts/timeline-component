# Timeline Component for KBA / TEIPublisher

Component to display a timeline of search results. Build with lit-element. Demo is hosted here: https://dcts-todo-app.firebaseapp.com/

**Preview**
![timeline-demo](https://user-images.githubusercontent.com/44790691/80798736-5a5b0280-8ba5-11ea-9e32-016d08c035c9.png)

# Requirements
- **`nodeJS`**
- **`npm`**
- [**`lit-element`**](https://lit-element.polymer-project.org/) [npm-link](https://www.npmjs.com/package/lit-element)
- [**`firebase`**](https://firebase.google.com/docs/cli) (only for hosting)

### Install
```bash
npm install
```

### Development
```bash
npm run dev # runs webpack dev server on port 8080
```

### Production
App is live: https://dcts-todo-app.web.app/ (hosted by firebase hosting)
```bash
# deploy in 2 steps
npm run prod    # bundle and build production files with webpack
firebase deploy # deploys content of /dist folder to firebase

# script (runs both steps)
npm run deploy
```

### Testing with AVA
- to test the `ParseDateService` the [AVA testing framework](https://github.com/avajs/ava) was used. To enable modern module imports in AVA the npm package `esm` was installed as described on [StackOverflow](https://stackoverflow.com/a/55803624/6272061).


# To Dos
- [x] Support for date stringformat "2012-W01" to "2012-W53" (weeks)
- [x] updating range in the rangepicker should update the selection in the timeline
- [x] reset range button (in the datepicker)
- [ ] tooltip on hover
- [ ] tooltip during selection
- [ ] custom views for all 6 scopes
  - [ ] decades(10Y)
  - [ ] decades(5Y)
  - [x] years
  - [ ] months
  - [ ] weeks
  - [ ] day

# KBA API Notes

CORS problem:

```javascript
// Open the console on any page and run this (does not work):
fetch("https://kba.anton.ch/api/timeline?object_type=Brief")
  .then(response => response.json())
  .then(jsonData => { console.log(jsonData) });

// this works (with proxy)
fetch("https://cors-anywhere.herokuapp.com/https://kba.anton.ch/api/timeline?object_type=Brief")
  .then(response => response.json())
  .then(jsonData => { console.log(jsonData) });
```

- solution? (https://stackoverflow.com/a/55652989/6272061)
