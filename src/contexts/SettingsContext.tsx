/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import * as React from 'react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_SETTINGS, INITIAL_SETTINGS, SettingName } from '../appSettings';


type ViewMode = 'grid' | 'list' | 'card';

type SettingsContextShape = {
  setOption: (name: SettingName, value: boolean) => void;
  settings: Record<SettingName, boolean>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

const Context: React.Context<SettingsContextShape> = createContext({
  setOption: (_name: SettingName, _value: boolean) => {
    return;
  },
  settings: INITIAL_SETTINGS,
  viewMode: 'grid' as ViewMode,
  setViewMode: (_mode: ViewMode) => {
    return;
  },
});

export const SettingsContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [viewMode, setViewModeState] = useState<ViewMode>('grid');

  const setOption = useCallback((setting: SettingName, value: boolean) => {
    setSettings((options) => ({
      ...options,
      [setting]: value,
    }));
    setURLParam(setting, value);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('viewMode', mode);
  }, []);

  // Load viewMode from localStorage on mount
  React.useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode') as ViewMode | null;
    if (savedViewMode && ['grid', 'list', 'card'].includes(savedViewMode)) {
      setViewModeState(savedViewMode);
    }
  }, []);

  const contextValue = useMemo(() => {
    return {setOption, settings, viewMode, setViewMode};
  }, [setOption, settings, viewMode, setViewMode]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useSettings = (): SettingsContextShape => {
  return useContext(Context);
};

function setURLParam(param: SettingName, value: null | boolean) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  if (value !== DEFAULT_SETTINGS[param]) {
    params.set(param, String(value));
  } else {
    params.delete(param);
  }
  url.search = params.toString();
  window.history.pushState(null, '', url.toString());
}