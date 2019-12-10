import { render } from './utils.js'

const template = document.createElement('template');

template.innerHTML = `
    <style>
      button,
      span {
        font-size: 3rem;
        font-family: monospace;
        padding: 0 .5rem;
      }

      button {
        background: pink;
        color: black;
        border: 0;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(173, 61, 85, .5);
      }

      button:active {
        background: #ad3d55;
        color: white;
      }
    </style>
    <div>
      <button type="button" increment>+</button>
      <span id="counter"></span>
      <button type="button" decrement>-</button>
    </div>
  `;

      // Counter component
    let Counter = ({ counter }) => `
    <style>
      button,
      span {
        font-size: 3rem;
        font-family: monospace;
        padding: 0 .5rem;
      }

      button {
        background: pink;
        color: black;
        border: 0;
        border-radius: 6px;
        box-shadow: 0 0 5px rgba(173, 61, 85, .5);
      }

      button:active {
        background: #ad3d55;
        color: white;
      }
    </style>
    <div>
      <button type="button" increment>+</button>
      <span>${counter}</span>
      <button type="button" decrement>-</button>
    </div>
  `;

export class MyCounter extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    
    //this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Binding "this" context to the actions
    this.increment = this.actions.increment.bind(this);
    this.decrement = this.actions.decrement.bind(this);

    // Wire events to HTML inputs
    this.incrementBtn = this.shadowRoot.querySelector('[increment]');
    this.decrementBtn = this.shadowRoot.querySelector('[decrement]');

    //this.displayVal = this.shadowRoot.querySelector('#counter');

    render(
      Counter,
      { counter: this.value },
      "counter"
     )
  }

  connectedCallback() {
    this.incrementBtn.addEventListener('click', this.increment);
    this.decrementBtn.addEventListener('click', this.decrement);

    if (!this.hasAttribute('value')) {
      this.setAttribute('value', 1);
    }
  }

  actions = {
    increment() {
      // using +myVariable coerces myVariable into a number,
      // we do this because the attribute's value is received as a string

      const step = +this.step || 1;

      // compute the values we want the model to mutate to
      const newValue = +this.value + step
      let proposal = { increment: newValue }

      // -> Reactive Loop
      this.model.present(proposal)

      // to avoid a page reload
      return false
    },
    decrement() {
      const step = +this.step || 1;

      // compute the values we want the model to mutate to
      const newValue = +this.value - step
      let proposal = { decrement: newValue }

      // -> Reactive Loop
      this.model.present(proposal)

      // to avoid a page reload
      return false
    }
  }

  // Model is a singleton
  model = {
    present(proposal) {
      // Logic that accepts or rejects the proposed values
      if (proposal.increment) {
        this.accept(proposal)
      }
      if (proposal.decrement) {
        this.accept(proposal)
      }
    },
    accept: (proposal) => {

      if (proposal.increment) {
        if (this.max) {
          this.value = proposal.increment > +this.max ? +this.max : +proposal.increment;
        } else {
          this.value = +proposal.increment
        }
      }

      if (proposal.decrement) {
        if (this.min) {
          this.value = proposal.decrement <= +this.min ? +this.min : +proposal.decrement;
        } else {
          this.value = +proposal.decrement
        }
      }

      // Compute State Representation and invoke next-action-predicate (reactive loop)
      this.state.representation(this.model).then(this.state.nap)
    }
  };

  // State is a pure function
  state = {
    representation(model) {
      return new Promise(function (resolve) {
        //document.getElementById("counter").innerHTML = model.counter
        /*
        render(
          Counter,
          { counter: model.counter },
          "counter"
        )
        */
        resolve(model)
      })
    },

    nap(model) {
      /*
        if (condition(stateRepresentation)) {
          const event = e(stateRepresentation)
          action2(event)
          return true
      }
    */
      return false
    }
  }

  //static get observedAttributes() {
    //return ['value'];
  //}

  //attributeChangedCallback(name, oldValue, newValue) {
    //this.displayVal.innerText = this.value;
  //}

  get value() {
    return this.getAttribute('value');
  }

  get step() {
    return this.getAttribute('step');
  }

  get min() {
    return this.getAttribute('min');
  }

  get max() {
    return this.getAttribute('max');
  }

  set value(newValue) {
    this.setAttribute('value', newValue);
  }

  set step(newValue) {
    this.setAttribute('step', newValue);
  }

  set min(newValue) {
    this.setAttribute('min', newValue);
  }

  set max(newValue) {
    this.setAttribute('max', newValue);
  }

  disconnectedCallback() {
    this.incrementBtn.removeEventListener('click', this.increment);
    this.decrementBtn.removeEventListener('click', this.decrement);
  }
}

window.customElements.define('my-counter', MyCounter);