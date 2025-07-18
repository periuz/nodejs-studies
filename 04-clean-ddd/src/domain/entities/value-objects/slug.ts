export class Slug {
    public value: string

    constructor(value: string) {
        this.value = value
    }

    /**
     * Receives a string and normalize it as a slug
     * 
     * Example: "an example title => "an-example-title
     * 
     * @param text 
     */

    static createFromText(text: string) {
        const slugText = text
            .normalize("NFKD")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/_/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '')

            return new Slug(slugText)
        }

        

}