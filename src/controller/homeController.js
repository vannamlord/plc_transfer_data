import multer from 'multer';
const fs = require('fs');
const util = require('util');

let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs')
}

let getUpdateApp = async (req, res) => {
    return res.render('checkUpdateApp.ejs')
}

const upload = multer().single('profile_pic');

let handleUploadFile = async (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`{
            outputs: [
              { name: 'NinjaVanPosting', result: [Object] },
              { name: 'MessengerClient', result: [Object] },
              { name: 'SystemPowerOff', result: [Object] },
              { name: 'FrontendReset', result: [Object] },
              { name: 'Counter', result: [Object] }
            ],
            volumeNum: '1[0]',
            volume: '1855691.38',
            length: '243.32',
            width: '204.07',
            height: '43.00',
            center: { x: '-115.863060', y: '-13.116334', z: '1281.705566' },
            ImgName: '/20230719_162326_797.jpg',
            weight: 120,
            qrcode: 'KNJVN0139919571',
            timestamp: '2023-07-19T15:23:25+07:00',
            image: '/20230719_162326_797.jpg',
            inbound_tags: [],
            inbound_priority: 0,
            inbound_weight: { value: 0.12 },
            inbound_dimensions: { l: 24.332, w: 20.407, h: 4.3 },
            inbound_hub: 'DOT - Tam Nong - SOU - SUB 2',
            inbound_tracking_id: 'KNJVN0139919571',
            inbound_stamp_id: '',
            inbound_zone: '10-04-06-Tam Nong-C2N10',
            inbound_statusCode: 200,
            times: {
              qrcode: '2023-07-19T15:23:25.472+07:00',
              scale: '2023-07-19T15:23:26.808+07:00',
              socks: '2023-07-19T15:23:26.808+07:00',
              parcelInboundStart: '2023-07-19T15:23:26.809+07:00',
              parcelInboundEnd: '2023-07-19T15:23:27.002+07:00'
            },
            localeTimestamp: 'Wed 19 Jul 2023 15:23:25',
            cm_length: '24.332',
            cm_width: '20.407',
            cm_height: '4.300',
            kg_weight: '0.120'
          }\
          <hr />You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="500">\
          <hr /><a href="/">Upload another image</a>`);
    });
}

let handCheckUpdateApp = async (req, res) => {
    res.send(`{${data_sta_proc}}`);
}
module.exports = {
    getUploadFilePage, handleUploadFile, getUpdateApp, handCheckUpdateApp
}