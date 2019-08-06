export const saveList = list => (
    {
        type: 'SAVE_LIST',
        payload: list,
    }
);

export const deleteList = list => (
    {
        type: 'DELETE_LIST',
        payload: list,
    }
);

export const  updateList = list => (
    {
        type: 'UPDATE_LIST',
        payload: list,
    }
);