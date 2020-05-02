import {createSelector} from 'reselect'

const selectSearch = state => state.search

export const selectSearchTerm = createSelector([selectSearch],search=>search.term)