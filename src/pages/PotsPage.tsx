import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PotsProgressBar from "../utilityComponents/PotsProgressBar";

const PotsPage = () => {
  return (
    <div>
      <SetTitle title="Pots" />
      <PotsProgressBar
        value={159}
        target={2000}
        color={theme.palette.secondary.main}
        bgColor={theme.palette.background.default}
      />
    </div>
  );
};

export default PotsPage;
