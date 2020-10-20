import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { AuthenticationError } from 'apollo-server-express'

export default class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitObject (type) {
    this._ensureFieldsWrapped(type)
    type._requireAuth = true
  }

  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition (field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field._requireAuth = true
  }

  ensureFieldsWrapped (objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return
    objectType._authFieldsWrapped = true

    const fields = objectType.getFields()

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field

      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requireAuth = field._requireAuth || objectType._requireAuth

        if (!requireAuth) {
          return resolve.apply(this, args)
        }

        const context = args[2]

        if (!context.user) {
          throw new AuthenticationError('not authenticated')
        }

        return resolve.apply(this, args)
      }
    })
  }
}
