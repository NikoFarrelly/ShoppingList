import {combineReducers} from "redux";

const INITIAL_STATE = {
    lists: [],
};

const rootReducer = (state = INITIAL_STATE, action) => {
    const { lists } = state;
    const payload = action.payload;

    switch (action.type) {

        case "SAVE_LIST":
            lists.push(payload);
            return { ...state, lists: lists};

        case "UPDATE_LIST":
            const index = payload[0];
            const updatedList = payload[1];

            lists[index] = updatedList;
            return { ...state, lists: lists };

        case "DELETE_LIST":
            lists.splice(payload, 1);
            return { ...state, lists: lists };

        default:
            return state
    }
};


export default combineReducers({
    shoppingList: rootReducer,
});