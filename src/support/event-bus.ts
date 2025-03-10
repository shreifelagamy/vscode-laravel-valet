/**
 * Type-safe event bus for VSCode extension
 */

export type EventMap = {
    'valet:refresh': undefined;
    'project:linked': { path: string };
    'project:unlinked': { path: string };
    'php:version-changed': { version: string };
}

export class EventBus<T extends Record<string, unknown>> {
    private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {};

    /**
     * Subscribe to an event
     * @param event The event name to subscribe to
     * @param callback The callback to execute when the event is emitted
     */
    on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]?.push(callback);
    }

    /**
     * Emit an event with data
     * @param event The event name to emit
     * @param data The data to pass to the event listeners
     */
    emit<K extends keyof T>(event: K, data: T[K]): void {
        const callbacks = this.listeners[event] ?? [];
        for (const callback of callbacks) {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${String(event)}:`, error);
            }
        }
    }

    /**
     * Unsubscribe from an event
     * @param event The event name to unsubscribe from
     * @param callback The callback to remove
     */
    off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            this.listeners[event] = eventListeners.filter(listener => listener !== callback);
        }
    }
}

let globalEventBus: EventBus<EventMap> | undefined;

/**
 * Get the global event bus instance
 */
export function getEventBus(): EventBus<EventMap> {
    if (!globalEventBus) {
        globalEventBus = new EventBus<EventMap>();
    }
    return globalEventBus;
}
