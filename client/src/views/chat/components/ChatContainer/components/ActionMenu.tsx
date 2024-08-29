import { useEffect, useRef } from "react";
import Icon from "../../../../../components/interface/Icon";
import { MdClose, MdCopyAll, MdDelete, MdReply } from "react-icons/md";
import { toastChoice, toastSuccess } from "../../../../../app/Toast";

export const ActionMenu = ({
  props,
  RChatBody,
  actionMenu,
  SUserProfile,
  setActionMenu,
  handleDeleteMessage,
}: any) => {
  const RActionMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (RActionMenu.current) {
      RChatBody.current.classList.add("no-scroll");
    }
    return () => {
      RChatBody.current?.classList.remove("no-scroll");
    };
  }, [RChatBody]);

  return (
    <div
      ref={RActionMenu}
      className="absolute left-0 p-2 dark:bg-bunker-920/60 bg-bunker-200/70 sm:p-2 w-full z-20 flex justify-between items-center animate-fade-in backdrop-blur-md"
    >
      <div className="dark:bg-bunker-920 bg-bunker-50 backdrop-blur-mds p-1 w-full sm:p-3 rounded-lg flex justify-between items-center">
        <Icon
          onClick={() => setActionMenu({ visible: false })}
          variant="transparent"
        >
          <MdClose className="text-bunker-800 dark:text-bunker-100" />
        </Icon>
        <div className="flex gap-1 items-center">
          <Icon
            onClick={() => {
              navigator.clipboard.writeText(actionMenu.message?.message.text);
              toastSuccess("Copied to clipboard");
              setActionMenu({ visible: false });
            }}
            variant="transparent"
          >
            <MdCopyAll className="text-bunker-800 dark:text-bunker-100" />
          </Icon>
          <Icon
            onClick={() => {
              props?.setReplyMessage({
                visible: !!actionMenu.message?.message.text,
                data: actionMenu.message?.message.text
                  ? actionMenu.message
                  : null,
              });
              setActionMenu({ visible: false });
            }}
            variant="transparent"
          >
            <MdReply className="text-bunker-800 dark:text-bunker-100" />
          </Icon>
          {SUserProfile._id === actionMenu.message?.sender?._id && (
            <Icon
              onClick={() => {
                toastChoice(
                  () =>
                    handleDeleteMessage(
                      actionMenu.message._id,
                      actionMenu.message?.sender?._id
                    ),
                  "you want delete"
                );
                setActionMenu({ visible: false });
              }}
              variant="transparent"
            >
              <MdDelete className="text-red-400" />
            </Icon>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;
