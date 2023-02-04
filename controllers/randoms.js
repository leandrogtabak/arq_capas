const getOneRandom = () => Math.ceil(Math.random() * 1000);

const generateRandoms = (cant) => {
  const numbers = {};
  for (let i = 0; i < cant; i++) {
    const randomNumber = getOneRandom();
    Object.keys(numbers).includes(randomNumber.toString()) ? numbers[randomNumber]++ : (numbers[randomNumber] = 1);
  }
  return numbers;
};

process.on('message', (cant) => {
  const numeros = generateRandoms(cant);
  process.send(numeros);
  process.exit();
});
