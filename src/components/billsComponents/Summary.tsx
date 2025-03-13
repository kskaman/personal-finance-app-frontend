import { Divider, List, ListItem, Typography, useTheme } from "@mui/material";
import SubContainer from "../../utilityComponents/SubContainer";
import { formatNumber } from "../../utils/utilityFunctions";
import { useContext } from "react";
import { RecurringDataContext } from "../../context/RecurringContext";
import { SettingsContext } from "../../context/SettingsContext";

const Summary = () => {
  const theme = useTheme();
  const summaryData = {
    paid: { label: "Paid Bills" },
    unpaid: {
      label: "Total Upcoming",
    },
    dueSoon: { label: "Due Soon" },
    due: { label: "Due" },
  };

  //! if you haven't already, look into object destructuring. It's a very useful feature when working with objects in JS/TS and improves readability. It's less noticeable here as you are only using one property from the object, but it can be very useful when you need to use multiple properties from an object.
  //! ex: const { recurringSummary } = useContext(RecurringDataContext);

  const recurringSummary = useContext(RecurringDataContext).recurringSummary;
  const showDue = recurringSummary.due.count !== 0;

  const currencySymbol = useContext(SettingsContext).selectedCurrency;

  return (
    <>
      <SubContainer gap="20px" width="100%" padding={{ xs: "20px" }}>
        <Typography
          fontSize="16px"
          fontWeight="bold"
          color={theme.palette.primary.main}
        >
          Summary
        </Typography>
        <List>
          {Object.entries(recurringSummary)
            .filter(([key]) => key !== "due" || showDue)
            .map(([key, summary], index) => {
              const typedKey = key as keyof typeof summaryData;
              const isDue = key === "due";
              return (
                //! We generally don't want to use an index as a key for a list because the index can change if the list is modified and that can cause issues in React. You're passing a string key in so you can use that as the key instead.
                <div key={index}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "16px 0",
                      padding: 0,
                    }}
                  >
                    <Typography
                      fontSize={isDue ? "14px" : "12px"}
                      fontWeight={isDue ? "bold" : "normal"}
                      color={
                        isDue
                          ? theme.palette.others.red
                          : theme.palette.primary.light
                      }
                    >
                      {summaryData[typedKey].label}
                    </Typography>
                    <Typography
                      fontSize={isDue ? "14px" : "12px"}
                      fontWeight="bold"
                      color={
                        key === "dueSoon" || isDue
                          ? theme.palette.others.red
                          : theme.palette.primary.main
                      }
                    >
                      {`${summary.count} (${currencySymbol}${formatNumber(
                        summary.total
                      )})`}
                    </Typography>
                  </ListItem>

                  {/* We want to avoid magic numbers. It's theoretically fine, but if you decide to modify the array and suddenly there is an extra item, now you have to remember to come fix this or there will be a bug in the code. .map has an array parameter after the index that you can use to check the length of the array being mapped over and you can use the array.length to determine where the dividers should be */}
                  {index < 3 && <Divider key={key} />}
                </div>
              );
            })}
        </List>
      </SubContainer>
    </>
  );
};

export default Summary;
