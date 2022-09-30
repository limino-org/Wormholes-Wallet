// http/https 
export const RegUrl: RegExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;


// Checks a non-zero positive integer
export const RegNum1: RegExp = /^\+?[1-9][0-9]*$/

// digital
export const regNum2: RegExp = /^[1-9]*[1-9][0-9]*$/

// Chinese and English numbers
export const regExchangeName: RegExp = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g

export const regPassword1: RegExp = /^.{6,20}$/