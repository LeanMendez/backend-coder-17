export function calcRandomNumbers(num) {
  const objeto = {};
  for (let i = 0; i < num; i++) {
    let keyNumber = Math.ceil(Math.random() * 1000);

    if (objeto[keyNumber]) {
      objeto[keyNumber]++;
    } else {
      objeto[keyNumber] = 1;
    }
  }
  return objeto;
}
