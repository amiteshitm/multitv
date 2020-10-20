import { FactoryBot } from 'factory-bot-ts'
import { name, lorem, system, image } from 'faker'

import { CategoryModel } from 'server/models/category'
import { UploadModel } from 'server/models/upload'
import { FeatureModel } from 'server/models/feature'
import { SoftwareModel } from 'server/models/software'

FactoryBot.create = async function (name, attributes) {
  const modelAttribs = FactoryBot.build(name, attributes)
  const ModelClazz = this.factories[name].clazz
  const modelObj = new ModelClazz(modelAttribs)
  const modelDoc = await modelObj.save()

  return modelDoc
}

FactoryBot.define(
  'aspect',
  {
    name: 'Simple Aspect',
    mimetype: system.mimeType(),
    size: 10000,
    filepath: image.imageUrl(),
    details: lorem.sentence(),
    aspect: 'medium',
  },
  UploadModel
)

FactoryBot.define(
  'feature',
  {
    name: name.findName(),
    slug: lorem.slug(),
    data_type: 'String',
  },
  FeatureModel
)

FactoryBot.define(
  'category',
  {
    name: () => name.findName(),
    slug: () => lorem.slug(),
    desc: () => lorem.sentence(),
    details: () => lorem.paragraph(),
    cover: () => FactoryBot.buildList('aspect'),
    logo: () => FactoryBot.buildList('aspect', 1, { aspect: 'logo' }),
  },
  CategoryModel
)

FactoryBot.define(
  'software',
  {
    name: () => name.findName(),
    slug: () => lorem.slug(),
    desc: () => lorem.sentence(),
  },
  SoftwareModel
)

export { FactoryBot }
