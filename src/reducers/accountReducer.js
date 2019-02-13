import { LOGIN } from "../actions/types";

const initialState = {
  id: '',
  token: '',
  isLoggedIn: false,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      state = Object.assign({}, state, { id: action.id, token: action.token, isLoggedIn: true });
      return state;
    }
    default:
      return state;
  }
};

export default accountReducer;
