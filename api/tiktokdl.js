const Tiktok = require("tiktokapi-src");

exports.config = {
    name: 'tiktokdl',
    author: 'Wataru Ajiro',
    description: 'TikTok video downloader API',
    category: 'tools',
    usage: ['/tiktokdl?url=']
};

exports.initialize = async function ({ req, res }) {
    const { url } = req.query;

    // Validate the URL parameter
    if (!url) {
        return res.status(400).json({
            status: 'error',
            message: 'URL parameter is required'
        });
    }

    try {
        // Fetch the TikTok download data
        const result = await Tiktok.Downloader(url, {
            version: "v3" // Specify the version, can be "v1", "v2", or "v3"
        });

        // Check if result is valid
        if (result && result.status === 'success') {
            res.json({
                status: 'success',
                result: {
                    type: result.result.type || 'video', // Default to 'video' if undefined
                    desc: result.result.desc || 'No description available', // Default description
                    author: {
                        avatar: result.result.author?.avatar || 'No avatar available',
                        nickname: result.result.author?.nickname || 'Anonymous'
                    },
                    music: result.result.music || 'No music information available',
                    images: result.result.images || [],
                    video1: result.result.video1 || null,
                    video2: result.result.video2 || null,
                    video_hd: result.result.video_hd || null,
                    video_watermark: result.result.video_watermark || null
                }
            });
        } else {
            // Handle case where the API returns an error status
            res.json({
                status: 'error',
                message: result.message || 'Failed to fetch the video',
                result: null
            });
        }
    } catch (error) {
        // Error handling with logging
        console.error('Error:', error.message);
        res.json({
            status: 'error',
            message: 'Internal Server Error',
            result: null
        });
    }
};
            
