import {createSelector} from 'reselect'
import guestReducer from './guest-reducer'

const selectGuest = state => state.guest

export const selectToken  = createSelector([selectGuest],guest=> guest.token)