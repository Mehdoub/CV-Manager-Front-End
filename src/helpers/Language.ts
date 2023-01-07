type Langs = 'en' | 'fa'

export default class Language {
  public defaultLang = 'en' as const
  public lang: Langs = this.defaultLang
  public direction = 'ltr'
  public languagesObj = { en: 'ltr', fa: 'rtl' }
  public languagesArr = ['en', 'fa']

  public constructor() {
    return
  }

  static builder() {
    return new Language()
  }

  public changeDirection = (lang: Langs) => {
    if (typeof window !== 'undefined') {
      document.dir = this.languagesObj[lang]
    }
  }

  public getLanguage = () : any => {
    if (typeof window !== 'undefined') {
      let language = localStorage.getItem('language') as Langs ?? this.defaultLang
      if (!['en', 'fa'].includes(language)) {
        language = this.defaultLang
      }

      return language
    }
  }

  public setLanguageToLocal(lang: Langs) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }
}
