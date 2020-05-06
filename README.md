# Timeline Component for KBA / TEIPublisher

Component to display a timeline (barchart) of search results. Build with lit-element. Demo is hosted here: https://dcts-todo-app.firebaseapp.com/

**Preview**
![Bildschirmfoto von 2020-05-06 05-18-00](https://user-images.githubusercontent.com/44790691/81136032-a79af380-8f5a-11ea-8191-03a0e739c45d.png)

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
- to test the `ParseDateService` and `SearchResultService` the [AVA testing framework](https://github.com/avajs/ava) was used. To enable modern module imports in AVA the npm package `esm` was installed as described on [StackOverflow](https://stackoverflow.com/a/55803624/6272061).

# To Dos
- [x] Support for date stringformat "2012-W01" to "2012-W53" (weeks)
- [x] updating range in the rangepicker should update the selection in the timeline
- [x] reset range button (in the datepicker)
- [x] tooltip on hover
- [x] tooltip during selection
- [ ] move electon around by dragging
- [ ] distinct behavior for both inputs
- [x] custom views for all 6 scopes
  - [x] decades(10Y)
  - [x] decades(5Y)
  - [x] years
  - [x] months
  - [x] weeks
  - [x] day
- [ ] cleanup code and repo
