import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './user/user-reducer'
import slideReducer from './slider/slide-reducer'
import categoryReducer from './category/cat-reducer'
import playReducer from './play/play-reducer'
import searchReducer from './search/search-reducer'
import guestReducer from './guest/guest-reducer'
const config = {
  key: 'gautam',
  storage,
  whitelist: ['user']
}

const rootReducer = combineReducers({
  user: userReducer,
  slider: slideReducer,
  category: categoryReducer,
  play: playReducer,
  search: searchReducer,
  guest: guestReducer
})

export default persistReducer(config, rootReducer)
