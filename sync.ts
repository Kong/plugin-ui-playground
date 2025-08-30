import fs from 'fs'
import chalk from 'chalk'

const request = async <T>(url: string): Promise<T | undefined> => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) {
      throw res
    }
    return data as T
  } catch (err: any) {
    console.error(`Request error for ${url}: `, err)
  }
}

// Recursively sorts objects and arrays of objects by key
// const deeplySort = (obj: Record<string, any> | null): Record<string, any> | null => {
//   if (!obj) {
//     return obj
//   }

//   if (typeof obj !== 'object') {
//     return obj
//   }

//   // Check if the object is an array
//   if (Array.isArray(obj)) {
//     // If all items are numbers, sort them numerically
//     if (obj.every(item => typeof item === 'number')) {
//       obj.sort((a, b) => a - b)
//     }
//     // If all items are strings, sort them alphabetically
//     if (obj.every(item => typeof item === 'string')) {
//       obj.sort((a, b) => a.localeCompare(b))
//     }
//     // If all items are objects with a single key
//     if (obj.every(item => item && !Array.isArray(item) && typeof item === 'object' && Object.keys(item).length === 1)) {
//       obj.sort((a, b) => {
//         const aKey = Object.keys(a)[0]
//         const bKey = Object.keys(b)[0]
//         // if both keys are the same and their values are strings, sort them alphabetically
//         // else sort by key
//         return aKey === bKey && typeof a[aKey] === 'string' && typeof b[bKey] === 'string'
//           ? a[aKey].localeCompare(b[bKey])
//           : aKey.localeCompare(bKey)
//       })
//     }
//     // Recursively sort each item in the array
//     return obj.map(deeplySort)
//   }

//   // Sort the keys of the object and recursively sort the values
//   return Object.keys(obj).sort().reduce((acc, key) => {
//     acc[key] = typeof obj[key] === 'object' ? deeplySort(obj[key]) : obj[key]
//     return acc
//   }, {} as Record<string, any>)
// }

// Custom isEqual function that ignores the order of items in arrays
// const isEqual = (value: any, other: any) => isEqualWith(value, other, (a, b) => {
//   if (
//     Array.isArray(a) &&
//     Array.isArray(b) &&
//     a.length === b.length &&
//     (a.every(item => typeof item === 'string') && b.every(item => typeof item === 'string') ||
//     a.every(item => typeof item === 'number') && b.every(item => typeof item === 'number'))
//   ) {
//     return a.every((item) => (b as Array<string | number>).includes(item))
//   }
// })


interface InfoResponse {
  plugins: {
    available_on_server: Record<string, unknown>
  }
}

interface SchemaResponse {
  fields: Array<{
    config: {
      fields: Record<string, any>
    }
    [key: string]: any
  }>
}

const baseUrl = 'http://localhost:8001'

// const nonPluginEntities = [
//   'services',
//   'routes',
//   'consumers',
//   'consumer_groups',
//   'upstreams',
//   'targets',
//   'certificates',
//   'ca_certificates',
//   'snis',
//   'keys',
//   'key_sets',
//   'vaults',
//   'partials',

//   // consumer credentials
//   'acls',
//   'basicauth_credentials',
//   'keyauth_credentials',
//   'keyauth_enc_credentials',
//   'oauth2_credentials',
//   'hmacauth_credentials',
//   'jwt_secrets',

//   // vault providers
//   'vaults/aws',
//   'vaults/gcp',
//   'vaults/hcv',
//   'vaults/env',
//   'vaults/azure',
//   'vaults/conjur',
// ]

