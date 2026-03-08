import React, { createContext, useContext } from 'react';
import { TabKey } from './components/Header';

export type Theme = {
  ring: string;
  text: string;
  bgWhiteText: string;
  bgSolid: string;
  bgSolidHover: string;
  ringLight: string;
  selectionBg: string; // for selection::bg-
};

export const PS_THEME: Theme = {
  ring: 'ring-psBlue',
  text: 'text-psBlue',
  bgWhiteText: 'bg-white text-psBlue shadow-sm ring-1 ring-psBlue',
  bgSolid: 'bg-psBlue',
  bgSolidHover: 'hover:bg-psBlueHover',
  ringLight: 'focus-visible:ring-psBlueLight',
  selectionBg: 'selection:bg-psBlue',
};

export const NINTENDO_THEME: Theme = {
  ring: 'ring-nintendoRed',
  text: 'text-nintendoRed',
  bgWhiteText: 'bg-white text-nintendoRed shadow-sm ring-1 ring-nintendoRed',
  bgSolid: 'bg-nintendoRed',
  bgSolidHover: 'hover:bg-nintendoRedHover',
  ringLight: 'focus-visible:ring-nintendoRedLight',
  selectionBg: 'selection:bg-nintendoRed',
};

export const XBOX_THEME: Theme = {
  ring: 'ring-xboxGreen',
  text: 'text-xboxGreen',
  bgWhiteText: 'bg-white text-xboxGreen shadow-sm ring-1 ring-xboxGreen',
  bgSolid: 'bg-xboxGreen',
  bgSolidHover: 'hover:bg-xboxGreenHover',
  ringLight: 'focus-visible:ring-xboxGreenLight',
  selectionBg: 'selection:bg-xboxGreen',
};

export function getThemeForTab(tab: TabKey | undefined): Theme {
  if (tab === 'Nintendo Switch') return NINTENDO_THEME;
  if (tab === 'PC') return XBOX_THEME;
  return PS_THEME;
}

const ThemeContext = createContext<Theme>(PS_THEME);

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
