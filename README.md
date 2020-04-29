# LitElement Tutorial

[Vaadin tutorial](https://vaadin.com/learn/tutorials/lit-element) to create a todo app. I didn't use vaadin components, instead I build my own, I found that better for understanding and learning.

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
- to test the `ParseDateService` I used [AVA testing framework](https://github.com/avajs/ava). To enable modern module imports in AVA I installed npm package `esm` as described on [StackOverflow](https://stackoverflow.com/a/55803624/6272061).


# To Dos
- [ ] Move eventlisteners to connectedCallback as described here: https://github.com/Polymer/lit-element/issues/139#issuecomment-411284566

# To Learn List
- [x] lit-element basic syntax + HTML templates
- [x] pass props through attributes
- [ ] eventhandling
- [ ] dot-syntax confusion for booleans + functions?
- [ ] synchronize/bind states between components

# ToAsk (marked with @TOASK in the code)
- [x] 1) bug: todo-task is displayed twice somehow...
- [ ] 2) Debugging tricks? Anything mentionable? how do you debug when not knowing where the rendered element comes from?
- [ ] 3) why do i need to request rerendering of the todo-view when I change the list
- [ ] 4) Eventhandling by binding function to another scope of `this`, is that best practice?
- [ ] 5) we need to update the child element and parent element by ourselves? We are responsible for doing that in our code, right?

# KBA API

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
