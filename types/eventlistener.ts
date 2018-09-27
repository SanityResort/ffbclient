
export enum EventType {
    ActivePlayerAction,
    BlockChoice,
    BlockDice,
    Click,
    Connected,
    FloatText,
    FullScreen,
    Initialized,
    ModelChanged,
    Quit,
    Resized,
    Resizing
}

export interface EventListener {
    handleEvent(event: EventType, data?: any): void;
}
