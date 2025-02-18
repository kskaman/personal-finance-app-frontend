import { useState, useCallback } from "react";

const useModal = (initialState: boolean = false) => {
  // State to track if the modal is open or closed
  const [isOpen, setIsOpen] = useState(initialState);

  // Opens the modal
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Closes the modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);


  return { isOpen, openModal, closeModal };
};

export default useModal;
