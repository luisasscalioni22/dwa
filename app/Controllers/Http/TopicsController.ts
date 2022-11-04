import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Topic from 'App/Models/Topic'
import TopicValidator from 'App/Validators/TopicValidator'

export default class TopicsController {
  public async index({ }: HttpContextContract) {
    const topic = await Topic.all()
    return topic
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(TopicValidator)
    const topic = await Topic.create({ ...data })
    return topic
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const topic = await Topic.findOrFail(params.id)
      return topic
    } catch (error) {
      response.status(400).send("Tópico não encontrado!!!")
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    const { name } = await request.validate(TopicValidator)
    try {
      const topic = await Topic.findOrFail(params.id)
      topic.name = name
      await topic.save()
      return topic

    } catch (error) {
      response.status(400).send("Tópico não encontrado!!!")
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const topic = await Topic.findOrFail(params.id)
      await topic.delete()
      return topic
    } catch (error) {
      response.status(400).send("Tópico não encontrado!!!")
    }
  }
}