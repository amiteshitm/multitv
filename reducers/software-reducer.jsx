import {
  SOFTWARE_ADD_START,
  SOFTWARE_ADD_END,
  SOFTWARE_ADD,
  SOFTWARES_ADD,
  SOFTWARE_UPDATE,
} from 'actions/software-actions'

// Initial State
export const initialState = {
  isSubmitting: false,
  data: {
    _id: '',
    name: '',
    slug: '',
    twitter: '',
    reddit: '',
    website: '',
    github: '',
    details: '',
    desc: '',
    is_published: true,
  },
  softwares: [],
}

const SoftwareReducer = (state = initialState, action) => {
  switch (action.type) {
    case SOFTWARE_ADD_START :
      return Object.assign({}, state, { isSubmitting: true })

    case SOFTWARE_ADD_END :
      return Object.assign({}, state, { isSubmitting: false })

    case SOFTWARE_ADD:
      return Object.assign({}, state, { data: action.data, isSubmitting: false })

    case SOFTWARE_UPDATE:
      return Object.assign({}, state, { data: action.data, isSubmitting: false })

    case SOFTWARES_ADD:
      return Object.assign({}, state, { softwares: action.softwares })

    default:
      return state
  }
}

export default SoftwareReducer
