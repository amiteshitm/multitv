const APP_TYPES = ['mac', 'windows', 'ios', 'android', 'linux']

const validateAppType = v => Object.keys(v).every(k => APP_TYPES.includes(k))

const validateAppUrls = urlMap => {
  let validUrls = true
  let invalidUrl = ''

  for (const k in urlMap) {
    const v = urlMap[k]
    switch (k) {
      case 'ios':
        const validios = /(https?:\/\/itunes\.apple\.com[^\s])/g.test(v)
        if (!validios) {
          validUrls = false
          invalidUrl = k
        }
        break
      case 'android':
        const validAndroid = /(https?:\/\/play\.google\.com[^\s]+)/g.test(v)
        if (!validAndroid) {
          validUrls = false
          invalidUrl = k
        }
        break
    }

    if (!validUrls) {
      break
    }
  }

  if (!validUrls) {
    throw new Error(`Passed invalid url in ${invalidUrl}`)
  }

  return true
}

export { validateAppType, validateAppUrls }
