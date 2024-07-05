function getHealth (req, res) {
    const data = {
        staus: "OK",
        message: "Health check successful",
    }
    return res.status(200).send(data);
}

function postHealth(req, res) {
    const body = req.body;
    const data = {
        status: "OK",
        message: "Health check successful",
        body: `hi ${body.name} your server is up and running` || body
    };
    return res.status(200).send(data);
}

const healthController = {
    getHealth,
    postHealth
};

export default healthController;