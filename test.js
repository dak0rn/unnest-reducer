const test = require('tape');

// obtain :: () -> Function
const obtain = () => require('./index');

// createAction :: String -> Any -> Object
const createAction = (type, payload) => ({ type, payload });

test('Exports a function', t => {
    const unnestReducer = obtain();

    t.plan(1);
    t.equal(typeof unnestReducer, 'function');
    t.end();
});

test('Exported function takes three arguments', t => {
    const unnestReducer = obtain();

    t.plan(1);
    t.equal(unnestReducer.length, 3);
    t.end();
});

test('Exports the flatten function', t => {
    t.plan(1);
    const unnestReducer = obtain();
    t.equal(typeof unnestReducer, 'function');
    t.end();
});

test('Keeps the structure of a simple reducer definition', t => {

    const unnestReducer = obtain();

    // Reducer structure
    const reducers = {
        reducerA() { t.pass('reducerA'); },
        reducerB() { t.pass('reducerB'); },
        reducerC() { t.pass('reducerC'); }
    };

    const reducer = unnestReducer(reducers);

    t.plan(3);

    reducer( null, createAction('reducerA') );
    reducer( null, createAction('reducerB') );
    reducer( null, createAction('reducerC') );

    t.end();
});

test('Correctly flattens a nested reducer', t => {

    const unnestReducer = obtain();

    // The reducers
    const reducers = {
        reducer: {
            A() { t.pass('reducer_A'); }
        },
        reducerB() { t.pass('reducerB'); },
        reducerC() { t.pass('reducerC'); }
    };

    const reducer = unnestReducer(reducers);

    t.plan(3);

    reducer( null, createAction('reducer_A') );
    reducer( null, createAction('reducerB') );
    reducer( null, createAction('reducerC') );

    t.end();
});

test('The glue', t => {
    const unnestReducer = obtain();
    const glues = ['_', '', '$$', '42'];

    t.plan( glues.length );

    glues.forEach( glue => {
        t.comment(glue);
        const reducers = {
            level: {
                two() { t.pass(); }
            }
        };

        const name = `level${glue}two`;
        unnestReducer(reducers, null, glue)(null, createAction(name));
    });

    t.end();
});

test('Uses the initial state', t => {
    const unnestReducer = obtain();
    const initialState = 42;

    t.plan(2);

    const reducers = {
        def(state) {
            t.equals(state, initialState);
        },
        so: {
            nested(state) {
                t.equals(state, initialState);
            }
        }
    };

    const reducer = unnestReducer(reducers, initialState);

    reducer(void 0, createAction('def'));
    reducer(void 0, createAction('so_nested'));

    t.end();
});

test('Forwards given state', t => {
    const unnestReducer = obtain();
    const givenState = 3.1415926;

    const reducers = {
        first(state) {
            t.equal(state, givenState);
        },

        second: {
            reducer(state) {
                t.equal(state, givenState);
            }
        }
    };

    t.plan(2);

    const reducer = unnestReducer(reducers);

    reducer(givenState, createAction('first'));
    reducer(givenState, createAction('second_reducer'));

    t.end();
});
