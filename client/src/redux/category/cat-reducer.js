const iniState = {
  cat: 'all'
}

const categoryReducer = (state = iniState, action) => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, cat: action.payload }
    default: {
      return state
    }
  }
}

export default categoryReducer
