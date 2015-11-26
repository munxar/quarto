///<reference path="../../../../mithril.d.ts"/>
import * as m from "mithril";

export enum LogLevel {
    TRACE,
    INFO,
    WARNING,
    SUCCESS,
    ERROR
}

interface OnMessage {
    (message: string, level: LogLevel);
}

export class LoggerService {
    private handler: OnMessage[] = [];

    log(message: string, level: LogLevel) {
        this.handler.forEach(handler => handler(message, level));
    }

    trace(message: string) {
        this.log(message, LogLevel.TRACE)
    }

    info(message: string) {
        this.log(message, LogLevel.INFO)
    }

    warning(message: string) {
        this.log(message, LogLevel.WARNING)
    }

    success(message: string) {
        this.log(message, LogLevel.SUCCESS)
    }

    error(message: string) {
        this.log(message, LogLevel.ERROR)
    }

    on(callback: OnMessage) {
        this.handler.push(callback)
    }
}