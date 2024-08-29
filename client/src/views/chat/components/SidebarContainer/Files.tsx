import { useEffect, useState } from "react";

import {
  MdCss,
  MdHtml,
  MdClose,
  MdDelete,
  MdSearch,
  MdAndroid,
  MdDownload,
  MdMoreVert,
  MdInsertPhoto,
  MdBackupTable,
  MdJavascript,
  MdPictureAsPdf,
  MdOutlineDocumentScanner,
  MdVideoFile,
  MdMusicVideo,
  MdAudiotrack,
  MdFileCopy,
  MdVideocam,
  MdGroup,
  MdPerson,
  MdPerson3,
} from "react-icons/md";
import Icon from "../../../../components/interface/Icon";
import Input from "../../../../components/interface/Input";
import api from "../../../../utils/api";
import formatFileSize from "../../../../utils/formatFileSize";
import Dropdown from "../../../../components/interface/Dropdown";
import { handleCatchError } from "../../../../utils/ErrorHandle";
import convertTime from "../../../../utils/ConvertTime";
import downloadFile from "../../../../utils/DownloadFile";
import { PiWaveform } from "react-icons/pi";

type Props = {};

type TFile = {
  type: string;
  size: number;
  url: string;
  name: string;
  _id: string;
  timestamp: Date;
  chat: "single" | "group";
};

function Files({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const [filesList, setFilesList] = useState<TFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<TFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const FileIcon = {
    image: <MdInsertPhoto />,
    file: <MdFileCopy />,
    video: <MdVideocam />,
    audio: <MdAudiotrack />,
    recording: <PiWaveform />,
  };

  useEffect(() => {
    const filteredContacts = filesList.filter((file) =>
      file.name?.toLowerCase().includes(searchQuery?.toLowerCase() as string)
    );
    setFilteredFiles(filteredContacts);
  }, [searchQuery, filesList]);

  useEffect(() => {
    api
      .get("api/user/allFiles")
      .then((res) => setFilesList(res.data))
      .catch((err) => handleCatchError(err));
    return () => {};
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-lg xs:text-2xl font-semibold dark:text-bunker-300">
            Files
          </h1>
          <p className="text-xs sm:text-sm dark:text-bunker-500">View files</p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="text"
              placeholder="Search files"
              className=" absolute bottom-0 top-0"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon
              onClick={() => {setIsSearchVisible(false); setSearchQuery("")}}
              className="absolute bottom-1.5 right-2 sm:bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto h-full overflow-x-hidden scrollbar-bunker">
        {filteredFiles && filteredFiles?.length > 0 ? (
          filteredFiles.map((file) => (
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Icon variant="active">
                  {FileIcon[file.type as keyof typeof FileIcon]}
                </Icon>
                <div>
                  <div className="font-semibold flex dark:text-bunker-200 text-bunker-600 sm:text-base text-sm">
                    <p>{file?.name?.split(".")[0].slice(0, 25)}</p>
                    <p>.{file?.name?.split(".")[1]}</p>
                  </div>
                  <p className="flex items-center gap-1 sm:text-base text-xs sm:gap-2 dark:text-bunker-300 text-bunker-600">
                    {formatFileSize(file.size)}
                    <div className="size-1 rounded-full dark:bg-bunker-300/60 bg-bunker-300" />
                    {convertTime(file.timestamp, "day")}
                    {file.chat === "single" ? (
                      <MdPerson className="text-cyan-600" />
                    ) : (
                      <MdGroup className="text-cyan-600" />
                    )}
                  </p>
                </div>
              </div>
              <Dropdown
                options={[
                  {
                    element: (
                      <div
                        onClick={() =>
                          downloadFile(
                            `${process.env.REACT_APP_BACKEND_HOST}/api/default/getMedia/${file.url}`,
                            file.name
                          )
                        }
                        className="flex gap-3 items-center cursor-pointer"
                      >
                        <MdDownload className="size-6" />
                        download
                      </div>
                    ),
                  },
                ]}
                placement="right"
              >
                <Icon variant="transparent">
                  <MdMoreVert />
                </Icon>
              </Dropdown>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex justify-center items-center flex-col gap-2">
            <MdFileCopy className="text-xl sm:text-2xl text-cyan-400" />
            <p className="text-bunker-400 text-xs sm:text-sm">No files</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
