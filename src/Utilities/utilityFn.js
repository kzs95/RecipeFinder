export function captialise(str){
    const regExp = /\b\w+?/g;
    if (typeof str !== 'string') return;
    return str.replaceAll(regExp,(letter)=>letter.toUpperCase());
}
