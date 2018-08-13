# unnest-reducer
Utility to create a reducer from a nested object

[![Build Status](https://travis-ci.org/dak0rn/unnest-reducer.svg?branch=master)](https://travis-ci.org/dak0rn/unnest-reducer)
![Dependencies](https://img.shields.io/david/dak0rn/unnest-reducer.svg)
![Dev Dependencies](https://img.shields.io/david/dev/dak0rn/unnest-reducer.svg)

Allows to write reducers in a nested fashion making them more readable when using long names, prefixes or suffixes.

Turns

```javascript
{
    [ ActionsTypes.LOAD_PROFILE ]: {
        PENDING(state, action) {},
        REJECTED(state, action) {},
        FULFILLED(state, action) {}
    },

    [ ActionTypes.SELECT_PROFILE ](state, action) {}
}
```

into a reducer function that works with reducer definitions similar to the following ones:

```javascript
{
    [ ActionsTypes.LOAD_PROFILE + '_PENDING' ](state, action) {},
    [ ActionsTypes.LOAD_PROFILE + '_FULFILLED' ](state, action) {},
    [ ActionsTypes.LOAD_PROFILE + '_REJECTED' ](state, action) {},
    [ ActionTypes.SELECT_PROFILE ](state, action) {}
}
```

## Example

```javascript
import unnestReducer from 'unnest-reducer';

const reducers = {
    [ ActionsTypes.LOAD_PROFILE ]: {
        PENDING(state, action) {},
        REJECTED(state, action) {},
        FULFILLED(state, action) {}
    },

    [ ActionTypes.SELECT_PROFILE ](state, action) {}
};

const reducer = unnestReducer(reducers, initialState);
//    ^^^^^^ -> Function that takes (state, action)
//              Will use `initialState` if `state` is omitted

// The typical Redux stuff:

const action = {
    type: ActionsTypes.SELECT_PROFILE,
    payload: {
        // ...
    }
};

const nextState = reducer( currentState, action );
```

### API

The package exports one function:

```javascript
unnestReducer(reducers, initialState = void 0, glue = '_', pre = identity)
```

- `reducers` - Object of reducer functions, will be flattened up to the first level
               using the `glue` parameter
- `initialState` - Initial state to use, default is `undefined`
- `glue` - String used to join nested names, default is `'_'`
- `pre` - Pre-processing function `(reducer function, key string) => function` that is passed the function and the (possibly nested)
          key of the reducer function. Must return a new function.
