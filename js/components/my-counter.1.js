// Implement `render` to define a template for your element.
export default class MyCounter extends HTMLElement {

  constructor() {
    super();

    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
    <h1>The count is: 0</h1>
    <button onclick="return ${this.intents['countByOne']}"/>Add 1</button>`;

    this.actions = {
      incrementBy(step) {
        // compute the values we want the model to mutate to
        let proposal = { incrementBy: step }

        // -> Reactive Loop
        model.present(proposal)

        // to avoid a page reload
        return false
      },
    };

    // mapping view intents -> actions
    this.intents = {
      'countByOne': 'actions.incrementBy(1)'
    }

    // Model is a singleton
    this.model = {
      counter: 0,
      present(proposal) {
        // Logic that accepts or rejects the proposed values
        if (true) {
          this.accept(proposal);
        }
      },
      accept(proposal) {
        this.counter += proposal.incrementBy > 0 ? proposal.incrementBy : 0
        // -> Reactive Loop
        // Compute State Representation and invoke next-action-predicate
        state.representation(model).then(state.nap)
      }
    };

    // State is a pure function
    this.state = {
      representation(model) {
        return new Promise(function (resolve) {
          document.getElementById("counter").innerHTML = model.counter
          // view.render(
          //   Counter,
          //   { counter: model.counter },
          //   "counter"
          // )
          //this.render(model.counter);
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
  }

  // render(counter) {
  //   return `
  //   <h1>The count is: ${counter}</h1>
  //   <button onclick="return ${this.intents['countByOne']}"/>Add 1</button>`;
  // }
}

window.customElements.define('my-counter', MyCounter);