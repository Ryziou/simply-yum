import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'SimplyYum/SimplyYum-Uploads',
        format: async (req, file) => 'png',
        public_id: (req, file) => {
            return Date.now() + '-' + file.originalname
        }
    }
})

const parser = multer({ storage: storage})

export default parser