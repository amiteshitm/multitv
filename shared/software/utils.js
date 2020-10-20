import UrlHelper from 'shared/url'

// Flatten software path into an array.
const getSoftwarePath = software => {
  const { root_category: rootCategory } = software
  const path = [{ name: 'Home', href: '/', as: '/' }]

  // Push the categories Path.
  rootCategory.path.forEach(cat => {
    const { href, as } = UrlHelper(cat, 'category')

    path.push({ name: cat.name, href, as })
  })

  // Push the root category
  const { href, as } = UrlHelper(rootCategory, 'category')

  path.push({ name: rootCategory.name, href, as })

  // Push the software name
  const softwareUrl = UrlHelper(software, 'software')

  path.push({ name: software.name, href: softwareUrl.href, as: softwareUrl.as })

  return path
}

// Flatten category path into an array.
const getCategoryPath = category => {
  const path = [{ name: 'Home', href: '/', as: '/' }]

  category.path.forEach(cat => {
    const { href, as } = UrlHelper(cat, 'category')

    path.push({ name: cat.name, href, as })
  })

  // Push the category name
  const categoryUrl = UrlHelper(category, 'category')

  path.push({ name: category.name, href: categoryUrl.href, as: categoryUrl.as })

  return path
}

const getAlternativesPath = software => {
  const softwarePath = getSoftwarePath(software)
  const { slug } = software

  softwarePath.push({ name: 'Alternatives', href: `/alternatives?slug=${slug}`, as: `/alternatives/${slug}` })

  return softwarePath
}

export { getSoftwarePath, getCategoryPath, getAlternativesPath }
