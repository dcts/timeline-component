// Import the LitElement base class and html helper function
import { LitElement, html, css } from 'lit-element';

// Extend the LitElement base class
class PbBrushingLayer extends LitElement {

  static get styles() {
    return css`
      canvas#main-canvas {
        box-shadow: 0 0 14px rgba(0,0,0,0.1);
      }
      .wrapper {
        margin: 0 auto;
      }
    `;
  }

  constructor() {
    super();
    this.width = 800;
    this.height = 60;
    this.mousedDown = 0;
    this.anker = { x: null, y: null};
    this.mouseDown = 0;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.fillStyle = "rgba(0,0,0,0.1)";
    this.initBrushing();
  }

  initBrushing() {
    this.canvas.addEventListener("mouseenter", e => {
      console.log("MOUSEENTER");
    });

    this.canvas.addEventListener("mousemove", e => {
      let pos = this.getPosition(e);
      if (this.mouseDown) {
        this.clearCanvas();
        this.canvasContext.fillRect(this.anker.x, 0, pos.x - this.anker.x, this.canvas.height);
      }
    });

    this.canvas.addEventListener("mousedown", e => {
      this.anker = this.getPosition(e);
      console.log(`X: ${this.anker.x}, Y: ${this.anker.y}`);
    });

    this.canvas.addEventListener("mouseup", e => {
      this.anker = { x: 0, y: 0 };
    });

    document.body.onmousedown = () => ++this.mouseDown;
    document.body.onmouseup = () => --this.mouseDown;
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getPosition(event) {
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left + 1; //x position within the element.
    let y = event.clientY - rect.top + 1;  //y position within the element.
    return { x: x, y: y };
  }

  render() {
    return html`
      <!-- template content -->
      <div class="wrapper">
        <canvas id="main-canvas" width="${this.width}" height="${this.height}" style="cursor: crosshair"></canvas>
      </div>
    `;
  }
}
// Register the new element with the browser.
customElements.define('pb-brushing-layer', PbBrushingLayer);
