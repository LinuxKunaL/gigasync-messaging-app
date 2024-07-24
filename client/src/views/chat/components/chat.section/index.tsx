import { useSelector } from "react-redux";
import { TUser } from "../../../../app/Types";
import Body from "./components/Body";
import PhoneChat from "../../../../assets/svgs/PhoneChat";
type Props = {};

function Index({}: Props) {
  const { _id }: TUser = useSelector((state: any) => state.currentChat);

  return (
    <>
      {_id ? (
        <Body />
      ) : (
        <div className="dark:bg-bunker-950 h-full w-full flex flex-col justify-center items-center relative">
          <div className="flex gap-2 flex-col justify-center items-center">
            <PhoneChat />
            <h1 className="text-2xl font-semibold dark:text-bunker-300">
              GigaSync
            </h1>
            <p className="text-bunker-400 text-sm text-center">
              Send and receive files and messages with GigaSync app , <br /> on
              your website. fast and secure.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Index;
