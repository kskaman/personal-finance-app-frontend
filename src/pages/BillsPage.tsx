import { Box, Stack, Typography } from "@mui/material";
import SetTitle from "../components/SetTitle";
import theme from "../theme/theme";
import PageDiv from "../utilityComponents/PageDiv";
import { useContext, useEffect, useRef, useState } from "react";
import { RecurringDataContext } from "../context/RecurringContext";
import Total from "../components/billsComponents/Total";
import Summary from "../components/billsComponents/Summary";
import BillsTable from "../components/billsComponents/BillsTable";
import SubContainer from "../utilityComponents/SubContainer";

const BillsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const recurringBills = useContext(RecurringDataContext).recurringBills;
  const totalBill = Math.abs(
    recurringBills.reduce((sum, bill) => sum + bill.amount, 0)
  );

  return (
    <>
      <SetTitle title="Recurring Bills" />
      <Box ref={containerRef}>
        <PageDiv>
          <Stack direction="column" gap="32px">
            <Typography
              width="100%"
              height="56px"
              fontSize="32px"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              Recurring Bills
            </Typography>
            <Stack direction="column" gap="24px">
              <Stack
                gap="24px"
                width="100%"
                direction={
                  parentWidth > 900
                    ? "column"
                    : parentWidth > 500
                    ? "row"
                    : "column"
                }
              >
                <Total parentWidth={parentWidth} totalBill={totalBill} />
                <Summary />
              </Stack>
              <SubContainer>
                <Stack>
                  <BillsTable bills={recurringBills} />
                </Stack>
              </SubContainer>
            </Stack>
          </Stack>
        </PageDiv>
      </Box>
    </>
  );
};

export default BillsPage;
