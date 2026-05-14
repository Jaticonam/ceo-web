import { useState } from "react";

export default function useUiState() {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingTxn, setEditingTxn] =
    useState(null);

  const openNewModal = () => {
    setEditingTxn(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTxn(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTxn(null);
  };

  return {
    isModalOpen,
    editingTxn,

    openNewModal,
    openEditModal,
    closeModal,
  };
}