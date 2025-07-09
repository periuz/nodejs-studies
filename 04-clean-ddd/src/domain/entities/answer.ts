import { Entity } from "../../core/entities/entity"

export interface AnswerProps {
    authorId: string
    questionId: string
    content: string
}

export class Answer extends Entity<AnswerProps> {
    get content() {
        return this.props.content
    }
}