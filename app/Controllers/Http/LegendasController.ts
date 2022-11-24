import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Legenda from 'App/Models/Legenda'
import Message from 'App/Models/Legenda'
import LegendaValidator from 'App/Validators/LegendaValidator'
import MessageValidator from 'App/Validators/MessageValidator'

export default class LegendaController {

  public async index({ }: HttpContextContract) {
    const legenda = await Legenda
      .query()
      .preload('legendaTopic')
      .preload('User')
      .orderBy('id')
    return legenda
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(LegendaValidator)
    const message = await Message.create({
      title: data.title,
      legenda: data.legenda,
      userId: auth.user?.id
    })
    await message.related('legendaTopic').attach(data.topic)
    return message
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const legenda = await Message
        .query()
        .where("id", params.id)
        .preload('legendaTopic')
      return legenda[0]
    } catch (error) {
      response.status(400).send("Mensagem não encontrada!!!")
    }
  }

  public async update({ request, params, response }: HttpContextContract) {
    try {
      const { title, legenda, topic } = await request.validate(MessageValidator)
      const legendaUpdate = await Message.findOrFail(params.id)
      legendaUpdate.title = title
      legendaUpdate.legenda = legenda
      await legendaUpdate.save()
      await legendaUpdate.related('legendaTopic').sync(topic)
      return legendaUpdate
    } catch (error) {
      response.status(400).send("Mensagem não encontrada!!!")
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const legenda = await Legenda.findOrFail(params.id)
      await legenda.delete()
      return legenda
    } catch (error) {
      response.status(400).send("Mensagem não encontrada!!!")
    }
  }
}
