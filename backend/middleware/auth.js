import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    if(authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err) {   
                return res.status(400).json({ message: 'Unauthorized' })
            }   
            else {
                req.user = decoded
            }
            next()
        })
    }else {
        return res.status(400).json({ message: 'invalid token' })
    }

}

export default verifyToken;