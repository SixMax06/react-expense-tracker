const start = { alimentari: 52, intrattenimento: 40 }
//[{ name: category, value: total }, ...]

const end = Object.keys(start).map(key => ({ name: key, standard: start[key] }))

console.log(end)
