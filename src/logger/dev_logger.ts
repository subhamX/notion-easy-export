import { Format } from "logform";
import { createLogger, format, transports } from "winston";

const devLogger = createLogger({
	level: "debug",
	format: format.json(),
	transports: [
		new transports.Console({ format: format.simple() }),
		// new transports.File({ filename: 'error.log', level: 'error' }),
		// new transports.File({ filename: 'combined.log' }),
	],
});

export default devLogger;
