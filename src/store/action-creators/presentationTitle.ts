const changePresentationTitle = (newTitle: string) => ({
    type: 'CHANGE_PRESENTATION_TITLE' as const,
    payload: newTitle
})

export {
    changePresentationTitle,
}