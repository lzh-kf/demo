let s = Symbol();
let s1 = Symbol();
const obj = {};
obj[s] = 456
obj[s1] = 789
console.log(obj)