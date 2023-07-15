import Form from "@/components/Form";
import Header from "@/components/Header";
import PostItem from "@/components/posts/PostItem";
import CommentFeed from "@/components/posts/CommentFeed";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const PostView = () => {
  const router = useRouter();

  const { postId } = router.query;

  const { data: fetchedPosts, isLoading } = usePost(postId as string);

  if (isLoading || !fetchedPosts) {
    <div className=" flex justify-center items-center">
      <ClipLoader />
    </div>;
  }

  return (
    <div>
      <Header label="Tweet" showBackArrow />

      <PostItem data={fetchedPosts} />
      <Form
        postId={postId as string}
        isComment
        placeholder="Tweet your reply"
      />
      <CommentFeed comments={fetchedPosts?.comments} />
    </div>
  );
};

export default PostView;
