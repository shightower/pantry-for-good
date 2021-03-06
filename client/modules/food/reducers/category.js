import {denormalize} from 'normalizr'
import {createSelector} from 'reselect'
import {get} from 'lodash'

import {foodCategory, arrayOfFoodCategories} from '../../../../common/schemas'
import {CALL_API} from '../../../store/middleware/api'
import {crudActions, crudReducer} from '../../../store/utils'

export const actions = crudActions('foodCategory')

export const loadFoods = () => ({
  [CALL_API]: {
    endpoint: 'foods',
    schema: arrayOfFoodCategories,
    types: [actions.LOAD_ALL_REQUEST, actions.LOAD_ALL_SUCCESS, actions.LOAD_ALL_FAILURE]
  }
})

export const saveFood = food => ({
  [CALL_API]: {
    endpoint: food._id ? `foods/${food._id}` : 'foods',
    method: food._id ? 'PUT' : 'POST',
    body: food,
    schema: foodCategory,
    types: [actions.SAVE_REQUEST, actions.SAVE_SUCCESS, actions.SAVE_FAILURE]
  }
})

export const deleteFood = id => ({
  [CALL_API]: {
    endpoint: `foods/${id}`,
    method: 'DELETE',
    schema: foodCategory,
    types: [actions.DELETE_REQUEST, actions.DELETE_SUCCESS, actions.DELETE_FAILURE]
  }
})

export default crudReducer('foodCategory')

export const createSelectors = path => {
  const getEntities = state => state.entities

  return {
    getAll: createSelector(
      state => get(state, path).ids,
      getEntities,
      (foodCategories, entities) =>
        denormalize({foodCategories}, {foodCategories: arrayOfFoodCategories}, entities).foodCategories
    ),
    getOne: state => id => createSelector(
      getEntities,
      entities =>
        denormalize({foodCategories: id}, {foodCategories: foodCategory}, entities).foodCategories
    )(state),
    loading: state => get(state, path).fetching,
    loadError: state => get(state, path).fetchError,
    saving: state => get(state, path).saving,
    saveError: state => get(state, path).saveError
  }
}
