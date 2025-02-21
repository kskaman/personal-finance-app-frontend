import { MarkerTheme, Pot } from "../types/Data";

export const updateUsedStatuses = (
  pots: Pot[],
  markerThemes: MarkerTheme[]
): { updatedMarkerThemes: MarkerTheme[] } => {
  const updatedMarkerThemes = markerThemes.map((theme) => ({
    ...theme,
    usedInPots: pots.some(
      (pot) =>
        pot.theme.toLowerCase() === theme.colorCode.toLowerCase()
    ),
  }));

  return { updatedMarkerThemes };
};
