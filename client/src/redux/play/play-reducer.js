const INITIAL_STATE = {
  isPlaying: false,
  itemId:undefined
}

const playReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true , itemId:action.itemId }
    case 'PAUSE':
      return { ...state, isPlaying: false, itemId:action.itemId }
    default:
      return state
  }
}

export default playReducer;
