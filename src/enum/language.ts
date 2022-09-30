export const languages: Array<Language> = [
    {
        label:'简体中文',
        value:'zh',
        info:'SIMPLIFIED CHINESE'
    },
    {
        label:'English',
        value:'en',
        info:'ENGLISH'
    }
]

export type Language = {
    label: string
    value: string
    info: string
}