const amqp = require('amqplib')
const env = require('dotenv').config()

async function connect(){
  try{
    const { HOST_MQ } = process.env
    const connection = await amqp.connect(HOST_MQ)
    const channel = await connection.createChannel();
                             
    return {connection, channel}
  }catch(e){
    console.log(e)
  }
  }
  
  function createQueue(channel, queue){
    return new Promise((resolve, reject) => {
      try{
        channel.assertQueue(queue, { durable: true });
        resolve(channel);
      }
      catch(err){ reject(err) }
    });
  }
  
  async function publishInExchange(channel, exchange, routingKey, message){
    return channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async function consumeFromExchange(channel, exchangeName, routeKey, callback){
    try{
      const { queue } = await channel.assertQueue("", { exclusive:true })

      channel.bindQueue(queue, 'draws', "")
      channel.consume(queue, callback)
    }catch(exception){
      console.log(exception)
    }
  }
  
  module.exports = {
    consumeFromExchange,
    connect,
    publishInExchange
  }