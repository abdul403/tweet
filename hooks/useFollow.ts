import { useCallback, useMemo } from "react";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useFollow = (userId: string) => {
  const { mutate: mutateFeetchedUser } = useUser(userId);

  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();

  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || [];
    return list.includes(userId);
  }, [userId, currentUser?.followingIds]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;
      if (isFollowing) {
        request = () => axios.delete("/api/follow", { data: { userId } });
      } else {
        request = () => axios.post("/api/follow", { userId });
      }

      await request();

      mutateCurrentUser();
      mutateFeetchedUser();
      toast.success("success");
    } catch (error) {
      toast.error("some thing went wrong");
    }
  }, [
    currentUser,
    mutateCurrentUser,
    mutateFeetchedUser,
    loginModal,
    isFollowing,

    userId,
  ]);

  return {
    isFollowing,
    toggleFollow,
  };
};

export default useFollow;
