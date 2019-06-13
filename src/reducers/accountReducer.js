import { LOGIN, LOGOUT, SET_FIRST_TIME } from "../actions/types";

const initialState = {
  id: '',
  token: '',
  isLoggedIn: false,
  email: '',
  admin: '',
  isFirstTime: true
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      state = Object.assign({}, state, { id: action.id, token: action.token, isLoggedIn: true, email: action.email, admin: action.admin });
      return state;
    }
    case LOGOUT: {
      state = Object.assign({}, state, { ...initialState, isFirstTime: false });
      return state;
    }
    case SET_FIRST_TIME: {
      state = Object.assign({}, state, { ...state, isFirstTime: action.isFirstTime });
      return state;
    }
    default:
      return state;
  }
};

export default accountReducer;
