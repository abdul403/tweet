import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasLiked = useMemo(() => {
    const list = fetchedPost?.likesIds || [];
    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.likesIds]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasLiked) {
        request = () => axios.delete("/api/like", { data: { postId } });
      } else {
        request = () => axios.post("/api/like", { postId });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();
      toast.success("success");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [
    loginModal,
    mutateFetchedPost,
    mutateFetchedPosts,
    hasLiked,
    currentUser,
    postId,
  ]);

  return {
    toggleLike,
    hasLiked,
  };
};

export default useLike;
