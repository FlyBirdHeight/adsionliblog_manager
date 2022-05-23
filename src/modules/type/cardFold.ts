type CardFoldQuestion = {
    id?: number,
    title: string,
    solution: string,
    difficulty: string,
}
type CardFold = {
    id: number,
    title: string,
    questions: CardFoldQuestion[],
    creator: string,
    created_at: string,
    updated_at: string,
    sort: number,
    importance: boolean
}

type EditCardFold = {
    id?: number,
    title: string,
    questions: CardFoldQuestion[],
    creator: string,
    sort: number,
    importance: boolean
}

export {
    CardFold,
    EditCardFold,
    CardFoldQuestion
}