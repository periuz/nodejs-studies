import { Slug } from "./value-objects/slug"
import { Entity } from "../../core/entities/entity"

export interface QuestionProps {
    title: string
    slug: Slug
    content: string
    authorId: string
}

export class Question extends Entity<QuestionProps> {

}   