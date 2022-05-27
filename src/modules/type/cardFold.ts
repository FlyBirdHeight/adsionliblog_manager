type CardFoldQuestion = {
    id?: number,
    title: string,
    solution: string,
    difficulty: number,
    created_at?: string,
    updated_at?: string,
    learning_card_id?: number,
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
    importance: number,
    created_at?: string,
    updated_at?: string,
    question_count?: number
}

export {
    CardFold,
    EditCardFold,
    CardFoldQuestion
}