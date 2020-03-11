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
App is live: https://dcts-todo-app.firebaseapp.com/ (hosted by firebase hosting)
```bash
# deploy in 2 steps
npm run prod    # bundle and build production files with webpack
firebase deploy # deploys content of /dist folder to firebase

# script (runs both steps)
npm run deploy
```

# To Learn List
- [x] lit-element basic syntax + HTML templates
- [x] pass props through attributes
- [ ] eventhandling
- [ ] dot-syntax confusion for booleans + functions?
- [ ] synchronize/bind states between components

# ToAsk (marked with @TOASK in the code)
- (1) bug: todo-task is displayed twice somehow...
- (2) Debugging tricks? Anything mentionable? how do you debug when not knowing where the rendered element comes from?
- (3) why do i need to request rerendering of the todo-view when I change the list
- (4) Eventhandling by binding function to another scope of `this`, is that best practice?
- (5) we need to update the child element and parent element by ourselves? We are responsible for doing that in our code, right?
