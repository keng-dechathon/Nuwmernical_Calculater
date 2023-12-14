const boom = require('boom')
const datas = require('../../data.json')


exports.getData = async (req, reply) => {
    try {
        reply.send(datas);
    } catch (err) {
        throw boom.boomify(err)
    }
}

exports.getSingleData = async (req, reply) => {
    try {
        const resalt = datas.filter(data => data.id == req.params.id)
        if (resalt.length > 0)  reply.send(resalt[0]);           
        else reply.send({});                
    } catch (err) {
        throw boom.boomify(err)
    }
}

