const INITIAL_STATE = {
  term: ''
}

const SearchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SEARCH':
      return { ...state, term: action.payload }
    default:
      return state
  }
}

export default SearchReducer;
