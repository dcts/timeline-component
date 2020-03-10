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
