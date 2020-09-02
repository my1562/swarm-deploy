import { DefinitionsService } from 'enxame';

export interface CrawlerOptions {
    tag: string;
    redis: string;
    api: string;
}

export const Crawler = ({
    redis,
    tag,
    api,
}: CrawlerOptions): DefinitionsService => ({
    image: `docker.pkg.github.com/my1562/crawler/my1562crawler:${tag}`,
    environment: {
        API_URL: api,
        REDIS: redis,
    },
});
