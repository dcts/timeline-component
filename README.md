# LitElement Tutorial

[Vaadin tutorial](https://vaadin.com/learn/tutorials/lit-element) to create a todo app. I didn't use vaadin components, instead I build my own, I found that better for understanding and learning.

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
