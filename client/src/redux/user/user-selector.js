import {createSelector} from 'reselect'

const selectUser = state => state.user

export const selectCurretnUser = createSelector([selectUser],user=>user.currentUser);