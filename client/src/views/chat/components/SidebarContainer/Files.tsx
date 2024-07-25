import { useState } from "react";

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
} from "react-icons/md";
import Icon from "../../../../components/interface/Icon";
import Input from "../../../../components/interface/Input";
import Dropdown from "../../../../components/interface/Dropdown";


type Props = {};

function Files({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);
  const files = [
    {
      name: "File.apk",
      size: "2.5MB",
      icon: <MdAndroid />,
      color: "red",
      time: "1-1-2022",
    },
    {
      name: "DemoFile.pdf",
      size: "2.5MB",
      icon: <MdPictureAsPdf />,
      time: "1-1-2022",
      color: "pink",
    },
    {
      name: "DemoFile.pdf",
      size: "2.5MB",
      icon: <MdPictureAsPdf />,
      time: "1-1-2022",
      color: "pink",
    },
    {
      name: "DemoFile.csv",
      size: "2.5MB",
      icon: <MdBackupTable />,
      time: "1-1-2022",
      color: "green",
    },

    {
      name: "DemoFile.xls",
      size: "2.5MB",
      icon: <MdBackupTable />,
      time: "1-1-2022",
      color: "green",
    },
    {
      name: "DemoFile.doc",
      size: "2.5MB",
      icon: <MdOutlineDocumentScanner />,
      time: "1-1-2022",
      color: "blue",
    },
    {
      name: "DemoFile.css",
      size: "2.5MB",
      icon: <MdCss />,
      time: "1-1-2022",
      color: "sky",
    },
    {
      name: "DemoFile.svg",
      size: "2.5MB",
      icon: <MdInsertPhoto />,
      time: "1-1-2022",
      color: "yellow",
    },
    {
      name: "DemoFile.html",
      size: "2.5MB",
      icon: <MdHtml />,
      time: "1-1-2022",
      color: "brown",
    },
    {
      name: "DemoFile.js",
      size: "2.5MB",
      icon: <MdJavascript />,
      time: "1-1-2022",
      color: "yellow",
    },
  ];
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">Files</h1>
          <p className="text-sm dark:text-bunker-500">View files</p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="search"
              placeholder="Search files"
              className=" absolute bottom-0 top-0"
            />
            <Icon
              onClick={() => setIsSearchVisible(false)}
              className="absolute right-2 bottom-2"
              variant="transparent"
            >
              <MdClose />
            </Icon>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto h-full">
        <div className="flex flex-col gap-6">
          {files.map((i) => (
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Icon variant="active">{i.icon}</Icon>
                <div>
                  <h3 className="font-semibold dark:text-bunker-200 text-bunker-600">
                    {i.name}
                  </h3>
                  <p className="flex items-center gap-2 dark:text-bunker-300 text-bunker-600">
                    {i.size}
                    <div className="size-1 rounded-full dark:bg-bunker-600 bg-bunker-300" />
                    {i.time}
                  </p>
                </div>
              </div>
              <Dropdown
                options={[
                  {
                    element: (
                      <div className="flex gap-3 items-center cursor-pointer">
                        <MdDelete className="size-6" />
                        delete
                      </div>
                    ),
                  },
                  {
                    element: (
                      <div className="flex gap-3 items-center cursor-pointer">
                        <MdDownload className="size-6" />
                        download
                      </div>
                    ),
                  },
                ]}
                placement="left"
              >
                <Icon variant="transparent">
                  {" "}
                  <MdMoreVert />
                </Icon>
              </Dropdown>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Files;
