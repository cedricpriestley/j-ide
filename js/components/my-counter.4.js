export class MyCounter extends HTMLElement {

  constructor() {
    super();

    // Counter component
    let Counter = ({ counter }) => `<span id="counter">${counter}</span>`

    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `<span id="counter">0</span>`

    // this.render(
    //   Counter,
    //   { counter: this.model.counter },
    //   "counter"
    // )

    // Mapping view intents to actions and binding "this" context to the actions
    this.incrementBy = this.actions.incrementBy.bind(this)
    // intents = {
    //   incrementBy: this.actions.incrementBy.bind(this),
    // }
  }

  // Model is a singleton
  model = {
    counter: 0,
    present(proposal) {
      // Logic that accepts or rejects the proposed values
      if (true) {
        this.accept(proposal);
      }
    },
    accept(proposal) {
      this.counter += proposal.incrementBy > 0 ? proposal.incrementBy : 0
      this.name = proposal.name ? proposal.name : ""
      // Compute State Representation and invoke next-action-predicate (reactive loop)
      state.representation(this).then(state.nap)
    }
  };

  // State is a pure function
  state = {
    representation(model) {
      return new Promise(function (resolve) {
        //document.getElementById("counter").innerHTML = model.counter
        render(
          Counter,
          { counter: model.counter },
          "counter"
        )
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

  // A Functional HTML Library that supports stateless and stateful
  // components as well as component composition in less than 20 lines

  // View is a pure function of the state representation
  render(component, initState = {}, mountNode = 'app') {
    initState.render = function (stateRepresentation, options = {}) {
      const start = (options.focus) ? document.getElementById(options.focus).selectionStart : 0;
      (document.getElementById(mountNode) || {}).innerHTML = stateRepresentation
      if (options.focus) {
        let f = document.getElementById(options.focus)
        f.selectionStart = start
        f.focus()
      }
    }

    let stateRepresentation = component(initState)

    initState.render((typeof stateRepresentation === 'function') ? stateRepresentation() : stateRepresentation)
  }

  actions = {
    incrementBy(step) {
      // compute the values we want the model to mutate to
      let proposal = { incrementBy: step }

      // -> Reactive Loop
      this.model.present(proposal)

      // to avoid a page reload
      return false
    },
  };
}

window.customElements.define('my-counter', MyCounter);