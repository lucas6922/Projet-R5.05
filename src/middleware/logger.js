const logger = (req, res, next) => {
    const { method, host, path } = req;
    const time = new Date().toLocaleDateString('fr-FR');
    
    console.log(`${time} : ${method} - ${host} - ${path}`)

    next()
}

export default logger;