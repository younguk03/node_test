//계시판 만들기

//CRUD(C:Create R:Read U:Update D:Delete)에 필요한 모듈사용
const mysql = require('mysql');//mysql모듈
const express = require('express'); //express모듈
const fs = require('fs'); //fs모듈로 html파일을 read한다.
const ejs = require('ejs');//ejs모듈로 문자열을 html문자열로 생성
const bodyParser = require('body-parser');
//bodyparser모듈로 application/x=www-form-urlencoded파싱
/*
const {connect} = require('node:http2');
const { resourceLimits } = require('node:worker_threads');
const request = require('request');
*/

//연결할 DB정보 입력
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'gksksla1',
    database:'book_table',
    port:'3306',
});

const app = express();
app.use(bodyParser.urlencoded({
    extended:false,
}));

app.listen(5000, () => {
    console.log('Server is running port http://43.200.5.238:5000');
    //데이터 베이스 연결
    connection.connect();
});

//데이터 조회
app.get('/',(request, response) => {
    fs.readFile('booklist.html', 'utf-8', (error, data) => {//조회페이지 html
        //Select 쿼리문 사용
        connection.query('SELECT * from book1', (error, results, fields) => {
            if (error) throw error;
            response.send(ejs.render(data, {
                data: results,
            }));
        });
    });
});

//데이터 추가
app.get('/create', (request,response) => {
    fs.readFile('insertNewBook.html', 'utf-8', (error, data) => {//데이터 추가페이지 html
    if (error) throw error;
    response.send(data);
    });
});
    

// 데이터 추가
app.post('/create', (request, response) => {
    const body = request.body;
    connection.query('INSERT INTO book1 (genre, name, writer, releasedate) VALUE (?,?,?,?)', [body.genre, body.name, body.writer, body.releasedate], () => {
        // 조회 페이지로 이동
        response.redirect('/');
    });
    
});

//데이터 수정
app.get('/modify/:id', (request, response) => {
    //파일을 읽어옵니다.
    fs.readFile('modify.html', 'utf-8', (error, data) => {
        connection.query('SELECT * from book1 WHERE number = ?',[request.params.id],(error, results) => {
            if (error) throw error;
            console.log(request.params.id);
            response.send(ejs.render(data, {
                data:results[0],
            }));
        });
    });
});

app.post('/modify/:id', (request, response) => {
    const body = request.body;
    connection.query('UPDATE book1 SET genre = ?, name = ?, writer = ? WHERE number = ?', [body.genre, body.name, body.writer, request.params.id], (error, results) => {
        if (error) throw error;
        //조회페이지로 이동
        response.redirect('/');
    });
});

//데이터 삭제
app.get('/delete/:id', (request, response) => {
    connection.query('DELETE FROM book1 where number = ?', [request.params.id], () => {
        //조회 페이지로 이동
        response.redirect('/');
    });
});