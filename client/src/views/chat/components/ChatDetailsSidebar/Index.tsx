import ChatGroup from "./ChatGroup";
import ChatSingle from "./ChatSingle";
import { PROPSChatDetailsSidebar } from "./Types";

function Index({ props }: PROPSChatDetailsSidebar) {
  if (props.type === "single") return <ChatSingle />;

  if (props.type === "group") return <ChatGroup id={props.id} />;

  return null;
}

export default Index;
