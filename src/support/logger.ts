import { type LogOutputChannel, window } from "vscode";

const channel: LogOutputChannel = window.createOutputChannel("Valet", { log: true });

const info = (message: string): void => {
    channel.info(message);
};

const warn = (message: string): void => {
    channel.warn(message);
};

const error = (message: string): void => {
    channel.error(message);
};

const show = (): void => {
    channel.show();
};

export { channel, error, info, warn, show };
