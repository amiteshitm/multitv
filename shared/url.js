export default (resource, type) => {
  switch (type) {
    case 'category':
      return categoryUrl(resource)
    case 'software':
      return softwareUrl(resource)
  }
}

const categoryUrl = category => {
  return {
    href: `/category?slug=${category.slug}`,
    as: `/category/${category.slug}`,
  }
}

const softwareUrl = software => ({
  href: `/software?slug=${software.slug}`,
  as: `/${software.slug}`,
})
