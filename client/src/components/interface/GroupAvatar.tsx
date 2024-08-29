import React from "react";

function GroupAvatar({ groupId }: { groupId: string }) {
  return (
    <div className="size-12 rounded-full overflow-hidden">
      <img
        className="rounded-full object-cover w-full h-full"
        src={`${process.env.REACT_APP_BACKEND_HOST}/api/default/avatar?id=${groupId}&type=group`}
        alt="group avatar"
      />
    </div>
  );
}

export default GroupAvatar;
