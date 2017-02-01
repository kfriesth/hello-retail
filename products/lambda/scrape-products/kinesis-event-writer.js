'use strict'

const AWS = require('aws-sdk') // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies

class KinesisEventWriter {
  constructor() {
    this.kinesis = new AWS.Kinesis()
    this.kinesis.config.region = AWS.config.region
    this.kinesis.config.credentials = AWS.config.credentials
  }

  writeKinesisEvent(data, partitionKey) {
    const envelopeEvent = KinesisEventWriter.envelopeEvent()
    envelopeEvent.data = data

    const newProductCreatedEvent = {
      Data: JSON.stringify(envelopeEvent),
      PartitionKey: partitionKey,
      StreamName: process.env.STREAM_NAME,
    }

    this.kinesis.putRecord(newProductCreatedEvent, (err, ack) => {
      if (ack) {
        console.log(`K-PUT: ${JSON.stringify(ack)}`)
      }

      if (err) {
        throw new Error(err)
      }
    })
  }
}

KinesisEventWriter.envelopeEvent = () => ({
  schema: 'com.nordstrom/retail-stream-ingress/1-0-0',
  origin: 'hello-retail/product-scraper',
  timeOrigin: new Date().toISOString(),
})

module.exports = KinesisEventWriter