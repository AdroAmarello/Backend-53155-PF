import { createLogger, transports, format, addColors } from "winston";

const { printf, combine, colorize, timestamp } = format;

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
    }
};

// Agregar los colores a winston
addColors(customLevels.colors);

// Formatear los logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Formato de la consola
const consoleFormat = combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
);

// Función de filtro personalizada para un nivel específico
const levelFilter = (level) => {
    return format((info) => {
        return info.level === level ? info : false;
    })();
};

export const logger = createLogger({
    levels: customLevels.levels,
    format: combine(
        format.errors({ stack: true }), // Asegura que los errores tengan el stack trace
        
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.Console({ level: "http", format: consoleFormat }),
        new transports.File({ filename: "logs/app.log", level: "http" }),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/only-info.log", format: levelFilter("info")})
    ],
});
