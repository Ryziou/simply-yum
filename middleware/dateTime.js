export default function dateTime(req, res, next) {
    res.locals.formatDate = function(dateObj) {
        const createdDate = new Date(dateObj)
        return {
            shortDate: createdDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }),
            fullDate: createdDate.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        }
    }
    next()
}