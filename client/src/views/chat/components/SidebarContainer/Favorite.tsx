import React, { useState } from "react";
import { MdClose, MdSearch, MdStar } from "react-icons/md";
import Icon from "../../../../components/interface/Icon";
import Input from "../../../../components/interface/Input";

type Props = {};

function Favorite({}: Props) {
  const [isSearchVisible, setIsSearchVisible] = useState<Boolean>(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="self-start flex items-center justify-between w-full relative">
        <div>
          <h1 className="text-2xl font-semibold dark:text-bunker-300">
            Favorite
          </h1>
          <p className="text-sm dark:text-bunker-500">Start Conversation</p>
        </div>
        <Icon onClick={() => setIsSearchVisible(true)} variant="transparent">
          <MdSearch />
        </Icon>
        {isSearchVisible ? (
          <div id="search" className="absolute w-full h-full">
            <Input
              type="search"
              placeholder="Search chat"
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
      <div className="flex flex-row justify-between items-center py-4 px-4 hover:dark:bg-bunker-900/60 hover:bg-bunker-100/70 rounded-lg cursor-pointer">
        <div className="flex gap-2 items-center">
          <img
            src="https://angular.pixelstrap.net/chitchat/assets/images/contact/1.jpg"
            alt=""
            className="size-14 rounded-full border-[3px] border-cyan-400/70"
          />
          <div>
            <h1 className="text-lg font-normal dark:text-bunker-50 text-bunker-600">
              Kunal lokhande
            </h1>
            <p className="text-bunker-400 text-sm">
              hii brir dsaias asasd as.....
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end gap-1">
          <MdStar className="size-6 text-cyan-400" />
        </div>
      </div>
    </div>
  );
}

export default Favorite;
