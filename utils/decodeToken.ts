import jwt from 'jsonwebtoken'

const decodeToken = (token: string) => {
    return jwt.verify(token,process.env.JWT_SECRET!, (err,decoded) =>{
        if(err){
            return undefined
        }
        return decoded
    })
}

export default decodeToken

