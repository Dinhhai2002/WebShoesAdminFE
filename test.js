let arr = [[2, 2], [2, 2], [], [1, 2], []];
let newArr = [1, 2, 3, 4, 5]

let value = [1, 2]
let newValue = 1

const isPresent = arr.some(function (element) {
    return element[0] === value[0] && element[1] === value[1];
});

console.log(isPresent);
console.log(newArr.includes(newValue));
arr.push(value)
console.log(arr);