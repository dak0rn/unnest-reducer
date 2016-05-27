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