export default function checkIfSignedOut(req, res, next) {
    if (!req.session.user) return next()
    return res.status(302).redirect('/')
}
