// Dont add more typeDefs. Move to graphql-js.
export const typeDefs = `
  scalar Upload

  directive @authorized(requires: String!) on OBJECT | FIELD_DEFINITION
  directive @authenticated on OBJECT

  type Query {
    feature(id: ID!): Feature
    features(filter: FeatureFilterInput): [Feature]
    tags(contains: String!): [TagListOutput]
  }

  type Mutation {
    uploadCreate(input: Upload!): UploadOutput
    featureCreate(input: FeatureInput!): Feature
  }

  type Media {
    id: ID!
    name: String
    filepath: String
    details: String
    alt: String
  }

  type CategoryPath {
    category_id: ID!
    name: String!
    slug: String!
  }

  type UploadOutput {
    status: Boolean
  }

  type TagListOutput {
    _id: String
    number: Int
  }

  input FeatureInput {
    name: String!
    data_type: String!
    parent_id: ID
  }

  input FeatureEmbedInput {
    feature: ID!
    data: String!
  }

  type Feature {
    id: ID
    name: String!
    data_type: String!
    parent: Feature
  }

  type FeatureEmbed {
    feature: Feature
    data: String
  }

  input SoftwaresFilterInput {
    categories: [ID]
  }

  input FeatureFilterInput {
    parent_id: [ID]
  }
`
