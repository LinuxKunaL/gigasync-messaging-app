const downloadFile = async (link: string, filename: string) => {
  const data = await fetch(link);
  const blob = await data.blob();
  const aTag = document.createElement("a");
  aTag.href = window.URL.createObjectURL(blob);
  aTag.download = filename;
  aTag.click();
};

export default downloadFile;
