var express = require('express');
var connection = require('../MySQL-db')
const axios = require('axios');
var router = express.Router();

router.post('/', function (req, res, next) {
    console.log(req.body)
    // connection.query('SELECT Q_image,W_image,E_image,R_image FROM game_prediction.champion_detail WHERE champ_id='+req.body.champID, function (err, result) {
    //     if (err) throw err;
    //     image = result;
    //     axios.post('http://203.233.111.5:5001/timeline_info', {
    //         gameId: req.body.gameId,
    //         my_id: req.body.my_id
    //     })
    //     .then(response => {
    //         timeLine=response.data
    //         res.send({'image':image, 'timeLine':timeLine});
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // })
    axios.post('http://192.168.0.112:5050/recognize_face', {
        member_id: req.body.ID,
        class_id: req.body.class_id,
        date_id: req.body.date_id,
    })
    .then(response => {
        res.send(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
});

router.post('/lecture_info', function (req, res, next) {
    connection.query("SELECT * FROM abf.class where class_room='"+req.body.class_room+"' and (class_starttime<='"+req.body.time+"' and class_endtime>='"+req.body.time+"' ) and class_date like '%"+req.body.date+"%'", function (err, result) {
        if (err) throw err;
        
        res.send(result)
    })
});

router.post('/attedance_all_fail', function (req, res, next) {
    console.log(req.body.class_id,"여기야여기")
    connection.query("SELECT * FROM abf.apply where class_id='"+req.body.class_id+"'", function (err, result) {
        if (err) throw err;
        
        if(result.length==0){
            console.log(result,"??")
            res.send("데이터 없음")
        }
        console.log(result)
        for(var i=0; i<result.length; i++){
            if(i!=result.length-1){
                axios.post('http://203.233.111.7:5050/push_ledger',{
                    "device_id": "409",
                    "user_id": result[i].member_id,
                    "verifier_id": result[i].class_id,
                    "result": "Fail",
                    "date": req.body.date
                })
                .then(response => {
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            else{
                axios.post('http://203.233.111.7:5050/push_ledger',{
                    "device_id": "409",
                    "user_id": result[i].member_id,
                    "verifier_id": result[i].class_id,
                    "result": "Fail",
                    "date": req.body.date
                })
                .then(response => {
                    res.send(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    })
    
});

module.exports = router;



