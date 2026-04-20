import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
    phase: 'intro',        // intro | game | arrived | entering | reading | finishing | final
    currentStation: -1,
    visitedStations: new Set(),
    moving: false,
    bicycleProgress: 0.02,
    targetStation: -1,
    selectedProject: null, // Track globally for clean UI overlays

    startGame: () => set({ phase: 'game' }),
    setMoving: (v) => set({ moving: v }),
    setBikeProgress: (p) => set({ bicycleProgress: p }),

    setSelectedProject: (proj) => set({ selectedProject: proj }),
    clearSelectedProject: () => set({ selectedProject: null }),

    arriveAtStation: (idx) =>
        set((s) => ({
            currentStation: idx,
            visitedStations: new Set([...s.visitedStations, idx]),
            phase: 'arrived',
            moving: false,
            targetStation: -1,
        })),

    enterStation: () => set({ phase: 'entering' }),
    openSection: () => set({ phase: 'reading' }),

    closeSection: () =>
        set((s) => ({
            phase: s.visitedStations.size >= 5 ? 'finishing' : 'game',
            moving: s.visitedStations.size >= 5 ? true : false,
            selectedProject: null, // Close panel when modal closes
        })),

    skipStation: () => set({ phase: 'game', moving: false }),

    // Triggered when car reaches the finish banner (removed arrivedFinish phase)

    goToFinal: () => set({ phase: 'final' }),

    rideToStation: (idx) =>
        set({
            phase: 'game',
            currentStation: -1,
            targetStation: idx,
            moving: true,
        }),

    revisitStation: (idx) =>
        set({
            currentStation: idx,
            phase: 'reading',
        }),

    reset: () =>
        set({
            phase: 'intro',
            currentStation: -1,
            visitedStations: new Set(),
            moving: false,
            bicycleProgress: 0.02,
            targetStation: -1,
            selectedProject: null,
        }),

    playAgain: () =>
        set({
            phase: 'game',
            currentStation: -1,
            visitedStations: new Set(),
            moving: false,
            bicycleProgress: 0.02,
            targetStation: -1,
            selectedProject: null,
        }),
}));
