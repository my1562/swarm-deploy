import {
    ComposeSpecification,
    mergeComposeConfigurations,
} from '@typeswarm/cli';
import { bindToNodeWithLabel } from './helpers/bindToNodeWithLabel';
import { extend } from './helpers/extend';
import { MariaDBPackage } from './packages/MariaDB/MariaDBPackage';
import { API } from './services/API';
import { Bot } from './services/Bot';
import { Broadcaster } from './services/Broadcaster';
import { Crawler } from './services/Crawler';
import { FTS } from './services/FTS';
import { PHPMyAdmin } from './services/PHPMyAdmin';
import { Redis } from './services/Redis';
import { AuthGateway } from './services/AuthGateway';
import { ok } from 'assert';
import { publishToTraefik } from '@typeswarm/traefik';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
ok(TELEGRAM_TOKEN);
const PUBLISH_PORTS = !!process.env.PUBLISH_PORTS;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_TEAM = process.env.GITHUB_TEAM;
const PHPMYADMIN_EXTERNAL_HOST = process.env.PHPMYADMIN_EXTERNAL_HOST;

const DB_USER = 'root';
const DB_PASSWORD = 'toor';
const DB_NODE_LABEL = 'space.boto.local-volumes.my1562';
const DATABASES = {
    bot: 'bot',
    userprofile: 'userprofile',
};

const serviceName = {
    db: 'db',
    api: 'api',
    fts: `fts`,
    phpmyadmin: 'phpmyadmin',
    bot: 'bot',
    redis: 'redis',
    broadcaster: 'broadcaster',
    crawler: 'crawler',
    gateway: 'gate',
};

const mariadbPackage = MariaDBPackage({
    publishPort: PUBLISH_PORTS ? 13306 : 0,
    password: DB_PASSWORD,
    volume: 'dbdata',
    credentials: Object.values(DATABASES).map((db) => ({
        database: db,
        user: 'root',
    })),
    serviceName: serviceName.db,
});

ok(mariadbPackage.services?.[serviceName.db]);

mariadbPackage.services[serviceName.db] = extend(
    mariadbPackage.services[serviceName.db]
).withPlugin(bindToNodeWithLabel(DB_NODE_LABEL));

const serviceRedis = extend(
    Redis({
        volume: 'redis_data',
        publishPort: PUBLISH_PORTS ? 16379 : 0,
    })
).withPlugin(bindToNodeWithLabel(DB_NODE_LABEL));

const serviceAPI = API({
    tag: '0.2.4',
    dbHost: serviceName.db,
    dbName: DATABASES.bot,
    dbPassword: DB_PASSWORD,
    dbUser: DB_USER,
    publishPort: PUBLISH_PORTS ? 18000 : 0,
    redis: `${serviceName.redis}:6379`,
});

const servicePHPMyAdmin = PHPMyAdmin({
    publishPort: PUBLISH_PORTS ? 18080 : 0,
});

const serviceFTS = FTS({
    tag: 'v0.0.5',
    publishPort: PUBLISH_PORTS ? 13000 : 0,
});

const serviceBot = Bot({
    tag: '0.2.1',
    api: `http://${serviceName.api}:8000`,
    fts: `http://${serviceName.fts}:3000`,
    redis: `${serviceName.redis}:6379`,
    telegram: TELEGRAM_TOKEN,
});

const serviceBroadcaster = Broadcaster({
    tag: '0.0.4',
    redis: `${serviceName.redis}:6379`,
    telegram: TELEGRAM_TOKEN,
});

const serviceCrawler = Crawler({
    tag: '0.0.9',
    api: `http://${serviceName.api}:8000`,
    redis: `${serviceName.redis}:6379`,
});

let spec: ComposeSpecification = {
    version: '3.3',
    services: {
        [serviceName.api]: serviceAPI,
        [serviceName.phpmyadmin]: servicePHPMyAdmin,
        [serviceName.fts]: serviceFTS,
        [serviceName.bot]: serviceBot,
        [serviceName.redis]: serviceRedis,
        [serviceName.broadcaster]: serviceBroadcaster,
        [serviceName.crawler]: serviceCrawler,
    },
    volumes: {
        dbdata: null,
        redis_data: null,
    },
};

spec = mergeComposeConfigurations(spec, mariadbPackage);

if (process.env.ENABLE_GATEWAY) {
    ok(GITHUB_CLIENT_ID);
    ok(GITHUB_CLIENT_SECRET);
    ok(GITHUB_ORG);
    ok(GITHUB_TEAM);
    ok(PHPMYADMIN_EXTERNAL_HOST);

    const gatewayService = extend(
        AuthGateway({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            githubOrg: GITHUB_ORG,
            githubTeam: GITHUB_TEAM,
            upstream: `http://${serviceName.phpmyadmin}`,
        })
    ).withPlugin(
        publishToTraefik({
            externalNetwork: 'shared_proxy',
            externalHttps: true,
            serviceName: serviceName.gateway,
            host: PHPMYADMIN_EXTERNAL_HOST,
            port: 4180,
        })
    );

    spec = mergeComposeConfigurations(spec, {
        services: { [serviceName.gateway]: gatewayService },
        networks: {
            ...spec.networks,
            shared_proxy: {
                external: true,
            },
        },
    });
}

export { spec };
