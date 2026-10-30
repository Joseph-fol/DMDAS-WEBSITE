// const handleUpload = require("@vercel/blob/client")

const dummyDb = {
    updateUserAvatar : async (userId, newUrl) =>{
        console.log(`Saving avatar URL ${newUrl} for the ${userId}`)
        return { oldAvatarUrl: "https://vercel-storage.com" }
    }
}

const uploadProfilePicture = async (req, res) => {
    const body = req.body

    try{
        const jsonResponse = await handleUpload({
            body, 
            req,
            token: process.env.BLOB_READ_WRITE_TOKEN,

            onBeforeGenerateToken: async(pathname, clientPayload) =>{
                const userId = req.user._id

                return {
                    allowContentTypes: ['image/jpeg', 'image/png', 'image.webp'],
                    maximumSizeInBytes: 1 * 1024 * 1024, // Strict 1MB max limit
                    clientPayload: JSON.stringify({userId})
                }
            },

            onUploadCompleted: async ({blob, tokenPayload}) =>{
                const { userId } = JSON.parse(tokenPayload)

                try{
                    const { oldAvatarUrl } = await dummyDb.updateUserAvatar(userId, blob.url)

                    // Clean up old avatar from storage
                    if(oldAvatarUrl){
                        const {del} = await import("@vercel/blob")
                        await del(oldAvatarUrl, {token})
                    }
                } catch(error){
                    throw new Error("Database update or file cleanup failed")
                }
            }
        })
        return res.status(200).json(jsonResponse)
    } catch(error){
        return res.status(400).json({ error: error.message})
    }
}

module.exports =  {uploadProfilePicture}