import { DefinitionsService } from 'enxame';

export interface BotOptions {
    tag: string;
    api: string;
    fts: string;
    telegram: string;
    redis: string;
}

export const Bot = ({
    tag,
    api,
    fts,
    telegram,
    redis,
}: BotOptions): DefinitionsService => ({
    image: `docker.pkg.github.com/my1562/telegrambot/my1562telegrambot:${tag}`,
    environment: {
        API_URL: api,
        FTS_URL: fts,
        TELEGRAM_APITOKEN: telegram,
        REDIS: redis,
    },
});
