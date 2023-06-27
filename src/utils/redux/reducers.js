import React, {createContext, useContext, useReducer} from 'react';
import themes from '../config/themes';

const UIContext = createContext();

const store = {
  theme: themes.iris_blue,
};

const handle = (state, action) => {
  switch (action.type) {
    case 'theme':
      return {...state, theme: action.theme};

    default:
      return state;
  }
};

const combineReducers = reducers => {
  return function (state, action) {
    return Object.keys(reducers)
      .map(k => ({...reducers[k](state[k], action)}))
      .reduce((prev, cur) => {
        return Object.assign({}, prev, cur);
      });
  };
};

const reducers = combineReducers({handle});

export const ReducersProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducers, store);

  const changeTheme = theme => dispatch({type: 'theme', theme: theme});

  return (
    <UIContext.Provider
      value={{
        state: state,
        changeTheme,
      }}>
      {children}
    </UIContext.Provider>
  );
};

export const useReducersContext = () => {
  return useContext(UIContext);
};
