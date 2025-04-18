export default function checkIfSignedIn(req, res, next) {
    if (req.session.user) return next()

    return res.status(401).redirect('/auth/sign-in')
}