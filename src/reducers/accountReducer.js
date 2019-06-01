import { LOGIN, LOGOUT } from "../actions/types";

const initialState = {
  id: '',
  token: '',
  isLoggedIn: false,
  email: '',
  admin: ''
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      state = Object.assign({}, state, { id: action.id, token: action.token, isLoggedIn: true, email: action.email, admin: action.admin });
      return state;
    }
    case LOGOUT: {
      state = Object.assign({}, state, initialState);
      return state;
    }
    default:
      return state;
  }
};

export default accountReducer;