// Function to generate a schema for a given entity
const generateSchema = async (name: string, isPlugin = false) => {
  const url = isPlugin
    ? `${baseUrl}/schemas/plugins/${name}`
    : `${baseUrl}/schemas/${name}`
  const data = await request<SchemaResponse>(url)
  if (!data) {
    return
  }

  const fileName = `./schemas/${name.replace(/\//g, '-')}.json`
  // const schema = deeplySort(
  //   isPlugin
  //     ? (data.fields.find((field) => !!field.config)?.config ?? {})
  //     : data,
  // )

  // Skip the default secret of the session plugin as it changes with every Gateway image
  // if (name === 'session') {
  //   const sessionSecret = schema!.fields.find((field: Record<string, any>) => !!field.secret)?.secret
  //   if (sessionSecret) {
  //     sessionSecret.default = 'SKIPPED'
  //   }
  // }

  // Skip 'targets.elements.required' of the ai-proxy-advanced plugin as it is unstable
  // if (name === 'ai-proxy-advanced') {
  //   const targets = schema!.fields.find((f: Record<string, any>) => !!f.targets)?.targets
  //   if (targets?.elements) {
  //     targets.elements.required = 'SKIPPED'
  //   }
  // }

  // Skip 'cluster_cache_redis.required' and 'redis.required' of the konnect-application-auth plugin as they are unstable
  // if (name === 'konnect-application-auth') {
  //   const v2Strategies = schema!.fields.find((f: Record<string, any>) => !!f.v2_strategies)?.v2_strategies

  //   if (v2Strategies?.fields) {
  //     const openidConnect = v2Strategies.fields.find((f: Record<string, any>) => !!f.openid_connect)?.openid_connect
  //     if (openidConnect?.elements?.fields) {
  //       const config = openidConnect.elements.fields.find((f: Record<string, any>) => !!f.config)?.config
  //       if (config?.fields) {
  //         const clusterCacheRedis = config.fields.find((f: Record<string, any>) => !!f.cluster_cache_redis)?.cluster_cache_redis
  //         if (clusterCacheRedis) {
  //           clusterCacheRedis.required = 'SKIPPED'
  //         }

  //         const redis = config.fields.find((f: Record<string, any>) => !!f.redis)?.redis
  //         if (redis) {
  //           redis.required = 'SKIPPED'
  //         }
  //       }
  //     }
  //   }
  // }

  // Check if the schema already exists and if it's the same as the new one
  // if (fs.existsSync(fileName)) {
  //   const existingSchema = await fs.promises.readFile(fileName, 'utf8')
  //   if (isEqual(data, JSON.parse(existingSchema))) {
  //     console.log(chalk.gray`Skipping ${isPlugin ? `the ${name} plugin` : name}`)
  //     return
  //   }
  // }

  console.log(chalk.blueBright`Writing schema for ${isPlugin ? `the ${name} plugin` : name}`)

  const content = JSON.stringify(data, null, 2)
  await fs.promises.writeFile(fileName, content)
}

let timeout: NodeJS.Timeout

const getPluginNames: () => Promise<string[]> = async () => {
  const data = await request<InfoResponse>(baseUrl)
  if (!data) {
    return []
  }
  const pluginNames = Object.keys(data.plugins.available_on_server)

  console.log('Available plugins: ', pluginNames)

  return pluginNames
}

const waitForGateway = () => new Promise<void>((resolve) => {
  const attemptConnect = async () => {
    const data = await request<InfoResponse>(baseUrl)
    if (!data) {
      timeout = setTimeout(attemptConnect, 5000)
    } else {
      clearTimeout(timeout)
      console.log(chalk.greenBright`Connected to ${baseUrl}`)
      resolve()
    }
  }
  attemptConnect()
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const generateFileIndex = async (pluginNames: string[]) => {
  console.log('Generating file index...')
  const content = `// This file is auto-generated by sync.ts. Do not edit manually.
// Generated at ${new Date().toISOString()}
export default [
  ${pluginNames.map(name => `'${name}'`).join(',\n  ')}
]`
  await fs.promises.writeFile('./src/file-index.ts', content)
  console.log('File index generated successfully.')
}

const exec = async () => {
  console.log('Wake up in 20 seconds...')
  await sleep(2000)
  await waitForGateway()

  const pluginNames = await getPluginNames()
  for (const pluginName of pluginNames) {
    await generateSchema(pluginName, true)
  }
  await generateFileIndex(pluginNames)

  // for (const nonPluginEntity of nonPluginEntities) {
  //   await generateSchema(nonPluginEntity)
  // }
}

exec()
