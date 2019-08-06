function useGetList(givenUID, lists) {
    for (let list in lists) {
        if (lists[list].UID === givenUID) {
            return {Items: lists[list].Items, Title: lists[list].Title, Index: list};
        }
    }
}

export default useGetList;