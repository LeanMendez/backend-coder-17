function addId(arr) {
    if (arr.length !== 0) {
      const elementos = new Array(...arr);
      const newId = elementos.pop();
      return newId.id + 1;
    }
    return 1;
  };
export {addId}