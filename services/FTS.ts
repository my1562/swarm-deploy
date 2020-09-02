import { DefinitionsService } from 'enxame';

export interface FTSOptions {
    publishPort?: number;
    tag: string;
}

export const FTS = ({ publishPort, tag }: FTSOptions): DefinitionsService => ({
    image: `docker.pkg.github.com/my1562/fts/fts:${tag}`,
    ports: publishPort ? [{ published: publishPort, target: 3000 }] : [],
});
