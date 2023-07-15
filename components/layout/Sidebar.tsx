import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import { signOut } from "next-auth/react";

import SidebarItems from "./SidebarItems";
import SidebarLogo from "./SidebarLogo";
import SidebarTweetButton from "./SidebarTweetButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();
  const items = [
    {
      label: "Home",
      href: "/",
      icon: BsHouseFill,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: BsBellFill,
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      auth: true,
    },
  ];

  const handleLogout = useCallback(async () => {
    await signOut();
    toast.success("Logged out");
  }, []);

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end ">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItems
              key={item.href}
              href={item.href}
              auth={item.auth}
              label={item.label}
              icon={item.icon}
              alert={item.alert}
            />
          ))}
          {currentUser && (
            <SidebarItems
              onClick={handleLogout}
              icon={BiLogOut}
              label="Logout"
            />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
