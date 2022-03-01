const express = require('express')
const bodyParser = require('body-parser');

const readXlsxFile = require('read-excel-file/node')
const fs = require('fs')
const app = express()
const port = 9123
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data_path = './Book1.xlsx'

const data = []

function removeAccents(str) {
    return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

readXlsxFile(data_path).then((rows) => {
    for (const row of rows) {
        if (row.length > 0 && row[0] != null && row[1] != null) {
            data.push({
                'search': removeAccents(row[0]).toLowerCase() + ' ' + removeAccents(row[1]).toLowerCase(),
                'Address': row[0],
                'City': row[1],
                'Weather': row[2],
                'PandemicLevel': row[3],
                'RecommendedAccomodation': row[4],
                'OpenAt': row[5],
                'CloseAt': row[6],
                'Price': row[7],
                'Note': row[8],
                'Type': row[9]
            })
        }
    }
    data.push
});
app.get('/', (req, res) => {
    console.log(data[0].Address.normalize())
  res.send('Food API')
})


app.post('/search', (req, res) => {
    const searchWord = req.body.SearchWord.toLowerCase();
    const foundData = [];
    for (const d of data) {
        if (d.search.search(searchWord) != -1) {
            const f = { ...d };
            delete f.search;
            foundData.push(f);
        }
    }
    
    res.send(JSON.stringify(foundData))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})