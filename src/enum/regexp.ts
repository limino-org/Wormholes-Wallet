// http/https 
export const RegUrl: RegExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;


// Checks a non-zero positive integer
export const RegNum1: RegExp = /^\+?[1-9][0-9]*$/

// digital
export const regNum2: RegExp = /^[1-9]*[1-9][0-9]*$/


export const regPassword1: RegExp = /^.{6,20}$/


// 1-10
export const regRoyalty :RegExp=/^\d{1,10}$/

// 4 to 120 characters, Chinese. English. numeral. underline  
 export const collectibleRules:RegExp= /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){4,120}$/

// CN/EN/Number
export const regExchangeName: RegExp =  /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){4,60}$/