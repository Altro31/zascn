"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { Fragment, useEffect, useState, ReactNode } from "react";

type TabItem = {
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

type TabsWithIconsProps = {
  tabs: TabItem[];
  activeColorClass?: string;
  /**
   * Callback fired when the selected tab changes.
   * @param index The index of the newly selected tab.
   */
  handleChange?: (index: number) => void;
};

/**
 * Renders a set of tabs with icons, supporting active and disabled states.
 *
 * @component
 * @param {TabsWithIconsProps} props - The props for the TabsWithIcons component.
 * @param {Array} props.tabs - An array of tab objects, each containing an icon, label, content, and optional disabled state.
 * @param {string} [props.activeColorClass="bg-warning text-white"] - The CSS classes applied to the active tab.
 * @param {function} [props.handleChange] - Callback fired when the selected tab changes, receives the tab index as parameter.
 *
 * @returns {JSX.Element | null} The rendered tab component, or null if not mounted.
 *
 * @example
 * ```tsx
 * <TabsWithIcons
 *   tabs={[
 *     { icon: <HomeIcon />, label: "Home", content: <HomeContent /> },
 *     { icon: <UserIcon />, label: "Profile", content: <ProfileContent />, disabled: true },
 *   ]}
 * 
 * />
 * ```
 */
const TabsWithIcons: React.FC<TabsWithIconsProps> = ({
  tabs,
  activeColorClass = "bg-primary text-white",
  handleChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="mb-5">
      <TabGroup onChange={handleChange}>
        <TabList className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab, index) =>
            tab.disabled ? (
              <Tab
                key={index}
                className="pointer-events-none -mb-[1px] flex items-center p-3.5 py-2 dark:text-white-light text-dark"
              >
                {tab.icon && tab.icon}
                {tab.label}
              </Tab>
            ) : (
              <Tab as={Fragment} key={index}>
                {({ selected }) => (
                  <button
                    className={`${selected ? `${activeColorClass} !outline-none` : ""}
                                        -mb-[1px] dark:text-white-light text-dark flex items-center rounded p-3.5 py-2 transition-colors duration-700`}
                  >
                    <span className="ltr:mr-2 rtl:ml-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                )}
              </Tab>
            )
          )}
        </TabList>
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={index}>
              <div className="pt-5">{tab.content}</div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default TabsWithIcons;
