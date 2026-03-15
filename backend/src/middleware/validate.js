/**
 * Zod validation middleware factory.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate req.body against
 * @returns {import('express').RequestHandler} Express middleware that validates the request body
 *
 * Usage: router.post('/', validate(MySchema), handler)
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req.validatedBody = result.data;
    next();
  };
}
