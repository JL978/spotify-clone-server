// export default function getLocale(){
//     let language = navigator.language
//     return language&&language.length === 2 ? language.split('-'):['en', 'CA']
// }
const getLocale = () => {
    const language = navigator.language;
    
    if (language && language.length === 2) {
      return language.split('-');
    }
    
    return ['en', 'CA'];
  };
  
  export default getLocale;
  