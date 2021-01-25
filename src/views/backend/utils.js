import md5 from "md5";

const pwd = 'f0a4058fd33489695d53df156b77c724';
export const dontInput = "I don't want input the fucking pwd!!!"

export function checkPwd (v){
    return md5(v) === pwd
}