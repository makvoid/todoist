export default async (hdbCore, logger, body) => {
  let response
  try {
    response = await hdbCore.requestWithoutAuthentication({ body })
  } catch (e) {
    logger.error(e)
    return { success: false, message: e.message }
  }
  return response
}
