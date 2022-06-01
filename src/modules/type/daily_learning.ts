import { CardFoldQuestion } from './cardFold';

export type DailySetting = {
    learning_card_list: number[],
    email: boolean,
    email_address?: string,
    custom_content?: CardFoldQuestion[],
    end_time: string,
}