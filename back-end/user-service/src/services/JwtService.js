const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '365d' })

    return access_token
}

const generalRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })

    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                   
                    resolve({
                        code: 401,
                        success: false,
                        message: 'Bạn không có quyền để làm tác vụ này!'
                    })
                }
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                resolve({
                    code: 200,
                    success: true,
                    message: 'Tạo mới access_token thành công!',
                    data: { access_token }
                })
            })
        } catch (e) {
            reject(e)
        }
    })

}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}
