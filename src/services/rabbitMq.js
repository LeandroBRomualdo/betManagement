const amqp = require('amqplib')
const env = require('dotenv').config()

async function connect(){
  try{
    const connection = await amqp.connect("amqp://pucmg:mgpuc@92.119.129.191")
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
  
  function sendToQueue(queue, message){
    connect()
      .then(channel => createQueue(channel, queue))
      .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
      .catch(err => console.log(err))
  }
  
  function consume(queue, callback){
    connect()
      .then(channel => createQueue(channel, queue))
      .then(channel => channel.consume(queue, callback, { noAck: true }))
      .catch(err => console.log(err));
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
    sendToQueue,
    consume,
    consumeFromExchange,
    connect,
  }