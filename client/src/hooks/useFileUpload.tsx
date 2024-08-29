import { useState } from "react";
import { TReaderResult, TUfile } from "../app/Types";
import { toastWarning } from "../app/Toast";

const useFileUpload = () => {
  const [UFiles, setUFiles] = useState<TUfile>({
    visible: {
      image: false,
      video: false,
      file: false,
      audio: false,
    },
  });
  const [readerResults, setReaderResults] = useState<TReaderResult>();

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    if (file.type.includes("image")) {
      setUFiles({
        visible: {
          image: true,
          video: false,
          file: false,
          audio: false,
        },
      });
      return (reader.onload = () => {
        setReaderResults({
          image: reader.result,
        });

        setUFiles((pre) => ({
          ...pre,
          data: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file,
          },
          fileType: "image",
        }));
      });
    }

    if (file.type.includes("video")) {
      setUFiles({
        visible: {
          image: false,
          video: true,
          file: false,
          audio: false,
        },
      });

      return (reader.onload = () => {
        setReaderResults({
          video: URL.createObjectURL(file),
        });
        setUFiles((pre: any) => ({
          ...pre,
          data: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file,
          },
          fileType: "video",
        }));
      });
    }

    if (file.type.includes("audio")) {
      setUFiles({
        visible: {
          image: false,
          video: false,
          file: false,
          audio: true,
        },
      });
      return (reader.onload = () => {
        setReaderResults({
          audio: reader.result as string,
        });
        setUFiles((pre: any) => ({
          ...pre,
          data: {
            name: file.name,
            type: file.type,
            size: file.size,
            buffer: file,
          },
          fileType: "audio",
        }));
      });
    }

    if (file.type.includes("javascript") || file.type.includes("json"))
      return toastWarning("File type not allowed");

    /**
     * when @other file are selected
     */
    reader.onload = () => {
      setUFiles({
        visible: {
          image: false,
          video: false,
          file: true,
          audio: false,
        },
        data: {
          name: file.name,
          type: file.type,
          size: file.size,
          buffer: file,
        },
        fileType: "file",
      });
    };
  };
  return { setUFiles, UFiles, readerResults, handleUpload };
};

export default useFileUpload;
