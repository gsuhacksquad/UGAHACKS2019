const AWS = require('aws-sdk'); 

AWS.config.region = 'us-east-1';

//get reference to Rekognition client
let rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

exports.handler = (event, context, callback) => {
    let filename = event.filename;
    let employeeId = event.employeeid;
 
    const srcBucket = 'face-scan-ugahacks2019';
    let srcKey = employeeId + ".jpg";
 
    const targetBucket = 'ugahacks2019';
    let targetKey = decodeURIComponent(filename.replace(/\+/g, " "));
    
    let params = {
        SimilarityThreshold: 90, 
        SourceImage: {
            S3Object: {
                Bucket: srcBucket, 
                Name: srcKey
            }
        }, 
        TargetImage: {
            S3Object: {
                Bucket: targetBucket, 
                Name: targetKey
            }
        }
    };
     rekognition.compareFaces(params, function(err, result) {
        if (err) {
            console.log(err, err.stack);
            callback('could not compare faces');
            return;
        }
        else { 
            console.log(JSON.stringify(result));
            if (result !== null && result.FaceMatches !== null && result.FaceMatches.length > 0) { 
                let item = result.FaceMatches[0];
                console.log(JSON.stringify(item));
                if (item !== null && item.Face !== null && item.Face.Confidence > 80) {
                    callback(null, {"result": "Green"});  
                    return;  
                } else {
                    callback(null, {"result": "Red"});
                    return;
                }
            }
            else {
                callback(null, {"result": "Red"});
                return;
            }
        }
    });
}