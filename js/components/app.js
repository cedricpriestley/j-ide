import { MyCounter } from './my-counter.js'

export default class App extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>
      </style>
      <script src="../../node_modules/xterm/lib/xterm.js"></script>
      <header>
        <h1>My PWA</h1>
        <nav></nav>
      </header>s
      <main>
      <div id="terminal"></div>
      <script>
        var term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      </script>
   <my-counter value="100" step="5" max="150" min="2"></my-counter>
      </main>
      <footer>
      </footer>
      `;
  }
}
customElements.define('app', App);
