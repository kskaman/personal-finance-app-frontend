import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import BudgetsPieChart from "../utilityComponents/BudgetsPieChart";
import BudgetsProgressBar from "../utilityComponents/BudgetsProgressBar";

const BudgetsPage = () => {
  const colors = [
    theme.palette.secondary.main,
    theme.palette.secondary.light,
    theme.palette.text.secondary,
    theme.palette.others.navy,
  ];
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
      <BudgetsPieChart
        spendings={[15, 150, 133, 40]}
        limit={975}
        colors={colors}
      />
    </div>
  );
};

export default BudgetsPage;
