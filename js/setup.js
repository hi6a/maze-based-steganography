// get the input, encrypt & shuffle mapping array index to cell based on seed from key

const key = "f4a1d9e8b2c790c5caf9d89f7df4fb83e63a6f4bc6f3557ab03e15dcfa204f09";
const arr = createArr(COLS, ROWS);
const seed = convertToBytes(key)[0];

var cipherText, binaryCipherText;

document.getElementById("myForm").addEventListener("submit",encryptMessage);

function encryptMessage(e){
  e.preventDefault();
  let message = document.getElementById("inputPlainText").value;
  cipherText = CryptoJS.AES.encrypt(message, key).toString();
  binaryCipherText = convertToBinary(convertToBytes(cipherText));
  if (binaryCipherText.length/4 > COLS*ROWS) {
    cipherText ="";
    binaryCipherText =""
    return alert("Message is too long!");
  }
  console.log("encrypted into: " + cipherText +" " + binaryCipherText + " of length "+ binaryCipherText.length );
generateMaze();
drawMaze();
}

function splitBinaryIntoCells(bits, size =4){
  var result =[];
  for(let i =0; i<bits.length; i+=size){
    result.push(bits.slice(i,i+size));
  }
  return result;
}

function shuffle(arr, seed){
  const rnd = mulberry32(seed);
  for (let i = arr.length -1; i>0 ; i-- ){
    let j = Math.floor(rnd()*(i+1));
    [arr[i],arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mulberry32(seed) {
  return function() {
    seed |= 0; 
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function convertToBytes(message){
  let wordArray = CryptoJS.enc.Base64.parse(message);
  let bytes = wordArray.words
  .flatMap(word => [
    (word >> 24) & 0xff,
    (word >> 16) & 0xff,
    (word >> 8) & 0xff,
    word & 0xff
  ])
  .slice(0, wordArray.sigBytes);
  return bytes;
}

function convertToBinary(bytes){
  let bitString = bytes
  .map(byte => byte.toString(2).padStart(8, "0"))
  .join("");
  return bitString.toString();
}