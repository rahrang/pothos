import { Config } from 'stellate';

const config: Config = {
  config: {
    schema: 'https://pothos-graphql.dev/api/graphql',
    rootTypeNames: {
      query: 'Query',
    },
    rules: [
      {
        types: ['Query'],
        maxAge: 900,
        swr: 900,
        description: 'Cache everything (default)',
      },
    ],
    name: 'pothos-gcdn-local',
    originUrl: 'https://pothos-graphql.dev/api/graphql',
    getConsumerIdentifiers: '(req) => ({\n  ip: req.ip\n})',
    rateLimit: {
      name: 'Ip rate limit',
      state: 'enabled',
      consumerIdentifier: 'ip',
      allowList: ['192.168.0.1'],
      limit: {
        type: 'complexity',
        budget: 100,
        window: '1h',
      },
      onMissingIdentifier: 'block',
    },
  },
};

export default config;
