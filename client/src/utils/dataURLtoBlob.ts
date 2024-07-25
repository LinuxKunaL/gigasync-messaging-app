const dataURLtoBlob = (dataURL: any) => {
  const splitDataUrl = dataURL.split(",");
  const byteString = atob(splitDataUrl[1]);
  const mimeString = splitDataUrl[0].split(":")[1].split(";")[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
};

export default dataURLtoBlob;
