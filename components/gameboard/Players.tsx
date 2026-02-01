"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerContainer from "../templates/PlayerContainer";
import { useGameStore } from "../../store/game";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const GAP = 16;

const Players: React.FC = () => {
  const {
    gameInstance,
    maxPlayers,
    playersView,
    getMe,
    getPlayers,
    setShowCarouselIcon,
  } = useGameStore();
  const me = getMe();
  const players = getPlayers();

  const currentChancellor = gameInstance?.currentChancellorIndex;
  const currentPresident = gameInstance?.currentPresidentIndex;

  /** container width */
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** hidden measurement row */
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [canUseCarousel, setCanUseCarousel] = useState(false);
  const [carouselPreference, setCarouselPreference] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("carouselView") === "1";
  });

  useEffect(() => {
    const value = localStorage.getItem("carouselView") === "1";
    setCarouselPreference(value);
  }, [playersView]);

  /* -------------------------------------------
     overflow detection (single source of truth)
  ------------------------------------------- */
  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const compute = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = measure.scrollWidth;
      setCanUseCarousel(contentWidth > containerWidth);
      setShowCarouselIcon(contentWidth > containerWidth);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(container);
    ro.observe(measure);

    return () => ro.disconnect();
  }, [players?.length, playersView]);

  const useCarousel = canUseCarousel && carouselPreference;

  /* -------------------------------------------
     render
  ------------------------------------------- */
  return (
    <div
      ref={containerRef}
      className="w-full bg-stone-800 py-2 overflow-hidden"
    >
      {/* ---------- hidden measurement row ---------- */}
      <div
        ref={measureRef}
        className="flex gap-4 h-0 overflow-hidden visibility-hidden pointer-events-none"
      >
        {players?.map((p, i) => (
          <PlayerContainer
            key={i}
            index={i}
            player={p}
            me={me!}
            vote={p.vote}
            maxPlayers={maxPlayers}
            currentChancellor={currentChancellor}
            currentPresident={currentPresident}
            highlight={me?.index === p.index}
          />
        ))}
      </div>

      {/* ---------- carousel ---------- */}
      {useCarousel ? (
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={GAP}
          slidesPerView="auto"
          freeMode
          navigation
          resistance={true}
          resistanceRatio={0.5}
          className="w-full"
        >
          {players?.map((p, i) => (
            <SwiperSlide key={i} style={{ width: "auto" }}>
              <PlayerContainer
                index={i}
                player={p}
                me={me!}
                vote={p.vote}
                maxPlayers={maxPlayers}
                currentChancellor={currentChancellor}
                currentPresident={currentPresident}
                highlight={me?.index === p.index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        /* ---------- centered static layout ---------- */
        <div className="flex justify-center gap-2 flex-wrap">
          {players?.map((p, i) => (
            <PlayerContainer
              key={i}
              index={i}
              player={p}
              me={me!}
              vote={p.vote}
              maxPlayers={maxPlayers}
              currentChancellor={currentChancellor}
              currentPresident={currentPresident}
              highlight={me?.index === p.index}
              className="mb-4 md:mb-1"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Players;
