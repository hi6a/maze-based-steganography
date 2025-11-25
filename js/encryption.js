// get the input, encrypt & shuffle mapping array index to cell based on seed from key

const key = "f4a1d9e8b2c790c5caf9d89f7df4fb83e63a6f4bc6f3557ab03e15dcfa204f09";
const seed = convertToBytes(key)[0];

var message, cipherText, binaryCipherText;
var chunkedBits=[];

document.getElementById("myForm").addEventListener("submit",encryptMessage);

function encryptMessage(e){
  e.preventDefault();
 clearScene();
  message = document.getElementById("inputPlainText").value;
  cipherText = CryptoJS.AES.encrypt(message, key).toString();
  binaryCipherText = convertToBinary(convertToBytes(cipherText));
  if (binaryCipherText.length/4 > COLS*ROWS) {
    cipherText ="";
    binaryCipherText =""
    return alert("Message is too long!");
  }
  console.log("encrypted into: " + cipherText +" " + binaryCipherText + " of length "+ binaryCipherText.length );
  chunkedBits = splitBinaryIntoCells(binaryCipherText);
  generateMaze();
  drawMaze();

loadModels(() => {
  buildMaze3D();
  addBgProps();
  animate();
});

}

function splitBinaryIntoCells(bits, size =4){
  var result =[];
  for(let i =0; i<bits.length; i+=size){
    result.push(bits.slice(i,i+size));
  }
  return result;
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