import axios from "axios";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";

const EditModal = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
  const editModal = useEditModal();

  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfileImage(currentUser?.profileImage);
    setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio);
  }, [currentUser]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch("/api/edit", {
        name,
        username,
        profileImage,
        coverImage,
        bio,
      });

      mutateFetchedUser();
      toast.success("updated");
      editModal.onClose();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [
    username,
    name,
    profileImage,
    coverImage,
    bio,
    mutateFetchedUser,
    editModal,
  ]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        value={profileImage}
        onChange={(image) => setProfileImage(image)}
        disabled={isloading}
        label="Upload profile image"
      />
      <ImageUpload
        value={coverImage}
        onChange={(image) => setCoverImage(image)}
        disabled={isloading}
        label="Upload cover image"
      />
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isloading}
      />
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isloading}
      />
      <Input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isloading}
      />
    </div>
  );

  return (
    <Modal
      disabled={isloading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionlabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
