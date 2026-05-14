export default function useMonthNavigation({ setSelectedMonth }) {
  const handlePrevMonth = () => {
    setSelectedMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return {
    handlePrevMonth,
    handleNextMonth,
  };
}