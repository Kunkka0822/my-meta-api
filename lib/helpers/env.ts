import * as dotenv from 'dotenv';
import * as path from "path";

export const env = (key: string, defaultValue?: string): string => {
    if (!process.env.APP_NAME) {
        dotenv.config({path: path.resolve(__dirname, '../../.env')});
     }
    return (process.env[key]) ? process.env[key]: defaultValue;
}