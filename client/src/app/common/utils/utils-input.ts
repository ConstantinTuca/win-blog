/* --------------------------------------- KEY NAVIGATION --------------------------------------- */
// export const KEY_NAVIGATION = (e: any, elementsRefArr: any, index: number) => {
//   let elem = null;

//   if (e.key === "ArrowLeft") {
//     elem = index > 0 && elementsRefArr[index - 1];
//   }

//   if (e.key === "ArrowRight") {
//     elem = index < elementsRefArr.length - 1 && elementsRefArr[index + 1];
//   }

//   if (elem) {
//     elem.current.focus();
//   }
// };

/* --------------------------------------- REPLACE DIACRITICS FOR FILTER --------------------------------------- */
export const REPLACE_DIACRITICS = (text: any) => text ? text.toLowerCase().normalize('NFKD').replace(/[^\w]/g, '') : '';

/* --------------------------------------- REPLACE ONLY DIACRITICS FOR FILTER --------------------------------------- */
export const REPLACE_ONLY_DIACRITICS = (text: any) => text ? text.normalize('NFKD').replace(/[^\w\s.\-_\/]/g, '') : '';
