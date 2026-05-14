export default function useTransactionActions({
  addTransaction,
  updateTransaction,
}) {
  const handleSave = (data) => {
    if (data.id) {
      updateTransaction(data.id, data);
    } else {
      addTransaction(data);
    }
  };

  return {
    handleSave,
  };
}