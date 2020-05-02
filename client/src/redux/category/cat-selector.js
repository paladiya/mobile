import {createSelector} from 'reselect';

const selectCategory = state => state.category

export const selectCat = createSelector([selectCategory],category=>category.cat)