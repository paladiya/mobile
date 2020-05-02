const INITIAL_STATE = {
  isToggle: false
}

const slideReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'TOGGLE_SLIDER':
      return { ...state, isToggle: !state.isToggle }

    default:
      return state
  }
}

export default slideReducer
