import { TFiles, TMediaTabProps, TPreviewMedia, TVoice } from "../Types";
import { useState } from "react";
import {
  MdAndroid,
  MdAudioFile,
  MdClose,
  MdCss,
  MdDownload,
  MdImage,
  MdTextFields,
  MdAttachFile,
  MdSlideshow,
  MdDescription,
  MdKeyboardVoice,
  MdLink,
  MdMusicNote,
  MdPictureAsPdf,
  MdVideocam,
  MdOutlineFilePresent,
  MdOutlinePlayCircleOutline,
} from "react-icons/md";
import {
  AiOutlineFileText,
  AiOutlineHtml5,
  AiOutlineFileExcel,
  AiOutlineFileWord,
  AiOutlineFileMarkdown,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

import Audio from "../../../../../components/interface/Audio";
import ModalWindow from "../../../../../components/interface/ModalWindow";
import downloadFile from "../../../../../utils/DownloadFile";
import VideoPlayer from "../../../../../components/interface/VideoPlayer";
import formatFileSize from "../../../../../utils/formatFileSize";
import Icon from "../../../../../components/interface/Icon";
import WaveAudio from "../../../../../components/interface/WaveAudio";

function MediaTab({
  mediaImages,
  mediaVideos,
  mediaAudios,
}: TMediaTabProps): JSX.Element {
  const [previewMedia, setPreviewMedia] = useState<TPreviewMedia>({
    image: "",
    video: "",
  });
  return (
    <>
      <div className="flex flex-col gap-3">
        <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdImage className="text-lg text-cyan-500" /> images
        </span>
        <div className="flex flex-wrap gap-4 relative overflow-hidden">
          {mediaImages?.length > 0 ? (
            <Swiper
              slidesPerView={2.3}
              grid={{
                rows: 1,
                fill: "row",
              }}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              modules={[Grid]}
              className="mySwiper cursor-grabd cursor-move"
            >
              {mediaImages?.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => setPreviewMedia({ image: url })}
                    className="size-[150px] rounded-lg overflow-hidden border-[1px] border-cyan-400/50 cursor-pointer "
                  >
                    <img
                      src={url}
                      className="rounded-lg h-full object-cover w-full hover:scale-105"
                      alt={`Demo Photo ${index + 1}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="m-auto h-[10pc] flex flex-col gap-2 sm:gap-3 items-center text-center justify-center">
              <MdImage className="text-lg sm:text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-sm">You have no images</p>
            </div>
          )}
          {/* <div className="absolute -top-10 -bottom-10 -left-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" />
            <div className="absolute -top-10 -bottom-10 -right-7 z-10 dark:bg-bunker-920 bg-white/80 w-16 blur-[20px]" /> */}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdVideocam className="text-lg text-cyan-500" /> videos
        </span>
        <div className="flex flex-wrap gap-4 relative overflow-hidden">
          {mediaVideos?.length > 0 ? (
            <Swiper
              slidesPerView={2.3}
              grid={{
                rows: 1,
                fill: "row",
              }}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              modules={[Grid]}
              className="mySwiper cursor-move gap-2"
            >
              {mediaVideos?.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    onClick={() => setPreviewMedia({ video: url })}
                    className="size-[150px] rounded-lg overflow-hidden border-[1px] border-cyan-400/50 cursor-pointer relative "
                  >
                    <video
                      src={url}
                      className="rounded-lg h-full object-cover w-full hover:scale-105"
                      muted
                      controls={false}
                    />
                    <div className="z-10 bg-bunker-900/50 hover:bg-bunker-900/80 flex items-center justify-center top-0 bottom-0 left-0 right-0 size-full absolute">
                      <MdOutlinePlayCircleOutline className="text-bunker-300 text-3xl" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="m-auto h-[10pc] flex flex-col gap-3 items-center text-center justify-center">
              <MdVideocam className="text-lg sm:text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-sm">You have no video</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
          <MdMusicNote className="text-lg text-cyan-500" /> audio
        </span>
        <div className="flex flex-wrap gap-3 sm:gap-4 relative overflow-hidden">
          {mediaAudios?.length > 0 ? (
            mediaAudios?.map((url, index) => (
              <div
                className="dark:bg-bunker-900/60 bg-bunker-50 p-1.5 sm:p-2 rounded-md w-full"
                key={index}
              >
                <Audio variant="receiver" isDownload={false} src={url} />
              </div>
            ))
          ) : (
            <div className="m-auto h-[10pc] flex flex-col gap-3 items-center text-center justify-center">
              <MdAudioFile className="text-lg sm:text-2xl text-cyan-400 " />
              <p className="text-bunker-400 text-sm">You have no audio</p>
            </div>
          )}
        </div>
      </div>
      {previewMedia?.image && (
        <ModalWindow>
          <div className="flex h-2/4 relative flex-col gap-3 p-3 dark:bg-bunker-910 bg-bunker-50 rounded-md">
            <div
              onClick={() => setPreviewMedia({ image: "", video: "" })}
              className="absolute cursor-pointer top-0 right-0 bg-cyan-600 rounded-tr-md rounded-bl-md text-bunker-50 p-3 text-lg"
            >
              <MdClose />
            </div>
            <div
              onClick={() =>
                downloadFile(previewMedia.image as string, "image")
              }
              className="absolute cursor-pointer top-0 left-0 bg-cyan-600 rounded-lr-md rounded-br-md text-bunker-50 p-3 text-lg"
            >
              <MdDownload />
            </div>
            <img
              className="w-full h-full object-cover rounded-md"
              src={previewMedia.image}
              alt=""
            />
          </div>
        </ModalWindow>
      )}
      {previewMedia?.video && (
        <ModalWindow>
          <div className="relative">
            <div
              onClick={() => setPreviewMedia({ image: "", video: "" })}
              className="absolute cursor-pointer -top-0 -right-0 bg-cyan-600 rounded-tr-md rounded-bl-md text-bunker-50 z-10 p-2"
            >
              <MdClose />
            </div>
            <VideoPlayer src={previewMedia.video} />
          </div>
        </ModalWindow>
      )}
    </>
  );
}

function FilesTab({ files }: { files?: TFiles[] }) {
  const formatName = (str: string): string => {
    return (
      str.split(".")[0].slice(0, 15) +
      "..." +
      str.split(".")[0].slice(15, 18) +
      "." +
      str.split(".")[1]
    );
  };

  const addIcon = (format: string) => {
    switch (format) {
      case "css":
        return <MdCss />;
      case "pdf":
        return <MdPictureAsPdf />;
      case "apk":
        return <MdAndroid />;
      case "doc":
      case "docx":
        return <AiOutlineFileWord />;
      case "odt":
        return <MdTextFields />;
      case "xls":
      case "xlsx":
        return <AiOutlineFileExcel />;
      case "ppt":
      case "pptx":
        return <MdSlideshow />;
      case "txt":
        return <AiOutlineFileText />;
      case "md":
        return <AiOutlineFileMarkdown />;
      case "html":
        return <AiOutlineHtml5 />;
      case "azw":
        return <MdDescription />;
      case "csv":
        return <MdDescription />;
      case "yaml":
      case "yml":
        return <MdDescription />;
      default:
        return <MdAttachFile />;
    }
  };

  const downloadFile = async (link: string, filename: string) => {
    const data = await fetch(link);
    const blob = await data.blob();
    const aTag = document.createElement("a");
    aTag.href = window.URL.createObjectURL(blob);
    aTag.download = filename;
    aTag.click();
  };

  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdOutlineFilePresent className="text-lg text-cyan-500" /> Files
      </span>
      <div className="flex flex-col gap-4 sm:gap-6 h-full">
        {files && files.length > 0 ? (
          files.map((file) => (
            <div className="flex gap-2 items-center justify-between w-full">
              <div className="flex gap-2 items-center w-min truncate">
                <Icon variant="active">{addIcon(file.format as string)}</Icon>
                <div className="truncate">
                  <h3 className="font-semibold sm:text-base text-sm dark:text-bunker-200 text-bunker-600">
                    {formatName(file.name as string)}
                  </h3>
                  <p className="text-xs sm:text-base flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                    <span className="text-xs">
                      {formatFileSize(file.size as number)}
                    </span>
                    <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                    {new Date(file.date as string).toDateString()}
                  </p>
                </div>
              </div>
              <Icon
                onClick={() => downloadFile(file.url as string, file.name)}
                variant="transparent"
              >
                <MdDownload />
              </Icon>
            </div>
          ))
        ) : (
          <div className="w-[22pc] h-full flex flex-col items-center justify-center">
            <MdOutlineFilePresent className="text-xl text-cyan-400" />
            <p className="text-sm dark:text-bunker-300 text-bunker-500">
              files not found
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function LinksTab({ links }: { links?: string[] }) {
  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdLink className="text-lg text-cyan-500" /> Links
      </span>
      <div className="flex flex-col gap-6 h-full">
        {links && links.length > 0 ? (
          links.map((url) => (
            <div>
              <h1 className="text-sm font-semibold dark:text-bunker-200 text-bunker-600">
                {url.split("/")[2]}
              </h1>
              <Link
                className="text-xs underline dark:text-cyan-600/80 text-bunker-400"
                to={url}
                target="_blank"
              >
                {url}
              </Link>
            </div>
          ))
        ) : (
          <div className="w-[22pc] h-full flex flex-col items-center justify-center">
            <MdLink className="text-xl text-cyan-400" />
            <p className="text-sm dark:text-bunker-300 text-bunker-500">
              links not found
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function VoiceTab({ voices }: { voices?: TVoice[] }) {
  return (
    <>
      <span className="text-xs dark:text-bunker-300 text-bunker-500 flex items-center gap-2">
        <MdKeyboardVoice className="text-lg text-cyan-500" /> Voice
      </span>
      <div className="flex flex-col gap-3 sm:gap-6 h-full">
        {voices && voices.length > 0 ? (
          voices?.map((record, index) => (
            <div className="dark:bg-bunker-900/60 bg-bunker-50 p-2 sm:p-4 rounded-md flex flex-row gap-2 items-center">
              <WaveAudio
                id={index.toString()}
                variant="receiver"
                key={record.date}
                src={record.url}
              />
            </div>
          ))
        ) : (
          <div className="w-[22pc] h-full flex flex-col items-center justify-center">
            <MdKeyboardVoice className="text-xl text-cyan-400" />
            <p className="text-sm dark:text-bunker-300 text-bunker-500">
              links not found
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export { FilesTab, LinksTab, VoiceTab, MediaTab };
