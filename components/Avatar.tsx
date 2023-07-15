import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

interface AvatarProps {
  userId: string;
  hasBorder?: boolean;
  isLarge?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userId, hasBorder, isLarge }) => {
  const { data: fetchUser } = useUser(userId);
  const router = useRouter();

  const onClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      const url = `/users/${userId}`;
      router.push(url);
    },
    [router, userId]
  );

  return (
    <div
      className={`
    ${hasBorder ? "border-4 border-black" : ""}
    ${isLarge ? "h-32" : "h-12"}
    ${isLarge ? "w-32" : "w-12"}

    rounded-full
    hover:opacity-90
    transtion
    cursor-pointer
    relative
    `}
    >
      <Image
        alt="avatar"
        onClick={onClick}
        style={{
          objectFit: "cover",
          borderRadius: "100%",
        }}
        fill
        src={fetchUser?.profileImage || "/images/placeholder.png"}
      />
    </div>
  );
};

export default Avatar;
