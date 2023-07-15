import { create } from "zustand";

interface useEditStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditModal = create<useEditStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditModal;
