import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import BudgetsProgressBar from "../utilityComponents/BudgetsProgressBar";

const BudgetsPage = () => {
  return (
    <div>
      <SetTitle title="Budgets" />
      <BudgetsProgressBar
        value={15}
        total={50}
        color={theme.palette.secondary.main}
        bgColor={theme.palette.background.default}
      />
      <BudgetsProgressBar
        value={65}
        total={50}
        color={theme.palette.secondary.main}
        bgColor={theme.palette.background.default}
      />
    </div>
  );
};

export default BudgetsPage;
