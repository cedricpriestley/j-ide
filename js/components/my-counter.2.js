// Model is a singleton
let model = {
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
    // -> Reactive Loop
    // Compute State Representation and invoke next-action-predicate
    state.representation(model).then(state.nap)
  }
};

// State is a pure function
let state = {
  representation(model) {
    return new Promise(function (resolve) {
      //document.getElementById("counter").innerHTML = model.counter
      view.render(
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

///////////////////////////////////////////////////////////////////////////
// A React Like Functional HTML Library that supports stateless and stateful
// components as well as component composition in less than 20 lines
//

// View is a pure function of the state representation /////////////////////////////////////////////
const view = {
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
}

// mapping view intents -> actions
export const intents = {
  'initCount': 'actions.incrementBy(0)',
  'countByOne': 'actions.incrementBy(1)'
}

export const actions = {
  incrementBy(step) {
    // compute the values we want the model to mutate to
    let proposal = { incrementBy: step }

    // -> Reactive Loop
    model.present(proposal)

    // to avoid a page reload
    return false
  },
};

// Counter component
let Counter = ({ counter }) => `
  <h1>The count is: ${counter}</h1>
  <button onclick="return ${intents['countByOne']}"/>Add 1</button>`

  view.render(
    Counter,
    { counter: model.counter },
    "counter"
  )