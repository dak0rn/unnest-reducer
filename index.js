/**
 * unnest-reducer
 *
 * Creates reducers for Redux from nested objects
 */

/**
 * Determines if the given whatever is an object.
 *
 * @param  {mixed}  what  Something
 * @return  {boolean}  `true` if it is an object
 */
const isObject = what => null !== what && !Array.isArray(what) && 'object' === typeof what;

/**
 * Flattens a nested object up to the first level.
 * Names are joined with the given string, '_' by default.
 *
 * Example:
 * ------BEFORE---------+---------AFTER-----------
 * {                    | {
 *   Parent: {          |    Parent_Child1() {
 *     Child1() {       |    },
 *     },               |
 *                      |    Parent_Child2() {
 *     Child2() {       |    },
 *     },               |
 *   },                 |    Firstlevel() {
 *                      |    }
 *   Firstlevel() {     |
 *   }                  | }
 * }                    |
 *
 * @param  {object}  target  Object to flatten
 * @param  {string=}  glue  Combining string, default '_'
 * @return  {object}  Flattened object
 */
const flatten = (target, glue) => {
    'undefined' !== typeof glue || (glue = '_');
    const output = {};
    const keys = Object.keys(target);

    keys.forEach(key => {
        const sub = target[key];

        // If it is not an object, copy as is
        if (!isObject(sub)) {
            output[key] = sub;
            return;
        }

        // We expect this to be a child element
        Object.keys(sub).forEach(subkey => {
            const name = [key, glue, subkey].join('');
            output[name] = sub[subkey];
        });
    });

    return output;
};

/**
 * Creates a reducer out of the given object of reducer functions and
 * the optional initial state. The reducer definitions can be nested.
 *
 * @param  {object}  reducer  Reducer definitions
 * @param  {any=}  initial  Initial state
 * @param  {string=}  glue  Join text, default '_'
 * @return  {function}  Reducer function
 */
module.exports = (reducers, initial, glue) => {
    const actual = flatten(reducers, glue);

    // The reducer
    return (state, action) => {
        state || (state = initial);
        const type = action.type;

        // Reducer for that action given?
        if ('function' === typeof actual[type]) return actual[type](state, action);

        return state;
    };
};

// Export the flattening function
module.exports.flatten = flatten;
