var express = require('express');
var connection = require('../MySQL-db')
const axios = require('axios');
var router = express.Router();

router.post('/', function (req, res, next) {
    console.log(req.body)
    axios.post('http://192.168.137.79:5050/recognize_face', {
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
    connection.query("SELECT * FROM abf.apply where class_id='"+req.body.class_id+"'", function (err, result) {
        if (err) throw err;
        
        if(result.length==0){
            res.send("데이터 없음")
        }
        else{
            res.send(result)
        }
        // for(var i=0; i<result.length; i++){
        //     if(i!=result.length-1){
        //         axios.post('http://203.233.111.7:5050/push_ledger',{
        //             "device_id": "409",
        //             "user_id": result[i].member_id,
        //             "verifier_id": result[i].class_id,
        //             "result": "Fail",
        //             "date": req.body.date
        //         })
        //         .then(response => {
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        //     }
        //     else{
        //         axios.post('http://203.233.111.7:5050/push_ledger',{
        //             "device_id": "409",
        //             "user_id": result[i].member_id,
        //             "verifier_id": result[i].class_id,
        //             "result": "Fail",
        //             "date": req.body.date
        //         })
        //         .then(response => {
        //             res.send(response.data)
        //         })
        //         .catch(function (error) {
        //             console.log(error);
        //         });
        //     }
        // }
    })
});

module.exports = router;



