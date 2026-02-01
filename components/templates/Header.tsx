"use client";

import {
  BadgeQuestionMark,
  Handshake,
  Home,
  Microscope,
  Navigation,
  Settings,
  View,
} from "lucide-react";
import Menu from "./Menu";
import { useGameStore } from "@/store/game";
import { useCallback, useMemo } from "react";
import { MenuItem } from "@/react-types";

const Header: React.FC = () => {
  const { playersView, trackerView, setPlayersView, setTrackerView } =
    useGameStore();

  const carouselView =
    typeof window !== "undefined" ? localStorage.getItem("carouselView") : "0";
  const trackingHelperView =
    typeof window !== "undefined"
      ? localStorage.getItem("trackingHelperView")
      : "0";

  // Toggle Carousel View
  const handlePlayersView = useCallback(() => {
    const carouselView = localStorage.getItem("carouselView");
    localStorage.setItem("carouselView", carouselView === "1" ? "0" : "1");
    setPlayersView(playersView + 1);
  }, [playersView, setPlayersView]);

  // Toggle Tracking Helper View
  const handleTrackingHelperView = useCallback(() => {
    const trackingHelperView = localStorage.getItem("trackingHelperView");
    localStorage.setItem(
      "trackingHelperView",
      trackingHelperView === "1" ? "0" : "1"
    );
    setTrackerView(trackerView + 1);
  }, [trackerView, setTrackerView]);

  // Menu items with conditional label for Tracking Helper
  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        label: "Navigation",
        icon: <Navigation />,
        subMenu: [
          { label: "Home", icon: <Home />, link: "/" },
          {
            label: "How to play?",
            icon: <BadgeQuestionMark />,
            link: "/how-to-play",
          },
          { label: "Credits", icon: <Handshake />, link: "/credits" },
        ],
        alwaysShow: true,
      },
      {
        label: "Settings",
        icon: <Settings />,
        subMenu: [
          {
            label:
              carouselView === "1"
                ? "Disable Carousel View"
                : "Show Carousel View",
            icon: <View />,
            onClick: handlePlayersView,
          },
          {
            label:
              trackingHelperView === "1"
                ? "Show Tracking Helper"
                : "Disable Tracking Helper",
            icon: <Microscope />,
            onClick: handleTrackingHelperView,
          },
        ],
      },
    ];
  }, [
    carouselView,
    trackingHelperView,
    handlePlayersView,
    handleTrackingHelperView,
  ]);

  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-center bg-amber-900 p-5 text-center text-4xl font-bold text-white">
      {/* Left */}
      <div className="absolute left-5 text-start">
        <Menu items={menuItems} />
      </div>

      {/* Center */}
      <h1 className="text-2xl md:text-4xl">Secret Hitler</h1>
    </header>
  );
};

export default Header;
