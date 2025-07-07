const shortid = require("shortid");
const UrlModel = require("../models/url");

const post_new_url = async (req, res) => {
    const url = req.body.url;
    if (!url) return res.status(400).json({ status: 'error', message: 'Missing required field: original_url' });
    
    const short_id = shortid.generate(); 
    try {
        const result = await UrlModel.create({
            original_url:url,
            short_id:short_id, 
        });

        console.log(result)
        res.status(201).json({
            status: "success",
            short_url_id: short_id,
            data: result,
        });

    } catch (err) {
        // console.error("Error saving URL:", err);
        console.log("ERROR in post url")
        res.status(500).json({ status: "error", message: "Failed to save URL" });
    }
};

const get_short_url = async (req, res) => {
    try {

        const data = await UrlModel.findOne({ short_id: req.params.shortid });
        if (!data) return res.status(404).json({ status: 'error', message: 'Short URL not found' });

        data.total_clicks += 1;
        data.timestamp = new Date().toISOString();
        await data.save(); 

        let redirectUrl = data.original_url;
        if (!/^https?:\/\//i.test(redirectUrl)) {
            redirectUrl = 'https://' + redirectUrl;
        }
        return res.status(301).redirect(redirectUrl);
    } catch (err) {
        // console.error("Error during redirection:", err);
        return res.status(500).json({ status: 'error', message: 'Redirection failed' });
    }
};

module.exports = {
    post_new_url,
    get_short_url
};
