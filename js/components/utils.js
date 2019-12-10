///////////////////////////////////////////////////////////////////////////
// A React Like Functional HTML Library that supports stateless and stateful
// components as well as component composition in less than 20 lines
//
export const render = function (component, initState = {}, mountNode = 'body') {
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

//exports.render = render