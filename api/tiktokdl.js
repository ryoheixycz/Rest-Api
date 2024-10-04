const Tiktok = require("tiktokapi-src");

exports.config = {
    name: 'tiktokdl',
    author: '',
    description: 'TikTok video downloader API',
    category: 'tools',
    usage: ['/tiktokdl?url=']
};

exports.initialize = async function ({ req, res }) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 'error', message: 'URL parameter is required' });
    }

    try {
        const result = await Tiktok.Downloader(url, {
            version: "v3" // Specify the version here
        });

        if (result) {
            res.json({
                status: 'success',
                result: {
                    type: result.type,
                    desc: result.desc,
                    author: {
                        avatar: result.author?.avatar,
                        nickname: result.author?.nickname
                    },
                    music: result.music,
                    images: result.images,
                    video1: result.video1,
                    video2: result.video2,
                    video_hd: result.video_hd,
                    video_watermark: result.video_watermark
                }
            });
        } else {
            res.status(500).json({ status: 'error', message: 'Failed to fetch the video' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
