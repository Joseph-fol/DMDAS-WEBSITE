const Mail = require("../models/contact.model")


const gmailService = async (req, res) =>{
    const { fullName, universityName, officialGmail, phoneNumber, subject, message} = req.body

    if (!fullName || !universityName || !officialGmail || !phoneNumber || !subject || !message){
        return res.status(400).json({
            message: "All input field is required, fill in all the details"
        })
    }

    try{
        const userInformation = new Mail({
            fullName, 
            universityName, 
            officialGmail, 
            phoneNumber, 
            subject, 
            message
        })

        await userInformation.save()
        return res.status(201).json({
            message: "Message received",
            details: `Thank you for reaching out, ${fullName}. Our support team will get back to you via ${officialGmail} shortly`
        })
        
    } catch(error){
        return res.status(500).json({
            message: "Failed to receive user details",
            error: error.message
        })
    }
}

module.exports = { gmailService }