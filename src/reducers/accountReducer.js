import { LOGIN } from "../actions/types";

const initialState = {
  id: '',
  token: '',
  isLoggedIn: false,
  email: '',
  role: ''
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      state = Object.assign({}, state, { id: action.id, token: action.token, isLoggedIn: true, email: action.email, role: action.role });
      return state;
    }
    default:
      return state;
  }
};

export default accountReducer;
